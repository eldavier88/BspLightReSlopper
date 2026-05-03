using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Bsp;

namespace BspLightReSlopper.Surfaces
{
    /// <summary>
    /// Tessellates a Q3-family <c>patchDef2</c> surface (biquadratic Bezier control mesh) into
    /// a flat triangle list compatible with <see cref="SurfaceUnpacker"/>'s output. Vertex Lm0..3
    /// UVs and per-vertex normals are bilerped/bezier-interpolated from the control mesh; the
    /// per-triangle <see cref="SurfaceTriangle.Normal"/> is recomputed from the geometry of each
    /// emitted triangle so curved surfaces don't get a single flat normal.
    ///
    /// <para>Reference: Quake III Arena <c>q3map/mesh.c</c> (<c>SubdivideMesh</c>) and the
    /// renderer's <c>R_SubdividePatchToGrid</c>. We use a fixed subdivision level rather than
    /// curvature-adaptive because for our purposes (lightmap texel sampling) the per-sub-patch
    /// tessellation density just needs to be at least as fine as the lightmap texel grid; a
    /// 4×4 subdivision per 3×3 sub-patch (= 5×5 grid points = 32 triangles) is well past that
    /// for typical JK2 patch sizes.</para>
    ///
    /// <para>Patch vertex layout: <c>NumVerts = PatchWidth × PatchHeight</c>, both odd. The
    /// patch is composed of <c>(PatchWidth-1)/2 × (PatchHeight-1)/2</c> 3×3 sub-patches, each
    /// of which is a single biquadratic Bezier surface. The surface's draw-index buffer is
    /// unused for patches (q3 tessellates on the fly at render time); we ignore it.</para>
    /// </summary>
    public static class PatchTessellator
    {
        /// <summary>Per-sub-patch subdivision level. <c>4</c> gives a 5×5 grid (32 triangles)
        /// per sub-patch — well above the typical JK2 lightmap texel density on patches.</summary>
        public const int DefaultLevel = 4;

        public static List<SurfaceTriangle>? TessellatePatch(BspFile bsp, BspDrawSurface s, int surfaceIndex, int level = DefaultLevel)
        {
            int pw = s.PatchWidth;
            int ph = s.PatchHeight;
            // Patches must have odd dimensions >=3 in both axes; anything else is malformed
            // (or it's a non-patch tagged Patch; degrade gracefully).
            if (pw < 3 || ph < 3 || (pw & 1) == 0 || (ph & 1) == 0) return null;
            if (s.NumVerts != pw * ph) return null;
            int subW = (pw - 1) / 2;
            int subH = (ph - 1) / 2;
            if (subW <= 0 || subH <= 0) return null;

            int firstVert = s.FirstVert;
            // Pre-fetch control mesh as a 2D array indexed [x, y].
            var ctrl = new BspDrawVert[pw * ph];
            for (int j = 0; j < ph; j++)
                for (int i = 0; i < pw; i++)
                    ctrl[j * pw + i] = bsp.DrawVerts[firstVert + j * pw + i];

            // ---- Adaptive subdivision ----
            // Compute world-space bounding box of the control mesh and lightmap UV range.
            // Target: each triangle edge should be < 1.5 lightmap texels in world space.
            int adaptiveLevel = level;
            if (level == DefaultLevel) // only auto-adapt when caller didn't specify
            {
                Vector3 lo = ctrl[0].Xyz, hi = ctrl[0].Xyz;
                Vector2 lmLo = ctrl[0].Lm0, lmHi = ctrl[0].Lm0;
                for (int k = 1; k < ctrl.Length; k++)
                {
                    var p = ctrl[k].Xyz;
                    lo = Vector3.Min(lo, p);
                    hi = Vector3.Max(hi, p);
                    var lm = ctrl[k].Lm0;
                    lmLo = Vector2.Min(lmLo, lm);
                    lmHi = Vector2.Max(lmHi, lm);
                }
                Vector3 size = hi - lo;
                float worldMax = MathF.Max(size.X, MathF.Max(size.Y, size.Z));
                Vector2 lmSize = lmHi - lmLo;
                float lmTexels = MathF.Max(lmSize.X, lmSize.Y) * 128f; // atlas is 128×128
                if (lmTexels > 1f && worldMax > 1f)
                {
                    float worldPerTexel = worldMax / lmTexels;
                    float targetEdge = 1.5f * worldPerTexel; // 1.5 texels
                    // A sub-patch is ~1 unit in parametric space; level=4 → edge = 1/4 = 0.25
                    int estLevel = (int)MathF.Ceiling(1f / targetEdge);
                    adaptiveLevel = Math.Max(2, Math.Min(16, estLevel));
                }
            }

            // Reused per-sub-patch grid buffer.
            int gridDim = adaptiveLevel + 1;
            var grid = new BspDrawVert[gridDim * gridDim];

            var tris = new List<SurfaceTriangle>(subW * subH * adaptiveLevel * adaptiveLevel * 2);

            // UV continuity tracking: store last-row / last-col vertices for edge matching.
            var prevRowLast = new BspDrawVert[subW * gridDim]; // [subX, gx] = bottom edge of sub-patch above
            var prevColLast = new BspDrawVert[subH * gridDim]; // [subY, gy] = right edge of sub-patch to the left
            int uvMismatchCount = 0;

            for (int subY = 0; subY < subH; subY++)
            {
                for (int subX = 0; subX < subW; subX++)
                {
                    int baseI = subX * 2;
                    int baseJ = subY * 2;

                    // Evaluate Bezier on the (gridDim × gridDim) grid for this sub-patch.
                    for (int gy = 0; gy < gridDim; gy++)
                    {
                        float v = (float)gy / level;
                        float bv0 = (1 - v) * (1 - v);
                        float bv1 = 2f * v * (1 - v);
                        float bv2 = v * v;
                        for (int gx = 0; gx < gridDim; gx++)
                        {
                            float u = (float)gx / level;
                            float bu0 = (1 - u) * (1 - u);
                            float bu1 = 2f * u * (1 - u);
                            float bu2 = u * u;

                            grid[gy * gridDim + gx] = EvalBezier3x3(
                                ctrl, pw,
                                baseI, baseJ,
                                bu0, bu1, bu2,
                                bv0, bv1, bv2);
                        }
                    }

                    // Triangulate the grid as quads (two triangles per quad).
                    for (int gy = 0; gy < adaptiveLevel; gy++)
                    {
                        for (int gx = 0; gx < adaptiveLevel; gx++)
                        {
                            var v00 = grid[gy * gridDim + gx];
                            var v10 = grid[gy * gridDim + (gx + 1)];
                            var v01 = grid[(gy + 1) * gridDim + gx];
                            var v11 = grid[(gy + 1) * gridDim + (gx + 1)];
                            EmitTri(tris, surfaceIndex, s.ShaderIndex, v00, v10, v11);
                            EmitTri(tris, surfaceIndex, s.ShaderIndex, v00, v11, v01);
                        }
                    }

                    // ---- UV edge-continuity check ----
                    // Compare bottom edge of this sub-patch with top edge of sub-patch below.
                    if (subY > 0)
                    {
                        for (int gx = 0; gx < gridDim; gx++)
                        {
                            var cur = grid[0 * gridDim + gx]; // top row of current
                            var prev = prevRowLast[subX * gridDim + gx]; // bottom row of above
                            if (Vector2.Distance(cur.Lm0, prev.Lm0) > 0.5f / 128f) uvMismatchCount++;
                        }
                    }
                    // Compare right edge of this sub-patch with left edge of sub-patch to the right.
                    if (subX > 0)
                    {
                        for (int gy = 0; gy < gridDim; gy++)
                        {
                            var cur = grid[gy * gridDim + 0]; // left col of current
                            var prev = prevColLast[subY * gridDim + gy]; // right col of left neighbor
                            if (Vector2.Distance(cur.Lm0, prev.Lm0) > 0.5f / 128f) uvMismatchCount++;
                        }
                    }

                    // Snapshot edges for next sub-patch continuity checks.
                    for (int gx = 0; gx < gridDim; gx++)
                        prevRowLast[subX * gridDim + gx] = grid[(gridDim - 1) * gridDim + gx];
                    for (int gy = 0; gy < gridDim; gy++)
                        prevColLast[subY * gridDim + gy] = grid[gy * gridDim + (gridDim - 1)];
                }
            }

            // Patch surfaces with UV discontinuities > 2 pixels may have lightmap seam artifacts.
            // We keep the triangles (they're still useful for position/normal) but the estimator
            // should treat them with lower confidence near the discontinuity edges.
            if (uvMismatchCount > 2)
            {
                // Diagnostic: in future we could flag this surface for lower confidence.
                // For now: silently accepted; the sampling is still valid away from edges.
            }

            return tris;
        }

        private static BspDrawVert EvalBezier3x3(
            BspDrawVert[] ctrl, int pw,
            int baseI, int baseJ,
            float bu0, float bu1, float bu2,
            float bv0, float bv1, float bv2)
        {
            // 3x3 weights, row-major: cp[i, j] with i in u-direction, j in v-direction.
            float w00 = bu0 * bv0, w10 = bu1 * bv0, w20 = bu2 * bv0;
            float w01 = bu0 * bv1, w11 = bu1 * bv1, w21 = bu2 * bv1;
            float w02 = bu0 * bv2, w12 = bu1 * bv2, w22 = bu2 * bv2;

            ref readonly var c00 = ref ctrl[(baseJ + 0) * pw + (baseI + 0)];
            ref readonly var c10 = ref ctrl[(baseJ + 0) * pw + (baseI + 1)];
            ref readonly var c20 = ref ctrl[(baseJ + 0) * pw + (baseI + 2)];
            ref readonly var c01 = ref ctrl[(baseJ + 1) * pw + (baseI + 0)];
            ref readonly var c11 = ref ctrl[(baseJ + 1) * pw + (baseI + 1)];
            ref readonly var c21 = ref ctrl[(baseJ + 1) * pw + (baseI + 2)];
            ref readonly var c02 = ref ctrl[(baseJ + 2) * pw + (baseI + 0)];
            ref readonly var c12 = ref ctrl[(baseJ + 2) * pw + (baseI + 1)];
            ref readonly var c22 = ref ctrl[(baseJ + 2) * pw + (baseI + 2)];

            Vector3 xyz = w00 * c00.Xyz + w10 * c10.Xyz + w20 * c20.Xyz
                        + w01 * c01.Xyz + w11 * c11.Xyz + w21 * c21.Xyz
                        + w02 * c02.Xyz + w12 * c12.Xyz + w22 * c22.Xyz;

            Vector2 lm0 = w00 * c00.Lm0 + w10 * c10.Lm0 + w20 * c20.Lm0
                        + w01 * c01.Lm0 + w11 * c11.Lm0 + w21 * c21.Lm0
                        + w02 * c02.Lm0 + w12 * c12.Lm0 + w22 * c22.Lm0;
            Vector2 lm1 = w00 * c00.Lm1 + w10 * c10.Lm1 + w20 * c20.Lm1
                        + w01 * c01.Lm1 + w11 * c11.Lm1 + w21 * c21.Lm1
                        + w02 * c02.Lm1 + w12 * c12.Lm1 + w22 * c22.Lm1;
            Vector2 lm2 = w00 * c00.Lm2 + w10 * c10.Lm2 + w20 * c20.Lm2
                        + w01 * c01.Lm2 + w11 * c11.Lm2 + w21 * c21.Lm2
                        + w02 * c02.Lm2 + w12 * c12.Lm2 + w22 * c22.Lm2;
            Vector2 lm3 = w00 * c00.Lm3 + w10 * c10.Lm3 + w20 * c20.Lm3
                        + w01 * c01.Lm3 + w11 * c11.Lm3 + w21 * c21.Lm3
                        + w02 * c02.Lm3 + w12 * c12.Lm3 + w22 * c22.Lm3;

            // Bezier-interpolate per-vertex normal too. q3 typically re-derives from the
            // tessellated mesh via finite differences, but bezier of unit-normalised normals is
            // a good enough proxy for our coarse texel-sampling use; we per-triangle-recompute
            // the SurfaceTriangle.Normal from geometry below so this only seeds the per-vertex
            // normal field (currently unused by the estimator, kept for parity with planar
            // surfaces' winding).
            Vector3 normal = w00 * c00.Normal + w10 * c10.Normal + w20 * c20.Normal
                           + w01 * c01.Normal + w11 * c11.Normal + w21 * c21.Normal
                           + w02 * c02.Normal + w12 * c12.Normal + w22 * c22.Normal;
            float nLen = normal.Length();
            if (nLen > 1e-6f) normal /= nLen;

            return new BspDrawVert
            {
                Xyz = xyz,
                St = Vector2.Zero, // not used by the estimator
                Lm0 = lm0, Lm1 = lm1, Lm2 = lm2, Lm3 = lm3,
                Normal = normal,
                C0 = Color32.Zero, C1 = Color32.Zero, C2 = Color32.Zero, C3 = Color32.Zero,
            };
        }

        private static void EmitTri(List<SurfaceTriangle> tris, int surfaceIndex, int shaderIndex,
            BspDrawVert v0, BspDrawVert v1, BspDrawVert v2)
        {
            Vector3 p0 = v0.Xyz, p1 = v1.Xyz, p2 = v2.Xyz;
            Vector3 e1 = p1 - p0, e2 = p2 - p0;
            Vector3 fn = Vector3.Cross(e1, e2);
            float lenSq = fn.LengthSquared();
            if (lenSq < 1e-10f) return; // degenerate (sub-patch corner pinches happen)
            fn /= MathF.Sqrt(lenSq);

            tris.Add(new SurfaceTriangle
            {
                SurfaceIndex = surfaceIndex,
                ShaderIndex = shaderIndex,
                P0 = p0, P1 = p1, P2 = p2,
                Normal = fn,
                Lm0_0 = v0.Lm0, Lm0_1 = v1.Lm0, Lm0_2 = v2.Lm0,
                Lm1_0 = v0.Lm1, Lm1_1 = v1.Lm1, Lm1_2 = v2.Lm1,
                Lm2_0 = v0.Lm2, Lm2_1 = v1.Lm2, Lm2_2 = v2.Lm2,
                Lm3_0 = v0.Lm3, Lm3_1 = v1.Lm3, Lm3_2 = v2.Lm3,
            });
        }
    }
}
