using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Sampling;

namespace BspLightReSlopper.Metrics
{
    /// <summary>
    /// Coordinate-descent refinement of light origins against the photometric SSE on
    /// reference texel samples. Uses <b>incremental updates</b>: pre-computes per-sample
    /// predicted brightness and per-light geometric-contribution arrays G[k], so each
    /// trial is O(n) instead of O(n×K). Fixes the infinite-loop / O(n²K) performance
    /// problem that caused 10+ minute hangs on large blowout-heavy maps.
    /// </summary>
    public static class PerceptualRefiner
    {
        public sealed class Options
        {
            /// <summary>Passes over all lights; each pass tries axis steps until SSE stalls.</summary>
            public int Passes { get; init; } = 1;

            /// <summary>Initial trial offset along ±X/±Y/±Z (q3 units); shrinks each iteration.</summary>
            public float StepStart { get; init; } = 32f;

            /// <summary>Also try multiplicative intensity tweaks: scale in {1/1.25, 1.25}.
            /// Disabled by default: JointRefit already handles intensity calibration.</summary>
            public bool RefineIntensity { get; init; } = false;

            public float MinStep { get; init; } = 4f;

            /// <summary>Max inner iterations per pass (safety cap against non-converging step decay).</summary>
            public int MaxInnerIter { get; init; } = 20;
        }

        public sealed class RefineResult
        {
            public IReadOnlyList<EstimatedLight> Lights { get; init; } = Array.Empty<EstimatedLight>();
            public float InitialSse { get; init; }
            public float FinalSse { get; init; }
        }

        public static RefineResult RefineRgb(
            IReadOnlyList<TexelSample> samples,
            IReadOnlyList<EstimatedLight> lights,
            bool halfLambert,
            float fade,
            Options? options = null,
            System.Threading.CancellationToken cancellationToken = default,
            bool[]? excludeMask = null)
        {
            options ??= new Options();
            int n = samples.Count;
            int K = lights.Count;
            float fade2 = fade * fade;

            if (n == 0 || K == 0)
                return new RefineResult { Lights = new List<EstimatedLight>(lights), InitialSse = 0f, FinalSse = 0f };

            // Copy mutable light array.
            var L = new EstimatedLight[K];
            for (int k = 0; k < K; k++) L[k] = lights[k];

            // Cache per-sample observed brightness (avoid struct indexing overhead in inner loops).
            var obsR = new float[n];
            var obsG = new float[n];
            var obsB = new float[n];
            var active = new bool[n]; // false = excluded
            for (int i = 0; i < n; i++)
            {
                obsR[i] = samples[i].Observed.X;
                obsG[i] = samples[i].Observed.Y;
                obsB[i] = samples[i].Observed.Z;
                active[i] = !(excludeMask != null && i < excludeMask.Length && excludeMask[i]);
            }

            // Per-sample predicted brightness (sum of all lights).
            var predR = new float[n];
            var predG = new float[n];
            var predB = new float[n];

            // Per-light geometric contribution arrays G[k][i].
            // n×K floats: 70k×30 ≈ 8.4M floats ≈ 33MB — acceptable.
            var Gk = new float[K][];
            for (int k = 0; k < K; k++)
            {
                var gk = BuildGk(L[k].Origin, samples, fade2, halfLambert, n);
                Gk[k] = gk;
                var Iv = L[k].Color * L[k].Intensity;
                for (int i = 0; i < n; i++)
                {
                    predR[i] += Iv.X * gk[i];
                    predG[i] += Iv.Y * gk[i];
                    predB[i] += Iv.Z * gk[i];
                }
            }

            float initial = SumSqError(predR, predG, predB, obsR, obsG, obsB, active, n);
            float sse = initial;

            for (int pass = 0; pass < options.Passes; pass++)
            {
                cancellationToken.ThrowIfCancellationRequested();
                float step = options.StepStart;
                int innerIter = 0;
                while (step >= options.MinStep && innerIter < options.MaxInnerIter)
                {
                    innerIter++;
                    bool improved = false;
                    for (int k = 0; k < K; k++)
                    {
                        if (L[k].BlownOut) continue;
                        var lk = L[k];
                        var Iv = lk.Color * lk.Intensity;

                        // Trial intensity scaling.
                        if (options.RefineIntensity)
                        {
                            foreach (float scale in new[] { 1.25f, 1f / 1.25f })
                            {
                                float newI = MathF.Max(lk.Intensity * scale, 1e-4f);
                                var newIv = lk.Color * newI;
                                var dIv = newIv - Iv;
                                float tSse = IncrementalSse(Gk[k], dIv, predR, predG, predB, obsR, obsG, obsB, active, n);
                                if (tSse < sse - 1e-4f)
                                {
                                    ApplyDelta(Gk[k], dIv, predR, predG, predB, n);
                                    lk = SetIntensity(lk, newI);
                                    L[k] = lk;
                                    Iv = lk.Color * lk.Intensity;
                                    sse = tSse;
                                    improved = true;
                                }
                            }
                        }

                        // Trial origin offsets.
                        for (int axis = 0; axis < 3; axis++)
                        {
                            for (int sgn = -1; sgn <= 1; sgn += 2)
                            {
                                Vector3 trialOrigin = lk.Origin + axis switch
                                {
                                    0 => new Vector3(sgn * step, 0, 0),
                                    1 => new Vector3(0, sgn * step, 0),
                                    _ => new Vector3(0, 0, sgn * step),
                                };
                                var newGk = BuildGk(trialOrigin, samples, fade2, halfLambert, n);
                                // Incremental SSE: remove old contribution, add new.
                                float tSse = IncrementalOriginSse(Gk[k], newGk, Iv,
                                    predR, predG, predB, obsR, obsG, obsB, active, n);
                                if (tSse < sse - 1e-4f)
                                {
                                    // Accept: update pred and gk cache.
                                    ApplyOriginDelta(Gk[k], newGk, Iv, predR, predG, predB, n);
                                    Gk[k] = newGk;
                                    lk = SetOrigin(lk, trialOrigin);
                                    L[k] = lk;
                                    sse = tSse;
                                    improved = true;
                                }
                            }
                        }
                    }
                    // Always shrink step to guarantee termination.
                    step *= improved ? 0.8f : 0.5f;
                }
            }

            var result = new List<EstimatedLight>(K);
            for (int k = 0; k < K; k++) result.Add(L[k]);

            return new RefineResult { Lights = result, InitialSse = initial, FinalSse = sse };
        }

        // ─── Incremental math helpers ───────────────────────────────────────

        private static float[] BuildGk(Vector3 origin, IReadOnlyList<TexelSample> samples,
            float fade2, bool halfLambert, int n)
        {
            var gk = new float[n];
            for (int i = 0; i < n; i++)
            {
                var s = samples[i];
                float dx = origin.X - s.World.X, dy = origin.Y - s.World.Y, dz = origin.Z - s.World.Z;
                float d2 = dx*dx + dy*dy + dz*dz;
                if (d2 < 1e-3f) { gk[i] = 0; continue; }
                float invD = 1f / MathF.Sqrt(d2);
                float ndotL = (s.Normal.X*dx + s.Normal.Y*dy + s.Normal.Z*dz) * invD;
                float angle = LightEstimator.AngleAttenuation(ndotL, halfLambert);
                gk[i] = angle > 0 ? angle / (d2 + fade2) : 0;
            }
            return gk;
        }

        private static float SumSqError(float[] predR, float[] predG, float[] predB,
            float[] obsR, float[] obsG, float[] obsB, bool[] active, int n)
        {
            double acc = 0;
            for (int i = 0; i < n; i++)
            {
                if (!active[i]) continue;
                float er = obsR[i] - predR[i], eg = obsG[i] - predG[i], eb = obsB[i] - predB[i];
                acc += er*er + eg*eg + eb*eb;
            }
            return (float)acc;
        }

        /// <summary>Trial SSE when we apply a delta Ivec to the contribution of Gk.
        /// IncrementalSse = Σ (obs - pred - dIv * gk)²</summary>
        private static float IncrementalSse(float[] gk, Vector3 dIv,
            float[] predR, float[] predG, float[] predB,
            float[] obsR, float[] obsG, float[] obsB, bool[] active, int n)
        {
            double acc = 0;
            for (int i = 0; i < n; i++)
            {
                if (!active[i]) continue;
                float g = gk[i];
                float er = obsR[i] - predR[i] - dIv.X * g;
                float eg = obsG[i] - predG[i] - dIv.Y * g;
                float eb = obsB[i] - predB[i] - dIv.Z * g;
                acc += er*er + eg*eg + eb*eb;
            }
            return (float)acc;
        }

        private static void ApplyDelta(float[] gk, Vector3 dIv,
            float[] predR, float[] predG, float[] predB, int n)
        {
            for (int i = 0; i < n; i++)
            {
                float g = gk[i];
                predR[i] += dIv.X * g;
                predG[i] += dIv.Y * g;
                predB[i] += dIv.Z * g;
            }
        }

        /// <summary>Trial SSE when we swap old Gk for new Gk2 (origin moved).</summary>
        private static float IncrementalOriginSse(float[] oldGk, float[] newGk, Vector3 Iv,
            float[] predR, float[] predG, float[] predB,
            float[] obsR, float[] obsG, float[] obsB, bool[] active, int n)
        {
            double acc = 0;
            for (int i = 0; i < n; i++)
            {
                if (!active[i]) continue;
                float dg = newGk[i] - oldGk[i];
                float er = obsR[i] - predR[i] - Iv.X * dg;
                float eg = obsG[i] - predG[i] - Iv.Y * dg;
                float eb = obsB[i] - predB[i] - Iv.Z * dg;
                acc += er*er + eg*eg + eb*eb;
            }
            return (float)acc;
        }

        private static void ApplyOriginDelta(float[] oldGk, float[] newGk, Vector3 Iv,
            float[] predR, float[] predG, float[] predB, int n)
        {
            for (int i = 0; i < n; i++)
            {
                float dg = newGk[i] - oldGk[i];
                predR[i] += Iv.X * dg;
                predG[i] += Iv.Y * dg;
                predB[i] += Iv.Z * dg;
            }
        }

        private static EstimatedLight SetIntensity(EstimatedLight lk, float newI) =>
            new EstimatedLight
            {
                Origin = lk.Origin, Color = lk.Color, Intensity = newI,
                Confidence = lk.Confidence, SupportingTexels = lk.SupportingTexels,
                ResidualEnergyExplainedFraction = lk.ResidualEnergyExplainedFraction,
                Method = lk.Method + "+refine", BlownOut = lk.BlownOut,
            };

        private static EstimatedLight SetOrigin(EstimatedLight lk, Vector3 newOrigin) =>
            new EstimatedLight
            {
                Origin = newOrigin, Color = lk.Color, Intensity = lk.Intensity,
                Confidence = lk.Confidence, SupportingTexels = lk.SupportingTexels,
                ResidualEnergyExplainedFraction = lk.ResidualEnergyExplainedFraction,
                Method = lk.Method + "+refine", BlownOut = lk.BlownOut,
            };
    }
}
