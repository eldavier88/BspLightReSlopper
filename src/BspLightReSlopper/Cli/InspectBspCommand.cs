using System;
using System.IO;
using System.Linq;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.EntityIo;
using BspLightReSlopper.Pk3;

namespace BspLightReSlopper.Cli
{
    public static class InspectBspCommand
    {
        public static int Run(CliArgs args)
        {
            string? assetsArg = args.Get("assets");
            string bspArg = args.Require("bsp");

            using Pk3Stack? stack = !string.IsNullOrEmpty(assetsArg) && Directory.Exists(assetsArg)
                ? new Pk3Stack(assetsArg) : null;
            var r = BspInputResolver.Resolve(bspArg, stack);
            var bsp = BspLoader.LoadFromBytes(r.Bytes);
            Console.WriteLine($"source:    {r.DisplayName}");
            Console.WriteLine($"size:      {r.Bytes.Length} bytes");
            Console.WriteLine($"format:    {bsp.Format.DisplayName}");
            Console.WriteLine($"version:   {bsp.Version}");
            Console.WriteLine($"stages:    {bsp.LightmapStageCount}");
            Console.WriteLine($"shaders:    {bsp.Shaders.Count}");
            Console.WriteLine($"models:     {bsp.Models.Count}");
            Console.WriteLine($"planes:     {bsp.Planes.Count}");
            Console.WriteLine($"nodes:      {bsp.Nodes.Count}");
            Console.WriteLine($"leafs:      {bsp.Leafs.Count}");
            Console.WriteLine($"brushes:    {bsp.Brushes.Count}");
            Console.WriteLine($"brushSides: {bsp.BrushSides.Count}");
            Console.WriteLine($"drawVerts:  {bsp.DrawVerts.Count}");
            Console.WriteLine($"drawIdx:    {bsp.DrawIndexes.Count}");
            Console.WriteLine($"surfaces:   {bsp.Surfaces.Count}");
            Console.WriteLine($"fogs:       {bsp.Fogs.Count}");
            Console.WriteLine($"lightmap atlases: {bsp.LightmapAtlasCount}  ({bsp.Lightmaps.Length} bytes)");

            int patches = bsp.Surfaces.Count(s => s.SurfaceType == BspSurfaceType.Patch);
            int planar = bsp.Surfaces.Count(s => s.SurfaceType == BspSurfaceType.Planar);
            int triSoup = bsp.Surfaces.Count(s => s.SurfaceType == BspSurfaceType.TriangleSoup);
            int flares = bsp.Surfaces.Count(s => s.SurfaceType == BspSurfaceType.Flare);
            Console.WriteLine($"surface types: planar={planar} patch={patches} triSoup={triSoup} flare={flares}");

            var gt = GroundTruth.Extract(bsp.EntitiesText);
            Console.WriteLine($"ground-truth lights: {gt.Lights.Count}  (sun-worldspawn={gt.HasSunWorldspawn})  usable={gt.IsUsable}");
            if (!gt.IsUsable) Console.WriteLine($"  reason: {gt.SkipReason}");

            if (args.Flag("dump-surfaces"))
            {
                Console.WriteLine();
                Console.WriteLine("first 10 surfaces with lightmap data:");
                int shown = 0;
                for (int si = 0; si < bsp.Surfaces.Count && shown < 10; si++)
                {
                    var s = bsp.Surfaces[si];
                    if (s.LmIndex0 < 0) continue;
                    float u0 = float.PositiveInfinity, u1 = float.NegativeInfinity;
                    float v0 = float.PositiveInfinity, v1 = float.NegativeInfinity;
                    for (int vi = 0; vi < s.NumVerts; vi++)
                    {
                        var dv = bsp.DrawVerts[s.FirstVert + vi];
                        if (dv.Lm0.X < u0) u0 = dv.Lm0.X;
                        if (dv.Lm0.X > u1) u1 = dv.Lm0.X;
                        if (dv.Lm0.Y < v0) v0 = dv.Lm0.Y;
                        if (dv.Lm0.Y > v1) v1 = dv.Lm0.Y;
                    }
                    Console.WriteLine($"  surf {si}: type={s.SurfaceType} lmIdx={s.LmIndex0} lmXY=({s.LmX0},{s.LmY0}) WxH={s.LightmapWidth}x{s.LightmapHeight} | Lm0 range=[{u0:F4}..{u1:F4}, {v0:F4}..{v1:F4}]");
                    shown++;
                }
            }

            // Lightmap pixel histogram (max channel per pixel)
            if (args.Flag("dump-lightmap"))
            {
                int total = 0, nonZero = 0, max = 0;
                long sum = 0;
                for (int i = 0; i < bsp.Lightmaps.Length; i++)
                {
                    byte b = bsp.Lightmaps[i];
                    total++;
                    if (b > 0) nonZero++;
                    if (b > max) max = b;
                    sum += b;
                }
                Console.WriteLine($"lightmap bytes: {total}, nonzero: {nonZero} ({(100f * nonZero / total):F1}%), max: {max}, mean: {(double)sum / total:F2}");
            }
            return 0;
        }
    }
}
