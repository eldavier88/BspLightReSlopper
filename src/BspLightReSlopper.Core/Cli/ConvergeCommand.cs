using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Text;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.Heuristics;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.MapFile;
using BspLightReSlopper.Metrics;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using BspLightReSlopper.Tools;
using BspLightReSlopper.Util;
using BspLightReSlopper.Estimation;

namespace BspLightReSlopper.Cli
{
    /// <summary>
    /// SDK map round-trip: estimate from each reference <c>.bsp</c>, inject lights into the
    /// paired <c>.map</c>, recompile with heuristically inferred q3map2 settings, and score
    /// perceptual lightmap loss vs the reference. Emits <c>convergence.md</c>.
    ///
    /// <para>With <c>--iterate N</c>, each map goes through the
    /// <see cref="RecompileRefiner"/> loop for N cycles, driving MSE down by
    /// residual-aware per-light adjustment between compiles.</para>
    /// </summary>
    public static class ConvergeCommand
    {
        public static int Run(CliArgs args)
        {
            string assets = args.Require("assets");
            string q3map2 = args.Get("q3map2")
                ?? Environment.GetEnvironmentVariable("BSPLRS_Q3MAP2")
                ?? throw new ArgumentException("missing --q3map2 (or BSPLRS_Q3MAP2)");
            string basePath = args.Get("base-path")
                ?? Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS")
                ?? throw new ArgumentException("missing --base-path (fs_basepath for q3map2, or set BSPLRS_JK2_ASSETS)");

            string? resources = args.Get("resources") ?? Environment.GetEnvironmentVariable("BSPLRS_RESOURCES");
            string indexPath = args.Get("maps-index")
                ?? (resources != null ? Path.Combine(resources, "jk2-sdk-maps.txt") : "");
            if (string.IsNullOrEmpty(indexPath) || !File.Exists(indexPath))
                throw new FileNotFoundException("maps index not found; pass --maps-index <jk2-sdk-maps.txt> or set BSPLRS_RESOURCES after fetch-resources", indexPath);

            string outDir = args.Get("out") ?? Path.Combine(Directory.GetCurrentDirectory(), "convergence-out");
            Directory.CreateDirectory(outDir);

            int maxMaps = int.TryParse(args.Get("max-maps"), out int mm) ? mm : 200;
            int maxSamples = int.TryParse(args.Get("max-samples"), out int ms) ? ms : 80_000;
            int maxPivots = int.TryParse(args.Get("pivots"), out int mp) ? mp : 600;
            int maxLights = int.TryParse(args.Get("max-lights"), out int ml) ? ml : 64;
            int seed = int.TryParse(args.Get("seed"), out int sd) ? sd : 42;
            string game = args.Get("game") ?? "jk2";
            var timeout = TimeSpan.FromMinutes(int.TryParse(args.Get("timeout-mins"), out int tm) ? tm : 12);
            int iterate = int.TryParse(args.Get("iterate"), out int it) ? it : 0;
            float iterStep = float.TryParse(args.Get("iterate-step"), out float ist) ? ist : 48f;

            string? logPath = args.Get("log");
            using var log = new Logger(Console.Out, logPath);
            log.Section("converge");
            log.Info($"assets:     {assets}");
            log.Info($"base-path:  {basePath}");
            log.Info($"maps index: {indexPath}");
            log.Info($"q3map2:     {q3map2}");
            log.Info($"out:        {outDir}");

            var mapLines = File.ReadAllLines(indexPath)
                .Select(l => l.Trim())
                .Where(l => l.Length > 0 && l.EndsWith(".map", StringComparison.OrdinalIgnoreCase))
                .Take(maxMaps)
                .ToList();

            var wrapper = new Q3Map2Wrapper(q3map2, basePath, fsGame: "", gameToken: game);
            var sb = new StringBuilder();
            sb.AppendLine("# BspLightReSlopper convergence report");
            sb.AppendLine();
            sb.AppendLine("iterate passes: " + iterate + (iterate > 0 ? $" (recompile-refine enabled, step {iterStep:F0}u)" : " (single-shot)"));
            sb.AppendLine();
            sb.AppendLine("| map | est lights | iterated? | compile | MSE RGB | RMSE | pairs | unmatched cand | forward SSE | final lights |");
            sb.AppendLine("|---|---:|:-:|---|---:|---:|---:|---:|---:|---:|");

            int okMaps = 0, failMaps = 0;
            foreach (var mapPath in mapLines)
            {
                if (!File.Exists(mapPath))
                {
                    log.Warn("missing .map, skip: " + mapPath);
                    failMaps++;
                    continue;
                }

                string baseName = Path.GetFileNameWithoutExtension(mapPath);
                string bspPath = Path.Combine(assets, "maps", baseName + ".bsp");
                if (!File.Exists(bspPath))
                {
                    log.Warn($"no reference bsp for {baseName}, skip");
                    failMaps++;
                    continue;
                }

                log.Section("map: " + baseName);
                BspFile refBsp;
                try { refBsp = BspLoader.Load(bspPath); }
                catch (Exception ex)
                {
                    log.Warn("load ref bsp failed: " + ex.Message);
                    failMaps++;
                    continue;
                }

                try
                {
                    var collision = new BspCollision(refBsp);
                    var vis = new BspVis(refBsp);
                    var unpacked = SurfaceUnpacker.Unpack(refBsp);
                    var atlas = LightmapAtlas.FromBsp(refBsp);
                    var refSmp = TexelSampler.Sample(refBsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = maxSamples }, collision);
                    var vSmp = VertexLightSampler.Sample(refBsp, collision);
                    if (vSmp.Samples.Count > 0)
                    {
                        var merged = new List<TexelSample>(refSmp.Samples.Count + vSmp.Samples.Count);
                        merged.AddRange(refSmp.Samples);
                        merged.AddRange(vSmp.Samples);
                        refSmp = new TexelSampler.SampleResult { Samples = merged };
                    }

                    if (refSmp.Samples.Count == 0)
                    {
                        log.Warn("no samples");
                        failMaps++;
                        continue;
                    }

                    var infer = CompileSettingsInferer.Infer(refBsp, refSmp.Samples);
                    float envMult = infer.FastUsed
                        ? new LightEstimator.Options().EnvelopeMultiplierFast
                        : new LightEstimator.Options().EnvelopeMultiplierNoFast;
                    bool halfLambert = infer.LightAngleHl;

                    Vector3 bboxMin = new(float.PositiveInfinity), bboxMax = new(float.NegativeInfinity);
                    foreach (var s in refSmp.Samples)
                    {
                        bboxMin = Vector3.Min(bboxMin, s.World);
                        bboxMax = Vector3.Max(bboxMax, s.World);
                    }
                    if (refBsp.Models.Count > 0)
                    {
                        bboxMin = Vector3.Min(bboxMin, refBsp.Models[0].Mins);
                        bboxMax = Vector3.Max(bboxMax, refBsp.Models[0].Maxs);
                    }

                    var est = LightEstimator.Estimate(refSmp.Samples, bboxMin, bboxMax, new LightEstimator.Options
                    {
                        MaxLights = maxLights,
                        MaxPivotsPerRound = maxPivots,
                        RandomSeed = seed,
                        Collision = collision,
                        Visibility = vis,
                        HalfLambert = halfLambert,
                        EnvelopeMultiplier = envMult,
                    }, log);

                    // Establish the median-maps-to-300 q3 scale from the very first estimate
                    // and reuse it for every subsequent injection so the CandidateIntensity
                    // stays consistent across iterations.
                    float scale = 1f;
                    if (est.Lights.Count > 0)
                    {
                        var sorted = est.Lights.Select(l => l.Intensity).OrderBy(x => x).ToArray();
                        float med = sorted[sorted.Length / 2];
                        if (med > 1e-3f) scale = 300f / med;
                    }

                    // ----- Optional recompile-refine loop (Phase H4) -----
                    var finalLights = est.Lights.ToList();
                    float mse = 0, rmse = 0;
                    int pairs = 0, unmatched = 0;
                    string compileCell;

                    if (iterate > 0)
                    {
                        string mapWorkDir = Path.Combine(outDir, baseName + "_refine");
                        Directory.CreateDirectory(mapWorkDir);
                        var refineOpts = new RecompileRefiner.Options
                        {
                            ReferenceMapPath = mapPath,
                            WorkDir = mapWorkDir,
                            Wrapper = wrapper,
                            CompileSettings = ToCompileSettings(infer),
                            PerCompileTimeout = timeout,
                            MaxIterations = iterate,
                            InitialStep = iterStep,
                            HalfLambert = halfLambert,
                            Q3IntensityScale = scale,
                        };
                        var refine = RecompileRefiner.Refine(
                            refSmp.Samples,
                            est.Lights,
                            est.BlownMask,
                            bboxMin,
                            bboxMax,
                            refineOpts,
                            log);
                        finalLights = refine.Lights.ToList();
                        var lastOk = refine.Iterations.LastOrDefault(r => r.CompileSucceeded);
                        if (lastOk != null)
                        {
                            mse = refine.FinalMse;
                            rmse = MathF.Sqrt(mse);
                            pairs = lastOk.PairsUsed;
                            compileCell = $"iter{refine.Iterations.Count}";
                            okMaps++;
                        }
                        else
                        {
                            compileCell = "iter-fail";
                            failMaps++;
                        }
                    }
                    else
                    {
                        // Original single-shot path.
                        var defs = new List<LightDefinition>();
                        foreach (var L in est.Lights)
                        {
                            defs.Add(new LightDefinition
                            {
                                Origin = L.Origin,
                                Color = L.Color,
                                Q3LightIntensity = L.Intensity * scale,
                            });
                        }

                        var ws = new Dictionary<string, string>
                        {
                            ["_lightmapscale"] = infer.LightmapScale.ToString("0.###", CultureInfo.InvariantCulture),
                        };

                        var map = MapFileParser.ParseFile(mapPath);
                        MapLightMerger.ReplaceLights(map, defs, new MapLightMerger.Options { WorldspawnKeys = ws });
                        string workMap = Path.Combine(outDir, baseName + "_relit.map");
                        MapFileWriter.Write(workMap, map);

                        var compile = wrapper.Compile(workMap, ToCompileSettings(infer), timeout);
                        compileCell = compile.Succeeded ? "ok" : "fail";

                        if (compile.Succeeded)
                        {
                            var newBsp = BspLoader.Load(compile.BspPath);
                            var u2 = SurfaceUnpacker.Unpack(newBsp);
                            var a2 = LightmapAtlas.FromBsp(newBsp);
                            var col2 = new BspCollision(newBsp);
                            var candSmp = TexelSampler.Sample(newBsp, u2, a2, new TexelSampler.SampleOptions { MaxSamples = maxSamples }, col2);
                            var loss = PerceptualLossEvaluator.Evaluate(refSmp.Samples, candSmp.Samples);
                            mse = loss.MeanSquaredRgb;
                            rmse = loss.RootMeanSquaredRgb;
                            pairs = loss.PairsUsed;
                            unmatched = loss.UnmatchedCandidates;
                            okMaps++;
                        }
                        else
                        {
                            failMaps++;
                        }
                    }

                    float fwdSse = LightEstimator.ForwardRgbSSE(refSmp.Samples, finalLights, halfLambert, excludeMask: est.BlownMask);

                    // Also emit the final .ent for diagnostic inspection.
                    try
                    {
                        string entPath = Path.Combine(outDir, baseName + ".ent");
                        var guesses = finalLights.Select(L => new EntityIo.EntFileWriter.GuessedLight
                        {
                            Origin = L.Origin,
                            Color = L.Color,
                            Intensity = L.Intensity * scale,
                            Method = L.Method,
                            Confidence = L.Confidence,
                            SupportingTexels = L.SupportingTexels,
                            ResidualEnergyExplainedFraction = L.ResidualEnergyExplainedFraction,
                        }).ToList();
                        EntityIo.EntFileWriter.Write(entPath, guesses, new EntityIo.EntFileWriter.WriteOptions
                        {
                            SourceBspName = bspPath,
                            InferredCompile = infer.Display,
                            CountsByType = new Dictionary<string, int> { ["total"] = finalLights.Count },
                        });
                    }
                    catch (Exception entEx)
                    {
                        log.Warn("ent write failed: " + entEx.Message);
                    }

                    sb.AppendLine($"| {baseName} | {est.Lights.Count} | {(iterate > 0 ? "yes" : "no")} | {compileCell} | {mse:F6} | {rmse:F6} | {pairs} | {unmatched} | {fwdSse:F0} | {finalLights.Count} |");
                }
                catch (Exception ex)
                {
                    log.Warn("error: " + ex.Message);
                    sb.AppendLine($"| {baseName} | — | — | error | — | — | — | — | — | — |");
                    failMaps++;
                }
            }

            sb.AppendLine();
            sb.AppendLine($"Processed SDK maps (cap {maxMaps}): **{okMaps}** compiled+scored, **{failMaps}** skipped or failed.");
            sb.AppendLine();
            sb.AppendLine("**How to read this:** perceptual MSE RGB is mean squared error on linear RGB triplets after nearest-neighbour pairing in world space; lower is closer to the reference bake. Forward SSE is the estimator photometric fit vs reference texels (no recompile).");
            sb.AppendLine();
            sb.AppendLine("Glossary: see **docs/metrics.md** beside the repository README.");

            string mdPath = Path.Combine(outDir, "convergence.md");
            File.WriteAllText(mdPath, sb.ToString());
            log.Info($"wrote {mdPath}");
            return failMaps > 0 && okMaps == 0 ? 3 : 0;
        }

        private static Q3Map2Wrapper.CompileSettings ToCompileSettings(CompileSettingsInferer.Inference infer)
        {
            int bounceV = infer.BounceUsed ? 4 : 0;
            return new Q3Map2Wrapper.CompileSettings
            {
                KeepLights = true,
                MetaSurfaces = true,
                Bounce = bounceV > 0 ? bounceV : (int?)null,
                SampleSize = Math.Clamp((int)Math.Round(infer.SampleSize), 8, 128),
                Gamma = infer.Gamma,
                Compensate = 1.5f,
                Brightness = 1f,
                FastLight = infer.FastUsed,
                LightAngleHl = infer.LightAngleHl,
                Filter = true,
            };
        }
    }
}
