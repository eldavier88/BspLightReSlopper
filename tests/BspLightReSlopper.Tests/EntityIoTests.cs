using System;
using System.IO;
using System.Linq;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.EntityIo;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class EntityIoTests
    {
        [Fact]
        public void Parse_HandlesBasicEntities_AndComments()
        {
            string text = "{\n// worldspawn\n\"classname\" \"worldspawn\"\n\"_color\" \"1 1 1\"\n}\n{\n\"classname\" \"light\"\n\"origin\" \"10 20 30\"\n\"light\" \"200\"\n\"_color\" \"1 0.5 0.25\"\n}\n";
            var r = EntityLumpParser.Parse(text);
            Assert.Empty(r.Warnings);
            Assert.Equal(2, r.Entities.Count);
            Assert.Equal("worldspawn", r.Entities[0].ClassName);
            Assert.Equal("light", r.Entities[1].ClassName);
            Assert.True(r.Entities[1].TryGetVector3("origin", out var o));
            Assert.Equal(new System.Numerics.Vector3(10, 20, 30), o);
            Assert.True(r.Entities[1].TryGetFloat("light", out float lv));
            Assert.Equal(200f, lv);
        }

        [Fact]
        public void Parse_RecoverableErrorsAreWarnings()
        {
            string text = "{ \"classname\" \"light\" \"origin\" \"1 2 3\" }\nbogus\n{ \"classname\" \"info_player_start\" }\n";
            var r = EntityLumpParser.Parse(text);
            Assert.Equal(2, r.Entities.Count);
            Assert.NotEmpty(r.Warnings);
        }

        [Fact]
        public void GroundTruth_NoLights_IsUnusable()
        {
            string text = "{ \"classname\" \"worldspawn\" }\n";
            var gt = GroundTruth.Extract(text);
            Assert.False(gt.IsUsable);
            Assert.NotNull(gt.SkipReason);
        }

        [Fact]
        public void GroundTruth_OnlySunIsUsable_AsSunOnly()
        {
            string text = "{ \"classname\" \"worldspawn\" \"_sun_color\" \"1 1 0.8\" \"_sun_direction\" \"0 0 -1\" }\n";
            var gt = GroundTruth.Extract(text);
            Assert.True(gt.IsUsable);
            Assert.True(gt.HasSunWorldspawn);
            Assert.Empty(gt.Lights);
        }

        [Fact]
        public void GroundTruth_LightsArePicked_DefaultsApplied()
        {
            string text = "{ \"classname\" \"light\" \"origin\" \"0 0 0\" }\n{ \"classname\" \"light\" \"origin\" \"100 200 300\" \"light\" \"150\" \"_color\" \"1 0 0\" \"spawnflags\" \"1\" }\n";
            var gt = GroundTruth.Extract(text);
            Assert.True(gt.IsUsable);
            Assert.Equal(2, gt.Lights.Count);
            Assert.Equal(300f, gt.Lights[0].Intensity);    // default
            Assert.Equal(System.Numerics.Vector3.One, gt.Lights[0].Color); // default
            Assert.True(gt.Lights[1].Linear);
        }

        [Fact]
        public void EntFileWriter_RoundTripsThroughParser()
        {
            var lights = new[]
            {
                new EntFileWriter.GuessedLight
                {
                    Origin = new System.Numerics.Vector3(256, -128, 64),
                    Color = new System.Numerics.Vector3(1f, 0.5f, 0.25f),
                    Intensity = 320,
                    SpawnFlags = 1,
                    Method = "ransac",
                    Confidence = 0.83f,
                    SupportingTexels = 412,
                    ResidualEnergyExplainedFraction = 0.21f,
                },
            };
            string text = EntFileWriter.ToText(lights, new EntFileWriter.WriteOptions
            {
                SourceBspName = "kejim_post.bsp",
                InferredCompile = new System.Collections.Generic.Dictionary<string, string> { ["gamma"] = "1.5" },
                RuntimeSeconds = "12.3s",
                CountsByType = new System.Collections.Generic.Dictionary<string, int> { ["point"] = 1 },
            });
            var r = EntityLumpParser.Parse(text);
            Assert.Empty(r.Warnings);
            Assert.Single(r.Entities);
            Assert.Equal("light", r.Entities[0].ClassName);
            Assert.True(r.Entities[0].TryGetVector3("origin", out var o));
            Assert.Equal(new System.Numerics.Vector3(256, -128, 64), o);
            Assert.Equal("ransac", r.Entities[0].Get("_method"));
            Assert.Equal("1", r.Entities[0].Get("spawnflags"));
        }

        [SkippableFact]
        public void RealJk2_GroundTruth_LightsArePresentAndUsable()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.If(string.IsNullOrEmpty(assets), "BSPLRS_JK2_ASSETS not set");
            string mapPath = Path.Combine(assets!, "maps", "kejim_post.bsp");
            Skip.IfNot(File.Exists(mapPath), $"map not found: {mapPath}");

            BspFile bsp = BspLoader.Load(mapPath);
            var gt = GroundTruth.Extract(bsp.EntitiesText);
            Assert.True(gt.IsUsable, gt.SkipReason);
            Assert.True(gt.Lights.Count > 10, $"expected lots of lights in kejim_post, got {gt.Lights.Count}");

            // Sanity: a sample of lights should have non-default colors or non-default intensities.
            int colored = gt.Lights.Count(l => l.Color != System.Numerics.Vector3.One);
            int customIntensity = gt.Lights.Count(l => Math.Abs(l.Intensity - 300f) > 0.001f);
            Assert.True(colored > 0 || customIntensity > 0, "no light has a non-default color or intensity");
        }
    }
}
