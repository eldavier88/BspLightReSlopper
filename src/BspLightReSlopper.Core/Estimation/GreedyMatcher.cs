using System.Collections.Generic;
using System.Numerics;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// Distance-first greedy 1:1 matcher between ground-truth lights and estimated lights.
    /// Used by the verify harness. Hungarian assignment would be optimal; greedy is fine
    /// for the typical case of a few dozen lights per map and within-cluster ambiguity is
    /// already handled by the iterative estimator.
    /// </summary>
    public static class GreedyMatcher
    {
        public sealed class Pair
        {
            public int TruthIndex { get; init; }
            public int EstIndex { get; init; }
            public float DistUnits { get; init; }
            public float ColorDeltaE { get; init; }
            public float IntensityRatio { get; init; }
        }

        public sealed class MatchResult
        {
            public IReadOnlyList<Pair> Matches { get; init; } = System.Array.Empty<Pair>();
            public IReadOnlyList<int> UnmatchedTruth { get; init; } = System.Array.Empty<int>();
            public IReadOnlyList<int> UnmatchedEst { get; init; } = System.Array.Empty<int>();
            public float MeanPositionError { get; init; }
            public float MedianPositionError { get; init; }
            public float Recall { get; init; }
            public float Precision { get; init; }
        }

        public static MatchResult Match(
            IReadOnlyList<Vector3> truthOrigins, IReadOnlyList<Vector3> truthColors,
            IReadOnlyList<Vector3> estOrigins, IReadOnlyList<Vector3> estColors,
            float maxDistance)
        {
            var pairs = new List<(int t, int e, float d)>();
            for (int t = 0; t < truthOrigins.Count; t++)
                for (int e = 0; e < estOrigins.Count; e++)
                {
                    float d = (truthOrigins[t] - estOrigins[e]).Length();
                    if (d <= maxDistance) pairs.Add((t, e, d));
                }
            pairs.Sort((a, b) => a.d.CompareTo(b.d));

            var usedT = new bool[truthOrigins.Count];
            var usedE = new bool[estOrigins.Count];
            var matches = new List<Pair>();
            foreach (var (t, e, d) in pairs)
            {
                if (usedT[t] || usedE[e]) continue;
                usedT[t] = true; usedE[e] = true;
                Vector3 tc = truthColors[t];
                Vector3 ec = estColors[e];
                float deltaE = ColorDelta76(tc, ec);
                matches.Add(new Pair { TruthIndex = t, EstIndex = e, DistUnits = d, ColorDeltaE = deltaE, IntensityRatio = 0 });
            }
            var unmT = new List<int>();
            for (int t = 0; t < truthOrigins.Count; t++) if (!usedT[t]) unmT.Add(t);
            var unmE = new List<int>();
            for (int e = 0; e < estOrigins.Count; e++) if (!usedE[e]) unmE.Add(e);

            float meanPos = 0, medianPos = 0;
            if (matches.Count > 0)
            {
                float sum = 0;
                var dists = new List<float>(matches.Count);
                foreach (var m in matches) { sum += m.DistUnits; dists.Add(m.DistUnits); }
                meanPos = sum / matches.Count;
                dists.Sort();
                medianPos = dists[dists.Count / 2];
            }

            int truthCount = truthOrigins.Count;
            int estCount = estOrigins.Count;
            float recall = truthCount > 0 ? (float)matches.Count / truthCount : 0;
            float precision = estCount > 0 ? (float)matches.Count / estCount : 0;

            return new MatchResult
            {
                Matches = matches,
                UnmatchedTruth = unmT,
                UnmatchedEst = unmE,
                MeanPositionError = meanPos,
                MedianPositionError = medianPos,
                Recall = recall,
                Precision = precision,
            };
        }

        // CIE76-ish: euclidean in normalised RGB. Our colors are linear-ish 0..1; this is
        // good enough for hue/chroma similarity ordering.
        private static float ColorDelta76(Vector3 a, Vector3 b)
        {
            return (a - b).Length();
        }
    }
}
