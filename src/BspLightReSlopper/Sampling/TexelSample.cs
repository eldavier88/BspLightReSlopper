using System.Numerics;

namespace BspLightReSlopper.Sampling
{
    /// <summary>
    /// One observed lightmap texel projected into world space. The estimator works on a
    /// flat list of these.
    ///
    /// <para><see cref="Observed"/> is the raw lightmap RGB normalised to 0..1 (no gamma
    /// decode applied — the heuristics + estimator decide what gamma curve to invert).</para>
    /// </summary>
    public sealed class TexelSample
    {
        public int SurfaceIndex { get; init; }
        public int ShaderIndex { get; init; }
        public int Stage { get; init; }                 // 0..3
        public Vector3 World { get; init; }
        public Vector3 Normal { get; init; }
        public Vector3 Observed { get; init; }          // 0..1 RGB (raw)
        public int AtlasIndex { get; init; }
        public int AtlasX { get; init; }
        public int AtlasY { get; init; }
        public byte LightmapStyle { get; init; }        // 0 = normal, 0xFF = LS_NONE, etc.

        public float Brightness => 0.2126f * Observed.X + 0.7152f * Observed.Y + 0.0722f * Observed.Z;
    }
}
