using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// Phase E5 -- detect a sun light from per-surface-normal brightness coherence.
    ///
    /// <para>q3 sun lights aren't <c>light</c> entities. They're parameterless directional
    /// emitters declared via <c>_sun_*</c> worldspawn keys (and/or via a sky-shader's
    /// <c>q3map_sun</c> directive). They illuminate every surface that "faces" them with
    /// constant intensity (no falloff), so they leave a very specific signature in the
    /// lightmap: many surfaces sharing a normal direction all show <i>uniformly high</i>
    /// brightness in their unobstructed regions.</para>
    ///
    /// <para>Detection strategy:</para>
    /// <list type="number">
    ///   <item>For every texel sample, quantise its surface normal to a 15°-binned spherical
    ///         direction (~120 buckets total covering the sphere).</item>
    ///   <item>Per bin, accumulate sample count + mean RGB.</item>
    ///   <item>Pick the bin with the highest <c>brightness × sampleCount</c> AS LONG AS the
    ///         bin's mean luma exceeds <see cref="Options.MinSunLuma"/> AND its sample count
    ///         is at least <see cref="Options.MinSamples"/>.</item>
    ///   <item>The sun's direction is the <i>opposite</i> of the bin normal (sun shines FROM
    ///         that direction, surfaces facing INTO it get lit).</item>
    /// </list>
    ///
    /// <para>Conservative by design -- a single bin must dominate by a clear margin to count
    /// as a sun. False positives from "many surfaces happen to face up because they're floor"
    /// are caught by the "must dominate other bins" margin check.</para>
    /// </summary>
    public sealed class SunDetector
    {
        public sealed class Options
        {
            /// <summary>Bin angular size (degrees). 15° gives ~190 bins covering the sphere.</summary>
            public float BinAngleDegrees { get; init; } = 15f;

            /// <summary>Minimum mean luma in the winning bin to count as a sun.</summary>
            public float MinSunLuma { get; init; } = 0.20f;

            /// <summary>Minimum sample count in the winning bin.</summary>
            public int MinSamples { get; init; } = 200;

            /// <summary>The winning bin's `brightness * sampleCount` score must exceed the
            /// median bin's score by this multiple. Catches "uniform-bright floor" false
            /// positives where many bins have similar brightness.</summary>
            public float DominanceMultiplier { get; init; } = 5f;

            /// <summary>Sun intensity in the q3map2 worldspawn `_sun_intensity` units. We
            /// scale the bin's mean luma by this to produce the value. q3 sun intensities
            /// are typically 75..200 in shipping maps.</summary>
            public float IntensityScale { get; init; } = 200f;

            /// <summary>Sample-normal-Z floor. Samples whose surface normal points more
            /// strongly downward than this are excluded from the sun-bin search. Default 0
            /// (= up-facing-or-horizontal-only). The sun always shines from above; a
            /// downward-facing surface with high uniform brightness is bouncing light from
            /// somewhere else, not a sun signature.</summary>
            public float MinNormalZ { get; init; } = 0f;
        }

        public sealed class Sun
        {
            /// <summary>Direction the sun shines TOWARD (i.e. -surfaceNormal). Unit vector.</summary>
            public Vector3 Direction { get; init; }
            /// <summary>RGB color, normalised so max channel = 1.</summary>
            public Vector3 Color { get; init; } = Vector3.One;
            /// <summary>Magnitude in q3map2 `_sun_intensity` units (typical 75..200).</summary>
            public float Intensity { get; init; }
            /// <summary>Number of texel samples that voted for this sun's bin.</summary>
            public int SupportingSamples { get; init; }
            /// <summary>Score margin over the median bin (>1 = stronger signal).</summary>
            public float DominanceScore { get; init; }
            /// <summary>Pitch in degrees (q3 worldspawn `_sun_pitch`). 0 = horizontal,
            /// 90 = straight down (overhead noon), -90 = straight up (impossible).</summary>
            public float Pitch { get; init; }
            /// <summary>Yaw in degrees (q3 worldspawn `_sun_yaw`). 0 = +X, 90 = +Y.</summary>
            public float Yaw { get; init; }
        }

        public sealed class Result
        {
            public Sun? DetectedSun { get; init; }
            public int BinsConsidered { get; init; }
            public float WinnerBinScore { get; init; }
            public float MedianBinScore { get; init; }
        }

        public static Result Detect(IReadOnlyList<TexelSample> samples, BspFile? bsp = null,
            BlowoutDetector.Result? blowoutHints = null, Options? options = null, Logger? log = null)
        {
            options ??= new Options();
            int n = samples.Count;
            if (n < options.MinSamples) return new Result();

            // Pass 1: group sky-shader-tagged surfaces if a BSP was provided. q3 marks sky
            // surfaces with the SURF_SKY flag; their lightmap is the sun's color directly.
            // If we find any, prefer that signal over the heuristic bin search.
            if (bsp != null)
            {
                int skySamples = 0;
                Vector3 skyColorSum = Vector3.Zero;
                for (int i = 0; i < n; i++)
                {
                    var s = samples[i];
                    if (s.ShaderIndex < 0 || s.ShaderIndex >= bsp.Shaders.Count) continue;
                    int sflags = bsp.Shaders[s.ShaderIndex].SurfaceFlags;
                    if ((sflags & 0x4) == 0) continue; // SURF_SKY = 0x4
                    skyColorSum += s.Observed;
                    skySamples++;
                }
                if (skySamples >= options.MinSamples)
                {
                    // Sun direction inferred from sky-facing surface normals (sky shaders
                    // typically face up; sun direction is "away from up" but tilted -- we
                    // approximate as straight down and let the user adjust).
                    var sun = BuildSunFromColor(skyColorSum / skySamples, new Vector3(0, 0, -1), skySamples,
                        float.PositiveInfinity, options);
                    log?.Info($"  sun: detected via SURF_SKY ({skySamples} samples, color {sun.Color:F2}, intensity {sun.Intensity:F0})");
                    return new Result { DetectedSun = sun, BinsConsidered = 0, WinnerBinScore = float.PositiveInfinity };
                }
            }

            // Pass 2: heuristic normal-bin search. Bin every UP-FACING-OR-SIDE sample by
            // quantised normal, pick the bin with the highest brightness * count, validate
            // dominance. We exclude DOWN-facing samples (normal.Z < 0) entirely: a sun
            // shines from above, so a downward-facing surface lit by it would have to be a
            // ceiling beneath an open sky -- exotic. Without this filter the detector
            // routinely picks the underside of overhanging geometry lit by ground bounce
            // and reports "sun shining upward" which is physically nonsense.
            float angleRad = options.BinAngleDegrees * MathF.PI / 180f;
            var bins = new Dictionary<(int yaw, int pitch), (Vector3 colorSum, int count, float lumaSum)>();
            for (int i = 0; i < n; i++)
            {
                var s = samples[i];
                if (s.Normal.LengthSquared() < 1e-6f) continue;
                if (s.Normal.Z < options.MinNormalZ) continue;
                var (yaw, pitch) = QuantiseDirection(s.Normal, angleRad);
                if (!bins.TryGetValue((yaw, pitch), out var b)) b = (Vector3.Zero, 0, 0);
                b.colorSum += s.Observed;
                b.count++;
                b.lumaSum += Luma(s.Observed);
                bins[(yaw, pitch)] = b;
            }

            if (bins.Count == 0) return new Result();

            // Per-bin score = mean luma * count. Pick the winner and verify dominance.
            (int yaw, int pitch)? winnerKey = null;
            float winnerScore = 0;
            var scores = new List<float>(bins.Count);
            foreach (var kv in bins)
            {
                float meanLuma = kv.Value.lumaSum / kv.Value.count;
                float score = meanLuma * kv.Value.count;
                scores.Add(score);
                if (score > winnerScore) { winnerScore = score; winnerKey = kv.Key; }
            }
            scores.Sort();
            float medianScore = scores[scores.Count / 2];

            if (winnerKey == null) return new Result();
            var winnerBin = bins[winnerKey.Value];
            float winnerLuma = winnerBin.lumaSum / winnerBin.count;
            float dominance = winnerScore / MathF.Max(1e-3f, medianScore);

            log?.Info($"  sun-search: {bins.Count} bins, winner luma {winnerLuma:F3} count {winnerBin.count}, median score {medianScore:F2}, dominance {dominance:F2}x");

            if (winnerLuma < options.MinSunLuma || winnerBin.count < options.MinSamples
                || dominance < options.DominanceMultiplier)
            {
                return new Result { BinsConsidered = bins.Count, WinnerBinScore = winnerScore, MedianBinScore = medianScore };
            }

            // The winning bin's normal is the average normal of all samples in it -- we
            // don't store individual normals back, but yaw/pitch -> unit vector closely
            // enough.
            Vector3 binNormal = DequantiseDirection(winnerKey.Value, angleRad);
            // Sun shines FROM the OPPOSITE of the surface normal (a +Z-facing floor lit by
            // a sun receives light from above; sun direction is therefore -Z = downward).
            Vector3 sunDir = -binNormal;
            var detected = BuildSunFromColor(winnerBin.colorSum / winnerBin.count, sunDir,
                winnerBin.count, dominance, options);

            return new Result
            {
                DetectedSun = detected,
                BinsConsidered = bins.Count,
                WinnerBinScore = winnerScore,
                MedianBinScore = medianScore,
            };
        }

        private static Sun BuildSunFromColor(Vector3 meanColor, Vector3 dir, int sampleCount, float dominance, Options opts)
        {
            float luma = Luma(meanColor);
            float maxC = MathF.Max(meanColor.X, MathF.Max(meanColor.Y, meanColor.Z));
            Vector3 chroma = maxC > 1e-6f ? meanColor / maxC : Vector3.One;
            // q3 sun direction in worldspawn is given via _sun_pitch / _sun_yaw.
            // Pitch: degrees from horizontal; positive = downward.
            // Yaw: degrees, 0 = +X, 90 = +Y.
            // Our sunDir is the direction the sun's photons travel.
            float pitchRad = MathF.Asin(MathF.Max(-1f, MathF.Min(1f, -dir.Z))); // -dir.Z because positive pitch = down
            float yawRad = MathF.Atan2(dir.Y, dir.X);
            float pitchDeg = pitchRad * 180f / MathF.PI;
            float yawDeg = yawRad * 180f / MathF.PI;
            return new Sun
            {
                Direction = Vector3.Normalize(dir),
                Color = chroma,
                Intensity = luma * opts.IntensityScale,
                SupportingSamples = sampleCount,
                DominanceScore = dominance,
                Pitch = pitchDeg,
                Yaw = yawDeg,
            };
        }

        private static (int yaw, int pitch) QuantiseDirection(Vector3 n, float binRad)
        {
            // n must be near unit length; defensively normalise.
            n = Vector3.Normalize(n);
            float yaw = MathF.Atan2(n.Y, n.X); // [-pi, pi]
            float pitch = MathF.Asin(MathF.Max(-1f, MathF.Min(1f, n.Z))); // [-pi/2, pi/2]
            int yi = (int)MathF.Round(yaw / binRad);
            int pi = (int)MathF.Round(pitch / binRad);
            return (yi, pi);
        }

        private static Vector3 DequantiseDirection((int yaw, int pitch) key, float binRad)
        {
            float yaw = key.yaw * binRad;
            float pitch = key.pitch * binRad;
            float cosP = MathF.Cos(pitch);
            return new Vector3(cosP * MathF.Cos(yaw), cosP * MathF.Sin(yaw), MathF.Sin(pitch));
        }

        private static float Luma(Vector3 c) => 0.2126f * c.X + 0.7152f * c.Y + 0.0722f * c.Z;
    }
}
