using System;
using System.Collections.Generic;
using System.Linq;

namespace BspLightReSlopper.Cli
{
    /// <summary>
    /// Hand-rolled argument bag: <c>--key value</c>, <c>--flag</c>, and a single positional
    /// command name. We deliberately avoid a heavy CLI library in Phase A.
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

        /// <summary>
        /// Three-way flag resolution for opt-out-style switches. Returns:
        /// <list type="bullet">
        ///   <item><c>true</c> if <c>--{positiveName}</c> is present.</item>
        ///   <item><c>false</c> if <c>--{negativeName}</c> is present.</item>
        ///   <item><paramref name="defaultValue"/> otherwise.</item>
        /// </list>
        /// If both flags are present, the negative wins (explicit opt-out beats explicit opt-in).
        /// Used for sophisticated-default behaviours (half-Lambert, minimize-lights, refine-lights)
        /// so they're on without any flag and can be turned off with a single <c>--no-*</c>.
        /// </summary>
        public bool FlagOrDefault(string positiveName, string negativeName, bool defaultValue)
        {
            if (_flags.Contains(negativeName)) return false;
            if (_flags.Contains(positiveName)) return true;
            return defaultValue;
        }

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
