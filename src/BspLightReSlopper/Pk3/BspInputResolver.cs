using System;
using System.IO;

namespace BspLightReSlopper.Pk3
{
    /// <summary>
    /// Resolves the user-supplied <c>--bsp</c> argument into a byte buffer. Accepted forms:
    /// <list type="bullet">
    ///   <item><c>path/to/loose.bsp</c></item>
    ///   <item><c>path/to/pak.pk3!maps/foo.bsp</c></item>
    ///   <item><c>maps/foo.bsp</c> (resolved through a <see cref="Pk3Stack"/>)</item>
    /// </list>
    /// </summary>
    public static class BspInputResolver
    {
        public sealed class ResolvedBsp
        {
            public string DisplayName { get; init; } = string.Empty;
            public byte[] Bytes { get; init; } = System.Array.Empty<byte>();
        }

        public static ResolvedBsp Resolve(string input, Pk3Stack? stack)
        {
            if (string.IsNullOrEmpty(input)) throw new ArgumentException("empty bsp argument");

            int bang = input.IndexOf('!');
            if (bang > 0)
            {
                string archivePath = input.Substring(0, bang);
                string inner = input.Substring(bang + 1);
                if (!File.Exists(archivePath))
                    throw new FileNotFoundException("pk3 archive not found: " + archivePath);
                using var z = System.IO.Compression.ZipFile.OpenRead(archivePath);
                var entry = z.GetEntry(inner.Replace('\\', '/'))
                    ?? throw new FileNotFoundException($"entry '{inner}' not found in '{archivePath}'");
                using var es = entry.Open();
                using var ms = new MemoryStream(checked((int)entry.Length));
                es.CopyTo(ms);
                return new ResolvedBsp
                {
                    DisplayName = $"{archivePath}!{inner}",
                    Bytes = ms.ToArray(),
                };
            }

            if (File.Exists(input))
            {
                return new ResolvedBsp
                {
                    DisplayName = input,
                    Bytes = File.ReadAllBytes(input),
                };
            }

            // Try resolving through the asset stack.
            if (stack != null)
            {
                using var s = stack.Open(input);
                if (s != null)
                {
                    using var ms = new MemoryStream();
                    s.CopyTo(ms);
                    return new ResolvedBsp
                    {
                        DisplayName = "(asset-stack) " + input,
                        Bytes = ms.ToArray(),
                    };
                }
            }

            throw new FileNotFoundException("could not resolve bsp input: " + input);
        }
    }
}
