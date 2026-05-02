using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Surfaces;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Sampling
{
    /// <summary>
    /// Phase H1 — exhaustive correctness audit of <see cref="TexelSampler"/> output.
    ///
    /// <para>Runs three independent correctness checks on every emitted sample:</para>
    /// <list type="number">
    ///   <item><b>Atlas round-trip:</b> every emitted <c>(AtlasIndex, AtlasX, AtlasY)</c>
    ///     must be re-readable via <see cref="LightmapAtlas.TryRead"/> and produce the
    ///     same normalised RGB as <c>sample.Observed</c>. Catches off-by-one atlas writes
    ///     / any transformation applied between fetch and store.</item>
    ///   <item><b>Barycentric inversion round-trip:</b> taking the triangle whose
    ///     lmUV-barycentric inversion produced the sample's world position, re-project
    ///     the world position back through the triangle's vertex lmUVs and assert the
    ///     result lands at the sample's (AtlasX+0.5, AtlasY+0.5) atlas-pixel centre
    ///     within 0.75 atlas-pixel tolerance (i.e. we picked the right triangle).</item>
    ///   <item><b>Planar-forward cross-check:</b> for planar surfaces the per-surface
    ///     <c>lightmapVecs[0..1]</c> forward map also yields a world position from an
    ///     atlas-pixel centre. Sample worlds must agree with that mapping within a
    ///     per-surface tolerance derived from the surface's lightmap scale.</item>
    /// </list>
    ///
    /// <para>The auditor also reports <b>coverage</b> statistics (texels in the surface
    /// lm-UV bbox that were NOT emitted) and <b>duplication</b> (any pair of samples that
    /// share the same (AtlasIndex, AtlasX, AtlasY) within a single surface).</para>
    /// </summary>
    public static class TexelFetchAuditor
    {
        public sealed class Options
        {
            /// <summary>Atlas round-trip: max permissible absolute difference between the
            /// re-read byte and the stored byte, normalised to 0..1. 1/255 ≈ 0.004 = one
            /// byte.</summary>
            public float AtlasRgbTolerance { get; init; } = 1f / 255f;

            /// <summary>Barycentric round-trip: max permissible atlas-pixel offset from
            /// the stored <c>(AtlasX+0.5, AtlasY+0.5)</c> centre when forward-mapping the
            /// sample's world position back through the triangle's lmUVs. 0.75 pixels
            /// tolerates sub-pixel numeric error without accepting obvious mis-picks.</summary>
            public float BarycentricAtlasPixelTolerance { get; init; } = 0.75f;

            /// <summary>Planar forward-map cross-check: max permissible world-space
            /// distance between the barycentric-derived world position and the
            /// lightmapVecs forward map. 2× the surface's lightmap-texel world size is
            /// used per surface; this value floors and caps that derived tolerance.</summary>
            public float PlanarWorldToleranceFloor { get; init; } = 1.0f;
            public float PlanarWorldToleranceCeiling { get; init; } = 96.0f;

            /// <summary>Hard limit on samples audited per call; default 100k (way over
            /// the per-map sample count used during estimation).</summary>
            public int MaxAudited { get; init; } = 200_000;
        }

        public sealed class Result
        {
            public int Audited { get; init; }
            public int AtlasRoundtripFailures { get; init; }
            public int BarycentricRoundtripFailures { get; init; }
            public int PlanarForwardFailures { get; init; }
            public int DuplicateSamePixel { get; init; }
            public float MaxAtlasRgbDelta { get; init; }
            public float MaxBarycentricPixelError { get; init; }
            public float MaxPlanarWorldError { get; init; }
            public IReadOnlyList<string> FirstFailureMessages { get; init; } = Array.Empty<string>();
            public bool AllPass =>
                AtlasRoundtripFailures == 0
                && BarycentricRoundtripFailures == 0
                && PlanarForwardFailures == 0
                && DuplicateSamePixel == 0;
        }

        public static Result Audit(
            BspFile bsp,
            SurfaceUnpacker.UnpackResult unpacked,
            LightmapAtlas atlas,
            IReadOnlyList<TexelSample> samples,
            Options? options = null,
            Logger? log = null)
        {
            options ??= new Options();
            int atlasFails = 0, baryFails = 0, planarFails = 0, dupes = 0;
            float maxAtlasDelta = 0f;
            float maxBaryPixErr = 0f;
            float maxPlanarWErr = 0f;
            var firstFails = new List<string>();

            var seenPerSurface = new Dictionary<int, HashSet<(int atlas, int x, int y)>>();

            // #region agent log (b852b4) - hypotheses H-A/H-B/H-C/H-D/H-E
            var dbgSurfacesLogged = new HashSet<int>();
            // #endregion

            int audited = 0;
            for (int si = 0; si < samples.Count && audited < options.MaxAudited; si++)
            {
                var s = samples[si];
                // Skip vertex-lit samples (no atlas pixel to round-trip on).
                if (s.AtlasIndex < 0) continue;
                audited++;

                // ---- 1. Atlas round-trip ----
                if (!atlas.TryRead(s.AtlasIndex, s.AtlasX, s.AtlasY, out byte rB, out byte gB, out byte bB))
                {
                    atlasFails++;
                    if (firstFails.Count < 8) firstFails.Add($"atlas OOB: surf {s.SurfaceIndex} stage {s.Stage} atlas={s.AtlasIndex} ({s.AtlasX},{s.AtlasY})");
                    continue;
                }
                float dR = MathF.Abs(rB / 255f - s.Observed.X);
                float dG = MathF.Abs(gB / 255f - s.Observed.Y);
                float dB = MathF.Abs(bB / 255f - s.Observed.Z);
                float maxD = MathF.Max(dR, MathF.Max(dG, dB));
                if (maxD > maxAtlasDelta) maxAtlasDelta = maxD;
                if (maxD > options.AtlasRgbTolerance)
                {
                    atlasFails++;
                    if (firstFails.Count < 8) firstFails.Add($"atlas mismatch: surf {s.SurfaceIndex} atlas={s.AtlasIndex} ({s.AtlasX},{s.AtlasY}) expected ({rB / 255f:F3},{gB / 255f:F3},{bB / 255f:F3}) got ({s.Observed.X:F3},{s.Observed.Y:F3},{s.Observed.Z:F3})");
                }

                // ---- 2. Barycentric round-trip ----
                var tris = unpacked.PerSurface[s.SurfaceIndex];
                bool baryOk = false;
                float bestPixErr = float.PositiveInfinity;
                if (tris != null)
                {
                    float targetAU = (s.AtlasX + 0.5f) / atlas.W;
                    float targetAV = (s.AtlasY + 0.5f) / atlas.H;
                    for (int ti = 0; ti < tris.Count; ti++)
                    {
                        var t = tris[ti];
                        // Compute the world-barycentric of s.World in the triangle,
                        // forward-map it through the triangle's lmUVs, and see if we land
                        // near the sample's atlas pixel.
                        if (!BaryOfPointInTriangle3D(t.P0, t.P1, t.P2, s.World, out float a, out float b, out float c)) continue;
                        if (a < -0.01f || b < -0.01f || c < -0.01f) continue;
                        var lm0 = t.LmStage(s.Stage, 0);
                        var lm1 = t.LmStage(s.Stage, 1);
                        var lm2 = t.LmStage(s.Stage, 2);
                        Vector2 predictedUv = a * lm0 + b * lm1 + c * lm2;
                        float dAx = (predictedUv.X - targetAU) * atlas.W;
                        float dAy = (predictedUv.Y - targetAV) * atlas.H;
                        float err = MathF.Sqrt(dAx * dAx + dAy * dAy);
                        if (err < bestPixErr) bestPixErr = err;
                        if (err <= options.BarycentricAtlasPixelTolerance)
                        {
                            baryOk = true;
                            break;
                        }
                    }
                }
                if (bestPixErr > maxBaryPixErr && !float.IsInfinity(bestPixErr)) maxBaryPixErr = bestPixErr;
                if (!baryOk)
                {
                    baryFails++;
                    if (firstFails.Count < 8) firstFails.Add($"bary roundtrip fail: surf {s.SurfaceIndex} atlas ({s.AtlasX},{s.AtlasY}) world ({s.World.X:F1},{s.World.Y:F1},{s.World.Z:F1}) min pix err {bestPixErr:F2}");
                }

                // ---- 3. Planar forward-map cross-check ----
                // We only run this for PLANAR surfaces whose LightmapOrigin/Vecs are
                // self-consistent with the vertex lmUVs — many synthetic BSPs and even
                // some third-party q3map2 variants write lmVecs that don't match their
                // vertex lmUVs (they only use one or the other at render time). We detect
                // inconsistency by forward-mapping vertex 0's surface-texel coords
                // through the lmVecs and comparing to vertex 0's actual world position.
                // When the magnitudes disagree, the lmVecs are advisory only and we skip.
                if (s.SurfaceIndex >= 0 && s.SurfaceIndex < bsp.Surfaces.Count)
                {
                    var surf = bsp.Surfaces[s.SurfaceIndex];
                    if (surf.SurfaceType == BspSurfaceType.Planar
                        && surf.LightmapVec0.LengthSquared() > 1e-6f
                        && surf.LightmapVec1.LengthSquared() > 1e-6f
                        && surf.LightmapWidth > 0 && surf.LightmapHeight > 0
                        && s.Stage == 0
                        && surf.LmIndex0 == s.AtlasIndex
                        && surf.NumVerts > 0
                        && IsLmVecsSelfConsistent(bsp, surf, atlas.W, atlas.H))
                    {
                        // #region agent log (b852b4) - one-shot per-surface diagnostics
                        if (dbgSurfacesLogged.Add(s.SurfaceIndex))
                        {
                            DebugLog.WritePerVertexConsistency("b852b4", "TexelFetchAuditor.cs:H-A", s.SurfaceIndex, bsp, surf, atlas.W, atlas.H);
                        }
                        // #endregion
                        // Forward-map assumes surface-texel coords: texel (0,0) centre is
                        // the first atlas-pixel centre owned by the surface, i.e. atlas
                        // (LmX0, LmY0). So surface-texel coord for atlas (ax, ay) is
                        // (ax - LmX0, ay - LmY0), plus 0.5 for centre.
                        float texU = s.AtlasX - surf.LmX0 + 0.5f;
                        float texV = s.AtlasY - surf.LmY0 + 0.5f;
                        Vector3 worldForward = surf.LightmapOrigin + texU * surf.LightmapVec0 + texV * surf.LightmapVec1;
                        float worldErr = (worldForward - s.World).Length();
                        // Per-surface tolerance: 2× the texel world-size.
                        float texelWorldSize = 1f / MathF.Max(1e-6f, surf.LightmapVec0.Length());
                        float tol = MathF.Max(options.PlanarWorldToleranceFloor,
                                   MathF.Min(options.PlanarWorldToleranceCeiling, 2f * texelWorldSize));
                        if (worldErr > maxPlanarWErr) maxPlanarWErr = worldErr;
                        // #region agent log (b852b4) - first-sample world vs forward + tolerance (H-B, H-C)
                        if (planarFails == 0 && firstFails.Count == 0)
                        {
                            DebugLog.WriteFirstPlanarSample("b852b4", "TexelFetchAuditor.cs:H-B-H-C",
                                s.SurfaceIndex, s.AtlasX, s.AtlasY, s.World, worldForward,
                                surf.LightmapOrigin, surf.LightmapVec0, surf.LightmapVec1,
                                surf.LmX0, surf.LmY0, surf.LightmapWidth, surf.LightmapHeight,
                                worldErr, tol, texelWorldSize);
                        }
                        // #endregion
                        if (worldErr > tol)
                        {
                            planarFails++;
                            if (firstFails.Count < 8) firstFails.Add($"planar forward fail: surf {s.SurfaceIndex} atlas ({s.AtlasX},{s.AtlasY}) world err {worldErr:F1}u (tol {tol:F1}u)");
                        }
                    }
                }

                // ---- 4. Duplicate detection (per surface) ----
                if (!seenPerSurface.TryGetValue(s.SurfaceIndex, out var seen))
                {
                    seen = new HashSet<(int, int, int)>();
                    seenPerSurface[s.SurfaceIndex] = seen;
                }
                if (!seen.Add((s.AtlasIndex, s.AtlasX, s.AtlasY)))
                {
                    dupes++;
                    if (firstFails.Count < 8) firstFails.Add($"dup sample: surf {s.SurfaceIndex} atlas ({s.AtlasX},{s.AtlasY})");
                }
            }

            var result = new Result
            {
                Audited = audited,
                AtlasRoundtripFailures = atlasFails,
                BarycentricRoundtripFailures = baryFails,
                PlanarForwardFailures = planarFails,
                DuplicateSamePixel = dupes,
                MaxAtlasRgbDelta = maxAtlasDelta,
                MaxBarycentricPixelError = maxBaryPixErr,
                MaxPlanarWorldError = maxPlanarWErr,
                FirstFailureMessages = firstFails,
            };

            if (log != null)
            {
                log.Info($"  texel-fetch audit: audited={audited} atlasFails={atlasFails} baryFails={baryFails} planarFails={planarFails} duplicates={dupes}");
                log.Info($"    max atlas rgb delta: {maxAtlasDelta:F4}, max bary pixel err: {maxBaryPixErr:F3}, max planar world err: {maxPlanarWErr:F2}u");
                if (!result.AllPass)
                {
                    log.Info("    first failures:");
                    foreach (var msg in firstFails) log.Info("      " + msg);
                }
            }

            return result;
        }

        /// <summary>Test whether a surface's <c>LightmapOrigin/Vec0/Vec1</c> are consistent
        /// with its per-vertex <c>Lm0</c> atlas-relative UVs. We pick the first vertex,
        /// derive its expected surface-texel coords from its <c>Lm0</c> and atlas size,
        /// forward-map through lmVecs, and compare to the vertex's actual world position.
        /// Disagreement &gt; 4u means the lmVecs aren't a faithful affine representation
        /// of the surface's lightmap layout (common in synthetic / hand-rolled BSPs) and
        /// the auditor skips the planar forward check for that surface.</summary>
        private static bool IsLmVecsSelfConsistent(BspFile bsp, BspDrawSurface surf, int atlasW, int atlasH)
        {
            if (surf.NumVerts == 0) return false;
            var v = bsp.DrawVerts[surf.FirstVert];
            // Atlas-space UV of vertex 0.
            float lmU = v.Lm0.X * atlasW;
            float lmV = v.Lm0.Y * atlasH;
            // Surface-texel coords (LmX0/LmY0 is the atlas-space start of the surface's
            // lightmap region; many IBSP46 BSPs leave these at 0, in which case the
            // surface-texel coord equals the atlas coord).
            float texU = lmU - surf.LmX0;
            float texV = lmV - surf.LmY0;
            Vector3 worldForward = surf.LightmapOrigin + texU * surf.LightmapVec0 + texV * surf.LightmapVec1;
            float err = (worldForward - v.Xyz).Length();
            return err <= 4f;
        }

        // #region agent log (b852b4) - debug-mode NDJSON sink
        internal static class DebugLog
        {
            private static readonly string LogPath = ResolveLogPath();
            private static readonly object Lock = new object();

            private static string ResolveLogPath()
            {
                // Walk upward from CWD looking for a folder with the BspLightReSlopper repo
                // markers; write debug-b852b4.log there. Falls back to CWD.
                string cur = System.IO.Directory.GetCurrentDirectory();
                for (int i = 0; i < 6 && !string.IsNullOrEmpty(cur); i++)
                {
                    if (System.IO.File.Exists(System.IO.Path.Combine(cur, "BspLightReSlopper.sln")))
                        return System.IO.Path.Combine(cur, "debug-b852b4.log");
                    cur = System.IO.Path.GetDirectoryName(cur) ?? "";
                }
                return System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "debug-b852b4.log");
            }

            private static void Append(string json)
            {
                try
                {
                    lock (Lock) System.IO.File.AppendAllText(LogPath, json + "\n", System.Text.Encoding.UTF8);
                }
                catch { /* swallow: instrumentation must never break the test */ }
            }

            internal static void WritePerVertexConsistency(string sessionId, string location, int surfaceIndex,
                BspFile bsp, BspDrawSurface surf, int atlasW, int atlasH)
            {
                long ts = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                int n = surf.NumVerts;
                float maxErr = 0f, minErr = float.PositiveInfinity, errAtV0 = -1f;
                int worstVtx = -1;
                for (int vi = 0; vi < n; vi++)
                {
                    var v = bsp.DrawVerts[surf.FirstVert + vi];
                    float lmU = v.Lm0.X * atlasW;
                    float lmV = v.Lm0.Y * atlasH;
                    float texU = lmU - surf.LmX0;
                    float texV = lmV - surf.LmY0;
                    Vector3 worldForward = surf.LightmapOrigin + texU * surf.LightmapVec0 + texV * surf.LightmapVec1;
                    float err = (worldForward - v.Xyz).Length();
                    if (vi == 0) errAtV0 = err;
                    if (err > maxErr) { maxErr = err; worstVtx = vi; }
                    if (err < minErr) minErr = err;
                }
                string json = "{\"sessionId\":\"" + sessionId + "\",\"hypothesisId\":\"H-A\",\"location\":\"" + location +
                              "\",\"timestamp\":" + ts +
                              ",\"message\":\"per-vertex IsLmVecsSelfConsistent error\",\"data\":{" +
                              "\"surfaceIndex\":" + surfaceIndex +
                              ",\"numVerts\":" + n +
                              ",\"errAtV0\":" + F(errAtV0) +
                              ",\"maxErr\":" + F(maxErr) +
                              ",\"worstVertex\":" + worstVtx +
                              ",\"minErr\":" + F(minErr) +
                              ",\"checkOnlyV0Returns\":\"" + (errAtV0 <= 4f ? "consistent" : "inconsistent") + "\"" +
                              ",\"checkAllVertsWouldReturn\":\"" + (maxErr <= 4f ? "consistent" : "inconsistent") + "\"" +
                              "}}";
                Append(json);
            }

            internal static void WriteFirstPlanarSample(string sessionId, string location,
                int surfaceIndex, int ax, int ay, Vector3 world, Vector3 worldForward,
                Vector3 origin, Vector3 lmVec0, Vector3 lmVec1, int lmX0, int lmY0, int lmW, int lmH,
                float worldErr, float tol, float texelWorldSize)
            {
                long ts = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                string json = "{\"sessionId\":\"" + sessionId + "\",\"hypothesisId\":\"H-B,H-C,H-D\",\"location\":\"" + location +
                              "\",\"timestamp\":" + ts +
                              ",\"message\":\"first planar-check sample world vs forward\",\"data\":{" +
                              "\"surfaceIndex\":" + surfaceIndex +
                              ",\"atlasX\":" + ax + ",\"atlasY\":" + ay +
                              ",\"sampleWorld\":[" + F(world.X) + "," + F(world.Y) + "," + F(world.Z) + "]" +
                              ",\"forwardWorld\":[" + F(worldForward.X) + "," + F(worldForward.Y) + "," + F(worldForward.Z) + "]" +
                              ",\"lightmapOrigin\":[" + F(origin.X) + "," + F(origin.Y) + "," + F(origin.Z) + "]" +
                              ",\"lightmapVec0\":[" + F(lmVec0.X) + "," + F(lmVec0.Y) + "," + F(lmVec0.Z) + "]" +
                              ",\"lightmapVec1\":[" + F(lmVec1.X) + "," + F(lmVec1.Y) + "," + F(lmVec1.Z) + "]" +
                              ",\"lmX0\":" + lmX0 + ",\"lmY0\":" + lmY0 + ",\"lmW\":" + lmW + ",\"lmH\":" + lmH +
                              ",\"lmVec0Length\":" + F(lmVec0.Length()) +
                              ",\"texelWorldSize\":" + F(texelWorldSize) +
                              ",\"tolerance\":" + F(tol) +
                              ",\"worldErr\":" + F(worldErr) +
                              "}}";
                Append(json);
            }

            private static string F(float v) => v.ToString("0.######", System.Globalization.CultureInfo.InvariantCulture);
        }
        // #endregion

        /// <summary>Compute the barycentric coordinates of point <paramref name="p"/>
        /// in triangle <c>(p0,p1,p2)</c>. We project <paramref name="p"/> onto the
        /// triangle's plane first (so a world-space query point slightly off-plane still
        /// yields barycentric coords that sum to 1 and identify the closest in-plane
        /// point). Returns false if the triangle is degenerate.</summary>
        private static bool BaryOfPointInTriangle3D(
            Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p,
            out float a, out float b, out float c)
        {
            a = b = c = 0;
            Vector3 v0 = p1 - p0;
            Vector3 v1 = p2 - p0;
            Vector3 v2 = p - p0;
            float d00 = Vector3.Dot(v0, v0);
            float d01 = Vector3.Dot(v0, v1);
            float d11 = Vector3.Dot(v1, v1);
            float d20 = Vector3.Dot(v2, v0);
            float d21 = Vector3.Dot(v2, v1);
            float denom = d00 * d11 - d01 * d01;
            if (MathF.Abs(denom) < 1e-12f) return false;
            b = (d11 * d20 - d01 * d21) / denom;
            c = (d00 * d21 - d01 * d20) / denom;
            a = 1f - b - c;
            return true;
        }
    }
}
