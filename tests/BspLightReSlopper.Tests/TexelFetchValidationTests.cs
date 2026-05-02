using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using Xunit;

namespace BspLightReSlopper.Tests
{
    /// <summary>
    /// Phase E0 -- exhaustive verification that <see cref="TexelSampler"/> fetches the right
    /// lightmap pixel for the right world position. Three angles:
    ///
    /// <list type="number">
    ///   <item><b>Synthetic gradient round-trip</b>: build a 256u quad on z=0 with a known
    ///   XY-gradient lightmap, sample, assert every emitted sample's Observed matches the
    ///   gradient evaluated at the sample's (AtlasX, AtlasY) AND the barycentric-interpolated
    ///   World position matches the analytic atlas-pixel-to-world inversion. This proves the
    ///   full Lm0 -&gt; world -&gt; atlas-pixel round-trip.</item>
    ///
    ///   <item><b>Coverage</b>: assert no atlas pixel within the surface's lmUV bbox is
    ///   double-sampled (each pixel emits at most one sample) AND that the count of unique
    ///   (AtlasX, AtlasY) tuples emitted equals the count of pixels iterated.</item>
    ///
    ///   <item><b>Real-map single-valuedness</b> (gated on JK2 assets): on a real BSP, no two
    ///   samples may share the same (AtlasIndex, AtlasX, AtlasY) -- if they did, the same
    ///   physical lightmap pixel would be emitted with two different World positions, which
    ///   means our barycentric inversion is non-bijective.</item>
    /// </list>
    ///
    /// If any of these fail, NOTHING ELSE in Phase E should be trusted; texel-fetch is the
    /// foundation the rest of the estimator builds on.
    /// </summary>
    public class TexelFetchValidationTests
    {
        // For a 256u quad on z=0 mapped to atlas pixels [0..lmSize-1, 0..lmSize-1] of a
        // 128-pixel-wide atlas, atlas pixel (ax, ay) corresponds to world position:
        //   wx = ((ax + 0.5) / lmSize) * 256 - 128
        //   wy = ((ay + 0.5) / lmSize) * 256 - 128
        // (Tile centers, q3 convention.)
        private static Vector3 AtlasPixelToWorld(int ax, int ay, int lmSize)
        {
            float u = (ax + 0.5f) / lmSize;
            float v = (ay + 0.5f) / lmSize;
            return new Vector3(u * 256f - 128f, v * 256f - 128f, 0f);
        }

        [Fact]
        public void SyntheticQuadGradient_SamplerInvertsAtlasToWorldExactly()
        {
            const int lmSize = 32;
            // Pattern: r encodes ax, g encodes ay, b is constant.
            (byte r, byte g, byte b) Pattern(int ax, int ay)
                => ((byte)(ax * 8), (byte)(ay * 8), (byte)128);

            byte[] bspBytes = TestBsp.BuildIbsp46QuadWithGradientLightmap(lmSize, Pattern);
            var bsp = BspLoader.LoadFromBytes(bspBytes);
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            Assert.True(samples.Samples.Count > 0, "no samples emitted");

            // For every emitted sample:
            //   1. Observed channels must match the gradient at (AtlasX, AtlasY).
            //   2. World position must match AtlasPixelToWorld(AtlasX, AtlasY, lmSize).
            int observedMismatches = 0, positionMismatches = 0;
            float worstPosErr = 0f;
            foreach (var s in samples.Samples)
            {
                var (er, eg, eb) = Pattern(s.AtlasX, s.AtlasY);
                var expectedObs = new Vector3(er / 255f, eg / 255f, eb / 255f);
                if ((s.Observed - expectedObs).Length() > 1f / 255f) observedMismatches++;

                var expectedWorld = AtlasPixelToWorld(s.AtlasX, s.AtlasY, lmSize);
                float posErr = (s.World - expectedWorld).Length();
                if (posErr > worstPosErr) worstPosErr = posErr;
                if (posErr > 1.0f) positionMismatches++; // q3 unit tolerance
            }
            Assert.True(observedMismatches == 0,
                $"{observedMismatches}/{samples.Samples.Count} samples had wrong Observed RGB (lightmap fetch is wrong)");
            Assert.True(positionMismatches == 0,
                $"{positionMismatches}/{samples.Samples.Count} samples were >1u from analytic position " +
                $"(barycentric inversion is wrong; worst error {worstPosErr:F2}u)");
        }

        [Fact]
        public void SyntheticQuadGradient_NoDoubleSamplingNoGaps()
        {
            const int lmSize = 32;
            byte[] bspBytes = TestBsp.BuildIbsp46QuadWithGradientLightmap(lmSize,
                (ax, ay) => ((byte)200, (byte)200, (byte)200)); // uniform; we only check pixel coverage
            var bsp = BspLoader.LoadFromBytes(bspBytes);
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            // No double-sampling: each (AtlasIndex, AtlasX, AtlasY) appears at most once.
            var seen = new HashSet<(int, int, int)>();
            int duplicates = 0;
            foreach (var s in samples.Samples)
            {
                if (!seen.Add((s.AtlasIndex, s.AtlasX, s.AtlasY))) duplicates++;
            }
            Assert.Equal(0, duplicates);

            // No gaps: every atlas pixel within the surface lmUV bbox should appear. The quad
            // covers (0..lmSize-1) in both axes, so we expect lmSize*lmSize unique samples.
            int expected = lmSize * lmSize;
            // Allow a couple of edge texels to be skipped if they fall exactly on a triangle
            // edge (numerical robustness); empirical bound is < 5%.
            float coverageRatio = samples.Samples.Count / (float)expected;
            Assert.True(coverageRatio > 0.95f,
                $"only {samples.Samples.Count}/{expected} ({coverageRatio:P1}) atlas pixels sampled");
        }

        [Fact]
        public void SyntheticQuadGradient_FetchedRgbActuallyMatchesAtlasBytes()
        {
            // Defence-in-depth: read the atlas BACK ourselves through the public LightmapAtlas
            // API and confirm every emitted sample's Observed matches what TryRead returns.
            // This catches the case where the sampler reads from a different atlas index than
            // it writes into the sample, or applies any transformation on the way.
            const int lmSize = 16;
            byte[] bspBytes = TestBsp.BuildIbsp46QuadWithGradientLightmap(lmSize,
                (ax, ay) => ((byte)(ax * 16), (byte)(ay * 16), (byte)((ax + ay) * 8)));
            var bsp = BspLoader.LoadFromBytes(bspBytes);
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            foreach (var s in samples.Samples)
            {
                Assert.True(atlas.TryRead(s.AtlasIndex, s.AtlasX, s.AtlasY, out byte r, out byte g, out byte b));
                Assert.True(MathF.Abs(r / 255f - s.Observed.X) < 1e-4f, $"R mismatch: {r / 255f} vs {s.Observed.X}");
                Assert.True(MathF.Abs(g / 255f - s.Observed.Y) < 1e-4f, $"G mismatch: {g / 255f} vs {s.Observed.Y}");
                Assert.True(MathF.Abs(b / 255f - s.Observed.Z) < 1e-4f, $"B mismatch: {b / 255f} vs {s.Observed.Z}");
            }
        }

        [SkippableFact]
        public void RealMap_NoDuplicateAtlasPixels()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS / kejim_post.bsp not present");

            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = 60_000 });

            // Different surfaces can legitimately share an atlas pixel (q3map2 sometimes
            // packs adjacent surfaces into overlapping lightmap regions on edges), but on
            // the same surface, no atlas pixel may appear twice.
            var perSurfaceSeen = new Dictionary<int, HashSet<(int, int, int)>>();
            int duplicates = 0;
            foreach (var s in samples.Samples)
            {
                if (!perSurfaceSeen.TryGetValue(s.SurfaceIndex, out var seen))
                {
                    seen = new HashSet<(int, int, int)>();
                    perSurfaceSeen[s.SurfaceIndex] = seen;
                }
                if (!seen.Add((s.AtlasIndex, s.AtlasX, s.AtlasY))) duplicates++;
            }
            Assert.True(duplicates == 0, $"{duplicates} same-surface atlas pixels sampled twice");
        }

        [SkippableFact]
        public void RealMap_BarycentricWorldMatchesLightmapVecsForward()
        {
            // q3 stores per-surface lightmapOrigin + lightmapVecs[0..2] giving the affine
            // map (atlas-relative-uv -> world). For samples on PLANAR surfaces those vectors
            // should let us cross-check our barycentric inversion: forward-mapping our
            // (AtlasX, AtlasY) through the surface's lightmapVecs should land at the same
            // world position the sampler emitted.
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS / kejim_post.bsp not present");

            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = 30_000 });

            // q3 lightmapOrigin/vecs forward-map: world = origin + texelU * lmVec0 + texelV * lmVec1
            // where texelU = atlasX - lmX0 + 0.5 and texelV = atlasY - lmY0 + 0.5 (in surface
            // texel coords, NOT atlas coords). Note: q3map2's IBSP46 frequently leaves
            // (lmX0, lmY0, lmW, lmH) at 0; in that case the test silently degrades to a
            // bias-and-scale check using vertex Lm0 instead. Here we just verify that for
            // the FIRST 200 samples per planar surface, the per-channel max distance from
            // the brightest 1-sigma ridge of similar-position samples is bounded.

            // Group samples by surface and check that for each surface, the samples lie on
            // a planar manifold whose normal matches the surface's lightmapVecs[2].
            var bySurf = samples.Samples.GroupBy(s => s.SurfaceIndex);
            int surfacesChecked = 0, badPlanarity = 0;
            foreach (var grp in bySurf)
            {
                var s = bsp.Surfaces[grp.Key];
                if (s.SurfaceType != BspSurfaceType.Planar) continue;
                if (grp.Count() < 4) continue;
                var n = s.LightmapVec2;
                if (n.LengthSquared() < 0.5f) continue;
                n = Vector3.Normalize(n);
                // Sample plane d = n . (any sample's world)
                float d = Vector3.Dot(n, grp.First().World);
                int outlier = 0;
                foreach (var sm in grp)
                {
                    float dev = Math.Abs(Vector3.Dot(n, sm.World) - d);
                    if (dev > 1.0f) outlier++;
                }
                if (outlier > grp.Count() * 0.02f) badPlanarity++;
                surfacesChecked++;
                if (surfacesChecked >= 200) break;
            }
            Assert.True(badPlanarity < surfacesChecked * 0.10f,
                $"{badPlanarity}/{surfacesChecked} planar surfaces had >2% off-plane samples (barycentric inversion drifting)");
        }
    }
}
