using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// Phase E1 -- "highest priority" blow-out detection.
    ///
    /// <para>q3map2 (and basically every Quake-family lightmap baker) clamps lightmap pixels
    /// to <c>[0..255]</c>. Bright lights produce <b>saturated patches</b> where many texels
    /// hit the clamp and the per-channel gradient goes flat -- there's no positional info in
    /// the saturated interior because the actual brightness data was clipped away. Feeding
    /// these saturated texels into the standard LSQ-based estimator <i>actively harms</i>
    /// the result: their flat brightness pretends to constrain a light position even though
    /// it doesn't, and the LSQ tries to fit them by either inflating intensity or pulling
    /// the candidate position toward the saturated patch's geometric centroid.</para>
    ///
    /// <para>This detector runs as a pre-pass:</para>
    /// <list type="number">
    ///   <item>Identify <b>saturated</b> texels: <c>max(R,G,B) &gt;= SaturationThreshold</c>
    ///         (default 0.95).</item>
    ///   <item>Compute the <b>4-neighbour atlas gradient</b> per saturated texel; texels
    ///         whose largest neighbour brightness delta is below
    ///         <see cref="Options.GradientFloor"/> are <b>blown</b> -- saturated AND in a
    ///         flat patch.</item>
    ///   <item><b>Flood-fill</b> blown texels into clusters by atlas-pixel 4-connectivity
    ///         within the same (surface, lightmap stage, atlas index).</item>
    ///   <item>Compute each cluster's <b>boundary sharpness</b> -- the average per-channel
    ///         brightness drop from a boundary texel to its non-blown atlas neighbour.</item>
    ///   <item><b>Classify</b> each cluster:
    ///         <list type="bullet">
    ///           <item>Sharp boundary, small cluster: blown point/spot light. Emit a
    ///                 high-intensity candidate at the brightness-weighted world centroid,
    ///                 offset along the cluster's average normal by an envelope-derived
    ///                 distance.</item>
    ///           <item>Sharp boundary, large cluster, single-direction normals: sun-light
    ///                 candidate (Phase E5 picks these up).</item>
    ///           <item>Soft boundary or mixed normals: ambient blow-out (rare, no candidate
    ///                 emitted; just flagged).</item>
    ///         </list></item>
    ///   <item>Return <b>BlownMask[]</b> (per sample) so the caller can exclude blown
    ///         samples from the LSQ pool, and <b>PointSpotCandidates[]</b> + <b>SunCandidates[]</b>
    ///         for the estimator and sun detector to consume.</item>
    /// </list>
    /// </summary>
    public sealed class BlowoutDetector
    {
        public sealed class Options
        {
            /// <summary>A texel is <b>saturated</b> when <b>any</b> RGB channel reaches this
            /// threshold. q3 lightmaps clip at 1.0 (255/255); 0.94 catches the near-clip
            /// region where the s-curve flattens. Channel-aware (single-channel clip on e.g.
            /// coloured lights still destroys hue information and must be treated as blown).
            /// </summary>
            public float SaturationThreshold { get; init; } = 0.94f;

            /// <summary>A saturated texel is <b>blown</b> when its largest 4-neighbour
            /// brightness delta is below this threshold. 0.02 = 5/255 -- generous enough
            /// to catch slowly-rolling tops while still excluding clearly graded surfaces.</summary>
            public float GradientFloor { get; init; } = 0.02f;

            /// <summary>Dilate the blown mask by this many atlas rings. Texels immediately
            /// adjacent to a blown cluster are contaminated by q3map2's final <c>-filter</c>
            /// pass (3x3 box blur) which mixes clipped neighbours into them; their per-channel
            /// values are no longer reliable signal for the LSQ. 1 = one ring (recommended);
            /// 0 = no dilation (prior behaviour).</summary>
            public int DilateRings { get; init; } = 1;

            /// <summary>Boundary sharpness above this threshold (mean per-channel drop into
            /// the dark neighbour) marks the cluster as having a hard envelope, characteristic
            /// of a single point/spot light. Below this, the cluster is "soft" (sun, ambient,
            /// or bounce blow-out).</summary>
            public float SharpBoundaryThreshold { get; init; } = 0.15f;

            /// <summary>Clusters smaller than this are point/spot candidates (sharp
            /// boundary required); clusters larger than this become sun candidates.</summary>
            public int SunMinClusterSize { get; init; } = 200;

            /// <summary>The intensity assigned to a blown point/spot candidate, in the
            /// estimator's internal units. Tuned to be slightly above what the estimator
            /// usually fits (~10000-25000); blown lights are bright by definition.</summary>
            public float CandidateIntensity { get; init; } = 35000f;

            /// <summary>Distance (q3 units) above the cluster centroid (along the average
            /// normal) at which to place the candidate light. Heuristic: 1.5x the cluster's
            /// spatial extent so the light is comfortably "above" the saturated patch.</summary>
            public float CandidateOffsetMultiplier { get; init; } = 1.5f;

            /// <summary>Floor for the candidate offset distance (q3 units).</summary>
            public float CandidateOffsetFloor { get; init; } = 24f;

            /// <summary>Cap for the candidate offset distance (q3 units).</summary>
            public float CandidateOffsetCeiling { get; init; } = 256f;

            /// <summary>When true (default), emit multiple candidate lights per blown cluster
            /// at several normal offsets (50%, 100%, 150% of the computed distance). The
            /// downstream estimator's merge pass collapses redundant winners; this lets the
            /// best-fit offset emerge from scoring instead of our single heuristic.</summary>
            public bool EmitMultiCandidate { get; init; } = true;

            /// <summary>The three relative offset multipliers tried when
            /// <see cref="EmitMultiCandidate"/> is true.</summary>
            public float[] CandidateOffsetSweep { get; init; } = new[] { 0.6f, 1.0f, 1.6f };
        }

        public sealed class Cluster
        {
            public int Id { get; init; }
            public int SurfaceIndex { get; init; }
            public int Stage { get; init; }
            public int AtlasIndex { get; init; }
            public List<int> SampleIndices { get; init; } = new();
            public Vector3 BrightnessWeightedCentroid { get; init; }
            public Vector3 AverageNormal { get; init; }
            public float SpatialExtent { get; init; }
            public float MaxBrightness { get; init; }
            public Vector3 MeanColor { get; init; }
            /// <summary>Mean RGB of the BRIGHTEST BOUNDARY texels (non-blown ring touching the
            /// cluster). These are the last texels before clipping and carry real, non-clipped
            /// chroma/intensity info — far more reliable than <see cref="MeanColor"/> which is
            /// the interior mean of clipped values.</summary>
            public Vector3 BoundaryMeanColor { get; init; }
            public float BoundarySharpness { get; init; }
            public bool IsSunCandidate { get; init; }
            public bool IsPointCandidate { get; init; }
            /// <summary>True iff cluster's normals all agree to within ~30° -- precondition
            /// for both point-light and sun classifications. False = ambient blow-out.</summary>
            public bool NormalsCoherent { get; init; }
        }

        public sealed class Result
        {
            /// <summary>Per-sample mask: true = sample is in a blown cluster (core or dilated
            /// ring) and should NOT participate in the standard LSQ. Same length as the input
            /// sample list.</summary>
            public bool[] BlownMask { get; init; } = Array.Empty<bool>();
            /// <summary>Per-sample "core blown" mask (before dilation). Triangulation peak
            /// detection in <c>GeometricTriangulator</c> consumes this to EXCLUDE saturated
            /// samples from the peak pool (saturated pixels give wrong peak positions because
            /// many adjacent pixels share the same clipped luma, so the "local max" picks an
            /// arbitrary member of the clipped plateau). Boundary (non-saturated) peaks around
            /// a blown cluster remain useful and are NOT masked by this.</summary>
            public bool[] CoreSaturatedMask { get; init; } = Array.Empty<bool>();
            public IReadOnlyList<Cluster> Clusters { get; init; } = Array.Empty<Cluster>();
            /// <summary>Candidate point/spot lights produced from sharp-bounded small
            /// clusters. The estimator should add these to its accepted set BEFORE running
            /// the greedy peel so the rest of the fit works on the de-blown residual.</summary>
            public IReadOnlyList<EstimatedLight> PointCandidates { get; init; } = Array.Empty<EstimatedLight>();
            /// <summary>Candidate sun-light clusters. Phase E5's <c>SunDetector</c> consumes
            /// these to emit <c>_sun_*</c> worldspawn keys.</summary>
            public IReadOnlyList<Cluster> SunCandidates { get; init; } = Array.Empty<Cluster>();
            public int SaturatedTexelCount { get; init; }
            public int BlownTexelCount { get; init; }
            /// <summary>Number of texels added by the dilation ring (part of BlownTexelCount).</summary>
            public int DilatedTexelCount { get; init; }
        }

        public static Result Detect(IReadOnlyList<TexelSample> samples, Options? options = null, Logger? log = null)
        {
            options ??= new Options();
            int n = samples.Count;
            var blown = new bool[n];
            if (n == 0) return new Result { BlownMask = blown, CoreSaturatedMask = new bool[0] };

            // ----- 1. Build (atlasIdx, ax, ay, surfIdx, stage) -> sampleIdx index for
            //         atlas neighbour lookup during gradient + flood-fill. We key on
            //         the per-surface tuple too so we don't accidentally bridge across
            //         different surfaces that happen to share an atlas pixel.
            var index = new Dictionary<(int atlas, int ax, int ay, int surf, int stage), int>(n);
            int saturatedCount = 0;
            for (int i = 0; i < n; i++)
            {
                index[(samples[i].AtlasIndex, samples[i].AtlasX, samples[i].AtlasY, samples[i].SurfaceIndex, samples[i].Stage)] = i;
                if (Saturated(samples[i], options.SaturationThreshold)) saturatedCount++;
            }

            // ----- 2. Flood-fill ALL saturated texels into clusters via atlas 4-connectivity.
            //
            // Important: we don't apply the per-texel gradient check here -- a saturated
            // texel adjacent to a dark texel (i.e. on the boundary of a blown patch) has a
            // high local gradient to its dark neighbour but is still part of the blown
            // cluster. The gradient check is applied at the CLUSTER level below
            // (interior-flatness + boundary-sharpness) so we correctly classify the whole
            // saturated patch.
            var saturatedMask = new bool[n];
            for (int i = 0; i < n; i++)
            {
                if (Saturated(samples[i], options.SaturationThreshold)) saturatedMask[i] = true;
            }

            var clusterId = new int[n];
            for (int k = 0; k < n; k++) clusterId[k] = -1;
            var clusters = new List<List<int>>();
            var stack = new Stack<int>();
            for (int seed = 0; seed < n; seed++)
            {
                if (!saturatedMask[seed] || clusterId[seed] >= 0) continue;
                int cid = clusters.Count;
                var members = new List<int>();
                clusters.Add(members);
                stack.Push(seed);
                while (stack.Count > 0)
                {
                    int idx = stack.Pop();
                    if (clusterId[idx] >= 0) continue;
                    clusterId[idx] = cid;
                    members.Add(idx);
                    foreach (var (dx, dy) in Neighbours)
                    {
                        if (index.TryGetValue((samples[idx].AtlasIndex, samples[idx].AtlasX + dx, samples[idx].AtlasY + dy, samples[idx].SurfaceIndex, samples[idx].Stage), out int j))
                        {
                            if (saturatedMask[j] && clusterId[j] < 0) stack.Push(j);
                        }
                    }
                }
            }

            // Per-cluster interior-flatness check. A cluster qualifies as "blown" if its
            // INTERIOR texels (those whose 4 neighbours are all saturated) have a low
            // average local gradient. Clusters that fail (saturation is just brightly lit
            // detail, not clipping) are skipped entirely.
            int coreBlownCount = 0;
            var blownClusterIds = new HashSet<int>();
            for (int cid = 0; cid < clusters.Count; cid++)
            {
                var members = clusters[cid];
                float gradAccum = 0;
                int gradN = 0;
                foreach (int idx in members)
                {
                    bool interior = true;
                    float ownLuma = Luma(samples[idx].Observed);
                    float maxDelta = 0;
                    foreach (var (dx, dy) in Neighbours)
                    {
                        if (index.TryGetValue((samples[idx].AtlasIndex, samples[idx].AtlasX + dx, samples[idx].AtlasY + dy, samples[idx].SurfaceIndex, samples[idx].Stage), out int j))
                        {
                            if (!saturatedMask[j]) { interior = false; break; }
                            float delta = MathF.Abs(Luma(samples[j].Observed) - ownLuma);
                            if (delta > maxDelta) maxDelta = delta;
                        }
                        else { interior = false; break; }
                    }
                    if (interior)
                    {
                        gradAccum += maxDelta;
                        gradN++;
                    }
                }
                // Tiny clusters (1-2 texels) have no interior; treat the whole cluster as
                // potentially blown based on its size alone.
                bool flat = (gradN > 0 && gradAccum / gradN < options.GradientFloor) || members.Count <= 2;
                if (flat)
                {
                    blownClusterIds.Add(cid);
                    foreach (int idx in members) { blown[idx] = true; coreBlownCount++; }
                }
            }

            // Snapshot the core (pre-dilation) mask for external consumers (triangulation).
            var coreBlown = new bool[n];
            Array.Copy(blown, coreBlown, n);

            // ----- 3. DILATION: texels adjacent to a blown core are contaminated by q3map2's
            //         -filter pass (3x3 box blur run by default in -light). Their values
            //         are averages of some clipped and some un-clipped samples, so the
            //         per-texel brightness no longer tells us anything useful about a
            //         particular light. Exclude them from the LSQ too.
            int dilatedCount = 0;
            if (options.DilateRings > 0)
            {
                var frontier = new List<int>();
                var nextFrontier = new List<int>();
                for (int i = 0; i < n; i++) if (coreBlown[i]) frontier.Add(i);
                for (int ring = 0; ring < options.DilateRings; ring++)
                {
                    nextFrontier.Clear();
                    foreach (int idx in frontier)
                    {
                        foreach (var (dx, dy) in Neighbours)
                        {
                            if (index.TryGetValue((samples[idx].AtlasIndex, samples[idx].AtlasX + dx, samples[idx].AtlasY + dy, samples[idx].SurfaceIndex, samples[idx].Stage), out int j))
                            {
                                if (!blown[j]) { blown[j] = true; dilatedCount++; nextFrontier.Add(j); }
                            }
                        }
                    }
                    (frontier, nextFrontier) = (nextFrontier, frontier);
                    if (frontier.Count == 0) break;
                }
            }
            int blownCount = coreBlownCount + dilatedCount;

            // ----- 4. Per-cluster classification + candidate emission.
            var pointCandidates = new List<EstimatedLight>();
            var sunCandidates = new List<Cluster>();
            var clusterRecords = new List<Cluster>();
            for (int cid = 0; cid < clusters.Count; cid++)
            {
                var members = clusters[cid];
                if (members.Count == 0) continue;
                if (!blownClusterIds.Contains(cid)) continue; // not a blown cluster
                // Brightness-weighted centroid + average normal + spatial extent + dominant color.
                Vector3 wCentroid = Vector3.Zero;
                Vector3 nSum = Vector3.Zero;
                Vector3 cSum = Vector3.Zero;
                float maxLuma = 0;
                float wSum = 0;
                Vector3 firstWorld = samples[members[0]].World;
                float maxDistSq = 0;
                foreach (int idx in members)
                {
                    float w = MathF.Max(1e-3f, Luma(samples[idx].Observed));
                    wCentroid += w * samples[idx].World;
                    nSum += samples[idx].Normal;
                    cSum += samples[idx].Observed;
                    wSum += w;
                    if (Luma(samples[idx].Observed) > maxLuma) maxLuma = Luma(samples[idx].Observed);
                    float dsq = (samples[idx].World - firstWorld).LengthSquared();
                    if (dsq > maxDistSq) maxDistSq = dsq;
                }
                wCentroid /= wSum;
                Vector3 nAvg = nSum.Length() > 1e-6f ? Vector3.Normalize(nSum / members.Count) : Vector3.UnitZ;
                Vector3 cMean = cSum / members.Count;
                float extent = MathF.Sqrt(maxDistSq);

                // Boundary sharpness: mean per-channel drop from boundary texels to their
                // first non-blown neighbour. Saturated-only neighbours don't count as a
                // "boundary" -- the boundary is the transition from saturated to dark.
                // We also accumulate the colour of the BRIGHTEST boundary ring (non-blown
                // neighbours of a clipped cluster) so downstream consumers can seed a
                // candidate with the real un-clipped chroma rather than the clipped
                // cluster-interior mean.
                float sharpAccum = 0;
                int sharpN = 0;
                Vector3 boundaryColorSum = Vector3.Zero;
                float boundaryColorWeight = 0f;
                foreach (int idx in members)
                {
                    foreach (var (dx, dy) in Neighbours)
                    {
                        if (index.TryGetValue((samples[idx].AtlasIndex, samples[idx].AtlasX + dx, samples[idx].AtlasY + dy, samples[idx].SurfaceIndex, samples[idx].Stage), out int j))
                        {
                            // Only count the boundary ring as the non-core neighbour to the
                            // saturated core (so dilated-ring texels, which are themselves
                            // blown, don't count as real boundary). Use saturatedMask (the
                            // original core) to decide; `blown` has been dilated.
                            if (saturatedMask[j]) continue;
                            if (coreBlown[idx] && !saturatedMask[idx]) continue; // should not happen
                            float drop = Luma(samples[idx].Observed) - Luma(samples[j].Observed);
                            if (drop > 0)
                            {
                                sharpAccum += drop;
                                sharpN++;
                            }
                            float nlLuma = Luma(samples[j].Observed);
                            if (nlLuma > 0.05f)
                            {
                                boundaryColorSum += samples[j].Observed * nlLuma;
                                boundaryColorWeight += nlLuma;
                            }
                        }
                    }
                }
                float sharpness = sharpN > 0 ? sharpAccum / sharpN : 0f;
                Vector3 boundaryColor = boundaryColorWeight > 1e-6f
                    ? boundaryColorSum / boundaryColorWeight
                    : cMean;

                // Normals coherent: every member's normal must dot the average within ~30°.
                bool coherent = true;
                int coherentMembers = 0;
                foreach (int idx in members)
                {
                    if (Vector3.Dot(samples[idx].Normal, nAvg) >= 0.866f) coherentMembers++;
                }
                coherent = coherentMembers >= members.Count * 0.7f;

                bool sunCandidate = sharpness >= options.SharpBoundaryThreshold && members.Count >= options.SunMinClusterSize && coherent;
                bool pointCandidate = sharpness >= options.SharpBoundaryThreshold && members.Count < options.SunMinClusterSize && coherent;

                var record = new Cluster
                {
                    Id = cid,
                    SurfaceIndex = samples[members[0]].SurfaceIndex,
                    Stage = samples[members[0]].Stage,
                    AtlasIndex = samples[members[0]].AtlasIndex,
                    SampleIndices = members,
                    BrightnessWeightedCentroid = wCentroid,
                    AverageNormal = nAvg,
                    SpatialExtent = extent,
                    MaxBrightness = maxLuma,
                    MeanColor = cMean,
                    BoundaryMeanColor = boundaryColor,
                    BoundarySharpness = sharpness,
                    IsSunCandidate = sunCandidate,
                    IsPointCandidate = pointCandidate,
                    NormalsCoherent = coherent,
                };
                clusterRecords.Add(record);

                if (pointCandidate)
                {
                    float baseOffset = MathF.Min(options.CandidateOffsetCeiling,
                                       MathF.Max(options.CandidateOffsetFloor, extent * options.CandidateOffsetMultiplier));
                    // Use boundary-ring chroma (un-clipped) rather than interior-mean
                    // chroma (clipped at 1.0 per-channel) so coloured lights come out with
                    // the right hue even though the clipped centre says "white".
                    Vector3 chroma = NormaliseChroma(boundaryColor);
                    float baseConfidence = MathF.Min(1f, sharpness * 4f);
                    if (options.EmitMultiCandidate)
                    {
                        for (int m = 0; m < options.CandidateOffsetSweep.Length; m++)
                        {
                            float mult = options.CandidateOffsetSweep[m];
                            float offset = MathF.Min(options.CandidateOffsetCeiling,
                                           MathF.Max(options.CandidateOffsetFloor, baseOffset * mult));
                            Vector3 origin = wCentroid + nAvg * offset;
                            pointCandidates.Add(new EstimatedLight
                            {
                                Origin = origin,
                                Color = chroma,
                                // Scale candidate intensity by offset² so all emitted
                                // candidates predict roughly the same surface brightness
                                // at the saturated centroid (downstream LSQ + merge then
                                // settles on the geometrically correct one).
                                Intensity = options.CandidateIntensity * (mult * mult),
                                Confidence = baseConfidence * (m == 1 ? 1f : 0.8f),
                                SupportingTexels = members.Count,
                                ResidualEnergyExplainedFraction = 0,
                                Method = "blowout-point-x" + mult.ToString("0.#", System.Globalization.CultureInfo.InvariantCulture),
                                BlownOut = true,
                            });
                        }
                    }
                    else
                    {
                        Vector3 origin = wCentroid + nAvg * baseOffset;
                        pointCandidates.Add(new EstimatedLight
                        {
                            Origin = origin,
                            Color = chroma,
                            Intensity = options.CandidateIntensity,
                            Confidence = baseConfidence,
                            SupportingTexels = members.Count,
                            ResidualEnergyExplainedFraction = 0,
                            Method = "blowout-point",
                            BlownOut = true,
                        });
                    }
                }
                if (sunCandidate) sunCandidates.Add(record);
            }

            log?.Info($"  blowout: {saturatedCount} saturated texels, {coreBlownCount} core-blown + {dilatedCount} dilated = {blownCount} masked ({(blownCount / (float)Math.Max(1, n)):P1} of all samples), {clusters.Count} clusters, {pointCandidates.Count} point candidates (from {pointCandidates.Count / Math.Max(1, options.EmitMultiCandidate ? options.CandidateOffsetSweep.Length : 1)} cluster{(pointCandidates.Count != 1 ? "s" : "")}), {sunCandidates.Count} sun candidates");

            return new Result
            {
                BlownMask = blown,
                CoreSaturatedMask = coreBlown,
                Clusters = clusterRecords,
                PointCandidates = pointCandidates,
                SunCandidates = sunCandidates,
                SaturatedTexelCount = saturatedCount,
                BlownTexelCount = blownCount,
                DilatedTexelCount = dilatedCount,
            };
        }

        // ---- helpers ----

        private static readonly (int dx, int dy)[] Neighbours = new (int, int)[] { (1, 0), (-1, 0), (0, 1), (0, -1) };

        private static bool Saturated(TexelSample s, float threshold)
            => MathF.Max(s.Observed.X, MathF.Max(s.Observed.Y, s.Observed.Z)) >= threshold;

        private static float Luma(Vector3 c) => 0.2126f * c.X + 0.7152f * c.Y + 0.0722f * c.Z;

        private static Vector3 NormaliseChroma(Vector3 c)
        {
            float maxC = MathF.Max(c.X, MathF.Max(c.Y, c.Z));
            if (maxC < 1e-6f) return Vector3.One;
            return c / maxC;
        }
    }
}
