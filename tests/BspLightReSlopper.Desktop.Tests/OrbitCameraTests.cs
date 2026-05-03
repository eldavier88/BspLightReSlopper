using System;
using System.Numerics;
using BspLightReSlopper.Desktop.Rendering;
using Xunit;

namespace BspLightReSlopper.Desktop.Tests
{
    public sealed class OrbitCameraTests
    {
        [Fact]
        public void ComputePosition_RespectsTargetAndDistance()
        {
            var cam = new OrbitCamera
            {
                Target = new Vector3(100, 200, 50),
                YawRadians = 0,
                PitchRadians = 0,
                Distance = 500,
            };
            // yaw=0,pitch=0 → position = target + (1,0,0)*distance
            var p = cam.ComputePosition();
            Assert.Equal(600f, p.X, precision: 2);
            Assert.Equal(200f, p.Y, precision: 2);
            Assert.Equal(50f, p.Z, precision: 2);
        }

        [Fact]
        public void Rotate_ClampsPitchToVerticals()
        {
            var cam = new OrbitCamera();
            cam.Rotate(0, 100f); // huge pitch input
            Assert.True(cam.PitchRadians <= 1.55f);
            cam.Rotate(0, -100f);
            Assert.True(cam.PitchRadians >= -1.55f);
        }

        [Fact]
        public void Zoom_ClampsToMinAndMax()
        {
            var cam = new OrbitCamera { MinDistance = 10, MaxDistance = 1000, Distance = 500 };
            for (int i = 0; i < 200; i++) cam.Zoom(1f); // zoom in a lot
            Assert.True(cam.Distance >= 10f);
            Assert.True(cam.Distance < 500f);

            for (int i = 0; i < 200; i++) cam.Zoom(-1f); // zoom out a lot
            Assert.True(cam.Distance <= 1000f);
        }

        [Fact]
        public void Frame_CentersTargetAndAdjustsDistance()
        {
            var cam = new OrbitCamera();
            var min = new Vector3(-512, -512, -64);
            var max = new Vector3(512, 512, 256);
            cam.Frame(min, max);

            var center = (min + max) * 0.5f;
            Assert.Equal(center, cam.Target);
            Assert.True(cam.Distance > 0f);
            Assert.True(cam.Distance >= cam.MinDistance);
            Assert.True(cam.Distance <= cam.MaxDistance);
        }

        [Fact]
        public void GetProjection_FiniteForReasonableAspect()
        {
            var cam = new OrbitCamera();
            var m = cam.GetProjection(16f / 9f);
            Assert.False(float.IsNaN(m.M11));
            Assert.False(float.IsInfinity(m.M11));
            Assert.True(m.M11 > 0);
        }
    }
}
