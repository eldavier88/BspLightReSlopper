using System;
using System.IO;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Heuristics;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class CompileSettingsInfererTests
    {
        [SkippableFact]
        public void RealMap_ProducesAllInferences()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS / kejim_post.bsp not present");

            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = 30_000 });

            var inf = CompileSettingsInferer.Infer(bsp, samples.Samples);

            // Sanity bounds.
            Assert.InRange(inf.Gamma, 0.5f, 3.0f);
            Assert.InRange(inf.OverbrightBits, 0, 3);
            Assert.True(inf.LightmapScale > 0, "lightmapScale must be positive");
            Assert.True(inf.SampleSize > 0, "sampleSize must be positive");
            // The Display dictionary should have all 7 keys from E7's enriched inferer.
            Assert.True(inf.Display.ContainsKey("gamma"));
            Assert.True(inf.Display.ContainsKey("overbrightBits"));
            Assert.True(inf.Display.ContainsKey("lightmapScale"));
            Assert.True(inf.Display.ContainsKey("samplesize"));
            Assert.True(inf.Display.ContainsKey("bounce"));
            Assert.True(inf.Display.ContainsKey("fast"));
            Assert.True(inf.Display.ContainsKey("lightAngleHl"));
        }

        [Fact]
        public void EmptyBsp_DoesNotThrow()
        {
            var bsp = BspLoader.LoadFromBytes(TestBsp.BuildMinimalIbsp46(out _));
            var inf = CompileSettingsInferer.Infer(bsp, Array.Empty<TexelSample>());
            Assert.True(inf.Gamma > 0);
            Assert.True(inf.LightmapScale > 0);
        }
    }
}
