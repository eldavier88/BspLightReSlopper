using System;
using System.Numerics;

namespace BspLightReSlopper.Bsp
{
    /// <summary>
    /// All BSP families we care about (Q3 IBSP, Raven RBSP, future) share the same lump
    /// vocabulary; lump-count is per-format. The values match the Q3 source layout for the
    /// shared lumps. Format-specific extras (e.g. RBSP's <c>LIGHTARRAY</c>) are exposed via
    /// <see cref="Formats.IBspFormat.LumpIndex"/>.
    /// </summary>
    public static class BspLumpKind
    {
        public const string Entities     = "entities";
        public const string Shaders      = "shaders";
        public const string Planes       = "planes";
        public const string Nodes        = "nodes";
        public const string Leafs        = "leafs";
        public const string LeafSurfaces = "leafSurfaces";
        public const string LeafBrushes  = "leafBrushes";
        public const string Models       = "models";
        public const string Brushes      = "brushes";
        public const string BrushSides   = "brushSides";
        public const string DrawVerts    = "drawVerts";
        public const string DrawIndexes  = "drawIndexes";
        public const string Fogs         = "fogs";
        public const string Surfaces     = "surfaces";
        public const string Lightmaps    = "lightmaps";
        public const string LightGrid    = "lightGrid";
        public const string Visibility   = "visibility";
        public const string LightArray   = "lightArray";    // RBSP only
    }

    public readonly struct Color32
    {
        public byte R { get; }
        public byte G { get; }
        public byte B { get; }
        public byte A { get; }

        public Color32(byte r, byte g, byte b, byte a) { R = r; G = g; B = b; A = a; }

        public static readonly Color32 Zero = new Color32(0, 0, 0, 0);

        /// <summary>
        /// Linearised, 0..1 normalised. Phase A treats the lightmap byte values as roughly
        /// gamma-encoded; the heuristics layer revisits the actual gamma per inferred
        /// compile setting. For now we just normalise.
        /// </summary>
        public Vector3 NormalisedRgb => new Vector3(R / 255f, G / 255f, B / 255f);
    }

    public sealed class BspShader
    {
        public string Name { get; init; } = string.Empty;
        public int SurfaceFlags { get; init; }
        public int ContentFlags { get; init; }
    }

    public readonly struct BspPlane
    {
        public Vector3 Normal { get; }
        public float Dist { get; }
        public BspPlane(Vector3 normal, float dist) { Normal = normal; Dist = dist; }
    }

    public readonly struct BspNode
    {
        public int PlaneIndex { get; }
        public int Child0 { get; }
        public int Child1 { get; }
        public Vector3 Mins { get; }
        public Vector3 Maxs { get; }
        public BspNode(int planeIndex, int child0, int child1, Vector3 mins, Vector3 maxs)
        {
            PlaneIndex = planeIndex; Child0 = child0; Child1 = child1; Mins = mins; Maxs = maxs;
        }
    }

    public sealed class BspLeaf
    {
        public int Cluster { get; init; }
        public int Area { get; init; }
        public Vector3 Mins { get; init; }
        public Vector3 Maxs { get; init; }
        public int FirstLeafSurface { get; init; }
        public int NumLeafSurfaces { get; init; }
        public int FirstLeafBrush { get; init; }
        public int NumLeafBrushes { get; init; }
    }

    public readonly struct BspBrush
    {
        public int FirstSide { get; }
        public int NumSides { get; }
        public int ShaderIndex { get; }
        public BspBrush(int firstSide, int numSides, int shaderIndex)
        {
            FirstSide = firstSide; NumSides = numSides; ShaderIndex = shaderIndex;
        }
    }

    /// <summary>
    /// IBSP46 brush sides have only (planeNum, shaderNum). RBSP1 adds a surfaceNum.
    /// We always store 4 bytes for the optional <see cref="SurfaceIndex"/> (-1 for IBSP).
    /// </summary>
    public readonly struct BspBrushSide
    {
        public int PlaneIndex { get; }
        public int ShaderIndex { get; }
        public int SurfaceIndex { get; }
        public BspBrushSide(int planeIndex, int shaderIndex, int surfaceIndex)
        {
            PlaneIndex = planeIndex; ShaderIndex = shaderIndex; SurfaceIndex = surfaceIndex;
        }
    }

    public sealed class BspModel
    {
        public Vector3 Mins { get; init; }
        public Vector3 Maxs { get; init; }
        public int FirstSurface { get; init; }
        public int NumSurfaces { get; init; }
        public int FirstBrush { get; init; }
        public int NumBrushes { get; init; }
    }

    public sealed class BspFog
    {
        public string Shader { get; init; } = string.Empty;
        public int BrushNum { get; init; }
        public int VisibleSide { get; init; }
    }

    /// <summary>
    /// Vertex with 4-stage lightmap UVs and 4-stage RGBA. For IBSP46 formats only stage 0
    /// is populated; stages 1..3 are zero. Consumers must respect
    /// <see cref="BspFile.LightmapStageCount"/> rather than walking all 4 unconditionally.
    /// </summary>
    public sealed class BspDrawVert
    {
        public Vector3 Xyz;
        public Vector2 St;
        public Vector2 Lm0, Lm1, Lm2, Lm3;
        public Vector3 Normal;
        public Color32 C0, C1, C2, C3;

        public Vector2 LightmapUv(int stage) => stage switch
        {
            0 => Lm0, 1 => Lm1, 2 => Lm2, 3 => Lm3,
            _ => throw new ArgumentOutOfRangeException(nameof(stage)),
        };

        public Color32 Color(int stage) => stage switch
        {
            0 => C0, 1 => C1, 2 => C2, 3 => C3,
            _ => throw new ArgumentOutOfRangeException(nameof(stage)),
        };
    }

    public enum BspSurfaceType
    {
        Bad = 0,
        Planar = 1,
        Patch = 2,
        TriangleSoup = 3,
        Flare = 4,
        /// <summary>RBSP only; we treat this as triangle soup.</summary>
        Foliage = 5,
    }

    /// <summary>
    /// Draw-surface header. For IBSP46, only stage 0 of the four <c>Lightmap*</c> arrays
    /// holds meaningful data; the rest are -1 (lightmap index) or zero.
    /// </summary>
    public sealed class BspDrawSurface
    {
        public int ShaderIndex;
        public int FogIndex;
        public BspSurfaceType SurfaceType;
        public int FirstVert;
        public int NumVerts;
        public int FirstIndex;
        public int NumIndexes;

        public byte LmStyle0, LmStyle1, LmStyle2, LmStyle3;
        public byte VxStyle0, VxStyle1, VxStyle2, VxStyle3;
        public int LmIndex0, LmIndex1, LmIndex2, LmIndex3;
        public int LmX0, LmX1, LmX2, LmX3;
        public int LmY0, LmY1, LmY2, LmY3;
        public int LightmapWidth;
        public int LightmapHeight;

        public Vector3 LightmapOrigin;
        public Vector3 LightmapVec0;
        public Vector3 LightmapVec1;
        public Vector3 LightmapVec2;

        public int PatchWidth;
        public int PatchHeight;

        public int LightmapIndex(int stage) => stage switch
        {
            0 => LmIndex0, 1 => LmIndex1, 2 => LmIndex2, 3 => LmIndex3,
            _ => throw new ArgumentOutOfRangeException(nameof(stage)),
        };

        public (int x, int y) LightmapXY(int stage) => stage switch
        {
            0 => (LmX0, LmY0), 1 => (LmX1, LmY1), 2 => (LmX2, LmY2), 3 => (LmX3, LmY3),
            _ => throw new ArgumentOutOfRangeException(nameof(stage)),
        };

        public byte LightmapStyle(int stage) => stage switch
        {
            0 => LmStyle0, 1 => LmStyle1, 2 => LmStyle2, 3 => LmStyle3,
            _ => throw new ArgumentOutOfRangeException(nameof(stage)),
        };

        public byte VertexStyle(int stage) => stage switch
        {
            0 => VxStyle0, 1 => VxStyle1, 2 => VxStyle2, 3 => VxStyle3,
            _ => throw new ArgumentOutOfRangeException(nameof(stage)),
        };
    }
}
