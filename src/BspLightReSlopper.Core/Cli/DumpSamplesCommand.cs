using System;
using System.Globalization;
using System.IO;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Pk3;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Cli
{
    /// <summary>
    /// Diagnostic CLI: dumps every <see cref="TexelSample"/> the sampler produces for a BSP
    /// into a CSV. One row per sample with surface index, lightmap stage, atlas (index, x, y),
    /// world position, normal, observed RGB, and leaf cluster. Lets you spot-check the texel
    /// fetch logic in any tool (Excel, Python, gnuplot, blender point-cloud import).
    ///
    /// <example>bsplrs dump-samples --bsp kejim_post.bsp --out samples.csv</example>
    /// </summary>
    public static class DumpSamplesCommand
    {
        public static int Run(CliArgs args)
        {
            string bspArg = args.Require("bsp");
            string outPath = args.Require("out");
            string? assetsArg = args.Get("assets");
            int maxSamples = int.TryParse(args.Get("max-samples"), out int ms) ? ms : 200_000;

            using var log = new Logger(Console.Out, Path.ChangeExtension(outPath, ".log"));
            log.Section("dump-samples");
            log.Info($"bsp:  {bspArg}");
            log.Info($"out:  {outPath}");
            log.Info($"max:  {maxSamples}");

            using Pk3Stack? stack = !string.IsNullOrEmpty(assetsArg) && Directory.Exists(assetsArg)
                ? new Pk3Stack(assetsArg) : null;
            var resolved = BspInputResolver.Resolve(bspArg, stack);
            var bsp = BspLoader.LoadFromBytes(resolved.Bytes);
            log.Info($"format: {bsp.Format.DisplayName}, surfaces: {bsp.Surfaces.Count}");

            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var collision = new BspCollision(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas,
                new TexelSampler.SampleOptions { MaxSamples = maxSamples }, collision);

            log.Info($"emitted: {samples.Samples.Count} samples ({samples.LitTexelsConsidered} considered, " +
                     $"{samples.UnlitSkipped} unlit-skipped, {samples.OutOfTriangleSamples} outside-tri)");

            CultureInfo inv = CultureInfo.InvariantCulture;
            using (var w = new StreamWriter(outPath, append: false))
            {
                w.NewLine = "\n";
                w.WriteLine("surfIdx,shaderIdx,stage,atlasIdx,atlasX,atlasY,worldX,worldY,worldZ,normalX,normalY,normalZ,r255,g255,b255,cluster,style");
                foreach (var s in samples.Samples)
                {
                    w.Write(s.SurfaceIndex.ToString(inv)); w.Write(',');
                    w.Write(s.ShaderIndex.ToString(inv)); w.Write(',');
                    w.Write(s.Stage.ToString(inv)); w.Write(',');
                    w.Write(s.AtlasIndex.ToString(inv)); w.Write(',');
                    w.Write(s.AtlasX.ToString(inv)); w.Write(',');
                    w.Write(s.AtlasY.ToString(inv)); w.Write(',');
                    w.Write(s.World.X.ToString("0.##", inv)); w.Write(',');
                    w.Write(s.World.Y.ToString("0.##", inv)); w.Write(',');
                    w.Write(s.World.Z.ToString("0.##", inv)); w.Write(',');
                    w.Write(s.Normal.X.ToString("0.###", inv)); w.Write(',');
                    w.Write(s.Normal.Y.ToString("0.###", inv)); w.Write(',');
                    w.Write(s.Normal.Z.ToString("0.###", inv)); w.Write(',');
                    w.Write(((int)(s.Observed.X * 255)).ToString(inv)); w.Write(',');
                    w.Write(((int)(s.Observed.Y * 255)).ToString(inv)); w.Write(',');
                    w.Write(((int)(s.Observed.Z * 255)).ToString(inv)); w.Write(',');
                    w.Write(s.Cluster.ToString(inv)); w.Write(',');
                    w.WriteLine(s.LightmapStyle.ToString(inv));
                }
            }
            log.Info($"wrote {outPath}");
            return 0;
        }
    }
}
