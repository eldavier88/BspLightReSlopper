using System;
using System.Collections.Generic;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Bsp.Formats
{
    /// <summary>
    /// Quake 3 Arena BSP. Magic <c>IBSP</c>, version 46. 17 lumps. Single-stage lightmaps.
    /// Vertex stride 44 bytes, draw-surface stride 104 bytes, brush-side stride 8 bytes.
    /// Reference: <c>code/qcommon/qfiles.h</c> in id-Software/Quake-III-Arena.
    /// </summary>
    public sealed class Ibsp46Format : IBspFormat
    {
        public string Magic => "IBSP";
        public int Version => 46;
        public string DisplayName => "Quake 3 Arena (IBSP v46)";
        public int HeaderLumpCount => 17;
        public int LightmapStageCount => 1;

        public int VertexStride    => 44;
        public int SurfaceStride   => 104;
        public int BrushSideStride => 8;
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
            [BspLumpKind.LightArray]   = -1,
        };

        public BspDrawVert ReadDrawVert(ReadOnlySpan<byte> data, int offset)
        {
            var r = new SpanReader(data, offset);
            var v = new BspDrawVert
            {
                Xyz = r.ReadVector3(),
                St = r.ReadVector2(),
                Lm0 = r.ReadVector2(),
                Normal = r.ReadVector3(),
            };
            byte cr = r.ReadByte(), cg = r.ReadByte(), cb = r.ReadByte(), ca = r.ReadByte();
            v.C0 = new Color32(cr, cg, cb, ca);
            // stages 1..3 stay zero
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
                LmIndex0 = r.ReadInt32(),
                LmX0 = r.ReadInt32(),
                LmY0 = r.ReadInt32(),
                LightmapWidth = r.ReadInt32(),
                LightmapHeight = r.ReadInt32(),
                LightmapOrigin = r.ReadVector3(),
                LightmapVec0 = r.ReadVector3(),
                LightmapVec1 = r.ReadVector3(),
                LightmapVec2 = r.ReadVector3(),
                PatchWidth = r.ReadInt32(),
                PatchHeight = r.ReadInt32(),
            };
            // stages 1..3: lightmap indices default to -1 (not present)
            s.LmIndex1 = -1; s.LmIndex2 = -1; s.LmIndex3 = -1;
            return s;
        }

        public BspBrushSide ReadBrushSide(ReadOnlySpan<byte> data, int offset)
        {
            var r = new SpanReader(data, offset);
            int planeIndex = r.ReadInt32();
            int shaderIndex = r.ReadInt32();
            return new BspBrushSide(planeIndex, shaderIndex, -1);
        }

        public BspLeaf ReadLeaf(ReadOnlySpan<byte> data, int offset)
        {
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
