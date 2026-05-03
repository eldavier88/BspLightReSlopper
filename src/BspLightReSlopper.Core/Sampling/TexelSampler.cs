using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Surfaces;

namespace BspLightReSlopper.Sampling
{
    /// <summary>
    /// Walks every lit surface, every lightmap stage, and every texel inside each surface's
    /// lightmap rect; for each texel finds the containing tessellated triangle, inverts
    /// the lightmap UV → world barycentric to recover a world-space sample point, reads the
    /// lightmap pixel, and emits a <see cref="TexelSample"/>.
    ///
    /// Phase A makes a few intentional simplifications:
    /// <list type="bullet">
    ///   <item>A texel whose RGB is exactly (0,0,0) is treated as unlit and skipped — the
    ///         estimator wants positive observations.</item>
    ///   <item>If the texel center doesn't fall inside any triangle's lightmap-UV bbox we
    ///         use the nearest-triangle's barycentric extrapolation, which is fine for
    ///         q3-style 1-texel-padded atlases but logged as a soft-warning count.</item>
    ///   <item>Per-stage subsampling is uniform; the global cap (default 500_000 samples)
    ///         is applied via stride decimation across all surfaces.</item>
    /// </list>
    /// </summary>
    public static class TexelSampler
    {
        public sealed class SampleOptions
        {
            public int MaxSamples { get; init; } = 500_000;
            /// <summary>If true, emit samples for every lit texel; ignored when MaxSamples kicks in.</summary>
            public bool DenseWalk { get; init; } = true;
        }

        public sealed class SampleResult
        {
            public IReadOnlyList<TexelSample> Samples { get; init; } = Array.Empty<TexelSample>();
            public int LitTexelsConsidered { get; init; }
            public int UnlitSkipped { get; init; }
            public int OutOfTriangleSamples { get; init; }
            public int StagesProcessed { get; init; }
            public int SurfacesSampled { get; init; }
        }

        public static SampleResult Sample(BspFile bsp, SurfaceUnpacker.UnpackResult unpacked, LightmapAtlas atlas, SampleOptions? options = null, BspCollision? collision = null)
        {
            options ??= new SampleOptions();
            var samples = new List<TexelSample>(Math.Min(options.MaxSamples, 64_000));
            int litConsidered = 0, unlitSkipped = 0, outsideTris = 0, stages = 0, surfacesSampled = 0;
            int stride = 1;

            // First pass: count total texels we'd emit so we can pick a uniform stride.
            long lit = 0;
            for (int si = 0; si < bsp.Surfaces.Count; si++)
            {
                var tris = unpacked.PerSurface[si];
                if (tris == null || tris.Count == 0) continue;
                var s = bsp.Surfaces[si];
                int stageCount = bsp.LightmapStageCount;
                for (int st = 0; st < stageCount; st++)
                {
                    int lmIdx = s.LightmapIndex(st);
                    if (lmIdx < 0) continue;
                    long w = s.LightmapWidth, h = s.LightmapHeight;
                    if (w <= 0 || h <= 0) continue;
                    lit += w * h;
                }
            }
            if (lit > options.MaxSamples)
            {
                stride = (int)Math.Ceiling((double)lit / options.MaxSamples);
            }

            // Second pass: emit.
            int counter = 0;
            for (int si = 0; si < bsp.Surfaces.Count; si++)
            {
                var tris = unpacked.PerSurface[si];
                if (tris == null || tris.Count == 0) continue;
                var s = bsp.Surfaces[si];
                int stageCount = bsp.LightmapStageCount;
                bool surfaceContributed = false;

                for (int st = 0; st < stageCount; st++)
                {
                    int lmIdx = s.LightmapIndex(st);
                    if (lmIdx < 0) continue;
                    stages++;

                    // Compute the union lmUV bbox of all triangles for this stage. Vertex Lm
                    // UVs are atlas-relative ([0,1]) for both IBSP46 and RBSP1, so we walk
                    // atlas pixels directly. We deliberately ignore the per-surface
                    // (lmX, lmY, W, H) fields: they're zero on q3map2-built IBSP46 outputs
                    // for many surfaces, and they're redundant with the vertex Lm bbox.
                    float uMin = float.PositiveInfinity, uMax = float.NegativeInfinity;
                    float vMin = float.PositiveInfinity, vMax = float.NegativeInfinity;
                    for (int i = 0; i < tris.Count; i++)
                    {
                        for (int k = 0; k < 3; k++)
                        {
                            var lm = tris[i].LmStage(st, k);
                            if (lm.X < uMin) uMin = lm.X;
                            if (lm.X > uMax) uMax = lm.X;
                            if (lm.Y < vMin) vMin = lm.Y;
                            if (lm.Y > vMax) vMax = lm.Y;
                        }
                    }
                    if (!(uMax > uMin && vMax > vMin)) continue;

                    int axMin = Math.Max(0, (int)MathF.Floor(uMin * atlas.W));
                    int ayMin = Math.Max(0, (int)MathF.Floor(vMin * atlas.H));
                    int axMax = Math.Min(atlas.W - 1, (int)MathF.Ceiling(uMax * atlas.W));
                    int ayMax = Math.Min(atlas.H - 1, (int)MathF.Ceiling(vMax * atlas.H));

                    for (int ay = ayMin; ay <= ayMax; ay++)
                    {
                        for (int ax = axMin; ax <= axMax; ax++)
                        {
                            counter++;
                            if (counter % stride != 0) continue;

                            litConsidered++;
                            // atlas-relative UV at texel center
                            float au = (ax + 0.5f) / atlas.W;
                            float av = (ay + 0.5f) / atlas.H;

                            // Find triangle whose stage-st lmUV bbox contains (au, av).
                            int triIdx = FindContaining(tris, st, au, av);
                            if (triIdx < 0)
                            {
                                outsideTris++;
                                continue;
                            }

                            var t = tris[triIdx];
                            var l0 = t.LmStage(st, 0);
                            var l1 = t.LmStage(st, 1);
                            var l2 = t.LmStage(st, 2);
                            if (!Bary2D(l0, l1, l2, new Vector2(au, av), out float a, out float b, out float c))
                                continue; // degenerate
                            Vector3 world = a * t.P0 + b * t.P1 + c * t.P2;

                            // Read lightmap pixel
                            atlas.TryRead(lmIdx, ax, ay, out byte r, out byte g, out byte bg);
                            if (r == 0 && g == 0 && bg == 0)
                            {
                                unlitSkipped++;
                                continue;
                            }

                            byte style = s.LightmapStyle(st);
                            int cluster = -2;
                            if (collision != null)
                            {
                                // Step the world point a tiny epsilon along the surface normal so
                                // the sample falls clearly inside the empty leaf adjacent to the
                                // wall, not on the wall plane itself (where leaf assignment is
                                // ambiguous and PointLeaf may report the solid side).
                                var probe = world + t.Normal * 1f;
                                int leaf = collision.PointLeaf(probe);
                                if (leaf >= 0 && leaf < bsp.Leafs.Count)
                                    cluster = bsp.Leafs[leaf].Cluster;
                            }
                            samples.Add(new TexelSample
                            {
                                SurfaceIndex = si,
                                ShaderIndex = t.ShaderIndex,
                                Stage = st,
                                World = world,
                                Normal = t.Normal,
                                Observed = new Vector3(r / 255f, g / 255f, bg / 255f),
                                AtlasIndex = lmIdx,
                                AtlasX = ax,
                                AtlasY = ay,
                                LightmapStyle = style,
                                Cluster = cluster,
                            });
                            surfaceContributed = true;
                        }
                    }
                }

                if (surfaceContributed) surfacesSampled++;
            }

            return new SampleResult
            {
                Samples = samples,
                LitTexelsConsidered = litConsidered,
                UnlitSkipped = unlitSkipped,
                OutOfTriangleSamples = outsideTris,
                StagesProcessed = stages,
                SurfacesSampled = surfacesSampled,
            };
        }

        private static int FindContaining(List<SurfaceTriangle> tris, int stage, float u, float v)
        {
            // Pick the triangle where (u, v) is "most strictly" contained. In overlap /
            // edge cases on tessellated patches and tri-soup, this is more robust than
            // the old first-match-wins: adjacent triangles sharing an edge both contain
            // edge-adjacent pixels; "deepest-inside" picks the one the pixel belongs to
            // canonically. We still reject if no triangle is within 1e-4 epsilon.
            int bestIdx = -1;
            float bestDeficit = float.PositiveInfinity;
            var p = new Vector2(u, v);
            for (int i = 0; i < tris.Count; i++)
            {
                var t = tris[i];
                Vector2 a = t.LmStage(stage, 0);
                Vector2 b = t.LmStage(stage, 1);
                Vector2 c = t.LmStage(stage, 2);
                if (!Bary2D(a, b, c, p, out float wa, out float wb, out float wc)) continue;
                // "Deficit" = max(0, -min(wa, wb, wc)). 0 = strictly contained; positive
                // = how far outside we are, in barycentric units.
                float def = 0f;
                if (wa < 0) def = -wa;
                if (-wb > def) def = -wb;
                if (-wc > def) def = -wc;
                if (def < 0f) def = 0f;
                if (def < bestDeficit)
                {
                    bestDeficit = def;
                    bestIdx = i;
                    if (def == 0f) return bestIdx; // strictly contained — stop.
                }
            }
            if (bestDeficit > 1e-4f) return -1;
            return bestIdx;
        }

        /// <summary>2D barycentric. Returns false if triangle is degenerate.</summary>
        private static bool Bary2D(Vector2 a, Vector2 b, Vector2 c, Vector2 p, out float wa, out float wb, out float wc)
        {
            wa = wb = wc = 0;
            float denom = (b.X - a.X) * (c.Y - a.Y) - (c.X - a.X) * (b.Y - a.Y);
            if (MathF.Abs(denom) < 1e-12f) return false;
            wb = ((p.X - a.X) * (c.Y - a.Y) - (c.X - a.X) * (p.Y - a.Y)) / denom;
            wc = ((b.X - a.X) * (p.Y - a.Y) - (p.X - a.X) * (b.Y - a.Y)) / denom;
            wa = 1f - wb - wc;
            return true;
        }
    }
}
