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
            int maxLights = int.TryParse(args.Get("max-lights"), out int ml) ? ml : 64;
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
            // Half-Lambert default: OFF. Standard Lambert max(0, n.L) is what shipped Q3 /
            // JK2 / JKA / SoF2 maps were baked with; q3map2's -lightanglehl 1 is a modern
            // option (popularised by Source/HL2 in 2004, post-dating JK2) and the netradiant-
            // custom JK2/JKA game profiles do NOT enable it. Use --half-lambert only when you
            // know the BSP was deliberately compiled with -lightanglehl 1 (or you're on a
            // qfusion-family BSP where it's the default).
            bool halfLambert = args.Flag("half-lambert");
            var result = LightEstimator.Estimate(samples.Samples, bboxMin, bboxMax, new LightEstimator.Options
            {
                MaxPivotsPerRound = maxPivots,
                MaxLights = maxLights,
                RandomSeed = seed,
                Collision = noVis ? null : collision,
                Visibility = noVis ? null : vis,
                HalfLambert = halfLambert,
            }, log);
            log.Info($"accepted: {result.RoundsAccepted}, rejected: {result.RoundsRejected}");
            log.Info($"rounds: {result.RoundsRun}, initial-energy: {result.InitialEnergy:F2}, final-residual: {result.FinalResidualEnergy:F2}, elapsed: {result.ElapsedSeconds:F1}s");

            // ----- Write .ent -----
            log.Section("output");
            // Phase A intensities are in arbitrary fitting units. To get values in the
            // q3map2 "light" key ballpark we normalise so the median-intensity guess maps to
            // ~300 (typical JK2 base-map fixture). Phase B/C will replace this with a
            // proper gamma+overbright-aware calibration once the heuristic is solid.
            float scaleToQ3 = 1f;
            float medianInternal = 0f;
            if (result.Lights.Count > 0)
            {
                var sorted = result.Lights.Select(l => l.Intensity).OrderBy(v => v).ToArray();
                medianInternal = sorted[sorted.Length / 2];
                if (medianInternal > 1e-3f) scaleToQ3 = 300f / medianInternal;
            }
            log.Info($"intensity calibration: median internal={medianInternal:F1}, scale=*{scaleToQ3:F4} → median q3 light~300");
            var guesses = new List<EntFileWriter.GuessedLight>();
            foreach (var l in result.Lights)
            {
                guesses.Add(new EntFileWriter.GuessedLight
                {
                    Origin = l.Origin,
                    Color = l.Color,
                    Intensity = l.Intensity * scaleToQ3,
                    Method = l.Method,
                    Confidence = l.Confidence,
                    SupportingTexels = l.SupportingTexels,
                    ResidualEnergyExplainedFraction = l.ResidualEnergyExplainedFraction,
                });
            }
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
                CountsByType = new Dictionary<string, int> { ["point"] = guesses.Count },
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
    }
}
