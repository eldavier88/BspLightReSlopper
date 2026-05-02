using System;
using System.Numerics;

namespace BspLightReSlopper.EntityIo
{
    /// <summary>
    /// Typed view over a <see cref="Entity"/> whose <c>classname</c> is <c>light</c>. Q3
    /// supports a few extras (spawnflags 1 = linear, target/targetname for spotlights,
    /// _color override, light intensity). We capture the ones the verification harness
    /// and the estimator care about.
    /// </summary>
    public sealed class LightEntity
    {
        public Vector3 Origin { get; init; }
        public Vector3 Color { get; init; } = Vector3.One;
        public float Intensity { get; init; } = 300f;     // q3 default
        public int SpawnFlags { get; init; }
        public string? Target { get; init; }
        public string? TargetName { get; init; }
        public string? Classname { get; init; }
        public Entity? RawEntity { get; init; }

        public bool Linear => (SpawnFlags & 1) != 0;
        public bool Spotlight => !string.IsNullOrEmpty(Target);

        public static LightEntity? FromEntity(Entity ent)
        {
            string cls = ent.ClassName;
            if (!string.Equals(cls, "light", StringComparison.OrdinalIgnoreCase)
                && !string.Equals(cls, "_light", StringComparison.OrdinalIgnoreCase))
                return null;

            ent.TryGetVector3("origin", out Vector3 origin);
            Vector3 color = Vector3.One;
            if (ent.TryGetVector3("_color", out Vector3 c)) color = c;
            float intensity = 300f;
            if (ent.TryGetFloat("light", out float lv)) intensity = lv;
            ent.TryGetInt("spawnflags", out int sf);
            return new LightEntity
            {
                Origin = origin,
                Color = color,
                Intensity = intensity,
                SpawnFlags = sf,
                Target = ent.Get("target"),
                TargetName = ent.Get("targetname"),
                Classname = cls,
                RawEntity = ent,
            };
        }
    }
}
