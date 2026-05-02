using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Sampling;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class GeometricTriangulatorTests
    {
        // Build samples on three orthogonal walls of a synthetic "corner" room. Place the
        // brightest texel on each wall such that the surface-normal rays from those peaks all
        // meet at a known point. The triangulator must recover that point.
        [Fact]
        public void ThreeOrthogonalSurfaces_RaysIntersectAtTrueLight()
        {
            var trueLight = new Vector3(100, 80, 50);

            // Helper: build a small grid of samples on a plane with origin O, basis (uVec, vVec)
            // and normal n. The brightest texel is at the foot of perpendicular from trueLight.
            List<TexelSample> WallSamples(Vector3 origin, Vector3 uVec, Vector3 vVec, Vector3 n,
                int gridU, int gridV, float spacing, int surfIdx)
            {
                var list = new List<TexelSample>();
                Vector3 fromLight = trueLight - origin;
                float footU = Vector3.Dot(fromLight, Vector3.Normalize(uVec));
                float footV = Vector3.Dot(fromLight, Vector3.Normalize(vVec));
                int peakUI = (int)(footU / spacing);
                int peakVI = (int)(footV / spacing);
                for (int v = 0; v < gridV; v++)
                {
                    for (int u = 0; u < gridU; u++)
                    {
                        Vector3 p = origin + uVec * (u * spacing) + vVec * (v * spacing);
                        float dist = (u - peakUI) * (u - peakUI) + (v - peakVI) * (v - peakVI);
                        // Brightness peaks at the foot, falls off radially.
                        float brightness = MathF.Max(0.05f, 0.6f * MathF.Exp(-dist / 4f));
                        list.Add(new TexelSample
                        {
                            SurfaceIndex = surfIdx,
                            Stage = 0,
                            World = p,
                            Normal = n,
                            Observed = new Vector3(brightness, brightness, brightness),
                            AtlasIndex = surfIdx,
                            AtlasX = u,
                            AtlasY = v,
                        });
                    }
                }
                return list;
            }

            var allSamples = new List<TexelSample>();
            // Floor at z=0, normal +Z, basis (X, Y)
            allSamples.AddRange(WallSamples(new Vector3(0, 0, 0), Vector3.UnitX, Vector3.UnitY, Vector3.UnitZ, 12, 12, 16f, 1));
            // Wall at y=0, normal +Y, basis (X, Z)
            allSamples.AddRange(WallSamples(new Vector3(0, 0, 0), Vector3.UnitX, Vector3.UnitZ, Vector3.UnitY, 12, 12, 16f, 2));
            // Wall at x=0, normal +X, basis (Y, Z)
            allSamples.AddRange(WallSamples(new Vector3(0, 0, 0), Vector3.UnitY, Vector3.UnitZ, Vector3.UnitX, 12, 12, 16f, 3));

            var result = GeometricTriangulator.Triangulate(allSamples,
                new GeometricTriangulator.Options { MinClusterSupport = 1, RayApproachThreshold = 24f });

            Assert.True(result.Seeds.Count >= 1, $"no seeds emitted (peaks={result.PeaksFound}, pairs={result.RayPairsConsidered}, intersected={result.RayPairsIntersected})");
            // The cluster centre must be within 16u of the true light.
            float bestErr = result.Seeds.Min(s => (s.Position - trueLight).Length());
            Assert.True(bestErr < 16f, $"closest seed {bestErr:F1}u from true light (true={trueLight}, seeds=[{string.Join("; ", result.Seeds.Select(s => $"{s.Position}@{s.Support}"))}])");
        }

        [Fact]
        public void ParallelSurfacesProduceNoSpuriousIntersections()
        {
            // Two parallel floors with brightness peaks NOT pointing at each other -- a
            // single light somewhere above should NOT be triangulated from these alone
            // (parallel rays don't intersect anywhere meaningful). Verify the triangulator
            // doesn't invent a phantom seed.
            var samples = new List<TexelSample>();
            for (int v = 0; v < 8; v++)
            {
                for (int u = 0; u < 8; u++)
                {
                    samples.Add(new TexelSample
                    {
                        SurfaceIndex = 1,
                        World = new Vector3(u * 16, v * 16, 0),
                        Normal = Vector3.UnitZ,
                        Observed = new Vector3(u == 4 && v == 4 ? 0.8f : 0.1f),
                        AtlasIndex = 0, AtlasX = u, AtlasY = v,
                    });
                    samples.Add(new TexelSample
                    {
                        SurfaceIndex = 2,
                        World = new Vector3(u * 16, v * 16, 256),
                        Normal = Vector3.UnitZ, // ALSO +Z, so parallel
                        Observed = new Vector3(u == 4 && v == 4 ? 0.8f : 0.1f),
                        AtlasIndex = 0, AtlasX = u, AtlasY = v + 100,
                    });
                }
            }
            var result = GeometricTriangulator.Triangulate(samples);
            // Parallel rays should not produce any seeds.
            Assert.Empty(result.Seeds);
        }

        [Fact]
        public void RayRayClosestApproach_BasicCases()
        {
            // Two crossing rays: r1 starts at origin pointing +X, r2 starts at (10,0,0)
            // pointing +Y. They actually meet at (10, 0, 0).
            bool ok = GeometricTriangulator.TryRayRayClosestApproach(
                Vector3.Zero, Vector3.UnitX,
                new Vector3(10, 0, 0), Vector3.UnitY,
                out float tA, out float tB, out Vector3 mid, out float dist);
            Assert.True(ok);
            Assert.True(MathF.Abs(tA - 10f) < 0.01f);
            Assert.True(MathF.Abs(tB - 0f) < 0.01f);
            Assert.True(dist < 0.01f);
            Assert.True((mid - new Vector3(10, 0, 0)).Length() < 0.01f);

            // Skew rays: r1 at origin +X, r2 at (5, 0, 5) +Y. Closest approach at (5,0,0)
            // (on r1) and (5,0,5) (on r2); midpoint (5,0,2.5), distance 5.
            ok = GeometricTriangulator.TryRayRayClosestApproach(
                Vector3.Zero, Vector3.UnitX,
                new Vector3(5, 0, 5), Vector3.UnitY,
                out tA, out tB, out mid, out dist);
            Assert.True(ok);
            Assert.True(MathF.Abs(tA - 5f) < 0.01f);
            Assert.True(MathF.Abs(tB - 0f) < 0.01f);
            Assert.True(MathF.Abs(dist - 5f) < 0.01f);

            // Parallel rays: should return false.
            ok = GeometricTriangulator.TryRayRayClosestApproach(
                Vector3.Zero, Vector3.UnitX,
                new Vector3(0, 5, 0), Vector3.UnitX,
                out _, out _, out _, out _);
            Assert.False(ok);
        }
    }
}
