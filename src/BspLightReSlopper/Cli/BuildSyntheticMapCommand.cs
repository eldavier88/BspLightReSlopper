using System;
using System.IO;
using System.Numerics;
using BspLightReSlopper.MapFile;
using MapFileT = BspLightReSlopper.MapFile.MapFile;

namespace BspLightReSlopper.Cli
{
    /// <summary>
    /// Internal/diagnostic CLI for generating a single-box <c>.map</c> at a chosen position
    /// and size. Used during Phase B4 to isolate <see cref="BrushBuilder"/> vs <c>q3map2</c>
    /// compatibility issues. Not part of the user-facing workflow but kept around because
    /// it's useful for any future brush-format regressions.
    /// </summary>
    public static class BuildSyntheticMapCommand
    {
        public static int Run(CliArgs args)
        {
            string outPath = args.Require("out");
            float lx = float.Parse(args.Get("lo-x") ?? "-64", System.Globalization.CultureInfo.InvariantCulture);
            float ly = float.Parse(args.Get("lo-y") ?? "-64", System.Globalization.CultureInfo.InvariantCulture);
            float lz = float.Parse(args.Get("lo-z") ?? "0",  System.Globalization.CultureInfo.InvariantCulture);
            float hx = float.Parse(args.Get("hi-x") ?? "64",  System.Globalization.CultureInfo.InvariantCulture);
            float hy = float.Parse(args.Get("hi-y") ?? "64",  System.Globalization.CultureInfo.InvariantCulture);
            float hz = float.Parse(args.Get("hi-z") ?? "16",  System.Globalization.CultureInfo.InvariantCulture);
            string shader = args.Get("shader") ?? "test/floor";
            bool hollow = args.Flag("hollow");

            var map = new MapFileT();
            var ws = new MapEntity();
            ws.SetKey("classname", "worldspawn");
            if (hollow)
            {
                foreach (var b in BrushBuilder.HollowRoom(new Vector3(lx, ly, lz), new Vector3(hx, hy, hz), shader: shader))
                    ws.Brushes.Add(b);
            }
            else
            {
                ws.Brushes.Add(BrushBuilder.Box(new Vector3(lx, ly, lz), new Vector3(hx, hy, hz), shader));
            }
            map.Entities.Add(ws);

            var spawn = new MapEntity();
            spawn.SetKey("classname", "info_player_start");
            spawn.SetKey("origin", $"{(lx + hx) / 2f} {(ly + hy) / 2f} {hz + 32f}");
            map.Entities.Add(spawn);

            MapFileWriter.Write(outPath, map);
            Console.WriteLine($"wrote {outPath}");
            return 0;
        }
    }
}
