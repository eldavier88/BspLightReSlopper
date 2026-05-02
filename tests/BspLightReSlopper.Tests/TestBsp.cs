using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using System.IO;
using System.Numerics;
using System.Text;
using BspLightReSlopper.Bsp.Formats;

namespace BspLightReSlopper.Tests
{
    /// <summary>
    /// Hand-rolled builders for synthetic IBSP46 / RBSP1 byte buffers used to exercise
    /// <see cref="BspLightReSlopper.Bsp.BspLoader"/> without needing real game data.
    /// </summary>
    internal static class TestBsp
    {
        public static byte[] BuildMinimalIbsp46(out (int verts, int surfs) counts)
        {
            var fmt = new Ibsp46Format();
            return BuildMinimal(fmt, out counts, multiStage: false);
        }

        public static byte[] BuildMinimalRbsp1(out (int verts, int surfs) counts)
        {
            var fmt = new Rbsp1Format();
            return BuildMinimal(fmt, out counts, multiStage: true);
        }

        private static byte[] BuildMinimal(IBspFormat fmt, out (int verts, int surfs) counts, bool multiStage)
        {
            // We populate enough lumps that the loader can parse them all without errors:
            // entities (1 worldspawn + 1 light), shaders (1), planes (0), nodes (0), leafs (0),
            // models (1), brushes (0), brush sides (0), draw verts (3), draw indexes (3),
            // surfaces (1 planar), lightmaps (1 atlas), fogs (0), visibility (0).
            counts = (verts: 3, surfs: 1);

            var lumps = new Dictionary<string, byte[]>(StringComparer.Ordinal);
            lumps[BspLightReSlopper.Bsp.BspLumpKind.Entities] = Encoding.ASCII.GetBytes(
                "{ \"classname\" \"worldspawn\" }\n" +
                "{ \"classname\" \"light\" \"origin\" \"100 200 300\" \"_color\" \"1 0.5 0.25\" \"light\" \"250\" }\n" +
                "\0");

            // 1 shader, 72 bytes
            var sh = new byte[fmt.ShaderStride];
            CopyAscii(sh, 0, "textures/test/checker", 64);
            BinaryPrimitives.WriteInt32LittleEndian(sh.AsSpan(64, 4), 0); // surfaceFlags
            BinaryPrimitives.WriteInt32LittleEndian(sh.AsSpan(68, 4), 1); // contentFlags
            lumps[BspLightReSlopper.Bsp.BspLumpKind.Shaders] = sh;

            // 1 model
            var model = new byte[fmt.ModelStride];
            WriteVec3(model, 0, new Vector3(-256, -256, 0));
            WriteVec3(model, 12, new Vector3(256, 256, 256));
            BinaryPrimitives.WriteInt32LittleEndian(model.AsSpan(24, 4), 0); // firstSurface
            BinaryPrimitives.WriteInt32LittleEndian(model.AsSpan(28, 4), 1); // numSurfaces
            BinaryPrimitives.WriteInt32LittleEndian(model.AsSpan(32, 4), 0); // firstBrush
            BinaryPrimitives.WriteInt32LittleEndian(model.AsSpan(36, 4), 0); // numBrushes
            lumps[BspLightReSlopper.Bsp.BspLumpKind.Models] = model;

            // 3 draw verts forming a triangle on the floor
            var verts = new byte[fmt.VertexStride * 3];
            for (int i = 0; i < 3; i++)
            {
                int o = i * fmt.VertexStride;
                Vector3 p = i switch
                {
                    0 => new Vector3(0, 0, 0),
                    1 => new Vector3(128, 0, 0),
                    2 => new Vector3(0, 128, 0),
                    _ => Vector3.Zero,
                };
                WriteVec3(verts, o, p);
                WriteVec2(verts, o + 12, new Vector2(p.X / 128f, p.Y / 128f));      // st
                WriteVec2(verts, o + 20, new Vector2(p.X / 128f, p.Y / 128f));      // lm0
                int normalOffset;
                if (multiStage)
                {
                    WriteVec2(verts, o + 28, Vector2.Zero); // lm1
                    WriteVec2(verts, o + 36, Vector2.Zero); // lm2
                    WriteVec2(verts, o + 44, Vector2.Zero); // lm3
                    normalOffset = 52;
                }
                else
                {
                    normalOffset = 28;
                }
                WriteVec3(verts, o + normalOffset, new Vector3(0, 0, 1));            // normal
                int colorOffset = normalOffset + 12;
                verts[o + colorOffset + 0] = 200; verts[o + colorOffset + 1] = 200;
                verts[o + colorOffset + 2] = 200; verts[o + colorOffset + 3] = 255;
                if (multiStage)
                {
                    // 3 more 4-byte colors, leave them zero
                }
            }
            lumps[BspLightReSlopper.Bsp.BspLumpKind.DrawVerts] = verts;

            // 3 draw indexes: 0,1,2
            var idx = new byte[12];
            BinaryPrimitives.WriteInt32LittleEndian(idx.AsSpan(0, 4), 0);
            BinaryPrimitives.WriteInt32LittleEndian(idx.AsSpan(4, 4), 1);
            BinaryPrimitives.WriteInt32LittleEndian(idx.AsSpan(8, 4), 2);
            lumps[BspLightReSlopper.Bsp.BspLumpKind.DrawIndexes] = idx;

            // 1 surface (planar)
            var surf = new byte[fmt.SurfaceStride];
            BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(0, 4), 0);   // shaderNum
            BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(4, 4), -1);  // fogNum
            BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(8, 4), 1);   // surfaceType MST_PLANAR
            BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(12, 4), 0);  // firstVert
            BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(16, 4), 3);  // numVerts
            BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(20, 4), 0);  // firstIndex
            BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(24, 4), 3);  // numIndexes
            int afterCounts = 28;
            int lightmapOriginOffset, patchOffset;
            if (multiStage)
            {
                // 4 lightmap styles + 4 vertex styles
                for (int b = 0; b < 8; b++) surf[afterCounts + b] = 0xFF;     // LS_NONE
                int p = afterCounts + 8;
                // 4 lightmap indices
                for (int s = 0; s < 4; s++)
                {
                    BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), s == 0 ? 0 : -1);
                    p += 4;
                }
                // 4 X
                for (int s = 0; s < 4; s++) { BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), 0); p += 4; }
                // 4 Y
                for (int s = 0; s < 4; s++) { BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), 0); p += 4; }
                BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), 64); p += 4; // width
                BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), 64); p += 4; // height
                lightmapOriginOffset = p;
            }
            else
            {
                int p = afterCounts;
                BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), 0); p += 4;     // lightmapNum
                BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), 0); p += 4;     // lightmapX
                BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), 0); p += 4;     // lightmapY
                BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), 64); p += 4;    // lightmapWidth
                BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(p, 4), 64); p += 4;    // lightmapHeight
                lightmapOriginOffset = p;
            }
            WriteVec3(surf, lightmapOriginOffset, new Vector3(0, 0, 0));
            WriteVec3(surf, lightmapOriginOffset + 12, new Vector3(2, 0, 0));   // lmVecs[0]
            WriteVec3(surf, lightmapOriginOffset + 24, new Vector3(0, 2, 0));   // lmVecs[1]
            WriteVec3(surf, lightmapOriginOffset + 36, new Vector3(0, 0, 1));   // lmVecs[2] = normal
            patchOffset = lightmapOriginOffset + 48;
            BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(patchOffset, 4), 0);
            BinaryPrimitives.WriteInt32LittleEndian(surf.AsSpan(patchOffset + 4, 4), 0);
            lumps[BspLightReSlopper.Bsp.BspLumpKind.Surfaces] = surf;

            // 1 lightmap atlas, 128*128*3 bytes, all 64 (mid grey)
            var lm = new byte[128 * 128 * 3];
            Array.Fill(lm, (byte)64);
            lumps[BspLightReSlopper.Bsp.BspLumpKind.Lightmaps] = lm;

            return Assemble(fmt, lumps);
        }

        private static byte[] Assemble(IBspFormat fmt, IReadOnlyDictionary<string, byte[]> lumpData)
        {
            int headerSize = 8 + fmt.HeaderLumpCount * 8;
            // Place lumps sequentially after the header.
            using var ms = new MemoryStream();
            ms.Write(new byte[headerSize], 0, headerSize); // placeholder
            var entries = new (int idx, int offset, int length)[fmt.HeaderLumpCount];
            int curOffset = headerSize;
            foreach (var kvp in fmt.LumpIndex)
            {
                if (kvp.Value < 0) continue;
                byte[] data = lumpData.TryGetValue(kvp.Key, out var d) ? d : Array.Empty<byte>();
                entries[kvp.Value] = (kvp.Value, curOffset, data.Length);
                if (data.Length > 0) ms.Write(data, 0, data.Length);
                // Pad to 4-byte alignment (q3 tools do this).
                int pad = (4 - (data.Length & 3)) & 3;
                for (int p = 0; p < pad; p++) ms.WriteByte(0);
                curOffset += data.Length + pad;
            }
            byte[] all = ms.ToArray();
            // Write header.
            Encoding.ASCII.GetBytes(fmt.Magic).CopyTo(all, 0);
            BinaryPrimitives.WriteInt32LittleEndian(all.AsSpan(4, 4), fmt.Version);
            for (int i = 0; i < fmt.HeaderLumpCount; i++)
            {
                int o = 8 + i * 8;
                BinaryPrimitives.WriteInt32LittleEndian(all.AsSpan(o, 4), entries[i].offset);
                BinaryPrimitives.WriteInt32LittleEndian(all.AsSpan(o + 4, 4), entries[i].length);
            }
            return all;
        }

        private static void WriteVec3(byte[] b, int o, Vector3 v)
        {
            BinaryPrimitives.WriteSingleLittleEndian(b.AsSpan(o, 4), v.X);
            BinaryPrimitives.WriteSingleLittleEndian(b.AsSpan(o + 4, 4), v.Y);
            BinaryPrimitives.WriteSingleLittleEndian(b.AsSpan(o + 8, 4), v.Z);
        }

        private static void WriteVec2(byte[] b, int o, Vector2 v)
        {
            BinaryPrimitives.WriteSingleLittleEndian(b.AsSpan(o, 4), v.X);
            BinaryPrimitives.WriteSingleLittleEndian(b.AsSpan(o + 4, 4), v.Y);
        }

        private static void CopyAscii(byte[] dst, int offset, string s, int field)
        {
            byte[] bs = Encoding.ASCII.GetBytes(s);
            int n = Math.Min(bs.Length, field - 1);
            Array.Copy(bs, 0, dst, offset, n);
            // remaining bytes already zeroed by allocator
        }
    }
}
