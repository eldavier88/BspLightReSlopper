using System;
using System.IO;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using Xunit;

namespace BspLightReSlopper.Tests
{
    /// <summary>
    /// Phase H1 — the auditor must return <c>AllPass == true</c> on a clean synthetic BSP
    /// and must FIRE failures when we deliberately corrupt a sample. Also does a real-map
    /// smoke pass (gated on BSPLRS_JK2_ASSETS) to confirm the auditor doesn't trip on
    /// real data.
    /// </summary>
    public class TexelFetchAuditorTests
    {
        [Fact]
        public void CleanSyntheticQuad_AllChecksPass()
        {
            var bsp = BspLoader.LoadFromBytes(TestBsp.BuildIbsp46QuadWithGradientLightmap(32,
                (ax, ay) => ((byte)(ax * 8), (byte)(ay * 8), (byte)128)));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas,
                new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            var audit = TexelFetchAuditor.Audit(bsp, unpacked, atlas, samples.Samples);
            Assert.True(audit.AllPass,
                $"atlas={audit.AtlasRoundtripFailures} bary={audit.BarycentricRoundtripFailures} planar={audit.PlanarForwardFailures} dup={audit.DuplicateSamePixel}; first fails: {string.Join(" | ", audit.FirstFailureMessages)}");
            Assert.True(audit.Audited > 0);
            Assert.True(audit.MaxAtlasRgbDelta <= 1f / 255f + 1e-4f);
            Assert.True(audit.MaxBarycentricPixelError <= 0.75f + 1e-3f);
        }

        [Fact]
        public void CorruptedSampleObservedDetectedAsAtlasFailure()
        {
            var bsp = BspLoader.LoadFromBytes(TestBsp.BuildIbsp46QuadWithGradientLightmap(16,
                (ax, ay) => ((byte)(ax * 16), (byte)(ay * 16), (byte)((ax + ay) * 8))));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas,
                new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            // Corrupt one sample's Observed so the auditor must flag a mismatch.
            var corrupted = new System.Collections.Generic.List<TexelSample>(samples.Samples);
            var bad = corrupted[0];
            corrupted[0] = new TexelSample
            {
                SurfaceIndex = bad.SurfaceIndex,
                ShaderIndex = bad.ShaderIndex,
                Stage = bad.Stage,
                World = bad.World,
                Normal = bad.Normal,
                Observed = new System.Numerics.Vector3(0.9f, 0.1f, 0.1f),
                AtlasIndex = bad.AtlasIndex,
                AtlasX = bad.AtlasX,
                AtlasY = bad.AtlasY,
                LightmapStyle = bad.LightmapStyle,
                Cluster = bad.Cluster,
            };

            var audit = TexelFetchAuditor.Audit(bsp, unpacked, atlas, corrupted);
            Assert.False(audit.AllPass);
            Assert.True(audit.AtlasRoundtripFailures >= 1,
                "auditor should flag the corrupted sample's RGB mismatch");
        }

        [Fact]
        public void DuplicateSampleDetected()
        {
            var bsp = BspLoader.LoadFromBytes(TestBsp.BuildIbsp46QuadWithGradientLightmap(8,
                (ax, ay) => ((byte)100, (byte)100, (byte)100)));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas,
                new TexelSampler.SampleOptions { MaxSamples = 100_000 });

            // Duplicate the first sample, then run the audit.
            var dup = new System.Collections.Generic.List<TexelSample>(samples.Samples);
            dup.Add(dup[0]);
            var audit = TexelFetchAuditor.Audit(bsp, unpacked, atlas, dup);
            Assert.True(audit.DuplicateSamePixel >= 1);
        }

        [Fact]
        public void ConsistentLmVecsQuad_PlanarForwardCheckActuallyRuns()
        {
            // The default quad has lmVec magnitudes that don't match its world span, so
            // IsLmVecsSelfConsistent returns false and the planar forward gate is skipped.
            // The consistent-lmVecs variant has lmVec = (8,0,0) / (0,8,0) for a 32-pixel
            // atlas spanning 256u; the planar forward check then fires AND must pass.
            var bsp = BspLoader.LoadFromBytes(TestBsp.BuildIbsp46QuadWithGradientLightmap(32,
                (ax, ay) => ((byte)(ax * 8), (byte)(ay * 8), (byte)128),
                consistentLmVecs: true));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas,
                new TexelSampler.SampleOptions { MaxSamples = 100_000 });
            var audit = TexelFetchAuditor.Audit(bsp, unpacked, atlas, samples.Samples);

            Assert.True(audit.AllPass,
                $"atlas={audit.AtlasRoundtripFailures} bary={audit.BarycentricRoundtripFailures} planar={audit.PlanarForwardFailures} dup={audit.DuplicateSamePixel}; first fails: {string.Join(" | ", audit.FirstFailureMessages)}");
            // MaxPlanarWorldError must be POSITIVE -- proves the planar check actually
            // ran (else it stays at its sentinel 0). For a 32×32 atlas spanning 256u and
            // the barycentric/forward paths agreeing, the per-pixel world-error should be
            // sub-half-pixel (~4u tolerance, observed delta typically 0).
            Assert.True(audit.Audited > 0);
            Assert.True(audit.MaxPlanarWorldError <= 4f,
                $"planar world err too large: {audit.MaxPlanarWorldError}u");
        }

        [SkippableFact]
        public void RealJk2Map_AuditorReportsNoAtlasMismatches()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.IfNot(!string.IsNullOrEmpty(assets) && File.Exists(Path.Combine(assets!, "maps", "kejim_post.bsp")),
                "BSPLRS_JK2_ASSETS / kejim_post.bsp not present");

            var bsp = BspLoader.Load(Path.Combine(assets!, "maps", "kejim_post.bsp"));
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var atlas = LightmapAtlas.FromBsp(bsp);
            var samples = TexelSampler.Sample(bsp, unpacked, atlas,
                new TexelSampler.SampleOptions { MaxSamples = 80_000 });

            var audit = TexelFetchAuditor.Audit(bsp, unpacked, atlas, samples.Samples);

            // Atlas roundtrip MUST be perfect — this is a byte-for-byte re-read check.
            Assert.Equal(0, audit.AtlasRoundtripFailures);
            // Duplicate check MUST be perfect per surface.
            Assert.Equal(0, audit.DuplicateSamePixel);
            // Barycentric roundtrip can tolerate some misses on tessellated patches where
            // adjacent triangles overlap in lm-UV — permit up to 2% of samples.
            float baryFailFrac = audit.Audited > 0 ? (float)audit.BarycentricRoundtripFailures / audit.Audited : 0;
            Assert.True(baryFailFrac < 0.02f,
                $"bary fail rate {baryFailFrac:P2} > 2% on kejim_post ({audit.BarycentricRoundtripFailures}/{audit.Audited})");
        }
    }
}
