using System;
using System.Collections.Generic;
using Silk.NET.OpenGL;

namespace BspLightReSlopper.Desktop.Rendering
{
    /// <summary>
    /// GPU-side counterpart of <see cref="BspMesh"/>. One <see cref="GpuBatch"/> per
    /// unique lightmap atlas layer; each batch owns a VAO + VBO + EBO. Owns the GL
    /// resources and disposes them when the viewer's context is torn down.
    /// </summary>
    public sealed class GpuMesh : IDisposable
    {
        public sealed class GpuBatch : IDisposable
        {
            public uint Vao;
            public uint Vbo;
            public uint Ebo;
            public int IndexCount;
            public int AtlasLayer;

            public unsafe void Upload(GL gl, BspMesh.Batch batch)
            {
                AtlasLayer = batch.AtlasLayer;
                IndexCount = batch.Indices.Length;

                Vao = gl.GenVertexArray();
                gl.BindVertexArray(Vao);

                Vbo = gl.GenBuffer();
                gl.BindBuffer(BufferTargetARB.ArrayBuffer, Vbo);
                fixed (float* p = batch.Vertices)
                {
                    gl.BufferData(BufferTargetARB.ArrayBuffer,
                        (nuint)(batch.Vertices.Length * sizeof(float)), p, BufferUsageARB.StaticDraw);
                }

                Ebo = gl.GenBuffer();
                gl.BindBuffer(BufferTargetARB.ElementArrayBuffer, Ebo);
                fixed (uint* p = batch.Indices)
                {
                    gl.BufferData(BufferTargetARB.ElementArrayBuffer,
                        (nuint)(batch.Indices.Length * sizeof(uint)), p, BufferUsageARB.StaticDraw);
                }

                int stride = BspMesh.FloatsPerVertex * sizeof(float);
                gl.EnableVertexAttribArray(0); // position
                gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, (uint)stride, (void*)0);
                gl.EnableVertexAttribArray(1); // normal
                gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, (uint)stride, (void*)(3 * sizeof(float)));
                gl.EnableVertexAttribArray(2); // lm uv
                gl.VertexAttribPointer(2, 2, VertexAttribPointerType.Float, false, (uint)stride, (void*)(6 * sizeof(float)));
                gl.EnableVertexAttribArray(3); // atlas layer
                gl.VertexAttribPointer(3, 1, VertexAttribPointerType.Float, false, (uint)stride, (void*)(8 * sizeof(float)));

                gl.BindVertexArray(0);
                gl.BindBuffer(BufferTargetARB.ArrayBuffer, 0);
                gl.BindBuffer(BufferTargetARB.ElementArrayBuffer, 0);
            }

            public void Draw(GL gl)
            {
                if (IndexCount == 0) return;
                gl.BindVertexArray(Vao);
                unsafe { gl.DrawElements(PrimitiveType.Triangles, (uint)IndexCount, DrawElementsType.UnsignedInt, (void*)0); }
                gl.BindVertexArray(0);
            }

            public void Dispose()
            {
                // GL handles must be deleted from a context-current callback; the GpuMesh
                // owner is responsible for invoking Delete from OnOpenGlDeinit.
            }

            public void Delete(GL gl)
            {
                if (Vao != 0) gl.DeleteVertexArray(Vao);
                if (Vbo != 0) gl.DeleteBuffer(Vbo);
                if (Ebo != 0) gl.DeleteBuffer(Ebo);
                Vao = Vbo = Ebo = 0;
                IndexCount = 0;
            }
        }

        public List<GpuBatch> Batches { get; } = new();
        public int TotalTriangles { get; private set; }

        public void Upload(GL gl, BspMesh mesh)
        {
            Clear(gl);
            TotalTriangles = mesh.TriangleCount;
            foreach (var b in mesh.Batches)
            {
                var gpu = new GpuBatch();
                gpu.Upload(gl, b);
                Batches.Add(gpu);
            }
        }

        public void DrawAll(GL gl)
        {
            foreach (var b in Batches) b.Draw(gl);
        }

        public void Clear(GL gl)
        {
            foreach (var b in Batches) b.Delete(gl);
            Batches.Clear();
            TotalTriangles = 0;
        }

        public void Dispose()
        {
            // GL handle release happens in Clear(GL) — caller is responsible for that.
        }
    }
}
