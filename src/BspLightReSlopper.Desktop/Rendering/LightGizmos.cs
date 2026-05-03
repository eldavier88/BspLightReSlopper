using System;
using System.Collections.Generic;
using System.Numerics;
using BspLightReSlopper.Desktop.Services;
using BspLightReSlopper.Estimation;
using Silk.NET.OpenGL;

namespace BspLightReSlopper.Desktop.Rendering
{
    /// <summary>
    /// Per-instance attributes for the light billboard shader.
    /// </summary>
    public struct GizmoInstance
    {
        public Vector3 Origin;
        public Vector3 Color;
        public float Radius;
    }

    /// <summary>
    /// GPU resources for rendering estimated lights as billboarded soft spheres + an
    /// optional set of line-strip cones for spot lights. Rebuilt whenever the light
    /// list changes; cheap (a few KB per ~100 lights).
    /// </summary>
    public sealed class LightGizmos
    {
        // Quad VBO (4 verts in -1..1 space) shared by all instances.
        private uint _quadVao, _quadVbo, _instanceVbo;
        private int _instanceCount;
        // Cone line buffer (one VAO; (pos,color) interleaved).
        private uint _coneVao, _coneVbo;
        private int _coneVertexCount;

        private readonly float[] _quadVerts = new float[]
        {
            -1f, -1f,
             1f, -1f,
             1f,  1f,
            -1f,  1f,
        };

        public unsafe void EnsureInitialized(GL gl)
        {
            if (_quadVao != 0) return;

            _quadVao = gl.GenVertexArray();
            gl.BindVertexArray(_quadVao);

            _quadVbo = gl.GenBuffer();
            gl.BindBuffer(BufferTargetARB.ArrayBuffer, _quadVbo);
            fixed (float* p = _quadVerts)
                gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(_quadVerts.Length * sizeof(float)), p, BufferUsageARB.StaticDraw);
            gl.EnableVertexAttribArray(0);
            gl.VertexAttribPointer(0, 2, VertexAttribPointerType.Float, false, 2 * sizeof(float), (void*)0);

            _instanceVbo = gl.GenBuffer();
            gl.BindBuffer(BufferTargetARB.ArrayBuffer, _instanceVbo);
            int istride = (3 + 3 + 1) * sizeof(float);
            gl.EnableVertexAttribArray(1);
            gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, (uint)istride, (void*)0);
            gl.VertexAttribDivisor(1, 1);
            gl.EnableVertexAttribArray(2);
            gl.VertexAttribPointer(2, 3, VertexAttribPointerType.Float, false, (uint)istride, (void*)(3 * sizeof(float)));
            gl.VertexAttribDivisor(2, 1);
            gl.EnableVertexAttribArray(3);
            gl.VertexAttribPointer(3, 1, VertexAttribPointerType.Float, false, (uint)istride, (void*)(6 * sizeof(float)));
            gl.VertexAttribDivisor(3, 1);

            gl.BindVertexArray(0);

            _coneVao = gl.GenVertexArray();
            gl.BindVertexArray(_coneVao);
            _coneVbo = gl.GenBuffer();
            gl.BindBuffer(BufferTargetARB.ArrayBuffer, _coneVbo);
            int lineStride = (3 + 3) * sizeof(float);
            gl.EnableVertexAttribArray(0);
            gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, (uint)lineStride, (void*)0);
            gl.EnableVertexAttribArray(1);
            gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, (uint)lineStride, (void*)(3 * sizeof(float)));
            gl.BindVertexArray(0);
        }

        public unsafe void UpdateLights(GL gl, IReadOnlyList<ClassifiedLight> lights, float scaleToQ3)
        {
            EnsureInitialized(gl);

            // Build instance buffer.
            int n = lights.Count;
            _instanceCount = n;
            var data = new float[n * 7];
            for (int i = 0; i < n; i++)
            {
                var l = lights[i].Light;
                float i_q3 = l.Intensity * scaleToQ3;
                // Q3 light intensity ~300 default. Map to 12..64u radius for visibility.
                float radius = MathF.Min(64f, MathF.Max(12f, MathF.Sqrt(i_q3) * 1.6f));
                int o = i * 7;
                data[o + 0] = l.Origin.X;
                data[o + 1] = l.Origin.Y;
                data[o + 2] = l.Origin.Z;
                data[o + 3] = MathF.Max(0.05f, l.Color.X);
                data[o + 4] = MathF.Max(0.05f, l.Color.Y);
                data[o + 5] = MathF.Max(0.05f, l.Color.Z);
                data[o + 6] = radius;
            }
            gl.BindBuffer(BufferTargetARB.ArrayBuffer, _instanceVbo);
            fixed (float* p = data)
                gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(data.Length * sizeof(float)), p, BufferUsageARB.DynamicDraw);
            gl.BindBuffer(BufferTargetARB.ArrayBuffer, 0);

            // Build cone line buffer for spot lights.
            var coneVerts = new List<float>();
            foreach (var l in lights)
            {
                if (l.Kind != LightTypeClassifier.Kind.Spot) continue;
                Vector3 origin = l.Light.Origin;
                Vector3 dir = l.SpotDirection;
                if (dir.LengthSquared() < 1e-6f) continue;
                dir = Vector3.Normalize(dir);
                float halfAngleRad = l.SpotHalfAngleDegrees * MathF.PI / 180f;
                const float coneLen = 256f;
                Vector3 axisEnd = origin + dir * coneLen;
                // Build basis perpendicular to dir.
                Vector3 up = MathF.Abs(dir.Z) < 0.9f ? Vector3.UnitZ : Vector3.UnitY;
                Vector3 right = Vector3.Normalize(Vector3.Cross(dir, up));
                Vector3 perpUp = Vector3.Cross(right, dir);
                float r = MathF.Tan(halfAngleRad) * coneLen;
                Vector3 c = new(MathF.Max(0.4f, l.Light.Color.X), MathF.Max(0.4f, l.Light.Color.Y), MathF.Max(0.4f, l.Light.Color.Z));
                const int segments = 24;
                Vector3 prev = axisEnd + right * r;
                for (int k = 1; k <= segments; k++)
                {
                    float a = k / (float)segments * MathF.PI * 2f;
                    Vector3 p = axisEnd + right * (MathF.Cos(a) * r) + perpUp * (MathF.Sin(a) * r);
                    AddLine(coneVerts, prev, p, c);
                    prev = p;
                }
                // Four spokes for the cone walls.
                for (int k = 0; k < 4; k++)
                {
                    float a = k / 4f * MathF.PI * 2f;
                    Vector3 p = axisEnd + right * (MathF.Cos(a) * r) + perpUp * (MathF.Sin(a) * r);
                    AddLine(coneVerts, origin, p, c);
                }
            }
            _coneVertexCount = coneVerts.Count / 6;
            gl.BindBuffer(BufferTargetARB.ArrayBuffer, _coneVbo);
            if (coneVerts.Count > 0)
            {
                fixed (float* p = coneVerts.ToArray())
                    gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(coneVerts.Count * sizeof(float)), p, BufferUsageARB.DynamicDraw);
            }
            else
            {
                gl.BufferData(BufferTargetARB.ArrayBuffer, 0, (void*)0, BufferUsageARB.DynamicDraw);
            }
            gl.BindBuffer(BufferTargetARB.ArrayBuffer, 0);
        }

        public unsafe void UpdateGroundTruth(GL gl, IReadOnlyList<Vector3> origins, IReadOnlyList<Vector3> colors)
        {
            EnsureInitialized(gl);
            int n = origins.Count;
            _gtCount = n;
            if (_gtVbo == 0)
            {
                _gtVao = gl.GenVertexArray();
                gl.BindVertexArray(_gtVao);
                _gtQuadVbo = gl.GenBuffer();
                gl.BindBuffer(BufferTargetARB.ArrayBuffer, _gtQuadVbo);
                fixed (float* p = _quadVerts)
                    gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(_quadVerts.Length * sizeof(float)), p, BufferUsageARB.StaticDraw);
                gl.EnableVertexAttribArray(0);
                gl.VertexAttribPointer(0, 2, VertexAttribPointerType.Float, false, 2 * sizeof(float), (void*)0);

                _gtVbo = gl.GenBuffer();
                gl.BindBuffer(BufferTargetARB.ArrayBuffer, _gtVbo);
                int istride = (3 + 3 + 1) * sizeof(float);
                gl.EnableVertexAttribArray(1);
                gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, (uint)istride, (void*)0);
                gl.VertexAttribDivisor(1, 1);
                gl.EnableVertexAttribArray(2);
                gl.VertexAttribPointer(2, 3, VertexAttribPointerType.Float, false, (uint)istride, (void*)(3 * sizeof(float)));
                gl.VertexAttribDivisor(2, 1);
                gl.EnableVertexAttribArray(3);
                gl.VertexAttribPointer(3, 1, VertexAttribPointerType.Float, false, (uint)istride, (void*)(6 * sizeof(float)));
                gl.VertexAttribDivisor(3, 1);
                gl.BindVertexArray(0);
            }
            var data = new float[n * 7];
            for (int i = 0; i < n; i++)
            {
                var o = origins[i];
                var c = i < colors.Count ? colors[i] : Vector3.One;
                int oi = i * 7;
                data[oi + 0] = o.X; data[oi + 1] = o.Y; data[oi + 2] = o.Z;
                data[oi + 3] = MathF.Max(0.2f, c.X * 0.6f); data[oi + 4] = MathF.Max(0.4f, c.Y * 0.6f); data[oi + 5] = MathF.Max(0.2f, c.Z * 0.6f);
                data[oi + 6] = 24f;
            }
            gl.BindBuffer(BufferTargetARB.ArrayBuffer, _gtVbo);
            if (data.Length > 0)
            {
                fixed (float* p = data)
                    gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(data.Length * sizeof(float)), p, BufferUsageARB.DynamicDraw);
            }
            gl.BindBuffer(BufferTargetARB.ArrayBuffer, 0);
        }

        public unsafe void DrawLights(GL gl)
        {
            if (_instanceCount <= 0) return;
            gl.BindVertexArray(_quadVao);
            gl.DrawArraysInstanced(PrimitiveType.TriangleFan, 0, 4u, (uint)_instanceCount);
            gl.BindVertexArray(0);
        }

        public unsafe void DrawGroundTruth(GL gl)
        {
            if (_gtCount <= 0 || _gtVao == 0) return;
            gl.BindVertexArray(_gtVao);
            gl.DrawArraysInstanced(PrimitiveType.TriangleFan, 0, 4u, (uint)_gtCount);
            gl.BindVertexArray(0);
        }

        public unsafe void DrawCones(GL gl)
        {
            if (_coneVertexCount <= 0) return;
            gl.BindVertexArray(_coneVao);
            gl.DrawArrays(PrimitiveType.Lines, 0, (uint)_coneVertexCount);
            gl.BindVertexArray(0);
        }

        public void Delete(GL gl)
        {
            if (_quadVbo != 0) gl.DeleteBuffer(_quadVbo);
            if (_instanceVbo != 0) gl.DeleteBuffer(_instanceVbo);
            if (_quadVao != 0) gl.DeleteVertexArray(_quadVao);
            if (_coneVbo != 0) gl.DeleteBuffer(_coneVbo);
            if (_coneVao != 0) gl.DeleteVertexArray(_coneVao);
            if (_gtQuadVbo != 0) gl.DeleteBuffer(_gtQuadVbo);
            if (_gtVbo != 0) gl.DeleteBuffer(_gtVbo);
            if (_gtVao != 0) gl.DeleteVertexArray(_gtVao);
            _quadVao = _quadVbo = _instanceVbo = 0;
            _coneVao = _coneVbo = 0;
            _gtVao = _gtQuadVbo = _gtVbo = 0;
            _instanceCount = _coneVertexCount = _gtCount = 0;
        }

        // Ground-truth instances (separate VBO so we can independently toggle).
        private uint _gtVao, _gtQuadVbo, _gtVbo;
        private int _gtCount;

        private static void AddLine(List<float> dst, Vector3 a, Vector3 b, Vector3 color)
        {
            dst.Add(a.X); dst.Add(a.Y); dst.Add(a.Z);
            dst.Add(color.X); dst.Add(color.Y); dst.Add(color.Z);
            dst.Add(b.X); dst.Add(b.Y); dst.Add(b.Z);
            dst.Add(color.X); dst.Add(color.Y); dst.Add(color.Z);
        }
    }
}
