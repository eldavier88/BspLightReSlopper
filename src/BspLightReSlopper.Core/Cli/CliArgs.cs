using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace BspLightReSlopper.Cli
{
    /// <summary>
    /// Hand-rolled argument bag: <c>--key value</c>, <c>--flag</c>, and a single positional
    /// command name. Supports <c>--config path.json</c> for persistent settings (merged
    /// under explicit CLI args).
    /// </summary>
    public sealed class CliArgs
    {
        private readonly Dictionary<string, string> _opts = new(StringComparer.OrdinalIgnoreCase);
        private readonly HashSet<string> _flags = new(StringComparer.OrdinalIgnoreCase);

        public string Command { get; }
        public IReadOnlyList<string> Positionals { get; }

        public string? Get(string name) => _opts.TryGetValue(name, out var v) ? v : null;
        public bool Has(string name) => _opts.ContainsKey(name) || _flags.Contains(name);
        public bool Flag(string name) => _flags.Contains(name);

        public string Require(string name) => Get(name) ?? throw new ArgumentException($"missing required option --{name}");

        public CliArgs(string command, IReadOnlyList<string> positionals, Dictionary<string, string> opts, HashSet<string> flags)
        {
            Command = command;
            Positionals = positionals;
            foreach (var kv in opts) _opts[kv.Key] = kv.Value;
            foreach (var f in flags) _flags.Add(f);
        }

        public static CliArgs Parse(string[] args)
        {
            string command = args.Length > 0 ? args[0] : "help";
            var pos = new List<string>();
            var opts = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            var flags = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            // First pass: extract --config before everything else
            string? configPath = null;
            for (int i = 1; i < args.Length; i++)
            {
                if (args[i] == "--config" && i + 1 < args.Length)
                {
                    configPath = args[i + 1];
                    break;
                }
            }

            // Load config as defaults (lower priority than CLI args)
            if (!string.IsNullOrEmpty(configPath) && File.Exists(configPath))
            {
                try
                {
                    var json = File.ReadAllText(configPath);
                    var cfg = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);
                    if (cfg != null)
                    {
                        foreach (var kv in cfg)
                        {
                            switch (kv.Value.ValueKind)
                            {
                                case JsonValueKind.String:
                                    opts[kv.Key] = kv.Value.GetString() ?? "";
                                    break;
                                case JsonValueKind.Number:
                                    opts[kv.Key] = kv.Value.GetRawText();
                                    break;
                                case JsonValueKind.True:
                                    flags.Add(kv.Key);
                                    break;
                                case JsonValueKind.False:
                                    // flag explicitly disabled in config; skip
                                    break;
                            }
                        }
                    }
                }
                catch (JsonException)
                {
                    // malformed config file ignored; explicit args still work
                }
            }

            // Second pass: CLI args override config
            for (int i = 1; i < args.Length; i++)
            {
                string a = args[i];
                if (a.StartsWith("--", StringComparison.Ordinal))
                {
                    string key = a.Substring(2);
                    if (i + 1 < args.Length && !args[i + 1].StartsWith("--", StringComparison.Ordinal) && !args[i + 1].StartsWith("-", StringComparison.Ordinal))
                    {
                        opts[key] = args[++i];
                    }
                    else
                    {
                        flags.Add(key);
                    }
                }
                else if (a.StartsWith("-", StringComparison.Ordinal))
                {
                    string key = a.Substring(1);
                    if (i + 1 < args.Length && !args[i + 1].StartsWith("-", StringComparison.Ordinal))
                        opts[key] = args[++i];
                    else
                        flags.Add(key);
                }
                else
                {
                    pos.Add(a);
                }
            }
            return new CliArgs(command, pos, opts, flags);
        }
    }
}
