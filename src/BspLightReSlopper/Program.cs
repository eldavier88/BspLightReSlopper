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
            Console.WriteLine("  estimate    --assets <dir> --bsp <path | path.pk3!maps/foo.bsp>");
            Console.WriteLine("              [-o <out.ent>] [--log <log>]");
            Console.WriteLine("              [--max-samples N] [--pivots N] [--max-lights N] [--seed N]");
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
            Console.WriteLine("  help");
            Console.WriteLine();
            Console.WriteLine("Phase A status: estimator is the iterative-greedy RANSAC version. Patches");
            Console.WriteLine("are not yet tessellated; vertex-only lighting is not yet sampled.");
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
        public const string String = "0.1.0-phase-a";
    }
}
