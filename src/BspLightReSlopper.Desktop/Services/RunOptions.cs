namespace BspLightReSlopper.Desktop.Services
{
    /// <summary>
    /// Full set of estimator/pipeline parameters. Mirrors every CLI flag in
    /// <c>EstimateCommand</c>. Built from <see cref="AppSettings"/> + the currently
    /// selected BSP path + the chosen output paths.
    /// </summary>
    public sealed class RunOptions
    {
        // ---- Inputs ----
        /// <summary>Local path to the .bsp (or "archive.pk3!maps/foo.bsp" syntax).</summary>
        public string BspInput { get; init; } = string.Empty;

        /// <summary>Optional asset (PK3) directory; null = white-albedo fallback.</summary>
        public string? AssetsDirectory { get; init; }

        // ---- Outputs ----
        public string OutEntPath { get; init; } = string.Empty;
        public string LogPath { get; init; } = string.Empty;

        // ---- Sampling / estimator ----
        public int MaxLights { get; init; } = 64;
        public int MaxSamples { get; init; } = 200_000;
        public int Pivots { get; init; } = 800;
        public int Seed { get; init; } = 42;
        public bool HalfLambert { get; init; }
        public bool InferAngleModel { get; init; } = true;
        public bool NoVis { get; init; }

        // ---- Post-process ----
        public bool NoBounceSuppress { get; init; }
        public bool MinimizeLights { get; init; }
        public float MinimizeLightsTolerance { get; init; } = 0.02f;
        public bool RefineLights { get; init; }
        public int RefinePasses { get; init; } = 3;
        public float RefineStep { get; init; } = 32f;

        // ---- Classification / output ----
        public bool NoClassify { get; init; }
        public bool NoSun { get; init; }
        public bool EmitSkyShader { get; init; }

        // ---- Recompile-refine ----
        public int RecompileRefineIterations { get; init; }
        public string? RecompileRefineMapPath { get; init; }
        public string? Q3Map2Path { get; init; }
        public string? BasePath { get; init; }
        public string GameToken { get; init; } = "jk2";
        public int RefineTimeoutMins { get; init; } = 10;
    }
}
