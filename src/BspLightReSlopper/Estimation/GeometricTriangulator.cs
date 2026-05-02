using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// Phase E2 -- geometric triangulation: detect brightness peaks on each surface, treat
    /// each peak's surface normal as a "this light is somewhere along this ray" constraint,
    /// then intersect rays from different surfaces to recover candidate light positions.
    ///
    /// <para>This is the photogrammetry-style constraint the user asked for: a brightness
    /// peak on a surface tells you the light is on (or very near) the line through that
    /// peak in the direction of the surface normal. Two such rays from different surfaces
    /// looking at the same light meet at the light's position. Multi-ray intersection
    /// clusters the meet-points to recover light positions with no LSQ involvement.</para>
    ///
    /// <para>Combined with -- never replacing -- the existing RANSAC + LSQ greedy peel.
    /// The triangulated cluster centres become seed candidates with a score boost
    /// multiplicative bonus in the per-round candidate evaluation. Pure-RANSAC candidates
    /// keep their <c>_method = "ransac+greedy"</c>; triangulated ones become
    /// <c>"triangulation+lsq"</c>. No method runs alone.</para>
    /// </summary>
    public sealed class GeometricTriangulator
    {
        public sealed class Options
        {
            /// <summary>A texel is a "highlight peak" only if its luma exceeds this many
            /// times the surface's mean luma. 1.5 = clearly above the local norm.</summary>
            public float PeakLumaMultiplier { get; init; } = 1.5f;

            /// <summary>Absolute lower bound on peak luma to avoid noise on dim surfaces.</summary>
            public float PeakLumaFloor { get; init; } = 0.10f;

            /// <summary>Maximum peaks taken from any single surface. Even huge surfaces
            /// shouldn't dominate the global pool.</summary>
            public int MaxPeaksPerSurface { get; init; } = 4;

            /// <summary>Global cap on total peaks to keep the O(P²) pair scan tractable.
            /// 1000 peaks => 500k pairs => well under a second of compute.</summary>
            public int MaxTotalPeaks { get; init; } = 1000;

            /// <summary>Two rays must approach within this distance (q3 units) for their
            /// midpoint to be emitted as a triangulated candidate. Bigger = more permissive
            /// (more clusters, including spurious); smaller = tighter (fewer clusters,
            /// possibly missing real lights with imperfect peak detection).</summary>
            public float RayApproachThreshold { get; init; } = 48f;

            /// <summary>Both rays' light-distance parameters must satisfy this minimum.
            /// Negative parameters mean the closest-approach point is "behind" the surface,
            /// which is geometrically impossible for a real light illuminating the surface.</summary>
            public float MinRayParameter { get; init; } = 4f;

            /// <summary>Maximum sane ray distance. A peak with normal extended this far is
            /// almost certainly being matched against a coincidentally-aligned other ray;
            /// real maps don't have lights >2048u above their lit surfaces.</summary>
            public float MaxRayParameter { get; init; } = 2048f;

            /// <summary>Mean-shift bandwidth (q3 units) for clustering triangulated candidates
            /// into final seed positions. q3 light grid resolution is 64u; same here.</summary>
            public float ClusterBandwidth { get; init; } = 64f;

            /// <summary>Mean-shift convergence tolerance (q3 units).</summary>
            public float ClusterConvergence { get; init; } = 1f;

            /// <summary>Maximum mean-shift iterations per seed.</summary>
            public int ClusterMaxIterations { get; init; } = 30;

            /// <summary>Minimum number of triangulated candidates that must agree on a cluster
            /// for it to be emitted as a seed. Single-pair intersections are too noisy.</summary>
            public int MinClusterSupport { get; init; } = 3;
        }

        public sealed class TriangulatedSeed
        {
            public Vector3 Position { get; init; }
            /// <summary>How many ray-pair intersections agreed on this cluster centre. Higher
            /// = more confident.</summary>
            public int Support { get; init; }
            /// <summary>Mean color of the brightness peaks contributing to this cluster.</summary>
            public Vector3 MeanPeakColor { get; init; } = Vector3.One;
            /// <summary>Number of distinct surfaces whose peaks voted for this cluster. >=2
            /// means the cluster is genuinely triangulated (otherwise it's just stack of
            /// rays from one surface).</summary>
            public int DistinctSurfaceCount { get; init; }
        }

        public sealed class Result
        {
            public IReadOnlyList<TriangulatedSeed> Seeds { get; init; } = Array.Empty<TriangulatedSeed>();
            public int PeaksFound { get; init; }
            public int RayPairsConsidered { get; init; }
            public int RayPairsIntersected { get; init; }
        }

        public static Result Triangulate(IReadOnlyList<TexelSample> samples, Options? options = null, Logger? log = null)
        {
            options ??= new Options();
            int n = samples.Count;
            if (n < 8) return new Result();

            // ----- 1. Group by (surface, stage) and pick top peaks per group ----------
            var perSurfaceMean = new Dictionary<(int surf, int stage), (float lumaSum, int count)>();
            for (int i = 0; i < n; i++)
            {
                var key = (samples[i].SurfaceIndex, samples[i].Stage);
                if (!perSurfaceMean.TryGetValue(key, out var v)) v = (0, 0);
                v.lumaSum += Luma(samples[i].Observed);
                v.count++;
                perSurfaceMean[key] = v;
            }

            // For each (surface, stage), find local-max texels in atlas. We need an atlas
            // index lookup for 4-neighbour comparison (same key shape as in BlowoutDetector).
            var atlasIndex = new Dictionary<(int atlas, int ax, int ay, int surf, int stage), int>(n);
            for (int i = 0; i < n; i++)
                atlasIndex[(samples[i].AtlasIndex, samples[i].AtlasX, samples[i].AtlasY, samples[i].SurfaceIndex, samples[i].Stage)] = i;

            var peaksPerGroup = new Dictionary<(int surf, int stage), List<(int idx, float luma)>>();
            for (int i = 0; i < n; i++)
            {
                var s = samples[i];
                var key = (s.SurfaceIndex, s.Stage);
                float ownLuma = Luma(s.Observed);
                if (ownLuma < options.PeakLumaFloor) continue;
                var (sumL, cnt) = perSurfaceMean[key];
                float meanL = cnt > 0 ? sumL / cnt : 0;
                if (ownLuma < options.PeakLumaMultiplier * meanL) continue;

                // Local max: brighter than every sampled 4-neighbour in the same surface/stage.
                bool isLocalMax = true;
                int neighborCount = 0;
                foreach (var (dx, dy) in Neighbours)
                {
                    if (atlasIndex.TryGetValue((s.AtlasIndex, s.AtlasX + dx, s.AtlasY + dy, s.SurfaceIndex, s.Stage), out int j))
                    {
                        neighborCount++;
                        if (Luma(samples[j].Observed) > ownLuma) { isLocalMax = false; break; }
                    }
                }
                if (!isLocalMax || neighborCount < 2) continue;

                if (!peaksPerGroup.TryGetValue(key, out var lst))
                {
                    lst = new List<(int idx, float luma)>();
                    peaksPerGroup[key] = lst;
                }
                lst.Add((i, ownLuma));
            }

            // Take top MaxPeaksPerSurface per group, then top MaxTotalPeaks globally.
            var allPeaks = new List<(int idx, float luma)>();
            foreach (var lst in peaksPerGroup.Values)
            {
                lst.Sort((a, b) => b.luma.CompareTo(a.luma));
                int take = Math.Min(options.MaxPeaksPerSurface, lst.Count);
                for (int p = 0; p < take; p++) allPeaks.Add(lst[p]);
            }
            allPeaks.Sort((a, b) => b.luma.CompareTo(a.luma));
            if (allPeaks.Count > options.MaxTotalPeaks)
                allPeaks.RemoveRange(options.MaxTotalPeaks, allPeaks.Count - options.MaxTotalPeaks);

            log?.Info($"  triangulation: {allPeaks.Count} peak(s) across {peaksPerGroup.Count} surface-stage(s)");
            if (allPeaks.Count < 2)
                return new Result { Seeds = Array.Empty<TriangulatedSeed>(), PeaksFound = allPeaks.Count };

            // ----- 2. Pairwise ray-ray closest-approach intersection ------------------
            // For each pair of peaks from DIFFERENT surfaces (real triangulation requires
            // independent observations), compute the closest-approach midpoint between
            // their normal-rays. Skip parallel rays (denom near zero) and rays whose
            // closest approach is "behind" either surface (negative parameter).
            int pairsConsidered = 0, pairsIntersected = 0;
            var candidatesPos = new List<Vector3>();
            var candidatesPeakIdx = new List<(int peakA, int peakB)>(); // for color + surface tracking
            for (int a = 0; a < allPeaks.Count; a++)
            {
                int aIdx = allPeaks[a].idx;
                Vector3 p1 = samples[aIdx].World;
                Vector3 n1 = samples[aIdx].Normal;
                int aSurf = samples[aIdx].SurfaceIndex;
                for (int b = a + 1; b < allPeaks.Count; b++)
                {
                    int bIdx = allPeaks[b].idx;
                    if (samples[bIdx].SurfaceIndex == aSurf) continue; // same surface = no triangulation
                    pairsConsidered++;
                    Vector3 p2 = samples[bIdx].World;
                    Vector3 n2 = samples[bIdx].Normal;
                    if (TryRayRayClosestApproach(p1, n1, p2, n2,
                        out float tA, out float tB, out Vector3 mid, out float dist))
                    {
                        if (dist > options.RayApproachThreshold) continue;
                        if (tA < options.MinRayParameter || tB < options.MinRayParameter) continue;
                        if (tA > options.MaxRayParameter || tB > options.MaxRayParameter) continue;
                        candidatesPos.Add(mid);
                        candidatesPeakIdx.Add((aIdx, bIdx));
                        pairsIntersected++;
                    }
                }
            }

            log?.Info($"  triangulation: {pairsConsidered} ray-pairs considered, {pairsIntersected} intersected within {options.RayApproachThreshold:F0}u");

            if (candidatesPos.Count < options.MinClusterSupport)
                return new Result { Seeds = Array.Empty<TriangulatedSeed>(), PeaksFound = allPeaks.Count, RayPairsConsidered = pairsConsidered, RayPairsIntersected = pairsIntersected };

            // ----- 3. Mean-shift cluster the candidate positions -----------------------
            var modes = new List<Vector3>();
            float bw2 = options.ClusterBandwidth * options.ClusterBandwidth;
            float convTol2 = options.ClusterConvergence * options.ClusterConvergence;
            for (int s = 0; s < candidatesPos.Count; s++)
            {
                Vector3 m = candidatesPos[s];
                for (int it = 0; it < options.ClusterMaxIterations; it++)
                {
                    Vector3 sumP = Vector3.Zero;
                    int sumN = 0;
                    foreach (var p in candidatesPos)
                        if ((p - m).LengthSquared() <= bw2) { sumP += p; sumN++; }
                    if (sumN == 0) break;
                    Vector3 next = sumP / sumN;
                    if ((next - m).LengthSquared() < convTol2) { m = next; break; }
                    m = next;
                }
                modes.Add(m);
            }

            // Coalesce nearby modes (within bw/2) into clusters; track support count and
            // the contributing surface set per cluster.
            var clusterCenter = new List<Vector3>();
            var clusterSupport = new List<int>();
            var clusterColorSum = new List<Vector3>();
            var clusterSurfSet = new List<HashSet<int>>();
            float mergeR2 = (options.ClusterBandwidth * 0.5f) * (options.ClusterBandwidth * 0.5f);
            for (int s = 0; s < modes.Count; s++)
            {
                Vector3 m = modes[s];
                int found = -1;
                for (int c = 0; c < clusterCenter.Count; c++)
                {
                    if ((m - clusterCenter[c]).LengthSquared() <= mergeR2) { found = c; break; }
                }
                var (peakA, peakB) = candidatesPeakIdx[s];
                var contribColor = (samples[peakA].Observed + samples[peakB].Observed) * 0.5f;
                if (found < 0)
                {
                    clusterCenter.Add(m);
                    clusterSupport.Add(1);
                    clusterColorSum.Add(contribColor);
                    var ss = new HashSet<int> { samples[peakA].SurfaceIndex, samples[peakB].SurfaceIndex };
                    clusterSurfSet.Add(ss);
                }
                else
                {
                    int sup = clusterSupport[found];
                    clusterCenter[found] = (clusterCenter[found] * sup + m) / (sup + 1);
                    clusterSupport[found] = sup + 1;
                    clusterColorSum[found] += contribColor;
                    clusterSurfSet[found].Add(samples[peakA].SurfaceIndex);
                    clusterSurfSet[found].Add(samples[peakB].SurfaceIndex);
                }
            }

            var seeds = new List<TriangulatedSeed>();
            for (int c = 0; c < clusterCenter.Count; c++)
            {
                if (clusterSupport[c] < options.MinClusterSupport) continue;
                seeds.Add(new TriangulatedSeed
                {
                    Position = clusterCenter[c],
                    Support = clusterSupport[c],
                    MeanPeakColor = clusterColorSum[c] / clusterSupport[c],
                    DistinctSurfaceCount = clusterSurfSet[c].Count,
                });
            }
            seeds.Sort((a, b) => b.Support.CompareTo(a.Support));
            log?.Info($"  triangulation: {seeds.Count} seed cluster(s) with >= {options.MinClusterSupport} agreement(s)");

            return new Result
            {
                Seeds = seeds,
                PeaksFound = allPeaks.Count,
                RayPairsConsidered = pairsConsidered,
                RayPairsIntersected = pairsIntersected,
            };
        }

        /// <summary>Find the closest approach between two rays r1(s) = p1 + s*n1 and r2(t) =
        /// p2 + t*n2. Returns the midpoint at the closest approach, the parameters s/t, and
        /// the closest-approach distance. False if the rays are parallel (no unique
        /// intersection).</summary>
        public static bool TryRayRayClosestApproach(
            Vector3 p1, Vector3 n1, Vector3 p2, Vector3 n2,
            out float tA, out float tB, out Vector3 midpoint, out float distance)
        {
            tA = tB = 0; midpoint = Vector3.Zero; distance = float.PositiveInfinity;
            // Standard formula (e.g. Wikipedia "Skew lines / Distance"):
            //   p1 + s*n1 closest to p2 + t*n2
            //   minimize |p1 + s*n1 - p2 - t*n2|² over (s, t)
            // Setting partial derivatives to zero yields:
            //   (n1.n1) s - (n1.n2) t = -n1.(p1 - p2)
            //   (n1.n2) s - (n2.n2) t = -n2.(p1 - p2)
            float a = Vector3.Dot(n1, n1);
            float bDot = Vector3.Dot(n1, n2);
            float c = Vector3.Dot(n2, n2);
            Vector3 w0 = p1 - p2;
            float d = Vector3.Dot(n1, w0);
            float e = Vector3.Dot(n2, w0);
            float denom = a * c - bDot * bDot;
            if (denom < 1e-6f) return false; // parallel
            tA = (bDot * e - c * d) / denom;
            tB = (a * e - bDot * d) / denom;
            Vector3 q1 = p1 + n1 * tA;
            Vector3 q2 = p2 + n2 * tB;
            midpoint = (q1 + q2) * 0.5f;
            distance = (q1 - q2).Length();
            return true;
        }

        private static readonly (int dx, int dy)[] Neighbours = new (int, int)[] { (1, 0), (-1, 0), (0, 1), (0, -1) };
        private static float Luma(Vector3 c) => 0.2126f * c.X + 0.7152f * c.Y + 0.0722f * c.Z;
    }
}
