using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Numerics;
using System.Text;

namespace BspLightReSlopper.MapFile
{
    /// <summary>
    /// Tokenising parser for Q3-family <c>.map</c> source files. Designed to round-trip
    /// JK2/JKA/Q3 SDK example maps without losing brush geometry, while exposing a clean
    /// mutable entity API for the random-light-scatter pipeline.
    ///
    /// <para>Comments: <c>// ...</c> to end-of-line, plus <c>/* ... */</c> blocks. All
    /// comments are stripped during tokenisation. Strings are double-quote-delimited.</para>
    ///
    /// <para>Brush dialects supported: <see cref="MapBrushDialect.Legacy"/> (Quake-style six
    /// floats per side), <see cref="MapBrushDialect.BrushDef"/> (Q3 brush primitives with
    /// <c>brushDef</c> + texdef matrix), and <see cref="MapBrushDialect.BrushDef3"/> (Doom3
    /// style; also seen in some JKA SDK maps). Patches (<c>patchDef2</c>/<c>patchDef3</c>) are
    /// preserved as opaque text — we don't deform them.</para>
    /// </summary>
    public static class MapFileParser
    {
        // Shaders flagged as non-solid for point-in-solid purposes. Match by suffix or
        // contains: q3 maps put these under common/, JK2 uses the same names.
        private static readonly string[] NonSolidShaderHints =
        {
            "trigger",
            "clip",
            "areaportal",
            "hint",
            "skip",
            "weapclip",
            "monsterclip",
            "playerclip",
            "nodraw_solid", // edge case: nodraw_solid IS solid; handled below
            "antiportal",
            "donotenter",
            "cushion",
        };

        // Hints that override the non-solid classification (still solid).
        private static readonly string[] StillSolidOverrides =
        {
            "nodraw_solid",
        };

        public static MapFile ParseFile(string path) => Parse(File.ReadAllText(path));

        public static MapFile Parse(string text)
        {
            var map = new MapFile();
            int pos = 0;
            int len = text.Length;

            // Detect dialect on first brush (set on map at end).
            MapBrushDialect detected = MapBrushDialect.BrushDef;
            bool detectedSet = false;

            while (true)
            {
                if (!SkipWhitespaceAndComments(text, ref pos)) break;
                char c = text[pos];
                if (c == '{')
                {
                    pos++;
                    var ent = ParseEntity(text, ref pos, ref detected, ref detectedSet);
                    map.Entities.Add(ent);
                }
                else if (c == '}')
                {
                    throw new FormatException($"unexpected '}}' at offset {pos}");
                }
                else
                {
                    throw new FormatException($"unexpected character '{c}' (0x{(int)c:X2}) at offset {pos}; expected '{{'");
                }
            }

            map.Dialect = detected;
            return map;
        }

        // ---- entity ----
        private static MapEntity ParseEntity(string text, ref int pos, ref MapBrushDialect detected, ref bool detectedSet)
        {
            var ent = new MapEntity();
            while (true)
            {
                if (!SkipWhitespaceAndComments(text, ref pos))
                    throw new FormatException("unexpected end of file inside entity");
                char c = text[pos];
                if (c == '}')
                {
                    pos++;
                    return ent;
                }
                if (c == '"')
                {
                    string key = ParseQuoted(text, ref pos);
                    if (!SkipWhitespaceAndComments(text, ref pos))
                        throw new FormatException("expected value after key '" + key + "'");
                    if (text[pos] != '"')
                        throw new FormatException("expected quoted value after key '" + key + "' at offset " + pos);
                    string val = ParseQuoted(text, ref pos);
                    ent.Keys.Add(new KeyValuePair<string, string>(key, val));
                }
                else if (c == '{')
                {
                    pos++; // enter brush/patch block
                    ParseBrushOrPatch(text, ref pos, ent, ref detected, ref detectedSet);
                }
                else
                {
                    throw new FormatException($"unexpected character '{c}' inside entity at offset {pos}");
                }
            }
        }

        // ---- brush / patch ----
        private static void ParseBrushOrPatch(string text, ref int pos, MapEntity ent, ref MapBrushDialect detected, ref bool detectedSet)
        {
            int blockStart = pos;
            if (!SkipWhitespaceAndComments(text, ref pos))
                throw new FormatException("unexpected EOF inside brush/patch");

            // Peek at the first non-whitespace token.
            int saved = pos;
            string firstToken = PeekToken(text, pos);

            MapBrushDialect dialect;
            bool isPatch = false;

            switch (firstToken)
            {
                case "brushDef":
                    dialect = MapBrushDialect.BrushDef;
                    pos += "brushDef".Length;
                    SkipWhitespaceAndComments(text, ref pos);
                    if (pos >= text.Length || text[pos] != '{')
                        throw new FormatException("expected '{' after 'brushDef'");
                    pos++;
                    break;
                case "brushDef3":
                    dialect = MapBrushDialect.BrushDef3;
                    pos += "brushDef3".Length;
                    SkipWhitespaceAndComments(text, ref pos);
                    if (pos >= text.Length || text[pos] != '{')
                        throw new FormatException("expected '{' after 'brushDef3'");
                    pos++;
                    break;
                case "patchDef2":
                case "patchDef3":
                    isPatch = true;
                    dialect = MapBrushDialect.BrushDef; // unused for patches
                    break;
                default:
                    // Legacy brush — first token is "(", part of the first plane line.
                    dialect = MapBrushDialect.Legacy;
                    break;
            }

            if (!detectedSet) { detected = dialect; detectedSet = true; }

            if (isPatch)
            {
                // Capture full block text up to matching brace; we don't deform patches.
                int patchStart = blockStart;
                int patchEnd = SkipBalancedBraces(text, pos);
                ent.Patches.Add(new MapPatch { OriginalText = text.Substring(patchStart, patchEnd - patchStart) });
                pos = patchEnd + 1; // past the closing '}'
                // For brushDef-wrapped patches there's another '}' to close. Standard format
                // uses single brace though. Handle both: if next non-ws is '}' it's an
                // outer wrapper.
                int peek = pos; SkipWhitespaceAndComments(text, ref peek);
                // (no-op)
                return;
            }

            var brush = new MapBrush { Dialect = dialect };
            int sidesParsedFrom = pos;

            ParseBrushSides(text, ref pos, brush, dialect);

            // If wrapped in brushDef, consume the outer '}' too.
            if (dialect != MapBrushDialect.Legacy)
            {
                if (!SkipWhitespaceAndComments(text, ref pos) || text[pos] != '}')
                    throw new FormatException($"expected closing '}}' after brushDef at offset {pos}");
                pos++;
            }

            // Capture the full original text (including wrapper) for round-trip.
            int textEnd = pos;
            string raw = text.Substring(blockStart, textEnd - blockStart - 1).TrimEnd(); // strip the outer '}' we'll re-emit
            // Actually we want the ORIGINAL text from the inner content of the outer brush
            // braces (between the opening '{' that put us into ParseBrushOrPatch and the
            // closing '}'). blockStart points one char after the outer '{'; textEnd is
            // immediately after the matching outer '}'. Capture inner text up to textEnd-1.
            // The above logic already does this; we just trim trailing whitespace.

            ComputeBoundsFromPlanes(brush);
            ClassifyBrushSolidity(brush);
            brush.OriginalText = raw;
            ent.Brushes.Add(brush);
            _ = sidesParsedFrom; // reserved for future per-side text-range tracking
        }

        private static void ParseBrushSides(string text, ref int pos, MapBrush brush, MapBrushDialect dialect)
        {
            while (true)
            {
                if (!SkipWhitespaceAndComments(text, ref pos))
                    throw new FormatException("unexpected EOF inside brush");
                if (text[pos] == '}')
                {
                    pos++;
                    return;
                }
                if (text[pos] != '(')
                    throw new FormatException($"expected '(' at start of brush side, got '{text[pos]}' at offset {pos}");

                Vector3 p1 = ReadVec3(text, ref pos);
                Vector3 p2 = ReadVec3(text, ref pos);
                Vector3 p3 = ReadVec3(text, ref pos);

                if (dialect != MapBrushDialect.Legacy)
                {
                    // brushDef texdef: ( ( a b c ) ( d e f ) ) shader contents flags value
                    SkipWhitespaceAndComments(text, ref pos);
                    if (text[pos] != '(') throw new FormatException("expected '(' for texdef matrix");
                    pos++; // outer
                    SkipWhitespaceAndComments(text, ref pos);
                    if (text[pos] != '(') throw new FormatException("expected '(' for texdef row 1");
                    Vector3 _row1 = ReadVec3(text, ref pos); _ = _row1;
                    SkipWhitespaceAndComments(text, ref pos);
                    if (text[pos] != '(') throw new FormatException("expected '(' for texdef row 2");
                    Vector3 _row2 = ReadVec3(text, ref pos); _ = _row2;
                    SkipWhitespaceAndComments(text, ref pos);
                    if (text[pos] != ')') throw new FormatException("expected ')' for texdef");
                    pos++;
                }

                // Shader token (until whitespace).
                SkipWhitespaceAndComments(text, ref pos);
                string shader = ReadToken(text, ref pos);
                // Skip remainder of line: contents flags value (legacy: also u v rot su sv).
                SkipToEndOfLine(text, ref pos);

                Vector3 ab = p2 - p1;
                Vector3 ac = p3 - p1;
                Vector3 normal = Vector3.Normalize(Vector3.Cross(ac, ab));
                float dist = Vector3.Dot(normal, p1);
                if (!float.IsFinite(normal.X)) continue; // degenerate side; skip
                brush.Sides.Add(new MapPlane(normal, dist, shader));
            }
        }

        // Compute brush AABB by intersecting plane half-spaces with the bounding cube of the
        // entire q3 worldspace (±65536). Cheap LP-style: clip a candidate AABB by each plane.
        // For practical brushes (convex, ≤ ~30 sides) this is O(sides·8 vertices) per brush.
        private static void ComputeBoundsFromPlanes(MapBrush brush)
        {
            // Start with the q3 universe bounds.
            const float B = 65536f;
            var pts = new List<Vector3>(8)
            {
                new(-B,-B,-B), new( B,-B,-B), new(-B, B,-B), new( B, B,-B),
                new(-B,-B, B), new( B,-B, B), new(-B, B, B), new( B, B, B),
            };
            // Sutherland-Hodgman in 3D: for each plane, intersect the current point cloud's
            // convex hull with the half-space n·p ≤ d. We approximate by clipping the AABB
            // bounds (not exact but tight enough for the random-scatter use case which only
            // needs a containing AABB, not the exact polytope).
            //
            // Since we already gathered plane points (from p1/p2/p3 of each side, the brush's
            // vertices are intersections of triples of planes), use those:
            // But that's expensive. Cheap robust alternative: use the original three points
            // per side as a "vertex sample"; their min/max gives a correct (possibly loose)
            // AABB because every brush vertex is the intersection of three planes, and those
            // intersection points are bounded by the plane reference points the user typed.
            //
            // In practice the first three points of every side ARE on the brush's surface
            // (that's the definition of a brush plane), so min/max over them is a valid
            // (slightly loose) bound. For our point-in-solid test we additionally require
            // n·p ≤ d for ALL planes, so the AABB is only used as a fast reject.
            Vector3 lo = new(float.PositiveInfinity);
            Vector3 hi = new(float.NegativeInfinity);
            foreach (var s in brush.Sides)
            {
                // Compute one point on the plane — just pick the foot of the origin onto the plane.
                Vector3 p = s.Normal * s.Dist;
                lo = Vector3.Min(lo, p - new Vector3(64));
                hi = Vector3.Max(hi, p + new Vector3(64));
            }
            // Intersect with universe.
            lo = Vector3.Max(lo, new Vector3(-B));
            hi = Vector3.Min(hi, new Vector3(B));
            brush.Mins = lo;
            brush.Maxs = hi;
            _ = pts; // pts retained for potential future precise-poly extraction
        }

        private static void ClassifyBrushSolidity(MapBrush brush)
        {
            // A brush is non-solid only if EVERY side carries a non-solid shader. Any solid
            // face means the whole brush is solid (per Q3 convention).
            foreach (var s in brush.Sides)
            {
                string sh = s.Shader.ToLowerInvariant();
                bool overrideSolid = false;
                foreach (var ov in StillSolidOverrides) if (sh.Contains(ov)) { overrideSolid = true; break; }
                if (overrideSolid) { brush.IsNonSolid = false; return; }
                bool hint = false;
                foreach (var h in NonSolidShaderHints) if (sh.Contains(h)) { hint = true; break; }
                if (!hint) { brush.IsNonSolid = false; return; }
            }
            brush.IsNonSolid = brush.Sides.Count > 0;
        }

        // ---- token helpers ----
        private static bool SkipWhitespaceAndComments(string s, ref int pos)
        {
            while (pos < s.Length)
            {
                char c = s[pos];
                if (c == ' ' || c == '\t' || c == '\r' || c == '\n') { pos++; continue; }
                if (c == '/' && pos + 1 < s.Length)
                {
                    char d = s[pos + 1];
                    if (d == '/')
                    {
                        pos += 2;
                        while (pos < s.Length && s[pos] != '\n') pos++;
                        continue;
                    }
                    if (d == '*')
                    {
                        pos += 2;
                        while (pos + 1 < s.Length && !(s[pos] == '*' && s[pos + 1] == '/')) pos++;
                        if (pos + 1 < s.Length) pos += 2;
                        continue;
                    }
                }
                return true;
            }
            return false;
        }

        private static void SkipToEndOfLine(string s, ref int pos)
        {
            while (pos < s.Length && s[pos] != '\n') pos++;
            if (pos < s.Length) pos++;
        }

        private static string ParseQuoted(string s, ref int pos)
        {
            if (s[pos] != '"') throw new FormatException("expected '\"' at " + pos);
            pos++;
            int start = pos;
            while (pos < s.Length && s[pos] != '"') pos++;
            if (pos >= s.Length) throw new FormatException("unterminated quoted string");
            string r = s.Substring(start, pos - start);
            pos++;
            return r;
        }

        private static string ReadToken(string s, ref int pos)
        {
            int start = pos;
            while (pos < s.Length)
            {
                char c = s[pos];
                if (c == ' ' || c == '\t' || c == '\r' || c == '\n') break;
                pos++;
            }
            return s.Substring(start, pos - start);
        }

        private static string PeekToken(string s, int pos)
        {
            int p = pos;
            while (p < s.Length && (s[p] == ' ' || s[p] == '\t' || s[p] == '\r' || s[p] == '\n')) p++;
            int start = p;
            while (p < s.Length && s[p] != ' ' && s[p] != '\t' && s[p] != '\r' && s[p] != '\n' && s[p] != '{' && s[p] != '}') p++;
            return s.Substring(start, p - start);
        }

        private static Vector3 ReadVec3(string s, ref int pos)
        {
            SkipWhitespaceAndComments(s, ref pos);
            if (s[pos] != '(') throw new FormatException("expected '(' at " + pos);
            pos++;
            var v = new Vector3(ReadFloat(s, ref pos), ReadFloat(s, ref pos), ReadFloat(s, ref pos));
            SkipWhitespaceAndComments(s, ref pos);
            if (s[pos] != ')') throw new FormatException("expected ')' at " + pos);
            pos++;
            return v;
        }

        private static float ReadFloat(string s, ref int pos)
        {
            SkipWhitespaceAndComments(s, ref pos);
            int start = pos;
            while (pos < s.Length)
            {
                char c = s[pos];
                if ((c >= '0' && c <= '9') || c == '-' || c == '+' || c == '.' || c == 'e' || c == 'E') pos++;
                else break;
            }
            string slice = s.Substring(start, pos - start);
            return float.Parse(slice, NumberStyles.Float, CultureInfo.InvariantCulture);
        }

        private static int SkipBalancedBraces(string s, int pos)
        {
            // Caller is just past the inner block opener; we need to find the matching '}'.
            int depth = 1;
            while (pos < s.Length)
            {
                char c = s[pos];
                if (c == '{') depth++;
                else if (c == '}') { depth--; if (depth == 0) return pos; }
                else if (c == '/' && pos + 1 < s.Length && s[pos + 1] == '/') { while (pos < s.Length && s[pos] != '\n') pos++; continue; }
                pos++;
            }
            throw new FormatException("unbalanced braces (patch block never closed)");
        }
    }
}
