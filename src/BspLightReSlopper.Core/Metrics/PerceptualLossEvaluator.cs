using System;
using System.Collections.Generic;
using BspLightReSlopper.Sampling;

namespace BspLightReSlopper.Metrics
{
    /// <summary>
    /// Compares baked lightmap observations from a reference BSP to those from a recompiled
    /// BSP by pairing texel samples in world space (voxel nearest-neighbour). The primary
    /// score is mean squared error on linear RGB — a proxy for visible lightmap difference.
    /// </summary>
    public sealed class PerceptualLossEvaluator
    {
        public sealed class Options
        {
            /// <summary>Voxel size (q3 units) for spatial hashing. 64 matches typical light grid.</summary>
            public float CellSize { get; init; } = 64f;

            /// <summary>Reject pairings farther than this (world units); such candidate texels
            /// count toward <see cref="Result.UnmatchedCandidates"/>.</summary>
            public float MaxPairDistance { get; init; } = 192f;
        }

        public sealed class Result
        {
            public float MeanSquaredRgb { get; init; }
            public float RootMeanSquaredRgb { get; init; }
            public float MeanAbsLuma { get; init; }
            public int PairsUsed { get; init; }
            public int UnmatchedReference { get; init; }
            public int UnmatchedCandidates { get; init; }
        }

        private readonly struct CellKey : IEquatable<CellKey>
        {
            public readonly int X, Y, Z;
            public CellKey(int x, int y, int z) { X = x; Y = y; Z = z; }
            public bool Equals(CellKey other) => X == other.X && Y == other.Y && Z == other.Z;
            public override bool Equals(object? obj) => obj is CellKey o && Equals(o);
            public override int GetHashCode() => HashCode.Combine(X, Y, Z);
        }

        /// <summary>
        /// For each candidate sample, find the nearest reference sample among voxels within
        /// one cell of the candidate's voxel (27 cells). Accumulate per-channel squared error.
        /// </summary>
        public static Result Evaluate(
            IReadOnlyList<TexelSample> referenceSamples,
            IReadOnlyList<TexelSample> candidateSamples,
            Options? options = null)
        {
            options ??= new Options();
            float cell = Math.Max(4f, options.CellSize);
            float maxD = options.MaxPairDistance;
            float maxD2 = maxD * maxD;

            var grid = new Dictionary<CellKey, List<int>>();
            for (int i = 0; i < referenceSamples.Count; i++)
            {
                var p = referenceSamples[i].World;
                var key = new CellKey(
                    (int)MathF.Floor(p.X / cell),
                    (int)MathF.Floor(p.Y / cell),
                    (int)MathF.Floor(p.Z / cell));
                if (!grid.TryGetValue(key, out var list))
                {
                    list = new List<int>();
                    grid[key] = list;
                }
                list.Add(i);
            }

            double sumSq = 0;
            double sumAbsLu = 0;
            int pairs = 0;
            int unmatchedCand = 0;

            for (int ci = 0; ci < candidateSamples.Count; ci++)
            {
                var c = candidateSamples[ci];
                var cp = c.World;
                int cx = (int)MathF.Floor(cp.X / cell);
                int cy = (int)MathF.Floor(cp.Y / cell);
                int cz = (int)MathF.Floor(cp.Z / cell);

                int best = -1;
                float bestD2 = maxD2 + 1f;
                for (int ox = -1; ox <= 1; ox++)
                    for (int oy = -1; oy <= 1; oy++)
                        for (int oz = -1; oz <= 1; oz++)
                        {
                            if (!grid.TryGetValue(new CellKey(cx + ox, cy + oy, cz + oz), out var refs))
                                continue;
                            for (int k = 0; k < refs.Count; k++)
                            {
                                int ri = refs[k];
                                var r = referenceSamples[ri].World;
                                float dx = r.X - cp.X, dy = r.Y - cp.Y, dz = r.Z - cp.Z;
                                float d2 = dx * dx + dy * dy + dz * dz;
                                if (d2 < bestD2)
                                {
                                    bestD2 = d2;
                                    best = ri;
                                }
                            }
                        }

                if (best < 0 || bestD2 > maxD2)
                {
                    unmatchedCand++;
                    continue;
                }

                var oref = referenceSamples[best].Observed;
                var ocnd = c.Observed;
                float er = oref.X - ocnd.X, eg = oref.Y - ocnd.Y, eb = oref.Z - ocnd.Z;
                sumSq += er * er + eg * eg + eb * eb;
                float lr = 0.2126f * oref.X + 0.7152f * oref.Y + 0.0722f * oref.Z;
                float lc = 0.2126f * ocnd.X + 0.7152f * ocnd.Y + 0.0722f * ocnd.Z;
                sumAbsLu += MathF.Abs(lr - lc);
                pairs++;
            }

            int unmatchedRef = 0; // optional: expensive; skip or sample
            float meanSq = pairs > 0 ? (float)(sumSq / (pairs * 3.0)) : 0f;
            float rmse = meanSq > 0 ? MathF.Sqrt(meanSq) : 0f;
            float meanAbsLu = pairs > 0 ? (float)(sumAbsLu / pairs) : 0f;

            return new Result
            {
                MeanSquaredRgb = meanSq,
                RootMeanSquaredRgb = rmse,
                MeanAbsLuma = meanAbsLu,
                PairsUsed = pairs,
                UnmatchedReference = unmatchedRef,
                UnmatchedCandidates = unmatchedCand,
            };
        }
    }
}
