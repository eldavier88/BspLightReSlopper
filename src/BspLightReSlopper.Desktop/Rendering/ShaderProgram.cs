using System;
using System.Collections.Generic;
using Silk.NET.OpenGL;

namespace BspLightReSlopper.Desktop.Rendering
{
    /// <summary>
    /// Compile-and-link wrapper around a GL program. Caches uniform locations and
    /// disposes the underlying handles on <see cref="Delete"/>. All operations require
    /// the GL context to be current — call inside Avalonia's OnOpenGl* callbacks.
    /// </summary>
    public sealed class ShaderProgram
    {
        public uint Handle { get; private set; }
        private readonly Dictionary<string, int> _uniforms = new();

        public static ShaderProgram Compile(GL gl, string vertexSource, string fragmentSource)
        {
            uint vs = CompileShader(gl, ShaderType.VertexShader, vertexSource);
            uint fs = CompileShader(gl, ShaderType.FragmentShader, fragmentSource);
            uint prog = gl.CreateProgram();
            gl.AttachShader(prog, vs);
            gl.AttachShader(prog, fs);
            gl.LinkProgram(prog);
            gl.GetProgram(prog, ProgramPropertyARB.LinkStatus, out int status);
            if (status == 0)
            {
                string info = gl.GetProgramInfoLog(prog);
                gl.DeleteProgram(prog);
                gl.DeleteShader(vs);
                gl.DeleteShader(fs);
                throw new InvalidOperationException("GL program link failed: " + info);
            }
            gl.DeleteShader(vs);
            gl.DeleteShader(fs);
            return new ShaderProgram { Handle = prog };
        }

        private static uint CompileShader(GL gl, ShaderType type, string src)
        {
            uint h = gl.CreateShader(type);
            gl.ShaderSource(h, src);
            gl.CompileShader(h);
            gl.GetShader(h, ShaderParameterName.CompileStatus, out int status);
            if (status == 0)
            {
                string info = gl.GetShaderInfoLog(h);
                gl.DeleteShader(h);
                throw new InvalidOperationException($"GL {type} compile failed: {info}");
            }
            return h;
        }

        public void Use(GL gl) => gl.UseProgram(Handle);

        public int U(GL gl, string name)
        {
            if (_uniforms.TryGetValue(name, out int loc)) return loc;
            loc = gl.GetUniformLocation(Handle, name);
            _uniforms[name] = loc;
            return loc;
        }

        public void Delete(GL gl)
        {
            if (Handle != 0)
            {
                gl.DeleteProgram(Handle);
                Handle = 0;
                _uniforms.Clear();
            }
        }
    }
}
