using System.Linq;
using System.Numerics;
using BspLightReSlopper.Desktop.Rendering;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Surfaces;
using Xunit;

namespace BspLightReSlopper.Desktop.Tests
{
    public sealed class BspMeshTests
    {
        [Fact]
        public void Build_EmptyBsp_ReturnsBoundsAndZeroTriangles()
        {
            // Build a minimal empty BSP via the test helper (none — fall back to defaults).
            var bsp = new BspFile();
            var unpacked = SurfaceUnpacker.Unpack(bsp);
            var mesh = BspMesh.Build(bsp, unpacked);

            Assert.Equal(0, mesh.TriangleCount);
            // Empty BSP must still yield finite bounds (the builder substitutes a default).
            Assert.False(float.IsInfinity(mesh.BoundsMin.X));
            Assert.False(float.IsInfinity(mesh.BoundsMax.X));
        }

        [Fact]
        public void FloatsPerVertex_MatchesDocumentedLayout()
        {
            // x,y,z, nx,ny,nz, u,v, layer = 9
            Assert.Equal(9, BspMesh.FloatsPerVertex);
        }
    }
}
