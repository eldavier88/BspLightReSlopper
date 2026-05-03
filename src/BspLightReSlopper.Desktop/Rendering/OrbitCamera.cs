using System;
using System.Numerics;

namespace BspLightReSlopper.Desktop.Rendering
{
    /// <summary>
    /// Yaw/pitch/distance orbit camera. Rotates around <see cref="Target"/>; maintains
    /// view + projection matrices for a perspective camera. Mouse handlers are pure
    /// state mutations — the viewer control wires them up from pointer events.
    /// </summary>
    public sealed class OrbitCamera
    {
        public Vector3 Target { get; set; } = Vector3.Zero;
        public float YawRadians { get; set; }
        public float PitchRadians { get; set; } = -0.5f;
        public float Distance { get; set; } = 1024f;
        public float MinDistance { get; set; } = 16f;
        public float MaxDistance { get; set; } = 65536f;

        // Q3-style world: Z is up, X+ east, Y+ north.
        public Vector3 WorldUp { get; set; } = Vector3.UnitZ;

        public float FieldOfViewDegrees { get; set; } = 70f;
        public float NearPlane { get; set; } = 1f;
        public float FarPlane { get; set; } = 65536f;

        public Vector3 ComputePosition()
        {
            float cp = MathF.Cos(PitchRadians);
            float sp = MathF.Sin(PitchRadians);
            float cy = MathF.Cos(YawRadians);
            float sy = MathF.Sin(YawRadians);
            // Spherical: yaw around Z (up), pitch up/down. eye-from-target offset.
            var dir = new Vector3(cy * cp, sy * cp, sp);
            return Target + dir * Distance;
        }

        public Matrix4x4 GetView()
        {
            var eye = ComputePosition();
            return Matrix4x4.CreateLookAt(eye, Target, WorldUp);
        }

        public Matrix4x4 GetProjection(float aspect)
        {
            float fov = FieldOfViewDegrees * MathF.PI / 180f;
            return Matrix4x4.CreatePerspectiveFieldOfView(fov, MathF.Max(aspect, 0.0001f), NearPlane, FarPlane);
        }

        public Matrix4x4 GetViewProjection(float aspect) => GetView() * GetProjection(aspect);

        // ---- Input handlers ----

        public void Rotate(float deltaYaw, float deltaPitch)
        {
            YawRadians += deltaYaw;
            PitchRadians = Math.Clamp(PitchRadians + deltaPitch, -1.55f, 1.55f);
        }

        public void Pan(float dx, float dy)
        {
            // Move target along the camera's right + up axes.
            var view = GetView();
            // Inverse of view rotation gives world-space basis.
            var right = new Vector3(view.M11, view.M21, view.M31);
            var up = new Vector3(view.M12, view.M22, view.M32);
            // Scale pan by distance so movement feels constant on screen.
            float k = Distance * 0.0015f;
            Target -= right * dx * k;
            Target += up * dy * k;
        }

        public void Zoom(float delta)
        {
            // Multiplicative zoom; positive delta = zoom in.
            float factor = MathF.Pow(0.9f, delta);
            Distance = Math.Clamp(Distance * factor, MinDistance, MaxDistance);
        }

        /// <summary>Frame the camera to fit a world-space bounding box.</summary>
        public void Frame(Vector3 min, Vector3 max)
        {
            var center = (min + max) * 0.5f;
            var extent = (max - min) * 0.5f;
            float radius = MathF.Max(MathF.Max(extent.X, extent.Y), extent.Z);
            if (radius < 1f) radius = 1024f;
            Target = center;
            float fov = FieldOfViewDegrees * MathF.PI / 180f;
            Distance = Math.Clamp(radius / MathF.Sin(fov * 0.5f) * 1.4f, MinDistance, MaxDistance);
            FarPlane = MathF.Max(radius * 8f, 65536f);
        }

        /// <summary>Frame the camera on a single point at fixed distance.</summary>
        public void LookAt(Vector3 target, float distance)
        {
            Target = target;
            Distance = Math.Clamp(distance, MinDistance, MaxDistance);
        }
    }
}
