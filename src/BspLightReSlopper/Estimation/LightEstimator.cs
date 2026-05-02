using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using BspLightReSlopper.Collision;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// Iterative greedy light estimator (Phase A).
    ///
    /// <para>Algorithm per round:</para>
    /// <list type="number">
    ///   <item><b>Pivot pool.</b> Pick the top-N samples by current residual luma. Lights live
    ///         physically <i>above</i> bright spots, so seeding candidates from these is far
    ///         more effective than uniform bbox sampling.</item>
    ///   <item><b>Candidate set.</b> For each pivot, emit candidates at several normal offsets
    ///         (16/48/96/192/384/768 u) plus light lateral jitter. Top up with a few uniform
    ///         bbox candidates so we can still catch lights tucked into alcoves.</item>
    ///   <item><b>Per-candidate fit.</b> Closed-form per-channel non-negative LSQ:
    ///         <c>I = Σ(g · r) / Σ(g²)</c> with <c>g = max(0, n·d̂)/(d²+fade²)</c>. No ridge
    ///         (it dominated <c>Σg²</c> on real maps and collapsed I to ~0). Intensity is
    ///         clamped to a large sanity cap instead.</item>
    ///   <item><b>Score.</b> SSE after fit. Lower = better.</item>
    ///   <item><b>Pattern-search refinement.</b> ±step on each axis, halve on stagnation.</item>
    ///   <item><b>Supporting-texel test.</b> Count samples where the predicted contribution
    ///         is &gt;= a fraction of the observed brightness. Reject the candidate if too few
    ///         or if the explained-energy fraction for this round is below floor.</item>
    ///   <item><b>Subtract</b> the predicted contribution from residuals (greedy peeling) and
    ///         repeat until MaxLights, residual floor, or back-to-back rejected rounds.</item>
    /// </list>
    ///
    /// <para>Phase A intentionally omits visibility (raycasting against the BSP tree); that
    /// will land in Phase B once the BSP-tree port is in place.</para>
    /// </summary>
    public sealed class LightEstimator
    {
        public sealed class Options
        {
            public int MaxLights { get; init; } = 64;
            public float ResidualStopFraction { get; init; } = 0.02f;
            public int RefinementIterations { get; init; } = 8;
            public float RefinementStepStart { get; init; } = 64f;
            public float RefinementStepShrink { get; init; } = 0.5f;
            public int RandomSeed { get; init; } = 42;

            /// <summary>
            /// Falloff fade for the geometry term <c>g = ndot/(d² + fade²)</c>. q3map2's
            /// default linear=0 inverse-square model is well-approximated by a small fade.
            /// 32u keeps near-light samples from going singular while not blunting the falloff
            /// across typical room scales.
            /// </summary>
            public float Fade { get; init; } = 32f;

            /// <summary>Top-quantile of (residual) brightness used as candidate pivots.</summary>
            public float PivotQuantile { get; init; } = 0.85f;

            /// <summary>Hard cap on number of pivots per round (cost control for huge sample
            /// sets). Picked from the high-brightness end after the quantile filter.</summary>
            public int MaxPivotsPerRound { get; init; } = 800;

            /// <summary>Distances above each pivot (along its normal) at which to spawn a
            /// candidate origin. Tuned to the support radius — candidates outside this would
            /// have insufficient overlap with the pivot's neighborhood to score well anyway.</summary>
            public float[] NormalOffsets { get; init; } = new[] { 16f, 32f, 64f, 128f, 192f };

            /// <summary>Number of uniform-bbox fillers added on top of pivot candidates per
            /// round.</summary>
            public int UniformFillerCount { get; init; } = 200;

            /// <summary>Hard ceiling on per-channel intensity in fitting units. Replaces the
            /// previous Tikhonov ridge; the ridge dominated typical Σg² values and forced I→0
            /// on real maps. The cap rejects degenerate "L is far away → enormous I" fits
            /// without distorting healthy ones.</summary>
            public float MaxIntensityCap { get; init; } = 50000f;

            /// <summary>A sample is considered "supporting" if the predicted contribution is
            /// at least this fraction of the observed (pre-subtract) brightness.</summary>
            public float SupportingFraction { get; init; } = 0.10f;

            /// <summary>Minimum supporting-texel count for an accepted light. Below this we
            /// reject (too sparse to be a real light hypothesis).</summary>
            public int MinSupportingTexels { get; init; } = 4;

            /// <summary>Stop early if a round explains less than this fraction of the
            /// remaining residual energy. Tuned low for real maps where individual lights
            /// often only contribute a tiny slice of the global budget; on dense-lighting
            /// maps (doom_shields has 926 lights), a smaller per-round share is normal and
            /// stopping at 0.05% strands ~half the lights, so we go finer.</summary>
            public float MinExplainedFractionPerRound { get; init; } = 0.0001f;

            /// <summary>How many consecutive rejected rounds before stopping.</summary>
            public int MaxConsecutiveRejects { get; init; } = 8;

            /// <summary>Local-neighborhood radius around a candidate L when computing the
            /// per-channel LSQ fit and the SSE score. Samples beyond this radius are ignored
            /// for fitting purposes (they're not "this light's" texels). Without this the LSQ
            /// drifts toward a global brightness centroid, hits the intensity cap, and produces
            /// median position errors of 200u+ on real maps. JK2 lights typically have ~256u
            /// useful footprints so this is a reasonable default; Phase B visibility checking
            /// will let us widen this without re-introducing the cross-room averaging problem.</summary>
            public float SupportRadius { get; init; } = 256f;

            /// <summary>If true, after all lights are placed, do one joint per-channel LSQ
            /// refit holding all positions fixed. Redistributes intensity to compensate for
            /// the residual leakage that greedy peeling leaves between overlapping lights.</summary>
            public bool JointRefitAfter { get; init; } = true;

            /// <summary>If true, after the joint refit, merge accepted lights whose origins
            /// are within <see cref="MergeRadius"/> of each other. The greedy peel often
            /// places several closely-spaced candidates as it refines its estimate of one
            /// real light; collapsing them improves precision (one-truth-to-many-est is the
            /// dominant source of false positives on dense maps) at near-zero recall cost.</summary>
            public bool MergeNearbyAfter { get; init; } = true;

            /// <summary>Distance (world units) within which two estimates are merged into one.
            /// q3map2's typical light-sample grid resolution is 64u, which is also the
            /// smallest visually meaningful separation between distinct fixtures.</summary>
            public float MergeRadius { get; init; } = 64f;

            /// <summary>After merge + refit, drop any light whose intensity is below this
            /// fraction of the median surviving light's intensity. Catches noise lights that
            /// the joint refit assigned near-zero intensity to.</summary>
            public float WeakLightCullFraction { get; init; } = 0.05f;

            /// <summary>BSP collision module for visibility queries. When supplied alongside
            /// <see cref="Visibility"/>, the per-candidate fit only includes texel samples
            /// whose leaf cluster is potentially-visible from the candidate L's leaf cluster.
            /// Cuts false positives sharply on multi-room indoor maps (a candidate behind a
            /// wall can no longer claim credit for lights on the other side).</summary>
            public BspCollision? Collision { get; init; }

            /// <summary>BSP PVS lookup. Used in conjunction with <see cref="Collision"/>.</summary>
            public BspVis? Visibility { get; init; }

            /// <summary>
            /// Use q3map2 half-Lambert angle attenuation <c>((n·L̂)*0.5+0.5)²</c> instead of
            /// standard Lambert <c>max(0,n·L̂)</c>. Shipped JK2/JKA maps were baked without
            /// <c>-lightanglehl 1</c>; enable only when you know the BSP used that flag.
            /// </summary>
            public bool HalfLambert { get; init; }

            /// <summary>When heuristics mark <c>fast=likely-on</c>, tighten
            /// <see cref="EnvelopeMultiplier"/> toward this value (physical-envelope discard).</summary>
            public float EnvelopeMultiplierFast { get; init; } = 2.0f;

            /// <summary>When heuristics mark <c>fast=likely-off</c>, use this envelope multiplier.</summary>
            public float EnvelopeMultiplierNoFast { get; init; } = 4.0f;

            /// <summary>If true (default), run <see cref="BlowoutDetector"/> as a pre-pass:
            /// blown (saturated + flat-gradient) texels are excluded from the LSQ pool, and
            /// blown-cluster candidates are added to the accepted lights set BEFORE the
            /// greedy peel runs. Saturated texels carry essentially zero positional info
            /// because their actual brightness was clipped at compile time; feeding them to
            /// the LSQ corrupts the fit by pulling positions toward saturated centroids.</summary>
            public bool DetectBlowouts { get; init; } = true;

            /// <summary>If true (default), run <see cref="GeometricTriangulator"/> as a
            /// pre-pass: detect brightness peaks per surface, intersect their normal-aligned
            /// rays from different surfaces, mean-shift cluster the meet-points. The
            /// resulting cluster centres become seed candidates with a multiplicative score
            /// boost in the per-round candidate evaluation. Combined with -- never replacing --
            /// the existing RANSAC + LSQ greedy peel.</summary>
            public bool UseTriangulation { get; init; } = true;

            /// <summary>Score multiplier applied to candidates spawned from triangulated
            /// seeds (the per-candidate energy-drop is multiplied by this). >1 makes
            /// triangulated seeds preferred over uniform RANSAC candidates of equal
            /// brightness; tuned conservatively so the LSQ still has the final say.</summary>
            public float TriangulationSeedBoost { get; init; } = 1.25f;

            /// <summary>If true (default), run the post-pass physical-envelope discard:
            /// any accepted light whose claimed intensity can't physically reach its
            /// most-distant supporting sample (per the q3map2 -fast envelope formula
            /// `d_max = sqrt(I / falloffTolerance)`) is discarded as a spurious LSQ overfit.
            /// Mirrors light_ydnar.cpp:3421. Tuned permissively (multiplier 2.0) so it only
            /// catches egregious cases; tightens further when E7's CompileSettingsInferer
            /// detects that -fast was actually used.</summary>
            public bool PhysicalEnvelopeDiscard { get; init; } = true;

            /// <summary>Envelope-derived "max distance squared" coefficient: a light of
            /// internal intensity I can reach distance d_max where d_max² = I × EnvelopeScale.
            /// Default 250 (= 1 / 0.004 = 1 / threshold-in-normalised-luma) corresponds to
            /// the q3map2 inverse-square cull threshold of 1/255 lightmap units.</summary>
            public float EnvelopeScale { get; init; } = 250f;

            /// <summary>A sample counts as "supporting" for envelope-discard purposes when
            /// the light's predicted contribution is at least this fraction of the observed
            /// brightness. Matches the per-light SupportingFraction by default so the
            /// discard pass is consistent with the per-light "supporting texel" semantics.</summary>
            public float EnvelopeSupportingFraction { get; init; } = 0.10f;

            /// <summary>Discard threshold multiplier on the physical envelope. A light whose
            /// max-supporting-distance exceeds <c>EnvelopeMultiplier × envelope</c> is
            /// dropped. 4.0 = very lenient (only egregious cases); 2.0 = catches obvious
            /// bounce-fits; 1.0 = strict (typical -fast behaviour). We default to 4.0 because
            /// without a confirmed -fast detection (Phase E7) we shouldn't aggressively
            /// trust the envelope as a hard limit.</summary>
            public float EnvelopeMultiplier { get; init; } = 4.0f;

            public bool Parallel { get; init; } = true;
        }

        public sealed class Result
        {
            public IReadOnlyList<EstimatedLight> Lights { get; init; } = Array.Empty<EstimatedLight>();
            public float InitialEnergy { get; init; }
            public float FinalResidualEnergy { get; init; }
            public int RoundsRun { get; init; }
            public int RoundsAccepted { get; init; }
            public int RoundsRejected { get; init; }
            public float ElapsedSeconds { get; init; }
        }

        public static Result Estimate(IReadOnlyList<TexelSample> samples, Vector3 bboxMin, Vector3 bboxMax, Options? options = null, Logger? log = null)
        {
            options ??= new Options();
            var sw = System.Diagnostics.Stopwatch.StartNew();
            int n = samples.Count;
            if (n < 16)
            {
                log?.Warn($"too few texel samples for estimator: {n}");
                return new Result { ElapsedSeconds = (float)sw.Elapsed.TotalSeconds };
            }

            // Pack samples into flat arrays for inner-loop speed.
            var px = new float[n]; var py = new float[n]; var pz = new float[n];
            var nx = new float[n]; var ny = new float[n]; var nz = new float[n];
            var rR = new float[n]; var rG = new float[n]; var rB = new float[n];
            var clusters = new int[n];
            for (int i = 0; i < n; i++)
            {
                px[i] = samples[i].World.X; py[i] = samples[i].World.Y; pz[i] = samples[i].World.Z;
                nx[i] = samples[i].Normal.X; ny[i] = samples[i].Normal.Y; nz[i] = samples[i].Normal.Z;
                rR[i] = samples[i].Observed.X; rG[i] = samples[i].Observed.Y; rB[i] = samples[i].Observed.Z;
                clusters[i] = samples[i].Cluster;
            }
            bool useVis = options.Collision != null && options.Visibility != null && options.Visibility.HasVis;
            if (useVis)
                log?.Info($"  visibility-aware mode: {options.Visibility!.NumClusters} clusters, {options.Visibility.BytesPerCluster}B/cluster");
            if (options.HalfLambert)
                log?.Info("  angle attenuation: half-Lambert (q3map2 -lightanglehl 1, JK2/JKA default)");
            else
                log?.Info("  angle attenuation: standard Lambert (Q3A default)");

            // ---- Phase E1 pre-pass: blow-out detection. Saturated texels with flat
            // gradient carry no positional info and corrupt the LSQ; mask them out and
            // seed the accepted-lights set with cluster-derived candidates. The seeded
            // lights' contribution gets subtracted from the residual before the greedy peel
            // starts so the rest of the algorithm works on de-blown brightness.
            var lights = new List<EstimatedLight>();
            var lightOrigins = new List<Vector3>();
            var lightIntensities = new List<Vector3>();
            BlowoutDetector.Result? blowResult = null;
            if (options.DetectBlowouts)
            {
                blowResult = BlowoutDetector.Detect(samples, log: log);
                foreach (var seed in blowResult.PointCandidates)
                {
                    lights.Add(seed);
                    lightOrigins.Add(seed.Origin);
                    lightIntensities.Add(seed.Color * seed.Intensity);
                }
                // Mask blown texels out of the LSQ residuals: zero them so they contribute
                // nothing to subsequent fits. Their original brightness is unrecoverable
                // (clipped at compile time), so leaving them in just adds noise.
                if (blowResult.BlownTexelCount > 0)
                {
                    for (int i = 0; i < n; i++)
                    {
                        if (blowResult.BlownMask[i]) { rR[i] = 0; rG[i] = 0; rB[i] = 0; }
                    }
                }
                // Subtract seeded lights' predicted contribution from the (de-blown) residual
                // so the greedy peel doesn't try to fit them again.
                if (blowResult.PointCandidates.Count > 0)
                {
                    var emptyClusters = new int[n];
                    foreach (var seed in blowResult.PointCandidates)
                    {
                        ApplyContribution(seed.Origin, seed.Color * seed.Intensity,
                            px, py, pz, nx, ny, nz, rR, rG, rB, emptyClusters,
                            n, options.Fade * options.Fade,
                            sign: -1f, countSupporting: false, supportingFraction: 0f,
                            halfLambert: options.HalfLambert,
                            vis: null, candCluster: 0);
                    }
                }
            }

            // ---- Phase E2 pre-pass: geometric triangulation. Detect surface brightness
            // peaks, intersect normal-rays from different surfaces, mean-shift cluster the
            // meet-points. The resulting cluster centres become seed candidate positions
            // that get added to every round's candidate pool with a score boost.
            var triangulationSeeds = new List<Vector3>();
            if (options.UseTriangulation)
            {
                var triResult = GeometricTriangulator.Triangulate(samples, log: log);
                foreach (var seed in triResult.Seeds) triangulationSeeds.Add(seed.Position);
            }

            float initialEnergy = SumSq(rR, rG, rB);
            float currentEnergy = initialEnergy;
            log?.Info($"  initial residual energy: {initialEnergy:F2} ({n} samples" +
                     (blowResult != null ? $", {blowResult.BlownTexelCount} blown / masked" : "") + ")");

            float fade2 = options.Fade * options.Fade;
            float supportR2 = options.SupportRadius * options.SupportRadius;
            int consecutiveRejects = 0;
            int accepted = 0, rejected = 0;
            var rng = new Random(options.RandomSeed);

            for (int round = 0; round < options.MaxLights; round++)
            {
                // ---- 1. Build pivot pool from current residual luma ----
                var pivots = SelectPivots(rR, rG, rB, options.PivotQuantile, options.MaxPivotsPerRound, rng);
                if (pivots.Count == 0)
                {
                    log?.Info($"  round {round + 1}: no pivots above quantile; stopping");
                    break;
                }

                // ---- 2. Build candidate set: pivots × normal offsets + uniform fillers
                //                                + triangulation seeds (E2)
                int triCount = triangulationSeeds.Count;
                var cands = new Vector3[pivots.Count * options.NormalOffsets.Length + options.UniformFillerCount + triCount];
                var isTriSeed = new bool[cands.Length];
                int ci = 0;
                foreach (int pi in pivots)
                {
                    foreach (float t in options.NormalOffsets)
                    {
                        // Lateral jitter scaled to offset magnitude (helps near-pivot search
                        // explore around the surface point, not just straight up).
                        float j = t * 0.15f;
                        float jx = ((float)rng.NextDouble() - 0.5f) * j;
                        float jy = ((float)rng.NextDouble() - 0.5f) * j;
                        float jz = ((float)rng.NextDouble() - 0.5f) * j;
                        cands[ci++] = new Vector3(
                            px[pi] + nx[pi] * t + jx,
                            py[pi] + ny[pi] * t + jy,
                            pz[pi] + nz[pi] * t + jz);
                    }
                }
                for (int u = 0; u < options.UniformFillerCount; u++)
                {
                    cands[ci++] = new Vector3(
                        bboxMin.X + (float)rng.NextDouble() * (bboxMax.X - bboxMin.X),
                        bboxMin.Y + (float)rng.NextDouble() * (bboxMax.Y - bboxMin.Y),
                        bboxMin.Z + (float)rng.NextDouble() * (bboxMax.Z - bboxMin.Z));
                }
                for (int t = 0; t < triCount; t++)
                {
                    cands[ci] = triangulationSeeds[t];
                    isTriSeed[ci] = true;
                    ci++;
                }

                // ---- 3. Score each candidate ----
                int K = cands.Length;
                var scores = new float[K];
                var ir = new float[K];
                var ig = new float[K];
                var ib = new float[K];

                // Per-candidate cluster lookup for the visibility-aware path. Computed once
                // per round (not per refinement step) — the cost is one PointLeaf per
                // candidate (~1µs) versus the K-many fit calls (~50µs each), so this is
                // negligible overhead compared to skipping it would mean re-resolving
                // clusters in the parallel inner loop.
                var candClusters = new int[K];
                if (useVis)
                {
                    for (int k = 0; k < K; k++)
                    {
                        int leaf = options.Collision!.PointLeaf(cands[k]);
                        candClusters[k] = (leaf >= 0 && leaf < options.Collision.LeafCount) ? options.Collision.LeafCluster(leaf) : -1;
                    }
                }

                bool halfLambert = options.HalfLambert;
                if (options.Parallel)
                {
                    Parallel.For(0, K, k =>
                    {
                        FitSingleLight(cands[k], px, py, pz, nx, ny, nz, rR, rG, rB, clusters, n, fade2,
                            supportR2, options.MaxIntensityCap, halfLambert,
                            useVis ? options.Visibility : null, useVis ? candClusters[k] : 0,
                            out float i_r, out float i_g, out float i_b, out float sc);
                        scores[k] = sc; ir[k] = i_r; ig[k] = i_g; ib[k] = i_b;
                    });
                }
                else
                {
                    for (int k = 0; k < K; k++)
                    {
                        FitSingleLight(cands[k], px, py, pz, nx, ny, nz, rR, rG, rB, clusters, n, fade2,
                            supportR2, options.MaxIntensityCap, halfLambert,
                            useVis ? options.Visibility : null, useVis ? candClusters[k] : 0,
                            out float i_r, out float i_g, out float i_b, out float sc);
                        scores[k] = sc; ir[k] = i_r; ig[k] = i_g; ib[k] = i_b;
                    }
                }

                // Apply the triangulation seed boost to each triangulated candidate. Score is
                // the negated SSE-drop, so multiplying by >1 (more negative) makes the
                // triangulated seed APPEAR better when its drop is genuinely positive, and
                // doesn't help (and correctly stays "bad") when its drop is small/zero.
                float boost = options.TriangulationSeedBoost;
                if (triCount > 0 && boost > 1.0f)
                {
                    for (int k = 0; k < K; k++)
                    {
                        if (isTriSeed[k] && scores[k] < 0) scores[k] *= boost;
                    }
                }

                int bestK = 0;
                float bestScore = float.PositiveInfinity;
                for (int k = 0; k < K; k++)
                    if (scores[k] < bestScore) { bestScore = scores[k]; bestK = k; }

                Vector3 bestL = cands[bestK];
                Vector3 bestI = new Vector3(ir[bestK], ig[bestK], ib[bestK]);
                bool bestWasTriSeed = isTriSeed[bestK];
                if (bestI.LengthSquared() < 1e-12f)
                {
                    log?.Info($"  round {round + 1}: best candidate fit yields zero intensity; stopping");
                    break;
                }

                // ---- 4. Local pattern-search refinement ----
                float step = options.RefinementStepStart;
                for (int it = 0; it < options.RefinementIterations; it++)
                {
                    Vector3 betterL = bestL;
                    float betterScore = bestScore;
                    Vector3 betterI = bestI;
                    for (int axis = 0; axis < 3; axis++)
                    {
                        for (int sign = -1; sign <= 1; sign += 2)
                        {
                            Vector3 trial = bestL + AxisStep(axis, sign * step);
                            int trialCluster = 0;
                            if (useVis)
                            {
                                int leaf = options.Collision!.PointLeaf(trial);
                                trialCluster = (leaf >= 0 && leaf < options.Collision.LeafCount) ? options.Collision.LeafCluster(leaf) : -1;
                            }
                            FitSingleLight(trial, px, py, pz, nx, ny, nz, rR, rG, rB, clusters, n, fade2,
                                supportR2, options.MaxIntensityCap, halfLambert,
                                useVis ? options.Visibility : null, trialCluster,
                                out float i_r, out float i_g, out float i_b, out float sc);
                            if (sc < betterScore)
                            {
                                betterScore = sc; betterL = trial;
                                betterI = new Vector3(i_r, i_g, i_b);
                            }
                        }
                    }
                    if (betterScore < bestScore - 1e-6f)
                    {
                        bestScore = betterScore; bestL = betterL; bestI = betterI;
                    }
                    else
                    {
                        step *= options.RefinementStepShrink;
                        if (step < 0.5f) break;
                    }
                }

                // ---- 5. Trial subtraction with support test ----
                float energyBefore = currentEnergy;
                int bestCluster = 0;
                if (useVis)
                {
                    int leaf = options.Collision!.PointLeaf(bestL);
                    bestCluster = (leaf >= 0 && leaf < options.Collision.LeafCount) ? options.Collision.LeafCluster(leaf) : -1;
                }
                int supportingTexels = ApplyContribution(
                    bestL, bestI, px, py, pz, nx, ny, nz, rR, rG, rB, clusters, n, fade2,
                    sign: -1f,
                    countSupporting: true,
                    supportingFraction: options.SupportingFraction,
                    halfLambert: options.HalfLambert,
                    vis: useVis ? options.Visibility : null,
                    candCluster: bestCluster);
                currentEnergy = SumSq(rR, rG, rB);

                float explained = MathF.Max(0, energyBefore - currentEnergy);
                float explainedFraction = energyBefore > 1e-9f ? explained / energyBefore : 0;
                float intensityScalar = MathF.Max(bestI.X, MathF.Max(bestI.Y, bestI.Z));

                bool reject = supportingTexels < options.MinSupportingTexels
                              || explainedFraction < options.MinExplainedFractionPerRound;

                if (reject)
                {
                    // Roll back the subtraction.
                    ApplyContribution(bestL, bestI, px, py, pz, nx, ny, nz, rR, rG, rB, clusters, n, fade2,
                        sign: +1f, countSupporting: false, supportingFraction: 0f,
                        halfLambert: options.HalfLambert,
                        vis: useVis ? options.Visibility : null, candCluster: bestCluster);
                    currentEnergy = energyBefore;
                    rejected++;
                    consecutiveRejects++;
                    log?.Info($"  round {round + 1}: REJECT  L=({bestL.X:F0},{bestL.Y:F0},{bestL.Z:F0}) " +
                              $"I={intensityScalar:F1} support={supportingTexels} explained={explainedFraction:P2}");
                    if (consecutiveRejects >= options.MaxConsecutiveRejects)
                    {
                        log?.Info($"  {consecutiveRejects} consecutive rejects; stopping");
                        break;
                    }
                    continue;
                }

                // ---- 6. Accept ----
                accepted++;
                consecutiveRejects = 0;
                Vector3 chroma = intensityScalar > 0 ? bestI / intensityScalar : Vector3.One;
                float confidence = Math.Clamp(explainedFraction * 8f, 0, 1);
                lights.Add(new EstimatedLight
                {
                    Origin = bestL,
                    Color = chroma,
                    Intensity = intensityScalar,
                    Confidence = confidence,
                    SupportingTexels = supportingTexels,
                    ResidualEnergyExplainedFraction = explainedFraction,
                    Method = bestWasTriSeed ? "triangulation+lsq" : "ransac+greedy",
                });
                lightOrigins.Add(bestL);
                lightIntensities.Add(bestI);

                log?.Info($"  round {round + 1}: ACCEPT L=({bestL.X:F0},{bestL.Y:F0},{bestL.Z:F0}) " +
                          $"chroma=({chroma.X:F2},{chroma.Y:F2},{chroma.Z:F2}) I={intensityScalar:F1} " +
                          $"explained={explainedFraction:P2} support={supportingTexels} " +
                          $"residual={currentEnergy:F1}");

                if (currentEnergy / MathF.Max(1e-9f, initialEnergy) < options.ResidualStopFraction)
                {
                    log?.Info($"  residual energy < {options.ResidualStopFraction:P0} of initial; stopping");
                    break;
                }
            }

            // ---- 7. Joint refit (positions fixed, intensities re-solved) ----
            // Greedy peeling underfits later lights and overfits earlier ones whenever supports
            // overlap. A single joint per-channel LSQ on the original (un-peeled) brightness
            // restores energy-conserving intensity assignment.
            if (options.JointRefitAfter && lights.Count > 0)
            {
                // Reconstruct original residuals (current = original - Σ subtractions). Easier
                // to recompute from the source samples directly.
                for (int i = 0; i < n; i++)
                {
                    rR[i] = samples[i].Observed.X;
                    rG[i] = samples[i].Observed.Y;
                    rB[i] = samples[i].Observed.Z;
                }
                JointRefit(lightOrigins, lightIntensities, px, py, pz, nx, ny, nz, rR, rG, rB, n,
                    fade2, options.MaxIntensityCap, options.HalfLambert, log);
                // Replace per-light intensities with refit values.
                for (int li = 0; li < lights.Count; li++)
                {
                    Vector3 I = lightIntensities[li];
                    float scalar = MathF.Max(I.X, MathF.Max(I.Y, I.Z));
                    Vector3 chroma = scalar > 0 ? I / scalar : Vector3.One;
                    var prior = lights[li];
                    lights[li] = new EstimatedLight
                    {
                        Origin = prior.Origin,
                        Color = chroma,
                        Intensity = scalar,
                        Confidence = prior.Confidence,
                        SupportingTexels = prior.SupportingTexels,
                        ResidualEnergyExplainedFraction = prior.ResidualEnergyExplainedFraction,
                        Method = prior.Method + "+jointrefit",
                        BlownOut = prior.BlownOut,
                    };
                }
                currentEnergy = SumSq(rR, rG, rB);
            }

            // ---- 8. Merge nearby duplicates + cull weak lights ----
            if (options.MergeNearbyAfter && lights.Count > 1)
            {
                int beforeMerge = lights.Count;
                lights = MergeNearby(lights, options.MergeRadius);
                int afterMerge = lights.Count;
                if (afterMerge < beforeMerge)
                {
                    log?.Info($"  merge: {beforeMerge} -> {afterMerge} lights (within {options.MergeRadius:F0}u)");
                    // Re-do joint refit on the merged set so intensities reflect the new
                    // positions properly. Reset residuals to the original samples first.
                    if (options.JointRefitAfter)
                    {
                        for (int i = 0; i < n; i++)
                        {
                            rR[i] = samples[i].Observed.X;
                            rG[i] = samples[i].Observed.Y;
                            rB[i] = samples[i].Observed.Z;
                        }
                        var mergedOrigins = new List<Vector3>(lights.Count);
                        var mergedIntensities = new List<Vector3>(lights.Count);
                        for (int li = 0; li < lights.Count; li++)
                        {
                            mergedOrigins.Add(lights[li].Origin);
                            mergedIntensities.Add(lights[li].Color * lights[li].Intensity);
                        }
                        JointRefit(mergedOrigins, mergedIntensities, px, py, pz, nx, ny, nz, rR, rG, rB, n,
                            fade2, options.MaxIntensityCap, options.HalfLambert, log);
                        for (int li = 0; li < lights.Count; li++)
                        {
                            var I = mergedIntensities[li];
                            float scalar = MathF.Max(I.X, MathF.Max(I.Y, I.Z));
                            Vector3 chroma = scalar > 0 ? I / scalar : Vector3.One;
                            var prior = lights[li];
                            lights[li] = new EstimatedLight
                            {
                                Origin = prior.Origin,
                                Color = chroma,
                                Intensity = scalar,
                                Confidence = prior.Confidence,
                                SupportingTexels = prior.SupportingTexels,
                                ResidualEnergyExplainedFraction = prior.ResidualEnergyExplainedFraction,
                                Method = prior.Method.Contains("+merged") ? prior.Method : prior.Method + "+merged",
                                BlownOut = prior.BlownOut,
                            };
                        }
                        currentEnergy = SumSq(rR, rG, rB);
                    }
                }

                // Weak-light cull: drop any light below `WeakLightCullFraction × median I`.
                if (options.WeakLightCullFraction > 0 && lights.Count > 2)
                {
                    var sortedI = lights.Select(l => l.Intensity).OrderBy(v => v).ToArray();
                    float median = sortedI[sortedI.Length / 2];
                    float floor = median * options.WeakLightCullFraction;
                    int beforeCull = lights.Count;
                    lights = lights.Where(l => l.Intensity >= floor).ToList();
                    int afterCull = lights.Count;
                    if (afterCull < beforeCull)
                        log?.Info($"  weak-cull: dropped {beforeCull - afterCull} lights below I={floor:F1} ({options.WeakLightCullFraction:P0} of median)");
                }
            }

            // ---- 9. Phase E4 -- physical-envelope discard pass ----
            // For each accepted light, compute the maximum distance at which it actually
            // contributes brightness above the falloff threshold. Then check the farthest
            // sample whose predicted contribution is non-negligible (a "supporting" sample
            // in the loose sense). If the supporting span exceeds the physical envelope by
            // more than EnvelopeMultiplier, the light's claimed intensity can't physically
            // explain those distant samples; the LSQ overfit and the light is spurious.
            //
            // q3map2 reference (light_ydnar.cpp:3421): envelope = sqrt(intensity / falloffTolerance)
            // for inverse-square. With our internal intensity scale (~q3 light * 100) and
            // a normalised brightness threshold of 0.004 (= 1/255), the formula is
            // d_max = sqrt(I / 0.004) approximately. We use the (already-cap-friendly)
            // expression d_max = sqrt(I * EnvelopeScale) where EnvelopeScale folds the
            // threshold into a single tunable.
            if (options.PhysicalEnvelopeDiscard && lights.Count > 0)
            {
                var keep = new List<EstimatedLight>(lights.Count);
                int dropped = 0;
                foreach (var l in lights)
                {
                    if (l.BlownOut) { keep.Add(l); continue; } // blown-light seeds bypass
                    float I = l.Intensity;
                    if (I < 1f) { keep.Add(l); continue; } // weak lights handled by cull
                    float envelope2 = I * options.EnvelopeScale - fade2;
                    if (envelope2 <= 0) { keep.Add(l); continue; } // intensity so low envelope is degenerate
                    float envelope = MathF.Sqrt(envelope2);
                    float maxSupportDist2 = 0;
                    for (int i = 0; i < n; i++)
                    {
                        float dxv = l.Origin.X - px[i], dyv = l.Origin.Y - py[i], dzv = l.Origin.Z - pz[i];
                        float d2 = dxv * dxv + dyv * dyv + dzv * dzv;
                        if (d2 < 1e-3f) continue;
                        float invD = 1f / MathF.Sqrt(d2);
                        float ndotL = nx[i] * dxv * invD + ny[i] * dyv * invD + nz[i] * dzv * invD;
                        float angle = AngleAttenuation(ndotL, options.HalfLambert);
                        if (angle <= 0) continue;
                        float g = angle / (d2 + fade2);
                        float predict = (l.Color.X + l.Color.Y + l.Color.Z) * I * g / 3f;
                        float observed = (samples[i].Observed.X + samples[i].Observed.Y + samples[i].Observed.Z) / 3f;
                        if (observed < 1e-4f) continue;
                        if (predict / observed >= options.EnvelopeSupportingFraction && d2 > maxSupportDist2)
                            maxSupportDist2 = d2;
                    }
                    float maxSupport = MathF.Sqrt(maxSupportDist2);
                    if (maxSupport > envelope * options.EnvelopeMultiplier)
                    {
                        dropped++;
                        continue;
                    }
                    keep.Add(l);
                }
                if (dropped > 0)
                {
                    log?.Info($"  envelope-discard: dropped {dropped} light(s) whose support span exceeded {options.EnvelopeMultiplier:F1}x physical envelope");
                    lights = keep;
                }
            }

            return new Result
            {
                Lights = lights,
                InitialEnergy = initialEnergy,
                FinalResidualEnergy = currentEnergy,
                RoundsRun = accepted + rejected,
                RoundsAccepted = accepted,
                RoundsRejected = rejected,
                ElapsedSeconds = (float)sw.Elapsed.TotalSeconds,
            };
        }

        // ---------- helpers ----------

        /// <summary>Single-link agglomerative merge of estimated lights within
        /// <paramref name="radius"/> of each other. Merged-cluster origin is the
        /// intensity-weighted centroid; intensity is summed; chroma is the intensity-
        /// weighted average so the brighter contributor's hue dominates.</summary>
        private static List<EstimatedLight> MergeNearby(List<EstimatedLight> lights, float radius)
        {
            float r2 = radius * radius;
            int n = lights.Count;
            var parent = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
            int Find(int x) { while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
            void Union(int a, int b) { a = Find(a); b = Find(b); if (a != b) parent[a] = b; }

            // O(n²) is fine for n ≤ a few hundred lights, the typical estimate count. A
            // proper kd-tree only matters at 10k+.
            for (int i = 0; i < n; i++)
            {
                for (int j = i + 1; j < n; j++)
                {
                    if ((lights[i].Origin - lights[j].Origin).LengthSquared() <= r2)
                        Union(i, j);
                }
            }

            // Collect cluster members.
            var groups = new Dictionary<int, List<int>>();
            for (int i = 0; i < n; i++)
            {
                int r = Find(i);
                if (!groups.TryGetValue(r, out var list))
                {
                    list = new List<int>();
                    groups[r] = list;
                }
                list.Add(i);
            }

            var result = new List<EstimatedLight>(groups.Count);
            foreach (var kv in groups)
            {
                var members = kv.Value;
                if (members.Count == 1) { result.Add(lights[members[0]]); continue; }
                Vector3 centroid = Vector3.Zero;
                Vector3 colorSum = Vector3.Zero;
                float intensitySum = 0;
                int support = 0;
                float confidence = 0;
                float explained = 0;
                bool anyBlownOut = false;
                string method = "merged(" + members.Count + ")";
                foreach (int idx in members)
                {
                    var l = lights[idx];
                    centroid += l.Origin * l.Intensity;
                    colorSum += l.Color * l.Intensity;
                    intensitySum += l.Intensity;
                    support += l.SupportingTexels;
                    confidence = MathF.Max(confidence, l.Confidence);
                    explained = MathF.Max(explained, l.ResidualEnergyExplainedFraction);
                    if (l.BlownOut) anyBlownOut = true;
                }
                if (intensitySum < 1e-6f)
                {
                    // All members essentially zero-intensity; emit one centroid with summed
                    // intensity = sum (which is ~0) and uniform color.
                    Vector3 avgPos = members.Aggregate(Vector3.Zero, (a, i) => a + lights[i].Origin) / members.Count;
                    result.Add(new EstimatedLight { Origin = avgPos, Color = Vector3.One, Intensity = 0, Method = method });
                    continue;
                }
                centroid /= intensitySum;
                Vector3 chroma = colorSum / intensitySum;
                float maxC = MathF.Max(chroma.X, MathF.Max(chroma.Y, chroma.Z));
                if (maxC > 1f) chroma /= maxC; // renormalise hue so max channel = 1
                result.Add(new EstimatedLight
                {
                    Origin = centroid,
                    Color = chroma,
                    Intensity = intensitySum,
                    Confidence = confidence,
                    SupportingTexels = support,
                    ResidualEnergyExplainedFraction = explained,
                    Method = method,
                    BlownOut = anyBlownOut,
                });
            }
            // Stable order by descending intensity so the .ent output is consistent.
            result.Sort((a, b) => b.Intensity.CompareTo(a.Intensity));
            return result;
        }

        private static Vector3 AxisStep(int axis, float v) => axis switch
        {
            0 => new Vector3(v, 0, 0),
            1 => new Vector3(0, v, 0),
            _ => new Vector3(0, 0, v),
        };

        private static float SumSq(float[] r, float[] g, float[] b)
        {
            double s = 0;
            for (int i = 0; i < r.Length; i++) s += r[i] * r[i] + g[i] * g[i] + b[i] * b[i];
            return (float)s;
        }

        /// <summary>Pick samples whose luma is in the top <paramref name="quantile"/> fraction
        /// of the residual brightness distribution. Strictly positive luma only.</summary>
        private static List<int> SelectPivots(float[] rR, float[] rG, float[] rB, float quantile, int maxPivots, Random rng)
        {
            int n = rR.Length;
            // Build (luma, idx) but only for positive samples.
            var lumas = new List<(float l, int i)>(n);
            for (int i = 0; i < n; i++)
            {
                float l = 0.2126f * rR[i] + 0.7152f * rG[i] + 0.0722f * rB[i];
                if (l > 1e-4f) lumas.Add((l, i));
            }
            if (lumas.Count == 0) return new List<int>();
            lumas.Sort((a, b) => b.l.CompareTo(a.l));
            int keepCount = Math.Max(8, (int)(lumas.Count * (1f - quantile)));
            keepCount = Math.Min(keepCount, lumas.Count);
            var keep = lumas.GetRange(0, keepCount);

            // If we have more than maxPivots, downsample uniformly across the kept range so we
            // still get a spread of brightnesses, not just the absolute brightest cluster.
            if (keep.Count > maxPivots)
            {
                var sub = new List<int>(maxPivots);
                for (int s = 0; s < maxPivots; s++)
                {
                    int idx = (int)((s + rng.NextDouble()) / maxPivots * keep.Count);
                    if (idx >= keep.Count) idx = keep.Count - 1;
                    sub.Add(keep[idx].i);
                }
                return sub;
            }
            var result = new List<int>(keep.Count);
            foreach (var (_, i) in keep) result.Add(i);
            return result;
        }

        /// <summary>Per-channel non-negative LSQ fit for a single hypothetical light at L.
        ///
        /// <para>Restricted to samples within sqrt(<paramref name="supportR2"/>) units of L;
        /// this localizes the fit so a candidate is judged by its own neighborhood instead of
        /// being pulled toward the map-wide brightness centroid.</para>
        ///
        /// <para><b>Score is the negative global SSE-drop</b>
        /// <c>−(sgr_R² + sgr_G² + sgr_B²) / sgg</c> in the unconstrained (no-cap) case, with
        /// the cap-aware closed form when a channel saturates. This makes scores directly
        /// comparable across candidates with different neighborhood sizes (which a raw or
        /// even mean SSE-after value is not).</para>
        /// </summary>
        private static void FitSingleLight(
            Vector3 L,
            float[] px, float[] py, float[] pz,
            float[] nx, float[] ny, float[] nz,
            float[] rR, float[] rG, float[] rB,
            int[] clusters,
            int n, float fade2, float supportR2, float cap, bool halfLambert,
            BspVis? vis, int candCluster,
            out float iR, out float iG, out float iB, out float score)
        {
            double sgg = 0;
            double sgr_R = 0, sgr_G = 0, sgr_B = 0;
            int support = 0;
            for (int i = 0; i < n; i++)
            {
                float dxv = L.X - px[i], dyv = L.Y - py[i], dzv = L.Z - pz[i];
                float d2 = dxv * dxv + dyv * dyv + dzv * dzv;
                if (d2 < 1e-3f) continue;
                if (d2 > supportR2) continue;
                // PVS gate: skip samples whose leaf is not potentially-visible from the
                // candidate's leaf. This is the dominant precision win on multi-room maps.
                if (vis != null && !vis.CanSee(candCluster, clusters[i])) continue;
                float invD = 1f / MathF.Sqrt(d2);
                float ndotL = nx[i] * dxv * invD + ny[i] * dyv * invD + nz[i] * dzv * invD;
                float angle = AngleAttenuation(ndotL, halfLambert);
                if (angle <= 0f) continue;
                float g = angle / (d2 + fade2);
                sgg += g * g;
                sgr_R += g * rR[i];
                sgr_G += g * rG[i];
                sgr_B += g * rB[i];
                support++;
            }
            if (sgg < 1e-20 || support < 4)
            {
                iR = iG = iB = 0; score = float.PositiveInfinity; return;
            }
            double inv = 1.0 / sgg;
            iR = ClampToCap((float)(sgr_R * inv), cap);
            iG = ClampToCap((float)(sgr_G * inv), cap);
            iB = ClampToCap((float)(sgr_B * inv), cap);

            // SSE-drop per channel:
            //   drop = sse_before - sse_after = I·(2·sgr - I·sgg)
            // (= sgr²/sgg in the unconstrained case).
            double drop =
                iR * (2.0 * sgr_R - iR * sgg) +
                iG * (2.0 * sgr_G - iG * sgg) +
                iB * (2.0 * sgr_B - iB * sgg);
            // Negative because lower score = better in the rest of the algorithm.
            score = -(float)drop;
        }

        /// <summary>Joint per-channel non-negative LSQ over all (already-positioned) lights.
        /// Solves three independent K×K normal-equation systems (one per RGB channel) using
        /// Gauss-Seidel with non-negativity projection. Robust for K up to a few hundred and
        /// orders-of-magnitude faster than full QR with the same outcome for the typical
        /// well-conditioned cases. Always converges (each step is a coordinate descent with
        /// a clamped non-negative line search on a positive-semi-definite quadratic).</summary>
        private static void JointRefit(
            List<Vector3> origins, List<Vector3> intensities,
            float[] px, float[] py, float[] pz,
            float[] nx, float[] ny, float[] nz,
            float[] rR, float[] rG, float[] rB,
            int n, float fade2, float cap, bool halfLambert, Logger? log)
        {
            int K = origins.Count;
            // Precompute g_{i,k} into a row-major n×K matrix. With n=60k and K=60 that's 14MB
            // of floats — acceptable. For larger K we'd block this.
            var G = new float[n * K];
            for (int k = 0; k < K; k++)
            {
                Vector3 L = origins[k];
                for (int i = 0; i < n; i++)
                {
                    float dxv = L.X - px[i], dyv = L.Y - py[i], dzv = L.Z - pz[i];
                    float d2 = dxv * dxv + dyv * dyv + dzv * dzv;
                    if (d2 < 1e-3f) { G[i * K + k] = 0; continue; }
                    float invD = 1f / MathF.Sqrt(d2);
                    float ndotL = nx[i] * dxv * invD + ny[i] * dyv * invD + nz[i] * dzv * invD;
                    float angle = AngleAttenuation(ndotL, halfLambert);
                    G[i * K + k] = angle > 0 ? angle / (d2 + fade2) : 0;
                }
            }

            // Per-channel Gauss-Seidel with non-negativity. We solve A·I = b where A_jk = Σ g_ij·g_ik
            // and b_j = Σ g_ij·r_i. We don't materialise A; we compute A_kk and a residual on the fly.
            float[] iR = new float[K], iG = new float[K], iB = new float[K];

            // Diagonal once (A_kk = Σ g_ik²) – constant across channels.
            var diag = new float[K];
            for (int k = 0; k < K; k++)
            {
                double s = 0;
                for (int i = 0; i < n; i++) { float g = G[i * K + k]; s += g * g; }
                diag[k] = (float)s;
            }

            // 30 sweeps is more than enough for K ≤ 200 with diagonal-dominant A (most light
            // pairs have non-overlapping support → off-diagonal entries small). We measure Δ
            // and break early when sweeps converge.
            for (int channel = 0; channel < 3; channel++)
            {
                var I = channel == 0 ? iR : channel == 1 ? iG : iB;
                var r = channel == 0 ? rR : channel == 1 ? rG : rB;
                // Working residual vector: e_i = r_i − Σ_k g_ik · I_k. Starts as r since I=0.
                var e = new float[n];
                Array.Copy(r, e, n);
                for (int sweep = 0; sweep < 50; sweep++)
                {
                    float maxDelta = 0;
                    for (int k = 0; k < K; k++)
                    {
                        if (diag[k] < 1e-12f) continue;
                        // numerator = Σ g_ik · (e_i + g_ik·I_k) ; classic coordinate-descent.
                        double num = 0;
                        for (int i = 0; i < n; i++)
                        {
                            float g = G[i * K + k];
                            num += g * (e[i] + g * I[k]);
                        }
                        float Inew = (float)(num / diag[k]);
                        if (Inew < 0) Inew = 0;
                        if (Inew > cap) Inew = cap;
                        float delta = Inew - I[k];
                        if (MathF.Abs(delta) > maxDelta) maxDelta = MathF.Abs(delta);
                        // Update e: e_i -= g_ik · delta
                        for (int i = 0; i < n; i++) e[i] -= G[i * K + k] * delta;
                        I[k] = Inew;
                    }
                    if (maxDelta < 1e-3f) break;
                }
                // Write residual back so the caller can compute final energy.
                for (int i = 0; i < n; i++) r[i] = e[i];
            }

            // Re-pack intensities.
            for (int k = 0; k < K; k++) intensities[k] = new Vector3(iR[k], iG[k], iB[k]);
            log?.Info($"  joint refit: {K} lights, {n} samples, sweeps converged");
        }

        private static float ClampToCap(float v, float cap)
        {
            if (v < 0f) return 0f;
            return v > cap ? cap : v;
        }

        /// <summary>
        /// q3map2's angle-attenuation factor. Standard Lambert <c>max(0, n·L̂)</c> is the
        /// default for shipped Q3/JK2/JKA content; half-Lambert <c>((n·L̂)*0.5 + 0.5)²</c> with
        /// a 0.001 dead-zone is enabled with <c>-lightanglehl 1</c>.
        /// </summary>
        internal static float AngleAttenuation(float ndotL, bool halfLambert)
        {
            if (!halfLambert)
                return ndotL > 0f ? ndotL : 0f;
            // Half-Lambert with the q3map2 0.001 dead-zone (skip coplanar). Match light.cpp:960.
            if (ndotL <= 0.001f) return 0f;
            if (ndotL > 1f) ndotL = 1f;
            float a = ndotL * 0.5f + 0.5f;
            return a * a;
        }

        /// <summary>Add or remove a light's predicted contribution to the residual buffer.
        /// When <paramref name="sign"/> is -1 we subtract (forward greedy peel); +1 reverts.
        /// Returns the count of "supporting" texels (only meaningful when subtracting).
        /// Honours the same PVS gate as <see cref="FitSingleLight"/> so subtraction is
        /// consistent with the fit (we never bleed a fit's energy into samples the candidate
        /// couldn't have illuminated in the first place).</summary>
        private static int ApplyContribution(
            Vector3 L, Vector3 I,
            float[] px, float[] py, float[] pz,
            float[] nx, float[] ny, float[] nz,
            float[] rR, float[] rG, float[] rB,
            int[] clusters,
            int n, float fade2,
            float sign, bool countSupporting, float supportingFraction,
            bool halfLambert,
            BspVis? vis, int candCluster)
        {
            int support = 0;
            for (int i = 0; i < n; i++)
            {
                float dxv = L.X - px[i], dyv = L.Y - py[i], dzv = L.Z - pz[i];
                float d2 = dxv * dxv + dyv * dyv + dzv * dzv;
                if (d2 < 1e-3f) continue;
                if (vis != null && !vis.CanSee(candCluster, clusters[i])) continue;
                float invD = 1f / MathF.Sqrt(d2);
                float ndotL = nx[i] * dxv * invD + ny[i] * dyv * invD + nz[i] * dzv * invD;
                float angle = AngleAttenuation(ndotL, halfLambert);
                if (angle <= 0f) continue;
                float g = angle / (d2 + fade2);
                float dr = I.X * g, dg = I.Y * g, db = I.Z * g;
                if (countSupporting)
                {
                    float observedBefore = rR[i] + rG[i] + rB[i];
                    if (observedBefore > 1e-3f && (dr + dg + db) > supportingFraction * observedBefore)
                        support++;
                }
                rR[i] += sign * dr;
                rG[i] += sign * dg;
                rB[i] += sign * db;
            }
            return support;
        }

        /// <summary>Sum of squared RGB errors between <see cref="TexelSample.Observed"/> and the
        /// forward Lambert/half-Lambert prediction from the given lights (estimator photometric model).</summary>
        public static float ForwardRgbSSE(IReadOnlyList<TexelSample> samples, IReadOnlyList<EstimatedLight> lights, bool halfLambert, float fade = 32f)
        {
            if (samples.Count == 0) return 0f;
            float fade2 = fade * fade;
            double acc = 0;
            for (int i = 0; i < samples.Count; i++)
            {
                var s = samples[i];
                float pr = 0, pg = 0, pb = 0;
                for (int j = 0; j < lights.Count; j++)
                {
                    var L = lights[j];
                    Vector3 Ivec = L.Color * L.Intensity;
                    float dx = L.Origin.X - s.World.X, dy = L.Origin.Y - s.World.Y, dz = L.Origin.Z - s.World.Z;
                    float d2 = dx * dx + dy * dy + dz * dz;
                    if (d2 < 1e-3f) continue;
                    float invD = 1f / MathF.Sqrt(d2);
                    float ndotL = (s.Normal.X * dx + s.Normal.Y * dy + s.Normal.Z * dz) * invD;
                    float angle = AngleAttenuation(ndotL, halfLambert);
                    if (angle <= 0f) continue;
                    float g = angle / (d2 + fade2);
                    pr += Ivec.X * g;
                    pg += Ivec.Y * g;
                    pb += Ivec.Z * g;
                }
                float eR = s.Observed.X - pr, eG = s.Observed.Y - pg, eB = s.Observed.Z - pb;
                acc += eR * eR + eG * eG + eB * eB;
            }
            return (float)acc;
        }

        /// <summary>L0-style greedy elimination: repeatedly drop the dimmest non-<see cref="EstimatedLight.BlownOut"/>
        /// light if removing it raises <see cref="ForwardRgbSSE"/> by at most
        /// <paramref name="relativeSseIncreaseTolerance"/> times the current SSE.</summary>
        public static List<EstimatedLight> MinimizeLightCountGreedy(
            IReadOnlyList<EstimatedLight> lights,
            IReadOnlyList<TexelSample> samples,
            bool halfLambert,
            float fade,
            float relativeSseIncreaseTolerance,
            Logger? log = null)
        {
            if (lights.Count <= 1) return lights.ToList();
            var list = lights.ToList();
            float sse = ForwardRgbSSE(samples, list, halfLambert, fade);
            if (sse < 1e-8f) return list;

            bool progress = true;
            while (progress && list.Count > 1)
            {
                progress = false;
                int idx = -1;
                float minI = float.MaxValue;
                for (int i = 0; i < list.Count; i++)
                {
                    if (list[i].BlownOut) continue;
                    if (list[i].Intensity < minI)
                    {
                        minI = list[i].Intensity;
                        idx = i;
                    }
                }
                if (idx < 0) break;
                var trial = new List<EstimatedLight>(list.Count - 1);
                for (int i = 0; i < list.Count; i++)
                    if (i != idx) trial.Add(list[i]);

                float newSse = ForwardRgbSSE(samples, trial, halfLambert, fade);
                if ((newSse - sse) / sse <= relativeSseIncreaseTolerance)
                {
                    log?.Info($"  minimize-lights: removed dim candidate (sse {sse:F0} -> {newSse:F0}, +{100f * (newSse - sse) / sse:F1}%)");
                    list = trial;
                    sse = newSse;
                    progress = true;
                }
            }
            return list;
        }
    }
}
