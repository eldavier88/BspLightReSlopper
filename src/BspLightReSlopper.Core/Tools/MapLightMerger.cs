using System;
using System.Collections.Generic;
using System.Globalization;
using BspLightReSlopper.MapFile;
using MapFileT = BspLightReSlopper.MapFile.MapFile;

namespace BspLightReSlopper.Tools
{
    /// <summary>
    /// Strips <c>light</c> / spotlight companions from a parsed <see cref="MapFile"/> and
    /// inserts fresh <c>light</c> entities suitable for q3map2 relighting (no debug keys).
    /// </summary>
    public static class MapLightMerger
    {
        public sealed class Options
        {
            /// <summary>If set, stamp or replace these keys on <c>worldspawn</c>.</summary>
            public IReadOnlyDictionary<string, string>? WorldspawnKeys { get; init; }
        }

        /// <summary>Remove lights and orphaned spotlight targets; merge worldspawn keys; append new lights.</summary>
        public static void ReplaceLights(
            MapFileT map,
            IReadOnlyList<LightDefinition> lights,
            Options? options = null)
        {
            options ??= new Options();
            var spotTargetNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            for (int i = map.Entities.Count - 1; i >= 0; i--)
            {
                string? cn = map.Entities[i].ClassName;
                if (cn == null) continue;
                if (cn.Equals("light", StringComparison.OrdinalIgnoreCase))
                {
                    string? t = map.Entities[i].GetKey("target");
                    if (!string.IsNullOrEmpty(t)) spotTargetNames.Add(t!);
                    map.Entities.RemoveAt(i);
                }
            }

            for (int i = map.Entities.Count - 1; i >= 0; i--)
            {
                string? cn = map.Entities[i].ClassName;
                if (cn == null) continue;
                if (!cn.Equals("info_null", StringComparison.OrdinalIgnoreCase)
                    && !cn.Equals("light_target", StringComparison.OrdinalIgnoreCase))
                    continue;
                string? tn = map.Entities[i].GetKey("targetname");
                if (tn != null && spotTargetNames.Contains(tn)) map.Entities.RemoveAt(i);
            }

            MapEntity? worldspawn = null;
            foreach (var e in map.Entities)
            {
                if (string.Equals(e.ClassName, "worldspawn", StringComparison.OrdinalIgnoreCase))
                {
                    worldspawn = e;
                    break;
                }
            }
            if (worldspawn == null)
            {
                worldspawn = new MapEntity();
                worldspawn.SetKey("classname", "worldspawn");
                map.Entities.Insert(0, worldspawn);
            }

            if (options.WorldspawnKeys != null)
            {
                foreach (var kv in options.WorldspawnKeys)
                    worldspawn.SetKey(kv.Key, kv.Value);
            }

            CultureInfo inv = CultureInfo.InvariantCulture;
            foreach (var L in lights)
            {
                var e = new MapEntity();
                e.SetKey("classname", "light");
                e.SetKey("origin", $"{L.Origin.X.ToString("0.##", inv)} {L.Origin.Y.ToString("0.##", inv)} {L.Origin.Z.ToString("0.##", inv)}");
                e.SetKey("_color", $"{L.Color.X.ToString("0.###", inv)} {L.Color.Y.ToString("0.###", inv)} {L.Color.Z.ToString("0.###", inv)}");
                e.SetKey("light", L.Q3LightIntensity.ToString("0.###", inv));
                if (L.LinearFalloff) e.SetKey("spawnflags", "1");
                map.Entities.Add(e);
            }
        }
    }

    /// <summary>Minimal light payload for .map injection (q3map2-facing keys only).</summary>
    public sealed class LightDefinition
    {
        public System.Numerics.Vector3 Origin { get; init; }
        public System.Numerics.Vector3 Color { get; init; } = System.Numerics.Vector3.One;

        /// <summary>Value for the <c>light</c> entity key (already in q3 scale).</summary>
        public float Q3LightIntensity { get; init; } = 300f;

        public bool LinearFalloff { get; init; }
    }
}
