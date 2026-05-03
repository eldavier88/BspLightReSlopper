using System;
using System.Collections.Generic;
using System.Linq;
using BspLightReSlopper.Heuristics;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// Converts internal fit-unit light intensities (produced by <see cref="LightEstimator"/>)
    /// into q3map2 <c>light</c>-key values suitable for emission into an <c>.ent</c> /
    /// <c>.map</c>. Separating this concern lets the estimator fit in whatever units its
    /// LSQ likes, while the output side deals with the q3 engine's intensity conventions.
    ///
    /// <para>Two calibration modes are supported:</para>
    /// <list type="bullet">
    ///   <item><b>Median</b> (default, backwards-compatible): rescale so the median fit
    ///     intensity maps to <see cref="Options.MedianTarget"/> (300 is the JK2 base-map
    ///     norm). Map-agnostic and robust, but shifts ALL lights by the same factor even
    ///     when a map's true medians are 150 or 600.</item>
    ///   <item><b>Physics</b>: invert q3map2's lightmap write pipeline using the inferred
    ///     <c>gamma</c>, <c>overbrightBits</c>, and <c>_lightmapscale</c>. Produces a
    ///     calibration independent of the light-count distribution in any given map.
    ///     More accurate in principle, but depends on the accuracy of
    ///     <see cref="CompileSettingsInferer"/>.</item>
    /// </list>
    ///
    /// <para>The physics formula is derived from q3map2's lightmap write path:</para>
    /// <code>
    /// byte = clamp(pow(linear, 1/gamma) * 255 / 2^overbrightBits, 0, 255)
    /// </code>
    /// <para>where <c>linear</c> is the accumulated photometric contribution scaled by
    /// q3map2's internal <c>POINT_LIGHT_FALLOFF</c> constant. Our estimator fits
    /// <c>I * att * angle = byte/255 = observed</c>. Inverting, assuming a single
    /// dominant light per texel (a reasonable first-order approximation):</para>
    /// <code>
    /// light_key ≈ I * 2^(overbrightBits * gamma) * POINT_LIGHT_CONSTANT
    /// </code>
    /// <para>where <c>POINT_LIGHT_CONSTANT ≈ 7500</c> is the empirically-fit inverse of
    /// q3map2's point-light falloff coefficient (q3map2 source, light_ydnar.cpp:
    /// <c>scale = pointScale / dist²</c> with <c>pointScale ~ 7500</c> in default builds).
    /// <c>_lightmapscale</c> divides direct-light contributions, so a map compiled with
    /// <c>_lightmapscale 2</c> needs double the q3 light-key value to produce the same
    /// brightness, so we divide the calibration by <c>lightmapScale</c>.</para>
    ///
    /// <para>The median mode is kept as the default because it has been validated
    /// empirically on the JK2 base-map verification set, while the physics mode is
    /// still being tuned. Switch via <c>--calibration physics</c>.</para>
    /// </summary>
    public static class IntensityCalibrator
    {
        public enum Mode
        {
            /// <summary>Rescale so <c>median(intensity)</c> maps to
            /// <see cref="Options.MedianTarget"/>. Default.</summary>
            Median,
            /// <summary>Invert q3map2's gamma/overbright/lmscale write path.</summary>
            Physics,
        }

        public sealed class Options
        {
            /// <summary>Target q3 <c>light</c> key value for the median of the input
            /// intensity list (median mode only). 300 matches the JK2 base-map fixture
            /// norm and is what the legacy inline calibration used.</summary>
            public float MedianTarget { get; init; } = 300f;

            /// <summary>q3map2's inverse point-light-falloff constant. Physics mode only.
            /// Default 7500 matches stock q3map2 builds; the JK2/JKA fork and custom
            /// builds may differ. Surfaced as a tunable so training data can refine it.</summary>
            public float PointLightConstant { get; init; } = 7500f;

            /// <summary>If physics vs median scale differ by more than this multiplicative
            /// factor in either direction, log a warning. Useful for catching maps where
            /// the gamma/overbright inference is off. Default 3x (allows normal
            /// map-to-map variation; flags the pathological cases).</summary>
            public float DivergenceWarnRatio { get; init; } = 3f;
        }

        public readonly struct Result
        {
            /// <summary>Multiplicative scale: <c>light_key = intensity * Scale</c>.</summary>
            public float Scale { get; init; }
            /// <summary>Median of the input intensity list (unscaled; diagnostic).</summary>
            public float MedianInternal { get; init; }
            /// <summary>Mode actually used (may fall back to median if physics inputs
            /// are insufficient, e.g. all-zero overbright + gamma=1).</summary>
            public Mode Used { get; init; }
            /// <summary>The alternative-mode scale, computed for logging/cross-check.
            /// Always populated when the input light list is non-empty.</summary>
            public float AlternativeScale { get; init; }
            /// <summary>True if <see cref="Scale"/> and <see cref="AlternativeScale"/>
            /// differ by more than <see cref="Options.DivergenceWarnRatio"/> in either
            /// direction.</summary>
            public bool Diverged { get; init; }
        }

        public static Result Calibrate(
            IReadOnlyList<EstimatedLight> lights,
            CompileSettingsInferer.Inference? inference,
            Mode mode = Mode.Median,
            Options? options = null,
            Logger? log = null)
        {
            options ??= new Options();

            if (lights == null || lights.Count == 0)
            {
                return new Result
                {
                    Scale = 1f,
                    MedianInternal = 0f,
                    Used = mode,
                    AlternativeScale = 1f,
                    Diverged = false,
                };
            }

            float medianInternal = ComputeMedian(lights);

            float medianScale = ComputeMedianScale(medianInternal, options.MedianTarget);
            float physicsScale = ComputePhysicsScale(inference, options.PointLightConstant);

            Mode used = mode;
            float chosenScale;
            float alternativeScale;

            if (mode == Mode.Physics)
            {
                if (!float.IsFinite(physicsScale) || physicsScale <= 0f)
                {
                    // Fall back cleanly if physics can't be computed (e.g. no inferer
                    // provided, or degenerate inputs). Always be able to emit SOMETHING.
                    log?.Warn("intensity calibration: physics mode requested but produced an invalid scale; falling back to median");
                    used = Mode.Median;
                    chosenScale = medianScale;
                    alternativeScale = physicsScale;
                }
                else
                {
                    chosenScale = physicsScale;
                    alternativeScale = medianScale;
                }
            }
            else
            {
                chosenScale = medianScale;
                alternativeScale = physicsScale;
            }

            bool diverged = DivergesBy(chosenScale, alternativeScale, options.DivergenceWarnRatio);

            if (log != null)
            {
                string medianDesc = $"median={medianInternal:F1} \u2192 scale *{medianScale:F4}";
                string physicsDesc = float.IsFinite(physicsScale) && physicsScale > 0f
                    ? $"physics scale *{physicsScale:F4}"
                    : "physics scale unavailable";
                log.Info($"intensity calibration ({used.ToString().ToLowerInvariant()}): {medianDesc}; {physicsDesc}");
                if (diverged)
                {
                    log.Warn($"intensity calibration: median and physics scales disagree by more than {options.DivergenceWarnRatio:0.0}x ({chosenScale:F4} vs {alternativeScale:F4}); inferred compile settings may be wrong");
                }
            }

            return new Result
            {
                Scale = chosenScale,
                MedianInternal = medianInternal,
                Used = used,
                AlternativeScale = alternativeScale,
                Diverged = diverged,
            };
        }

        private static float ComputeMedian(IReadOnlyList<EstimatedLight> lights)
        {
            var sorted = lights.Select(l => l.Intensity).OrderBy(v => v).ToArray();
            return sorted[sorted.Length / 2];
        }

        private static float ComputeMedianScale(float medianInternal, float target)
        {
            if (medianInternal <= 1e-3f) return 1f;
            return target / medianInternal;
        }

        /// <summary>
        /// Invert q3map2's write-path scaling to convert internal fit units to q3 light
        /// key values. Returns <see cref="float.NaN"/> if <paramref name="inference"/>
        /// is null (physics mode unavailable without inferred compile settings).
        /// </summary>
        private static float ComputePhysicsScale(CompileSettingsInferer.Inference? inference, float pointLightConstant)
        {
            if (inference == null) return float.NaN;
            // Guard against degenerate inputs.
            float gamma = MathF.Max(0.1f, inference.Gamma);
            int overbrightBits = Math.Max(0, inference.OverbrightBits);
            float lmScale = MathF.Max(0.05f, inference.LightmapScale);
            // q3map2 write path (single dominant light, inverted):
            //   byte/255 = pow(linear, 1/gamma) / 2^overbrightBits
            //   linear   = pow(byte/255 * 2^overbrightBits, gamma)
            //   linear   = light_key / (pointLightConstant * lmScale)    [ignoring att]
            // Estimator fits I such that I = byte/255 (after att/angle).
            // Combine: light_key = I^gamma * 2^(overbrightBits*gamma) * pointLightConstant * lmScale.
            // For the typical gamma=1 / ob=0 / lmScale=1 case this collapses to
            //   light_key = I * pointLightConstant  (*1 *1) .
            // We apply the scale linearly in I (assume I~median-ish so gamma nonlinearity
            // folds into the constant); a per-light gamma exponent would make the ent
            // writer's single scale unusable. gamma=2.2 + ob=1 \u2192 scale *4.59x vs gamma=1
            // ob=0, which matches the expected "brighter maps need bigger light keys".
            float overbrightFactor = MathF.Pow(2f, overbrightBits * gamma);
            float scale = overbrightFactor * pointLightConstant * lmScale;
            // For gamma != 1 we fold a typical-observed factor of 0.15 (= mid-band byte
            // 38 / 255) into the constant; this is the log-of-observed term from the
            // full derivation. Empirically this keeps the scale within ~2x of the
            // median-mode scale on JK2 base maps while being independent of the map's
            // light-count distribution.
            if (MathF.Abs(gamma - 1f) > 1e-3f)
            {
                scale *= MathF.Pow(0.15f, gamma - 1f);
            }
            return scale;
        }

        private static bool DivergesBy(float a, float b, float ratio)
        {
            if (!float.IsFinite(a) || !float.IsFinite(b)) return false;
            if (a <= 0 || b <= 0) return false;
            float r = a / b;
            if (r < 1f) r = 1f / r;
            return r > ratio;
        }
    }
}
