using System;
using System.Collections.Generic;
using System.Globalization;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.MapFile;
using MapFileT = BspLightReSlopper.MapFile.MapFile;

namespace BspLightReSlopper.Tools
{
    /// <summary>
    /// Removes all <c>light</c> entities from a parsed <see cref="MapFile"/> and re-populates
    /// it with a deterministic, BSP-tree-validated scatter of random point/linear/spot lights
    /// of varied color and intensity. Designed to feed the Phase B training loop:
    /// <c>scatter → recompile → estimate → score</c>.
    ///
    /// <para>Validation against the loaded BSP makes the difference between a usable random
    /// map and noise: a candidate position must (a) be inside the model[0] AABB, (b) not be
    /// inside any solid/clip brush, (c) leave at least <see cref="ClearanceUnits"/> units of
    /// air around it (verified by short raycasts in six axis directions). Without those
    /// checks half the lights end up sealed inside walls and contribute nothing to the
    /// recompiled lightmap.</para>
    /// </summary>
    public sealed class RandomLightScatterer
    {
        public sealed class Options
        {
            public int LightCount { get; init; } = 24;
            public int RandomSeed { get; init; } = 42;

            /// <summary>Min/max <c>"light"</c> key value. Q3-typical fixtures live in
            /// 100..1500; we span a bit wider so the training distribution exercises both
            /// dim and very bright fits.</summary>
            public float MinIntensity { get; init; } = 100f;
            public float MaxIntensity { get; init; } = 1200f;

            /// <summary>Probability of a colored light (vs near-white). Half of those are
            /// saturated, half are warm/cool tints.</summary>
            public float ColoredFraction { get; init; } = 0.40f;

            /// <summary>Probability the light gets <c>spawnflags 1</c> (linear falloff).</summary>
            public float LinearFraction { get; init; } = 0.20f;

            /// <summary>Probability of generating a spot light (paired with an
            /// <c>info_null</c> target). Spot lights need a target entity, which the
            /// scatterer also emits.</summary>
            public float SpotFraction { get; init; } = 0.10f;

            /// <summary>Minimum air around a candidate position — verified via 6 raycasts
            /// of this length along the axes. Lights right against a wall are valid q3 but
            /// produce poor training data.</summary>
            public float ClearanceUnits { get; init; } = 32f;

            /// <summary>How many positional rejection-sample attempts before we abort the
            /// run (rare; only triggers on very dense or pathological maps).</summary>
            public int MaxAttemptsPerLight { get; init; } = 200;

            /// <summary>If set, restrict the light bbox to this AABB instead of the full
            /// model[0] bounds. Useful for stress-testing a specific region.</summary>
            public Vector3? BboxMin { get; init; }
            public Vector3? BboxMax { get; init; }
        }

        public sealed class Result
        {
            public int Placed { get; init; }
            public int Attempts { get; init; }
            public int RejectedSolid { get; init; }
            public int RejectedOutside { get; init; }
            public int RejectedClearance { get; init; }
            public int Spotlights { get; init; }
            public int LinearLights { get; init; }
            public int ColoredLights { get; init; }
        }

        public static Result Scatter(MapFileT map, BspFile bsp, BspCollision collision, Options? options = null)
        {
            options ??= new Options();
            var rng = new Random(options.RandomSeed);

            // ---- 1. Strip existing light + spotlight target_position entities ----
            // We also drop info_null entities used only as spot light targets so we don't
            // leave dangling "targetname"-only entities behind. Conservative: only drop
            // info_nulls that are referenced by a removed spotlight.
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

            // ---- 2. Determine scatter bbox ----
            Vector3 lo, hi;
            if (options.BboxMin.HasValue && options.BboxMax.HasValue)
            {
                lo = options.BboxMin.Value;
                hi = options.BboxMax.Value;
            }
            else if (bsp.Models.Count > 0)
            {
                // Inset slightly so we never propose the very corner of the bbox.
                lo = bsp.Models[0].Mins + new Vector3(8);
                hi = bsp.Models[0].Maxs - new Vector3(8);
            }
            else
            {
                lo = new Vector3(-1024); hi = new Vector3(1024);
            }
            // Reject empty bbox
            if (hi.X <= lo.X || hi.Y <= lo.Y || hi.Z <= lo.Z)
                throw new InvalidOperationException("scatter bbox is empty");

            // ---- 3. Place lights ----
            int placed = 0, attempts = 0, rs = 0, ro = 0, rc = 0, spots = 0, linears = 0, colored = 0;
            int spotIdx = 0;
            while (placed < options.LightCount && attempts < options.LightCount * options.MaxAttemptsPerLight)
            {
                attempts++;
                Vector3 p = new(
                    Lerp(lo.X, hi.X, (float)rng.NextDouble()),
                    Lerp(lo.Y, hi.Y, (float)rng.NextDouble()),
                    Lerp(lo.Z, hi.Z, (float)rng.NextDouble()));

                if (collision.IsOutsideMap(p)) { ro++; continue; }
                if (collision.IsInsideSolid(p)) { rs++; continue; }
                if (!HasClearance(p, options.ClearanceUnits, collision)) { rc++; continue; }

                var lightEnt = new MapEntity();
                lightEnt.SetKey("classname", "light");
                lightEnt.SetKey("origin", FormatVec(p));

                // Intensity (log-uniform across MinIntensity..MaxIntensity).
                float u = (float)rng.NextDouble();
                float intensity = MathF.Exp(Lerp(MathF.Log(options.MinIntensity), MathF.Log(options.MaxIntensity), u));
                lightEnt.SetKey("light", intensity.ToString("0", CultureInfo.InvariantCulture));

                // Color
                Vector3 color = SampleColor(rng, options.ColoredFraction, out bool isColored);
                if (isColored)
                {
                    lightEnt.SetKey("_color", FormatColor(color));
                    colored++;
                }
                // Linear flag (mutually exclusive with spotlight here for simplicity)
                bool linear = rng.NextDouble() < options.LinearFraction;
                bool spot = !linear && rng.NextDouble() < options.SpotFraction;

                if (linear)
                {
                    lightEnt.SetKey("spawnflags", "1");
                    linears++;
                }
                else if (spot)
                {
                    string targetName = "scatter_target_" + spotIdx.ToString(CultureInfo.InvariantCulture);
                    spotIdx++;
                    lightEnt.SetKey("target", targetName);
                    // Place target somewhere in front (random direction, 256u out, validated).
                    Vector3 dir;
                    int dirAttempts = 0;
                    Vector3 targetPos;
                    do
                    {
                        dir = RandomUnit(rng);
                        targetPos = p + dir * 256f;
                        dirAttempts++;
                    } while ((collision.IsOutsideMap(targetPos) || collision.IsInsideSolid(targetPos)) && dirAttempts < 16);
                    var tgt = new MapEntity();
                    tgt.SetKey("classname", "info_null");
                    tgt.SetKey("origin", FormatVec(targetPos));
                    tgt.SetKey("targetname", targetName);
                    map.Entities.Add(tgt);
                    spots++;
                }
                map.Entities.Add(lightEnt);
                placed++;
            }

            return new Result
            {
                Placed = placed,
                Attempts = attempts,
                RejectedSolid = rs,
                RejectedOutside = ro,
                RejectedClearance = rc,
                Spotlights = spots,
                LinearLights = linears,
                ColoredLights = colored,
            };
        }

        // ---- helpers ----

        private static bool HasClearance(Vector3 p, float r, BspCollision col)
        {
            // Six axis-aligned probes; reject if any of them tunnels into a brush before r/2
            // units. Using r/2 keeps the bar reasonable on cluttered indoor maps.
            float half = r * 0.5f;
            ReadOnlySpan<Vector3> dirs = stackalloc Vector3[]
            {
                new(+1,0,0), new(-1,0,0),
                new(0,+1,0), new(0,-1,0),
                new(0,0,+1), new(0,0,-1),
            };
            for (int i = 0; i < dirs.Length; i++)
            {
                var trace = col.Trace(p, p + dirs[i] * half);
                if (trace.Fraction < 1f) return false;
            }
            return true;
        }

        private static Vector3 SampleColor(Random rng, float coloredFraction, out bool isColored)
        {
            if (rng.NextDouble() >= coloredFraction)
            {
                // Pure white with slight randomization
                isColored = false;
                return Vector3.One;
            }
            isColored = true;
            // Half of colored = soft warm/cool tint; half = saturated.
            if (rng.NextDouble() < 0.5)
            {
                // Warm or cool tint
                bool warm = rng.NextDouble() < 0.6;
                if (warm) return new Vector3(1f, 0.85f + 0.1f * (float)rng.NextDouble(), 0.6f + 0.2f * (float)rng.NextDouble());
                return new Vector3(0.6f + 0.2f * (float)rng.NextDouble(), 0.8f + 0.1f * (float)rng.NextDouble(), 1f);
            }
            // Saturated palette: red, green, blue, cyan, magenta, orange, purple
            int pick = rng.Next(7);
            return pick switch
            {
                0 => new Vector3(1.0f, 0.20f, 0.15f),  // red
                1 => new Vector3(0.20f, 1.0f, 0.30f),  // green
                2 => new Vector3(0.20f, 0.40f, 1.0f),  // blue
                3 => new Vector3(0.20f, 1.0f, 1.0f),   // cyan
                4 => new Vector3(1.0f, 0.20f, 1.0f),   // magenta
                5 => new Vector3(1.0f, 0.55f, 0.10f),  // orange
                _ => new Vector3(0.70f, 0.20f, 1.0f),  // purple
            };
        }

        private static Vector3 RandomUnit(Random rng)
        {
            // Marsaglia
            while (true)
            {
                float a = (float)rng.NextDouble() * 2 - 1;
                float b = (float)rng.NextDouble() * 2 - 1;
                float s = a * a + b * b;
                if (s >= 1f || s == 0f) continue;
                float k = 2f * MathF.Sqrt(1f - s);
                return new Vector3(a * k, b * k, 1f - 2f * s);
            }
        }

        private static float Lerp(float a, float b, float t) => a + (b - a) * t;

        private static string FormatVec(Vector3 v)
        {
            CultureInfo inv = CultureInfo.InvariantCulture;
            return $"{v.X.ToString("0.##", inv)} {v.Y.ToString("0.##", inv)} {v.Z.ToString("0.##", inv)}";
        }

        private static string FormatColor(Vector3 c)
        {
            CultureInfo inv = CultureInfo.InvariantCulture;
            return $"{c.X.ToString("0.###", inv)} {c.Y.ToString("0.###", inv)} {c.Z.ToString("0.###", inv)}";
        }
    }
}
