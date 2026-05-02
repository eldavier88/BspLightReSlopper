using System;
using System.Numerics;
using BspLightReSlopper.Bsp;

namespace BspLightReSlopper.Collision
{
    /// <summary>
    /// Quake-3-style collision queries against a loaded <see cref="BspFile"/>: point-leaf,
    /// point-contents, point-in-solid, outside-map, and segment-vs-world raycast.
    ///
    /// <para>Algorithm directly ported from <c>cm_*.c</c> in the Quake III Arena source
    /// (CM_PointLeafnum_r, CM_PointContents, CM_BoxTrace tree descent, CM_TestBoxInBrush).
    /// We omit area-portal handling and the curved patch collision module — they're not
    /// needed for the random-light-scatter use case (we just need "is this point inside a
    /// solid" and "is segment A→B unobstructed for the visibility option").</para>
    /// </summary>
    public sealed class BspCollision
    {
        // ---- Quake 3 contents bitflags (subset; see q3 source code/games.cpp) ----
        public const int CONTENTS_SOLID         = 0x00000001;
        public const int CONTENTS_LAVA          = 0x00000008;
        public const int CONTENTS_SLIME         = 0x00000010;
        public const int CONTENTS_WATER         = 0x00000020;
        public const int CONTENTS_FOG           = 0x00000040;
        public const int CONTENTS_AREAPORTAL    = 0x00008000;
        public const int CONTENTS_PLAYERCLIP    = 0x00010000;
        public const int CONTENTS_MONSTERCLIP   = 0x00020000;
        public const int CONTENTS_TELEPORTER    = 0x00040000;
        public const int CONTENTS_JUMPPAD       = 0x00080000;
        public const int CONTENTS_CLUSTERPORTAL = 0x00100000;
        public const int CONTENTS_DONOTENTER    = 0x00200000;
        public const int CONTENTS_TRIGGER       = 0x40000000;
        public const int CONTENTS_NODROP        = unchecked((int)0x80000000);

        /// <summary>"Inside a wall, in some kind of clip volume, or in any volume that should
        /// reject a placed light entity."</summary>
        public const int LightRejectMask = CONTENTS_SOLID | CONTENTS_PLAYERCLIP | CONTENTS_MONSTERCLIP
                                         | CONTENTS_DONOTENTER | CONTENTS_AREAPORTAL | CONTENTS_NODROP;

        private readonly BspFile _bsp;

        public BspCollision(BspFile bsp) { _bsp = bsp; }

        // ---------- point queries ----------

        /// <summary>Walk the BSP node tree from root and return the leaf that contains
        /// <paramref name="p"/>. Mirrors <c>CM_PointLeafnum_r</c>.</summary>
        public int PointLeaf(Vector3 p)
        {
            if (_bsp.Nodes.Count == 0) return -1;
            int num = 0;
            // Sentinel: q3 has up to ~MAX_MAP_NODES recursions; we cap defensively.
            for (int safety = 0; safety < _bsp.Nodes.Count + 8; safety++)
            {
                if (num < 0)
                {
                    return -1 - num;
                }
                var node = _bsp.Nodes[num];
                var plane = _bsp.Planes[node.PlaneIndex];
                float d = Vector3.Dot(plane.Normal, p) - plane.Dist;
                num = d >= 0 ? node.Child0 : node.Child1;
            }
            return -1; // malformed tree
        }

        /// <summary>Aggregate contents bitfield at <paramref name="p"/> by union over all
        /// leaf-brushes that contain <paramref name="p"/>.</summary>
        public int PointContents(Vector3 p)
        {
            int leafIdx = PointLeaf(p);
            if (leafIdx < 0 || leafIdx >= _bsp.Leafs.Count) return 0;
            var leaf = _bsp.Leafs[leafIdx];
            int contents = 0;
            for (int i = 0; i < leaf.NumLeafBrushes; i++)
            {
                int brushNum = _bsp.LeafBrushes[leaf.FirstLeafBrush + i];
                if (brushNum < 0 || brushNum >= _bsp.Brushes.Count) continue;
                if (BrushContainsPoint(brushNum, p))
                {
                    var b = _bsp.Brushes[brushNum];
                    if (b.ShaderIndex >= 0 && b.ShaderIndex < _bsp.Shaders.Count)
                        contents |= _bsp.Shaders[b.ShaderIndex].ContentFlags;
                }
            }
            return contents;
        }

        /// <summary>True if the point is inside any solid/clip/donotenter brush. We do NOT
        /// also look at the leaf's cluster sentinel: <c>cluster &lt; 0</c> is set both for
        /// real solid leaves AND for every leaf in a BSP that hasn't been through <c>-vis</c>
        /// yet, so it can't be used to distinguish the two cases. The brush-contents check is
        /// the reliable signal; it correctly handles JK2 maps (which were vis'd) and our
        /// synthetic <c>-bsp</c>-only test maps alike.</summary>
        public bool IsInsideSolid(Vector3 p)
        {
            return (PointContents(p) & LightRejectMask) != 0;
        }

        /// <summary>True when <paramref name="p"/> lies outside the worldspawn model's AABB
        /// (with a small slop so points sitting on a thin border still count as inside).
        /// q3 BSPs don't reliably encode "outside the map" via cluster numbering — leaves
        /// outside the playable hull typically still have cluster &gt;= 0 — so the AABB test
        /// is the most reliable signal we have.</summary>
        public bool IsOutsideMap(Vector3 p, float slop = 16f)
        {
            if (_bsp.Models.Count == 0) return false;
            var lo = _bsp.Models[0].Mins - new Vector3(slop);
            var hi = _bsp.Models[0].Maxs + new Vector3(slop);
            return p.X < lo.X || p.Y < lo.Y || p.Z < lo.Z
                || p.X > hi.X || p.Y > hi.Y || p.Z > hi.Z;
        }

        /// <summary>Aggregate "valid for placing a light" check: not inside a solid, not in
        /// a clip volume, not outside the map.</summary>
        public bool IsValidLightPosition(Vector3 p)
        {
            if (IsOutsideMap(p)) return false;
            if (IsInsideSolid(p)) return false;
            return true;
        }

        // ---------- raycast (CM_BoxTrace simplified to a thin segment) ----------

        public sealed class TraceResult
        {
            public bool AllSolid { get; set; }
            public bool StartSolid { get; set; }
            public float Fraction { get; set; } = 1f; // [0..1] of (end-start)
            public Vector3 EndPos { get; set; }
            public Vector3 PlaneNormal { get; set; }
            public float PlaneDist { get; set; }
            public int Contents { get; set; }
        }

        /// <summary>Shoot a thin segment from <paramref name="start"/> to <paramref name="end"/>
        /// and return the first solid hit. Mirrors CM_Trace (point variant) for box=zero, with
        /// the surface-on-line test from <c>CM_TraceThroughLeaf</c>.</summary>
        public TraceResult Trace(Vector3 start, Vector3 end, int contentMask = LightRejectMask)
        {
            var tr = new TraceResult { EndPos = end };
            if (_bsp.Nodes.Count == 0) return tr;
            RecursiveHullCheck(0, 0f, 1f, start, end, tr, contentMask);
            if (tr.Fraction == 1f) tr.EndPos = end;
            else tr.EndPos = start + (end - start) * tr.Fraction;
            return tr;
        }

        public bool LineOfSight(Vector3 a, Vector3 b, int contentMask = CONTENTS_SOLID)
        {
            return Trace(a, b, contentMask).Fraction >= 1f;
        }

        // Q3-style recursive descent. Splits the segment at each node plane and recurses on
        // sides that the segment crosses. When it hits a leaf, it tests against each leaf's
        // brushes via TraceThroughBrush.
        private void RecursiveHullCheck(int num, float p1f, float p2f, Vector3 p1, Vector3 p2, TraceResult tr, int contentMask)
        {
            if (tr.Fraction <= p1f) return; // already found a closer hit
            if (num < 0)
            {
                int leafIdx = -1 - num;
                if (leafIdx < 0 || leafIdx >= _bsp.Leafs.Count) return;
                var leaf = _bsp.Leafs[leafIdx];
                for (int i = 0; i < leaf.NumLeafBrushes; i++)
                {
                    int brushNum = _bsp.LeafBrushes[leaf.FirstLeafBrush + i];
                    if (brushNum < 0 || brushNum >= _bsp.Brushes.Count) continue;
                    var b = _bsp.Brushes[brushNum];
                    int bContents = (b.ShaderIndex >= 0 && b.ShaderIndex < _bsp.Shaders.Count)
                        ? _bsp.Shaders[b.ShaderIndex].ContentFlags : 0;
                    if ((bContents & contentMask) == 0) continue;
                    TraceThroughBrush(brushNum, p1, p2, tr, contentMask);
                    if (tr.Fraction == 0) return;
                }
                return;
            }

            var node = _bsp.Nodes[num];
            var plane = _bsp.Planes[node.PlaneIndex];
            float t1 = Vector3.Dot(plane.Normal, p1) - plane.Dist;
            float t2 = Vector3.Dot(plane.Normal, p2) - plane.Dist;

            // Both sides on positive side
            if (t1 >= 0 && t2 >= 0) { RecursiveHullCheck(node.Child0, p1f, p2f, p1, p2, tr, contentMask); return; }
            if (t1 < 0 && t2 < 0)   { RecursiveHullCheck(node.Child1, p1f, p2f, p1, p2, tr, contentMask); return; }

            // Crossing the plane — split the segment.
            int side; float frac1, frac2;
            float idist = 1f / (t1 - t2);
            if (t1 < t2) { side = 1; frac1 = (t1 + 0.001f) * idist; frac2 = (t1 - 0.001f) * idist; }
            else if (t1 > t2) { side = 0; frac1 = (t1 - 0.001f) * idist; frac2 = (t1 + 0.001f) * idist; }
            else { side = 0; frac1 = 1; frac2 = 0; }
            if (frac1 < 0) frac1 = 0; else if (frac1 > 1) frac1 = 1;
            if (frac2 < 0) frac2 = 0; else if (frac2 > 1) frac2 = 1;

            float midf = p1f + (p2f - p1f) * frac1;
            Vector3 mid = p1 + (p2 - p1) * frac1;
            int near = side == 0 ? node.Child0 : node.Child1;
            int far  = side == 0 ? node.Child1 : node.Child0;
            RecursiveHullCheck(near, p1f, midf, p1, mid, tr, contentMask);

            midf = p1f + (p2f - p1f) * frac2;
            mid = p1 + (p2 - p1) * frac2;
            RecursiveHullCheck(far, midf, p2f, mid, p2, tr, contentMask);
        }

        private void TraceThroughBrush(int brushNum, Vector3 p1, Vector3 p2, TraceResult tr, int contentMask)
        {
            var b = _bsp.Brushes[brushNum];
            if (b.NumSides == 0) return;
            int bContents = (b.ShaderIndex >= 0 && b.ShaderIndex < _bsp.Shaders.Count)
                ? _bsp.Shaders[b.ShaderIndex].ContentFlags : 0;

            float enterFrac = -1f;
            float leaveFrac = 1f;
            bool getOut = false;
            bool startsOut = false;
            Vector3 clipPlaneNormal = default;
            float clipPlaneDist = 0;

            for (int i = 0; i < b.NumSides; i++)
            {
                var side = _bsp.BrushSides[b.FirstSide + i];
                var plane = _bsp.Planes[side.PlaneIndex];
                float d1 = Vector3.Dot(plane.Normal, p1) - plane.Dist;
                float d2 = Vector3.Dot(plane.Normal, p2) - plane.Dist;
                if (d2 > 0) getOut = true;
                if (d1 > 0) startsOut = true;
                // Both sides outside this plane → segment doesn't hit this brush.
                if (d1 > 0 && (d2 >= d1 || d2 > 0)) return;
                if (d1 <= 0 && d2 <= 0) continue;

                if (d1 > d2)
                {
                    float f = (d1 - 0.0312f) / (d1 - d2);
                    if (f < 0) f = 0;
                    if (f > enterFrac)
                    {
                        enterFrac = f;
                        clipPlaneNormal = plane.Normal;
                        clipPlaneDist = plane.Dist;
                    }
                }
                else
                {
                    float f = (d1 + 0.0312f) / (d1 - d2);
                    if (f > 1) f = 1;
                    if (f < leaveFrac) leaveFrac = f;
                }
            }

            if (!startsOut)
            {
                tr.StartSolid = true;
                if (!getOut)
                {
                    tr.AllSolid = true;
                    tr.Fraction = 0;
                    tr.Contents = bContents;
                }
                return;
            }

            if (enterFrac < leaveFrac && enterFrac > -1)
            {
                if (enterFrac < tr.Fraction)
                {
                    if (enterFrac < 0) enterFrac = 0;
                    tr.Fraction = enterFrac;
                    tr.PlaneNormal = clipPlaneNormal;
                    tr.PlaneDist = clipPlaneDist;
                    tr.Contents = bContents;
                }
            }
        }

        private bool BrushContainsPoint(int brushNum, Vector3 p)
        {
            var b = _bsp.Brushes[brushNum];
            if (b.NumSides == 0) return false;
            for (int i = 0; i < b.NumSides; i++)
            {
                var side = _bsp.BrushSides[b.FirstSide + i];
                var plane = _bsp.Planes[side.PlaneIndex];
                if (Vector3.Dot(plane.Normal, p) - plane.Dist > 0) return false;
            }
            return true;
        }
    }
}
