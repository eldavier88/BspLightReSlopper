using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.EntityIo;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Pk3;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Cli
{
    /// <summary>
    /// Phase A12 verification harness. Walks a list of BSPs, runs the estimator on each,
    /// and reports per-map + aggregate accuracy against the ground-truth lights stored in
    /// the entity lump.
    ///
    /// <para><b>Crucial rule:</b> a BSP whose entity lump is missing <c>light</c> entities
    /// AND has no <c>_sun_*</c> worldspawn keys is **skipped** — never counted as
    /// "0 truth → 0 est → 100% recall". If every discovered map is unusable, the command
    /// exits non-zero with a clear message.</para>
    /// </summary>
    public static class VerifyCommand
    {
        public static int Run(CliArgs args)
        {
            string assetsArg = args.Require("assets");
            string? mapsArg = args.Get("maps");
            int maxSamples = int.TryParse(args.Get("max-samples"), out int ms) ? ms : 100_000;
            int maxPivots = int.TryParse(args.Get("pivots"), out int cs) ? cs : 800;
            int maxLights = int.TryParse(args.Get("max-lights"), out int ml) ? ml : 64;
            int seed = int.TryParse(args.Get("seed"), out int sd) ? sd : 42;
            float matchTolerance = float.TryParse(args.Get("match-tolerance"), out float mt) ? mt : 256f;
            string? outDir = args.Get("out");

            using var log = new Logger(Console.Out, outDir != null ? Path.Combine(outDir, "verify.log") : null);
            log.Section("verify");
            log.Info($"assets:      {assetsArg}");
            log.Info($"maps:        {mapsArg ?? "(all under " + Path.Combine(assetsArg, "maps") + ")"}");
            log.Info($"matchTol:    {matchTolerance} u");

            // Resolve list of map paths.
            var mapPaths = new List<string>();
            if (!string.IsNullOrEmpty(mapsArg))
            {
                foreach (var raw in mapsArg.Split(','))
                {
                    string m = raw.Trim();
                    if (string.IsNullOrEmpty(m)) continue;
                    if (File.Exists(m)) mapPaths.Add(m);
                    else
                    {
                        string p = Path.Combine(assetsArg, "maps", m);
                        if (!Path.HasExtension(p)) p += ".bsp";
                        if (File.Exists(p)) mapPaths.Add(p);
                        else log.Warn("not found, skipping: " + m);
                    }
                }
            }
            else
            {
                string mapsDir = Path.Combine(assetsArg, "maps");
                if (Directory.Exists(mapsDir))
                    mapPaths.AddRange(Directory.GetFiles(mapsDir, "*.bsp"));
            }
            log.Info($"discovered:  {mapPaths.Count} bsp(s)");

            int used = 0, skipped = 0;
            var perMap = new List<MapReport>();

            foreach (var path in mapPaths)
            {
                log.Section($"map: {Path.GetFileName(path)}");
                BspFile bsp;
                try { bsp = BspLoader.Load(path); }
                catch (Exception ex) { log.Warn("load failed: " + ex.Message); skipped++; continue; }

                var gt = GroundTruth.Extract(bsp.EntitiesText);
                if (!gt.IsUsable)
                {
                    log.Warn($"SKIPPED (no ground truth): {gt.SkipReason}");
                    skipped++;
                    continue;
                }
                used++;

                var unpacked = SurfaceUnpacker.Unpack(bsp);
                var atlas = LightmapAtlas.FromBsp(bsp);
                var collision = new BspCollision(bsp);
                var vis = new BspVis(bsp);
                var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = maxSamples }, collision);
                Vector3 bboxMin = new(float.PositiveInfinity), bboxMax = new(float.NegativeInfinity);
                foreach (var s in samples.Samples) { bboxMin = Vector3.Min(bboxMin, s.World); bboxMax = Vector3.Max(bboxMax, s.World); }
                if (bsp.Models.Count > 0) { bboxMin = Vector3.Min(bboxMin, bsp.Models[0].Mins); bboxMax = Vector3.Max(bboxMax, bsp.Models[0].Maxs); }

                bool noVis = args.Flag("no-vis");
                bool halfLambertDefault = bsp.Format is BspLightReSlopper.Bsp.Formats.Rbsp1Format;
                bool halfLambert = args.Flag("no-half-lambert") ? false
                                  : args.Flag("half-lambert") ? true
                                  : halfLambertDefault;
                var result = LightEstimator.Estimate(samples.Samples, bboxMin, bboxMax, new LightEstimator.Options
                {
                    MaxPivotsPerRound = maxPivots,
                    MaxLights = maxLights,
                    RandomSeed = seed,
                    Collision = noVis ? null : collision,
                    Visibility = noVis ? null : vis,
                    HalfLambert = halfLambert,
                });

                var truthOrigins = gt.Lights.Select(x => x.Origin).ToList();
                var truthColors = gt.Lights.Select(x => x.Color).ToList();
                var estOrigins = result.Lights.Select(x => x.Origin).ToList();
                var estColors = result.Lights.Select(x => x.Color).ToList();
                var match = GreedyMatcher.Match(truthOrigins, truthColors, estOrigins, estColors, matchTolerance);

                log.Info($"truth: {gt.Lights.Count}, est: {result.Lights.Count}, matched: {match.Matches.Count}, recall: {match.Recall:P1}, precision: {match.Precision:P1}, posErrMedian: {match.MedianPositionError:F0}u, samples: {samples.Samples.Count}, elapsed: {result.ElapsedSeconds:F1}s");

                perMap.Add(new MapReport
                {
                    Map = Path.GetFileName(path),
                    Truth = gt.Lights.Count,
                    Est = result.Lights.Count,
                    Matched = match.Matches.Count,
                    Recall = match.Recall,
                    Precision = match.Precision,
                    PositionMedian = match.MedianPositionError,
                    PositionMean = match.MeanPositionError,
                    Elapsed = result.ElapsedSeconds,
                    Samples = samples.Samples.Count,
                });
            }

            log.Section("summary");
            log.Info($"used: {used}/{mapPaths.Count} maps  ({skipped} skipped, no ground truth)");
            if (used == 0)
            {
                log.Error("no usable verification data found — every discovered map had its lights stripped or no lights at all. Cannot report accuracy.");
                return 3;
            }

            float meanRecall = perMap.Average(r => r.Recall);
            float meanPrecision = perMap.Average(r => r.Precision);
            float meanPosMedian = perMap.Average(r => r.PositionMedian);
            log.Info($"aggregate: recall={meanRecall:P1}, precision={meanPrecision:P1}, posErrMedian={meanPosMedian:F0}u");
            // Per-map table
            log.Info("");
            log.Info(string.Format("{0,-28} {1,5} {2,5} {3,5} {4,7} {5,8} {6,7} {7,8}", "map", "truth", "est", "match", "recall", "precision", "errMed", "elapsed"));
            foreach (var r in perMap)
            {
                log.Info(string.Format("{0,-28} {1,5} {2,5} {3,5} {4,7:P1} {5,8:P1} {6,7:F0} {7,8:F1}", r.Map, r.Truth, r.Est, r.Matched, r.Recall, r.Precision, r.PositionMedian, r.Elapsed));
            }
            return 0;
        }

        private sealed class MapReport
        {
            public string Map { get; init; } = "";
            public int Truth { get; init; }
            public int Est { get; init; }
            public int Matched { get; init; }
            public float Recall { get; init; }
            public float Precision { get; init; }
            public float PositionMedian { get; init; }
            public float PositionMean { get; init; }
            public float Elapsed { get; init; }
            public int Samples { get; init; }
        }
    }
}
