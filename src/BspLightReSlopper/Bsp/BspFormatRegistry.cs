using System.Collections.Generic;
using BspLightReSlopper.Bsp.Formats;

namespace BspLightReSlopper.Bsp
{
    /// <summary>
    /// Registry of known (magic, version) BSP formats. Add a new format by registering an
    /// instance here. Look-ups are case-sensitive on magic, exact on version.
    /// </summary>
    public sealed class BspFormatRegistry
    {
        private readonly Dictionary<(string, int), IBspFormat> _byKey = new();
        private readonly List<IBspFormat> _all = new();

        public BspFormatRegistry Register(IBspFormat fmt)
        {
            _byKey[(fmt.Magic, fmt.Version)] = fmt;
            _all.Add(fmt);
            return this;
        }

        public IBspFormat? Find(string magic, int version)
            => _byKey.TryGetValue((magic, version), out var f) ? f : null;

        public IReadOnlyList<IBspFormat> All => _all;

        /// <summary>The default registry: IBSP46 (Q3) + RBSP1 (JK2/JKA/SoF2).</summary>
        public static BspFormatRegistry Default { get; } = new BspFormatRegistry()
            .Register(new Ibsp46Format())
            .Register(new Rbsp1Format());
    }
}
