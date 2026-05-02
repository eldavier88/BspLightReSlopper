using System;
using System.IO;
using System.Linq;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.MapFile;
using BspLightReSlopper.Tools;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class RandomLightScattererTests
    {
        private const string SyntheticMap =
            "// entity 0\n" +
            "{\n" +
            "\"classname\" \"worldspawn\"\n" +
            "}\n" +
            "{\n" +
            "\"classname\" \"light\"\n" +
            "\"origin\" \"100 200 300\"\n" +
            "\"light\" \"500\"\n" +
            "}\n" +
            "{\n" +
            "\"classname\" \"light\"\n" +
            "\"origin\" \"-100 -200 -300\"\n" +
            "\"light\" \"700\"\n" +
            "}\n" +
            "{\n" +
            "\"classname\" \"info_player_start\"\n" +
            "\"origin\" \"0 0 0\"\n" +
            "}\n";

        [Fact]
        public void RemovesExistingLightsAndPlacesNewOnes()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS / kejim_post.bsp not present");

            var map = MapFileParser.Parse(SyntheticMap);
            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var col = new BspCollision(bsp);

            int oldLights = map.Entities.Count(e => e.ClassName == "light");
            Assert.Equal(2, oldLights);

            var result = RandomLightScatterer.Scatter(map, bsp, col, new RandomLightScatterer.Options
            {
                LightCount = 12,
                RandomSeed = 7,
                ColoredFraction = 0.5f,
                LinearFraction = 0.25f,
                SpotFraction = 0.25f,
                ClearanceUnits = 32f,
            });

            Assert.True(result.Placed >= 8, $"placed only {result.Placed} of 12 lights (rejects: outside={result.RejectedOutside} solid={result.RejectedSolid} clearance={result.RejectedClearance})");

            int newLights = map.Entities.Count(e => e.ClassName == "light");
            Assert.Equal(result.Placed, newLights);

            // Sanity: every placed light should sit in valid space.
            int badPlaced = 0;
            foreach (var e in map.Entities.Where(e => e.ClassName == "light"))
            {
                Assert.True(e.TryGetOrigin(out var o));
                if (!col.IsValidLightPosition(o)) badPlaced++;
            }
            Assert.Equal(0, badPlaced);

            // Worldspawn + info_player_start preserved (the original 2 lights are stripped).
            Assert.NotNull(map.Entities.FirstOrDefault(e => e.ClassName == "worldspawn"));
            Assert.NotNull(map.Entities.FirstOrDefault(e => e.ClassName == "info_player_start"));
        }

        [Fact]
        public void RoundTripsThroughWriter()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS / kejim_post.bsp not present");

            var map = MapFileParser.Parse(SyntheticMap);
            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var col = new BspCollision(bsp);
            RandomLightScatterer.Scatter(map, bsp, col, new RandomLightScatterer.Options { LightCount = 6, RandomSeed = 11 });
            string emitted = MapFileWriter.ToText(map);
            var roundtrip = MapFileParser.Parse(emitted);
            Assert.Equal(map.Entities.Count, roundtrip.Entities.Count);
            int rtLights = roundtrip.Entities.Count(e => e.ClassName == "light");
            Assert.True(rtLights >= 4, $"round-trip preserved only {rtLights} lights");
        }

        [Fact]
        public void DeterministicForSameSeed()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS / kejim_post.bsp not present");

            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var col = new BspCollision(bsp);
            var m1 = MapFileParser.Parse(SyntheticMap);
            var m2 = MapFileParser.Parse(SyntheticMap);
            RandomLightScatterer.Scatter(m1, bsp, col, new RandomLightScatterer.Options { LightCount = 8, RandomSeed = 99 });
            RandomLightScatterer.Scatter(m2, bsp, col, new RandomLightScatterer.Options { LightCount = 8, RandomSeed = 99 });
            var l1 = m1.Entities.Where(e => e.ClassName == "light").Select(e => e.GetKey("origin")).ToList();
            var l2 = m2.Entities.Where(e => e.ClassName == "light").Select(e => e.GetKey("origin")).ToList();
            Assert.Equal(l1, l2);
        }
    }
}
