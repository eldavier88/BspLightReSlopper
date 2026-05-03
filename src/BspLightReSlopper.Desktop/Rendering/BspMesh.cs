using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Surfaces;

namespace BspLightReSlopper.Desktop.Rendering
{
    /// <summary>
    /// CPU-side mesh data extracted from a BspFile + SurfaceUnpacker result. Vertices are
    /// packed (position, normal, lm_uv, atlas_layer) and grouped into batches (one batch
    /// per lightmap atlas plus one fallback batch for surfaces without a lightmap).
    ///
    /// <para>This is GPU-agnostic — the OpenGL upload happens in <c>BspViewerControl</c>
    /// inside <c>OnOpenGlInit</c>.</para>
    /// </summary>
    public sealed class BspMesh
    {
        public const int FloatsPerVertex = 9; // x,y,z, nx,ny,nz, u,v, layer

        public sealed class Batch
        {
            public int AtlasLayer { get; init; } // -1 = no lightmap (rendered with flat shading)
            public float[] Vertices { get; init; } = Array.Empty<float>();
            public uint[] Indices { get; init; } = Array.Empty<uint>();
        }

        public IReadOnlyList<Batch> Batches { get; init; } = Array.Empty<Batch>();
        public Vector3 BoundsMin { get; init; }
        public Vector3 BoundsMax { get; init; }
        public int TriangleCount { get; init; }

        public static BspMesh Build(BspFile bsp, SurfaceUnpacker.UnpackResult unpacked)
        {
            // Group triangles by atlas layer (LmIndex0). -1 → fallback.
            var perLayer = new Dictionary<int, (List<float> verts, List<uint> idx, uint nextIndex)>();
            Vector3 mn = new(float.PositiveInfinity);
            Vector3 mx = new(float.NegativeInfinity);
            int triCount = 0;

            for (int si = 0; si < bsp.Surfaces.Count; si++)
            {
                var tris = unpacked.PerSurface[si];
                if (tris == null || tris.Count == 0) continue;
                var surf = bsp.Surfaces[si];
                int layer = surf.LmIndex0;

                if (!perLayer.TryGetValue(layer, out var bucket))
                    bucket = (new List<float>(2048), new List<uint>(2048), 0u);

                foreach (var tri in tris)
                {
                    var n = tri.Normal;
                    if (n.LengthSquared() < 1e-8f) n = new Vector3(0, 0, 1);
                    AddVertex(bucket.verts, tri.P0, n, tri.Lm0_0, layer, ref mn, ref mx);
                    AddVertex(bucket.verts, tri.P1, n, tri.Lm0_1, layer, ref mn, ref mx);
                    AddVertex(bucket.verts, tri.P2, n, tri.Lm0_2, layer, ref mn, ref mx);
                    bucket.idx.Add(bucket.nextIndex++);
                    bucket.idx.Add(bucket.nextIndex++);
                    bucket.idx.Add(bucket.nextIndex++);
                    triCount++;
                }
                perLayer[layer] = bucket;
            }

            var batches = new List<Batch>(perLayer.Count);
            foreach (var kv in perLayer)
            {
                batches.Add(new Batch
                {
                    AtlasLayer = kv.Key,
                    Vertices = kv.Value.verts.ToArray(),
                    Indices = kv.Value.idx.ToArray(),
                });
            }

            if (triCount == 0)
            {
                // Empty BSP — fall back to a degenerate bounds so the camera doesn't blow up.
                mn = new Vector3(-512);
                mx = new Vector3(512);
            }

            return new BspMesh
            {
                Batches = batches,
                BoundsMin = mn,
                BoundsMax = mx,
                TriangleCount = triCount,
            };
        }

        private static void AddVertex(List<float> verts, Vector3 p, Vector3 n, Vector2 uv, int layer,
            ref Vector3 mn, ref Vector3 mx)
        {
            verts.Add(p.X); verts.Add(p.Y); verts.Add(p.Z);
            verts.Add(n.X); verts.Add(n.Y); verts.Add(n.Z);
            verts.Add(uv.X); verts.Add(uv.Y);
            verts.Add((float)layer);
            mn = Vector3.Min(mn, p);
            mx = Vector3.Max(mx, p);
        }
    }
}
