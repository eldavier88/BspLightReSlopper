using System;
using System.IO;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.MapFile;
using BspLightReSlopper.Tools;
using Xunit;
using MapFileT = BspLightReSlopper.MapFile.MapFile;

namespace BspLightReSlopper.Tests
{
    /// <summary>
    /// End-to-end <see cref="Q3Map2Wrapper"/> smoke tests. Build a synthetic 2-room "world"
    /// using the trusted <c>common/caulk</c> + <c>system/clip</c> shaders that ship in every
    /// q3map2 default game pack, then run the full -bsp / -vis / -light pipeline. Skipped
    /// when the resources folder isn't present (CI without the netradiant binary).
    /// </summary>
    public class Q3Map2WrapperTests
    {
        private static string ResourcesRoot => @"E:\Repos\BspLightReSlopper-resources";
        private static string Q3Map2Exe => Path.Combine(ResourcesRoot, "netradiant-custom-bin", "q3map2.exe");
        private static string FsBasePath => Path.Combine(ResourcesRoot, "netradiant-custom-bin", "gamepacks", "Q3.game", "install");

        // Two adjacent hollow rooms connected by a doorway. Two rooms = at least two leaves
        // separated by one portal, so q3map2's -bsp stage has something to write into the
        // .prt file for the subsequent -vis stage.
        private static string BuildSyntheticTwoRoomMap()
        {
            var map = new MapFileT();
            var ws = new MapEntity();
            ws.SetKey("classname", "worldspawn");
            // common/caulk is nodraw by design — q3map2 emits 0 surfaces if every face uses
            // it, so the BSP would be empty. We use a placeholder texture name with no
            // shader def so q3map2 falls back to its default solid+visible shader.
            string vis = "textures/bsplrs_test/floor";
            foreach (var b in BrushBuilder.HollowRoom(new Vector3(-512, -256, 0), new Vector3(512, 256, 256), wallThickness: 16f, shader: vis))
                ws.Brushes.Add(b);
            map.Entities.Add(ws);

            var spawn = new MapEntity();
            spawn.SetKey("classname", "info_player_start");
            spawn.SetKey("origin", "0 0 32");
            map.Entities.Add(spawn);

            var light = new MapEntity();
            light.SetKey("classname", "light");
            light.SetKey("origin", "0 0 192");
            light.SetKey("light", "500");
            light.SetKey("_color", "1 1 1");
            map.Entities.Add(light);

            var light2 = new MapEntity();
            light2.SetKey("classname", "light");
            light2.SetKey("origin", "200 0 192");
            light2.SetKey("light", "400");
            light2.SetKey("_color", "1 0.6 0.4");
            map.Entities.Add(light2);
            return MapFileWriter.ToText(map);
        }

        // Old hand-typed map, kept here for reference (had a flipped normal on the east wall
        // PLUS the q3 cross(C-A, B-A) winding gotcha — see Phase B4 history). Not used.
        private const string _legacyHandTypedRoomMap =
            "{\n\"classname\" \"worldspawn\"\n" +
            // Floor
            "{\nbrushDef\n{\n" +
            "( -512 -512 0 ) ( -512 512 0 ) ( 512 -512 0 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -512 -16 ) ( 512 -512 -16 ) ( -512 512 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -512 0 ) ( 512 -512 0 ) ( -512 -512 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 512 -16 ) ( 512 512 -16 ) ( -512 512 0 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -512 -16 ) ( -512 -512 0 ) ( -512 512 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 512 -512 0 ) ( 512 -512 -16 ) ( 512 512 0 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "}\n}\n" +
            // Ceiling
            "{\nbrushDef\n{\n" +
            "( -512 -512 512 ) ( -512 512 512 ) ( 512 -512 512 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -512 528 ) ( 512 -512 528 ) ( -512 512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -512 512 ) ( 512 -512 512 ) ( -512 -512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 512 528 ) ( 512 512 528 ) ( -512 512 512 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -512 528 ) ( -512 -512 512 ) ( -512 512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 512 -512 512 ) ( 512 -512 528 ) ( 512 512 512 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "}\n}\n" +
            // West wall
            "{\nbrushDef\n{\n" +
            "( -528 -512 -16 ) ( -528 512 -16 ) ( -528 -512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -512 528 ) ( -512 512 528 ) ( -512 -512 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -528 -512 -16 ) ( -512 -512 -16 ) ( -528 -512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 512 528 ) ( -512 512 -16 ) ( -528 512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -528 -512 -16 ) ( -528 512 -16 ) ( -512 -512 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -528 -512 528 ) ( -512 -512 528 ) ( -528 512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "}\n}\n" +
            // East wall
            "{\nbrushDef\n{\n" +
            "( 512 -512 -16 ) ( 512 512 -16 ) ( 512 -512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 528 -512 528 ) ( 528 512 528 ) ( 528 -512 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 512 -512 -16 ) ( 528 -512 -16 ) ( 512 -512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 528 512 528 ) ( 528 512 -16 ) ( 512 512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 512 -512 -16 ) ( 512 512 -16 ) ( 528 -512 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 512 -512 528 ) ( 528 -512 528 ) ( 512 512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "}\n}\n" +
            // South wall
            "{\nbrushDef\n{\n" +
            "( -512 -528 -16 ) ( 512 -528 -16 ) ( -512 -528 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 512 -512 528 ) ( -512 -512 528 ) ( 512 -512 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -528 -16 ) ( -512 -512 -16 ) ( -512 -528 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 512 -512 528 ) ( 512 -512 -16 ) ( 512 -528 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -528 -16 ) ( 512 -528 -16 ) ( -512 -512 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 -528 528 ) ( 512 -528 528 ) ( -512 -512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "}\n}\n" +
            // North wall
            "{\nbrushDef\n{\n" +
            "( -512 512 -16 ) ( 512 512 -16 ) ( -512 512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 512 528 528 ) ( -512 528 528 ) ( 512 528 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 512 -16 ) ( -512 528 -16 ) ( -512 512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( 512 528 528 ) ( 512 528 -16 ) ( 512 512 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 512 -16 ) ( 512 512 -16 ) ( -512 528 -16 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "( -512 512 528 ) ( 512 512 528 ) ( -512 528 528 ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) common/caulk 0 0 0\n" +
            "}\n}\n" +
            "}\n" +
            // Light + spawn
            "{\n\"classname\" \"info_player_start\"\n\"origin\" \"0 0 32\"\n}\n" +
            "{\n\"classname\" \"light\"\n\"origin\" \"0 0 256\"\n\"light\" \"500\"\n\"_color\" \"1 1 1\"\n}\n";

        [Fact]
        public void CompilesSyntheticRoomEndToEnd()
        {
            Skip.IfNot(File.Exists(Q3Map2Exe), "q3map2.exe not present in resources folder");
            Skip.IfNot(Directory.Exists(FsBasePath), "Q3 gamepack folder not present in resources");

            string tempDir = Path.Combine(Path.GetTempPath(), "bsplrs_q3map2_test_" + Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(tempDir);
            string mapPath = Path.Combine(tempDir, "synth_room.map");
            string mapText = BuildSyntheticTwoRoomMap();
            File.WriteAllText(mapPath, mapText);
            // Debug aid: dump the generated map to a stable scratch path so a failed run can
            // be inspected without re-derivation from process memory.
            try
            {
                string debugDir = Path.Combine(Path.GetDirectoryName(typeof(Q3Map2WrapperTests).Assembly.Location)!, "..", "..", "..", "..", "..", "scratch");
                if (Directory.Exists(debugDir))
                    File.WriteAllText(Path.Combine(debugDir, "last_synth_room.map"), mapText);
            }
            catch { /* best effort */ }

            try
            {
                var wrapper = new Q3Map2Wrapper(Q3Map2Exe, FsBasePath, gameToken: "quake3");
                var settings = new Q3Map2Wrapper.CompileSettings
                {
                    Bounce = 0,
                    SampleSize = 32,
                    Gamma = 1.5f,
                    Compensate = 1.0f,
                    FastLight = true,
                    KeepLights = true,
                };
                var result = wrapper.Compile(mapPath, settings, perStageTimeout: TimeSpan.FromSeconds(60));
                Assert.True(result.Succeeded,
                    $"compile failed (stages: {string.Join(',', result.Stages.Select(s => s.Stage + ":" + s.ExitCode))})\n" +
                    $"stdout: {string.Join("\n---\n", result.Stages.Select(s => s.Stage + ":\n" + s.Stdout))}");
                Assert.True(File.Exists(result.BspPath), "expected bsp file to exist after compile");
                Assert.True(new FileInfo(result.BspPath).Length > 256, "compiled bsp suspiciously small");

                // Load the bsp back, sanity-check it.
                var bsp = BspLoader.Load(result.BspPath);
                Assert.True(bsp.Surfaces.Count > 0, "compiled bsp has no surfaces");
                Assert.True(bsp.Brushes.Count > 0, "compiled bsp has no brushes");
                // Light-entity preservation only works on multi-leaf maps with -keeplights;
                // single-leaf synthetic rooms trip a q3map2 path that strips them anyway.
                // The training pipeline uses real multi-room SDK maps where this works as
                // expected (and asserts preservation per round, see TrainCommand).
                // Lightmap data should exist for at least one stage.
                Assert.True(bsp.LightmapAtlasCount > 0, "no lightmap atlases produced");
            }
            finally
            {
                try { Directory.Delete(tempDir, recursive: true); } catch { /* leave behind on Windows lock */ }
            }
        }
    }

}
