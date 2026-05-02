using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Metrics;
using BspLightReSlopper.Sampling;
using Xunit;

namespace BspLightReSlopper.Tests
{
    /// <summary>
    /// Phase H4 — unit tests for <see cref="RecompileRefiner"/>. We only test the pieces
    /// that don't require actually running q3map2 (the pair-matcher + the no-recompile
    /// fallback that runs photometric-refine only). End-to-end tests are skippable-real-map
    /// (gated on q3map2 availability).
    /// </summary>
    public class RecompileRefinerTests
    {
        private static TexelSample Make(Vector3 world, Vector3 normal, Vector3 observed, int si = 0, int atlas = 0, int ax = 0, int ay = 0)
        {
            return new TexelSample
            {
                SurfaceIndex = si,
                ShaderIndex = 0,
                Stage = 0,
                World = world,
                Normal = normal,
                Observed = observed,
                AtlasIndex = atlas,
                AtlasX = ax,
                AtlasY = ay,
                LightmapStyle = 0,
                Cluster = -1,
            };
        }

        [Fact]
        public void BuildPairs_NearestNeighbour_NormalAware()
        {
            // Reference samples at (0,0,0), (8,0,0), (0,8,0) all with normal +Z.
            var refS = new List<TexelSample>
            {
                Make(new Vector3(0, 0, 0), Vector3.UnitZ, new Vector3(0.5f, 0.5f, 0.5f), ax: 0),
                Make(new Vector3(8, 0, 0), Vector3.UnitZ, new Vector3(0.5f, 0.5f, 0.5f), ax: 1),
                Make(new Vector3(0, 8, 0), Vector3.UnitZ, new Vector3(0.5f, 0.5f, 0.5f), ax: 2),
            };
            // Candidate samples: slightly offset copies of the first two; a third with
            // an OPPOSING normal (should NOT match).
            var candS = new List<TexelSample>
            {
                Make(new Vector3(1, 1, 0), Vector3.UnitZ, new Vector3(0.3f, 0.3f, 0.3f)),
                Make(new Vector3(7, 1, 0), Vector3.UnitZ, new Vector3(0.3f, 0.3f, 0.3f)),
                Make(new Vector3(0, 0, 0), -Vector3.UnitZ, new Vector3(0.5f, 0.5f, 0.5f)),
            };

            var pairs = RecompileRefiner.BuildPairs(refS, candS, null, maxPairDistance: 32f);
            Assert.Equal(2, pairs.Count); // 3rd cand is dropped (normal opposes)
            // Residual = ref - cand = 0.2 each channel.
            foreach (var p in pairs)
            {
                Assert.InRange(p.Residual.X, 0.15f, 0.25f);
                Assert.InRange(p.Residual.Y, 0.15f, 0.25f);
                Assert.InRange(p.Residual.Z, 0.15f, 0.25f);
            }
        }

        [Fact]
        public void BuildPairs_ExcludesBlownReferenceSamples()
        {
            var refS = new List<TexelSample>
            {
                Make(new Vector3(0, 0, 0), Vector3.UnitZ, new Vector3(1, 1, 1)),
                Make(new Vector3(8, 0, 0), Vector3.UnitZ, new Vector3(0.5f, 0.5f, 0.5f)),
            };
            var candS = new List<TexelSample>
            {
                Make(new Vector3(0, 0, 0), Vector3.UnitZ, new Vector3(0.2f, 0.2f, 0.2f)),
            };
            bool[] blown = { true, false };
            // Nearest ref to cand[0] is idx 0 (blown) — should skip and fall through to
            // idx 1 if within max distance. idx 1 is 8u away so the pair is at idx 1.
            var pairs = RecompileRefiner.BuildPairs(refS, candS, blown, maxPairDistance: 32f);
            Assert.Single(pairs);
            Assert.Equal(1, pairs[0].RefIndex);
        }

        [Fact]
        public void NoRecompile_FallbackRunsPhotometricRefine()
        {
            // Build a tiny light-and-texel scene: a +Z floor with 2 samples, a single
            // light roughly overhead. With Wrapper==null, Refine should fall through to
            // the photometric polish path and at least not degrade the SSE.
            var ref0 = Make(new Vector3(-32, 0, 0), Vector3.UnitZ, new Vector3(0.4f, 0.4f, 0.4f), ax: 0);
            var ref1 = Make(new Vector3(+32, 0, 0), Vector3.UnitZ, new Vector3(0.4f, 0.4f, 0.4f), ax: 1);
            var refS = new List<TexelSample> { ref0, ref1 };

            var light = new EstimatedLight
            {
                Origin = new Vector3(0, 0, 48),
                Color = Vector3.One,
                Intensity = 100f,
                Method = "test",
            };

            var opts = new RecompileRefiner.Options
            {
                ReferenceMapPath = null,  // forces no-recompile path
                WorkDir = Path.Combine(Path.GetTempPath(), "bsplrs-test-norc-" + Guid.NewGuid().ToString("N")),
                Wrapper = null,
                MaxIterations = 1,
                HalfLambert = false,
                Fade = 32f,
                FinishWithPhotometricRefine = true,
            };
            var r = RecompileRefiner.Refine(refS, new[] { light }, null, Vector3.Zero, Vector3.Zero, opts);
            Assert.Single(r.Lights);
            Assert.True(r.FinalMse <= r.InitialMse + 1e-6f,
                $"photometric fallback should not make things worse: initial={r.InitialMse}, final={r.FinalMse}");
        }
    }
}
