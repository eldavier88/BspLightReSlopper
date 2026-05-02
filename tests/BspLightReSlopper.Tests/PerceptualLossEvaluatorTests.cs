using BspLightReSlopper.Metrics;
using BspLightReSlopper.Sampling;
using System.Collections.Generic;
using System.Numerics;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public sealed class PerceptualLossEvaluatorTests
    {
        [Fact]
        public void IdenticalSampleLists_ZeroLoss()
        {
            var samples = new List<TexelSample>
            {
                new TexelSample
                {
                    World = new Vector3(100, 200, 50),
                    Normal = Vector3.UnitZ,
                    Observed = new Vector3(0.2f, 0.3f, 0.4f),
                },
            };
            var loss = PerceptualLossEvaluator.Evaluate(samples, samples, new PerceptualLossEvaluator.Options { CellSize = 32f });
            Assert.True(loss.MeanSquaredRgb < 1e-8f);
            Assert.Equal(1, loss.PairsUsed);
        }

        [Fact]
        public void OffsetRgb_IncreasesMse()
        {
            var a = new TexelSample { World = Vector3.Zero, Normal = Vector3.UnitZ, Observed = Vector3.One * 0.5f };
            var b = new TexelSample { World = Vector3.Zero, Normal = Vector3.UnitZ, Observed = Vector3.One * 0.4f };
            var loss = PerceptualLossEvaluator.Evaluate(
                new[] { a },
                new[] { b },
                new PerceptualLossEvaluator.Options { CellSize = 64f, MaxPairDistance = 32f });
            Assert.True(loss.MeanSquaredRgb > 0.001f);
        }
    }
}
