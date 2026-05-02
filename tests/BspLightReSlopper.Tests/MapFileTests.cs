using System;
using System.IO;
using System.Linq;
using BspLightReSlopper.MapFile;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class MapFileTests
    {
        [Fact]
        public void ParsesSyntheticBrushDefMap()
        {
            string text =
                "// entity 0\n" +
                "{\n" +
                "\"classname\" \"worldspawn\"\n" +
                "// brush 0\n" +
                "{\n" +
                "brushDef\n" +
                "{\n" +
                "( 0 0 0 ) ( 0 1 0 ) ( 1 0 0 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/caulk 0 0 0\n" +
                "( 0 0 16 ) ( 1 0 16 ) ( 0 1 16 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/caulk 0 0 0\n" +
                "( 0 0 0 ) ( 1 0 0 ) ( 0 0 16 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/caulk 0 0 0\n" +
                "( 0 32 0 ) ( 0 32 16 ) ( 1 32 0 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/caulk 0 0 0\n" +
                "( 0 0 0 ) ( 0 0 16 ) ( 0 1 0 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/caulk 0 0 0\n" +
                "( 32 0 0 ) ( 32 1 0 ) ( 32 0 16 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/caulk 0 0 0\n" +
                "}\n" +
                "}\n" +
                "}\n" +
                "// entity 1\n" +
                "{\n" +
                "\"classname\" \"light\"\n" +
                "\"origin\" \"100 200 300\"\n" +
                "\"light\" \"500\"\n" +
                "}\n";
            var map = MapFileParser.Parse(text);
            Assert.Equal(2, map.Entities.Count);
            var ws = map.Entities[0];
            Assert.Equal("worldspawn", ws.ClassName);
            Assert.Single(ws.Brushes);
            Assert.Equal(6, ws.Brushes[0].Sides.Count);
            Assert.Equal(MapBrushDialect.BrushDef, ws.Brushes[0].Dialect);

            var light = map.Entities[1];
            Assert.Equal("light", light.ClassName);
            Assert.True(light.TryGetOrigin(out var o));
            Assert.Equal(100, o.X);
            Assert.Equal(200, o.Y);
            Assert.Equal(300, o.Z);
            Assert.Equal("500", light.GetKey("light"));
        }

        [Fact]
        public void ParsesNetradiantTinyStructuralBrush()
        {
            string path = Path.Combine("E:", "Repos", "BspLightReSlopper-resources",
                "netradiant-custom-src", "regression_tests", "q3map2",
                "tiny_structural_brush", "maps", "tiny_structural_brush.map");
            Skip.IfNot(File.Exists(path), "regression test map not present");
            var map = MapFileParser.ParseFile(path);
            Assert.True(map.Entities.Count >= 2, "expected worldspawn + at least one entity");
            var ws = map.Entities[0];
            Assert.Equal("worldspawn", ws.ClassName);
            Assert.True(ws.Brushes.Count >= 1, "worldspawn should have brushes");
            foreach (var b in ws.Brushes)
                Assert.True(b.Sides.Count >= 4, $"brush has only {b.Sides.Count} sides");
        }

        [Fact]
        public void ParsesGrabtexLargeRealMap()
        {
            string path = Path.Combine("E:", "Repos", "BspLightReSlopper-resources",
                "netradiant-custom-bin", "gamepacks", "Q3.game", "install", "maps", "grabtex.map");
            Skip.IfNot(File.Exists(path), "grabtex.map not present");
            var map = MapFileParser.ParseFile(path);
            Assert.True(map.Entities.Count >= 1);
            var ws = map.Entities[0];
            Assert.Equal("worldspawn", ws.ClassName);
            Assert.True(ws.Brushes.Count > 100, $"expected hundreds of brushes, got {ws.Brushes.Count}");
            // Most brushes in grabtex are simple cubes (6 sides).
            int avgSides = (int)ws.Brushes.Average(b => b.Sides.Count);
            Assert.InRange(avgSides, 4, 30);
        }

        [Fact]
        public void RoundTripPreservesEntityAndBrushCounts()
        {
            string path = Path.Combine("E:", "Repos", "BspLightReSlopper-resources",
                "netradiant-custom-bin", "gamepacks", "Q3.game", "install", "maps", "grabtex.map");
            Skip.IfNot(File.Exists(path), "grabtex.map not present");
            var first = MapFileParser.ParseFile(path);
            string emitted = MapFileWriter.ToText(first);
            var second = MapFileParser.Parse(emitted);
            Assert.Equal(first.Entities.Count, second.Entities.Count);
            for (int i = 0; i < first.Entities.Count; i++)
            {
                Assert.Equal(first.Entities[i].Brushes.Count, second.Entities[i].Brushes.Count);
                Assert.Equal(first.Entities[i].Patches.Count, second.Entities[i].Patches.Count);
                Assert.Equal(first.Entities[i].Keys.Count, second.Entities[i].Keys.Count);
                for (int b = 0; b < first.Entities[i].Brushes.Count; b++)
                    Assert.Equal(first.Entities[i].Brushes[b].Sides.Count,
                                 second.Entities[i].Brushes[b].Sides.Count);
            }
        }

        [Fact]
        public void NonSolidShadersAreClassified()
        {
            // A brush with all sides using common/trigger should be marked non-solid.
            string text =
                "{\n\"classname\" \"worldspawn\"\n{\nbrushDef\n{\n" +
                "( 0 0 0 ) ( 0 1 0 ) ( 1 0 0 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/trigger 0 0 0\n" +
                "( 0 0 16 ) ( 1 0 16 ) ( 0 1 16 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/trigger 0 0 0\n" +
                "( 0 0 0 ) ( 1 0 0 ) ( 0 0 16 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/trigger 0 0 0\n" +
                "( 0 32 0 ) ( 0 32 16 ) ( 1 32 0 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/trigger 0 0 0\n" +
                "( 0 0 0 ) ( 0 0 16 ) ( 0 1 0 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/trigger 0 0 0\n" +
                "( 32 0 0 ) ( 32 1 0 ) ( 32 0 16 ) ( ( 1 0 0 ) ( 0 1 0 ) ) common/trigger 0 0 0\n" +
                "}\n}\n}\n";
            var map = MapFileParser.Parse(text);
            Assert.True(map.Entities[0].Brushes[0].IsNonSolid, "all-trigger brush should be non-solid");
        }

        [Fact]
        public void EntityManipulationRoundTrip()
        {
            string text =
                "{\n\"classname\" \"worldspawn\"\n}\n" +
                "{\n\"classname\" \"light\"\n\"origin\" \"0 0 100\"\n\"light\" \"300\"\n}\n" +
                "{\n\"classname\" \"light\"\n\"origin\" \"0 0 200\"\n\"light\" \"500\"\n}\n" +
                "{\n\"classname\" \"info_player_start\"\n\"origin\" \"0 0 0\"\n}\n";
            var map = MapFileParser.Parse(text);
            // Remove all lights
            map.Entities.RemoveAll(e => e.ClassName == "light");
            Assert.Equal(2, map.Entities.Count);
            // Add a new light
            var newLight = new MapEntity();
            newLight.SetKey("classname", "light");
            newLight.SetKey("origin", "50 50 50");
            newLight.SetKey("light", "750");
            newLight.SetKey("_color", "1 0.5 0.2");
            map.Entities.Add(newLight);
            string emitted = MapFileWriter.ToText(map);
            var roundtrip = MapFileParser.Parse(emitted);
            Assert.Equal(3, roundtrip.Entities.Count);
            var l = roundtrip.Entities.FirstOrDefault(e => e.ClassName == "light");
            Assert.NotNull(l);
            Assert.Equal("750", l!.GetKey("light"));
            Assert.Equal("1 0.5 0.2", l.GetKey("_color"));
        }
    }
}
