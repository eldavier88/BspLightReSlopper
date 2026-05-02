using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Numerics;
using System.Text;

namespace BspLightReSlopper.EntityIo
{
    /// <summary>
    /// Emits estimated lights as a Quake-style <c>.ent</c> file: one
    /// <c>{ "key" "value" ... }</c> entity block per estimated light. No worldspawn entity
    /// is emitted, per the user's spec — instead, a leading block of <c>//</c> comments
    /// carries metadata (inferred compile settings, light counts, runtime).
    /// q3map2 reads this format with <c>-onlyents</c>.
    /// </summary>
    public static class EntFileWriter
    {
        public sealed class GuessedLight
        {
            public Vector3 Origin { get; init; }
            public Vector3 Color { get; init; } = Vector3.One;
            public float Intensity { get; init; } = 300f;
            public int SpawnFlags { get; init; }                 // 1 = linear
            public string? Target { get; init; }                 // for spotlights
            public string? TargetName { get; init; }
            public string Method { get; init; } = "ransac+triangulation";
            public float Confidence { get; init; }
            public int SupportingTexels { get; init; }
            public float ResidualEnergyExplainedFraction { get; init; }
            public bool BlownOut { get; init; }
            public string ClassName { get; init; } = "light";
            public IReadOnlyDictionary<string, string>? ExtraDebugKeys { get; init; }
        }

        public sealed class WriteOptions
        {
            public string? SourceBspName { get; init; }
            public IReadOnlyDictionary<string, string>? InferredCompile { get; init; }
            public string? RuntimeSeconds { get; init; }
            public IReadOnlyDictionary<string, int>? CountsByType { get; init; }
        }

        public static void Write(string path, IReadOnlyList<GuessedLight> lights, WriteOptions options)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(path))!);
            using var sw = new StreamWriter(path, append: false, Encoding.ASCII);
            WriteTo(sw, lights, options);
        }

        public static string ToText(IReadOnlyList<GuessedLight> lights, WriteOptions options)
        {
            using var ms = new MemoryStream();
            using (var sw = new StreamWriter(ms, Encoding.ASCII, leaveOpen: true)) WriteTo(sw, lights, options);
            ms.Position = 0;
            using var sr = new StreamReader(ms, Encoding.ASCII);
            return sr.ReadToEnd();
        }

        private static void WriteTo(StreamWriter sw, IReadOnlyList<GuessedLight> lights, WriteOptions options)
        {
            // Header comments
            sw.WriteLine("// BspLightReSlopper estimate");
            if (!string.IsNullOrEmpty(options.SourceBspName))
                sw.WriteLine("// source bsp:        " + options.SourceBspName);
            if (options.InferredCompile != null)
            {
                var sb = new StringBuilder("// inferred compile: ");
                bool first = true;
                foreach (var kv in options.InferredCompile)
                {
                    if (!first) sb.Append(' ');
                    sb.Append(kv.Key).Append('=').Append(kv.Value);
                    first = false;
                }
                sw.WriteLine(sb.ToString());
            }
            int total = lights.Count;
            string typeBreakdown = string.Empty;
            if (options.CountsByType != null && options.CountsByType.Count > 0)
            {
                var sb = new StringBuilder("(");
                bool first = true;
                foreach (var kv in options.CountsByType)
                {
                    if (!first) sb.Append(' ');
                    sb.Append(kv.Key).Append('=').Append(kv.Value);
                    first = false;
                }
                sb.Append(')');
                typeBreakdown = "  " + sb.ToString();
            }
            sw.WriteLine($"// lights total:      {total}{typeBreakdown}");
            if (!string.IsNullOrEmpty(options.RuntimeSeconds))
                sw.WriteLine("// estimator runtime: " + options.RuntimeSeconds);

            // Entity blocks
            CultureInfo inv = CultureInfo.InvariantCulture;
            foreach (var l in lights)
            {
                sw.WriteLine("{");
                sw.WriteLine($"\"classname\" \"{l.ClassName}\"");
                sw.WriteLine($"\"origin\" \"{F(l.Origin.X)} {F(l.Origin.Y)} {F(l.Origin.Z)}\"");
                sw.WriteLine($"\"_color\" \"{F(l.Color.X)} {F(l.Color.Y)} {F(l.Color.Z)}\"");
                sw.WriteLine($"\"light\" \"{l.Intensity.ToString("0.###", inv)}\"");
                if (l.SpawnFlags != 0)
                    sw.WriteLine($"\"spawnflags\" \"{l.SpawnFlags.ToString(inv)}\"");
                if (!string.IsNullOrEmpty(l.Target))
                    sw.WriteLine($"\"target\" \"{l.Target}\"");
                if (!string.IsNullOrEmpty(l.TargetName))
                    sw.WriteLine($"\"targetname\" \"{l.TargetName}\"");

                sw.WriteLine($"\"_method\" \"{l.Method}\"");
                sw.WriteLine($"\"_confidence\" \"{l.Confidence.ToString("0.###", inv)}\"");
                sw.WriteLine($"\"_supportingTexels\" \"{l.SupportingTexels.ToString(inv)}\"");
                sw.WriteLine($"\"_residualEnergyExplainedFraction\" \"{l.ResidualEnergyExplainedFraction.ToString("0.###", inv)}\"");
                if (l.BlownOut) sw.WriteLine("\"_blownOut\" \"1\"");

                if (l.ExtraDebugKeys != null)
                {
                    foreach (var kv in l.ExtraDebugKeys)
                        sw.WriteLine($"\"{kv.Key}\" \"{kv.Value}\"");
                }

                sw.WriteLine("}");
            }
        }

        private static string F(float v) => v.ToString("0.######", CultureInfo.InvariantCulture);
    }
}
