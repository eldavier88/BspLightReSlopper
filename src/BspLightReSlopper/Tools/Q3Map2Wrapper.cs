using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Text;

namespace BspLightReSlopper.Tools
{
    /// <summary>
    /// Subprocess wrapper around the netradiant-custom <c>q3map2.exe</c> compiler. Runs the
    /// three Q3 build stages — <c>-bsp</c>, <c>-vis</c>, <c>-light</c> — with a configurable
    /// settings matrix and captures stdout/stderr per stage so the training driver can
    /// score against varied compile configurations.
    ///
    /// <para>Stages are run sequentially because each rewrites the same <c>.bsp</c> in place.
    /// We refuse to run <c>-light</c> without first running <c>-bsp</c>; if the BSP already
    /// exists from a prior compile and you want to skip BSP, set <see cref="CompileSettings.SkipBspStage"/>.
    /// Same for <c>-vis</c>.</para>
    /// </summary>
    public sealed class Q3Map2Wrapper
    {
        public string ExePath { get; }
        public string FsBasePath { get; }
        public string FsGame { get; }
        public string GameToken { get; }

        /// <summary>
        /// </summary>
        /// <param name="exePath">Absolute path to <c>q3map2.exe</c>.</param>
        /// <param name="fsBasePath">Game asset root (will be passed as <c>-fs_basepath</c>).
        /// Inside this folder q3map2 expects a <c>base/</c> sub-folder with <c>.pk3</c>s.</param>
        /// <param name="fsGame">Optional <c>-fs_game</c> mod name. Empty for none.</param>
        /// <param name="gameToken">Game id passed to <c>-game</c>. Defaults to <c>jk2</c>.</param>
        public Q3Map2Wrapper(string exePath, string fsBasePath, string fsGame = "", string gameToken = "jk2")
        {
            if (!File.Exists(exePath)) throw new FileNotFoundException("q3map2.exe not found", exePath);
            if (!Directory.Exists(fsBasePath)) throw new DirectoryNotFoundException("fsBasePath does not exist: " + fsBasePath);
            ExePath = exePath; FsBasePath = fsBasePath; FsGame = fsGame; GameToken = gameToken;
        }

        public sealed class CompileSettings
        {
            // Stage gating
            public bool SkipBspStage { get; init; }
            public bool SkipVisStage { get; init; }
            public bool SkipLightStage { get; init; }

            // ---- -bsp stage knobs ----
            public bool MetaSurfaces { get; init; } = true;
            public int? PatchSubdivisions { get; init; }     // -subdivisions

            // ---- -vis stage knobs ----
            public bool FastVis { get; init; }               // -fast
            public bool Saveprt { get; init; }               // -saveprt
            /// <summary>If true (default), skip the vis stage (with a soft-success
            /// StageResult logged) when the .prt file is missing. q3map2 only writes a .prt
            /// when the compiled BSP has portals — trivial single-leaf maps don't, and
            /// trying to vis them produces a hard error. Real multi-room maps always have
            /// portals so this only kicks in on degenerate test cases.</summary>
            public bool SkipVisIfNoPrt { get; init; } = true;

            // ---- -light stage knobs (the training matrix lives here) ----
            public int? Bounce { get; init; }                // -bounce N
            public int? SampleSize { get; init; }            // -samplesize N
            public float? Gamma { get; init; }               // -gamma F
            public float? Compensate { get; init; }          // -compensate F
            public float? Brightness { get; init; }          // -brightness F
            public float? Contrast { get; init; }            // -contrast F (-255..255)
            public bool FastLight { get; init; }             // -fast
            public bool Filter { get; init; }                // -filter
            public bool Deluxe { get; init; }                // -deluxe
            public bool CheapGrid { get; init; }             // -cheapgrid
            public bool Cheap { get; init; }                 // -cheap
            public bool BounceOnly { get; init; }            // -bounceonly
            public bool BounceGrid { get; init; }            // -bouncegrid
            /// <summary>If true, pass <c>-keeplights</c> so q3map2 leaves the light entities
            /// intact in the compiled BSP. Required by the training pipeline so we can read
            /// back ground truth from the recompiled BSP.</summary>
            public bool KeepLights { get; init; }            // -keeplights
            /// <summary>If true, pass <c>-lightanglehl 1</c> to enable q3map2's half-Lambert
            /// angle attenuation (a "jal" addition; default off in JK2/JKA game profiles but
            /// available as an explicit flag). Used by the training matrix to give the
            /// estimator data baked under both Lambert and half-Lambert regimes.</summary>
            public bool LightAngleHl { get; init; }          // -lightanglehl 1
            public float? BounceColorRatio { get; init; }    // -bouncecolorratio F
            public float? BounceScale { get; init; }         // -bouncescale F
            public float? AreaScale { get; init; }           // -areascale F
            public float? PointScale { get; init; }          // -pointscale F
            public bool Border { get; init; }                // -border (debug)

            // Convenience: produce the training matrix's "fingerprint" string for logging.
            public string FingerprintText
            {
                get
                {
                    var sb = new StringBuilder();
                    if (Bounce.HasValue) sb.Append($" bounce={Bounce}");
                    if (SampleSize.HasValue) sb.Append($" sample={SampleSize}");
                    if (Gamma.HasValue) sb.Append($" gamma={Gamma:0.##}");
                    if (Compensate.HasValue) sb.Append($" comp={Compensate:0.##}");
                    if (Brightness.HasValue) sb.Append($" bright={Brightness:0.##}");
                    if (Contrast.HasValue) sb.Append($" contrast={Contrast:0}");
                    if (FastLight) sb.Append(" fast");
                    if (Filter) sb.Append(" filter");
                    if (Deluxe) sb.Append(" deluxe");
                    if (Cheap) sb.Append(" cheap");
                    if (CheapGrid) sb.Append(" cheapgrid");
                    if (LightAngleHl) sb.Append(" lightanglehl");
                    if (BounceOnly) sb.Append(" bounceonly");
                    if (BounceGrid) sb.Append(" bouncegrid");
                    if (BounceColorRatio.HasValue) sb.Append($" bcr={BounceColorRatio:0.##}");
                    if (BounceScale.HasValue) sb.Append($" bscale={BounceScale:0.##}");
                    if (AreaScale.HasValue) sb.Append($" areascale={AreaScale:0.##}");
                    if (PointScale.HasValue) sb.Append($" pointscale={PointScale:0.##}");
                    return sb.ToString().Trim();
                }
            }
        }

        public sealed class StageResult
        {
            public string Stage { get; init; } = "";
            public int ExitCode { get; init; }
            public string Stdout { get; init; } = "";
            public string Stderr { get; init; } = "";
            public TimeSpan Elapsed { get; init; }
            public string CommandLine { get; init; } = "";
            public bool Succeeded => ExitCode == 0;
        }

        public sealed class CompileResult
        {
            public string BspPath { get; init; } = "";
            public List<StageResult> Stages { get; init; } = new();
            public bool Succeeded
            {
                get
                {
                    foreach (var s in Stages) if (!s.Succeeded) return false;
                    return true;
                }
            }
            public TimeSpan TotalElapsed
            {
                get
                {
                    var t = TimeSpan.Zero;
                    foreach (var s in Stages) t += s.Elapsed;
                    return t;
                }
            }
        }

        public CompileResult Compile(string mapPath, CompileSettings settings, TimeSpan? perStageTimeout = null)
        {
            if (!File.Exists(mapPath)) throw new FileNotFoundException(mapPath);
            // q3map2 resolves the .map path against ITS working directory (we set that to
            // the q3map2 binary's folder), so any relative input path silently fails to
            // find the .map. Always pass an absolute path.
            mapPath = Path.GetFullPath(mapPath);
            string bspPath = Path.ChangeExtension(mapPath, ".bsp");
            var result = new CompileResult { BspPath = bspPath };

            if (!settings.SkipBspStage)
            {
                var args = new List<string> { "-bsp" };
                if (settings.MetaSurfaces) args.Add("-meta");
                if (settings.PatchSubdivisions.HasValue)
                { args.Add("-subdivisions"); args.Add(F(settings.PatchSubdivisions.Value)); }
                // -keeplights is a -bsp stage flag (writebsp.cpp uses it to set a
                // _keepLights worldspawn key that downstream -vis/-light stages then read).
                // Passing it only to -light is a no-op; the lights are stripped during -bsp.
                if (settings.KeepLights) args.Add("-keeplights");
                AppendCommonArgs(args);
                args.Add(mapPath);
                result.Stages.Add(RunStage("bsp", args, perStageTimeout));
                if (!result.Stages[^1].Succeeded) return result;
            }

            if (!settings.SkipVisStage)
            {
                string prtPath = Path.ChangeExtension(mapPath, ".prt");
                if (settings.SkipVisIfNoPrt && !File.Exists(prtPath))
                {
                    result.Stages.Add(new StageResult
                    {
                        Stage = "vis",
                        ExitCode = 0,
                        Stdout = "[bsplrs] skipped: no .prt file (BSP had no portals)",
                        Elapsed = TimeSpan.Zero,
                        CommandLine = "(skipped)",
                    });
                }
                else
                {
                    var args = new List<string> { "-vis" };
                    if (settings.FastVis) args.Add("-fast");
                    if (settings.Saveprt) args.Add("-saveprt");
                    AppendCommonArgs(args);
                    args.Add(mapPath);
                    result.Stages.Add(RunStage("vis", args, perStageTimeout));
                    if (!result.Stages[^1].Succeeded) return result;
                }
            }

            if (!settings.SkipLightStage)
            {
                var args = new List<string> { "-light" };
                if (settings.Bounce.HasValue) { args.Add("-bounce"); args.Add(F(settings.Bounce.Value)); }
                if (settings.SampleSize.HasValue) { args.Add("-samplesize"); args.Add(F(settings.SampleSize.Value)); }
                if (settings.Gamma.HasValue) { args.Add("-gamma"); args.Add(F(settings.Gamma.Value)); }
                if (settings.Compensate.HasValue) { args.Add("-compensate"); args.Add(F(settings.Compensate.Value)); }
                if (settings.Brightness.HasValue) { args.Add("-brightness"); args.Add(F(settings.Brightness.Value)); }
                if (settings.Contrast.HasValue) { args.Add("-contrast"); args.Add(F(settings.Contrast.Value)); }
                if (settings.FastLight) args.Add("-fast");
                if (settings.Filter) args.Add("-filter");
                if (settings.Deluxe) args.Add("-deluxe");
                if (settings.CheapGrid) args.Add("-cheapgrid");
                if (settings.Cheap) args.Add("-cheap");
                if (settings.LightAngleHl) { args.Add("-lightanglehl"); args.Add("1"); }
                if (settings.BounceOnly) args.Add("-bounceonly");
                if (settings.BounceGrid) args.Add("-bouncegrid");
                // KeepLights goes on the -bsp stage (see comment there). It's redundant on
                // -light but doesn't hurt; we omit to keep the cmdline clean.
                if (settings.BounceColorRatio.HasValue) { args.Add("-bouncecolorratio"); args.Add(F(settings.BounceColorRatio.Value)); }
                if (settings.BounceScale.HasValue) { args.Add("-bouncescale"); args.Add(F(settings.BounceScale.Value)); }
                if (settings.AreaScale.HasValue) { args.Add("-areascale"); args.Add(F(settings.AreaScale.Value)); }
                if (settings.PointScale.HasValue) { args.Add("-pointscale"); args.Add(F(settings.PointScale.Value)); }
                if (settings.Border) args.Add("-border");
                AppendCommonArgs(args);
                args.Add(mapPath);
                result.Stages.Add(RunStage("light", args, perStageTimeout));
            }

            return result;
        }

        // ---- helpers ----

        private void AppendCommonArgs(List<string> args)
        {
            args.Add("-game"); args.Add(GameToken);
            args.Add("-fs_basepath"); args.Add(FsBasePath);
            if (!string.IsNullOrEmpty(FsGame))
            { args.Add("-fs_game"); args.Add(FsGame); }
        }

        private StageResult RunStage(string stage, List<string> args, TimeSpan? timeout)
        {
            var sw = Stopwatch.StartNew();
            var psi = new ProcessStartInfo
            {
                FileName = ExePath,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true,
                WorkingDirectory = Path.GetDirectoryName(ExePath) ?? Environment.CurrentDirectory,
            };
            foreach (var a in args) psi.ArgumentList.Add(a);
            string commandLine = ExePath + " " + Quote(args);

            using var proc = Process.Start(psi)!;
            var stdoutSb = new StringBuilder();
            var stderrSb = new StringBuilder();
            proc.OutputDataReceived += (_, e) => { if (e.Data != null) stdoutSb.AppendLine(e.Data); };
            proc.ErrorDataReceived += (_, e) => { if (e.Data != null) stderrSb.AppendLine(e.Data); };
            proc.BeginOutputReadLine();
            proc.BeginErrorReadLine();

            int exit;
            if (timeout.HasValue)
            {
                if (!proc.WaitForExit((int)timeout.Value.TotalMilliseconds))
                {
                    try { proc.Kill(entireProcessTree: true); } catch { /* swallow */ }
                    proc.WaitForExit();
                    exit = -1;
                    stderrSb.AppendLine($"[bsplrs] TIMEOUT after {timeout.Value.TotalSeconds:F0}s");
                }
                else exit = proc.ExitCode;
            }
            else
            {
                proc.WaitForExit();
                exit = proc.ExitCode;
            }
            sw.Stop();

            return new StageResult
            {
                Stage = stage,
                ExitCode = exit,
                Stdout = stdoutSb.ToString(),
                Stderr = stderrSb.ToString(),
                Elapsed = sw.Elapsed,
                CommandLine = commandLine,
            };
        }

        private static string F(int v) => v.ToString(CultureInfo.InvariantCulture);
        private static string F(float v) => v.ToString("0.######", CultureInfo.InvariantCulture);

        private static string Quote(IReadOnlyList<string> args)
        {
            var sb = new StringBuilder();
            for (int i = 0; i < args.Count; i++)
            {
                if (i > 0) sb.Append(' ');
                string a = args[i];
                if (a.Contains(' ')) { sb.Append('"').Append(a).Append('"'); }
                else sb.Append(a);
            }
            return sb.ToString();
        }
    }

    /// <summary>
    /// Generates randomized but realistic <see cref="Q3Map2Wrapper.CompileSettings"/> for the
    /// training loop. Each draw varies only the knobs that meaningfully affect the lightmap;
    /// stage skips and debug-only flags are omitted.
    /// </summary>
    public sealed class CompileSettingsMatrix
    {
        public Q3Map2Wrapper.CompileSettings Sample(Random rng)
        {
            float gamma = SampleGamma(rng);
            int bounce = SampleBounce(rng);
            int sample = SampleSampleSize(rng);
            float compensate = (float)(1.0 + rng.NextDouble() * 2.5);     // 1..3.5
            float brightness = (float)(0.5 + rng.NextDouble() * 1.5);     // 0.5..2.0
            return new Q3Map2Wrapper.CompileSettings
            {
                Bounce = bounce > 0 ? bounce : (int?)null,
                SampleSize = sample,
                Gamma = gamma,
                Compensate = compensate,
                Brightness = brightness,
                KeepLights = true, // training pipeline always needs ground truth back

                Filter = rng.NextDouble() < 0.5,
                // FastLight bumped 25% -> 50% so the matrix really exercises both regimes
                // (the photometric envelope changes shape under -fast and the estimator needs
                // to see plenty of both kinds in training). See Phase D3 / E4 / E7.
                FastLight = rng.NextDouble() < 0.50,
                // -lightanglehl 1 enables the q3map2 half-Lambert curve (jal addition,
                // post-2002). Drawn with low probability so the dataset stays
                // dominated by the standard-Lambert regime that JK2/JKA actually shipped,
                // but the estimator gets non-zero exposure so the half-Lambert code path
                // (LightEstimator.Options.HalfLambert) is regression-tested in real training.
                LightAngleHl = rng.NextDouble() < 0.15,
                // -cheap aborts vertex light calc once a luxel saturates; speeds compile,
                // mildly distorts the lightmap. -cheapgrid is its grid-only sibling.
                Cheap = rng.NextDouble() < 0.10,
                CheapGrid = rng.NextDouble() < 0.15,
                // -deluxe writes deluxemap data; harmless to our estimator, exercises a
                // different q3map2 code path that occasionally affects lightmap layout.
                Deluxe = rng.NextDouble() < 0.15,
                BounceColorRatio = (float)rng.NextDouble(),
                BounceScale = bounce > 0 ? (float?)(0.5 + rng.NextDouble() * 1.5) : null,
                AreaScale = (float)(0.75 + rng.NextDouble() * 0.5),
                PointScale = (float)(0.75 + rng.NextDouble() * 0.5),
            };
        }

        // Discrete-ish samplers so the training matrix concentrates on values that were
        // actually used in shipping JK2 maps, not arbitrary continuous noise.
        private static float SampleGamma(Random rng)
        {
            float[] choices = { 1.0f, 1.0f, 1.5f, 1.5f, 2.0f, 2.2f };
            return choices[rng.Next(choices.Length)];
        }
        private static int SampleBounce(Random rng)
        {
            int[] choices = { 0, 0, 1, 2, 4, 8 };
            return choices[rng.Next(choices.Length)];
        }
        private static int SampleSampleSize(Random rng)
        {
            int[] choices = { 16, 16, 32, 32, 64 };
            return choices[rng.Next(choices.Length)];
        }
    }
}
