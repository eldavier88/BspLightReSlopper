using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.Surfaces;

namespace BspLightReSlopper.Sampling
{
    /// <summary>
    /// Phase E3 -- vertex-light sampler. Surfaces that are not lightmap-lit (LmIndex0 == -1
    /// OR shader has SURF_NOLIGHTMAP) but carry per-vertex lit RGB colour in
    /// <see cref="BspDrawVert.C0"/>..<c>C3</c> contribute information the lightmap-only
    /// sampler misses. We emit one <see cref="TexelSample"/> per (vertex, lightmap stage)
    /// pair with <c>Observed = vertex.C{stage}.NormalisedRgb</c>.
    ///
    /// <para>The estimator treats these samples identically to lightmap texels (same
    /// world-position-and-normal-and-brightness shape). For surfaces that have BOTH a
    /// lightmap AND vertex colours (some IBSP46 maps do this) we prefer the lightmap;
    /// vertex sampling kicks in only when the surface has no lightmap path.</para>
    ///
    /// <para>JK2 has many vertex-lit surfaces -- pit.bsp's iconic central crater is
    /// largely vertex-lit; without this pass we miss most of its illumination.</para>
    /// </summary>
    public static class VertexLightSampler
    {
        public sealed class SampleResult
        {
            public IReadOnlyList<TexelSample> Samples { get; init; } = Array.Empty<TexelSample>();
            public int VertexLitSurfaces { get; init; }
            public int VertexLitSurfacesWithoutColor { get; init; }
            public int StagesProcessed { get; init; }
        }

        public static SampleResult Sample(BspFile bsp, BspCollision? collision = null)
        {
            var samples = new List<TexelSample>();
            int vertexLitSurfaces = 0;
            int vertexLitSurfacesWithoutColor = 0;
            int stagesProcessed = 0;
            int stageCount = bsp.LightmapStageCount;

            for (int si = 0; si < bsp.Surfaces.Count; si++)
            {
                var s = bsp.Surfaces[si];

                // Surface is "vertex-lit" only when it has no lightmap path:
                //   LmIndex0 == -1 (no lightmap atlas assigned)
                //   OR the shader carries SURF_NOLIGHTMAP
                int sflags = (s.ShaderIndex >= 0 && s.ShaderIndex < bsp.Shaders.Count)
                    ? bsp.Shaders[s.ShaderIndex].SurfaceFlags : 0;
                bool noLightmap = s.LmIndex0 < 0 || (sflags & SurfaceUnpacker.SURF_NOLIGHTMAP) != 0;
                if (!noLightmap) continue;
                // Skip non-renderable surfaces (sky, nodraw, flares, patches without verts).
                if ((sflags & SurfaceUnpacker.SURF_NODRAW) != 0) continue;
                if ((sflags & SurfaceUnpacker.SURF_SKY) != 0) continue;
                if (s.SurfaceType == BspSurfaceType.Flare) continue;
                if (s.NumVerts <= 0) continue;

                vertexLitSurfaces++;
                bool surfaceHasColor = false;

                for (int vi = 0; vi < s.NumVerts; vi++)
                {
                    var v = bsp.DrawVerts[s.FirstVert + vi];
                    var n = v.Normal;
                    if (n.LengthSquared() < 1e-6f) continue;
                    n = Vector3.Normalize(n);

                    for (int st = 0; st < stageCount; st++)
                    {
                        var color = StageColor(v, st);
                        if (color.X == 0 && color.Y == 0 && color.Z == 0) continue;
                        surfaceHasColor = true;

                        int cluster = -2;
                        if (collision != null)
                        {
                            // Step a tiny epsilon along the normal so the leaf lookup falls
                            // inside the empty leaf adjacent to the surface, not on the
                            // wall plane itself.
                            var probe = v.Xyz + n * 1f;
                            int leaf = collision.PointLeaf(probe);
                            if (leaf >= 0 && leaf < bsp.Leafs.Count)
                                cluster = bsp.Leafs[leaf].Cluster;
                        }

                        samples.Add(new TexelSample
                        {
                            SurfaceIndex = si,
                            ShaderIndex = s.ShaderIndex,
                            Stage = st,
                            World = v.Xyz,
                            Normal = n,
                            Observed = color,
                            // Atlas indices are -1 for vertex-only samples; the estimator
                            // doesn't depend on them, but the diagnostic CSV does.
                            AtlasIndex = -1,
                            AtlasX = -1,
                            AtlasY = vi,
                            LightmapStyle = 0,
                            Cluster = cluster,
                        });
                        if (st == 0) stagesProcessed++;
                    }
                }
                if (!surfaceHasColor) vertexLitSurfacesWithoutColor++;
            }

            return new SampleResult
            {
                Samples = samples,
                VertexLitSurfaces = vertexLitSurfaces,
                VertexLitSurfacesWithoutColor = vertexLitSurfacesWithoutColor,
                StagesProcessed = stagesProcessed,
            };
        }

        private static Vector3 StageColor(BspDrawVert v, int stage)
        {
            return stage switch
            {
                0 => v.C0.NormalisedRgb,
                1 => v.C1.NormalisedRgb,
                2 => v.C2.NormalisedRgb,
                _ => v.C3.NormalisedRgb,
            };
        }
    }
}
