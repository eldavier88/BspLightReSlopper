using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Shaders;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Estimation
{
    /// <summary>
    /// Phase E8 -- bounce light suppression. After light estimation, walk every accepted
    /// light and check whether its color closely matches its supporting surface's albedo
    /// (cosine similarity above threshold) AND its intensity is below a "real direct light"
    /// floor. If both: it's almost certainly a fit-to-bounce false positive (q3map2's
    /// radiosity bounce coloured the supporting surfaces with their own albedo and the
    /// LSQ tried to explain the result by inserting a fake light of that colour at the
    /// surface).
    ///
    /// <para>The suppressor is conservative: blowout-seeded lights bypass entirely (they're
    /// driven by saturated patch geometry, not LSQ overfit). Lights whose supporting
    /// surfaces span multiple distinct shaders (with disagreeing albedo) also bypass --
    /// real lights illuminate many shaders simultaneously.</para>
    /// </summary>
    public sealed class BounceSuppressor
    {
        public sealed class Options
        {
            /// <summary>Cosine similarity between fitted light color and supporting surface
            /// albedo above which the light is suspected of being bounce. 0.95 = ~18°.</summary>
            public float CosineThreshold { get; init; } = 0.95f;

            /// <summary>Internal-intensity floor below which a colour-matching light is
            /// flagged as bounce. Lights brighter than this stay even when colour matches
            /// (could be a coloured lamp lighting a same-coloured surface).</summary>
            public float IntensityFloor { get; init; } = 5000f;

            /// <summary>Minimum number of supporting samples whose dominant shader's albedo
            /// is known to even attempt the colour-match check. Below this, we don't have
            /// enough signal and the light bypasses.</summary>
            public int MinKnownAlbedoSamples { get; init; } = 8;

            /// <summary>If a light's supporting samples come from this many distinct shaders
            /// with disagreeing albedos (cosine sim &lt; 0.8 between any two), we DO NOT
            /// suppress -- a true direct light typically illuminates several materials.</summary>
            public int MaxDistinctShadersForSuppress { get; init; } = 2;

            /// <summary>Room detection results used to adjust bounce suppression heuristics.
            /// In enclosed Indoor rooms, radiosity bounce is much stronger, so the IntensityFloor
            /// is dynamically raised (suppressing brighter false-positive bounces).</summary>
            public Heuristics.RoomDetector.Result? RoomPrior { get; init; }
        }

        public sealed class Decision
        {
            public bool Suppress { get; init; }
            public float CosineToAlbedo { get; init; }
            public Vector3 DominantAlbedo { get; init; } = Vector3.One;
            public int DistinctShaders { get; init; }
            public string Reason { get; init; } = "";
        }

        public sealed class Result
        {
            public IReadOnlyList<EstimatedLight> KeptLights { get; init; } = Array.Empty<EstimatedLight>();
            public IReadOnlyList<EstimatedLight> SuppressedLights { get; init; } = Array.Empty<EstimatedLight>();
            public IReadOnlyList<Decision> Decisions { get; init; } = Array.Empty<Decision>();
        }

        public static Result Filter(IReadOnlyList<EstimatedLight> lights, IReadOnlyList<TexelSample> samples,
            BspFile bsp, AlbedoCache? albedo, bool halfLambert, Options? options = null, Logger? log = null)
        {
            options ??= new Options();

            // Albedo lookup: use the cache if we have one, otherwise the shader-name
            // heuristic. The asset-less heuristic is less reliable, so the colour-match
            // threshold is tightened to demand a closer match before we suppress.
            Func<string, Vector3?> albedoLookup;
            float cosineThreshold;
            if (albedo != null)
            {
                albedoLookup = albedo.GetAlbedo;
                cosineThreshold = options.CosineThreshold;
            }
            else
            {
                albedoLookup = ShaderNameAlbedoGuess;
                cosineThreshold = MathF.Max(options.CosineThreshold, 0.97f);
                log?.Info($"  bounce-suppress: no albedo cache — using shader-name albedo heuristic (cosine threshold tightened to {cosineThreshold:0.00})");
            }

            var keep = new List<EstimatedLight>(lights.Count);
            var drop = new List<EstimatedLight>();
            var decisions = new List<Decision>(lights.Count);

            foreach (var l in lights)
            {
                // Blowout-seeded lights are not eligible for bounce suppression -- they
                // have no LSQ history and aren't sensitive to material albedo.
                if (l.BlownOut)
                {
                    keep.Add(l);
                    decisions.Add(new Decision { Suppress = false, Reason = "blowout-seed" });
                    continue;
                }
                // Bright lights are kept regardless of color match.
                // Indoor refinement: enclosed rooms have much brighter bounce light, so we raise
                // the intensity floor to catch those brighter false positives.
                float floor = options.IntensityFloor;
                if (options.RoomPrior != null)
                {
                    int rIdx = options.RoomPrior.FindRoomIndex(l.Origin);
                    if (rIdx >= 0)
                    {
                        var kind = options.RoomPrior.Rooms[rIdx].Kind;
                        if (kind != Heuristics.RoomDetector.RoomKind.Outdoor && 
                            kind != Heuristics.RoomDetector.RoomKind.Unknown)
                        {
                            floor *= 2.0f;
                        }
                    }
                }

                if (l.Intensity >= floor)
                {
                    keep.Add(l);
                    decisions.Add(new Decision { Suppress = false, Reason = "intensity-above-floor" });
                    continue;
                }

                // Find supporting samples (predict >= 5% observed) and tally per-shader albedo.
                var perShaderTally = new Dictionary<int, (int count, Vector3 colorSum)>();
                int knownAlbedo = 0;
                const float fade2 = 32f * 32f;
                for (int i = 0; i < samples.Count; i++)
                {
                    var s = samples[i];
                    Vector3 toL = l.Origin - s.World;
                    float d2 = toL.LengthSquared();
                    if (d2 < 1e-3f) continue;
                    float invD = 1f / MathF.Sqrt(d2);
                    float ndotL = (s.Normal.X * toL.X + s.Normal.Y * toL.Y + s.Normal.Z * toL.Z) * invD;
                    float angle = AngleFactor(ndotL, halfLambert);
                    if (angle <= 0) continue;
                    float g = angle / (d2 + fade2);
                    float predict = l.Intensity * g;
                    float observed = (s.Observed.X + s.Observed.Y + s.Observed.Z) / 3f;
                    if (observed < 1e-3f || predict / observed < 0.05f) continue;
                    int sIdx = s.ShaderIndex;
                    if (sIdx < 0 || sIdx >= bsp.Shaders.Count) continue;
                    string shaderName = bsp.Shaders[sIdx].Name;
                    var alb = albedoLookup(shaderName);
                    if (!alb.HasValue) continue;
                    if (!perShaderTally.TryGetValue(sIdx, out var tt)) tt = (0, Vector3.Zero);
                    tt.count++;
                    tt.colorSum += alb.Value;
                    perShaderTally[sIdx] = tt;
                    knownAlbedo++;
                }

                if (knownAlbedo < options.MinKnownAlbedoSamples)
                {
                    keep.Add(l);
                    decisions.Add(new Decision { Suppress = false, Reason = "insufficient-known-albedo-samples" });
                    continue;
                }

                // Collect dominant shader (most supporting samples) + check for multi-material support.
                int dominantIdx = -1;
                int dominantCount = 0;
                Vector3 dominantAlbedo = Vector3.One;
                int distinct = 0;
                foreach (var kv in perShaderTally)
                {
                    distinct++;
                    if (kv.Value.count > dominantCount)
                    {
                        dominantCount = kv.Value.count;
                        dominantIdx = kv.Key;
                        dominantAlbedo = Vector3.Normalize(kv.Value.colorSum / kv.Value.count);
                    }
                }
                if (distinct > options.MaxDistinctShadersForSuppress)
                {
                    keep.Add(l);
                    decisions.Add(new Decision { Suppress = false, DistinctShaders = distinct, Reason = "multi-shader-support" });
                    continue;
                }

                // Cosine similarity between light color and dominant shader albedo.
                Vector3 lightColorN = l.Color.LengthSquared() > 1e-6f ? Vector3.Normalize(l.Color) : Vector3.UnitZ;
                Vector3 albedoN = dominantAlbedo.LengthSquared() > 1e-6f ? Vector3.Normalize(dominantAlbedo) : Vector3.UnitZ;
                float cosine = Vector3.Dot(lightColorN, albedoN);
                bool suppress = cosine >= cosineThreshold;
                if (suppress)
                {
                    drop.Add(l);
                    decisions.Add(new Decision
                    {
                        Suppress = true,
                        CosineToAlbedo = cosine,
                        DominantAlbedo = dominantAlbedo,
                        DistinctShaders = distinct,
                        Reason = "color-matches-albedo",
                    });
                }
                else
                {
                    keep.Add(l);
                    decisions.Add(new Decision
                    {
                        Suppress = false,
                        CosineToAlbedo = cosine,
                        DominantAlbedo = dominantAlbedo,
                        DistinctShaders = distinct,
                        Reason = "color-mismatch",
                    });
                }
            }

            log?.Info($"  bounce-suppress: {drop.Count} of {lights.Count} lights dropped (color-matches-albedo + intensity-below-floor + single-shader support)");
            return new Result { KeptLights = keep, SuppressedLights = drop, Decisions = decisions };
        }

        private static float AngleFactor(float ndotL, bool halfLambert)
        {
            if (!halfLambert) return ndotL > 0 ? ndotL : 0;
            if (ndotL <= 0.001f) return 0;
            if (ndotL > 1) ndotL = 1;
            float a = ndotL * 0.5f + 0.5f;
            return a * a;
        }

        // ----- Shader-name albedo heuristic (asset-less fallback) -----
        // Match shader names against a curated keyword table to guess a plausible diffuse
        // albedo for each surface. Patterns are ordered by specificity: specific colour
        // names first, then materials, then generic descriptors. First match wins per
        // shader name. Returns null for shader names with no recognised keyword (the
        // bounce suppressor then bypasses that surface as "unknown albedo" rather than
        // assuming a default — bypassing is the safe choice since a wrong guess produces
        // false drops). Albedo values are linear-light reflectances (0..1 per channel)
        // tuned to roughly match texture averages on typical Quake/JK engine maps.

        private static readonly (string Pattern, Vector3 Albedo)[] _shaderNameAlbedoTable = new[]
        {
            // Specific colour names (highest priority — most discriminating).
            ("magenta",  new Vector3(0.70f, 0.10f, 0.70f)),
            ("crimson",  new Vector3(0.55f, 0.10f, 0.08f)),
            ("scarlet",  new Vector3(0.60f, 0.15f, 0.10f)),
            ("yellow",   new Vector3(0.65f, 0.55f, 0.15f)),
            ("orange",   new Vector3(0.65f, 0.40f, 0.15f)),
            ("purple",   new Vector3(0.40f, 0.20f, 0.50f)),
            ("violet",   new Vector3(0.45f, 0.20f, 0.55f)),
            ("cyan",     new Vector3(0.20f, 0.55f, 0.55f)),
            ("teal",     new Vector3(0.15f, 0.45f, 0.45f)),
            ("white",    new Vector3(0.78f, 0.78f, 0.78f)),
            // Distinctive materials (precious / coloured metals).
            ("gold",     new Vector3(0.65f, 0.50f, 0.20f)),
            ("brass",    new Vector3(0.60f, 0.45f, 0.18f)),
            ("copper",   new Vector3(0.55f, 0.30f, 0.18f)),
            ("rust",     new Vector3(0.45f, 0.25f, 0.15f)),
            // Common materials.
            ("chrome",   new Vector3(0.65f, 0.65f, 0.68f)),
            ("steel",    new Vector3(0.55f, 0.55f, 0.58f)),
            ("alum",     new Vector3(0.60f, 0.60f, 0.60f)),
            ("iron",     new Vector3(0.40f, 0.40f, 0.40f)),
            ("metal",    new Vector3(0.55f, 0.55f, 0.55f)),
            ("wood",     new Vector3(0.45f, 0.32f, 0.18f)),
            ("plank",    new Vector3(0.45f, 0.32f, 0.18f)),
            ("crate",    new Vector3(0.45f, 0.32f, 0.18f)),
            ("brown",    new Vector3(0.40f, 0.28f, 0.18f)),
            ("tan",      new Vector3(0.55f, 0.45f, 0.30f)),
            ("dirt",     new Vector3(0.40f, 0.30f, 0.18f)),
            ("sand",     new Vector3(0.65f, 0.55f, 0.35f)),
            ("rock",     new Vector3(0.45f, 0.40f, 0.35f)),
            ("stone",    new Vector3(0.50f, 0.50f, 0.50f)),
            ("concrete", new Vector3(0.55f, 0.55f, 0.55f)),
            ("asphalt",  new Vector3(0.15f, 0.15f, 0.15f)),
            ("tar",      new Vector3(0.10f, 0.10f, 0.10f)),
            ("grass",    new Vector3(0.20f, 0.40f, 0.15f)),
            ("moss",     new Vector3(0.20f, 0.35f, 0.18f)),
            ("leaf",     new Vector3(0.25f, 0.40f, 0.18f)),
            ("snow",     new Vector3(0.85f, 0.85f, 0.88f)),
            ("ice",      new Vector3(0.70f, 0.78f, 0.85f)),
            ("water",    new Vector3(0.20f, 0.30f, 0.35f)),
            ("lava",     new Vector3(0.60f, 0.20f, 0.10f)),
            ("blood",    new Vector3(0.40f, 0.05f, 0.05f)),
            ("carpet",   new Vector3(0.40f, 0.25f, 0.20f)),
            ("cloth",    new Vector3(0.40f, 0.35f, 0.30f)),
            ("fabric",   new Vector3(0.40f, 0.35f, 0.30f)),
            // Generic colour descriptors (lower priority — these match a lot).
            ("dark",     new Vector3(0.20f, 0.20f, 0.20f)),
            ("black",    new Vector3(0.10f, 0.10f, 0.10f)),
            ("red",      new Vector3(0.55f, 0.15f, 0.12f)),
            ("blue",     new Vector3(0.15f, 0.20f, 0.55f)),
            ("green",    new Vector3(0.20f, 0.45f, 0.20f)),
            ("grey",     new Vector3(0.50f, 0.50f, 0.50f)),
            ("gray",     new Vector3(0.50f, 0.50f, 0.50f)),
            // Note: deliberately NO entries for "wall", "floor", "ceiling" — those tokens
            // appear in shaders of every conceivable colour and would pollute the
            // heuristic with grey false-matches.
        };

        /// <summary>
        /// Asset-less albedo fallback: scan a shader path for any of the curated keyword
        /// patterns above and return the corresponding plausible diffuse colour, or
        /// <c>null</c> if no pattern matches (the bounce suppressor then treats this
        /// shader as unknown and does not drop lights based on it).
        /// </summary>
        public static Vector3? ShaderNameAlbedoGuess(string shaderName)
        {
            if (string.IsNullOrEmpty(shaderName)) return null;
            // Lower-case once; the table patterns are all lowercase ASCII.
            string s = shaderName.ToLowerInvariant();
            foreach (var (pat, alb) in _shaderNameAlbedoTable)
            {
                if (s.IndexOf(pat, StringComparison.Ordinal) >= 0) return alb;
            }
            return null;
        }
    }
}
