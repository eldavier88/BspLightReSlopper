using System;
using BspLightReSlopper.Bsp;

namespace BspLightReSlopper.Collision
{
    /// <summary>
    /// Wraps the q3 BSP <c>Visibility</c> lump (PVS) for O(1) cluster-vs-cluster visibility
    /// queries. Layout: 4 bytes <c>numClusters</c>, 4 bytes <c>bytesPerCluster</c>, then
    /// <c>numClusters * bytesPerCluster</c> packed visibility bits where bit <c>j</c> of
    /// row <c>i</c> is set when cluster <c>j</c> is potentially visible from cluster
    /// <c>i</c>.
    ///
    /// <para>Used by the visibility-aware light estimator to skip texel samples that lie in
    /// clusters the candidate light can't possibly illuminate. Per-sample raycasting via
    /// <see cref="BspCollision.LineOfSight"/> is too slow for real maps (50µs × 100 samples
    /// × 1000 candidates × 30 rounds × 60 maps = ~21 hours); a bit-lookup PVS check costs
    /// ~5ns each.</para>
    ///
    /// <para>If the BSP lacks vis info (no <c>-vis</c> stage was run, or single-leaf maps
    /// where q3map2 doesn't write portals), <see cref="HasVis"/> is false and
    /// <see cref="CanSee"/> conservatively returns true.</para>
    /// </summary>
    public sealed class BspVis
    {
        private readonly byte[] _bytes;
        public int NumClusters { get; }
        public int BytesPerCluster { get; }
        public bool HasVis => _bytes.Length > 8 && NumClusters > 0 && BytesPerCluster > 0;

        public BspVis(BspFile bsp)
        {
            _bytes = bsp.Visibility ?? Array.Empty<byte>();
            if (_bytes.Length >= 8)
            {
                NumClusters = BitConverter.ToInt32(_bytes, 0);
                BytesPerCluster = BitConverter.ToInt32(_bytes, 4);
            }
            // Sanity: header may report sizes that don't fit in the lump; treat as no-vis.
            int needed = 8 + NumClusters * BytesPerCluster;
            if (needed > _bytes.Length)
            {
                NumClusters = 0;
                BytesPerCluster = 0;
            }
        }

        /// <summary>True when cluster <paramref name="from"/> can potentially see cluster
        /// <paramref name="to"/>. If vis is missing, returns true (conservative — we'd
        /// rather over-include than silently lose lights).</summary>
        public bool CanSee(int from, int to)
        {
            if (!HasVis) return true;
            // Cluster -1 means "solid" / "outside vis space"; treat as universally visible
            // so we don't accidentally drop lights placed in solid leaves (the brush-content
            // check upstream already handles those).
            if (from < 0 || to < 0) return true;
            if (from >= NumClusters || to >= NumClusters) return true;
            int idx = 8 + from * BytesPerCluster + (to >> 3);
            if ((uint)idx >= (uint)_bytes.Length) return true;
            return (_bytes[idx] & (1 << (to & 7))) != 0;
        }
    }
}
