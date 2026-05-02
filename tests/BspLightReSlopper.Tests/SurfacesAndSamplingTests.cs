using System;
using System.IO;
using System.Linq;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class SurfacesAndSamplingTests
    {
        [Fact]
        public void Synthetic_Ibsp46_UnpackEmitsOneTriangle()
        {
            byte[] bytes = TestBsp.BuildMinimalIbsp46(out _);
            var bsp = BspLoader.LoadFromBytes(bytes);
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            Assert.Equal(1, unpacked.Planar);
            Assert.Equal(1, unpacked.TrianglesEmitted);
            Assert.Equal(0, unpacked.PatchSkipped);
        }

        [Fact]
        public void Synthetic_Ibsp46_TexelSamplerEmitsLitTexels()
        {
            byte[] bytes = TestBsp.BuildMinimalIbsp46(out _);
            var bsp = BspLoader.LoadFromBytes(bytes);
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            // synthetic atlas is filled with mid-grey (64,64,64) — every texel inside the
            // surface's lightmap rect should produce a sample.
            Assert.True(samples.Samples.Count > 0, "no texel samples emitted");
            Assert.True(samples.SurfacesSampled >= 1);
            Assert.Equal(0, samples.UnlitSkipped);
            // Expect samples within the unit triangle in world space (z = 0).
            Assert.All(samples.Samples, s =>
            {
                Assert.True(MathF.Abs(s.World.Z) < 1e-3f, $"unexpected Z: {s.World.Z}");
                Assert.True(s.Observed.X > 0.2f && s.Observed.X < 0.3f); // 64/255 ≈ 0.251
            });
        }

        [SkippableFact]
        public void RealJk2_KejimPost_UnpackAndSampleProducePlausibleData()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.If(string.IsNullOrEmpty(assets), "BSPLRS_JK2_ASSETS not set");
            string mapPath = Path.Combine(assets!, "maps", "kejim_post.bsp");
            Skip.IfNot(File.Exists(mapPath), $"map not found: {mapPath}");

            var bsp = BspLoader.Load(mapPath);
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            Assert.True(unpacked.TrianglesEmitted > 1000, $"too few triangles: {unpacked.TrianglesEmitted}");
            Assert.True(unpacked.Planar + unpacked.TriangleSoup > 50);

            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = 50_000 });

            Assert.True(samples.Samples.Count > 1000, $"too few samples: {samples.Samples.Count}");
            // Some samples should be appreciably bright (lit areas).
            Assert.True(samples.Samples.Any(s => s.Brightness > 0.5f), "no bright lit texels found");
            // Of texels we considered, the ones that miss any triangle (because the surface
            // triangulation isn't rectangle-tiling its lmUV bbox - common for irregular brush
            // faces) should be a non-dominating fraction. Empirical threshold: <60%.
            float outsideRatio = samples.OutOfTriangleSamples / (float)Math.Max(1, samples.LitTexelsConsidered);
            Assert.True(outsideRatio < 0.6f, $"{outsideRatio:P1} of texels fell outside any triangle (expected <60%)");
        }

        [SkippableFact]
        public void PatchTessellator_CurvedJk2PatchProducesValidTriangles()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS not set or kejim_post.bsp missing");

            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            // kejim_post has ~1000 patch surfaces; with patch tessellation enabled we should
            // emit >0 of them as triangles, and the per-triangle normals must be unit length.
            Assert.True(unpacked.PatchTessellated > 100, $"only tessellated {unpacked.PatchTessellated} patches");
            int patchTriCount = 0;
            int badNormals = 0;
            for (int si = 0; si < bsp.Surfaces.Count; si++)
            {
                if (bsp.Surfaces[si].SurfaceType != BspSurfaceType.Patch) continue;
                var tris = unpacked.PerSurface[si];
                if (tris == null) continue;
                patchTriCount += tris.Count;
                foreach (var t in tris)
                {
                    float lenSq = t.Normal.LengthSquared();
                    if (lenSq < 0.95f || lenSq > 1.05f) badNormals++;
                }
            }
            Assert.True(patchTriCount > 1000, $"only {patchTriCount} patch triangles emitted");
            Assert.Equal(0, badNormals);
        }

        [SkippableFact]
        public void PatchTessellator_CanBeDisabled()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS not set or kejim_post.bsp missing");

            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var off = SurfaceUnpacker.Unpack(bsp, new SurfaceUnpacker.UnpackOptions { TessellatePatches = false });
            Assert.Equal(0, off.PatchTessellated);
            Assert.True(off.PatchSkipped > 0);
        }
    }
}
