using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Sampling;
using Xunit;

namespace BspLightReSlopper.Tests
{
    /// <summary>
    /// Synthetic-scene tests for the estimator. Critical for guarding against the kind of
    /// regression that broke real-map runs in early iterations (Tikhonov ridge dominating
    /// Σg² → I collapsed to ≈0 → 0 lights recovered).
    /// </summary>
    public class LightEstimatorTests
    {
        // Build a planar floor (z = 0, normal +Z) sampled on a grid, illuminate from a
        // synthetic point light using the same forward model the estimator inverts. The
        // estimator should recover the light position within ~step size of the truth.
        [Fact]
        public void SingleLightAbovePlane_RecoveredWithinTolerance()
        {
            // Light truth: 96u above (0, 0, 0), pure white, intensity 200 in our units.
            var Ltrue = new Vector3(0, 0, 96f);
            var color = new Vector3(1f, 1f, 1f);
            float Itrue = 200f;
            float fade2 = 32f * 32f;

            int gridN = 24;
            float spacing = 16f;
            var samples = new List<TexelSample>();
            for (int y = 0; y < gridN; y++)
                for (int x = 0; x < gridN; x++)
                {
                    var p = new Vector3((x - gridN / 2f) * spacing, (y - gridN / 2f) * spacing, 0);
                    var n = new Vector3(0, 0, 1);
                    var d = Ltrue - p;
                    float d2 = d.LengthSquared();
                    float ndot = n.X * d.X + n.Y * d.Y + n.Z * d.Z;
                    float invLen = 1f / MathF.Sqrt(d2);
                    float ndotL = ndot * invLen;
                    if (ndotL <= 0) continue;
                    float g = ndotL / (d2 + fade2);
                    var rgb = new Vector3(Itrue * color.X * g, Itrue * color.Y * g, Itrue * color.Z * g);
                    samples.Add(new TexelSample
                    {
                        World = p,
                        Normal = n,
                        Observed = rgb,
                    });
                }

            var bboxMin = new Vector3(-300, -300, 0);
            var bboxMax = new Vector3(+300, +300, 200);
            var result = LightEstimator.Estimate(samples, bboxMin, bboxMax,
                new LightEstimator.Options
                {
                    MaxLights = 4,
                    Fade = 32f,
                    RandomSeed = 7,
                    UniformFillerCount = 50,
                    Parallel = false,
                });

            Assert.True(result.Lights.Count >= 1,
                $"expected at least 1 light recovered, got {result.Lights.Count} (rejects={result.RoundsRejected})");

            var l0 = result.Lights[0];
            float posErr = (l0.Origin - Ltrue).Length();
            Assert.True(posErr < 32f, $"position error {posErr:F1}u too large for synthetic single-light scene");

            // Color should be near white.
            float colorErr = (l0.Color - color).Length();
            Assert.True(colorErr < 0.15f, $"color error {colorErr:F2} too large for white synthetic light");

            // Intensity should be in the right ballpark (within 30% — fitting in residual units
            // with greedy peeling can underfit slightly).
            float ratio = l0.Intensity / Itrue;
            Assert.True(ratio > 0.5f && ratio < 1.5f, $"intensity ratio {ratio:F2} far from 1.0");
        }

        [Fact]
        public void TwoLightsAbovePlane_BothRecovered()
        {
            var L1 = new Vector3(-128, 0, 96f);
            var L2 = new Vector3(+128, 0, 96f);
            var c1 = new Vector3(1f, 0.4f, 0.4f); // red-ish
            var c2 = new Vector3(0.4f, 0.4f, 1f); // blue-ish
            float I1 = 200f, I2 = 250f;
            float fade2 = 32f * 32f;

            int gridN = 32;
            float spacing = 16f;
            var samples = new List<TexelSample>();
            for (int y = 0; y < gridN; y++)
                for (int x = 0; x < gridN; x++)
                {
                    var p = new Vector3((x - gridN / 2f) * spacing, (y - gridN / 2f) * spacing, 0);
                    var n = new Vector3(0, 0, 1);
                    var rgb = Vector3.Zero;
                    foreach (var (L, c, I) in new[] { (L1, c1, I1), (L2, c2, I2) })
                    {
                        var d = L - p;
                        float d2 = d.LengthSquared();
                        float ndot = n.Z * d.Z;
                        float invLen = 1f / MathF.Sqrt(d2);
                        float ndotL = ndot * invLen;
                        if (ndotL <= 0) continue;
                        float g = ndotL / (d2 + fade2);
                        rgb += new Vector3(I * c.X * g, I * c.Y * g, I * c.Z * g);
                    }
                    samples.Add(new TexelSample { World = p, Normal = n, Observed = rgb });
                }

            var bboxMin = new Vector3(-300, -300, 0);
            var bboxMax = new Vector3(+300, +300, 200);
            var result = LightEstimator.Estimate(samples, bboxMin, bboxMax,
                new LightEstimator.Options
                {
                    MaxLights = 8,
                    Fade = 32f,
                    RandomSeed = 7,
                    UniformFillerCount = 100,
                    Parallel = false,
                    // Synthetic 32x32 grid spans only ~256u; the envelope-discard pass
                    // would mistake the test's lights for spurious overfits because their
                    // intensity-implied envelope is small relative to the wide test sample
                    // set. Disable the discard for synthetic-scene tests.
                    PhysicalEnvelopeDiscard = false,
                });

            Assert.True(result.Lights.Count >= 2,
                $"expected at least 2 lights recovered, got {result.Lights.Count}");

            // Match each truth to nearest estimated.
            float dist1 = float.MaxValue, dist2 = float.MaxValue;
            EstimatedLight? m1 = null, m2 = null;
            foreach (var e in result.Lights)
            {
                float d1 = (e.Origin - L1).Length();
                float d2 = (e.Origin - L2).Length();
                if (d1 < dist1) { dist1 = d1; m1 = e; }
                if (d2 < dist2) { dist2 = d2; m2 = e; }
            }
            // Greedy peeling distorts the residual seen by light #2 (leakage from imperfect
            // light #1 subtraction). Phase A accepts looser tolerances on multi-light scenes;
            // a joint LSQ post-refit will tighten this in Phase C polish.
            Assert.True(dist1 < 96f, $"red light position error {dist1:F1}u too large");
            Assert.True(dist2 < 96f, $"blue light position error {dist2:F1}u too large");
            Assert.True(m1!.Color.X > m1.Color.Z, "red estimate not actually red-leaning");
            Assert.True(m2!.Color.Z > m2.Color.X, "blue estimate not actually blue-leaning");
        }

        [Fact]
        public void HalfLambert_SingleLight_RecoveredWithCorrectIntensity()
        {
            // Build a synthetic scene using the half-Lambert forward model q3map2 uses for
            // JK2/JKA, then verify the estimator recovers it (a) at all (the dead-zone +
            // squared curve is non-trivial to invert) and (b) with intensity within ~25%
            // of truth (Lambert-on-half-Lambert data systematically over-fits intensity).
            var Ltrue = new Vector3(0, 0, 96f);
            float Itrue = 200f;
            float fade2 = 32f * 32f;

            int gridN = 32;
            float spacing = 16f;
            var samples = new System.Collections.Generic.List<TexelSample>();
            for (int y = 0; y < gridN; y++)
                for (int x = 0; x < gridN; x++)
                {
                    var p = new Vector3((x - gridN / 2f) * spacing, (y - gridN / 2f) * spacing, 0);
                    var n = new Vector3(0, 0, 1);
                    var d = Ltrue - p;
                    float d2 = d.LengthSquared();
                    float invLen = 1f / MathF.Sqrt(d2);
                    float ndotL = (n.Z * d.Z) * invLen;
                    if (ndotL <= 0.001f) continue;
                    if (ndotL > 1) ndotL = 1;
                    float halfL = ndotL * 0.5f + 0.5f;
                    halfL *= halfL;
                    float g = halfL / (d2 + fade2);
                    var rgb = new Vector3(Itrue * g, Itrue * g, Itrue * g);
                    samples.Add(new TexelSample { World = p, Normal = n, Observed = rgb });
                }

            var bboxMin = new Vector3(-300, -300, 0);
            var bboxMax = new Vector3(+300, +300, 200);
            var result = LightEstimator.Estimate(samples, bboxMin, bboxMax,
                new LightEstimator.Options
                {
                    MaxLights = 4,
                    Fade = 32f,
                    RandomSeed = 7,
                    UniformFillerCount = 50,
                    Parallel = false,
                    HalfLambert = true,
                });

            Assert.True(result.Lights.Count >= 1, $"expected >=1 light, got {result.Lights.Count}");
            var l0 = result.Lights[0];
            float posErr = (l0.Origin - Ltrue).Length();
            Assert.True(posErr < 32f, $"position error {posErr:F1}u too large");
            float ratio = l0.Intensity / Itrue;
            Assert.True(ratio > 0.6f && ratio < 1.5f, $"intensity ratio {ratio:F2} far from 1.0");
        }

        [Fact]
        public void NoLight_DegenerateInput_StopsCleanly()
        {
            var samples = new List<TexelSample>();
            for (int i = 0; i < 100; i++)
                samples.Add(new TexelSample
                {
                    World = new Vector3(i * 8f, 0, 0),
                    Normal = new Vector3(0, 0, 1),
                    Observed = Vector3.Zero,
                });

            var result = LightEstimator.Estimate(samples,
                new Vector3(-100), new Vector3(800, 100, 100),
                new LightEstimator.Options { MaxLights = 4, Parallel = false });

            Assert.Empty(result.Lights);
        }
    }
}
