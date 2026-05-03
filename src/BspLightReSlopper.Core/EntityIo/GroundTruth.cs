using System;
using System.Collections.Generic;
using System.Linq;

namespace BspLightReSlopper.EntityIo
{
    /// <summary>
    /// Result of extracting ground-truth lights from a BSP's entity lump. The
    /// <see cref="IsUsable"/> flag enforces the rule that a BSP with zero <c>light</c>
    /// entities is *not* assumed to mean "the right answer is 0 lights" — many compilers
    /// strip lights post-compile, and the two cases are indistinguishable from the BSP
    /// alone. Verify and train must skip such BSPs.
    /// </summary>
    public sealed class GroundTruth
    {
        public IReadOnlyList<LightEntity> Lights { get; init; } = Array.Empty<LightEntity>();
        public bool HasSunWorldspawn { get; init; }
        public bool IsUsable { get; init; }
        public string? SkipReason { get; init; }
        public IReadOnlyList<string> ParseWarnings { get; init; } = Array.Empty<string>();

        public static GroundTruth Extract(string entityLumpText)
        {
            var parsed = EntityLumpParser.Parse(entityLumpText);
            var lights = new List<LightEntity>();
            bool sun = false;
            foreach (var e in parsed.Entities)
            {
                var le = LightEntity.FromEntity(e);
                if (le != null) lights.Add(le);
                if (string.Equals(e.ClassName, "worldspawn", StringComparison.OrdinalIgnoreCase))
                {
                    if (e.Pairs.Keys.Any(k => k.StartsWith("_sun_", StringComparison.OrdinalIgnoreCase))
                        || e.Get("_sun") != null)
                    {
                        sun = true;
                    }
                }
            }

            bool usable = lights.Count > 0 || sun;
            string? reason = usable
                ? null
                : "entity lump has no preserved light entities and no _sun_* worldspawn keys; ground truth is unknown";

            return new GroundTruth
            {
                Lights = lights,
                HasSunWorldspawn = sun,
                IsUsable = usable,
                SkipReason = reason,
                ParseWarnings = parsed.Warnings,
            };
        }
    }
}
