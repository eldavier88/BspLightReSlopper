using System;
using System.Collections.Generic;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Bsp.Formats
{
    /// <summary>
    /// Raven BSP for Jedi Outcast / Jedi Academy / Soldier of Fortune 2. Magic <c>RBSP</c>,
    /// version 1. 18 lumps (adds <c>LIGHTARRAY</c>). Vertex stride 80 bytes (4-stage
    /// lightmap UVs + 4-stage RGBA), draw-surface stride 148 bytes, brush-side stride
    /// 12 bytes (adds <c>surfaceNum</c>).
    /// Reference: <c>tools/quake3/q3map2/bspfile_rbsp.cpp</c> in Garux/netradiant-custom.
    /// </summary>
    public sealed class Rbsp1Format : IBspFormat
    {
        public string Magic => "RBSP";
        public int Version => 1;
        public string DisplayName => "Raven (RBSP v1) — Jedi Outcast / Jedi Academy / SoF2";
        public int HeaderLumpCount => 18;
        public int LightmapStageCount => 4;

        public int VertexStride    => 80;
        public int SurfaceStride   => 148;
        public int BrushSideStride => 12;
        public int LeafStride      => 48;

        public IReadOnlyDictionary<string, int> LumpIndex { get; } = new Dictionary<string, int>
        {
            [BspLumpKind.Entities]     = 0,
            [BspLumpKind.Shaders]      = 1,
            [BspLumpKind.Planes]       = 2,
            [BspLumpKind.Nodes]        = 3,
            [BspLumpKind.Leafs]        = 4,
            [BspLumpKind.LeafSurfaces] = 5,
            [BspLumpKind.LeafBrushes]  = 6,
            [BspLumpKind.Models]       = 7,
            [BspLumpKind.Brushes]      = 8,
            [BspLumpKind.BrushSides]   = 9,
            [BspLumpKind.DrawVerts]    = 10,
            [BspLumpKind.DrawIndexes]  = 11,
            [BspLumpKind.Fogs]         = 12,
            [BspLumpKind.Surfaces]     = 13,
            [BspLumpKind.Lightmaps]    = 14,
            [BspLumpKind.LightGrid]    = 15,
            [BspLumpKind.Visibility]   = 16,
            [BspLumpKind.LightArray]   = 17,
        };

        public BspDrawVert ReadDrawVert(ReadOnlySpan<byte> data, int offset)
        {
            var r = new SpanReader(data, offset);
            var v = new BspDrawVert
            {
                Xyz = r.ReadVector3(),
                St = r.ReadVector2(),
                Lm0 = r.ReadVector2(),
                Lm1 = r.ReadVector2(),
                Lm2 = r.ReadVector2(),
                Lm3 = r.ReadVector2(),
                Normal = r.ReadVector3(),
            };
            byte r0 = r.ReadByte(), g0 = r.ReadByte(), b0 = r.ReadByte(), a0 = r.ReadByte();
            byte r1 = r.ReadByte(), g1 = r.ReadByte(), b1 = r.ReadByte(), a1 = r.ReadByte();
            byte r2 = r.ReadByte(), g2 = r.ReadByte(), b2 = r.ReadByte(), a2 = r.ReadByte();
            byte r3 = r.ReadByte(), g3 = r.ReadByte(), b3 = r.ReadByte(), a3 = r.ReadByte();
            v.C0 = new Color32(r0, g0, b0, a0);
            v.C1 = new Color32(r1, g1, b1, a1);
            v.C2 = new Color32(r2, g2, b2, a2);
            v.C3 = new Color32(r3, g3, b3, a3);
            return v;
        }

        public BspDrawSurface ReadDrawSurface(ReadOnlySpan<byte> data, int offset)
        {
            var r = new SpanReader(data, offset);
            var s = new BspDrawSurface
            {
                ShaderIndex = r.ReadInt32(),
                FogIndex = r.ReadInt32(),
                SurfaceType = (BspSurfaceType)r.ReadInt32(),
                FirstVert = r.ReadInt32(),
                NumVerts = r.ReadInt32(),
                FirstIndex = r.ReadInt32(),
                NumIndexes = r.ReadInt32(),
            };
            // 4 lightmap styles + 4 vertex styles (8 bytes total)
            s.LmStyle0 = r.ReadByte(); s.LmStyle1 = r.ReadByte();
            s.LmStyle2 = r.ReadByte(); s.LmStyle3 = r.ReadByte();
            s.VxStyle0 = r.ReadByte(); s.VxStyle1 = r.ReadByte();
            s.VxStyle2 = r.ReadByte(); s.VxStyle3 = r.ReadByte();
            // 4 lightmap indices + 4 X + 4 Y
            s.LmIndex0 = r.ReadInt32(); s.LmIndex1 = r.ReadInt32();
            s.LmIndex2 = r.ReadInt32(); s.LmIndex3 = r.ReadInt32();
            s.LmX0 = r.ReadInt32(); s.LmX1 = r.ReadInt32();
            s.LmX2 = r.ReadInt32(); s.LmX3 = r.ReadInt32();
            s.LmY0 = r.ReadInt32(); s.LmY1 = r.ReadInt32();
            s.LmY2 = r.ReadInt32(); s.LmY3 = r.ReadInt32();

            s.LightmapWidth  = r.ReadInt32();
            s.LightmapHeight = r.ReadInt32();
            s.LightmapOrigin = r.ReadVector3();
            s.LightmapVec0   = r.ReadVector3();
            s.LightmapVec1   = r.ReadVector3();
            s.LightmapVec2   = r.ReadVector3();
            s.PatchWidth  = r.ReadInt32();
            s.PatchHeight = r.ReadInt32();
            return s;
        }

        public BspBrushSide ReadBrushSide(ReadOnlySpan<byte> data, int offset)
        {
            var r = new SpanReader(data, offset);
            int planeIndex = r.ReadInt32();
            int shaderIndex = r.ReadInt32();
            int surfaceIndex = r.ReadInt32();
            return new BspBrushSide(planeIndex, shaderIndex, surfaceIndex);
        }

        public BspLeaf ReadLeaf(ReadOnlySpan<byte> data, int offset)
        {
            // Same shape as IBSP46 (cluster, area, mins, maxs, firstLeafSurface, numLeafSurfaces,
            // firstLeafBrush, numLeafBrushes). Total 48 bytes.
            var r = new SpanReader(data, offset);
            int cluster = r.ReadInt32();
            int area = r.ReadInt32();
            int minX = r.ReadInt32(), minY = r.ReadInt32(), minZ = r.ReadInt32();
            int maxX = r.ReadInt32(), maxY = r.ReadInt32(), maxZ = r.ReadInt32();
            int firstLs = r.ReadInt32(), numLs = r.ReadInt32();
            int firstLb = r.ReadInt32(), numLb = r.ReadInt32();
            return new BspLeaf
            {
                Cluster = cluster,
                Area = area,
                Mins = new System.Numerics.Vector3(minX, minY, minZ),
                Maxs = new System.Numerics.Vector3(maxX, maxY, maxZ),
                FirstLeafSurface = firstLs,
                NumLeafSurfaces = numLs,
                FirstLeafBrush = firstLb,
                NumLeafBrushes = numLb,
            };
        }
    }
}
