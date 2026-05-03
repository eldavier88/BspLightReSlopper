using System.Collections.Generic;
using System.IO;
using System.Text;

namespace BspLightReSlopper.MapFile
{
    /// <summary>
    /// Re-emits a <see cref="MapFile"/> as Q3-style <c>.map</c> text. Round-trip
    /// preservation of brushes / patches is achieved by writing each brush's stored
    /// <see cref="MapBrush.OriginalText"/> verbatim — only the entity-level key/value list
    /// and the entity collection itself are rebuilt, which is exactly the surface the
    /// random-light-scatter pipeline needs to mutate (remove/insert <c>light</c> entities).
    /// </summary>
    public static class MapFileWriter
    {
        public static void Write(string path, MapFile map)
        {
            using var sw = new StreamWriter(path, append: false, new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));
            WriteTo(sw, map);
        }

        public static string ToText(MapFile map)
        {
            using var ms = new MemoryStream();
            using (var sw = new StreamWriter(ms, new UTF8Encoding(false), leaveOpen: true)) WriteTo(sw, map);
            ms.Position = 0;
            using var sr = new StreamReader(ms);
            return sr.ReadToEnd();
        }

        private static void WriteTo(StreamWriter sw, MapFile map)
        {
            sw.NewLine = "\n";
            for (int i = 0; i < map.Entities.Count; i++)
            {
                var e = map.Entities[i];
                sw.WriteLine($"// entity {i}");
                sw.WriteLine("{");
                foreach (var kv in e.Keys)
                {
                    sw.Write('"'); sw.Write(EscapeQuoted(kv.Key)); sw.Write("\" \"");
                    sw.Write(EscapeQuoted(kv.Value)); sw.WriteLine("\"");
                }
                int brushIdx = 0;
                foreach (var b in e.Brushes)
                {
                    sw.WriteLine($"// brush {brushIdx}");
                    sw.WriteLine("{");
                    sw.Write(b.OriginalText);
                    if (!b.OriginalText.EndsWith("\n")) sw.WriteLine();
                    sw.WriteLine("}");
                    brushIdx++;
                }
                foreach (var p in e.Patches)
                {
                    sw.WriteLine("{");
                    sw.Write(p.OriginalText);
                    if (!p.OriginalText.EndsWith("\n")) sw.WriteLine();
                    sw.WriteLine("}");
                }
                sw.WriteLine("}");
            }
        }

        private static string EscapeQuoted(string s)
        {
            // q3 .map quoted strings don't support \" escaping, so we fail loud rather than
            // silently mis-emit. Light entities never carry quotes; only triggers occasionally
            // do via the editor.
            if (s.Contains('"')) throw new System.IO.IOException("MapFileWriter cannot serialise a key/value containing '\"'");
            return s;
        }
    }
}
