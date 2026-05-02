using System;
using System.Collections.Generic;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Sampling;

namespace BspLightReSlopper.Heuristics
{
    /// <summary>
    /// First-pass guesses about the compile-time settings used to bake a BSP, derived
    /// purely from the BSP's lightmap byte distribution + per-surface texel density.
    /// Phase A logs these but does not yet feed them into the estimator. Phase B refines
    /// them against ground truth gathered by the recompile loop.
    /// </summary>
    public static class CompileSettingsInferer
    {
        public sealed class Inference
        {
            public float Gamma { get; init; } = 1f;
            public int OverbrightBits { get; init; }
            public float LightmapScale { get; init; } = 1f;
            public float SampleSize { get; init; } = 16f;
            public bool BounceUsed { get; init; }
            public IReadOnlyDictionary<string, string> Display { get; init; } = new Dictionary<string, string>();
        }

        public static Inference Infer(BspFile bsp, IReadOnlyList<TexelSample> samples)
        {
            // ---------- Gamma: histogram shape of the raw lightmap bytes ----------
            // Strategy: count fraction of mid-band texels (64..192). Higher gamma → fewer mid-band.
            int mid = 0, total = 0;
            byte[] lm = bsp.Lightmaps;
            for (int i = 0; i < lm.Length; i++)
            {
                byte b = lm[i];
                if (b == 0) continue;        // unlit pixels skew the count; ignore them
                total++;
                if (b >= 64 && b <= 192) mid++;
            }
            float midFrac = total > 0 ? (float)mid / total : 0;
            float gamma = midFrac > 0.5f ? 1.0f : (midFrac > 0.3f ? 1.5f : 2.2f);

            // ---------- Overbright: top-end clipping fraction ----------
            int top = 0;
            for (int i = 0; i < lm.Length; i++)
                if (lm[i] >= 250) top++;
            float topFrac = total > 0 ? (float)top / total : 0;
            int overbright = topFrac > 0.05f ? 0 : (topFrac > 0.005f ? 1 : 2);

            // ---------- LightmapScale: median surface-area-per-texel in world units ----------
            // (lightmapVecs[0..1] are atlas-relative reciprocals so |vec0| ≈ texel-world-size on x-axis-ish)
            // This is rough but informative.
            double scaleSum = 0; int scaleCount = 0;
            foreach (var s in bsp.Surfaces)
            {
                if (s.LmIndex0 < 0) continue;
                float lvx = s.LightmapVec0.Length();
                float lvy = s.LightmapVec1.Length();
                if (lvx > 0 && lvy > 0)
                {
                    scaleSum += 1.0 / Math.Max(1e-6f, lvx);
                    scaleCount++;
                }
            }
            float lightmapScale = scaleCount > 0 ? (float)(scaleSum / scaleCount) : 1f;

            // ---------- Samplesize: rough proxy from average lightmap rect size on atlas ----------
            double sumW = 0; int countW = 0;
            foreach (var s in bsp.Surfaces)
            {
                if (s.LmIndex0 < 0) continue;
                sumW += (s.LightmapWidth + s.LightmapHeight) * 0.5;
                countW++;
            }
            float avgRect = countW > 0 ? (float)(sumW / countW) : 16;
            float sampleSize = MathF.Max(1f, 16f * 16f / MathF.Max(1f, avgRect));

            // ---------- Bounce: spread of low-magnitude smooth lightmap regions ----------
            // Heuristic: many texels in [16..96] band → bounce produced gradient fill.
            int low = 0;
            for (int i = 0; i < lm.Length; i++) if (lm[i] >= 16 && lm[i] < 96) low++;
            float lowFrac = total > 0 ? (float)low / total : 0;
            bool bounceUsed = lowFrac > 0.25f;

            var display = new Dictionary<string, string>
            {
                ["gamma"] = gamma.ToString("0.0"),
                ["overbrightBits"] = overbright.ToString(),
                ["lightmapScale"] = lightmapScale.ToString("0.00"),
                ["samplesize"] = sampleSize.ToString("0.0"),
                ["bounce"] = bounceUsed ? "likely-on" : "likely-off",
            };

            return new Inference
            {
                Gamma = gamma, OverbrightBits = overbright, LightmapScale = lightmapScale,
                SampleSize = sampleSize, BounceUsed = bounceUsed, Display = display,
            };
        }
    }
}
