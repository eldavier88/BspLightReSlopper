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
            return 0;
        }
    }
}
