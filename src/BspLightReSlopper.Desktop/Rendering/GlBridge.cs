using System;
using Avalonia.OpenGL;
using Silk.NET.OpenGL;

namespace BspLightReSlopper.Desktop.Rendering
{
    /// <summary>
    /// Bridges Avalonia's <see cref="GlInterface"/> (a thin wrapper around platform GL
    /// proc loading) to Silk.NET's strongly-typed <see cref="GL"/> facade. Construct one
    /// per <c>OnOpenGlInit</c>; the resulting <see cref="GL"/> instance is valid for the
    /// lifetime of that GL context.
    /// </summary>
    public static class GlBridge
    {
        public static GL Create(GlInterface gl)
        {
            if (gl == null) throw new ArgumentNullException(nameof(gl));
            return GL.GetApi(name => gl.GetProcAddress(name));
        }
    }
}
