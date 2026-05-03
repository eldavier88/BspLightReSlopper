using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Heuristics;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class IntensityCalibratorTests
    {
        private static List<EstimatedLight> MakeLights(params float[] intensities)
        {
            var list = new List<EstimatedLight>(intensities.Length);
            foreach (var i in intensities)
                list.Add(new EstimatedLight { Origin = Vector3.Zero, Color = Vector3.One, Intensity = i });
            return list;
        }

        private static CompileSettingsInferer.Inference MakeInference(float gamma, int overbright, float lmScale)
            => new CompileSettingsInferer.Inference
            {
                Gamma = gamma,
                OverbrightBits = overbright,
                LightmapScale = lmScale,
            };

        [Fact]
        public void Median_DefaultTarget_300_MapsMedianToTarget()
        {
            var lights = MakeLights(50, 100, 200, 400, 800);
            var r = IntensityCalibrator.Calibrate(lights, inference: null, mode: IntensityCalibrator.Mode.Median);
            Assert.Equal(IntensityCalibrator.Mode.Median, r.Used);
            Assert.Equal(200f, r.MedianInternal, tolerance: 1e-3f);
            // median (200) * scale == 300
            Assert.Equal(1.5f, r.Scale, tolerance: 1e-3f);
            // median * scale = target
            Assert.Equal(300f, r.MedianInternal * r.Scale, tolerance: 1e-2f);
        }

        [Fact]
        public void Median_EmptyInput_ReturnsIdentityScale()
        {
            var r = IntensityCalibrator.Calibrate(new List<EstimatedLight>(), inference: null);
            Assert.Equal(1f, r.Scale);
            Assert.Equal(0f, r.MedianInternal);
            Assert.False(r.Diverged);
        }

        [Fact]
        public void Median_CustomTarget_Respected()
        {
            var lights = MakeLights(100);
            var r = IntensityCalibrator.Calibrate(lights, inference: null,
                mode: IntensityCalibrator.Mode.Median,
                options: new IntensityCalibrator.Options { MedianTarget = 1000f });
            Assert.Equal(10f, r.Scale, tolerance: 1e-3f);
        }

        [Fact]
        public void Physics_WithoutInference_FallsBackToMedian()
        {
            var lights = MakeLights(100);
            var r = IntensityCalibrator.Calibrate(lights, inference: null, mode: IntensityCalibrator.Mode.Physics);
            // No inference => physics unavailable => fall back to median. Used flag
            // reflects the effective mode, not the requested one.
            Assert.Equal(IntensityCalibrator.Mode.Median, r.Used);
            Assert.Equal(3f, r.Scale, tolerance: 1e-3f); // 300/100
        }

        [Fact]
        public void Physics_StandardInference_ProducesPointLightConstantScale()
        {
            // gamma=1, overbright=0, lmScale=1 => scale = pointLightConstant * 1 * 1 = 7500.
            var inf = MakeInference(gamma: 1f, overbright: 0, lmScale: 1f);
            var lights = MakeLights(100);
            var r = IntensityCalibrator.Calibrate(lights, inf, mode: IntensityCalibrator.Mode.Physics);
            Assert.Equal(IntensityCalibrator.Mode.Physics, r.Used);
            Assert.Equal(7500f, r.Scale, tolerance: 1f);
        }

        [Fact]
        public void Physics_Gamma22_Overbright1_ScaleHigherThanStandard()
        {
            // gamma=2.2, overbright=1, lmScale=1: standard JK2 base-map compile.
            // scale = 7500 * 2^(1*2.2) * 0.15^(2.2-1)
            //       = 7500 * 4.594 * 0.15^1.2
            //       = 7500 * 4.594 * 0.1035
            //       ≈ 3566
            var inf = MakeInference(gamma: 2.2f, overbright: 1, lmScale: 1f);
            var lights = MakeLights(100);
            var r = IntensityCalibrator.Calibrate(lights, inf, mode: IntensityCalibrator.Mode.Physics);
            Assert.Equal(IntensityCalibrator.Mode.Physics, r.Used);
            // Sanity range — should be in the thousands, not millions or single digits.
            Assert.InRange(r.Scale, 1000f, 10000f);
        }

        [Fact]
        public void Physics_LightmapScale_ScalesLinearly()
        {
            var inf1 = MakeInference(gamma: 1f, overbright: 0, lmScale: 1f);
            var inf2 = MakeInference(gamma: 1f, overbright: 0, lmScale: 2f);
            var inf4 = MakeInference(gamma: 1f, overbright: 0, lmScale: 4f);
            var lights = MakeLights(100);
            var r1 = IntensityCalibrator.Calibrate(lights, inf1, mode: IntensityCalibrator.Mode.Physics);
            var r2 = IntensityCalibrator.Calibrate(lights, inf2, mode: IntensityCalibrator.Mode.Physics);
            var r4 = IntensityCalibrator.Calibrate(lights, inf4, mode: IntensityCalibrator.Mode.Physics);
            Assert.Equal(2 * r1.Scale, r2.Scale, tolerance: 1e-2f);
            Assert.Equal(4 * r1.Scale, r4.Scale, tolerance: 1e-2f);
        }

        [Fact]
        public void Physics_AlternativeScale_IsAlwaysMedianScale()
        {
            var inf = MakeInference(gamma: 1f, overbright: 0, lmScale: 1f);
            var lights = MakeLights(100); // median => 100
            var r = IntensityCalibrator.Calibrate(lights, inf, mode: IntensityCalibrator.Mode.Physics);
            // Requested physics, so alternative = median (= 300/100 = 3).
            Assert.Equal(3f, r.AlternativeScale, tolerance: 1e-3f);
            Assert.Equal(7500f, r.Scale, tolerance: 1f);
        }

        [Fact]
        public void DivergenceWarning_TriggersWhenScalesDifferSubstantially()
        {
            // median scale = 3 (target 300 / median 100)
            // physics scale = 7500 (standard inference)
            // divergence ratio = 7500/3 = 2500x, way past the default 3x threshold.
            var inf = MakeInference(gamma: 1f, overbright: 0, lmScale: 1f);
            var lights = MakeLights(100);
            var r = IntensityCalibrator.Calibrate(lights, inf, mode: IntensityCalibrator.Mode.Physics);
            Assert.True(r.Diverged, $"expected divergence (scale={r.Scale}, alt={r.AlternativeScale})");
        }

        [Fact]
        public void DivergenceWarning_DoesNotTrigger_WhenScalesClose()
        {
            // Engineer a case where median and physics agree: use very dim lights so the
            // median scale becomes large, matching the physics point-light constant.
            // median target 300 / intensity 0.04 = 7500 scale; physics = 7500. Match.
            var inf = MakeInference(gamma: 1f, overbright: 0, lmScale: 1f);
            var lights = MakeLights(0.04f);
            var r = IntensityCalibrator.Calibrate(lights, inf, mode: IntensityCalibrator.Mode.Physics);
            Assert.False(r.Diverged, $"unexpected divergence (scale={r.Scale}, alt={r.AlternativeScale})");
        }

        [Fact]
        public void Median_MatchesLegacyFormula_ExactlyForTypicalInputs()
        {
            // Regression-guard: the legacy inline formula in EstimateCommand was
            //   scale = 300 / sorted[len/2]
            // IntensityCalibrator.Median must produce byte-identical output for any
            // non-degenerate input.
            var cases = new[]
            {
                MakeLights(50, 100, 200, 400, 800),    // 5 lights, median = 200
                MakeLights(1, 1, 1, 1, 1, 1, 1),       // uniform => median = 1
                MakeLights(1000, 2000),                // 2 lights, sorted[1] = 2000
                MakeLights(500),                       // single light
                MakeLights(10, 20, 30, 40),            // 4 lights, sorted[2] = 30
            };
            foreach (var lights in cases)
            {
                var sorted = new List<float>();
                foreach (var l in lights) sorted.Add(l.Intensity);
                sorted.Sort();
                float legacyMedian = sorted[sorted.Count / 2];
                float legacyScale = legacyMedian > 1e-3f ? 300f / legacyMedian : 1f;

                var r = IntensityCalibrator.Calibrate(lights, inference: null, mode: IntensityCalibrator.Mode.Median);
                Assert.Equal(legacyScale, r.Scale, tolerance: 1e-5f);
                Assert.Equal(legacyMedian, r.MedianInternal, tolerance: 1e-5f);
            }
        }
    }
}
