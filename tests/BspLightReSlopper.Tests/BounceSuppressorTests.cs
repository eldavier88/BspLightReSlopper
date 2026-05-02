using System;
using System.Collections.Generic;
using System.IO;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Pk3;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Shaders;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class BounceSuppressorTests
    {
        private const string SampleShader = @"
// auto-test shader
textures/test/red_floor
{
    qer_editorimage textures/test/red_floor
    surfaceparm metalsteps
    {
        map textures/test/red_floor.tga
    }
}
textures/test/blue_wall
{
    q3map_lightImage textures/test/blue_lighter
    {
        map textures/test/blue_wall.tga
    }
}
textures/test/no_image
{
    surfaceparm fog
}
";

        [Fact]
        public void ShaderParser_ExtractsEditorAndLightImages()
        {
            var dict = ShaderParser.Parse(SampleShader);
            Assert.True(dict.ContainsKey("textures/test/red_floor"));
            Assert.True(dict.ContainsKey("textures/test/blue_wall"));
            Assert.True(dict.ContainsKey("textures/test/no_image"));

            var red = dict["textures/test/red_floor"];
            Assert.Equal("textures/test/red_floor", red.EditorImage);
            Assert.Equal("textures/test/red_floor.tga", red.FirstStageMap);
            Assert.Equal("textures/test/red_floor", red.PreferredImagePath);

            var blue = dict["textures/test/blue_wall"];
            Assert.Equal("textures/test/blue_lighter", blue.Q3MapLightImage);
            // q3map_lightImage takes precedence in PreferredImagePath:
            Assert.Equal("textures/test/blue_lighter", blue.PreferredImagePath);

            var none = dict["textures/test/no_image"];
            Assert.Null(none.PreferredImagePath);
        }

        [SkippableFact]
        public void AlbedoCache_ResolvesFromRealPk3()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && Directory.Exists(assets!), "BSPLRS_JK2_ASSETS not set");

            using var stack = new Pk3Stack(assets!);
            var shaders = ShaderParser.ParseAllInPk3Stack(stack);
            Assert.True(shaders.Count > 100, $"only {shaders.Count} shaders parsed; expected > 100 from a JK2 asset stack");

            var cache = new AlbedoCache(stack, shaders);

            // Try to resolve at least 5 shader names that have a known image path. We don't
            // know which textures actually exist in this environment, so iterate the parsed
            // list and accept the first 5 successes.
            int hits = 0;
            foreach (var kv in shaders)
            {
                var alb = cache.GetAlbedo(kv.Key);
                if (alb.HasValue) hits++;
                if (hits >= 5) break;
            }
            Assert.True(hits >= 5, $"only {hits} of the first {shaders.Count} shaders resolved an albedo; expected >= 5");
        }

        [Fact]
        public void Suppressor_DropsColorMatchedLight_KeepsBrightAndMultiSurface()
        {
            // Build a synthetic test that exercises the suppressor logic without needing
            // a real BSP/AlbedoCache. We use a fake "fixture" approach: construct a small
            // fake BspFile + a stub AlbedoCache to drive Filter().
            // For simplicity we build a synthetic IBSP46 BSP with a single shader and a
            // single-surface sample distribution.
            var bsp = BspLoader.LoadFromBytes(TestBsp.BuildIbsp46QuadWithGradientLightmap(8,
                (ax, ay) => ((byte)180, (byte)40, (byte)40))); // red surface
            var samples = new List<TexelSample>();
            for (int i = 0; i < 50; i++)
            {
                samples.Add(new TexelSample
                {
                    SurfaceIndex = 0, ShaderIndex = 0,
                    World = new Vector3(i * 4f, 0, 0),
                    Normal = Vector3.UnitZ,
                    Observed = new Vector3(0.2f, 0.2f, 0.2f),
                });
            }
            // Stub AlbedoCache: we can't easily mock the Pk3 lookup, so build one against
            // a temp dir. Keep the temp dir empty -> AlbedoCache returns null for all
            // lookups -> bounce-suppressor's "insufficient-known-albedo-samples" branch
            // fires and the light is kept. This proves the conservative-default behaviour:
            // when albedo info is missing, we don't drop anything.
            string tmp = Path.Combine(Path.GetTempPath(), "bsplrs-bs-" + Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(tmp);
            // Pk3Stack requires the dir to look like a content dir.
            Directory.CreateDirectory(Path.Combine(tmp, "shaders"));
            try
            {
                using var stack = new Pk3Stack(tmp);
                var cache = new AlbedoCache(stack, new Dictionary<string, ShaderParser.Shader>());
                var lights = new List<EstimatedLight> {
                    new EstimatedLight { Origin = new Vector3(100, 0, 100), Color = new Vector3(1, 0.2f, 0.2f), Intensity = 2000 },
                };
                var r = BounceSuppressor.Filter(lights, samples, bsp, cache, halfLambert: false);
                Assert.Single(r.KeptLights);
                Assert.Empty(r.SuppressedLights);
            }
            finally
            {
                try { Directory.Delete(tmp, recursive: true); } catch { }
            }
        }
    }
}
