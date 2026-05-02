using System;
using System.IO;
using System.Linq;
using BspLightReSlopper.Bsp;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class BspLoaderTests
    {
        [Fact]
        public void Synthetic_Ibsp46_RoundTrips()
        {
            byte[] bytes = TestBsp.BuildMinimalIbsp46(out var counts);
            BspFile bsp = BspLoader.LoadFromBytes(bytes);

            Assert.Equal("IBSP", bsp.Magic);
            Assert.Equal(46, bsp.Version);
            Assert.Equal(1, bsp.LightmapStageCount);
            Assert.Equal(counts.verts, bsp.DrawVerts.Count);
            Assert.Equal(counts.surfs, bsp.Surfaces.Count);
            Assert.Single(bsp.Shaders);
            Assert.Single(bsp.Models);
            Assert.Equal(1, bsp.LightmapAtlasCount);
            Assert.Contains("classname", bsp.EntitiesText);
            Assert.Contains("light", bsp.EntitiesText);

            var s = bsp.Surfaces[0];
            Assert.Equal(BspSurfaceType.Planar, s.SurfaceType);
            Assert.Equal(0, s.LmIndex0);
            Assert.Equal(-1, s.LmIndex1);
        }

        [Fact]
        public void Synthetic_Rbsp1_RoundTrips()
        {
            byte[] bytes = TestBsp.BuildMinimalRbsp1(out var counts);
            BspFile bsp = BspLoader.LoadFromBytes(bytes);

            Assert.Equal("RBSP", bsp.Magic);
            Assert.Equal(1, bsp.Version);
            Assert.Equal(4, bsp.LightmapStageCount);
            Assert.Equal(counts.verts, bsp.DrawVerts.Count);
            Assert.Equal(counts.surfs, bsp.Surfaces.Count);
            Assert.Equal(1, bsp.LightmapAtlasCount);

            var s = bsp.Surfaces[0];
            Assert.Equal(0, s.LmIndex0);
            Assert.Equal(-1, s.LmIndex1);
            Assert.Equal(-1, s.LmIndex2);
            Assert.Equal(-1, s.LmIndex3);
        }

        [Fact]
        public void Reject_BadMagic()
        {
            var bad = new byte[256];
            bad[0] = (byte)'X'; bad[1] = (byte)'X'; bad[2] = (byte)'X'; bad[3] = (byte)'X';
            Assert.Throws<InvalidDataException>(() => BspLoader.LoadFromBytes(bad));
        }

        [SkippableFact]
        public void RealJk2_KejimPost_ParsesAndHasLightEntities()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.If(string.IsNullOrEmpty(assets), "BSPLRS_JK2_ASSETS not set; skipping real-bsp test");
            string mapPath = Path.Combine(assets!, "maps", "kejim_post.bsp");
            Skip.IfNot(File.Exists(mapPath), $"map not found: {mapPath}");

            BspFile bsp = BspLoader.Load(mapPath);
            Assert.Equal("RBSP", bsp.Magic);
            Assert.Equal(1, bsp.Version);
            Assert.True(bsp.DrawVerts.Count > 1000, $"draw verts surprisingly low: {bsp.DrawVerts.Count}");
            Assert.True(bsp.Surfaces.Count > 100, $"surfaces surprisingly low: {bsp.Surfaces.Count}");
            Assert.True(bsp.LightmapAtlasCount >= 1, "expected at least 1 lightmap atlas");
            Assert.True(bsp.EntitiesText.Length > 1000, "entities text surprisingly short");

            // sanity: at least one surface with a valid lightmap stage 0
            int withLm = bsp.Surfaces.Count(x => x.LmIndex0 >= 0);
            Assert.True(withLm > 50, $"expected many lit surfaces, got {withLm}");
        }
    }
}
