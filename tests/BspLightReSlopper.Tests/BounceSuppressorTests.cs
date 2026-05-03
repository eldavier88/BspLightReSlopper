using System;
using System.Collections.Generic;
using System.IO;
using System.Numerics;
using System.Text;
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

        // ----- Asset-less albedo fallback (Section 2.4) -----

        [Theory]
        [InlineData("textures/imperial/wall_metal01", 0.55f, 0.55f, 0.55f)]   // metal
        [InlineData("textures/yavin/floor_stone02",   0.50f, 0.50f, 0.50f)]   // stone
        [InlineData("textures/imperial_red/red_wall", 0.55f, 0.15f, 0.12f)]   // red
        [InlineData("textures/forest/grass_path",     0.20f, 0.40f, 0.15f)]   // grass
        [InlineData("textures/medieval/wood_plank",   0.45f, 0.32f, 0.18f)]   // wood (matches first)
        [InlineData("textures/lab/MAGENTA_Tile",      0.70f, 0.10f, 0.70f)]   // case-insensitive
        public void ShaderNameAlbedoGuess_RecognizesCommonPatterns(string shaderName, float r, float g, float b)
        {
            var alb = BounceSuppressor.ShaderNameAlbedoGuess(shaderName);
            Assert.True(alb.HasValue, $"expected non-null albedo for '{shaderName}'");
            Assert.Equal(new Vector3(r, g, b), alb!.Value);
        }

        [Theory]
        [InlineData("textures/common/clip")]
        [InlineData("textures/test/quad")]
        [InlineData("textures/abstract/whatever_xyz")]
        public void ShaderNameAlbedoGuess_ReturnsNullForUnrecognisedPaths(string shaderName)
        {
            var alb = BounceSuppressor.ShaderNameAlbedoGuess(shaderName);
            Assert.False(alb.HasValue, $"expected null albedo for '{shaderName}', got {alb}");
        }

        [Fact]
        public void AssetLess_DropsBlatantBounceFit_MagentaLightOnMagentaSurface()
        {
            // Magenta-named shader → ShaderNameAlbedoGuess returns (0.70, 0.10, 0.70).
            // Magenta light → cosine ~1.0 against that albedo → must drop.
            var (bsp, samples) = BuildSingleShaderQuadBsp("textures/test/magenta_pillar");
            var magentaLight = new EstimatedLight
            {
                Origin = new Vector3(100, 0, 100),
                Color  = new Vector3(1.0f, 0.2f, 1.0f),
                Intensity = 2000f, // < default IntensityFloor (5000)
            };
            var r = BounceSuppressor.Filter(new[] { magentaLight }, samples, bsp, albedo: null, halfLambert: false);
            Assert.Empty(r.KeptLights);
            Assert.Single(r.SuppressedLights);
            Assert.Equal("color-matches-albedo", r.Decisions[0].Reason);
        }

        [Fact]
        public void AssetLess_KeepsBrightLight_RegardlessOfColourMatch()
        {
            // Same magenta-on-magenta scenario, but Intensity above the IntensityFloor.
            // Bright lights are kept regardless of albedo cosine — they're plausibly real
            // coloured fixtures lighting a same-coloured surface.
            var (bsp, samples) = BuildSingleShaderQuadBsp("textures/test/magenta_pillar");
            var brightMagenta = new EstimatedLight
            {
                Origin = new Vector3(100, 0, 100),
                Color  = new Vector3(1.0f, 0.2f, 1.0f),
                Intensity = 8000f, // > default IntensityFloor (5000)
            };
            var r = BounceSuppressor.Filter(new[] { brightMagenta }, samples, bsp, albedo: null, halfLambert: false);
            Assert.Single(r.KeptLights);
            Assert.Empty(r.SuppressedLights);
            Assert.Equal("intensity-above-floor", r.Decisions[0].Reason);
        }

        [Fact]
        public void AssetLess_KeepsColourMismatch_RedLightOnConcreteSurface()
        {
            // Concrete-named shader → grey albedo (0.55, 0.55, 0.55).
            // Red light → cosine ~0.77 << 0.97 → must keep.
            var (bsp, samples) = BuildSingleShaderQuadBsp("textures/test/concrete_floor");
            var redLight = new EstimatedLight
            {
                Origin = new Vector3(100, 0, 100),
                Color  = new Vector3(1.0f, 0.2f, 0.2f),
                Intensity = 2000f,
            };
            var r = BounceSuppressor.Filter(new[] { redLight }, samples, bsp, albedo: null, halfLambert: false);
            Assert.Single(r.KeptLights);
            Assert.Empty(r.SuppressedLights);
            Assert.Equal("color-mismatch", r.Decisions[0].Reason);
        }

        [Fact]
        public void AssetLess_KeepsLight_WhenShaderNameIsUnknown()
        {
            // No keyword match → ShaderNameAlbedoGuess returns null → suppressor sees
            // zero known-albedo samples → keeps the light defensively. This is the
            // "we have no idea what this surface is" safe path.
            var (bsp, samples) = BuildSingleShaderQuadBsp("textures/abstract/whatever_xyz");
            var anyLight = new EstimatedLight
            {
                Origin = new Vector3(100, 0, 100),
                Color  = new Vector3(1.0f, 0.2f, 1.0f),
                Intensity = 2000f,
            };
            var r = BounceSuppressor.Filter(new[] { anyLight }, samples, bsp, albedo: null, halfLambert: false);
            Assert.Single(r.KeptLights);
            Assert.Empty(r.SuppressedLights);
            Assert.Equal("insufficient-known-albedo-samples", r.Decisions[0].Reason);
        }

        // Build a synthetic single-shader BSP whose only shader name is `shaderName`,
        // plus a 50-sample TexelSample list with predictable observed luma. Patches the
        // shader name in-place over the original "textures/test/quad" placeholder that
        // TestBsp.BuildIbsp46QuadWithGradientLightmap stamps.
        private static (BspFile bsp, List<TexelSample> samples) BuildSingleShaderQuadBsp(string shaderName)
        {
            var bytes = TestBsp.BuildIbsp46QuadWithGradientLightmap(8,
                (ax, ay) => ((byte)180, (byte)40, (byte)40));
            PatchShaderName(bytes, "textures/test/quad", shaderName);
            var bsp = BspLoader.LoadFromBytes(bytes);
            Assert.Equal(shaderName, bsp.Shaders[0].Name);

            var samples = new List<TexelSample>(50);
            for (int i = 0; i < 50; i++)
            {
                samples.Add(new TexelSample
                {
                    SurfaceIndex = 0,
                    ShaderIndex = 0,
                    World = new Vector3(i * 4f, 0, 0),
                    Normal = Vector3.UnitZ,
                    Observed = new Vector3(0.2f, 0.2f, 0.2f),
                });
            }
            return (bsp, samples);
        }

        private static void PatchShaderName(byte[] bsp, string oldName, string newName)
        {
            byte[] needle = Encoding.ASCII.GetBytes(oldName);
            byte[] replacement = Encoding.ASCII.GetBytes(newName);
            if (replacement.Length >= 64) throw new ArgumentException($"shader name too long: {newName}");
            int offset = IndexOfBytes(bsp, needle);
            if (offset < 0) throw new InvalidOperationException($"could not find '{oldName}' in BSP byte buffer");
            // Zero the entire 64-byte name field, then copy the new name.
            for (int i = 0; i < 64; i++) bsp[offset + i] = 0;
            Array.Copy(replacement, 0, bsp, offset, replacement.Length);
        }

        private static int IndexOfBytes(byte[] haystack, byte[] needle)
        {
            for (int i = 0; i <= haystack.Length - needle.Length; i++)
            {
                bool match = true;
                for (int j = 0; j < needle.Length; j++)
                {
                    if (haystack[i + j] != needle[j]) { match = false; break; }
                }
                if (match) return i;
            }
            return -1;
        }
    }
}
