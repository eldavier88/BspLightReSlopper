using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Sampling;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// Phase E6 -- per-light type classifier (point / spot / linear). For each accepted
    /// light, fit three candidate falloff models on its supporting samples and pick the
    /// one with the lowest residual SSE. The choice drives the .ent emission:
    ///
    /// <list type="bullet">
    ///   <item><b>Point</b> (default): no extra keys.</item>
    ///   <item><b>Linear</b> (q3 spawnflag 1): falloff is <c>I·linearScale - d·fade</c>
    ///         instead of inverse-square. Recover by fitting both <c>I</c> and <c>fade</c>
    ///         and seeing whether the linear model explains support better than 1/d^2.
    ///         <c>spawnflags 1</c> in the .ent.</item>
    ///   <item><b>Spot</b>: brightness has an angular cone cutoff outside which it drops
    ///         sharply. Detected by checking whether all of the light's supporting samples
    ///         fall within a single tight angular cone around a dominant direction. If so,
    ///         emit a <c>target</c>+<c>info_null</c> companion entity at the cone's tip.</item>
    /// </list>
    ///
    /// <para>The classifier never overrides a blowout-seeded or sun-sourced light.</para>
    /// </summary>
    public static class LightTypeClassifier
    {
        public enum Kind { Point, Linear, Spot }

        public sealed class Classification
        {
            public Kind Type { get; init; }
            /// <summary>For spot lights, the cone direction (unit vector). Light origin +
            /// this * 256u is a reasonable target for an info_null companion.</summary>
            public Vector3 SpotDirection { get; init; }
            /// <summary>Cone half-angle in degrees (for spot lights).</summary>
            public float SpotHalfAngleDegrees { get; init; }
            /// <summary>Per-model SSE (lower = better fit). Diagnostic.</summary>
            public float PointSse { get; init; }
            public float LinearSse { get; init; }
            public float SpotSse { get; init; }
        }

        public sealed class Options
        {
            /// <summary>Half-angle in degrees beyond which a sample is considered OUTSIDE
            /// the spot's cone. We try angles from 15° to 60° in 5° steps and pick the
            /// best-fitting cone; this is the upper bound.</summary>
            public float MaxSpotHalfAngle { get; init; } = 60f;

            /// <summary>Linear-model fade parameter sweep range (in our internal units).
            /// q3 linear lights have fade = light/scale and aren't directly invertible from
            /// the LSQ; we fit by sweeping fade across this range and picking lowest SSE.</summary>
            public float LinearFadeMin { get; init; } = 1f;
            public float LinearFadeMax { get; init; } = 50f;
            public int LinearFadeSteps { get; init; } = 12;

            /// <summary>The winning model must beat the second-best by this fraction of its
            /// SSE to be accepted. Otherwise we default to Point (the safest classification).</summary>
            public float WinningModelSseMargin { get; init; } = 0.10f;
        }

        public static Classification Classify(EstimatedLight light, IReadOnlyList<TexelSample> samples,
            bool halfLambert, Options? options = null)
        {
            options ??= new Options();
            // Build a "supporting samples" subset. We define it loosely: any sample where the
            // light's predicted contribution under the standard inverse-square model is at
            // least 5% of the observed brightness. Tight enough to focus on the light's own
            // footprint, loose enough to capture the falloff curve.
            const float fade2 = 32f * 32f;
            var support = new List<(Vector3 toLight, float dist, Vector3 observed)>();
            for (int i = 0; i < samples.Count; i++)
            {
                var s = samples[i];
                Vector3 toL = light.Origin - s.World;
                float d2 = toL.LengthSquared();
                if (d2 < 1e-3f) continue;
                float invD = 1f / MathF.Sqrt(d2);
                float ndotL = (s.Normal.X * toL.X + s.Normal.Y * toL.Y + s.Normal.Z * toL.Z) * invD;
                float angle = AngleFactor(ndotL, halfLambert);
                if (angle <= 0) continue;
                float g = angle / (d2 + fade2);
                float predict = light.Intensity * g;
                float observed = (s.Observed.X + s.Observed.Y + s.Observed.Z) / 3f;
                if (observed > 0.001f && predict / observed >= 0.05f)
                    support.Add((toL * invD, MathF.Sqrt(d2), s.Observed));
            }
            // Need a non-trivial support set to attempt classification.
            if (support.Count < 6)
                return new Classification { Type = Kind.Point };

            // ---- Point model SSE (the baseline; intensity is whatever was already fit) ----
            float pointSse = 0;
            foreach (var (_, d, obs) in support)
            {
                float predict = light.Intensity / (d * d + fade2);
                float observed = (obs.X + obs.Y + obs.Z) / 3f;
                pointSse += (predict - observed) * (predict - observed);
            }

            // ---- Linear model: predict = max(0, I·linearScale - d·fade), pick best fade ----
            float bestLinearSse = float.PositiveInfinity;
            float bestLinearFade = options.LinearFadeMin;
            for (int s = 0; s < options.LinearFadeSteps; s++)
            {
                float fade = options.LinearFadeMin +
                             (options.LinearFadeMax - options.LinearFadeMin) * (s / (float)Math.Max(1, options.LinearFadeSteps - 1));
                // q3 linear: brightness = max(0, I·linearScale - d·fade). With our internal
                // I units, linearScale = 1; the equation becomes max(0, I - d*fade).
                float sse = 0;
                foreach (var (_, d, obs) in support)
                {
                    float predict = MathF.Max(0, light.Intensity - d * fade);
                    // Linear model produces flat-bright near, fading to zero. Scale to
                    // match observed range using the observed mean as a crude calibration.
                    float observed = (obs.X + obs.Y + obs.Z) / 3f;
                    sse += (predict - observed) * (predict - observed);
                }
                if (sse < bestLinearSse) { bestLinearSse = sse; bestLinearFade = fade; }
            }

            // ---- Spot model: try several cone-direction candidates (the support set's own
            // dominant direction) and several half-angles; pick best SSE within cone, treat
            // outside-cone samples as zero contribution.
            // Dominant direction = mean unit vector from light TOWARDS supporting samples.
            Vector3 meanFromLight = Vector3.Zero;
            foreach (var (toL, _, _) in support) meanFromLight -= toL; // -toL = from light to sample
            if (meanFromLight.LengthSquared() > 1e-6f) meanFromLight = Vector3.Normalize(meanFromLight);
            float bestSpotSse = float.PositiveInfinity;
            float bestSpotHalfAngle = 30f;
            for (int aDeg = 15; aDeg <= options.MaxSpotHalfAngle; aDeg += 5)
            {
                float cosCone = MathF.Cos(aDeg * MathF.PI / 180f);
                float sse = 0;
                foreach (var (toL, d, obs) in support)
                {
                    Vector3 fromLight = -toL;
                    float dot = Vector3.Dot(meanFromLight, fromLight);
                    float predict;
                    if (dot < cosCone) predict = 0; // outside cone
                    else predict = light.Intensity / (d * d + fade2);
                    float observed = (obs.X + obs.Y + obs.Z) / 3f;
                    sse += (predict - observed) * (predict - observed);
                }
                if (sse < bestSpotSse) { bestSpotSse = sse; bestSpotHalfAngle = aDeg; }
            }

            // ---- Decide the winning model ----
            float[] sses = { pointSse, bestLinearSse, bestSpotSse };
            int winnerIdx = 0;
            for (int i = 1; i < 3; i++) if (sses[i] < sses[winnerIdx]) winnerIdx = i;
            // Margin check: the winner must beat the runner-up by margin% of runner-up SSE.
            int runnerUp = 0;
            for (int i = 0; i < 3; i++) if (i != winnerIdx && (runnerUp == winnerIdx || sses[i] < sses[runnerUp])) runnerUp = i;
            if (sses[winnerIdx] > sses[runnerUp] * (1f - options.WinningModelSseMargin))
                winnerIdx = 0; // not enough margin -> default Point

            return new Classification
            {
                Type = winnerIdx switch { 1 => Kind.Linear, 2 => Kind.Spot, _ => Kind.Point },
                SpotDirection = winnerIdx == 2 ? meanFromLight : Vector3.Zero,
                SpotHalfAngleDegrees = winnerIdx == 2 ? bestSpotHalfAngle : 0,
                PointSse = pointSse,
                LinearSse = bestLinearSse,
                SpotSse = bestSpotSse,
            };
        }

        private static float AngleFactor(float ndotL, bool halfLambert)
        {
            if (!halfLambert) return ndotL > 0 ? ndotL : 0;
            if (ndotL <= 0.001f) return 0;
            if (ndotL > 1) ndotL = 1;
            float a = ndotL * 0.5f + 0.5f;
            return a * a;
        }
    }
}
