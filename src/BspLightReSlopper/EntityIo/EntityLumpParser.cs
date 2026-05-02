using System.Collections.Generic;

namespace BspLightReSlopper.EntityIo
{
    /// <summary>
    /// Parses the BSP entity-lump text into a list of <see cref="Entity"/>. Format is
    /// q3-style: a stream of <c>{ "key" "value" ... }</c> blocks, with optional
    /// <c>// ...</c> line comments. We're forgiving: unknown garbage is skipped with a
    /// best-effort warning channel.
    /// </summary>
    public static class EntityLumpParser
    {
        public sealed class ParseResult
        {
            public IReadOnlyList<Entity> Entities { get; init; } = System.Array.Empty<Entity>();
            public IReadOnlyList<string> Warnings { get; init; } = System.Array.Empty<string>();
        }

        public static ParseResult Parse(string text)
        {
            var entities = new List<Entity>();
            var warnings = new List<string>();
            int i = 0;
            int line = 1;
            int n = text.Length;

            while (i < n)
            {
                // skip whitespace + comments
                SkipWhitespaceAndComments(text, ref i, ref line);
                if (i >= n) break;

                if (text[i] == '{')
                {
                    i++;
                    var ent = new Entity();
                    while (i < n)
                    {
                        SkipWhitespaceAndComments(text, ref i, ref line);
                        if (i >= n) { warnings.Add($"line {line}: unterminated entity block"); break; }
                        if (text[i] == '}') { i++; break; }
                        if (text[i] != '"')
                        {
                            warnings.Add($"line {line}: expected '\"' to start key, got '{text[i]}'");
                            // recover by scanning to next quote or }
                            while (i < n && text[i] != '"' && text[i] != '}') { if (text[i] == '\n') line++; i++; }
                            continue;
                        }
                        if (!TryReadString(text, ref i, ref line, out string key, out string err))
                        {
                            warnings.Add($"line {line}: bad key — {err}");
                            break;
                        }
                        SkipWhitespaceAndComments(text, ref i, ref line);
                        if (i >= n || text[i] != '"')
                        {
                            warnings.Add($"line {line}: expected value string after key '{key}'");
                            break;
                        }
                        if (!TryReadString(text, ref i, ref line, out string val, out err))
                        {
                            warnings.Add($"line {line}: bad value — {err}");
                            break;
                        }
                        ent.Set(key, val);
                    }
                    entities.Add(ent);
                }
                else
                {
                    warnings.Add($"line {line}: unexpected '{text[i]}', expected '{{'");
                    i++;
                }
            }

            return new ParseResult { Entities = entities, Warnings = warnings };
        }

        private static void SkipWhitespaceAndComments(string s, ref int i, ref int line)
        {
            while (i < s.Length)
            {
                char c = s[i];
                if (c == ' ' || c == '\t' || c == '\r') { i++; }
                else if (c == '\n') { line++; i++; }
                else if (c == '/' && i + 1 < s.Length && s[i + 1] == '/')
                {
                    while (i < s.Length && s[i] != '\n') i++;
                }
                else break;
            }
        }

        private static bool TryReadString(string s, ref int i, ref int line, out string value, out string err)
        {
            value = string.Empty; err = string.Empty;
            if (s[i] != '"') { err = "expected opening quote"; return false; }
            i++;
            int start = i;
            while (i < s.Length && s[i] != '"')
            {
                if (s[i] == '\n') line++;
                i++;
            }
            if (i >= s.Length) { err = "unterminated string"; return false; }
            value = s.Substring(start, i - start);
            i++; // skip closing quote
            return true;
        }
    }
}
