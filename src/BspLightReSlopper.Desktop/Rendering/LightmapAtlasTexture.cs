using System;
using BspLightReSlopper.Bsp;
using Silk.NET.OpenGL;

namespace BspLightReSlopper.Desktop.Rendering
{
    /// <summary>
    /// Uploads BSP lightmap atlases as a single <c>GL_TEXTURE_2D_ARRAY</c>. One layer per
    /// 128×128 RGB atlas in <see cref="BspFile.Lightmaps"/>. Vertex shader passes the
    /// integer atlas-layer index per draw vertex (computed by <see cref="BspMesh"/>).
    /// </summary>
    public sealed class LightmapAtlasTexture
    {
        public uint Handle { get; private set; }
        public int LayerCount { get; private set; }

        public unsafe void Upload(GL gl, BspFile bsp)
        {
            int w = BspFile.LightmapWidth;
            int h = BspFile.LightmapHeight;
            int count = bsp.LightmapAtlasCount;
            if (count <= 0)
            {
                // Allocate a single dummy layer so the sampler2DArray binding is valid.
                count = 1;
            }
            LayerCount = count;

            Handle = gl.GenTexture();
            gl.BindTexture(TextureTarget.Texture2DArray, Handle);
            gl.TexParameter(TextureTarget.Texture2DArray, TextureParameterName.TextureMinFilter, (int)TextureMinFilter.Linear);
            gl.TexParameter(TextureTarget.Texture2DArray, TextureParameterName.TextureMagFilter, (int)TextureMagFilter.Linear);
            gl.TexParameter(TextureTarget.Texture2DArray, TextureParameterName.TextureWrapS, (int)TextureWrapMode.ClampToEdge);
            gl.TexParameter(TextureTarget.Texture2DArray, TextureParameterName.TextureWrapT, (int)TextureWrapMode.ClampToEdge);

            gl.PixelStore(PixelStoreParameter.UnpackAlignment, 1);

            // Allocate storage for all layers up-front, then upload each layer's pixels.
            gl.TexImage3D(TextureTarget.Texture2DArray, 0, InternalFormat.Rgb8,
                (uint)w, (uint)h, (uint)count, 0, PixelFormat.Rgb, PixelType.UnsignedByte, (void*)0);

            int bytesPerLayer = w * h * 3;
            byte[] src = bsp.Lightmaps;
            byte[] zero = new byte[bytesPerLayer];
            for (int layer = 0; layer < count; layer++)
            {
                int off = layer * bytesPerLayer;
                bool inRange = off >= 0 && off + bytesPerLayer <= src.Length;
                fixed (byte* p = inRange ? src : zero)
                {
                    byte* layerPtr = inRange ? p + off : p;
                    gl.TexSubImage3D(TextureTarget.Texture2DArray, 0,
                        0, 0, layer, (uint)w, (uint)h, 1u,
                        PixelFormat.Rgb, PixelType.UnsignedByte, layerPtr);
                }
            }

            gl.BindTexture(TextureTarget.Texture2DArray, 0);
        }

        public void Bind(GL gl, int unit)
        {
            gl.ActiveTexture(TextureUnit.Texture0 + unit);
            gl.BindTexture(TextureTarget.Texture2DArray, Handle);
        }

        public void Delete(GL gl)
        {
            if (Handle != 0) { gl.DeleteTexture(Handle); Handle = 0; }
            LayerCount = 0;
        }
    }
}
