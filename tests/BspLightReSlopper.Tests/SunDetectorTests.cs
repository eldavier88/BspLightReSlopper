using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Sampling;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class SunDetectorTests
    {
        // Build a synthetic outdoor scene: many up-facing surfaces uniformly bright (sun),
        // plus a sprinkle of mostly-dark side-facing surfaces with VARIED normals. The
        // varied normals populate many bins so the median is a low number; the bright
        // up-facing bin must dominate by a clear margin. Sun direction must be -Z (sun
        // overhead), and the dominant bin must be the +Z one.
        [Fact]
        public void DetectsOverheadSunFromUniformlyBrightFloors()
        {
            var samples = new List<TexelSample>();
            // 1500 +Z-facing samples uniformly bright (lit by sun).
            var rng = new Random(0);
            for (int i = 0; i < 1500; i++)
            {
                samples.Add(new TexelSample
                {
                    World = new Vector3((float)rng.NextDouble() * 1024, (float)rng.NextDouble() * 1024, 0),
                    Normal = Vector3.UnitZ,
                    Observed = new Vector3(0.55f, 0.55f, 0.50f), // warm-ish
                });
            }
            // ~600 dim samples spread across many side directions (varied normals -> many
            // populated bins -> low median bin score).
            for (int i = 0; i < 600; i++)
            {
                float ang = (float)(rng.NextDouble() * 2 * Math.PI);
                float pitch = (float)(rng.NextDouble() * Math.PI - Math.PI / 2);
                if (Math.Abs(Math.Sin(pitch)) > 0.7) continue; // skip near-vertical
                samples.Add(new TexelSample
                {
                    World = new Vector3((float)rng.NextDouble() * 1024, (float)rng.NextDouble() * 1024, (float)rng.NextDouble() * 256),
                    Normal = Vector3.Normalize(new Vector3((float)Math.Cos(ang) * (float)Math.Cos(pitch), (float)Math.Sin(ang) * (float)Math.Cos(pitch), (float)Math.Sin(pitch))),
                    Observed = new Vector3(0.04f, 0.04f, 0.04f),
                });
            }

            var result = SunDetector.Detect(samples,
                options: new SunDetector.Options { MinSamples = 100, DominanceMultiplier = 5f });
            Assert.NotNull(result.DetectedSun);
            var sun = result.DetectedSun!;
            // Sun direction should be -Z (downward; sun overhead).
            Assert.True(MathF.Abs(sun.Direction.Z + 1f) < 0.3f, $"sun direction Z={sun.Direction.Z:F2}, expected ~-1");
            // Pitch should be near +90 degrees (downward).
            Assert.True(sun.Pitch > 60f, $"pitch={sun.Pitch:F1}, expected >60");
            // Color should be warm-ish (R == G > B).
            Assert.True(sun.Color.X >= sun.Color.Z * 0.9f, $"sun color {sun.Color} not warm-ish");
        }

        [Fact]
        public void DoesNotDetectSunWhenScenIsUniformlyDimWithoutDominantBin()
        {
            var samples = new List<TexelSample>();
            var rng = new Random(0);
            // Many bins, all roughly equally bright -> no dominant sun.
            foreach (var n in new[] { Vector3.UnitX, -Vector3.UnitX, Vector3.UnitY, -Vector3.UnitY, Vector3.UnitZ, -Vector3.UnitZ })
            {
                for (int i = 0; i < 300; i++)
                {
                    samples.Add(new TexelSample
                    {
                        World = new Vector3(0, 0, 0),
                        Normal = Vector3.Normalize(n + new Vector3((float)rng.NextDouble() * 0.05f, 0, 0)),
                        Observed = new Vector3(0.1f, 0.1f, 0.1f),
                    });
                }
            }
            var result = SunDetector.Detect(samples,
                options: new SunDetector.Options { MinSamples = 100, DominanceMultiplier = 5f, MinSunLuma = 0.20f });
            Assert.Null(result.DetectedSun);
        }
    }
}
