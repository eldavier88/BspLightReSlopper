using System.Collections.Generic;
using System.Numerics;

namespace BspLightReSlopper.MapFile
{
    /// <summary>
    /// In-memory model of a Quake-3-family <c>.map</c> source file.
    ///
    /// <para>The parser separates concerns intentionally: <see cref="MapEntity.Keys"/> is the
    /// mutable key/value store, while <see cref="MapEntity.Brushes"/> and
    /// <see cref="MapEntity.Patches"/> carry the geometry. We keep the original raw text for
    /// each brush/patch so that a round-trip write produces byte-stable geometry without us
    /// having to re-emit the exact same plane / texdef floats. Only the entity-level key/value
    /// list and the entity collection itself are rebuilt on write — which is exactly the
    /// surface the random-light-scatter pipeline needs to mutate.</para>
    ///
    /// <para>This model deliberately does NOT track contents flags per brush from a shader
    /// table; for point-in-solid we treat every brush as a candidate solid. Trigger / clip
    /// shaders are filtered downstream in <c>BrushCollision</c>.</para>
    /// </summary>
    public sealed class MapFile
    {
        public List<MapEntity> Entities { get; } = new();

        /// <summary>The map's "format dialect" — kept so the writer can emit the same brush
        /// header (<c>brushDef</c> vs <c>brushDef3</c> vs legacy).</summary>
        public MapBrushDialect Dialect { get; set; } = MapBrushDialect.BrushDef;
    }

    public enum MapBrushDialect
    {
        /// <summary>Legacy Quake-1/2/3 brush sides: <c>( x y z ) ( ) ( ) shader u v rot su sv</c>.</summary>
        Legacy,
        /// <summary>Q3 "brush primitives" with <c>brushDef</c> wrapper and texdef matrix.</summary>
        BrushDef,
        /// <summary>Doom3-style with <c>brushDef3</c> wrapper.</summary>
        BrushDef3,
    }

    public sealed class MapEntity
    {
        /// <summary>Key/value pairs, insertion-ordered. Re-emitted on write in this order.</summary>
        public List<KeyValuePair<string, string>> Keys { get; } = new();
        public List<MapBrush> Brushes { get; } = new();
        public List<MapPatch> Patches { get; } = new();

        public string? GetKey(string key)
        {
            foreach (var kv in Keys) if (kv.Key == key) return kv.Value;
            return null;
        }

        public void SetKey(string key, string value)
        {
            for (int i = 0; i < Keys.Count; i++)
                if (Keys[i].Key == key) { Keys[i] = new KeyValuePair<string, string>(key, value); return; }
            Keys.Add(new KeyValuePair<string, string>(key, value));
        }

        public bool RemoveKey(string key)
        {
            for (int i = 0; i < Keys.Count; i++)
                if (Keys[i].Key == key) { Keys.RemoveAt(i); return true; }
            return false;
        }

        public string? ClassName => GetKey("classname");

        public bool TryGetOrigin(out Vector3 origin)
        {
            origin = default;
            string? s = GetKey("origin");
            if (string.IsNullOrEmpty(s)) return false;
            var parts = s.Split(' ');
            if (parts.Length < 3) return false;
            return float.TryParse(parts[0], System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out origin.X)
                & float.TryParse(parts[1], System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out origin.Y)
                & float.TryParse(parts[2], System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out origin.Z);
        }
    }

    /// <summary>One brush: 4..N planes whose mutual intersection defines the convex polyhedron.
    /// We carry both the parsed planes (for collision) and the raw original text (for round-trip).</summary>
    public sealed class MapBrush
    {
        public List<MapPlane> Sides { get; } = new();
        /// <summary>Verbatim text inside the brush block (between <c>{</c> and the matching
        /// <c>}</c>). Preserved so the writer can emit byte-stable geometry; the parser only
        /// uses <see cref="Sides"/>.</summary>
        public string OriginalText { get; set; } = string.Empty;
        /// <summary>Brush content kind (legacy / brushDef / brushDef3) — preserved on write.</summary>
        public MapBrushDialect Dialect { get; set; } = MapBrushDialect.BrushDef;
        /// <summary>True if any side's shader is in the "non-solid" set (clip, trigger, hint,
        /// origin, areaportal, common/skip, etc.). Such brushes must not be treated as solid
        /// when testing whether a candidate light position is inside the world.</summary>
        public bool IsNonSolid { get; set; }

        // ---- Cached AABB derived from plane intersections ----
        public Vector3 Mins { get; set; } = new(float.PositiveInfinity);
        public Vector3 Maxs { get; set; } = new(float.NegativeInfinity);

        public bool BoundsValid => Mins.X <= Maxs.X && Mins.Y <= Maxs.Y && Mins.Z <= Maxs.Z;
    }

    /// <summary>One brush plane. <c>Normal · p &lt;= Dist</c> defines the inside half-space
    /// (q3 brush convention: the brush is the intersection of all <c>Normal · p &lt;= Dist</c>
    /// half-spaces). The shader name preserves the texture / surface attribute the side carries.</summary>
    public readonly struct MapPlane
    {
        public Vector3 Normal { get; }
        public float Dist { get; }
        public string Shader { get; }
        public MapPlane(Vector3 normal, float dist, string shader)
        {
            Normal = normal; Dist = dist; Shader = shader;
        }
    }

    /// <summary>Curved patch surface — preserved as opaque text. We don't tessellate or modify
    /// patches, but they need to round-trip through write so the recompiled BSP looks like the
    /// original.</summary>
    public sealed class MapPatch
    {
        public string OriginalText { get; init; } = string.Empty;
    }
}
