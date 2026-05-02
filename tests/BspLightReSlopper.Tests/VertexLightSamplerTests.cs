using System;
using System.IO;
using System.Linq;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Sampling;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class VertexLightSamplerTests
    {
        [SkippableFact]
        public void RealMapEmitsVertexLitSamples()
        {
            // Some surfaces in real JK2 maps are vertex-lit. We don't know which ones a
            // priori, but on a non-trivial map at least a few should exist.
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS / kejim_post.bsp not present");

            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var result = VertexLightSampler.Sample(bsp);
            // Per-vertex samples on vertex-lit surfaces. Even maps with few vertex-lit
            // surfaces should yield a handful of samples.
            Assert.True(result.VertexLitSurfaces > 0, "expected at least one vertex-lit surface");
            // The samples we DO emit must satisfy the basic invariants.
            foreach (var s in result.Samples.Take(50))
            {
                Assert.True(s.AtlasIndex == -1, "vertex-lit samples have AtlasIndex = -1");
                Assert.True(s.Normal.LengthSquared() > 0.5f, "normal not unit-length-ish");
                Assert.True(s.Observed.X >= 0 && s.Observed.X <= 1);
                Assert.True(s.Observed.Y >= 0 && s.Observed.Y <= 1);
                Assert.True(s.Observed.Z >= 0 && s.Observed.Z <= 1);
            }
        }

        [SkippableFact]
        public void NonOverlappingWithLightmapSampler()
        {
            // The vertex-lit sampler must NOT touch surfaces that have a lightmap path --
            // those go through TexelSampler, with much higher fidelity than a few per-vertex
            // samples. Verify by reconstructing the predicate: every surface VertexLightSampler
            // emits for must be (LmIndex0 < 0 OR SURF_NOLIGHTMAP).
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS / kejim_post.bsp not present");

            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var result = VertexLightSampler.Sample(bsp);
            int overlap = 0;
            var seen = new System.Collections.Generic.HashSet<int>();
            foreach (var s in result.Samples) seen.Add(s.SurfaceIndex);
            foreach (int si in seen)
            {
                var surf = bsp.Surfaces[si];
                int sflags = (surf.ShaderIndex >= 0 && surf.ShaderIndex < bsp.Shaders.Count)
                    ? bsp.Shaders[surf.ShaderIndex].SurfaceFlags : 0;
                bool noLightmap = surf.LmIndex0 < 0 || (sflags & BspLightReSlopper.Surfaces.SurfaceUnpacker.SURF_NOLIGHTMAP) != 0;
                if (!noLightmap) overlap++;
            }
            Assert.Equal(0, overlap);
        }
    }
}
