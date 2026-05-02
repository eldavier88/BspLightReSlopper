using System;
using System.Collections.Generic;
using System.IO;
using System.Numerics;
using BspLightReSlopper.Pk3;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace BspLightReSlopper.Shaders
{
    /// <summary>
    /// Phase E8 -- per-shader mean-RGB ("albedo") cache. Loads the texture image referenced
    /// by each shader (via <see cref="ShaderParser"/>'s preferred-image-path resolution) and
    /// computes its mean RGB. Used by the bounce suppressor: a candidate light whose colour
    /// closely matches its supporting surface's albedo is almost certainly a fit-to-bounce
    /// false positive.
    ///
    /// <para>Texture file extensions tried in order: .tga, .jpg, .png, .jp2.</para>
    ///
    /// <para>Cache is process-local and lazy: <see cref="GetAlbedo"/> only loads + decodes
    /// when the shader is first asked about. Resizes large textures down to 64x64 for
    /// the mean-RGB computation -- a tile big enough to capture the texture's dominant
    /// colour, small enough that decoding cost is negligible.</para>
    /// </summary>
    public sealed class AlbedoCache
    {
        private readonly Pk3Stack _stack;
        private readonly IReadOnlyDictionary<string, ShaderParser.Shader> _shadersByName;
        private readonly Dictionary<string, Vector3?> _cache = new(StringComparer.OrdinalIgnoreCase);
        private static readonly string[] Exts = { ".tga", ".jpg", ".jpeg", ".png" };

        public AlbedoCache(Pk3Stack stack, IReadOnlyDictionary<string, ShaderParser.Shader> shadersByName)
        {
            _stack = stack;
            _shadersByName = shadersByName;
        }

        /// <summary>Get the mean RGB (in 0..1, normalised so max channel = 1) for a shader
        /// name. Returns null if the shader is unknown or no image could be loaded. Result is
        /// cached.</summary>
        public Vector3? GetAlbedo(string shaderName)
        {
            if (string.IsNullOrEmpty(shaderName)) return null;
            if (_cache.TryGetValue(shaderName, out var cached)) return cached;
            Vector3? result = ComputeAlbedo(shaderName);
            _cache[shaderName] = result;
            return result;
        }

        private Vector3? ComputeAlbedo(string shaderName)
        {
            // Primary lookup: shader file gives us a referenced image. Fallback: derive an
            // image path from the shader name itself (q3 lets you reference a raw texture
            // without a shader entry).
            string? imagePath = null;
            if (_shadersByName.TryGetValue(shaderName, out var sh))
                imagePath = sh.PreferredImagePath;
            imagePath ??= shaderName;

            // Try each extension in order; q3 omits extensions in shader files.
            foreach (var ext in Exts)
            {
                string p = StripExtIfPresent(imagePath) + ext;
                using var s = _stack.Open(p);
                if (s == null) continue;
                try
                {
                    using var img = Image.Load<Rgba32>(s);
                    return ComputeMeanRgb(img);
                }
                catch
                {
                    continue;
                }
            }
            return null;
        }

        private static Vector3 ComputeMeanRgb(Image<Rgba32> img)
        {
            // Down-sample to 64x64 for fast mean computation; bilinear sufficient.
            const int Tile = 64;
            if (img.Width > Tile || img.Height > Tile)
                img.Mutate(x => x.Resize(Tile, Tile));

            long r = 0, g = 0, b = 0;
            int count = 0;
            img.ProcessPixelRows(accessor =>
            {
                for (int y = 0; y < accessor.Height; y++)
                {
                    var row = accessor.GetRowSpan(y);
                    for (int x = 0; x < row.Length; x++)
                    {
                        var p = row[x];
                        if (p.A < 128) continue; // skip transparent pixels
                        r += p.R; g += p.G; b += p.B;
                        count++;
                    }
                }
            });
            if (count == 0) return Vector3.One;
            float fr = r / (255f * count);
            float fg = g / (255f * count);
            float fb = b / (255f * count);
            float maxC = MathF.Max(fr, MathF.Max(fg, fb));
            return maxC > 1e-6f ? new Vector3(fr / maxC, fg / maxC, fb / maxC) : Vector3.One;
        }

        private static string StripExtIfPresent(string p)
        {
            string lower = p.ToLowerInvariant();
            foreach (var ext in Exts)
                if (lower.EndsWith(ext, StringComparison.Ordinal)) return p.Substring(0, p.Length - ext.Length);
            return p;
        }

        /// <summary>For diagnostic purposes: the count of cache entries that resolved
        /// successfully.</summary>
        public (int hits, int misses) Stats()
        {
            int h = 0, m = 0;
            foreach (var kv in _cache) { if (kv.Value.HasValue) h++; else m++; }
            return (h, m);
        }
    }
}
