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
        public Vector3 Albedo { get; init; } = new Vector3(1, 1, 1); // P1.3: material diffuse colour (default white)
        public int AtlasIndex { get; init; }
        public int AtlasX { get; init; }
        public int AtlasY { get; init; }
        public byte LightmapStyle { get; init; }        // 0 = normal, 0xFF = LS_NONE, etc.

        /// <summary>Cluster id of the BSP leaf containing <see cref="World"/>. Populated by
        /// <c>TexelSampler.Sample</c> when a <c>BspCollision</c> is supplied; used by the
        /// visibility-aware estimator to gate "can this candidate light see this texel?"
        /// via <c>BspVis.CanSee</c>. A value of <c>-2</c> means "not computed".</summary>
        public int Cluster { get; init; } = -2;

        public float Brightness => 0.2126f * Observed.X + 0.7152f * Observed.Y + 0.0722f * Observed.Z;
    }
}
