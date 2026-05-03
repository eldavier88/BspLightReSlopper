using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Sampling;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// Phase P3 -- fast approximate preview renderer. Generates a low-resolution
    /// RGB prediction image from estimated lights using the same forward model as
    /// the estimator, but skipping visibility checks and using a coarser grid for
    /// speed. Useful for visual sanity-checking before exporting.
    /// </summary>
    public static class PreviewRenderer
    {
        /// <summary>
        /// Render a preview for a single 128×128 lightmap atlas. Returns raw RGB bytes
        /// (3 bytes per pixel, row-major) that can be fed to ImageSharp or Three.js.
        /// </summary>
        public static byte[] RenderAtlas(
            int atlasIndex,
            IReadOnlyList<TexelSample> allSamples,
            IReadOnlyList<EstimatedLight> lights,
            bool halfLambert = false,
            float fade = 32f)
        {
            const int W = 128, H = 128;
            float fade2 = fade * fade;
            var buf = new byte[W * H * 3];

            // Build per-pixel prediction.
            foreach (var s in allSamples)
            {
                if (s.AtlasIndex != atlasIndex) continue;
                if (s.AtlasX < 0 || s.AtlasX >= W || s.AtlasY < 0 || s.AtlasY >= H) continue;

                float pr = 0f, pg = 0f, pb = 0f;
                foreach (var L in lights)
                {
                    if (L.BlownOut) continue;
                    float dx = L.Origin.X - s.World.X;
                    float dy = L.Origin.Y - s.World.Y;
                    float dz = L.Origin.Z - s.World.Z;
                    float d2 = dx * dx + dy * dy + dz * dz;
                    if (d2 < 1e-3f) continue;
                    float invD = 1f / MathF.Sqrt(d2);
                    float ndotL = (s.Normal.X * dx + s.Normal.Y * dy + s.Normal.Z * dz) * invD;
                    float angle = LightEstimator.AngleAttenuation(ndotL, halfLambert);
                    if (angle <= 0f) continue;
                    float g = angle / (d2 + fade2);
                    var I = L.Color * L.Intensity;
                    pr += s.Albedo.X * I.X * g;
                    pg += s.Albedo.Y * I.Y * g;
                    pb += s.Albedo.Z * I.Z * g;
                }

                int idx = (s.AtlasY * W + s.AtlasX) * 3;
                buf[idx + 0] = ClampByte(pr);
                buf[idx + 1] = ClampByte(pg);
                buf[idx + 2] = ClampByte(pb);
            }
            return buf;
        }

        static byte ClampByte(float v)
        {
            int iv = (int)(v * 255f + 0.5f);
            if (iv < 0) return 0;
            if (iv > 255) return 255;
            return (byte)iv;
        }
    }
}
