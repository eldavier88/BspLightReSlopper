using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Threading;
using System.Threading.Tasks;
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
using Serilog.Core;

namespace BspLightReSlopper.Desktop.Services
{
    /// <summary>
    /// Asynchronous, cancellable port of <c>BspLightReSlopper.Cli.EstimateCommand.Run</c>.
    /// Every CLI feature is preserved 1:1; the runner just wraps the heavy work in
    /// <see cref="Task.Run"/>, surfaces progress through <see cref="IProgress{RunProgress}"/>,
    /// and pipes log events into the supplied Serilog sink.
    /// </summary>
    public static class PipelineRunner
    {
        /// <summary>Load + parse a BSP off the UI thread. No estimator work; just header + lumps.</summary>
        public static Task<BspFile> LoadBspAsync(string path, CancellationToken ct = default)
        {
            return Task.Run(() =>
            {
                ct.ThrowIfCancellationRequested();
                var bytes = File.ReadAllBytes(path);
                ct.ThrowIfCancellationRequested();
                return BspLoader.LoadFromBytes(bytes);
            }, ct);
        }

        /// <summary>Cheap on-load preview: room count for the auto-max-lights default.</summary>
        public static Task<RoomDetector.Result> DetectRoomsAsync(BspFile bsp, CancellationToken ct = default)
        {
            return Task.Run(() =>
            {
                ct.ThrowIfCancellationRequested();
                return RoomDetector.Detect(bsp);
            }, ct);
        }

        /// <summary>
        /// Run the full estimator pipeline. Mirrors <c>EstimateCommand.Run</c> end-to-end.
        /// </summary>
        public static Task<RunResult> RunAsync(
            RunOptions options,
            ILogEventSink? logSink,
            IProgress<RunProgress>? progress,
            CancellationToken ct)
        {
            return Task.Run(() => RunCore(options, logSink, progress, ct), ct);
        }

        private static RunResult RunCore(
            RunOptions opts,
            ILogEventSink? logSink,
            IProgress<RunProgress>? progress,
            CancellationToken ct)
        {
            void Report(string stage, double pct)
                => progress?.Report(new RunProgress { Stage = stage, OverallPercent = pct });

            using var log = new BspLightReSlopper.Util.Logger(console: null, opts.LogPath, logSink);
            log.Section("estimate");
            log.Info($"bsp:    {opts.BspInput}");
            log.Info($"assets: {opts.AssetsDirectory ?? "(none — white-albedo fallback)"}");
            log.Info($"out:    {opts.OutEntPath}");
            log.Info($"log:    {opts.LogPath}");

            ct.ThrowIfCancellationRequested();
            Report("Resolving BSP...", 1);

            // ----- Resolve + load -----
            using Pk3Stack? stack = !string.IsNullOrEmpty(opts.AssetsDirectory) && Directory.Exists(opts.AssetsDirectory)
                ? new Pk3Stack(opts.AssetsDirectory) : null;
            var resolved = BspInputResolver.Resolve(opts.BspInput, stack);
            log.Info($"resolved: {resolved.DisplayName} ({resolved.Bytes.Length} bytes)");
            var bsp = BspLoader.LoadFromBytes(resolved.Bytes);
            log.Info($"format:  {bsp.Format.DisplayName}");
            log.Info($"surfaces: {bsp.Surfaces.Count}, drawverts: {bsp.DrawVerts.Count}, lightmap atlases: {bsp.LightmapAtlasCount}");

            ct.ThrowIfCancellationRequested();
            Report("Unpacking surfaces...", 5);

            // ----- Surface unpack -----
            log.Section("surface unpack");
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            log.Info($"planar={unpacked.Planar} triSoup={unpacked.TriangleSoup} patch(tess)={unpacked.PatchTessellated} " +
                     $"patch(skipped)={unpacked.PatchSkipped} sky(skipped)={unpacked.SkySkipped} noDraw={unpacked.NoDrawSkipped} " +
                     $"noLightmap={unpacked.NoLightmapSkipped} other={unpacked.OtherSkipped}");
            log.Info($"triangles emitted: {unpacked.TrianglesEmitted}");

            ct.ThrowIfCancellationRequested();
            Report("Building collision + PVS...", 10);

            // ----- Collision + visibility -----
            var collision = new BspCollision(bsp);
            var vis = new BspVis(bsp);
            log.Info($"vis: {(vis.HasVis ? $"{vis.NumClusters} clusters / {vis.BytesPerCluster} bytes-per-cluster" : "absent (no -vis stage; estimator falls back to non-visibility mode)")}");

            ct.ThrowIfCancellationRequested();
            Report("Detecting rooms...", 13);

            // ----- Room detection -----
            log.Section("room detection");
            var rooms = RoomDetector.Detect(bsp);
            int maxLights = opts.MaxLights;
            if (rooms.Rooms.Count > 0)
            {
                int suggestedTotal = 0;
                foreach (var room in rooms.Rooms)
                {
                    log.Info($"  room: kind={room.Kind} leafs={room.Leafs.Count} vol={room.Volume:F0} doorways={room.DoorwayCount} " +
                             $"shader={room.DominantShader} suggestedLights={room.SuggestedLightCount} " +
                             $"intensity=({room.SuggestedIntensityRange.min:F0}-{room.SuggestedIntensityRange.max:F0}) spacing={room.SuggestedSpacing:F0}");
                    suggestedTotal += room.SuggestedLightCount;
                }
                log.Info($"  rooms detected: {rooms.Rooms.Count}, suggested total lights: {suggestedTotal}, unassigned leafs: {rooms.UnassignedLeafCount}");
            }
            else
            {
                log.Info("  no rooms detected (likely all solid or single open space)");
            }

            ct.ThrowIfCancellationRequested();
            Report("Sampling lightmap texels...", 18);

            // ----- Sample texels -----
            log.Section("texel sampling");
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = opts.MaxSamples }, collision);

            ct.ThrowIfCancellationRequested();
            Report("Sampling vertex-lit surfaces...", 25);

            // ----- Vertex-lit sampling (E3) -----
            var vertexSamples = VertexLightSampler.Sample(bsp, collision);
            log.Info($"vertex-lit surfaces: {vertexSamples.VertexLitSurfaces} ({vertexSamples.VertexLitSurfacesWithoutColor} with no vertex color), emitted {vertexSamples.Samples.Count} extra samples");
            if (vertexSamples.Samples.Count > 0)
            {
                var merged = new List<TexelSample>(samples.Samples.Count + vertexSamples.Samples.Count);
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
                throw new InvalidOperationException("no usable texel samples — try a different BSP or set --no-vis to widen sampling");
            }

            ct.ThrowIfCancellationRequested();
            Report("Inferring compile settings...", 30);

            // ----- Compile settings heuristics -----
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

            ct.ThrowIfCancellationRequested();
            Report("Estimating lights...", 35);

            // ----- Estimate -----
            log.Section("estimator");
            bool halfLambert = opts.HalfLambert || (opts.InferAngleModel && infer.LightAngleHl);
            float envMult = infer.FastUsed
                ? new LightEstimator.Options().EnvelopeMultiplierFast
                : new LightEstimator.Options().EnvelopeMultiplierNoFast;

            var result = LightEstimator.Estimate(samples.Samples, bboxMin, bboxMax, new LightEstimator.Options
            {
                MaxPivotsPerRound = opts.Pivots,
                MaxLights = maxLights,
                RandomSeed = opts.Seed,
                Collision = opts.NoVis ? null : collision,
                Visibility = opts.NoVis ? null : vis,
                HalfLambert = halfLambert,
                EnvelopeMultiplier = envMult,
            }, log);
            log.Info($"accepted: {result.RoundsAccepted}, rejected: {result.RoundsRejected}");
            log.Info($"rounds: {result.RoundsRun}, initial-energy: {result.InitialEnergy:F2}, final-residual: {result.FinalResidualEnergy:F2}, elapsed: {result.ElapsedSeconds:F1}s");

            ct.ThrowIfCancellationRequested();
            Report("Bounce suppression...", 60);

            // ----- Bounce suppression -----
            if (stack != null && !opts.NoBounceSuppress)
            {
                try
                {
                    log.Section("bounce suppression");
                    var shaders = BspLightReSlopper.Shaders.ShaderParser.ParseAllInPk3Stack(stack);
                    log.Info($"shaders parsed: {shaders.Count}");
                    var albedoCache = new BspLightReSlopper.Shaders.AlbedoCache(stack, shaders);
                    var bsResult = BounceSuppressor.Filter(result.Lights, samples.Samples, bsp, albedoCache, halfLambert, log: log);
                    var (h, m) = albedoCache.Stats();
                    log.Info($"albedo cache: {h} hits / {m} misses");
                    result = WithLights(result, bsResult.KeptLights);
                }
                catch (Exception ex)
                {
                    log.Warn($"bounce suppression failed: {ex.Message}");
                }
            }
            else if (!opts.NoBounceSuppress)
            {
                log.Section("bounce suppression");
                var bsResult = BounceSuppressor.Filter(result.Lights, samples.Samples, bsp, albedo: null, halfLambert, log: log);
                result = WithLights(result, bsResult.KeptLights);
            }

            ct.ThrowIfCancellationRequested();

            // ----- Minimize light count -----
            if (opts.MinimizeLights)
            {
                Report("Minimizing light count...", 65);
                var minimized = LightEstimator.MinimizeLightCountGreedy(result.Lights, samples.Samples, halfLambert, 32f, opts.MinimizeLightsTolerance, log, excludeMask: result.BlownMask);
                result = WithLights(result, minimized);
            }

            ct.ThrowIfCancellationRequested();

            // ----- Photometric refine -----
            if (opts.RefineLights)
            {
                Report("Photometric refine (forward SSE)...", 70);
                var rOpts = new BspLightReSlopper.Metrics.PerceptualRefiner.Options
                {
                    Passes = opts.RefinePasses,
                    StepStart = opts.RefineStep,
                };
                log.Section("photometric refine (forward SSE)");
                var rf = BspLightReSlopper.Metrics.PerceptualRefiner.RefineRgb(samples.Samples, result.Lights, halfLambert, 32f, rOpts, ct, excludeMask: result.BlownMask);
                log.Info($"forward SSE: {rf.InitialSse:F1} -> {rf.FinalSse:F1}");
                result = WithLights(result, rf.Lights);
            }

            ct.ThrowIfCancellationRequested();

            // ----- Recompile-refine -----
            if (opts.RecompileRefineIterations > 0)
            {
                if (string.IsNullOrEmpty(opts.Q3Map2Path) || string.IsNullOrEmpty(opts.BasePath) || string.IsNullOrEmpty(opts.RecompileRefineMapPath))
                {
                    log.Warn("recompile-refine: skipped (needs q3map2 path, base path, .map path; configure in Settings).");
                }
                else
                {
                    Report("Recompile-refine loop...", 75);
                    log.Section($"recompile-refine loop ({opts.RecompileRefineIterations} iterations)");
                    var wrapper = new BspLightReSlopper.Tools.Q3Map2Wrapper(opts.Q3Map2Path!, opts.BasePath!, fsGame: "", gameToken: opts.GameToken);
                    string workRoot = Path.Combine(Path.GetDirectoryName(opts.OutEntPath) ?? ".", Path.GetFileNameWithoutExtension(opts.OutEntPath) + "_refine");
                    var refineOpts = new BspLightReSlopper.Metrics.RecompileRefiner.Options
                    {
                        ReferenceMapPath = opts.RecompileRefineMapPath!,
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
                        PerCompileTimeout = TimeSpan.FromMinutes(opts.RefineTimeoutMins),
                        MaxIterations = opts.RecompileRefineIterations,
                        InitialStep = opts.RefineStep,
                        HalfLambert = halfLambert,
                    };
                    var refine = BspLightReSlopper.Metrics.RecompileRefiner.Refine(
                        samples.Samples, result.Lights, result.BlownMask, bboxMin, bboxMax, refineOpts, log);
                    log.Info($"recompile-refine: MSE {refine.InitialMse:F6} -> {refine.FinalMse:F6} over {refine.Iterations.Count} iteration(s); best iter={refine.BestIteration}; final lights={refine.Lights.Count}");
                    result = WithLights(result, refine.Lights);
                }
            }

            ct.ThrowIfCancellationRequested();
            Report("Calibrating intensities...", 85);

            // ----- Intensity Q3 calibration -----
            log.Section("output");
            float scaleToQ3 = 1f;
            float medianInternal = 0f;
            if (result.Lights.Count > 0)
            {
                var sorted = result.Lights.Select(l => l.Intensity).OrderBy(v => v).ToArray();
                medianInternal = sorted[sorted.Length / 2];
                if (medianInternal > 1e-3f) scaleToQ3 = 300f / medianInternal;
            }
            log.Info($"intensity calibration: median internal={medianInternal:F1}, scale=*{scaleToQ3:F4} → median q3 light~300");

            ct.ThrowIfCancellationRequested();
            Report("Classifying light types...", 88);

            // ----- Classification + .ent guesses -----
            var classifiedList = new List<ClassifiedLight>(result.Lights.Count);
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
                    BlownOut = l.BlownOut,
                };

                if (opts.NoClassify)
                {
                    classifiedList.Add(new ClassifiedLight { Light = l, Kind = LightTypeClassifier.Kind.Point });
                    guesses.Add(g);
                    pointCount++;
                    continue;
                }

                var cls = LightTypeClassifier.Classify(l, samples.Samples, halfLambert);
                classifiedList.Add(new ClassifiedLight
                {
                    Light = l,
                    Kind = cls.Type,
                    SpotDirection = cls.SpotDirection,
                    SpotHalfAngleDegrees = cls.SpotHalfAngleDegrees,
                });

                switch (cls.Type)
                {
                    case LightTypeClassifier.Kind.Linear:
                        g = new EntFileWriter.GuessedLight
                        {
                            Origin = g.Origin, Color = g.Color, Intensity = g.Intensity,
                            Method = g.Method + "+linear",
                            Confidence = g.Confidence, SupportingTexels = g.SupportingTexels,
                            ResidualEnergyExplainedFraction = g.ResidualEnergyExplainedFraction,
                            BlownOut = g.BlownOut,
                            SpawnFlags = 1,
                        };
                        linearCount++;
                        guesses.Add(g);
                        break;
                    case LightTypeClassifier.Kind.Spot:
                        string targetName = "bsplrs_spot_" + spotIdx; spotIdx++;
                        Vector3 targetPos = l.Origin + cls.SpotDirection * 256f;
                        g = new EntFileWriter.GuessedLight
                        {
                            Origin = g.Origin, Color = g.Color, Intensity = g.Intensity,
                            Method = g.Method + "+spot",
                            Confidence = g.Confidence, SupportingTexels = g.SupportingTexels,
                            ResidualEnergyExplainedFraction = g.ResidualEnergyExplainedFraction,
                            BlownOut = g.BlownOut,
                            Target = targetName,
                            ExtraDebugKeys = new Dictionary<string, string>
                            {
                                ["_spotConeHalfAngleDeg"] = cls.SpotHalfAngleDegrees.ToString("0.##", CultureInfo.InvariantCulture),
                            },
                        };
                        spotCount++;
                        guesses.Add(g);
                        guesses.Add(new EntFileWriter.GuessedLight
                        {
                            Origin = targetPos,
                            Color = Vector3.One, Intensity = 0,
                            ClassName = "info_null",
                            TargetName = targetName,
                            Method = "spot-target",
                        });
                        break;
                    default:
                        pointCount++;
                        guesses.Add(g);
                        break;
                }
            }
            log.Info($"types: point={pointCount}, linear={linearCount}, spot={spotCount}");

            ct.ThrowIfCancellationRequested();
            Report("Detecting sun...", 92);

            // ----- Sun detection -----
            var worldspawnKeys = new Dictionary<string, string>();
            SunSummary? sunSummary = null;
            if (!opts.NoSun)
            {
                var sunResult = SunDetector.Detect(samples.Samples, bsp, log: log);
                if (sunResult.DetectedSun != null)
                {
                    var sun = sunResult.DetectedSun;
                    log.Info($"sun: dir=({sun.Direction.X:F2},{sun.Direction.Y:F2},{sun.Direction.Z:F2}) pitch={sun.Pitch:F1} yaw={sun.Yaw:F1} color=({sun.Color.X:F2},{sun.Color.Y:F2},{sun.Color.Z:F2}) intensity={sun.Intensity:F1} support={sun.SupportingSamples} dominance={sun.DominanceScore:F1}x");
                    worldspawnKeys["_sun_color"] = $"{sun.Color.X:0.###} {sun.Color.Y:0.###} {sun.Color.Z:0.###}";
                    worldspawnKeys["_sun_pitch"] = sun.Pitch.ToString("0.##", CultureInfo.InvariantCulture);
                    worldspawnKeys["_sun_yaw"] = sun.Yaw.ToString("0.##", CultureInfo.InvariantCulture);
                    worldspawnKeys["_sun_intensity"] = sun.Intensity.ToString("0.##", CultureInfo.InvariantCulture);
                    sunSummary = new SunSummary
                    {
                        Direction = sun.Direction,
                        Color = sun.Color,
                        Intensity = sun.Intensity,
                        Pitch = sun.Pitch,
                        Yaw = sun.Yaw,
                        SupportingSamples = sun.SupportingSamples,
                        DominanceScore = sun.DominanceScore,
                    };
                    if (opts.EmitSkyShader)
                    {
                        string skyPath = Path.ChangeExtension(opts.OutEntPath, ".sky.shader");
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

            ct.ThrowIfCancellationRequested();
            Report("Writing .ent file...", 95);

            // ----- Write .ent -----
            EntFileWriter.Write(opts.OutEntPath, guesses, new EntFileWriter.WriteOptions
            {
                SourceBspName = resolved.DisplayName,
                InferredCompile = infer.Display,
                RuntimeSeconds = result.ElapsedSeconds.ToString("0.0") + "s",
                CountsByType = new Dictionary<string, int> { ["point"] = pointCount, ["linear"] = linearCount, ["spot"] = spotCount },
                WorldspawnKeys = worldspawnKeys.Count > 0 ? worldspawnKeys : null,
            });
            log.Info($"wrote {opts.OutEntPath} ({guesses.Count} lights{(worldspawnKeys.Count > 0 ? ", + sun worldspawn keys" : "")})");

            // ----- Ground truth comparison -----
            log.Section("ground truth comparison");
            var gt = GroundTruth.Extract(bsp.EntitiesText);
            var gtOrigins = new List<Vector3>();
            var gtColors = new List<Vector3>();
            GroundTruthSummary? gtSummary = null;
            if (!gt.IsUsable)
            {
                log.Warn("ground truth not usable: " + (gt.SkipReason ?? "(no reason)"));
            }
            else
            {
                foreach (var l in gt.Lights)
                {
                    gtOrigins.Add(l.Origin);
                    gtColors.Add(l.Color);
                }
                var estOrigins = result.Lights.Select(x => x.Origin).ToList();
                var estColors = result.Lights.Select(x => x.Color).ToList();
                var match = GreedyMatcher.Match(gtOrigins, gtColors, estOrigins, estColors, 256f);
                log.Info($"truth: {gt.Lights.Count}, est: {result.Lights.Count}, matched: {match.Matches.Count}");
                log.Info($"recall: {match.Recall:P1}, precision: {match.Precision:P1}");
                log.Info($"position error mean: {match.MeanPositionError:F1} u, median: {match.MedianPositionError:F1} u");
                gtSummary = new GroundTruthSummary
                {
                    TruthCount = gt.Lights.Count,
                    EstimatedCount = result.Lights.Count,
                    MatchedCount = match.Matches.Count,
                    Recall = match.Recall,
                    Precision = match.Precision,
                    MeanPositionError = match.MeanPositionError,
                    MedianPositionError = match.MedianPositionError,
                };
            }

            log.Info("done.");
            Report("Done", 100);

            return new RunResult
            {
                Bsp = bsp,
                BspPath = opts.BspInput,
                OutEntPath = opts.OutEntPath,
                LogPath = opts.LogPath,
                Lights = classifiedList,
                GroundTruthOrigins = gtOrigins,
                GroundTruthColors = gtColors,
                Sun = sunSummary,
                Comparison = gtSummary,
                Rooms = rooms,
                InferredCompile = infer.Display,
                PointCount = pointCount,
                LinearCount = linearCount,
                SpotCount = spotCount,
                RoundsRun = result.RoundsRun,
                RoundsAccepted = result.RoundsAccepted,
                ElapsedSeconds = result.ElapsedSeconds,
                ScaleToQ3 = scaleToQ3,
            };
        }

        private static LightEstimator.Result WithLights(LightEstimator.Result prev, IReadOnlyList<EstimatedLight> lights)
        {
            return new LightEstimator.Result
            {
                Lights = lights,
                InitialEnergy = prev.InitialEnergy,
                FinalResidualEnergy = prev.FinalResidualEnergy,
                RoundsRun = prev.RoundsRun,
                RoundsAccepted = prev.RoundsAccepted,
                RoundsRejected = prev.RoundsRejected,
                ElapsedSeconds = prev.ElapsedSeconds,
                BlownMask = prev.BlownMask,
            };
        }
    }
}
