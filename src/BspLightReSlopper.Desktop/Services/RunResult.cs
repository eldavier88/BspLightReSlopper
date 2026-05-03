using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Heuristics;

namespace BspLightReSlopper.Desktop.Services
{
    /// <summary>One light + its classification result, ready for export.</summary>
    public sealed class ClassifiedLight
    {
        public EstimatedLight Light { get; init; } = null!;
        public LightTypeClassifier.Kind Kind { get; init; }
        public Vector3 SpotDirection { get; init; }
        public float SpotHalfAngleDegrees { get; init; }
    }

    /// <summary>Sun-detection summary (or null if none).</summary>
    public sealed class SunSummary
    {
        public Vector3 Direction { get; init; }
        public Vector3 Color { get; init; } = Vector3.One;
        public float Intensity { get; init; }
        public float Pitch { get; init; }
        public float Yaw { get; init; }
        public int SupportingSamples { get; init; }
        public float DominanceScore { get; init; }
    }

    /// <summary>Optional ground-truth comparison metrics.</summary>
    public sealed class GroundTruthSummary
    {
        public int TruthCount { get; init; }
        public int EstimatedCount { get; init; }
        public int MatchedCount { get; init; }
        public float Recall { get; init; }
        public float Precision { get; init; }
        public float MeanPositionError { get; init; }
        public float MedianPositionError { get; init; }
    }

    /// <summary>
    /// Full result of a single pipeline run. Survives the runner so the UI / viewer can
    /// render lights, the sun gizmo, and the comparison panel.
    /// </summary>
    public sealed class RunResult
    {
        public BspFile Bsp { get; init; } = null!;
        public string BspPath { get; init; } = string.Empty;
        public string OutEntPath { get; init; } = string.Empty;
        public string LogPath { get; init; } = string.Empty;

        /// <summary>Final lights after suppression / minimize / refine, with classification.</summary>
        public IReadOnlyList<ClassifiedLight> Lights { get; init; } = System.Array.Empty<ClassifiedLight>();

        /// <summary>Ground-truth lights extracted from the BSP entity lump (for viewer overlay).</summary>
        public IReadOnlyList<Vector3> GroundTruthOrigins { get; init; } = System.Array.Empty<Vector3>();
        public IReadOnlyList<Vector3> GroundTruthColors { get; init; } = System.Array.Empty<Vector3>();

        public SunSummary? Sun { get; init; }
        public GroundTruthSummary? Comparison { get; init; }

        public RoomDetector.Result? Rooms { get; init; }
        public IReadOnlyDictionary<string, string>? InferredCompile { get; init; }

        public int PointCount { get; init; }
        public int LinearCount { get; init; }
        public int SpotCount { get; init; }
        public int RoundsRun { get; init; }
        public int RoundsAccepted { get; init; }
        public float ElapsedSeconds { get; init; }

        /// <summary>Q3-scale calibration applied to intensities (for viewer gizmo sizing).</summary>
        public float ScaleToQ3 { get; init; } = 1f;
    }

    /// <summary>Progress event pushed to the UI on each pipeline stage transition.</summary>
    public sealed class RunProgress
    {
        public string Stage { get; init; } = string.Empty;
        public double OverallPercent { get; init; }
    }
}
