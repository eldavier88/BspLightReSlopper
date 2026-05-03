using System;
using BspLightReSlopper.Bsp;

namespace BspLightReSlopper.Lightmaps
{
    /// <summary>
    /// Read-only access to the BSP's lightmap byte blob, viewed as a stack of
    /// <c>BspFile.LightmapWidth × BspFile.LightmapHeight</c> RGB atlases. Pixel reads return
    /// raw bytes; gamma decoding lives in the heuristics layer.
    /// </summary>
    public sealed class LightmapAtlas
    {
        public byte[] Data { get; }
        public int Count { get; }
        public int W => BspFile.LightmapWidth;
        public int H => BspFile.LightmapHeight;
        public int BytesPerAtlas => W * H * 3;

        public LightmapAtlas(byte[] data, int count)
        {
            Data = data ?? throw new ArgumentNullException(nameof(data));
            Count = count;
        }

        public static LightmapAtlas FromBsp(BspFile bsp)
        {
            int n = bsp.LightmapAtlasCount;
            return new LightmapAtlas(bsp.Lightmaps, n);
        }

        /// <summary>Returns true if (atlasIdx, x, y) is in range and writes to (r, g, b). Otherwise false.</summary>
        public bool TryRead(int atlasIdx, int x, int y, out byte r, out byte g, out byte b)
        {
            if ((uint)atlasIdx >= (uint)Count || (uint)x >= (uint)W || (uint)y >= (uint)H)
            {
                r = g = b = 0;
                return false;
            }
            int o = atlasIdx * BytesPerAtlas + (y * W + x) * 3;
            r = Data[o];
            g = Data[o + 1];
            b = Data[o + 2];
            return true;
        }

        public Color32 Read(int atlasIdx, int x, int y)
        {
            if (!TryRead(atlasIdx, x, y, out byte r, out byte g, out byte b)) return Color32.Zero;
            return new Color32(r, g, b, 255);
        }
    }
}
