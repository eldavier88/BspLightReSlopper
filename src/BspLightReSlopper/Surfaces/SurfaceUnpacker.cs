using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Bsp;

namespace BspLightReSlopper.Surfaces
{
    /// <summary>
    /// Tessellates BSP draw surfaces into a flat triangle list per surface. Phase A handles
    /// <see cref="BspSurfaceType.Planar"/> and <see cref="BspSurfaceType.TriangleSoup"/>.
    /// Patches and flares are skipped (counts are reported on the result for visibility);
    /// patch tessellation will follow in Phase B/C polish.
    /// </summary>
    public static class SurfaceUnpacker
    {
        // Q3 surfaceflags (shared with RBSP). From code/game/surfaceflags.h.
        public const int SURF_SKY         = 0x4;
        public const int SURF_NODRAW      = 0x80;
        public const int SURF_NOLIGHTMAP  = 0x400;
        public const int SURF_POINTLIGHT  = 0x800;
        public const int SURF_NODLIGHT    = 0x20000;

        public sealed class UnpackResult
        {
            /// <summary>Per-surface triangle list. Same length as <c>bsp.Surfaces</c>; null entries == skipped.</summary>
            public IReadOnlyList<List<SurfaceTriangle>?> PerSurface { get; init; } = Array.Empty<List<SurfaceTriangle>?>();
            public int Planar { get; init; }
            public int TriangleSoup { get; init; }
            public int PatchSkipped { get; init; }
            public int FlareSkipped { get; init; }
            public int SkySkipped { get; init; }
            public int NoDrawSkipped { get; init; }
            public int NoLightmapSkipped { get; init; }
            public int OtherSkipped { get; init; }
            public int TrianglesEmitted { get; init; }
        }

        public static UnpackResult Unpack(BspFile bsp)
        {
            int n = bsp.Surfaces.Count;
            var per = new List<SurfaceTriangle>?[n];
            int planar = 0, soup = 0, patch = 0, flare = 0, sky = 0, nodraw = 0, nolm = 0, other = 0, tris = 0;

            for (int si = 0; si < n; si++)
            {
                var s = bsp.Surfaces[si];
                int sflags = (s.ShaderIndex >= 0 && s.ShaderIndex < bsp.Shaders.Count)
                    ? bsp.Shaders[s.ShaderIndex].SurfaceFlags : 0;

                if ((sflags & SURF_NODRAW) != 0) { nodraw++; per[si] = null; continue; }
                if ((sflags & SURF_SKY)    != 0) { sky++;    per[si] = null; continue; }
                if (s.LmIndex0 < 0)              { nolm++;   per[si] = null; continue; }
                if ((sflags & SURF_NOLIGHTMAP) != 0) { nolm++; per[si] = null; continue; }

                switch (s.SurfaceType)
                {
                    case BspSurfaceType.Planar:
                    case BspSurfaceType.TriangleSoup:
                    case BspSurfaceType.Foliage:
                        var list = EmitTriangles(bsp, s, si);
                        per[si] = list;
                        tris += list.Count;
                        if (s.SurfaceType == BspSurfaceType.Planar) planar++;
                        else soup++;
                        break;

                    case BspSurfaceType.Patch:
                        patch++;
                        per[si] = null;
                        break;

                    case BspSurfaceType.Flare:
                        flare++;
                        per[si] = null;
                        break;

                    default:
                        other++;
                        per[si] = null;
                        break;
                }
            }

            return new UnpackResult
            {
                PerSurface = per,
                Planar = planar,
                TriangleSoup = soup,
                PatchSkipped = patch,
                FlareSkipped = flare,
                SkySkipped = sky,
                NoDrawSkipped = nodraw,
                NoLightmapSkipped = nolm,
                OtherSkipped = other,
                TrianglesEmitted = tris,
            };
        }

        private static List<SurfaceTriangle> EmitTriangles(BspFile bsp, BspDrawSurface s, int surfaceIndex)
        {
            int triCount = s.NumIndexes / 3;
            var tris = new List<SurfaceTriangle>(triCount);
            int firstVert = s.FirstVert;
            for (int i = 0; i < triCount; i++)
            {
                int i0 = bsp.DrawIndexes[s.FirstIndex + i * 3 + 0];
                int i1 = bsp.DrawIndexes[s.FirstIndex + i * 3 + 1];
                int i2 = bsp.DrawIndexes[s.FirstIndex + i * 3 + 2];
                if (i0 < 0 || i1 < 0 || i2 < 0) continue;
                var v0 = bsp.DrawVerts[firstVert + i0];
                var v1 = bsp.DrawVerts[firstVert + i1];
                var v2 = bsp.DrawVerts[firstVert + i2];

                Vector3 p0 = v0.Xyz, p1 = v1.Xyz, p2 = v2.Xyz;
                Vector3 e1 = p1 - p0, e2 = p2 - p0;
                Vector3 fn = Vector3.Cross(e1, e2);
                float lenSq = fn.LengthSquared();
                if (lenSq < 1e-10f) continue;          // degenerate
                fn /= MathF.Sqrt(lenSq);

                tris.Add(new SurfaceTriangle
                {
                    SurfaceIndex = surfaceIndex,
                    ShaderIndex = s.ShaderIndex,
                    P0 = p0, P1 = p1, P2 = p2,
                    Normal = fn,
                    Lm0_0 = v0.Lm0, Lm0_1 = v1.Lm0, Lm0_2 = v2.Lm0,
                    Lm1_0 = v0.Lm1, Lm1_1 = v1.Lm1, Lm1_2 = v2.Lm1,
                    Lm2_0 = v0.Lm2, Lm2_1 = v1.Lm2, Lm2_2 = v2.Lm2,
                    Lm3_0 = v0.Lm3, Lm3_1 = v1.Lm3, Lm3_2 = v2.Lm3,
                });
            }
            return tris;
        }
    }
}
