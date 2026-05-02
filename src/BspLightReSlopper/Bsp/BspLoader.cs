using System;
using System.Buffers.Binary;
using System.Collections.Generic;
using System.IO;
using System.Numerics;
using System.Text;
using BspLightReSlopper.Bsp.Formats;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Bsp
{
    public static class BspLoader
    {
        public static BspFile Load(string path, BspFormatRegistry? registry = null)
        {
            using var fs = File.OpenRead(path);
            byte[] bytes = new byte[fs.Length];
            int read = 0;
            while (read < bytes.Length)
            {
                int n = fs.Read(bytes, read, bytes.Length - read);
                if (n <= 0) throw new EndOfStreamException("unexpected end while reading BSP file: " + path);
                read += n;
            }
            var bsp = LoadFromBytes(bytes, registry);
            return new BspFile
            {
                SourcePath = path,
                Format = bsp.Format,
                Version = bsp.Version,
                Shaders = bsp.Shaders,
                Planes = bsp.Planes,
                Nodes = bsp.Nodes,
                Leafs = bsp.Leafs,
                LeafSurfaces = bsp.LeafSurfaces,
                LeafBrushes = bsp.LeafBrushes,
                Models = bsp.Models,
                Brushes = bsp.Brushes,
                BrushSides = bsp.BrushSides,
                DrawVerts = bsp.DrawVerts,
                DrawIndexes = bsp.DrawIndexes,
                Fogs = bsp.Fogs,
                Surfaces = bsp.Surfaces,
                Lightmaps = bsp.Lightmaps,
                EntitiesText = bsp.EntitiesText,
                Visibility = bsp.Visibility,
            };
        }

        public static BspFile LoadFromBytes(byte[] bytes, BspFormatRegistry? registry = null)
        {
            registry ??= BspFormatRegistry.Default;
            if (bytes.Length < 8) throw new InvalidDataException("file too small to be a BSP");

            string magic = Encoding.ASCII.GetString(bytes, 0, 4);
            int version = BinaryPrimitives.ReadInt32LittleEndian(new ReadOnlySpan<byte>(bytes, 4, 4));
            var fmt = registry.Find(magic, version)
                ?? throw new InvalidDataException($"unknown BSP format: magic='{magic}' version={version}");

            int headerSize = 8 + fmt.HeaderLumpCount * 8;
            if (bytes.Length < headerSize) throw new InvalidDataException("BSP truncated in header");

            // ----- entities (raw text) -----
            var entitiesSpan = LumpSpan(bytes, fmt, BspLumpKind.Entities);
            string entities = entitiesSpan.Length == 0 ? string.Empty : DecodeEntityText(entitiesSpan);

            // ----- shaders -----
            var shadersSpan = LumpSpan(bytes, fmt, BspLumpKind.Shaders);
            int shaderCount = shadersSpan.Length / fmt.ShaderStride;
            var shaders = new BspShader[shaderCount];
            for (int i = 0; i < shaderCount; i++)
                shaders[i] = ReadShader(shadersSpan, i * fmt.ShaderStride);

            // ----- planes -----
            var planesSpan = LumpSpan(bytes, fmt, BspLumpKind.Planes);
            int planeCount = planesSpan.Length / fmt.PlaneStride;
            var planes = new BspPlane[planeCount];
            for (int i = 0; i < planeCount; i++)
            {
                var r = new SpanReader(planesSpan, i * fmt.PlaneStride);
                planes[i] = new BspPlane(r.ReadVector3(), r.ReadSingle());
            }

            // ----- nodes -----
            var nodesSpan = LumpSpan(bytes, fmt, BspLumpKind.Nodes);
            int nodeCount = nodesSpan.Length / fmt.NodeStride;
            var nodes = new BspNode[nodeCount];
            for (int i = 0; i < nodeCount; i++)
            {
                var r = new SpanReader(nodesSpan, i * fmt.NodeStride);
                int planeIdx = r.ReadInt32();
                int c0 = r.ReadInt32();
                int c1 = r.ReadInt32();
                int minX = r.ReadInt32(), minY = r.ReadInt32(), minZ = r.ReadInt32();
                int maxX = r.ReadInt32(), maxY = r.ReadInt32(), maxZ = r.ReadInt32();
                nodes[i] = new BspNode(planeIdx, c0, c1, new Vector3(minX, minY, minZ), new Vector3(maxX, maxY, maxZ));
            }

            // ----- leafs -----
            var leafsSpan = LumpSpan(bytes, fmt, BspLumpKind.Leafs);
            int leafCount = leafsSpan.Length / fmt.LeafStride;
            var leafs = new BspLeaf[leafCount];
            for (int i = 0; i < leafCount; i++) leafs[i] = fmt.ReadLeaf(leafsSpan, i * fmt.LeafStride);

            // ----- leaf surfaces / leaf brushes / draw indexes (int arrays) -----
            int[] leafSurfaces = ReadInt32Array(LumpSpan(bytes, fmt, BspLumpKind.LeafSurfaces));
            int[] leafBrushes  = ReadInt32Array(LumpSpan(bytes, fmt, BspLumpKind.LeafBrushes));
            int[] drawIndexes  = ReadInt32Array(LumpSpan(bytes, fmt, BspLumpKind.DrawIndexes));

            // ----- models -----
            var modelsSpan = LumpSpan(bytes, fmt, BspLumpKind.Models);
            int modelCount = modelsSpan.Length / fmt.ModelStride;
            var models = new BspModel[modelCount];
            for (int i = 0; i < modelCount; i++)
            {
                var r = new SpanReader(modelsSpan, i * fmt.ModelStride);
                Vector3 mins = r.ReadVector3();
                Vector3 maxs = r.ReadVector3();
                int firstSurf = r.ReadInt32();
                int numSurf = r.ReadInt32();
                int firstBrush = r.ReadInt32();
                int numBrush = r.ReadInt32();
                models[i] = new BspModel
                {
                    Mins = mins, Maxs = maxs,
                    FirstSurface = firstSurf, NumSurfaces = numSurf,
                    FirstBrush = firstBrush, NumBrushes = numBrush,
                };
            }

            // ----- brushes -----
            var brushesSpan = LumpSpan(bytes, fmt, BspLumpKind.Brushes);
            int brushCount = brushesSpan.Length / fmt.BrushStride;
            var brushes = new BspBrush[brushCount];
            for (int i = 0; i < brushCount; i++)
            {
                var r = new SpanReader(brushesSpan, i * fmt.BrushStride);
                brushes[i] = new BspBrush(r.ReadInt32(), r.ReadInt32(), r.ReadInt32());
            }

            // ----- brush sides -----
            var brushSidesSpan = LumpSpan(bytes, fmt, BspLumpKind.BrushSides);
            int brushSideCount = brushSidesSpan.Length / fmt.BrushSideStride;
            var brushSides = new BspBrushSide[brushSideCount];
            for (int i = 0; i < brushSideCount; i++)
                brushSides[i] = fmt.ReadBrushSide(brushSidesSpan, i * fmt.BrushSideStride);

            // ----- draw verts -----
            var dvSpan = LumpSpan(bytes, fmt, BspLumpKind.DrawVerts);
            int dvCount = dvSpan.Length / fmt.VertexStride;
            var drawVerts = new BspDrawVert[dvCount];
            for (int i = 0; i < dvCount; i++) drawVerts[i] = fmt.ReadDrawVert(dvSpan, i * fmt.VertexStride);

            // ----- draw surfaces -----
            var dsSpan = LumpSpan(bytes, fmt, BspLumpKind.Surfaces);
            int dsCount = dsSpan.Length / fmt.SurfaceStride;
            var surfaces = new BspDrawSurface[dsCount];
            for (int i = 0; i < dsCount; i++) surfaces[i] = fmt.ReadDrawSurface(dsSpan, i * fmt.SurfaceStride);

            // ----- fogs -----
            var fogsSpan = LumpSpan(bytes, fmt, BspLumpKind.Fogs);
            int fogCount = fogsSpan.Length / fmt.FogStride;
            var fogs = new BspFog[fogCount];
            for (int i = 0; i < fogCount; i++)
            {
                var r = new SpanReader(fogsSpan, i * fmt.FogStride);
                fogs[i] = new BspFog
                {
                    Shader = r.ReadFixedAscii(64),
                    BrushNum = r.ReadInt32(),
                    VisibleSide = r.ReadInt32(),
                };
            }

            // ----- lightmaps + visibility (raw byte blobs) -----
            byte[] lightmaps = LumpSpan(bytes, fmt, BspLumpKind.Lightmaps).ToArray();
            byte[] visibility = LumpSpan(bytes, fmt, BspLumpKind.Visibility).ToArray();

            return new BspFile
            {
                Format = fmt,
                Version = version,
                Shaders = shaders,
                Planes = planes,
                Nodes = nodes,
                Leafs = leafs,
                LeafSurfaces = leafSurfaces,
                LeafBrushes = leafBrushes,
                Models = models,
                Brushes = brushes,
                BrushSides = brushSides,
                DrawVerts = drawVerts,
                DrawIndexes = drawIndexes,
                Fogs = fogs,
                Surfaces = surfaces,
                Lightmaps = lightmaps,
                EntitiesText = entities,
                Visibility = visibility,
            };
        }

        private static ReadOnlySpan<byte> LumpSpan(byte[] bytes, IBspFormat fmt, string kind)
        {
            int idx = fmt.LumpIndex[kind];
            if (idx < 0) return ReadOnlySpan<byte>.Empty;
            int o = 8 + idx * 8;
            int offset = BinaryPrimitives.ReadInt32LittleEndian(new ReadOnlySpan<byte>(bytes, o, 4));
            int length = BinaryPrimitives.ReadInt32LittleEndian(new ReadOnlySpan<byte>(bytes, o + 4, 4));
            if (offset < 0 || length < 0 || offset + length > bytes.Length)
                throw new InvalidDataException($"lump '{kind}' (idx {idx}) out of range: offset={offset} length={length} fileSize={bytes.Length}");
            return new ReadOnlySpan<byte>(bytes, offset, length);
        }

        private static BspShader ReadShader(ReadOnlySpan<byte> data, int offset)
        {
            var r = new SpanReader(data, offset);
            string name = r.ReadFixedAscii(64);
            int surfaceFlags = r.ReadInt32();
            int contentFlags = r.ReadInt32();
            return new BspShader { Name = name, SurfaceFlags = surfaceFlags, ContentFlags = contentFlags };
        }

        private static int[] ReadInt32Array(ReadOnlySpan<byte> data)
        {
            int n = data.Length / 4;
            var arr = new int[n];
            var r = new SpanReader(data);
            for (int i = 0; i < n; i++) arr[i] = r.ReadInt32();
            return arr;
        }

        private static string DecodeEntityText(ReadOnlySpan<byte> data)
        {
            int n = data.IndexOf((byte)0);
            if (n < 0) n = data.Length;
            return Encoding.ASCII.GetString(data.Slice(0, n));
        }
    }
}
