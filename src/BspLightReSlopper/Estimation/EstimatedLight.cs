using System.Numerics;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// One light hypothesis produced by the estimator. The estimator's per-channel
    /// intensity LSQ produces a 3-vector "irradiance" which we split into a normalised
    /// chroma <see cref="Color"/> and a scalar <see cref="Intensity"/> (the max channel).
    /// </summary>
    public sealed class EstimatedLight
    {
        public Vector3 Origin { get; init; }
        public Vector3 Color { get; init; } = Vector3.One;       // chroma, normalised to max=1
        public float Intensity { get; init; }                     // estimator-units (see geom factor docs)
        public float Confidence { get; init; }                    // [0,1], from explained-energy ratio
        public int SupportingTexels { get; init; }
        public float ResidualEnergyExplainedFraction { get; init; }
        public string Method { get; init; } = "ransac+greedy";
        public bool BlownOut { get; init; }
    }
}
