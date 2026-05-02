using System;
using System.IO;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.EntityIo;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class BspCollisionTests
    {
        private static string? RealMap()
        {
            string? a = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            if (string.IsNullOrEmpty(a)) return null;
            string p = Path.Combine(a, "maps", "kejim_post.bsp");
            return File.Exists(p) ? p : null;
        }

        [Fact]
        public void GroundTruthLightOriginsAreNotInsideSolid()
        {
            string? path = RealMap();
            Skip.IfNot(path != null, "BSPLRS_JK2_ASSETS not set or kejim_post.bsp missing");
            var bsp = BspLoader.Load(path);
            var col = new BspCollision(bsp);
            var gt = GroundTruth.Extract(bsp.EntitiesText);
            Assert.True(gt.IsUsable);
            int total = gt.Lights.Count;
            int insideSolid = 0, outsideMap = 0;
            foreach (var l in gt.Lights)
            {
                if (col.IsOutsideMap(l.Origin)) outsideMap++;
                else if (col.IsInsideSolid(l.Origin)) insideSolid++;
            }
            // The collision module should agree with q3map2 that light entities are placed
            // in valid (non-solid, in-map) space. Some false positives are tolerable: level
            // designers do push lights into ceiling/wall brushes for aesthetic reasons, and
            // sliver-thin brushes plus float rounding around plane edges add a few more. >20%
            // would indicate a real bug.
            float badFraction = (insideSolid + outsideMap) / (float)total;
            Assert.True(badFraction < 0.20f,
                $"{insideSolid}/{total} marked inside-solid, {outsideMap}/{total} marked outside-map (bad fraction {badFraction:P1})");
        }

        [Fact]
        public void FarAwayPointIsOutsideMap()
        {
            string? path = RealMap();
            Skip.IfNot(path != null, "BSPLRS_JK2_ASSETS not set or kejim_post.bsp missing");
            var bsp = BspLoader.Load(path);
            var col = new BspCollision(bsp);
            // 10k units beyond the map's bbox.
            Vector3 far = bsp.Models[0].Maxs + new Vector3(10_000, 10_000, 10_000);
            Assert.True(col.IsOutsideMap(far), "10k beyond map maxs should report as outside-map");
        }

        [Fact]
        public void HorizontalRayFromLightHitsAWall()
        {
            string? path = RealMap();
            Skip.IfNot(path != null, "BSPLRS_JK2_ASSETS not set or kejim_post.bsp missing");
            var bsp = BspLoader.Load(path);
            var col = new BspCollision(bsp);
            var gt = GroundTruth.Extract(bsp.EntitiesText);
            // Pick the first light that's clearly in valid space.
            var light = gt.Lights.FirstOrDefault(l => col.IsValidLightPosition(l.Origin));
            Assert.True(light != null, "no light in valid space?");
            // Shoot 8000 units east; almost any indoor map will block this within a few hundred units.
            var tr = col.Trace(light!.Origin, light.Origin + new Vector3(8000, 0, 0));
            Assert.True(tr.Fraction < 1f, $"expected horizontal ray from light {light.Origin} to hit wall, fraction={tr.Fraction}");
        }

        [Fact]
        public void LineOfSightBetweenTwoNearbyLightsBehavesSensibly()
        {
            string? path = RealMap();
            Skip.IfNot(path != null, "BSPLRS_JK2_ASSETS not set or kejim_post.bsp missing");
            var bsp = BspLoader.Load(path);
            var col = new BspCollision(bsp);
            var gt = GroundTruth.Extract(bsp.EntitiesText);
            // Test rays between 200 random pairs of lights; at least some should be blocked
            // (different rooms) and some should be visible (same room).
            var rng = new Random(42);
            int seen = 0, blocked = 0;
            for (int i = 0; i < 200 && i < gt.Lights.Count; i++)
            {
                var a = gt.Lights[rng.Next(gt.Lights.Count)].Origin;
                var b = gt.Lights[rng.Next(gt.Lights.Count)].Origin;
                if (a == b) continue;
                if (col.LineOfSight(a, b)) seen++; else blocked++;
            }
            Assert.True(seen > 0, "expected at least some line-of-sight between lights");
            Assert.True(blocked > 0, "expected at least some blocked rays in a real indoor map");
        }
    }
}
