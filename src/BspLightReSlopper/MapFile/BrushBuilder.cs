using System;
using System.Globalization;
using System.Numerics;
using System.Text;

namespace BspLightReSlopper.MapFile
{
    /// <summary>
    /// Helpers for programmatic <c>.map</c> brush generation. Hand-typed brush sides are
    /// extremely error-prone (one swapped point order produces a side with an inward-facing
    /// normal, which silently disappears from the compiled BSP); the box helper here always
    /// emits the canonical six axis-aligned planes with outward normals.
    ///
    /// <para>Output is a <see cref="MapBrush"/> with both parsed <see cref="MapBrush.Sides"/>
    /// (for collision/Inspection) and <see cref="MapBrush.OriginalText"/> (for
    /// <see cref="MapFileWriter"/> round-trip).</para>
    /// </summary>
    public static class BrushBuilder
    {
        /// <summary>Build an axis-aligned box brush spanning <paramref name="lo"/>..<paramref name="hi"/>
        /// using the same shader on every face.</summary>
        public static MapBrush Box(Vector3 lo, Vector3 hi, string shader = "common/caulk")
        {
            return Box(lo, hi, shader, shader, shader, shader, shader, shader);
        }

        /// <summary>Build an axis-aligned box brush with per-face shaders (X-, X+, Y-, Y+, Z-, Z+).</summary>
        public static MapBrush Box(Vector3 lo, Vector3 hi,
            string negX, string posX, string negY, string posY, string negZ, string posZ)
        {
            if (hi.X <= lo.X || hi.Y <= lo.Y || hi.Z <= lo.Z)
                throw new ArgumentException($"degenerate box: lo={lo} hi={hi}");

            var brush = new MapBrush { Dialect = MapBrushDialect.BrushDef };

            // Each face: pick three points such that cross(B-A, C-A) points OUTWARD.
            // q3map2's PlaneFromPoints uses cross(p2-p1, p3-p1), so we mirror that.
            //
            // Face        Normal   Triangle (A, B, C) on the face (CCW from outside)
            // ----        ------   ----------------------------------------------------
            // posZ (top)  +Z       (lo.X, lo.Y, hi.Z) (hi.X, lo.Y, hi.Z) (lo.X, hi.Y, hi.Z)
            // negZ (bot)  -Z       (lo.X, lo.Y, lo.Z) (lo.X, hi.Y, lo.Z) (hi.X, lo.Y, lo.Z)
            // posX (east) +X       (hi.X, lo.Y, lo.Z) (hi.X, lo.Y, hi.Z) (hi.X, hi.Y, lo.Z)
            // negX (west) -X       (lo.X, lo.Y, lo.Z) (lo.X, hi.Y, lo.Z) (lo.X, lo.Y, hi.Z)
            //                                  ^ Wait, that gives -Z. Re-derive below.
            //
            // We just compute each face's three points fresh using the formula above and let
            // the cross-product check validate.

            var sb = new StringBuilder();
            sb.Append("brushDef\n{\n");

            // posZ (top)
            EmitFace(sb, brush,
                new Vector3(lo.X, lo.Y, hi.Z),
                new Vector3(hi.X, lo.Y, hi.Z),
                new Vector3(lo.X, hi.Y, hi.Z),
                posZ);

            // negZ (bottom): need normal -Z. Use winding (lo.X,lo.Y,lo.Z), (lo.X,hi.Y,lo.Z), (hi.X,lo.Y,lo.Z)
            EmitFace(sb, brush,
                new Vector3(lo.X, lo.Y, lo.Z),
                new Vector3(lo.X, hi.Y, lo.Z),
                new Vector3(hi.X, lo.Y, lo.Z),
                negZ);

            // posX (east, normal +X). cross((B-A), (C-A)) must point +X. With A on the face,
            // pick B going +Y and C going +Z so the cross-product right-hand rule gives +X.
            EmitFace(sb, brush,
                new Vector3(hi.X, lo.Y, lo.Z),
                new Vector3(hi.X, hi.Y, lo.Z),
                new Vector3(hi.X, lo.Y, hi.Z),
                posX);

            // negX (west, normal -X). Pick B going +Z and C going +Y for cross → -X.
            EmitFace(sb, brush,
                new Vector3(lo.X, lo.Y, lo.Z),
                new Vector3(lo.X, lo.Y, hi.Z),
                new Vector3(lo.X, hi.Y, lo.Z),
                negX);

            // posY (north, normal +Y)
            EmitFace(sb, brush,
                new Vector3(lo.X, hi.Y, lo.Z),
                new Vector3(lo.X, hi.Y, hi.Z),
                new Vector3(hi.X, hi.Y, lo.Z),
                posY);

            // negY (south, normal -Y)
            EmitFace(sb, brush,
                new Vector3(lo.X, lo.Y, lo.Z),
                new Vector3(hi.X, lo.Y, lo.Z),
                new Vector3(lo.X, lo.Y, hi.Z),
                negY);

            sb.Append("}\n");
            brush.OriginalText = sb.ToString();
            brush.Mins = lo;
            brush.Maxs = hi;
            return brush;
        }

        /// <summary>Build a hollow rectangular room: 6 axis-aligned wall brushes, each
        /// <paramref name="wallThickness"/> units thick, surrounding an interior of
        /// <paramref name="lo"/>..<paramref name="hi"/>. Returns the six brushes (caller adds
        /// them to a worldspawn entity).</summary>
        public static MapBrush[] HollowRoom(Vector3 lo, Vector3 hi, float wallThickness = 16f, string shader = "common/caulk")
        {
            float t = wallThickness;
            return new[]
            {
                Box(new Vector3(lo.X - t, lo.Y - t, lo.Z - t), new Vector3(hi.X + t, hi.Y + t, lo.Z),       shader), // floor
                Box(new Vector3(lo.X - t, lo.Y - t, hi.Z),     new Vector3(hi.X + t, hi.Y + t, hi.Z + t),   shader), // ceiling
                Box(new Vector3(lo.X - t, lo.Y - t, lo.Z),     new Vector3(lo.X,     hi.Y + t, hi.Z),       shader), // west
                Box(new Vector3(hi.X,     lo.Y - t, lo.Z),     new Vector3(hi.X + t, hi.Y + t, hi.Z),       shader), // east
                Box(new Vector3(lo.X,     lo.Y - t, lo.Z),     new Vector3(hi.X,     lo.Y,     hi.Z),       shader), // south
                Box(new Vector3(lo.X,     hi.Y,     lo.Z),     new Vector3(hi.X,     hi.Y + t, hi.Z),       shader), // north
            };
        }

        // ---- internals ----

        private static void EmitFace(StringBuilder sb, MapBrush brush, Vector3 a, Vector3 b, Vector3 c, string shader)
        {
            // Stash the parsed plane for collision use. Our internal convention is
            // outward-facing normals from cross(B-A, C-A); BspCollision relies on this.
            Vector3 normal = Vector3.Normalize(Vector3.Cross(b - a, c - a));
            float dist = Vector3.Dot(normal, a);
            brush.Sides.Add(new MapPlane(normal, dist, shader));
            // Emit the textual brush side. **q3map2's PlaneFromPoints uses cross(C-A, B-A)**
            // (see qmath.h PlaneFromPoints), the opposite winding from our cross(B-A, C-A)
            // outward-normal computation. To get q3map2 to see the same outward normal we
            // emit the points in (A, C, B) order. Without this swap every brush is silently
            // inside-out and q3map2 produces 0 surfaces with no diagnostic.
            CultureInfo inv = CultureInfo.InvariantCulture;
            sb.AppendFormat(inv,
                "( {0} {1} {2} ) ( {3} {4} {5} ) ( {6} {7} {8} ) ( ( 0.0625 0 0 ) ( 0 0.0625 0 ) ) {9} 0 0 0\n",
                a.X, a.Y, a.Z, c.X, c.Y, c.Z, b.X, b.Y, b.Z, shader);
        }
    }
}
