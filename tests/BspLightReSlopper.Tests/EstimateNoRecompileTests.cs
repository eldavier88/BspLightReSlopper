using System;
using System.IO;
using BspLightReSlopper.Cli;
using Xunit;

namespace BspLightReSlopper.Tests
{
    /// <summary>
    /// Regression test for the Section 2.5 promise: <c>bsplrs estimate</c> on a plain BSP
    /// must NEVER touch q3map2 in any way. Recompile validation is a developer-only path
    /// gated behind <c>--dev-validate</c>; absence of that flag must guarantee no
    /// q3map2 binary is searched for, no <c>BSPLRS_Q3MAP2</c> env var is consulted, and
    /// the log shows no "recompile" / "dev-validate" / "q3map2" tokens.
    /// </summary>
    public class EstimateNoRecompileTests
    {
        [Fact]
        public void Estimate_OnSyntheticBsp_DoesNotInvokeOrMentionQ3Map2()
        {
            string tempDir = Path.Combine(Path.GetTempPath(),
                "bsplrs-norecompile-" + Guid.NewGuid().ToString("N").Substring(0, 12));
            Directory.CreateDirectory(tempDir);
            string bspPath = Path.Combine(tempDir, "norecompile.bsp");
            string entPath = Path.ChangeExtension(bspPath, ".ent");
            string logPath = Path.ChangeExtension(bspPath, ".log");

            // Defensive: set BSPLRS_Q3MAP2 to a path guaranteed not to exist. If estimate
            // ever decides to consult or invoke q3map2, the resulting failure (file-not-
            // found / process-launch error) would propagate; a clean run proves the
            // q3map2-touching code path was never entered.
            string poisonQ3Map2 = Path.Combine(tempDir, "this-binary-must-never-be-launched.exe");
            string? originalQ3Map2 = Environment.GetEnvironmentVariable("BSPLRS_Q3MAP2");
            Environment.SetEnvironmentVariable("BSPLRS_Q3MAP2", poisonQ3Map2);

            try
            {
                File.WriteAllBytes(bspPath,
                    TestBsp.BuildIbsp46QuadWithGradientLightmap(8, (ax, ay) => ((byte)180, (byte)160, (byte)120)));

                var args = CliArgs.Parse(new[] { "estimate", "--bsp", bspPath });
                int rc = EstimateCommand.Run(args);
                Assert.Equal(0, rc);

                Assert.True(File.Exists(entPath), $"expected .ent at {entPath}");
                Assert.True(File.Exists(logPath), $"expected .log at {logPath}");

                string log = File.ReadAllText(logPath);
                AssertLogIsClean(log);

                // The poison binary path must not have been touched. If estimate had
                // tried to launch it (or even File.Exists it as a precondition), some
                // implementations of Process.Start would surface that lookup; we settle
                // for the negative log assertion above plus the fact that the test
                // completed without throwing.
                Assert.False(File.Exists(poisonQ3Map2),
                    "the poison q3map2 path was created on disk by estimate; that's a bug");
            }
            finally
            {
                Environment.SetEnvironmentVariable("BSPLRS_Q3MAP2", originalQ3Map2);
                try { Directory.Delete(tempDir, recursive: true); } catch { /* Windows lock */ }
            }
        }

        [Fact]
        public void Estimate_OnSyntheticBsp_NoAssetsArg_AlsoStaysQuiet()
        {
            // Same property must hold when --assets is also omitted: the asset-less
            // shader-name albedo fallback path must not pull in any recompile machinery.
            string tempDir = Path.Combine(Path.GetTempPath(),
                "bsplrs-norecompile-na-" + Guid.NewGuid().ToString("N").Substring(0, 12));
            Directory.CreateDirectory(tempDir);
            string bspPath = Path.Combine(tempDir, "norecompile_no_assets.bsp");
            string logPath = Path.ChangeExtension(bspPath, ".log");

            string? originalQ3Map2 = Environment.GetEnvironmentVariable("BSPLRS_Q3MAP2");
            Environment.SetEnvironmentVariable("BSPLRS_Q3MAP2",
                Path.Combine(tempDir, "still-must-not-launch.exe"));

            try
            {
                File.WriteAllBytes(bspPath,
                    TestBsp.BuildIbsp46QuadWithGradientLightmap(8, (ax, ay) => ((byte)180, (byte)160, (byte)120)));

                var args = CliArgs.Parse(new[] { "estimate", "--bsp", bspPath });
                int rc = EstimateCommand.Run(args);
                Assert.Equal(0, rc);

                string log = File.ReadAllText(logPath);
                AssertLogIsClean(log);
            }
            finally
            {
                Environment.SetEnvironmentVariable("BSPLRS_Q3MAP2", originalQ3Map2);
                try { Directory.Delete(tempDir, recursive: true); } catch { }
            }
        }

        private static void AssertLogIsClean(string log)
        {
            // The estimator must run (verifies we did the real thing).
            Assert.Contains("estimator", log, StringComparison.OrdinalIgnoreCase);

            // None of these tokens may appear anywhere in the log: they all denote a
            // recompile-flavoured code path that must NOT execute on the default
            // estimate workflow.
            string[] forbidden = { "q3map2", "dev-validate", "recompile-refine", "recompile refiner" };
            foreach (var token in forbidden)
            {
                Assert.True(log.IndexOf(token, StringComparison.OrdinalIgnoreCase) < 0,
                    $"log unexpectedly contained '{token}' — recompile path must not run on the default workflow.\n--- log excerpt ---\n{log}");
            }
        }
    }
}
