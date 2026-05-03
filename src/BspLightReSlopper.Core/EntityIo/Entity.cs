using System;
using System.Collections.Generic;
using System.Globalization;
using System.Numerics;

namespace BspLightReSlopper.EntityIo
{
    /// <summary>
    /// One entity from the BSP entity lump or a `.ent` file. Keys are case-sensitive in
    /// the original q3 entity format, but most tooling and shaders treat them
    /// case-insensitively, so we follow suit.
    /// </summary>
    public sealed class Entity
    {
        private readonly Dictionary<string, string> _kv = new(StringComparer.OrdinalIgnoreCase);
        private readonly List<string> _orderedKeys = new();

        public string ClassName => Get("classname") ?? string.Empty;

        public IReadOnlyDictionary<string, string> Pairs => _kv;
        public IReadOnlyList<string> OrderedKeys => _orderedKeys;

        public string? Get(string key) => _kv.TryGetValue(key, out var v) ? v : null;

        public void Set(string key, string value)
        {
            if (!_kv.ContainsKey(key)) _orderedKeys.Add(key);
            _kv[key] = value;
        }

        public bool TryGetVector3(string key, out Vector3 v)
        {
            v = Vector3.Zero;
            string? s = Get(key);
            if (s == null) return false;
            string[] parts = s.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length < 3) return false;
            if (!float.TryParse(parts[0], NumberStyles.Float, CultureInfo.InvariantCulture, out float x)) return false;
            if (!float.TryParse(parts[1], NumberStyles.Float, CultureInfo.InvariantCulture, out float y)) return false;
            if (!float.TryParse(parts[2], NumberStyles.Float, CultureInfo.InvariantCulture, out float z)) return false;
            v = new Vector3(x, y, z);
            return true;
        }

        public bool TryGetFloat(string key, out float f)
        {
            f = 0;
            string? s = Get(key);
            return s != null && float.TryParse(s.Trim(), NumberStyles.Float, CultureInfo.InvariantCulture, out f);
        }

        public bool TryGetInt(string key, out int n)
        {
            n = 0;
            string? s = Get(key);
            return s != null && int.TryParse(s.Trim(), NumberStyles.Integer, CultureInfo.InvariantCulture, out n);
        }
    }
}
