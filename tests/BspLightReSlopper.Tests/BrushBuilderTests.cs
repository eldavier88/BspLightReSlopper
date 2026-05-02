using System.Numerics;
using BspLightReSlopper.MapFile;
using Xunit;

namespace BspLightReSlopper.Tests
{
    /// <summary>
    /// Plane-orientation guard tests for <see cref="BrushBuilder"/>. A box brush whose sides
    /// have inward-facing normals silently disappears from the compiled BSP (q3map2 just
    /// reports "0 surfaces" with no error), so we need a unit-level assertion that every
    /// generated face points outward.
    /// </summary>
    public class BrushBuilderTests
    {
        [Fact]
        public void BoxFacesAllPointOutward()
        {
            var brush = BrushBuilder.Box(new Vector3(-128, -64, 0), new Vector3(128, 64, 96));
            Assert.Equal(6, brush.Sides.Count);
            // For an axis-aligned box, the six face normals must be the canonical ±X, ±Y, ±Z
            // unit vectors. Any other normal => incorrect winding.
            var seen = new System.Collections.Generic.HashSet<string>();
            foreach (var s in brush.Sides)
            {
                Vector3 n = Vector3.Normalize(s.Normal);
                seen.Add($"{n.X:0.##},{n.Y:0.##},{n.Z:0.##}");
                int axisCount = (n.X != 0 ? 1 : 0) + (n.Y != 0 ? 1 : 0) + (n.Z != 0 ? 1 : 0);
                Assert.Equal(1, axisCount); // exactly one axis nonzero (no diagonals)
            }
            Assert.Contains("1,0,0",  seen);
            Assert.Contains("-1,0,0", seen);
            Assert.Contains("0,1,0",  seen);
            Assert.Contains("0,-1,0", seen);
            Assert.Contains("0,0,1",  seen);
            Assert.Contains("0,0,-1", seen);
        }

        [Fact]
        public void BoxOriginIsInside()
        {
            // Box centered around origin should contain origin (all planes' n·p - d <= 0).
            var brush = BrushBuilder.Box(new Vector3(-100, -100, -100), new Vector3(100, 100, 100));
            var p = Vector3.Zero;
            foreach (var s in brush.Sides)
                Assert.True(Vector3.Dot(s.Normal, p) - s.Dist <= 0,
                    $"plane normal={s.Normal} dist={s.Dist} excludes origin");
        }

        [Fact]
        public void BoxFarPointsAreOutside()
        {
            var brush = BrushBuilder.Box(new Vector3(-100, -100, -100), new Vector3(100, 100, 100));
            // A point well outside any axis must violate at least one half-space.
            foreach (var p in new[]
            {
                new Vector3(500, 0, 0), new Vector3(-500, 0, 0),
                new Vector3(0, 500, 0), new Vector3(0, -500, 0),
                new Vector3(0, 0, 500), new Vector3(0, 0, -500),
            })
            {
                bool excluded = false;
                foreach (var s in brush.Sides)
                    if (Vector3.Dot(s.Normal, p) - s.Dist > 0) { excluded = true; break; }
                Assert.True(excluded, $"point {p} should be outside the box");
            }
        }
    }
}
