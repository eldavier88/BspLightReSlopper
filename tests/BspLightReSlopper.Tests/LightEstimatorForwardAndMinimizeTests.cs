using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Sampling;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public sealed class LightEstimatorForwardAndMinimizeTests
    {
        [Fact]
        public void ForwardRgbSSE_DimmestRemovableUnderTolerance()
        {
            // Single surface sample; two stacked lights — second is redundant for a greedy minimize pass.
            var L0 = new Vector3(0, 0, 256);
            var samples = new List<TexelSample>
            {
                new TexelSample
                {
                    World = Vector3.Zero,
                    Normal = Vector3.UnitZ,
                    Observed = new Vector3(0.5f, 0.5f, 0.5f),
                },
            };
            var lights = new List<EstimatedLight>
            {
                new EstimatedLight { Origin = L0, Color = Vector3.One, Intensity = 80000f },
                new EstimatedLight { Origin = L0 + new Vector3(1, 0, 0), Color = Vector3.One, Intensity = 1f },
            };
            float sse0 = LightEstimator.ForwardRgbSSE(samples, lights, halfLambert: false);
            var min = LightEstimator.MinimizeLightCountGreedy(lights, samples, false, 32f, relativeSseIncreaseTolerance: 0.5f);
            Assert.True(min.Count < lights.Count || LightEstimator.ForwardRgbSSE(samples, min, false) <= sse0 * 1.01f);
        }
    }
}
