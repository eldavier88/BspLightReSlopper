using System;
using System.IO;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.MapFile;
using BspLightReSlopper.Tools;
using BspLightReSlopper.Util;
using MapFileT = BspLightReSlopper.MapFile.MapFile;

namespace BspLightReSlopper.Cli
{
    /// <summary>
    /// CLI for the random-light scatter step in the Phase B training loop.
    ///
    /// <example>
    /// bsplrs scatter --map source.map --bsp source.bsp --out scatter.map
    ///                --count 32 --seed 17
    /// </example>
    ///
    /// <para>Both inputs are required: <c>--map</c> is the source brush geometry the writer
    /// rebuilds from, <c>--bsp</c> is the compiled BSP whose tree validates each candidate
    /// position via <see cref="BspCollision"/>.</para>
    /// </summary>
    public static class ScatterCommand
    {
        public static int Run(CliArgs args)
        {
            string mapPath = args.Require("map");
            string bspPath = args.Require("bsp");
            string outPath = args.Get("out") ?? Path.ChangeExtension(mapPath, ".scatter.map");
            int count = int.TryParse(args.Get("count"), out int c) ? c : 32;
            int seed = int.TryParse(args.Get("seed"), out int s) ? s : 42;
            float minI = float.TryParse(args.Get("min-intensity"), out float mi) ? mi : 100f;
            float maxI = float.TryParse(args.Get("max-intensity"), out float ma) ? ma : 1200f;
            float clearance = float.TryParse(args.Get("clearance"), out float cl) ? cl : 32f;
            float colored = float.TryParse(args.Get("colored-fraction"), out float cf) ? cf : 0.4f;
            float linear = float.TryParse(args.Get("linear-fraction"), out float lf) ? lf : 0.2f;
            float spot = float.TryParse(args.Get("spot-fraction"), out float sf) ? sf : 0.1f;

            using var log = new Logger(Console.Out, Path.ChangeExtension(outPath, ".log"));
            log.Section("scatter");
            log.Info($"map:  {mapPath}");
            log.Info($"bsp:  {bspPath}");
            log.Info($"out:  {outPath}");
            log.Info($"count={count} seed={seed} intensity={minI:F0}..{maxI:F0} clearance={clearance:F0} " +
                     $"colored={colored:F2} linear={linear:F2} spot={spot:F2}");

            var map = MapFileParser.ParseFile(mapPath);
            log.Info($"parsed {map.Entities.Count} entities, " +
                     $"{Sum(map, e => e.Brushes.Count)} brushes, " +
                     $"{Sum(map, e => e.Patches.Count)} patches");

            var bsp = BspLoader.Load(bspPath);
            log.Info($"bsp format: {bsp.Format.DisplayName}, " +
                     $"{bsp.Brushes.Count} brushes, {bsp.Leafs.Count} leaves");

            var col = new BspCollision(bsp);
            var result = RandomLightScatterer.Scatter(map, bsp, col, new RandomLightScatterer.Options
            {
                LightCount = count,
                RandomSeed = seed,
                MinIntensity = minI,
                MaxIntensity = maxI,
                ColoredFraction = colored,
                LinearFraction = linear,
                SpotFraction = spot,
                ClearanceUnits = clearance,
            });

            log.Info($"placed: {result.Placed}/{count}");
            log.Info($"attempts: {result.Attempts}");
            log.Info($"rejects: outside-map={result.RejectedOutside} " +
                     $"inside-solid={result.RejectedSolid} no-clearance={result.RejectedClearance}");
            log.Info($"breakdown: spots={result.Spotlights} linear={result.LinearLights} colored={result.ColoredLights}");

            MapFileWriter.Write(outPath, map);
            log.Info($"wrote {outPath}");

            if (result.Placed < count)
            {
                log.Warn($"requested {count} lights, only placed {result.Placed} (map too dense or bbox too tight)");
                return 1;
            }
            return 0;
        }

        private static int Sum(MapFileT m, Func<MapEntity, int> sel)
        {
            int total = 0;
            foreach (var e in m.Entities) total += sel(e);
            return total;
        }
    }
}
