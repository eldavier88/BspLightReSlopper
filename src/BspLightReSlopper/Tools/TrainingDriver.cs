using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Text;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.EntityIo;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Heuristics;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.MapFile;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using BspLightReSlopper.Util;
using MapFileT = BspLightReSlopper.MapFile.MapFile;

namespace BspLightReSlopper.Tools
{
    /// <summary>
    /// Phase B training driver. Each round:
    /// <list type="number">
    ///   <item>Scatter random lights into a fresh copy of the source .map.</item>
    ///   <item>Sample a randomized compile-settings vector and run q3map2 (-bsp / -vis /
    ///         -light) on the scattered .map.</item>
    ///   <item>Assert the resulting BSP still has the lights we placed (per the Phase A
    ///         IsUsable rule — without this, q3map2 stripping would silently produce a
    ///         "0 truth → 0 est → 100% recall" success that's actually meaningless).</item>
    ///   <item>Run the estimator on the recompiled BSP.</item>
    ///   <item>Match estimated vs ground-truth lights, score, append a CSV row.</item>
    /// </list>
    /// </summary>
    public sealed class TrainingDriver
    {
        public sealed class Options
        {
            public string SourceMapPath { get; init; } = "";
            public string FsBasePath { get; init; } = "";
            public string FsGame { get; init; } = "";
            public string GameToken { get; init; } = "jk2";
            public string Q3Map2Exe { get; init; } = "";
            public string OutDir { get; init; } = "";
            public int Rounds { get; init; } = 8;
            public int RandomSeed { get; init; } = 42;
            public int LightsPerRound { get; init; } = 24;
            public float MatchTolerance { get; init; } = 256f;
            public TimeSpan PerStageTimeout { get; init; } = TimeSpan.FromMinutes(5);
            public int EstimatorMaxLights { get; init; } = 80;
            public int EstimatorPivots { get; init; } = 800;
            public bool KeepRoundArtifacts { get; init; } = true;
            /// <summary>If true, the per-round scatterer also stamps a random
            /// <c>_lightmapscale</c> from {0.5, 1, 2, 4} into worldspawn so the matrix
            /// covers multiple lightmap densities. Default true for the converge command.</summary>
            public bool RandomiseLightmapScale { get; init; } = true;
        }

        public sealed class RoundResult
        {
            public int Round { get; init; }
            public int Seed { get; init; }
            public Q3Map2Wrapper.CompileSettings Settings { get; init; } = new();
            public bool CompileSucceeded { get; init; }
            public string? FailureReason { get; init; }
            public int TruthLights { get; init; }
            public int EstimatedLights { get; init; }
            public int Matched { get; init; }
            public float Recall { get; init; }
            public float Precision { get; init; }
            public float PositionErrorMedian { get; init; }
            public float ColorErrorMean { get; init; }
            public TimeSpan CompileElapsed { get; init; }
            public TimeSpan EstimateElapsed { get; init; }
            public Dictionary<string, string> InferredCompile { get; init; } = new();
            /// <summary>The actual <c>_lightmapscale</c> stamped onto worldspawn for this
            /// round (NaN if not stamped). Echoed by <see cref="RandomLightScatterer.Result"/>.</summary>
            public float WorldspawnLightmapScale { get; init; } = float.NaN;
        }

        public sealed class Result
        {
            public IReadOnlyList<RoundResult> Rounds { get; init; } = Array.Empty<RoundResult>();
            public float MeanRecall { get; init; }
            public float MeanPrecision { get; init; }
            public float MeanPositionErrorMedian { get; init; }
            public int RoundsAttempted { get; init; }
            public int RoundsScored { get; init; }
            public TimeSpan TotalElapsed { get; init; }
        }

        public static Result Run(Options o, Logger log)
        {
            var sw = System.Diagnostics.Stopwatch.StartNew();
            if (!File.Exists(o.SourceMapPath)) throw new FileNotFoundException("source .map not found", o.SourceMapPath);
            if (!File.Exists(o.Q3Map2Exe)) throw new FileNotFoundException("q3map2.exe not found", o.Q3Map2Exe);
            if (!Directory.Exists(o.FsBasePath)) throw new DirectoryNotFoundException("fs_basepath: " + o.FsBasePath);
            Directory.CreateDirectory(o.OutDir);

            var sourceMapText = File.ReadAllText(o.SourceMapPath);
            var matrix = new CompileSettingsMatrix();
            var wrapper = new Q3Map2Wrapper(o.Q3Map2Exe, o.FsBasePath, o.FsGame, o.GameToken);
            var driverRng = new Random(o.RandomSeed);

            string csvPath = Path.Combine(o.OutDir, "train.csv");
            using var csv = new StreamWriter(csvPath, append: false);
            csv.NewLine = "\n";
            csv.WriteLine("round,seed,truth,est,matched,recall,precision,posErrMedian,colorErrMean," +
                          "compileSecs,estimateSecs,bounce,sampleSize,gamma,compensate,brightness," +
                          "fast,filter,deluxe,cheap,cheapGrid,lightAngleHl,lightmapScale," +
                          "inferGamma,inferOverbright,inferLightmapScale,inferSamplesize");

            var rounds = new List<RoundResult>();
            int succeeded = 0;
            for (int r = 1; r <= o.Rounds; r++)
            {
                int seed = driverRng.Next();
                string roundDir = Path.Combine(o.OutDir, $"round_{r:D3}");
                Directory.CreateDirectory(roundDir);
                string scatterMap = Path.Combine(roundDir, "scatter.map");
                File.WriteAllText(scatterMap, sourceMapText); // start from source

                log.Section($"round {r}/{o.Rounds} (seed={seed})");

                // ---- 1. Compile original first to get a BSP for the BSP-tree collision ----
                // We do a minimal -bsp -meta of the SOURCE .map to obtain a collision
                // structure for the scatter validation pass. Lights aren't relevant here.
                var sourceCompile = wrapper.Compile(scatterMap, new Q3Map2Wrapper.CompileSettings
                {
                    SkipVisStage = true,
                    SkipLightStage = true,
                    MetaSurfaces = true,
                }, o.PerStageTimeout);
                if (!sourceCompile.Succeeded)
                {
                    log.Error("source -bsp failed; aborting round");
                    var errStages = string.Join(',', sourceCompile.Stages.Select(s => $"{s.Stage}:{s.ExitCode}"));
                    log.Info("stage exits: " + errStages);
                    log.Info("command line: " + sourceCompile.Stages[0].CommandLine);
                    string lastStdout = sourceCompile.Stages[^1].Stdout;
                    string tail = lastStdout.Length > 800 ? lastStdout.Substring(lastStdout.Length - 800) : lastStdout;
                    log.Info("stdout tail:\n" + tail);
                    if (!string.IsNullOrEmpty(sourceCompile.Stages[^1].Stderr))
                        log.Info("stderr:\n" + sourceCompile.Stages[^1].Stderr);
                    DumpStageStdoutToFile(sourceCompile, Path.Combine(roundDir, "source-compile.log"));
                    rounds.Add(new RoundResult { Round = r, Seed = seed, FailureReason = "source -bsp failed: " + errStages });
                    continue;
                }
                BspFile sourceBsp;
                try { sourceBsp = BspLoader.Load(sourceCompile.BspPath); }
                catch (Exception ex)
                {
                    log.Error("could not load source bsp: " + ex.Message);
                    rounds.Add(new RoundResult { Round = r, Seed = seed, FailureReason = "load source bsp: " + ex.Message });
                    continue;
                }
                var collision = new BspCollision(sourceBsp);

                // ---- 2. Parse, scatter, write out the modified .map ----
                var map = MapFileParser.ParseFile(scatterMap);
                var scatterResult = RandomLightScatterer.Scatter(map, sourceBsp, collision, new RandomLightScatterer.Options
                {
                    LightCount = o.LightsPerRound,
                    RandomSeed = seed,
                    RandomiseLightmapScale = o.RandomiseLightmapScale,
                });
                MapFileWriter.Write(scatterMap, map);
                log.Info($"scatter: placed {scatterResult.Placed}/{o.LightsPerRound} (rejects: solid={scatterResult.RejectedSolid} outside={scatterResult.RejectedOutside} clearance={scatterResult.RejectedClearance})" +
                         (float.IsNaN(scatterResult.WorldspawnLightmapScale) ? "" : $" lmScale={scatterResult.WorldspawnLightmapScale:0.###}"));

                // ---- 3. Recompile with random settings ----
                var settings = matrix.Sample(new Random(seed));
                log.Info("compile settings: " + settings.FingerprintText);
                var compileSw = System.Diagnostics.Stopwatch.StartNew();
                var compile = wrapper.Compile(scatterMap, settings, o.PerStageTimeout);
                compileSw.Stop();
                if (!compile.Succeeded)
                {
                    log.Error("recompile failed: " + string.Join(',', compile.Stages.Select(s => $"{s.Stage}:{s.ExitCode}")));
                    DumpStageStdoutToFile(compile, Path.Combine(roundDir, "compile.log"));
                    rounds.Add(new RoundResult
                    {
                        Round = r,
                        Seed = seed,
                        Settings = settings,
                        CompileElapsed = compileSw.Elapsed,
                        FailureReason = "recompile: " + string.Join(',', compile.Stages.Select(s => $"{s.Stage}:{s.ExitCode}")),
                    });
                    continue;
                }
                DumpStageStdoutToFile(compile, Path.Combine(roundDir, "compile.log"));

                // ---- 4. Load BSP, ground-truth check ----
                BspFile bsp;
                try { bsp = BspLoader.Load(compile.BspPath); }
                catch (Exception ex)
                {
                    log.Error("could not load recompiled bsp: " + ex.Message);
                    rounds.Add(new RoundResult { Round = r, Seed = seed, Settings = settings, FailureReason = "load recompiled bsp: " + ex.Message });
                    continue;
                }
                var gt = GroundTruth.Extract(bsp.EntitiesText);
                if (!gt.IsUsable)
                {
                    log.Warn("recompiled BSP has no usable ground truth (q3map2 stripped lights despite -keeplights)");
                    rounds.Add(new RoundResult { Round = r, Seed = seed, Settings = settings, CompileElapsed = compileSw.Elapsed, CompileSucceeded = true, FailureReason = "no usable ground truth in recompiled bsp" });
                    continue;
                }

                // ---- 5. Estimate ----
                var unpacked = SurfaceUnpacker.Unpack(bsp);
                var atlas = LightmapAtlas.FromBsp(bsp);
                var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = 80_000 });
                Vector3 bboxMin = new(float.PositiveInfinity), bboxMax = new(float.NegativeInfinity);
                foreach (var s in samples.Samples) { bboxMin = Vector3.Min(bboxMin, s.World); bboxMax = Vector3.Max(bboxMax, s.World); }
                if (bsp.Models.Count > 0) { bboxMin = Vector3.Min(bboxMin, bsp.Models[0].Mins); bboxMax = Vector3.Max(bboxMax, bsp.Models[0].Maxs); }
                var estSw = System.Diagnostics.Stopwatch.StartNew();
                var infer = CompileSettingsInferer.Infer(bsp, samples.Samples);
                var estimate = LightEstimator.Estimate(samples.Samples, bboxMin, bboxMax, new LightEstimator.Options
                {
                    MaxLights = o.EstimatorMaxLights,
                    MaxPivotsPerRound = o.EstimatorPivots,
                    RandomSeed = seed,
                    HalfLambert = settings.LightAngleHl,
                    EnvelopeMultiplier = infer.FastUsed
                        ? new LightEstimator.Options().EnvelopeMultiplierFast
                        : new LightEstimator.Options().EnvelopeMultiplierNoFast,
                });
                estSw.Stop();

                // ---- 6. Match + score ----
                var match = GreedyMatcher.Match(
                    gt.Lights.Select(x => x.Origin).ToList(),
                    gt.Lights.Select(x => x.Color).ToList(),
                    estimate.Lights.Select(x => x.Origin).ToList(),
                    estimate.Lights.Select(x => x.Color).ToList(),
                    o.MatchTolerance);

                log.Info($"truth={gt.Lights.Count} est={estimate.Lights.Count} matched={match.Matches.Count} recall={match.Recall:P1} precision={match.Precision:P1} posErr={match.MedianPositionError:F0}u inferred={string.Join(' ', infer.Display.Select(kv => kv.Key + '=' + kv.Value))}");

                var rr = new RoundResult
                {
                    Round = r,
                    Seed = seed,
                    Settings = settings,
                    CompileSucceeded = true,
                    TruthLights = gt.Lights.Count,
                    EstimatedLights = estimate.Lights.Count,
                    Matched = match.Matches.Count,
                    Recall = match.Recall,
                    Precision = match.Precision,
                    PositionErrorMedian = match.MedianPositionError,
                    ColorErrorMean = match.Matches.Count > 0 ? match.Matches.Average(p => p.ColorDeltaE) : 0,
                    CompileElapsed = compileSw.Elapsed,
                    EstimateElapsed = estSw.Elapsed,
                    InferredCompile = new Dictionary<string, string>(infer.Display),
                    WorldspawnLightmapScale = scatterResult.WorldspawnLightmapScale,
                };
                rounds.Add(rr);
                AppendCsvRow(csv, rr);
                csv.Flush();
                succeeded++;

                // Save the .ent for this round so the user can inspect.
                EntFileWriter.Write(Path.Combine(roundDir, "estimate.ent"),
                    estimate.Lights.Select(l => new EntFileWriter.GuessedLight
                    {
                        Origin = l.Origin,
                        Color = l.Color,
                        Intensity = l.Intensity,
                        Method = l.Method,
                        Confidence = l.Confidence,
                        SupportingTexels = l.SupportingTexels,
                        ResidualEnergyExplainedFraction = l.ResidualEnergyExplainedFraction,
                    }).ToList(),
                    new EntFileWriter.WriteOptions
                    {
                        SourceBspName = compile.BspPath,
                        InferredCompile = rr.InferredCompile,
                        RuntimeSeconds = estimate.ElapsedSeconds.ToString("0.0") + "s",
                    });
            }

            sw.Stop();
            float meanR = rounds.Count > 0 ? rounds.Where(r => r.CompileSucceeded).DefaultIfEmpty(new RoundResult()).Average(r => r.Recall) : 0;
            float meanP = rounds.Count > 0 ? rounds.Where(r => r.CompileSucceeded).DefaultIfEmpty(new RoundResult()).Average(r => r.Precision) : 0;
            float meanPos = rounds.Count > 0 ? rounds.Where(r => r.CompileSucceeded && r.Matched > 0).Select(r => r.PositionErrorMedian).DefaultIfEmpty(0).Average() : 0;
            return new Result
            {
                Rounds = rounds,
                MeanRecall = meanR,
                MeanPrecision = meanP,
                MeanPositionErrorMedian = meanPos,
                RoundsAttempted = o.Rounds,
                RoundsScored = succeeded,
                TotalElapsed = sw.Elapsed,
            };
        }

        // ---- helpers ----

        private static void DumpStageStdoutToFile(Q3Map2Wrapper.CompileResult result, string path)
        {
            using var w = new StreamWriter(path, append: false);
            foreach (var s in result.Stages)
            {
                w.WriteLine("---- " + s.Stage + " (exit=" + s.ExitCode + ", " + s.Elapsed.TotalSeconds.ToString("0.0", CultureInfo.InvariantCulture) + "s) ----");
                w.WriteLine("$ " + s.CommandLine);
                w.Write(s.Stdout);
                if (!string.IsNullOrEmpty(s.Stderr))
                {
                    w.WriteLine();
                    w.WriteLine("---- stderr ----");
                    w.Write(s.Stderr);
                }
                w.WriteLine();
            }
        }

        private static void AppendCsvRow(StreamWriter csv, RoundResult r)
        {
            CultureInfo inv = CultureInfo.InvariantCulture;
            string s = string.Join(',',
                r.Round.ToString(inv),
                r.Seed.ToString(inv),
                r.TruthLights.ToString(inv),
                r.EstimatedLights.ToString(inv),
                r.Matched.ToString(inv),
                r.Recall.ToString("0.####", inv),
                r.Precision.ToString("0.####", inv),
                r.PositionErrorMedian.ToString("0.#", inv),
                r.ColorErrorMean.ToString("0.###", inv),
                r.CompileElapsed.TotalSeconds.ToString("0.#", inv),
                r.EstimateElapsed.TotalSeconds.ToString("0.#", inv),
                (r.Settings.Bounce ?? 0).ToString(inv),
                (r.Settings.SampleSize ?? 0).ToString(inv),
                (r.Settings.Gamma ?? 0).ToString("0.##", inv),
                (r.Settings.Compensate ?? 0).ToString("0.##", inv),
                (r.Settings.Brightness ?? 0).ToString("0.##", inv),
                r.Settings.FastLight ? "1" : "0",
                r.Settings.Filter ? "1" : "0",
                r.Settings.Deluxe ? "1" : "0",
                r.Settings.Cheap ? "1" : "0",
                r.Settings.CheapGrid ? "1" : "0",
                r.Settings.LightAngleHl ? "1" : "0",
                float.IsNaN(r.WorldspawnLightmapScale) ? "" : r.WorldspawnLightmapScale.ToString("0.###", inv),
                Csv(r.InferredCompile, "gamma"),
                Csv(r.InferredCompile, "overbrightBits"),
                Csv(r.InferredCompile, "lightmapScale"),
                Csv(r.InferredCompile, "samplesize"));
            csv.WriteLine(s);
        }

        private static string Csv(Dictionary<string, string> d, string k) => d.TryGetValue(k, out var v) ? v : "";
    }
}
