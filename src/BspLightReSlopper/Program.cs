using System;

namespace BspLightReSlopper
{
    public static class Program
    {
        public static int Main(string[] args)
        {
            Console.WriteLine("bsplrs " + Version.String);
            Console.WriteLine("(Phase A bootstrap - sub-commands not yet wired)");
            if (args.Length == 0)
            {
                Console.WriteLine();
                Console.WriteLine("usage: bsplrs <command> [options]");
                Console.WriteLine();
                Console.WriteLine("commands:");
                Console.WriteLine("  estimate    estimate light entities from a baked .bsp");
                Console.WriteLine("  verify      score estimator against ground-truth lights in JK2 base maps");
                Console.WriteLine("  inspect-bsp dump bsp lump info, entity list, lightmap stage count");
                Console.WriteLine("  train       (Phase B) random scatter + recompile training loop");
                Console.WriteLine("  help        show this help");
                return 0;
            }
            Console.WriteLine("(unknown command: " + args[0] + ")");
            return 1;
        }
    }

    internal static class Version
    {
        public const string String = "0.1.0-phase-a";
    }
}
