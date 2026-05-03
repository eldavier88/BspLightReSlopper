using System;
using System.IO;
using BspLightReSlopper.Tools;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Cli
{
    /// <summary>
    /// CLI entry point for the Phase B training loop. Each round: scatter random lights into
    /// a copy of the source .map, recompile with a randomized settings matrix, run the
    /// estimator, score against the recompiled BSP's ground-truth lights, append a row to
    /// <c>train.csv</c>.
    ///
    /// <example>
    /// bsplrs train --source-map ja_examples/jk_yav1.map
    ///              --base-path ~/jka-resources/install
    ///              --q3map2 ~/netradiant-custom/q3map2.exe
    ///              --rounds 16 --out scratch/train01
    /// </example>
    /// </summary>
    public static class TrainCommand
    {
        public static int Run(CliArgs args)
        {
            string sourceMap = args.Require("source-map");
            string fsBase    = args.Require("base-path");
            string q3map2    = args.Require("q3map2");
            string outDir    = args.Require("out");
            string fsGame    = args.Get("fs-game") ?? "";
            string game      = args.Get("game") ?? "jk2";
            int rounds       = int.TryParse(args.Get("rounds"), out int r) ? r : 8;
            int seed         = int.TryParse(args.Get("seed"), out int s) ? s : 42;
            int lightsPerRound = int.TryParse(args.Get("lights"), out int l) ? l : 24;
            float matchTol   = float.TryParse(args.Get("match-tolerance"), out float mt) ? mt : 256f;
            int timeoutSecs  = int.TryParse(args.Get("timeout"), out int t) ? t : 300;

            Directory.CreateDirectory(outDir);
            using var log = new Logger(Console.Out, Path.Combine(outDir, "train.log"));
            log.Section("train");
            log.Info($"source-map:  {sourceMap}");
            log.Info($"base-path:   {fsBase}");
            log.Info($"q3map2:      {q3map2}");
            log.Info($"out:         {outDir}");
            log.Info($"rounds:      {rounds} (seed={seed})");
            log.Info($"lights/round:{lightsPerRound}");
            log.Info($"match-tol:   {matchTol} u");
            log.Info($"timeout:     {timeoutSecs} s/stage");

            var result = TrainingDriver.Run(new TrainingDriver.Options
            {
                SourceMapPath = sourceMap,
                FsBasePath = fsBase,
                FsGame = fsGame,
                GameToken = game,
                Q3Map2Exe = q3map2,
                OutDir = outDir,
                Rounds = rounds,
                RandomSeed = seed,
                LightsPerRound = lightsPerRound,
                MatchTolerance = matchTol,
                PerStageTimeout = TimeSpan.FromSeconds(timeoutSecs),
            }, log);

            log.Section("training summary");
            log.Info($"rounds attempted: {result.RoundsAttempted}");
            log.Info($"rounds scored:    {result.RoundsScored}");
            log.Info($"mean recall:      {result.MeanRecall:P1}");
            log.Info($"mean precision:   {result.MeanPrecision:P1}");
            log.Info($"mean posErrMedian:{result.MeanPositionErrorMedian:F0} u");
            log.Info($"total elapsed:    {result.TotalElapsed.TotalSeconds:F1} s");
            log.Info("CSV: " + Path.Combine(outDir, "train.csv"));

            return result.RoundsScored == 0 ? 1 : 0;
        }
    }
}
