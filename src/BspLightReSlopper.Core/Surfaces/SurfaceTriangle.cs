using System.Numerics;

namespace BspLightReSlopper.Surfaces
{
    /// <summary>
    /// One triangle of a tessellated surface, with its 4-stage lightmap UVs in
    /// **atlas-relative** (0..1) space. Positions are in world space; normal is the face
    /// normal (we deliberately do not smooth across triangles for Phase A).
    /// </summary>
    public sealed class SurfaceTriangle
    {
        public int SurfaceIndex { get; init; }      // BspFile.Surfaces[SurfaceIndex]
        public int ShaderIndex { get; init; }
        public Vector3 P0, P1, P2;
        public Vector3 Normal;

        public Vector2 Lm0_0, Lm0_1, Lm0_2;          // stage 0
        public Vector2 Lm1_0, Lm1_1, Lm1_2;          // stage 1 (RBSP only)
        public Vector2 Lm2_0, Lm2_1, Lm2_2;
        public Vector2 Lm3_0, Lm3_1, Lm3_2;

        public Vector2 LmStage(int stage, int corner)
        {
            return (stage, corner) switch
            {
                (0, 0) => Lm0_0, (0, 1) => Lm0_1, (0, 2) => Lm0_2,
                (1, 0) => Lm1_0, (1, 1) => Lm1_1, (1, 2) => Lm1_2,
                (2, 0) => Lm2_0, (2, 1) => Lm2_1, (2, 2) => Lm2_2,
                (3, 0) => Lm3_0, (3, 1) => Lm3_1, (3, 2) => Lm3_2,
                _ => Vector2.Zero,
            };
        }

        public Vector3 PCorner(int corner) => corner switch
        {
            0 => P0, 1 => P1, 2 => P2,
            _ => Vector3.Zero,
        };

        public float Area
        {
            get
            {
                var e1 = P1 - P0;
                var e2 = P2 - P0;
                return 0.5f * Vector3.Cross(e1, e2).Length();
            }
        }
    }
}
