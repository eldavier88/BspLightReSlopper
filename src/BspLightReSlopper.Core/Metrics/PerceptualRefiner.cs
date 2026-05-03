using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Sampling;

namespace BspLightReSlopper.Metrics
{
    /// <summary>
    /// Coordinate-descent refinement of light origins (and per-light scalar intensity)
    /// against <see cref="LightEstimator.ForwardRgbSSE"/> on reference texel samples — no
    /// GPU, no recompile inside the inner loop. Use after <see cref="LightEstimator.Estimate"/>
    /// to reduce photometric mismatch before optional q3map2 validation.
    /// </summary>
    public static class PerceptualRefiner
    {
        public sealed class Options
        {
            /// <summary>Passes over all lights; each pass tries axis steps until SSE stalls.</summary>
            public int Passes { get; init; } = 3;

            /// <summary>Initial trial offset along ±X/±Y/±Z (q3 units); halved each stagnation.</summary>
            public float StepStart { get; init; } = 32f;

            /// <summary>Also try multiplicative intensity tweaks: scale in {1/1.25, 1.25}.</summary>
            public bool RefineIntensity { get; init; } = true;

            public float MinStep { get; init; } = 4f;
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
            var L = CloneLights(lights);
            float initial = LightEstimator.ForwardRgbSSE(samples, L, halfLambert, fade, excludeMask);
            float sse = initial;

            for (int pass = 0; pass < options.Passes; pass++)
            {
                cancellationToken.ThrowIfCancellationRequested();
                float step = options.StepStart;
                while (step >= options.MinStep)
                {
                    bool improved = false;
                    for (int k = 0; k < L.Count; k++)
                    {
                        if (L[k].BlownOut) continue;

                        if (options.RefineIntensity)
                        {
                            foreach (float scale in new[] { 1.25f, 1f / 1.25f })
                            {
                                var trial = CloneLights(L);
                                var lk = trial[k];
                                trial[k] = new EstimatedLight
                                {
                                    Origin = lk.Origin,
                                    Color = lk.Color,
                                    Intensity = MathMax(lk.Intensity * scale, 1e-4f),
                                    Confidence = lk.Confidence,
                                    SupportingTexels = lk.SupportingTexels,
                                    ResidualEnergyExplainedFraction = lk.ResidualEnergyExplainedFraction,
                                    Method = lk.Method + "+refine",
                                    BlownOut = lk.BlownOut,
                                };
                                float tSse = LightEstimator.ForwardRgbSSE(samples, trial, halfLambert, fade, excludeMask);
                                if (tSse < sse - 1e-4f)
                                {
                                    L = trial;
                                    sse = tSse;
                                    improved = true;
                                }
                            }
                        }

                        for (int axis = 0; axis < 3; axis++)
                        {
                            for (int sgn = -1; sgn <= 1; sgn += 2)
                            {
                                var trial = CloneLights(L);
                                var lk = trial[k];
                                Vector3 d = axis switch
                                {
                                    0 => new Vector3(sgn * step, 0, 0),
                                    1 => new Vector3(0, sgn * step, 0),
                                    _ => new Vector3(0, 0, sgn * step),
                                };
                                trial[k] = new EstimatedLight
                                {
                                    Origin = lk.Origin + d,
                                    Color = lk.Color,
                                    Intensity = lk.Intensity,
                                    Confidence = lk.Confidence,
                                    SupportingTexels = lk.SupportingTexels,
                                    ResidualEnergyExplainedFraction = lk.ResidualEnergyExplainedFraction,
                                    Method = lk.Method + "+refine",
                                    BlownOut = lk.BlownOut,
                                };
                                float tSse = LightEstimator.ForwardRgbSSE(samples, trial, halfLambert, fade, excludeMask);
                                if (tSse < sse - 1e-4f)
                                {
                                    L = trial;
                                    sse = tSse;
                                    improved = true;
                                }
                            }
                        }
                    }
                    if (!improved)
                        step *= 0.5f;
                }
            }

            return new RefineResult
            {
                Lights = L,
                InitialSse = initial,
                FinalSse = sse,
            };
        }

        private static float MathMax(float a, float b) => a > b ? a : b;

        private static List<EstimatedLight> CloneLights(IReadOnlyList<EstimatedLight> src)
        {
            var list = new List<EstimatedLight>(src.Count);
            for (int i = 0; i < src.Count; i++)
                list.Add(src[i]);
            return list;
        }
    }
}
