using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using BspLightReSlopper.Pk3;

namespace BspLightReSlopper.Shaders
{
    /// <summary>
    /// Phase E8 -- minimalist q3-style <c>.shader</c> file parser. Extracts only the bits
    /// the bounce-suppressor needs:
    /// <list type="bullet">
    ///   <item><b>name</b> -- the shader's full path (the line above the <c>{</c>).</item>
    ///   <item><b>editorImage</b> -- the <c>qer_editorimage</c> directive (preferred for
    ///         albedo because the editor image is the artist's canonical surface texture).</item>
    ///   <item><b>q3mapLightImage</b> -- the <c>q3map_lightImage</c> directive (q3map2's
    ///         override for radiosity bounce; takes precedence over editorImage when set).</item>
    ///   <item><b>firstStageMap</b> -- fallback: the first stage's <c>map</c> directive.</item>
    /// </list>
    ///
    /// <para>Q3 .shader syntax is a quirky variant of csv-with-braces: top-level shader name,
    /// open brace, key/value lines and stage sub-blocks (also brace-delimited), close brace.
    /// Comments start with <c>//</c>. Keys are case-insensitive. We're permissive about
    /// whitespace and don't validate other shader directives.</para>
    /// </summary>
    public static class ShaderParser
    {
        public sealed class Shader
        {
            public string Name { get; init; } = "";
            public string? EditorImage { get; init; }
            public string? Q3MapLightImage { get; init; }
            public string? FirstStageMap { get; init; }

            /// <summary>The best path to use for albedo lookup, in priority order.</summary>
            public string? PreferredImagePath
            {
                get
                {
                    if (!string.IsNullOrEmpty(Q3MapLightImage)) return Q3MapLightImage;
                    if (!string.IsNullOrEmpty(EditorImage)) return EditorImage;
                    return FirstStageMap;
                }
            }
        }

        /// <summary>Parse all shader blocks out of the given text. Returns one entry per
        /// shader, keyed by lower-cased name for case-insensitive lookup.</summary>
        public static Dictionary<string, Shader> Parse(string text)
        {
            var dict = new Dictionary<string, Shader>(StringComparer.OrdinalIgnoreCase);
            using var sr = new StringReader(StripComments(text));
            string? line;
            string? pendingName = null;
            while ((line = sr.ReadLine()) != null)
            {
                line = line.Trim();
                if (line.Length == 0) continue;
                if (line == "{")
                {
                    if (pendingName == null) { SkipBlock(sr, 1); continue; }
                    var sh = ParseShaderBody(sr, pendingName);
                    dict[sh.Name] = sh;
                    pendingName = null;
                }
                else if (line == "}")
                {
                    // Stray close brace; skip
                }
                else
                {
                    pendingName = line;
                }
            }
            return dict;
        }

        /// <summary>Convenience: parse every <c>scripts/*.shader</c> file in a Pk3Stack
        /// and return the merged shader dictionary. Later definitions in alphabetic order
        /// win (matches q3 engine convention).</summary>
        public static Dictionary<string, Shader> ParseAllInPk3Stack(Pk3Stack stack)
        {
            var dict = new Dictionary<string, Shader>(StringComparer.OrdinalIgnoreCase);
            // q3 .shader files live in scripts/ (or shaders/ for some games). We try both.
            foreach (var prefix in new[] { "scripts", "shaders" })
            {
                foreach (var path in stack.EnumerateAll(prefix, "shader"))
                {
                    string text;
                    using (var s = stack.Open(path))
                    {
                        if (s == null) continue;
                        using var sr = new StreamReader(s);
                        text = sr.ReadToEnd();
                    }
                    foreach (var kv in Parse(text)) dict[kv.Key] = kv.Value;
                }
            }
            return dict;
        }

        private static Shader ParseShaderBody(StringReader sr, string name)
        {
            string? editorImage = null, lightImage = null, firstStageMap = null;
            int depth = 1;
            bool inStage = false;
            // CRITICAL: don't combine the ReadLine + depth-check into a single while
            // condition -- C# evaluates the assignment first and consumes the next line
            // even when depth has already reached 0, swallowing the next shader's name.
            while (depth > 0)
            {
                string? line = sr.ReadLine();
                if (line == null) break;
                line = line.Trim();
                if (line.Length == 0) continue;
                if (line == "{") { depth++; inStage = depth > 1; continue; }
                if (line == "}") { depth--; if (depth <= 1) inStage = false; continue; }

                // Tokenise on whitespace; the directive is the first token.
                int sp = -1;
                for (int i = 0; i < line.Length; i++)
                {
                    if (line[i] == ' ' || line[i] == '\t') { sp = i; break; }
                }
                string key, rest;
                if (sp < 0) { key = line; rest = ""; }
                else { key = line.Substring(0, sp); rest = line.Substring(sp + 1).Trim(); }

                if (depth == 1)
                {
                    if (string.Equals(key, "qer_editorimage", StringComparison.OrdinalIgnoreCase))
                        editorImage = NormaliseImagePath(rest);
                    else if (string.Equals(key, "q3map_lightImage", StringComparison.OrdinalIgnoreCase)
                          || string.Equals(key, "q3map_lightimage", StringComparison.OrdinalIgnoreCase))
                        lightImage = NormaliseImagePath(rest);
                }
                else if (inStage && firstStageMap == null)
                {
                    if (string.Equals(key, "map", StringComparison.OrdinalIgnoreCase)
                        && !rest.StartsWith("$", StringComparison.Ordinal)
                        && !rest.StartsWith("*", StringComparison.Ordinal))
                    {
                        firstStageMap = NormaliseImagePath(rest);
                    }
                }
            }
            return new Shader
            {
                Name = name,
                EditorImage = editorImage,
                Q3MapLightImage = lightImage,
                FirstStageMap = firstStageMap,
            };
        }

        private static void SkipBlock(StringReader sr, int initialDepth)
        {
            int depth = initialDepth;
            string? line;
            while (depth > 0 && (line = sr.ReadLine()) != null)
            {
                line = line.Trim();
                if (line == "{") depth++;
                else if (line == "}") depth--;
            }
        }

        private static string NormaliseImagePath(string s)
        {
            // Strip an explicit extension if present (q3 normally omits it; the loader
            // tries .tga, .jpg, .png in turn).
            string p = s.Trim().Replace('\\', '/');
            int q = p.IndexOf(' ');
            if (q > 0) p = p.Substring(0, q); // strip trailing args
            return p;
        }

        private static string StripComments(string text)
        {
            var sb = new StringBuilder(text.Length);
            int i = 0;
            while (i < text.Length)
            {
                if (i + 1 < text.Length && text[i] == '/' && text[i + 1] == '/')
                {
                    while (i < text.Length && text[i] != '\n') i++;
                }
                else if (i + 1 < text.Length && text[i] == '/' && text[i + 1] == '*')
                {
                    i += 2;
                    while (i + 1 < text.Length && !(text[i] == '*' && text[i + 1] == '/')) i++;
                    i += 2;
                }
                else { sb.Append(text[i]); i++; }
            }
            return sb.ToString();
        }
    }
}
