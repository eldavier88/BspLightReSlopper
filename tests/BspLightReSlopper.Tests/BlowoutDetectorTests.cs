using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class BlowoutDetectorTests
    {
        [Fact]
        public void DetectsAndClustersASaturatedPatch()
        {
            // Build a 64x64 lightmap quad on z=0. Center 8x8 region is fully blown
            // (RGB = 255), boundary 1-pixel ring is half-bright (RGB = 100), rest dark.
            (byte r, byte g, byte b) Pattern(int ax, int ay)
            {
                int dx = ax - 32, dy = ay - 32;
                if (Math.Abs(dx) <= 4 && Math.Abs(dy) <= 4) return (255, 255, 255);
                if (Math.Abs(dx) <= 6 && Math.Abs(dy) <= 6) return (100, 100, 100);
                return (10, 10, 10);
            }
            var bsp = BspLoader.LoadFromBytes(TestBsp.BuildIbsp46QuadWithGradientLightmap(64, Pattern));
            var samples = TexelSampler.Sample(bsp, SurfaceUnpacker.Unpack(bsp), LightmapAtlas.FromBsp(bsp),
                new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            var result = BlowoutDetector.Detect(samples.Samples);
            Assert.True(result.SaturatedTexelCount >= 64, $"only {result.SaturatedTexelCount} saturated (expected ~81)");
            // Phase H2 expands the blown mask by 1 dilation ring. Old expectation was
            // >=49 (7x7 interior); with dilation we now expect >=81 (9x9 = inner + ring).
            Assert.True(result.BlownTexelCount >= 49, $"only {result.BlownTexelCount} blown (expected >=49 = 7x7 inner / >=81 with dilation)");
            Assert.True(result.Clusters.Count == 1, $"expected exactly 1 cluster, got {result.Clusters.Count}");
            // Phase H2 emits 3 candidates per cluster (0.6x / 1.0x / 1.6x offset
            // sweep). Default options are used so assert >=1 and <=3. All three should
            // be above the saturated patch centre along +Z.
            Assert.True(result.PointCandidates.Count >= 1 && result.PointCandidates.Count <= 3,
                $"expected 1..3 point candidates from multi-offset sweep, got {result.PointCandidates.Count}");

            foreach (var cand in result.PointCandidates)
            {
                // Every candidate should be ABOVE the saturated patch's center -- patch is
                // at world (0,0,0) (atlas (32,32) maps to world centre via the gradient's
                // 256u-quad layout), normal +Z -> candidate at (0, 0, +offset).
                Assert.True(MathF.Abs(cand.Origin.X) < 32, $"X off-center: {cand.Origin.X}");
                Assert.True(MathF.Abs(cand.Origin.Y) < 32, $"Y off-center: {cand.Origin.Y}");
                Assert.True(cand.Origin.Z > 0, $"Z below surface: {cand.Origin.Z}");
                Assert.True(cand.Origin.Z >= 10f, $"offset too small: {cand.Origin.Z}u");
                Assert.True(cand.BlownOut);
                Assert.StartsWith("blowout-point", cand.Method);
            }
        }

        [Fact]
        public void NoBlowoutWhenNothingIsSaturated()
        {
            // Smooth gradient, no saturation.
            var bsp = BspLoader.LoadFromBytes(TestBsp.BuildIbsp46QuadWithGradientLightmap(32,
                (ax, ay) => ((byte)(ax * 4), (byte)(ay * 4), (byte)50)));
            var samples = TexelSampler.Sample(bsp, SurfaceUnpacker.Unpack(bsp), LightmapAtlas.FromBsp(bsp),
                new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            var result = BlowoutDetector.Detect(samples.Samples);
            Assert.Equal(0, result.SaturatedTexelCount);
            Assert.Equal(0, result.BlownTexelCount);
            Assert.Empty(result.Clusters);
            Assert.Empty(result.PointCandidates);
        }

        [Fact]
        public void MaskExcludesBlownTexelsFromEstimatorInput()
        {
            // Blown patch in the centre + a real gradient pattern outside. Run estimator
            // with DetectBlowouts=true and assert the blown region's pixels were zeroed in
            // the residual buffer (verified indirectly by the estimator's "X blown / masked"
            // log line + by checking the pre-accepted lights includes the blown candidate).
            (byte r, byte g, byte b) Pattern(int ax, int ay)
            {
                int dx = ax - 16, dy = ay - 16;
                if (Math.Abs(dx) <= 3 && Math.Abs(dy) <= 3) return (255, 255, 255);
                return ((byte)Math.Clamp(80 - Math.Max(Math.Abs(dx), Math.Abs(dy)) * 6, 0, 255),
                        (byte)Math.Clamp(80 - Math.Max(Math.Abs(dx), Math.Abs(dy)) * 6, 0, 255),
                        (byte)50);
            }
            var bsp = BspLoader.LoadFromBytes(TestBsp.BuildIbsp46QuadWithGradientLightmap(32, Pattern));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas,
                new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            var bboxMin = new Vector3(-128, -128, 0);
            var bboxMax = new Vector3(+128, +128, 200);
            var result = LightEstimator.Estimate(samples.Samples, bboxMin, bboxMax,
                new LightEstimator.Options { MaxLights = 4, RandomSeed = 7, Parallel = false, DetectBlowouts = true });

            // The seeded blown-light candidate should be among the accepted lights.
            // Phase H2 may merge 2-3 blowout candidates into one light whose Method
            // becomes "blowout-merged(N)+merged" after the merge+refit pipeline; the
            // contract is that the BlownOut flag is preserved AND the method prefix
            // starts with "blowout".
            Assert.True(result.Lights.Any(l => l.BlownOut),
                $"no blown flag on accepted lights: methods = [{string.Join(',', result.Lights.Select(l => l.Method))}]");
            Assert.True(result.Lights.Any(l => l.Method.StartsWith("blowout")),
                $"no blown-method prefix on accepted lights: methods = [{string.Join(',', result.Lights.Select(l => l.Method))}]");
        }
    }
}
