using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Sampling;

namespace BspLightReSlopper.Heuristics
{
    /// <summary>
    /// Phase P1.4 — semantic room detection. Clusters BSP leafs into connected rooms via
    /// portal adjacency, classifies each room by geometry and dominant shader, and
    /// applies domain-specific lighting heuristics (corridor → linear strips, arena → grid,
    /// small room → single central light, cave → warm entrance lights).
    ///
    /// <para>The room list is fed into <see cref="LightEstimator"/> as seed candidates
    /// and into the Bayesian prior for light count inference.</para>
    /// </summary>
    public static class RoomDetector
    {
        public enum RoomKind { Unknown, Corridor, Arena, ControlRoom, Cave, Outdoor }

        public sealed class Room
        {
            /// <summary>Leaf indices belonging to this room.</summary>
            public IReadOnlyList<int> Leafs { get; init; } = Array.Empty<int>();
            /// <summary>World-space bounding box.</summary>
            public Vector3 Min { get; init; }
            public Vector3 Max { get; init; }
            /// <summary>Volume in cubic units.</summary>
            public float Volume { get; init; }
            /// <summary>Approximate floor height (median of leaf mins.Z).</summary>
            public float FloorZ { get; init; }
            /// <summary>Number of leafs that connect to another room (doorways).</summary>
            public int DoorwayCount { get; init; }
            /// <summary>Classified room type.</summary>
            public RoomKind Kind { get; init; }
            /// <summary>Dominant shader name (by surface area).</summary>
            public string DominantShader { get; init; } = "";
            /// <summary>Heuristic light count for this room type.</summary>
            public int SuggestedLightCount { get; init; }
            /// <summary>Typical light intensity range for this room type.</summary>
            public (float min, float max) SuggestedIntensityRange { get; init; }
            /// <summary>Typical light spacing for grid/strip placement.</summary>
            public float SuggestedSpacing { get; init; }
        }

        public sealed class Result
        {
            public IReadOnlyList<Room> Rooms { get; init; } = Array.Empty<Room>();
            public int LeafCount { get; init; }
            public int UnassignedLeafCount { get; init; }
        }

        /// <summary>
        /// Detect rooms by flood-filling portal-connected leafs with similar floor height.
        /// A "portal" is any pair of leafs that share a visible surface (same cluster in PVS).
        /// </summary>
        public static Result Detect(BspFile bsp, IReadOnlyList<TexelSample>? samples = null)
        {
            int nLeafs = bsp.Leafs.Count;
            // Degenerate-BSP guard: synthetic / minimal BSPs (used by tests and edge-case
            // small maps) may ship without a node tree, leafs, or planes. Without those
            // we cannot do leaf classification — return an empty room set instead of
            // crashing in FindLeaf().
            if (nLeafs == 0 || bsp.Nodes.Count == 0 || bsp.Planes.Count == 0)
            {
                return new Result { Rooms = Array.Empty<Room>(), LeafCount = nLeafs, UnassignedLeafCount = nLeafs };
            }
            var visited = new bool[nLeafs];
            var rooms = new List<Room>();
            int unassigned = 0;

            // Pre-compute adjacency: leaf i shares a visible surface with leaf j.
            var adj = BuildAdjacency(bsp);

            for (int start = 0; start < nLeafs; start++)
            {
                if (visited[start]) continue;
                var leaf = bsp.Leafs[start];
                if (leaf.Cluster < 0) { visited[start] = true; unassigned++; continue; }

                // Flood-fill from this leaf.
                var roomLeafs = new List<int>();
                var queue = new Queue<int>();
                queue.Enqueue(start);
                visited[start] = true;
                float floorZSum = 0;
                int floorCount = 0;

                while (queue.Count > 0)
                {
                    int cur = queue.Dequeue();
                    roomLeafs.Add(cur);

                    // Track floor height (approximate by leaf bounds bottom).
                    var cl = bsp.Leafs[cur];
                    if (TryGetLeafBounds(bsp, cur, out var lo, out var hi))
                    {
                        floorZSum += lo.Z;
                        floorCount++;
                    }

                    if (adj.TryGetValue(cur, out var neighbors))
                    {
                        foreach (int nb in neighbors)
                        {
                            if (visited[nb]) continue;
                            var nl = bsp.Leafs[nb];
                            if (nl.Cluster < 0) { visited[nb] = true; continue; }
                            // Only merge if floor heights are similar (within 128u = one floor).
                            if (floorCount > 0 && TryGetLeafBounds(bsp, nb, out var nlo, out _))
                            {
                                float curFloor = floorZSum / floorCount;
                                if (MathF.Abs(nlo.Z - curFloor) > 128f) continue;
                            }
                            visited[nb] = true;
                            queue.Enqueue(nb);
                        }
                    }
                }

                if (roomLeafs.Count < 2) { unassigned += roomLeafs.Count; continue; }

                var room = CharacterizeRoom(bsp, roomLeafs, adj);
                rooms.Add(room);
            }

            return new Result
            {
                Rooms = rooms,
                LeafCount = nLeafs,
                UnassignedLeafCount = unassigned,
            };
        }

        private static Dictionary<int, HashSet<int>> BuildAdjacency(BspFile bsp)
        {
            var adj = new Dictionary<int, HashSet<int>>();
            int nSurfaces = bsp.Surfaces.Count;
            for (int si = 0; si < nSurfaces; si++)
            {
                var s = bsp.Surfaces[si];
                if (s.NumIndexes < 3) continue;
                // Surface visibility: find which leafs this surface is in.
                // Approximation: use the surface's first vertex as a sample point.
                if (s.FirstVert < 0 || s.FirstVert >= bsp.DrawVerts.Count) continue;
                Vector3 p = bsp.DrawVerts[s.FirstVert].Xyz;
                int leaf1 = FindLeaf(bsp, p);
                if (leaf1 < 0) continue;
                if (!adj.TryGetValue(leaf1, out var set1)) { set1 = new HashSet<int>(); adj[leaf1] = set1; }

                // Also check a few more points along the surface to find other leafs.
                for (int i = 1; i < Math.Min(s.NumVerts, 8); i++)
                {
                    if (s.FirstVert + i >= bsp.DrawVerts.Count) break;
                    Vector3 pi = bsp.DrawVerts[s.FirstVert + i].Xyz;
                    int leaf2 = FindLeaf(bsp, pi);
                    if (leaf2 >= 0 && leaf2 != leaf1)
                    {
                        set1.Add(leaf2);
                        if (!adj.TryGetValue(leaf2, out var set2)) { set2 = new HashSet<int>(); adj[leaf2] = set2; }
                        set2.Add(leaf1);
                    }
                }
            }
            return adj;
        }

        private static int FindLeaf(BspFile bsp, Vector3 p)
        {
            // Defensive: degenerate BSPs (no BSP tree) have no leaf assignment. The
            // caller should normally have early-exited in Detect(), but be safe.
            if (bsp.Nodes.Count == 0 || bsp.Planes.Count == 0) return -1;
            int node = 0;
            while (node >= 0)
            {
                if (node >= bsp.Nodes.Count) return -1; // malformed BSP — abort traversal
                var n = bsp.Nodes[node];
                if (n.PlaneIndex < 0 || n.PlaneIndex >= bsp.Planes.Count) return -1;
                var plane = bsp.Planes[n.PlaneIndex];
                float d = Vector3.Dot(p, plane.Normal) - plane.Dist;
                node = d >= 0 ? n.Child0 : n.Child1;
            }
            return -1 - node; // leaf index
        }

        private static bool TryGetLeafBounds(BspFile bsp, int leafIndex, out Vector3 lo, out Vector3 hi)
        {
            lo = Vector3.Zero; hi = Vector3.Zero;
            if (leafIndex < 0 || leafIndex >= bsp.Leafs.Count) return false;
            // BSP leafs don't store AABB directly in our format; approximate from brush bounds.
            var leaf = bsp.Leafs[leafIndex];
            if (leaf.FirstLeafBrush < 0 || leaf.NumLeafBrushes <= 0) return false;
            lo = new Vector3(float.MaxValue, float.MaxValue, float.MaxValue);
            hi = new Vector3(float.MinValue, float.MinValue, float.MinValue);
            for (int i = 0; i < leaf.NumLeafBrushes; i++)
            {
                int bi = bsp.LeafBrushes[leaf.FirstLeafBrush + i];
                if (bi < 0 || bi >= bsp.Brushes.Count) continue;
                var brush = bsp.Brushes[bi];
                for (int s = 0; s < brush.NumSides; s++)
                {
                    int si = brush.FirstSide + s;
                    if (si < 0 || si >= bsp.BrushSides.Count) continue;
                    var side = bsp.BrushSides[si];
                    if (side.PlaneIndex < 0 || side.PlaneIndex >= bsp.Planes.Count) continue;
                    var plane = bsp.Planes[side.PlaneIndex];
                    // Very coarse: use plane distance as bound hint.
                    if (MathF.Abs(plane.Normal.X) > 0.9f)
                    {
                        if (plane.Normal.X > 0) hi.X = MathF.Max(hi.X, plane.Dist);
                        else lo.X = MathF.Min(lo.X, -plane.Dist);
                    }
                    if (MathF.Abs(plane.Normal.Y) > 0.9f)
                    {
                        if (plane.Normal.Y > 0) hi.Y = MathF.Max(hi.Y, plane.Dist);
                        else lo.Y = MathF.Min(lo.Y, -plane.Dist);
                    }
                    if (MathF.Abs(plane.Normal.Z) > 0.9f)
                    {
                        if (plane.Normal.Z > 0) hi.Z = MathF.Max(hi.Z, plane.Dist);
                        else lo.Z = MathF.Min(lo.Z, -plane.Dist);
                    }
                }
            }
            return lo.X != float.MaxValue;
        }

        private static Room CharacterizeRoom(BspFile bsp, List<int> leafs, Dictionary<int, HashSet<int>> adj)
        {
            // Compute bounding box and doorway count.
            var lo = new Vector3(float.MaxValue, float.MaxValue, float.MaxValue);
            var hi = new Vector3(float.MinValue, float.MinValue, float.MinValue);
            float floorZSum = 0;
            int doorwayCount = 0;
            var shaderArea = new Dictionary<string, float>(StringComparer.OrdinalIgnoreCase);

            foreach (int li in leafs)
            {
                if (TryGetLeafBounds(bsp, li, out var llo, out var lhi))
                {
                    lo = Vector3.Min(lo, llo);
                    hi = Vector3.Max(hi, lhi);
                    floorZSum += llo.Z;
                }

                if (adj.TryGetValue(li, out var neighbors))
                {
                    int crossRoom = 0;
                    foreach (int nb in neighbors) if (!leafs.Contains(nb)) crossRoom++;
                    if (crossRoom > 0) doorwayCount++;
                }

                // Accumulate shader area (approximate by leaf surface count).
                var leaf = bsp.Leafs[li];
                for (int si = leaf.FirstLeafSurface; si < leaf.FirstLeafSurface + leaf.NumLeafSurfaces; si++)
                {
                    if (si < 0 || si >= bsp.LeafSurfaces.Count) continue;
                    int surfIdx = bsp.LeafSurfaces[si];
                    if (surfIdx < 0 || surfIdx >= bsp.Surfaces.Count) continue;
                    var surf = bsp.Surfaces[surfIdx];
                    if (surf.ShaderIndex < 0 || surf.ShaderIndex >= bsp.Shaders.Count) continue;
                    string name = bsp.Shaders[surf.ShaderIndex].Name ?? "";
                    if (!shaderArea.TryGetValue(name, out var a)) a = 0;
                    shaderArea[name] = a + 1;
                }
            }

            Vector3 size = hi - lo;
            float volume = size.X * size.Y * size.Z;
            float floorZ = floorZSum / Math.Max(1, leafs.Count);
            string dominantShader = shaderArea.OrderByDescending(kv => kv.Value).FirstOrDefault().Key ?? "";

            // Classification heuristics.
            RoomKind kind = RoomKind.Unknown;
            int suggestedLights = 1;
            (float minI, float maxI) intensity = (100f, 400f);
            float spacing = 256f;

            float aspectXY = MathF.Max(size.X, size.Y) / MathF.Max(1f, MathF.Min(size.X, size.Y));
            bool isTall = size.Z > 192f;
            bool isWide = MathF.Max(size.X, size.Y) > 1024f;
            bool isNarrow = aspectXY > 3f;
            bool hasNaturalShader = dominantShader.Contains("rock") || dominantShader.Contains("cave")
                || dominantShader.Contains("dirt") || dominantShader.Contains("sand");
            bool hasTechShader = dominantShader.Contains("metal") || dominantShader.Contains("floor")
                || dominantShader.Contains("wall") || dominantShader.Contains("ceiling");

            if (isNarrow && doorwayCount >= 2)
            {
                kind = RoomKind.Corridor;
                suggestedLights = Math.Max(1, (int)(MathF.Max(size.X, size.Y) / 300f));
                intensity = (150f, 300f);
                spacing = 300f;
            }
            else if (volume > 20_000_000f) // > 20M cubic units = large arena/hall
            {
                kind = RoomKind.Arena;
                suggestedLights = Math.Max(4, (int)(volume / 5_000_000f));
                intensity = (200f, 500f);
                spacing = 512f;
            }
            else if (hasNaturalShader && doorwayCount <= 2)
            {
                kind = RoomKind.Cave;
                suggestedLights = Math.Max(1, (int)(volume / 2_000_000f));
                intensity = (250f, 600f); // warmer, stronger
                spacing = 400f;
            }
            else if (volume < 500_000f) // small room
            {
                kind = RoomKind.ControlRoom;
                suggestedLights = 1;
                intensity = (100f, 250f);
                spacing = 0f; // single central
            }
            else
            {
                kind = RoomKind.ControlRoom;
                suggestedLights = Math.Max(2, (int)(volume / 1_000_000f));
                intensity = (150f, 350f);
                spacing = 384f;
            }

            return new Room
            {
                Leafs = leafs,
                Min = lo, Max = hi,
                Volume = volume,
                FloorZ = floorZ,
                DoorwayCount = doorwayCount,
                Kind = kind,
                DominantShader = dominantShader,
                SuggestedLightCount = suggestedLights,
                SuggestedIntensityRange = intensity,
                SuggestedSpacing = spacing,
            };
        }
    }
}
