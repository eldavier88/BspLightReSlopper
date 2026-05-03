using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.EntityIo;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Heuristics;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Pk3;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Cli
{
    public static class EstimateCommand
    {
        public static int Run(CliArgs args)
        {
            string? assetsArg = args.Get("assets");
            string bspArg = args.Require("bsp");
            string? outPath = args.Get("o") ?? args.Get("out");
            string? logPath = args.Get("log");
            int maxSamples = int.TryParse(args.Get("max-samples"), out int ms) ? ms : 200_000;
            int maxPivots = int.TryParse(args.Get("pivots"), out int cs) ? cs : 800;
            int seed = int.TryParse(args.Get("seed"), out int s) ? s : 42;

            string defaultBaseName = MakeBaseName(bspArg);
            outPath ??= defaultBaseName + ".ent";
            logPath ??= defaultBaseName + ".log";

            using var log = new Logger(Console.Out, logPath);
            log.Section("estimate");
            log.Info($"bsp:    {bspArg}");
            log.Info($"assets: {assetsArg ?? "(none)"}");
            log.Info($"out:    {outPath}");
            log.Info($"log:    {logPath}");

            // ----- Resolve + load -----
            using Pk3Stack? stack = !string.IsNullOrEmpty(assetsArg) && Directory.Exists(assetsArg)
                ? new Pk3Stack(assetsArg) : null;
            var resolved = BspInputResolver.Resolve(bspArg, stack);
            log.Info($"resolved: {resolved.DisplayName} ({resolved.Bytes.Length} bytes)");
            var bsp = BspLoader.LoadFromBytes(resolved.Bytes);
            log.Info($"format:  {bsp.Format.DisplayName}");
            log.Info($"surfaces: {bsp.Surfaces.Count}, drawverts: {bsp.DrawVerts.Count}, lightmap atlases: {bsp.LightmapAtlasCount}");

            // ----- Auto-detect heuristics (no flags needed) -----
            log.Section("auto-detect");
            var roomDetect = RoomDetector.Detect(bsp);
            int autoMaxLights = roomDetect.Rooms.Count > 0
                ? roomDetect.Rooms.Sum(r => Math.Min(r.SuggestedLightCount, 32))
                : 64;
            int maxLights = int.TryParse(args.Get("max-lights"), out int ml) ? ml : autoMaxLights;
            log.Info($"rooms detected: {roomDetect.Rooms.Count} ({roomDetect.LeafCount} leafs, {roomDetect.UnassignedLeafCount} unassigned)");
            log.Info($"room-based max-lights: {autoMaxLights} (override with --max-lights)");

            // ----- Surface unpack -----
            log.Section("surface unpack");
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            log.Info($"planar={unpacked.Planar} triSoup={unpacked.TriangleSoup} patch(tess)={unpacked.PatchTessellated} patch(skipped)={unpacked.PatchSkipped} sky(skipped)={unpacked.SkySkipped} noDraw={unpacked.NoDrawSkipped} noLightmap={unpacked.NoLightmapSkipped} other={unpacked.OtherSkipped}");
            log.Info($"triangles emitted: {unpacked.TrianglesEmitted}");

            // ----- Build collision + PVS for visibility-aware estimation -----
            var collision = new BspCollision(bsp);
            var vis = new BspVis(bsp);
            log.Info($"vis: {(vis.HasVis ? $"{vis.NumClusters} clusters / {vis.BytesPerCluster} bytes-per-cluster" : "absent (no -vis stage or single-leaf map; estimator falls back to non-visibility mode)")}");

            // ----- Sample texels (lightmap-lit surfaces) -----
            log.Section("texel sampling");
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = maxSamples }, collision);

            // ----- Sample vertex-lit surfaces (E3) -----
            // Surfaces with no lightmap path carry their lighting in per-vertex RGB. Without
            // this pass JK2 vertex-lit surfaces (pit.bsp's central crater, much of doom_*)
            // don't contribute any signal to the estimator.
            var vertexSamples = VertexLightSampler.Sample(bsp, collision);
            log.Info($"vertex-lit surfaces: {vertexSamples.VertexLitSurfaces} ({vertexSamples.VertexLitSurfacesWithoutColor} with no vertex color), emitted {vertexSamples.Samples.Count} extra samples");
            if (vertexSamples.Samples.Count > 0)
            {
                var merged = new System.Collections.Generic.List<TexelSample>(samples.Samples.Count + vertexSamples.Samples.Count);
                merged.AddRange(samples.Samples);
                merged.AddRange(vertexSamples.Samples);
                samples = new TexelSampler.SampleResult
                {
                    Samples = merged,
                    LitTexelsConsidered = samples.LitTexelsConsidered + vertexSamples.Samples.Count,
                    UnlitSkipped = samples.UnlitSkipped,
                    OutOfTriangleSamples = samples.OutOfTriangleSamples,
                    StagesProcessed = samples.StagesProcessed + vertexSamples.StagesProcessed,
                    SurfacesSampled = samples.SurfacesSampled + vertexSamples.VertexLitSurfaces,
                };
            }
            log.Info($"considered: {samples.LitTexelsConsidered}, samples: {samples.Samples.Count}, unlit-skipped: {samples.UnlitSkipped}, outside-tris: {samples.OutOfTriangleSamples}");
            log.Info($"surfaces sampled: {samples.SurfacesSampled}, stages processed: {samples.StagesProcessed}");
            if (samples.Samples.Count == 0)
            {
                log.Error("no usable texel samples; cannot estimate");
                return 2;
            }

            // ----- Compile-settings heuristics (logged only) -----
            log.Section("compile settings (heuristic)");
            var infer = CompileSettingsInferer.Infer(bsp, samples.Samples);
            foreach (var kv in infer.Display)
                log.Info($"  {kv.Key} = {kv.Value}");

            // ----- Bbox of lit texels (with fallback to model[0]) -----
            Vector3 bboxMin = new(float.PositiveInfinity);
            Vector3 bboxMax = new(float.NegativeInfinity);
            foreach (var smp in samples.Samples)
            {
                bboxMin = Vector3.Min(bboxMin, smp.World);
                bboxMax = Vector3.Max(bboxMax, smp.World);
            }
            if (bsp.Models.Count > 0)
            {
                bboxMin = Vector3.Min(bboxMin, bsp.Models[0].Mins);
                bboxMax = Vector3.Max(bboxMax, bsp.Models[0].Maxs);
            }
            log.Info($"sample bbox: ({bboxMin.X:F0},{bboxMin.Y:F0},{bboxMin.Z:F0}) -> ({bboxMax.X:F0},{bboxMax.Y:F0},{bboxMax.Z:F0})");

            // ----- Estimate -----
            log.Section("estimator");
            bool noVis = args.Flag("no-vis");
            // Smart default: half-Lambert is auto-detected from CompileSettingsInferer.
            // Users can force on/off with --half-lambert / --no-half-lambert. The legacy
            // --infer-angle-model flag remains accepted (no-op; behaviour is now default).
            bool halfLambert = args.FlagOrDefault("half-lambert", "no-half-lambert", infer.LightAngleHl);
            log.Info($"  half-Lambert: {(halfLambert ? "on" : "off")} (inferred {infer.LightAngleHl}; override with --half-lambert / --no-half-lambert)");
            float envMult = infer.FastUsed
                ? new LightEstimator.Options().EnvelopeMultiplierFast
                : new LightEstimator.Options().EnvelopeMultiplierNoFast;

            var result = LightEstimator.Estimate(samples.Samples, bboxMin, bboxMax, new LightEstimator.Options
            {
                MaxPivotsPerRound = maxPivots,
                MaxLights = maxLights,
                RandomSeed = seed,
                Collision = noVis ? null : collision,
                Visibility = noVis ? null : vis,
                HalfLambert = halfLambert,
                EnvelopeMultiplier = envMult,
                RoomPrior = roomDetect,
                JointRefitL1Penalty = args.FlagOrDefault("disambiguate-overlap", "no-disambiguate-overlap", true) ? 0.0f : 0.0f,
            }, log);
            log.Info($"accepted: {result.RoundsAccepted}, rejected: {result.RoundsRejected}");
            log.Info($"rounds: {result.RoundsRun}, initial-energy: {result.InitialEnergy:F2}, final-residual: {result.FinalResidualEnergy:F2}, elapsed: {result.ElapsedSeconds:F1}s");

            // ----- Bounce light suppression (before classification / .ent) -----
            // ----- Bounce suppression (works with or without assets) -----
            if (!args.Flag("no-bounce-suppress"))
            {
                try
                {
                    log.Section("bounce suppression");
                    BspLightReSlopper.Shaders.AlbedoCache? albedoCache = null;
                    if (stack != null)
                    {
                        var shaders = BspLightReSlopper.Shaders.ShaderParser.ParseAllInPk3Stack(stack);
                        log.Info($"shaders parsed: {shaders.Count}");
                        albedoCache = new BspLightReSlopper.Shaders.AlbedoCache(stack, shaders);
                        var (h, m) = albedoCache.Stats();
                        log.Info($"albedo cache: {h} hits / {m} misses");
                    }
                    else
                    {
                        log.Info("no asset directory — bounce suppression will use the shader-name albedo heuristic (less reliable than --assets, but still drops obvious bounce-fit false positives)");
                    }
                    var bsOpts = new BspLightReSlopper.Estimation.BounceSuppressor.Options { RoomPrior = roomDetect };
                    var bsResult = BspLightReSlopper.Estimation.BounceSuppressor.Filter(result.Lights, samples.Samples, bsp, albedoCache, halfLambert, options: bsOpts, log: log);
                    result = new LightEstimator.Result
                    {
                        Lights = bsResult.KeptLights,
                        InitialEnergy = result.InitialEnergy,
                        FinalResidualEnergy = result.FinalResidualEnergy,
                        RoundsRun = result.RoundsRun,
                        RoundsAccepted = result.RoundsAccepted,
                        RoundsRejected = result.RoundsRejected,
                        ElapsedSeconds = result.ElapsedSeconds,
                        BlownMask = result.BlownMask,
                    };
                }
                catch (Exception ex)
                {
                    log.Warn($"bounce suppression failed: {ex.Message}");
                }
            }

            // Smart default: minimize-lights is on. Override with --no-minimize-lights.
            // Legacy --minimize-lights flag still accepted (it's now a no-op since the
            // behaviour is the default).
            if (args.FlagOrDefault("minimize-lights", "no-minimize-lights", true))
            {
                float tol = float.TryParse(args.Get("minimize-lights-tolerance"), out float t) ? t : 0.02f;
                var minimized = LightEstimator.MinimizeLightCountGreedy(result.Lights, samples.Samples, halfLambert, 32f, tol, log, excludeMask: result.BlownMask);
                result = new LightEstimator.Result
                {
                    Lights = minimized,
                    InitialEnergy = result.InitialEnergy,
                    FinalResidualEnergy = result.FinalResidualEnergy,
                    RoundsRun = result.RoundsRun,
                    RoundsAccepted = result.RoundsAccepted,
                    RoundsRejected = result.RoundsRejected,
                    ElapsedSeconds = result.ElapsedSeconds,
                    BlownMask = result.BlownMask,
                };
            }

            // Smart default: photometric refine is on. Override with --no-refine-lights.
            // Legacy --refine-lights flag still accepted (no-op when default-on).
            if (args.FlagOrDefault("refine-lights", "no-refine-lights", true))
            {
                var rOpts = new BspLightReSlopper.Metrics.PerceptualRefiner.Options
                {
                    Passes = int.TryParse(args.Get("refine-passes"), out int rp) ? rp : 3,
                    StepStart = float.TryParse(args.Get("refine-step"), out float rs) ? rs : 32f,
                };
                log.Section("photometric refine (forward SSE)");
                var rf = BspLightReSlopper.Metrics.PerceptualRefiner.RefineRgb(samples.Samples, result.Lights, halfLambert, 32f, rOpts, excludeMask: result.BlownMask);
                log.Info($"forward SSE: {rf.InitialSse:F1} -> {rf.FinalSse:F1}");
                result = new LightEstimator.Result
                {
                    Lights = new List<EstimatedLight>(rf.Lights),
                    InitialEnergy = result.InitialEnergy,
                    FinalResidualEnergy = result.FinalResidualEnergy,
                    RoundsRun = result.RoundsRun,
                    RoundsAccepted = result.RoundsAccepted,
                    RoundsRejected = result.RoundsRejected,
                    ElapsedSeconds = result.ElapsedSeconds,
                    BlownMask = result.BlownMask,
                };
            }

            // ----- Phase H4: optional DEV-VALIDATE loop (internal use only).
            // This is a developer-only recompile-validation tool used to refine the
            // algorithm itself. Normal workflow does NOT require q3map2 or recompilation.
            int devValidate = int.TryParse(args.Get("dev-validate"), out int dvv) ? dvv : 0;
            if (devValidate > 0)
            {
                string? q3map2 = args.Get("q3map2") ?? Environment.GetEnvironmentVariable("BSPLRS_Q3MAP2");
                string? basePath = args.Get("base-path") ?? Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
                string? mapPath = args.Get("map");
                if (string.IsNullOrEmpty(q3map2) || string.IsNullOrEmpty(basePath) || string.IsNullOrEmpty(mapPath))
                {
                    log.Warn("dev-validate: skipped (needs --q3map2, --base-path, --map). Running photometric-only refine instead.");
                }
                else
                {
                    log.Section($"dev-validate recompile loop ({devValidate} iterations)");
                    string game = args.Get("game") ?? "jk2";
                    var wrapper = new BspLightReSlopper.Tools.Q3Map2Wrapper(q3map2!, basePath!, fsGame: "", gameToken: game);
                    string workRoot = Path.Combine(Path.GetDirectoryName(outPath) ?? ".", Path.GetFileNameWithoutExtension(outPath) + "_refine");
                    var refineOpts = new BspLightReSlopper.Metrics.RecompileRefiner.Options
                    {
                        ReferenceMapPath = mapPath,
                        WorkDir = workRoot,
                        Wrapper = wrapper,
                        CompileSettings = new BspLightReSlopper.Tools.Q3Map2Wrapper.CompileSettings
                        {
                            KeepLights = true,
                            MetaSurfaces = true,
                            Bounce = infer.BounceUsed ? 4 : (int?)null,
                            SampleSize = Math.Clamp((int)Math.Round(infer.SampleSize), 8, 128),
                            Gamma = infer.Gamma,
                            Compensate = 1.5f,
                            Brightness = 1f,
                            FastLight = infer.FastUsed,
                            LightAngleHl = infer.LightAngleHl,
                            Filter = true,
                        },
                        PerCompileTimeout = TimeSpan.FromMinutes(int.TryParse(args.Get("refine-timeout-mins"), out int rtm) ? rtm : 10),
                        MaxIterations = devValidate,
                        InitialStep = float.TryParse(args.Get("refine-step"), out float rss) ? rss : 48f,
                        HalfLambert = halfLambert,
                    };
                    var refine = BspLightReSlopper.Metrics.RecompileRefiner.Refine(
                        samples.Samples, result.Lights, result.BlownMask, bboxMin, bboxMax, refineOpts, log);
                    log.Info($"dev-validate: MSE {refine.InitialMse:F6} -> {refine.FinalMse:F6} over {refine.Iterations.Count} iteration(s); best iter={refine.BestIteration}; final lights={refine.Lights.Count}");
                    result = new LightEstimator.Result
                    {
                        Lights = new List<EstimatedLight>(refine.Lights),
                        InitialEnergy = result.InitialEnergy,
                        FinalResidualEnergy = result.FinalResidualEnergy,
                        RoundsRun = result.RoundsRun,
                        RoundsAccepted = result.RoundsAccepted,
                        RoundsRejected = result.RoundsRejected,
                        ElapsedSeconds = result.ElapsedSeconds,
                        BlownMask = result.BlownMask,
                    };
                }
            }

            // ----- Write .ent -----
            log.Section("output");
            // Convert estimator-internal fit intensities to q3 `light` key values.
            // Default mode = Median (300/median_internal), empirically validated against
            // JK2 base maps. Physics mode inverts q3map2's gamma/overbright/lmscale
            // write path; enable with --calibration physics. IntensityCalibrator logs
            // both scales and warns on significant divergence.
            var calMode = ParseCalibrationMode(args.Get("calibration"));
            var calibration = BspLightReSlopper.Estimation.IntensityCalibrator.Calibrate(
                result.Lights, infer, calMode, log: log);
            float scaleToQ3 = calibration.Scale;
            // Classify each light's type (point/spot/linear). For spots we emit a
            // companion info_null target entity; the type-classifier is skipped for
            // blowout-seeded lights (already correct as point/spot from blow-out shape).
            bool noClassify = args.Flag("no-classify");
            var guesses = new List<EntFileWriter.GuessedLight>();
            int spotIdx = 0;
            int pointCount = 0, spotCount = 0, linearCount = 0;
            foreach (var l in result.Lights)
            {
                var g = new EntFileWriter.GuessedLight
                {
                    Origin = l.Origin,
                    Color = l.Color,
                    Intensity = l.Intensity * scaleToQ3,
                    Method = l.Method,
                    Confidence = l.Confidence,
                    SupportingTexels = l.SupportingTexels,
                    ResidualEnergyExplainedFraction = l.ResidualEnergyExplainedFraction,
                };
                // Classify ALL lights, including blowout seeds. Blowout-seeded lights
                // overwhelmingly classify as Point (their shape doesn't distinguish from a
                // round-bright cluster), but we still want the classifier to run so the
                // type counts in the .ent header are accurate.
                if (!noClassify)
                {
                    var cls = BspLightReSlopper.Estimation.LightTypeClassifier.Classify(l, samples.Samples, halfLambert);
                    switch (cls.Type)
                    {
                        case BspLightReSlopper.Estimation.LightTypeClassifier.Kind.Linear:
                            g = new EntFileWriter.GuessedLight
                            {
                                Origin = g.Origin, Color = g.Color, Intensity = g.Intensity,
                                Method = g.Method + "+linear",
                                Confidence = g.Confidence, SupportingTexels = g.SupportingTexels,
                                ResidualEnergyExplainedFraction = g.ResidualEnergyExplainedFraction,
                                SpawnFlags = 1,
                            };
                            linearCount++;
                            break;
                        case BspLightReSlopper.Estimation.LightTypeClassifier.Kind.Spot:
                            string targetName = "bsplrs_spot_" + spotIdx; spotIdx++;
                            Vector3 targetPos = l.Origin + cls.SpotDirection * 256f;
                            g = new EntFileWriter.GuessedLight
                            {
                                Origin = g.Origin, Color = g.Color, Intensity = g.Intensity,
                                Method = g.Method + "+spot",
                                Confidence = g.Confidence, SupportingTexels = g.SupportingTexels,
                                ResidualEnergyExplainedFraction = g.ResidualEnergyExplainedFraction,
                                Target = targetName,
                                ExtraDebugKeys = new Dictionary<string, string>
                                {
                                    ["_spotConeHalfAngleDeg"] = cls.SpotHalfAngleDegrees.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture),
                                },
                            };
                            spotCount++;
                            // Companion info_null target -- emitted as a synthetic light
                            // entry with a special classname so EntFileWriter can format it.
                            guesses.Add(g);
                            guesses.Add(new EntFileWriter.GuessedLight
                            {
                                Origin = targetPos,
                                Color = Vector3.One, Intensity = 0,
                                ClassName = "info_null",
                                TargetName = targetName,
                                Method = "spot-target",
                            });
                            continue;
                        default:
                            pointCount++;
                            break;
                    }
                }
                guesses.Add(g);
            }
            log.Info($"types: point={pointCount}, linear={linearCount}, spot={spotCount}");

            // ----- Sun detection (E5) -----
            var worldspawnKeys = new Dictionary<string, string>();
            if (!args.Flag("no-sun"))
            {
                var sunResult = BspLightReSlopper.Estimation.SunDetector.Detect(samples.Samples, bsp, log: log);
                if (sunResult.DetectedSun != null)
                {
                    var sun = sunResult.DetectedSun;
                    log.Info($"sun: dir=({sun.Direction.X:F2},{sun.Direction.Y:F2},{sun.Direction.Z:F2}) pitch={sun.Pitch:F1} yaw={sun.Yaw:F1} color=({sun.Color.X:F2},{sun.Color.Y:F2},{sun.Color.Z:F2}) intensity={sun.Intensity:F1} support={sun.SupportingSamples} dominance={sun.DominanceScore:F1}x");
                    worldspawnKeys["_sun_color"]     = $"{sun.Color.X:0.###} {sun.Color.Y:0.###} {sun.Color.Z:0.###}";
                    worldspawnKeys["_sun_pitch"]     = sun.Pitch.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture);
                    worldspawnKeys["_sun_yaw"]       = sun.Yaw.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture);
                    worldspawnKeys["_sun_intensity"] = sun.Intensity.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture);
                    // Optional: write a sky shader so the user can plug it into their .shader stack.
                    if (args.Flag("emit-sky-shader"))
                    {
                        string skyPath = Path.ChangeExtension(outPath, ".sky.shader");
                        File.WriteAllText(skyPath,
                            $"// auto-generated sky shader from BspLightReSlopper sun detection\n" +
                            $"textures/skies/bsplrs_inferred\n{{\n" +
                            $"\tqer_editorimage textures/skies/sky\n" +
                            $"\tsurfaceparm sky\n" +
                            $"\tsurfaceparm noimpact\n" +
                            $"\tsurfaceparm nolightmap\n" +
                            $"\tq3map_sun {sun.Color.X:0.###} {sun.Color.Y:0.###} {sun.Color.Z:0.###} {sun.Intensity:0.##} {sun.Yaw:0.##} {sun.Pitch:0.##}\n" +
                            $"\tskyParms - 512 -\n" +
                            $"}}\n");
                        log.Info($"wrote skybox shader: {skyPath}");
                    }
                }
                else
                {
                    log.Info("sun: no clear sun signal (no SURF_SKY surfaces or normal-bin search below dominance threshold)");
                }
            }

            EntFileWriter.Write(outPath, guesses, new EntFileWriter.WriteOptions
            {
                SourceBspName = resolved.DisplayName,
                InferredCompile = infer.Display,
                RuntimeSeconds = result.ElapsedSeconds.ToString("0.0") + "s",
                CountsByType = new Dictionary<string, int> { ["point"] = pointCount, ["linear"] = linearCount, ["spot"] = spotCount },
                WorldspawnKeys = worldspawnKeys.Count > 0 ? worldspawnKeys : null,
            });
            log.Info($"wrote {outPath} ({guesses.Count} lights{(worldspawnKeys.Count > 0 ? ", + sun worldspawn keys" : "")})");

            // Compare with ground truth, if any.
            log.Section("ground truth comparison");
            var gt = GroundTruth.Extract(bsp.EntitiesText);
            if (!gt.IsUsable)
            {
                log.Warn("ground truth not usable: " + (gt.SkipReason ?? "(no reason)"));
            }
            else
            {
                var truthOrigins = gt.Lights.Select(x => x.Origin).ToList();
                var truthColors = gt.Lights.Select(x => x.Color).ToList();
                var estOrigins = result.Lights.Select(x => x.Origin).ToList();
                var estColors = result.Lights.Select(x => x.Color).ToList();
                var match = GreedyMatcher.Match(truthOrigins, truthColors, estOrigins, estColors, 256f);
                log.Info($"truth: {gt.Lights.Count}, est: {result.Lights.Count}, matched: {match.Matches.Count}");
                log.Info($"recall: {match.Recall:P1}, precision: {match.Precision:P1}");
                log.Info($"position error mean: {match.MeanPositionError:F1} u, median: {match.MedianPositionError:F1} u");
            }

            log.Info("done.");
            return 0;
        }

        private static string MakeBaseName(string bspArg)
        {
            int bang = bspArg.IndexOf('!');
            string trimmed = bang > 0 ? bspArg.Substring(bang + 1) : bspArg;
            return Path.Combine(
                Path.GetDirectoryName(Path.GetFullPath(trimmed)) ?? ".",
                Path.GetFileNameWithoutExtension(trimmed));
        }

        private static BspLightReSlopper.Estimation.IntensityCalibrator.Mode ParseCalibrationMode(string? argValue)
        {
            // Default (argValue null or omitted) = Median, the empirically-validated mode.
            if (string.IsNullOrWhiteSpace(argValue)) return BspLightReSlopper.Estimation.IntensityCalibrator.Mode.Median;
            switch (argValue.Trim().ToLowerInvariant())
            {
                case "median": return BspLightReSlopper.Estimation.IntensityCalibrator.Mode.Median;
                case "physics": return BspLightReSlopper.Estimation.IntensityCalibrator.Mode.Physics;
                default:
                    throw new ArgumentException($"--calibration must be 'median' or 'physics', got '{argValue}'");
            }
        }
    }
}
