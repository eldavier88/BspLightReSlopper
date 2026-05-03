using System.Collections.Generic;

namespace BspLightReSlopper.Desktop.Services
{
    /// <summary>
    /// Persisted settings for the Desktop GUI. Stored as JSON in
    /// <c>%APPDATA%/BspLightReSlopper/settings.json</c>. All fields are nullable / have
    /// safe defaults so missing-keys never crash on load.
    /// </summary>
    public sealed class AppSettings
    {
        // ---- External tooling (recompile-refine) ----
        public string? Q3Map2Path { get; set; }
        public string? BasePath { get; set; }
        public string GameToken { get; set; } = "jk2";

        // ---- Asset stack (PK3 directory for albedo cache) ----
        public string? AssetsDirectory { get; set; }

        // ---- Last estimator parameters ----
        public bool HalfLambert { get; set; }
        public bool InferAngleModel { get; set; } = true;
        public bool NoBounceSuppress { get; set; }
        public bool NoVis { get; set; }
        public bool NoClassify { get; set; }
        public bool NoSun { get; set; }
        public bool EmitSkyShader { get; set; }
        public bool MinimizeLights { get; set; }
        public float MinimizeLightsTolerance { get; set; } = 0.02f;
        public bool RefineLights { get; set; }
        public int RefinePasses { get; set; } = 3;
        public float RefineStep { get; set; } = 32f;
        public int RecompileRefineIterations { get; set; }
        public string? RecompileRefineMapPath { get; set; }
        public int MaxLights { get; set; } = 64;
        public int MaxSamples { get; set; } = 200_000;
        public int Pivots { get; set; } = 800;
        public int Seed { get; set; } = 42;

        // ---- Window state ----
        public double WindowWidth { get; set; } = 1280;
        public double WindowHeight { get; set; } = 800;
        public double? WindowX { get; set; }
        public double? WindowY { get; set; }
        public bool WindowMaximized { get; set; }

        // ---- Recent files (most-recent first, max 8) ----
        public List<string> RecentFiles { get; set; } = new();

        // ---- Viewer state ----
        public string ViewerRenderMode { get; set; } = "lightmap"; // lightmap | shaded | wireframe | normals
        public bool ShowLights { get; set; } = true;
        public bool ShowSpotCones { get; set; } = true;
        public bool ShowGroundTruth { get; set; } = true;
        public float ViewerLightmapOverbright { get; set; } = 2.0f;
        public bool ViewerLightmapGamma { get; set; } = true;
    }
}
