using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Heuristics;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.MapFile;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using BspLightReSlopper.Tools;
using BspLightReSlopper.Util;
using MapFileT = BspLightReSlopper.MapFile.MapFile;

namespace BspLightReSlopper.Metrics
{
    /// <summary>
    /// Phase H4 — the centrepiece of "make the map look the same". Runs a closed-loop
    /// refinement that injects the current estimated lights into a reference <c>.map</c>,
    /// recompiles with the heuristically inferred compile settings via
    /// <see cref="Q3Map2Wrapper"/>, re-samples the candidate BSP's lightmap, pairs every
    /// candidate texel to its nearest reference texel in world space (robust to lightmap
    /// layout / atlas-packing / tessellation differences between the two compiles), then
    /// drives a per-light update from the pairwise residual:
    ///
    /// <list type="bullet">
    ///   <item><b>Intensity:</b> if a light's dominant texels average brighter on the
    ///     reference than on the candidate, scale up (and conversely).</item>
    ///   <item><b>Position:</b> the residual-weighted centroid of a light's dominant texels
    ///     is a pull vector: nudge along the vector from the light toward that centroid,
    ///     scaled by the current step size.</item>
    ///   <item><b>Add/drop:</b> large un-owned residual clusters spawn new candidate
    ///     lights; lights whose domain of supremacy is empty or systematically over-
    ///     predicting are dropped.</item>
    /// </list>
    ///
    /// <para>The <b>overall objective</b> minimised across iterations is the perceptual
    /// lightmap MSE between reference and candidate. We keep the lights from the
    /// best-scoring iteration rather than the last iteration — matches the user's
    /// priority of "look the same after a recompile" over "match the exact original
    /// lights".</para>
    ///
    /// <para>Blown texels (reference-side) are excluded from pairing, residual
    /// aggregation, and loss scoring — their observed values are clipped, so they carry
    /// zero useful signal and would bias the refinement toward under-intensity lights.
    /// </para>
    ///
    /// <para>No-recompile fallback: if <see cref="Options.Wrapper"/> is null, the
    /// refiner runs <see cref="PerceptualRefiner"/>-style coordinate descent on the
    /// forward estimator model instead of actually recompiling. This keeps the command
    /// callable on hosts without q3map2 installed.</para>
    /// </summary>
    public sealed class RecompileRefiner
    {
        public sealed class Options
        {
            /// <summary>Absolute path to the reference <c>.map</c> (from jk2-sdk / jka-sdk).
            /// The refiner strips all <c>light</c> entities from a copy of this, re-injects
            /// the current candidates, and recompiles. If null, the refiner uses the
            /// no-recompile photometric fallback.</summary>
            public string? ReferenceMapPath { get; init; }

            /// <summary>Subdir where per-iteration artifacts (work .map, compile logs,
            /// per-iter .bsp) are written. A fresh subdir is created.</summary>
            public string WorkDir { get; init; } = "";

            /// <summary>q3map2 wrapper (already configured with fs_basepath + game token).
            /// When null, the refiner skips the recompile loop entirely and returns the
            /// input lights unchanged (logged as a warning).</summary>
            public Q3Map2Wrapper? Wrapper { get; init; }

            /// <summary>Compile settings to pass each iteration. Derived from
            /// <see cref="CompileSettingsInferer.Infer"/> on the reference BSP by the
            /// caller (<see cref="ConvergeCommand"/> does this).</summary>
            public Q3Map2Wrapper.CompileSettings CompileSettings { get; init; } = new();

            /// <summary>Per-compile timeout. Real JK2 maps compile in a few minutes on
            /// modern hardware; 10 min is permissive.</summary>
            public TimeSpan PerCompileTimeout { get; init; } = TimeSpan.FromMinutes(10);

            /// <summary>Max outer iterations. 4 is a good default — gains plateau
            /// quickly on most maps.</summary>
            public int MaxIterations { get; init; } = 4;

            /// <summary>Early-stop: if the perceptual MSE improves by less than this
            /// fraction between two iterations, stop.</summary>
            public float MinRelativeImprovement { get; init; } = 0.01f;

            /// <summary>Initial positional step (q3 units) applied when the residual
            /// gradient calls for a position nudge. Halved each iteration.</summary>
            public float InitialStep { get; init; } = 48f;

            /// <summary>Intensity multiplier cap per iteration — a single step can't scale
            /// a light by more than this factor (or less than its inverse). Avoids runaway
            /// when an early iteration mis-identifies an under-bright region.</summary>
            public float MaxIntensityScalePerStep { get; init; } = 1.6f;

            /// <summary>After the main loop, also run the photometric
            /// <see cref="PerceptualRefiner"/> on the best lights (uses the reference
            /// samples only, no recompile). Tightens sub-texel positional accuracy.</summary>
            public bool FinishWithPhotometricRefine { get; init; } = true;

            /// <summary>When true (default), the refiner will DROP lights whose dominant
            /// texel count falls below <see cref="MinDominantTexels"/> after the first
            /// iteration.</summary>
            public bool DropOrphanLights { get; init; } = true;

            /// <summary>Minimum count of pair-matched texels a light must dominate to
            /// survive the orphan cull.</summary>
            public int MinDominantTexels { get; init; } = 4;

            /// <summary>Pair-matching tolerance (q3 units). If the nearest reference texel
            /// is farther than this from the candidate texel, the pair is rejected. 96 is
            /// typical for the lightmap scales present in JK2 assets (median texel-world
            /// size ~8u; a 96u tolerance comfortably covers layout differences).</summary>
            public float PairMaxDistance { get; init; } = 96f;

            /// <summary>Max candidate/reference sample count (post-hash). Throttle for
            /// huge maps.</summary>
            public int MaxSamples { get; init; } = 80_000;

            /// <summary>Scale by which the q3-units <c>light</c> key intensity is produced
            /// from the estimator-internal intensity. Caller's responsibility to keep in
            /// sync with the final <c>.ent</c>-export scale.</summary>
            public float Q3IntensityScale { get; init; } = 1f;

            /// <summary>Half-Lambert mode flag (matches the BSP's compile model).</summary>
            public bool HalfLambert { get; init; }

            /// <summary>Photometric fade (matches estimator default).</summary>
            public float Fade { get; init; } = 32f;

            /// <summary>When true (default), add new candidate lights from large un-owned
            /// residual clusters (bright reference texels no current light explains).</summary>
            public bool AddNewLights { get; init; } = true;

            /// <summary>Maximum new lights added per iteration. 4 is restrictive enough to
            /// avoid explosion yet lets the refiner recover missed lights.</summary>
            public int MaxNewLightsPerIteration { get; init; } = 4;
        }

        public sealed class IterationRecord
        {
            public int Iteration { get; init; }
            public int LightCount { get; init; }
            public float MeanSquaredRgb { get; init; }
            public float RootMeanSquaredRgb { get; init; }
            public int PairsUsed { get; init; }
            public bool CompileSucceeded { get; init; }
            public TimeSpan CompileElapsed { get; init; }
            public string Notes { get; init; } = "";
        }

        public sealed class Result
        {
            public IReadOnlyList<EstimatedLight> Lights { get; init; } = Array.Empty<EstimatedLight>();
            public IReadOnlyList<IterationRecord> Iterations { get; init; } = Array.Empty<IterationRecord>();
            public float InitialMse { get; init; }
            public float FinalMse { get; init; }
            public int BestIteration { get; init; }
        }

        /// <summary>
        /// Drive the refinement. All reference data is assumed already extracted.
        /// </summary>
        public static Result Refine(
            IReadOnlyList<TexelSample> referenceSamples,
            IReadOnlyList<EstimatedLight> initialLights,
            bool[]? referenceBlownMask,
            Vector3 worldBboxMin,
            Vector3 worldBboxMax,
            Options options,
            Logger? log = null)
        {
            if (initialLights.Count == 0)
            {
                return new Result
                {
                    Lights = Array.Empty<EstimatedLight>(),
                    Iterations = Array.Empty<IterationRecord>(),
                };
            }

            var iters = new List<IterationRecord>();

            var currentLights = initialLights.ToList();
            var bestLights = initialLights.ToList();
            float bestMse = LightEstimator.ForwardRgbSSE(referenceSamples, bestLights, options.HalfLambert, options.Fade, referenceBlownMask)
                / Math.Max(1, referenceSamples.Count * 3);
            float initialMse = bestMse;
            int bestIter = -1;

            bool canRecompile = options.Wrapper != null
                                && !string.IsNullOrEmpty(options.ReferenceMapPath)
                                && File.Exists(options.ReferenceMapPath);

            if (!canRecompile)
            {
                log?.Warn("recompile refiner: no q3map2 / no .map — skipping compile-in-loop and running photometric refine only");
                if (options.FinishWithPhotometricRefine)
                {
                    var pr = PerceptualRefiner.RefineRgb(referenceSamples, currentLights, options.HalfLambert, options.Fade,
                        new PerceptualRefiner.Options { Passes = 3, StepStart = options.InitialStep },
                        excludeMask: referenceBlownMask);
                    currentLights = pr.Lights.ToList();
                    float pfSse = LightEstimator.ForwardRgbSSE(referenceSamples, currentLights, options.HalfLambert, options.Fade, referenceBlownMask)
                                  / Math.Max(1, referenceSamples.Count * 3);
                    if (pfSse < bestMse)
                    {
                        bestMse = pfSse;
                        bestLights = currentLights;
                    }
                }
                return new Result
                {
                    Lights = bestLights,
                    Iterations = iters,
                    InitialMse = initialMse,
                    FinalMse = bestMse,
                    BestIteration = -1,
                };
            }

            Directory.CreateDirectory(options.WorkDir);
            string referenceMapText = File.ReadAllText(options.ReferenceMapPath!);

            float step = options.InitialStep;
            for (int iter = 0; iter < options.MaxIterations; iter++)
            {
                var sw = System.Diagnostics.Stopwatch.StartNew();
                string iterDir = Path.Combine(options.WorkDir, $"iter_{iter + 1:D2}");
                Directory.CreateDirectory(iterDir);

                // --- 1. Inject lights into a fresh copy of the reference .map ------
                string workMap = Path.Combine(iterDir, "work.map");
                File.WriteAllText(workMap, referenceMapText);
                var parsed = MapFileParser.ParseFile(workMap);
                var defs = BuildLightDefs(currentLights, options.Q3IntensityScale);
                MapLightMerger.ReplaceLights(parsed, defs, new MapLightMerger.Options
                {
                    WorldspawnKeys = BuildWorldspawnKeys(options.CompileSettings),
                });
                MapFileWriter.Write(workMap, parsed);

                // --- 2. Recompile ---------------------------------------------------
                var compile = options.Wrapper!.Compile(workMap, options.CompileSettings, options.PerCompileTimeout);
                DumpCompileLog(compile, Path.Combine(iterDir, "compile.log"));
                if (!compile.Succeeded)
                {
                    log?.Warn($"  recompile-refine iter {iter + 1}: compile failed ({string.Join(",", compile.Stages.Select(s => s.Stage + ":" + s.ExitCode))})");
                    iters.Add(new IterationRecord
                    {
                        Iteration = iter + 1,
                        LightCount = currentLights.Count,
                        CompileSucceeded = false,
                        CompileElapsed = sw.Elapsed,
                        Notes = "compile failed",
                    });
                    break;
                }

                // --- 3. Sample candidate BSP ---------------------------------------
                BspFile candBsp;
                try { candBsp = BspLoader.Load(compile.BspPath); }
                catch (Exception ex)
                {
                    log?.Warn($"  recompile-refine iter {iter + 1}: load candidate bsp failed: {ex.Message}");
                    iters.Add(new IterationRecord
                    {
                        Iteration = iter + 1,
                        LightCount = currentLights.Count,
                        CompileSucceeded = true,
                        CompileElapsed = sw.Elapsed,
                        Notes = "load candidate bsp failed",
                    });
                    break;
                }
                var candUnpacked = SurfaceUnpacker.Unpack(candBsp);
                var candAtlas = LightmapAtlas.FromBsp(candBsp);
                var candCollision = new BspCollision(candBsp);
                var candSmp = TexelSampler.Sample(candBsp, candUnpacked, candAtlas,
                    new TexelSampler.SampleOptions { MaxSamples = options.MaxSamples }, candCollision);

                // --- 4. Pair, score, residuals ------------------------------------
                var pairs = BuildPairs(referenceSamples, candSmp.Samples, referenceBlownMask, options.PairMaxDistance);
                float mse = ComputeMse(pairs);

                iters.Add(new IterationRecord
                {
                    Iteration = iter + 1,
                    LightCount = currentLights.Count,
                    CompileSucceeded = true,
                    CompileElapsed = sw.Elapsed,
                    MeanSquaredRgb = mse,
                    RootMeanSquaredRgb = MathF.Sqrt(mse),
                    PairsUsed = pairs.Count,
                });

                log?.Info($"  recompile-refine iter {iter + 1}: compile={sw.Elapsed.TotalSeconds:F0}s, pairs={pairs.Count}, MSE={mse:F5}, RMSE={MathF.Sqrt(mse):F4}");

                if (mse < bestMse - options.MinRelativeImprovement * bestMse)
                {
                    bestMse = mse;
                    bestLights = currentLights.Select(CloneLight).ToList();
                    bestIter = iter + 1;
                }
                else if (iter > 0 && mse > bestMse * 1.05f)
                {
                    // Big regression — revert and shrink step.
                    log?.Info($"  recompile-refine iter {iter + 1}: regression; reverting to best-so-far (iter {bestIter})");
                    currentLights = bestLights.Select(CloneLight).ToList();
                    step *= 0.5f;
                    continue;
                }

                // --- 5. Propose per-light adjustments (intensity + position) -------
                currentLights = AdjustLights(
                    currentLights,
                    referenceSamples,
                    candSmp.Samples,
                    pairs,
                    referenceBlownMask,
                    step,
                    options);

                // --- 6. Optional add-new-lights from big un-owned residual ---------
                if (options.AddNewLights)
                {
                    var newLights = ProposeNewLights(
                        pairs,
                        currentLights,
                        options.HalfLambert,
                        options.Fade,
                        options.MaxNewLightsPerIteration);
                    if (newLights.Count > 0)
                    {
                        currentLights.AddRange(newLights);
                        log?.Info($"  recompile-refine iter {iter + 1}: added {newLights.Count} new light(s) from un-owned residual");
                    }
                }

                // Shrink the step each iteration (classical pattern-search).
                step *= 0.5f;
            }

            // Final photometric polish (cheap, no compile).
            if (options.FinishWithPhotometricRefine)
            {
                var pr = PerceptualRefiner.RefineRgb(referenceSamples, bestLights, options.HalfLambert, options.Fade,
                    new PerceptualRefiner.Options { Passes = 2, StepStart = Math.Max(4f, step) },
                    excludeMask: referenceBlownMask);
                float pfSse = LightEstimator.ForwardRgbSSE(referenceSamples, pr.Lights, options.HalfLambert, options.Fade, referenceBlownMask)
                              / Math.Max(1, referenceSamples.Count * 3);
                log?.Info($"  recompile-refine finish: photometric polish MSE {bestMse:F5} -> {pfSse:F5}");
                if (pfSse < bestMse)
                {
                    bestMse = pfSse;
                    bestLights = pr.Lights.ToList();
                }
            }

            return new Result
            {
                Lights = bestLights,
                Iterations = iters,
                InitialMse = initialMse,
                FinalMse = bestMse,
                BestIteration = bestIter,
            };
        }

        // ---------- helpers ----------

        private static List<LightDefinition> BuildLightDefs(List<EstimatedLight> lights, float q3Scale)
        {
            // Normalise intensity to median-maps-to-300 (same rule as EstimateCommand uses
            // in its .ent export) unless the caller has already applied a scale.
            float scale = q3Scale;
            if (q3Scale == 1f && lights.Count > 0)
            {
                var sorted = lights.Select(l => l.Intensity).OrderBy(v => v).ToArray();
                float median = sorted[sorted.Length / 2];
                if (median > 1e-3f) scale = 300f / median;
            }
            var defs = new List<LightDefinition>(lights.Count);
            foreach (var l in lights)
            {
                defs.Add(new LightDefinition
                {
                    Origin = l.Origin,
                    Color = l.Color,
                    Q3LightIntensity = l.Intensity * scale,
                });
            }
            return defs;
        }

        private static Dictionary<string, string> BuildWorldspawnKeys(Q3Map2Wrapper.CompileSettings s)
        {
            var d = new Dictionary<string, string>();
            // Only stamp _lightmapscale — gamma/compensate/overbright are passed on the
            // q3map2 command line, not as worldspawn keys, so they come from
            // CompileSettings directly.
            return d;
        }

        private static void DumpCompileLog(Q3Map2Wrapper.CompileResult compile, string path)
        {
            using var w = new StreamWriter(path, append: false);
            foreach (var s in compile.Stages)
            {
                w.WriteLine("---- " + s.Stage + " (exit=" + s.ExitCode + ", " + s.Elapsed.TotalSeconds.ToString("0.0", CultureInfo.InvariantCulture) + "s) ----");
                w.WriteLine("$ " + s.CommandLine);
                w.Write(s.Stdout);
                if (!string.IsNullOrEmpty(s.Stderr))
                {
                    w.WriteLine();
                    w.WriteLine("---- stderr ----");
                    w.Write(s.Stderr);
                }
                w.WriteLine();
            }
        }

        /// <summary>One reference↔candidate texel pair with the raw RGB residual.</summary>
        public readonly struct TexelPair
        {
            public readonly int RefIndex;
            public readonly int CandIndex;
            public readonly Vector3 RefWorld;
            public readonly Vector3 RefNormal;
            public readonly Vector3 Residual;  // reference - candidate
            public TexelPair(int refIdx, int candIdx, Vector3 refWorld, Vector3 refNormal, Vector3 residual)
            {
                RefIndex = refIdx; CandIndex = candIdx;
                RefWorld = refWorld; RefNormal = refNormal; Residual = residual;
            }
        }

        /// <summary>World-space nearest-neighbour pairing via voxel hash. Excludes
        /// pairs where the reference sample is blown.</summary>
        public static List<TexelPair> BuildPairs(
            IReadOnlyList<TexelSample> reference,
            IReadOnlyList<TexelSample> candidate,
            bool[]? referenceBlownMask,
            float maxPairDistance)
        {
            const float cell = 32f;
            var grid = new Dictionary<(int x, int y, int z), List<int>>(reference.Count);
            for (int i = 0; i < reference.Count; i++)
            {
                if (referenceBlownMask != null && i < referenceBlownMask.Length && referenceBlownMask[i]) continue;
                var p = reference[i].World;
                var key = ((int)MathF.Floor(p.X / cell), (int)MathF.Floor(p.Y / cell), (int)MathF.Floor(p.Z / cell));
                if (!grid.TryGetValue(key, out var list)) { list = new List<int>(); grid[key] = list; }
                list.Add(i);
            }
            float maxD2 = maxPairDistance * maxPairDistance;
            var pairs = new List<TexelPair>(candidate.Count);
            for (int ci = 0; ci < candidate.Count; ci++)
            {
                var c = candidate[ci];
                int cx = (int)MathF.Floor(c.World.X / cell);
                int cy = (int)MathF.Floor(c.World.Y / cell);
                int cz = (int)MathF.Floor(c.World.Z / cell);
                int bestRi = -1; float bestD2 = maxD2 + 1f;
                for (int dx = -1; dx <= 1; dx++)
                    for (int dy = -1; dy <= 1; dy++)
                        for (int dz = -1; dz <= 1; dz++)
                        {
                            if (!grid.TryGetValue((cx + dx, cy + dy, cz + dz), out var list)) continue;
                            for (int k = 0; k < list.Count; k++)
                            {
                                int ri = list[k];
                                var r = reference[ri];
                                // Normal-agreement bonus: prefer ref texels whose normal
                                // faces roughly the same way (we don't want to pair a floor
                                // texel to a ceiling texel sharing XY because some light is
                                // sandwiched between).
                                if (Vector3.Dot(r.Normal, c.Normal) < 0.5f) continue;
                                float vx = r.World.X - c.World.X, vy = r.World.Y - c.World.Y, vz = r.World.Z - c.World.Z;
                                float d2 = vx * vx + vy * vy + vz * vz;
                                if (d2 < bestD2) { bestD2 = d2; bestRi = ri; }
                            }
                        }
                if (bestRi < 0 || bestD2 > maxD2) continue;
                var refS = reference[bestRi];
                Vector3 residual = refS.Observed - c.Observed;
                pairs.Add(new TexelPair(bestRi, ci, refS.World, refS.Normal, residual));
            }
            return pairs;
        }

        private static float ComputeMse(List<TexelPair> pairs)
        {
            if (pairs.Count == 0) return 0f;
            double acc = 0;
            for (int i = 0; i < pairs.Count; i++)
            {
                var r = pairs[i].Residual;
                acc += r.X * r.X + r.Y * r.Y + r.Z * r.Z;
            }
            return (float)(acc / (pairs.Count * 3.0));
        }

        /// <summary>Assign each pair to its dominant light, aggregate per-light residual
        /// stats, then propose intensity + position deltas.</summary>
        private static List<EstimatedLight> AdjustLights(
            List<EstimatedLight> lights,
            IReadOnlyList<TexelSample> referenceSamples,
            IReadOnlyList<TexelSample> candidateSamples,
            List<TexelPair> pairs,
            bool[]? refBlownMask,
            float step,
            Options options)
        {
            int K = lights.Count;
            if (K == 0) return lights;

            float fade2 = options.Fade * options.Fade;

            // Per-light residual aggregation.
            var resSum = new Vector3[K];          // Σ residual
            var weightSum = new float[K];         // Σ |forward-g| for normalisation
            var residualCentroidAccum = new Vector3[K]; // Σ residual_luma * world
            var residualCentroidW = new float[K];       // Σ residual_luma
            var pullCentroidAccum = new Vector3[K];     // same but only where residual>0
            var pullCentroidW = new float[K];
            var owned = new int[K];

            for (int p = 0; p < pairs.Count; p++)
            {
                var pair = pairs[p];
                // Find the dominant light for this reference texel under the current
                // forward model (no vis — we don't have the ref BSP's collision here;
                // conservative: the g-weight dominant light captures position best).
                int dom = -1;
                float domG = 0;
                for (int k = 0; k < K; k++)
                {
                    var L = lights[k];
                    Vector3 d = L.Origin - pair.RefWorld;
                    float d2 = d.LengthSquared();
                    if (d2 < 1e-3f) continue;
                    float invD = 1f / MathF.Sqrt(d2);
                    float ndotL = (pair.RefNormal.X * d.X + pair.RefNormal.Y * d.Y + pair.RefNormal.Z * d.Z) * invD;
                    float angle = LightEstimator.AngleAttenuation(ndotL, options.HalfLambert);
                    if (angle <= 0) continue;
                    float g = angle / (d2 + fade2) * L.Intensity;
                    if (g > domG) { domG = g; dom = k; }
                }
                if (dom < 0) continue;
                owned[dom]++;
                resSum[dom] += pair.Residual;
                weightSum[dom] += 1f;
                float rLuma = 0.2126f * pair.Residual.X + 0.7152f * pair.Residual.Y + 0.0722f * pair.Residual.Z;
                residualCentroidAccum[dom] += pair.RefWorld * rLuma;
                residualCentroidW[dom] += rLuma;
                if (rLuma > 0)
                {
                    pullCentroidAccum[dom] += pair.RefWorld * rLuma;
                    pullCentroidW[dom] += rLuma;
                }
            }

            var adjusted = new List<EstimatedLight>(K);
            for (int k = 0; k < K; k++)
            {
                var L = lights[k];
                if (L.BlownOut)
                {
                    // Blown-seeded lights still get intensity updates but we don't
                    // move their position (they're anchored to the saturated cluster
                    // centroid, which is a geometric constraint we trust more than a
                    // residual gradient).
                    float scaleB = ComputeIntensityScale(resSum[k], weightSum[k], options.MaxIntensityScalePerStep);
                    adjusted.Add(new EstimatedLight
                    {
                        Origin = L.Origin,
                        Color = L.Color,
                        Intensity = MathF.Max(1e-3f, L.Intensity * scaleB),
                        Confidence = L.Confidence,
                        SupportingTexels = L.SupportingTexels,
                        ResidualEnergyExplainedFraction = L.ResidualEnergyExplainedFraction,
                        Method = L.Method + "+recompile",
                        BlownOut = true,
                    });
                    continue;
                }

                if (owned[k] < options.MinDominantTexels)
                {
                    if (options.DropOrphanLights)
                    {
                        // Drop orphans — they explain no reference pixels.
                        continue;
                    }
                    adjusted.Add(L);
                    continue;
                }

                // Intensity update.
                float scale = ComputeIntensityScale(resSum[k], weightSum[k], options.MaxIntensityScalePerStep);

                // Position update: pull toward the POSITIVE-residual centroid (where the
                // reference is brighter than our candidate, i.e. we're under-predicting
                // light — light should be closer to that region).
                Vector3 origin = L.Origin;
                if (pullCentroidW[k] > 1e-6f)
                {
                    Vector3 target = pullCentroidAccum[k] / pullCentroidW[k];
                    Vector3 dir = target - L.Origin;
                    float dist = dir.Length();
                    if (dist > 1e-4f)
                    {
                        Vector3 unit = dir / dist;
                        float moveStep = MathF.Min(step, dist * 0.5f);
                        origin = L.Origin + unit * moveStep;
                    }
                }

                adjusted.Add(new EstimatedLight
                {
                    Origin = origin,
                    Color = L.Color,
                    Intensity = MathF.Max(1e-3f, L.Intensity * scale),
                    Confidence = L.Confidence,
                    SupportingTexels = L.SupportingTexels,
                    ResidualEnergyExplainedFraction = L.ResidualEnergyExplainedFraction,
                    Method = L.Method + "+recompile",
                    BlownOut = false,
                });
            }
            return adjusted;
        }

        /// <summary>Convert a per-light residual (reference - candidate) into a multiplicative
        /// intensity scale. Positive residual (reference brighter) -> scale &gt; 1; negative
        /// residual -> scale &lt; 1. Clamped by <paramref name="maxPerStep"/>.</summary>
        private static float ComputeIntensityScale(Vector3 residualSum, float weightSum, float maxPerStep)
        {
            if (weightSum < 1e-6f) return 1f;
            Vector3 meanRes = residualSum / weightSum;
            float meanLuma = 0.2126f * meanRes.X + 0.7152f * meanRes.Y + 0.0722f * meanRes.Z;
            // Heuristic: scale-factor = 1 + clamp(k * meanLuma, -(1 - 1/maxPerStep), maxPerStep - 1)
            // where k = 3 gives an adequately strong pull without oscillation.
            const float k = 3.0f;
            float delta = k * meanLuma;
            float upper = maxPerStep - 1f;
            float lower = 1f / maxPerStep - 1f;
            if (delta > upper) delta = upper;
            if (delta < lower) delta = lower;
            return 1f + delta;
        }

        /// <summary>Find clusters of strongly positive residuals that NO current light
        /// dominates, and propose new lights at their brightness-weighted centroids.
        /// Used for "I missed this light entirely" recovery.</summary>
        private static List<EstimatedLight> ProposeNewLights(
            List<TexelPair> pairs,
            List<EstimatedLight> existingLights,
            bool halfLambert,
            float fade,
            int maxNew)
        {
            if (pairs.Count == 0 || maxNew <= 0) return new List<EstimatedLight>();
            float fade2 = fade * fade;
            // Collect pairs where residual is significantly positive AND the existing
            // lights' forward prediction is weak there.
            var hot = new List<TexelPair>();
            for (int i = 0; i < pairs.Count; i++)
            {
                var r = pairs[i].Residual;
                float rLuma = 0.2126f * r.X + 0.7152f * r.Y + 0.0722f * r.Z;
                if (rLuma < 0.08f) continue;
                // How much of the reference brightness can existing lights explain?
                float prLum = 0f;
                for (int k = 0; k < existingLights.Count; k++)
                {
                    var L = existingLights[k];
                    Vector3 d = L.Origin - pairs[i].RefWorld;
                    float d2 = d.LengthSquared();
                    if (d2 < 1e-3f) continue;
                    float invD = 1f / MathF.Sqrt(d2);
                    float ndotL = (pairs[i].RefNormal.X * d.X + pairs[i].RefNormal.Y * d.Y + pairs[i].RefNormal.Z * d.Z) * invD;
                    float angle = LightEstimator.AngleAttenuation(ndotL, halfLambert);
                    if (angle <= 0) continue;
                    float g = angle / (d2 + fade2);
                    prLum += L.Intensity * 0.577f * g; // approx: g * mean chroma
                }
                if (prLum > rLuma * 0.4f) continue; // existing lights already explain >40%
                hot.Add(pairs[i]);
            }
            if (hot.Count < 8) return new List<EstimatedLight>();

            // Mean-shift cluster the hot texels in world space (bandwidth 96u).
            const float bw = 96f; const float bw2 = bw * bw;
            var modes = new List<Vector3>();
            var members = new List<List<int>>();
            var visited = new bool[hot.Count];
            for (int s = 0; s < hot.Count; s++)
            {
                if (visited[s]) continue;
                Vector3 m = hot[s].RefWorld;
                for (int it = 0; it < 20; it++)
                {
                    Vector3 sumP = Vector3.Zero; int sumN = 0;
                    for (int j = 0; j < hot.Count; j++)
                    {
                        Vector3 q = hot[j].RefWorld;
                        if ((q - m).LengthSquared() <= bw2) { sumP += q; sumN++; }
                    }
                    if (sumN == 0) break;
                    Vector3 next = sumP / sumN;
                    if ((next - m).LengthSquared() < 1f) { m = next; break; }
                    m = next;
                }
                // Assign members to this mode.
                var mem = new List<int>();
                for (int j = 0; j < hot.Count; j++)
                {
                    if (!visited[j] && (hot[j].RefWorld - m).LengthSquared() <= bw2)
                    {
                        visited[j] = true;
                        mem.Add(j);
                    }
                }
                if (mem.Count >= 8)
                {
                    modes.Add(m);
                    members.Add(mem);
                }
            }
            // Sort by cluster size, take top maxNew.
            var idx = Enumerable.Range(0, modes.Count).ToList();
            idx.Sort((a, b) => members[b].Count.CompareTo(members[a].Count));
            idx = idx.Take(maxNew).ToList();

            var newLights = new List<EstimatedLight>(idx.Count);
            foreach (int ci in idx)
            {
                var mem = members[ci];
                // Light origin: the mean normal-offset above the cluster centroid, distance
                // ~= 1.5x the cluster extent (capped to 128u). Chroma: mean positive residual
                // colour normalised. Intensity: heuristic so predicted_luma ~= residual_luma
                // at the cluster, assuming typical light_ydnar falloff.
                Vector3 centroid = Vector3.Zero;
                Vector3 avgN = Vector3.Zero;
                Vector3 colSum = Vector3.Zero;
                float sumLum = 0f;
                float maxDistSq = 0f;
                Vector3 first = hot[mem[0]].RefWorld;
                foreach (int j in mem)
                {
                    var hp = hot[j];
                    float rLuma = 0.2126f * hp.Residual.X + 0.7152f * hp.Residual.Y + 0.0722f * hp.Residual.Z;
                    float w = MathF.Max(0f, rLuma);
                    centroid += hp.RefWorld * w;
                    avgN += hp.RefNormal;
                    colSum += new Vector3(
                        MathF.Max(0f, hp.Residual.X),
                        MathF.Max(0f, hp.Residual.Y),
                        MathF.Max(0f, hp.Residual.Z));
                    sumLum += w;
                    float dsq = (hp.RefWorld - first).LengthSquared();
                    if (dsq > maxDistSq) maxDistSq = dsq;
                }
                if (sumLum < 1e-6f) continue;
                centroid /= sumLum;
                if (avgN.LengthSquared() < 1e-6f) continue;
                Vector3 nHat = Vector3.Normalize(avgN);
                float extent = MathF.Sqrt(maxDistSq);
                float offset = MathF.Min(192f, MathF.Max(32f, extent * 1.5f));
                Vector3 origin = centroid + nHat * offset;
                Vector3 chromaRaw = colSum / MathF.Max(1e-6f, (float)mem.Count);
                float maxC = MathF.Max(chromaRaw.X, MathF.Max(chromaRaw.Y, chromaRaw.Z));
                Vector3 chroma = maxC > 1e-6f ? chromaRaw / maxC : Vector3.One;
                // Intensity: solve roughly for meanLuma ≈ I * maxC / (offset² + fade²). Use
                // boundary residual luma at the cluster as target brightness.
                float targetLuma = sumLum / MathF.Max(1, mem.Count);
                float gAt = 1f / (offset * offset + fade2);
                float I = targetLuma / MathF.Max(1e-6f, maxC * gAt);
                // Clamp to sane q3 light bounds; the estimator's joint refit will settle
                // things properly at the next iteration.
                I = MathF.Min(I, 80000f);
                newLights.Add(new EstimatedLight
                {
                    Origin = origin,
                    Color = chroma,
                    Intensity = I,
                    Confidence = 0.4f,
                    SupportingTexels = mem.Count,
                    Method = "recompile-residual-add",
                    BlownOut = false,
                });
            }
            return newLights;
        }

        private static EstimatedLight CloneLight(EstimatedLight l) => new EstimatedLight
        {
            Origin = l.Origin,
            Color = l.Color,
            Intensity = l.Intensity,
            Confidence = l.Confidence,
            SupportingTexels = l.SupportingTexels,
            ResidualEnergyExplainedFraction = l.ResidualEnergyExplainedFraction,
            Method = l.Method,
            BlownOut = l.BlownOut,
        };
    }
}
