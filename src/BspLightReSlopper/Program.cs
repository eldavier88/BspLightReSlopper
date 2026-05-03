using System;
using BspLightReSlopper.Cli;

namespace BspLightReSlopper
{
    public static class Program
    {
        public static int Main(string[] args)
        {
            try
            {
                var parsed = CliArgs.Parse(args);
                return parsed.Command switch
                {
                    "estimate"             => EstimateCommand.Run(parsed),
                    "verify"               => VerifyCommand.Run(parsed),
                    "inspect-bsp"          => InspectBspCommand.Run(parsed),
                    "scatter"              => ScatterCommand.Run(parsed),
                    "train"                => TrainCommand.Run(parsed),
                    "dump-samples"         => DumpSamplesCommand.Run(parsed),
                    "build-synthetic-map"  => BuildSyntheticMapCommand.Run(parsed),
                    "converge"             => ConvergeCommand.Run(parsed),
                    "help"                 => PrintHelp(),
                    "--help"               => PrintHelp(),
                    "-h"                   => PrintHelp(),
                    _ => UnknownCommand(parsed.Command),
                };
            }
            catch (ArgumentException ex)
            {
                Console.Error.WriteLine("error: " + ex.Message);
                return 64;
            }
            catch (System.IO.FileNotFoundException ex)
            {
                Console.Error.WriteLine("error: " + ex.Message);
                return 66;
            }
            catch (System.IO.InvalidDataException ex)
            {
                Console.Error.WriteLine("error: " + ex.Message);
                return 65;
            }
        }

        private static int PrintHelp()
        {
            Console.WriteLine("bsplrs " + Version.String);
            Console.WriteLine();
            Console.WriteLine("usage: bsplrs <command> [options]");
            Console.WriteLine();
            Console.WriteLine("commands:");
            Console.WriteLine("  estimate    --bsp <path | path.pk3!maps/foo.bsp>");
            Console.WriteLine();
            Console.WriteLine("              Quick start: 'bsplrs estimate --bsp foo.bsp' is enough.");
            Console.WriteLine("              All flags below are optional; sophisticated defaults run by default.");
            Console.WriteLine();
            Console.WriteLine("              Inputs:");
            Console.WriteLine("                [--assets <dir>]         folder with game .pk3s; improves bounce");
            Console.WriteLine("                                         suppression but a shader-name albedo");
            Console.WriteLine("                                         heuristic runs as fallback when omitted");
            Console.WriteLine("                [-o <out.ent>] [--log <log>]");
            Console.WriteLine();
            Console.WriteLine("              Tuning (all auto-derived from BSP if not set):");
            Console.WriteLine("                [--max-samples N] [--pivots N] [--max-lights N] [--seed N]");
            Console.WriteLine("                [--minimize-lights-tolerance F]");
            Console.WriteLine("                [--refine-passes N] [--refine-step U]");
            Console.WriteLine();
            Console.WriteLine("              Smart defaults (on automatically; opt-out with --no-*):");
            Console.WriteLine("                [--no-half-lambert]      angle model auto-detected from lightmap");
            Console.WriteLine("                [--no-minimize-lights]   greedy L0 light-count reduction");
            Console.WriteLine("                [--no-refine-lights]     photometric coordinate descent polish");
            Console.WriteLine("                [--no-vis]               PVS-aware estimation");
            Console.WriteLine("                [--no-bounce-suppress]   bounce-fit false-positive rejection");
            Console.WriteLine("                [--no-classify]          point/spot/linear classification");
            Console.WriteLine("                [--no-sun]               sun detection");
            Console.WriteLine("                [--emit-sky-shader]      write companion .sky.shader for detected sun");
            Console.WriteLine();
            Console.WriteLine("              Developer-only (NOT REQUIRED FOR NORMAL USE):");
            Console.WriteLine("                [--dev-validate N --map <src.map> --q3map2 <exe> --base-path <dir>]");
            Console.WriteLine("                                         closed-loop recompile validation; used by");
            Console.WriteLine("                                         the algorithm author during development.");
            Console.WriteLine("                                         Normal estimate workflow does NOT need q3map2.");
            Console.WriteLine();
            Console.WriteLine("  verify      --assets <dir> [--maps a,b,c | (default: all assets/maps/*.bsp)]");
            Console.WriteLine("              [--match-tolerance <units>] [--out <dir>]");
            Console.WriteLine();
            Console.WriteLine("  inspect-bsp --assets <dir> --bsp <path | path.pk3!maps/foo.bsp>");
            Console.WriteLine();
            Console.WriteLine("  scatter     --map <src.map> --bsp <src.bsp> --out <scatter.map>");
            Console.WriteLine("              [--count N] [--seed N] [--clearance U]");
            Console.WriteLine("              [--min-intensity I] [--max-intensity I]");
            Console.WriteLine("              [--colored-fraction F] [--linear-fraction F] [--spot-fraction F]");
            Console.WriteLine();
            Console.WriteLine("  train       --source-map <src.map> --base-path <fs_basepath>");
            Console.WriteLine("              --q3map2 <q3map2.exe> --out <dir>");
            Console.WriteLine("              [--rounds N] [--seed N] [--lights N]");
            Console.WriteLine("              [--match-tolerance U] [--timeout SECS] [--game jk2|ja|quake3]");
            Console.WriteLine();
            Console.WriteLine("  dump-samples --bsp <path> --out <samples.csv>");
            Console.WriteLine("               [--assets <dir>] [--max-samples N]");
            Console.WriteLine("               Diagnostic: dump every TexelSample to CSV.");
            Console.WriteLine();
            Console.WriteLine("  converge     --assets <dir> --base-path <fs_basepath> --q3map2 <exe>");
            Console.WriteLine("               [--resources <dir>] [--maps-index <jk2-sdk-maps.txt>]");
            Console.WriteLine("               [--out <dir>] [--max-maps N] [--timeout-mins N] [--game jk2]");
            Console.WriteLine("               [--iterate N] [--iterate-step U]");
            Console.WriteLine("               SDK .map round-trip: estimate, relight, perceptual loss report.");
            Console.WriteLine("               --iterate enables RecompileRefiner (closed-loop perceptual MSE).");
            Console.WriteLine();
            Console.WriteLine("  build-synthetic-map  --out <map> [--kind room|tunnel] [--size U]");
            Console.WriteLine("                       Generates a tiny test .map for diagnostics.");
            Console.WriteLine();
            Console.WriteLine("  help");
            Console.WriteLine();
            Console.WriteLine("See docs/metrics.md for recall, precision, perceptual loss, and related terms.");
            return 0;
        }

        private static int UnknownCommand(string c)
        {
            Console.Error.WriteLine("unknown command: " + c);
            Console.Error.WriteLine("run 'bsplrs help' for usage");
            return 64;
        }
    }

    internal static class Version
    {
        public const string String = "0.3.0";
    }
}
