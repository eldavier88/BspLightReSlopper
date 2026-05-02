using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;

namespace BspLightReSlopper.Pk3
{
    /// <summary>
    /// q3-style asset search stack rooted at a directory containing <c>*.pk3</c> files
    /// and/or loose files. Search precedence (matches the original engine convention):
    /// <list type="number">
    ///   <item>Loose files relative to the directory</item>
    ///   <item>Subdirectories of the directory containing <c>*.pk3</c> files (e.g. <c>base/</c>)</item>
    ///   <item>PK3 archives in the directory, sorted descending so later names win</item>
    /// </list>
    /// All paths inside PK3s use forward slashes; this class normalises any input.
    /// </summary>
    public sealed class Pk3Stack : IDisposable
    {
        private readonly string _root;
        private readonly List<ZipArchive> _archives = new();
        private readonly List<string> _archivePaths = new();
        private readonly List<string> _looseRoots = new();
        private bool _disposed;

        public string Root => _root;
        public IReadOnlyList<string> ArchivePaths => _archivePaths;
        public IReadOnlyList<string> LooseRoots => _looseRoots;

        public Pk3Stack(string assetRoot)
        {
            if (!Directory.Exists(assetRoot))
                throw new DirectoryNotFoundException("asset root not found: " + assetRoot);
            _root = Path.GetFullPath(assetRoot);

            // Loose roots: the asset root itself, plus any subdirectory that looks like
            // a content folder (heuristic: contains maps/ or scripts/ or shaders/ or *.pk3).
            _looseRoots.Add(_root);
            foreach (var sub in Directory.EnumerateDirectories(_root))
            {
                if (LooksLikeContentDir(sub) && !_looseRoots.Contains(sub, StringComparer.OrdinalIgnoreCase))
                    _looseRoots.Add(sub);
            }

            // Collect *.pk3 files from the root and from each loose root, descending sort.
            var pk3List = new List<string>();
            foreach (var dir in _looseRoots)
            {
                pk3List.AddRange(Directory.EnumerateFiles(dir, "*.pk3", SearchOption.TopDirectoryOnly));
            }
            pk3List = pk3List.Distinct(StringComparer.OrdinalIgnoreCase)
                              .OrderByDescending(p => Path.GetFileName(p), StringComparer.OrdinalIgnoreCase)
                              .ToList();
            foreach (var pk3 in pk3List)
            {
                try
                {
                    var z = ZipFile.OpenRead(pk3);
                    _archives.Add(z);
                    _archivePaths.Add(pk3);
                }
                catch (Exception ex)
                {
                    throw new InvalidDataException($"failed to open pk3 '{pk3}': {ex.Message}", ex);
                }
            }
        }

        private static bool LooksLikeContentDir(string dir)
        {
            return Directory.Exists(Path.Combine(dir, "maps"))
                || Directory.Exists(Path.Combine(dir, "scripts"))
                || Directory.Exists(Path.Combine(dir, "shaders"))
                || Directory.EnumerateFiles(dir, "*.pk3", SearchOption.TopDirectoryOnly).Any();
        }

        /// <summary>
        /// Open the named asset (e.g. <c>maps/kejim_post.bsp</c>, <c>shaders/base_floor.shader</c>).
        /// Returns null if not found.
        /// Caller owns the returned stream.
        /// </summary>
        public Stream? Open(string relativePath)
        {
            string normalised = NormalisePath(relativePath);

            // Loose-file precedence
            foreach (var root in _looseRoots)
            {
                string fp = Path.Combine(root, normalised.Replace('/', Path.DirectorySeparatorChar));
                if (File.Exists(fp)) return File.OpenRead(fp);
            }

            // PK3 precedence (sorted desc, so first match wins)
            foreach (var z in _archives)
            {
                var entry = z.GetEntry(normalised);
                if (entry != null)
                {
                    // ZipArchiveEntry stream is read-once and not seekable. Copy into MemoryStream.
                    var ms = new MemoryStream(checked((int)entry.Length));
                    using var es = entry.Open();
                    es.CopyTo(ms);
                    ms.Position = 0;
                    return ms;
                }
            }

            return null;
        }

        public bool Exists(string relativePath)
        {
            string normalised = NormalisePath(relativePath);
            foreach (var root in _looseRoots)
            {
                string fp = Path.Combine(root, normalised.Replace('/', Path.DirectorySeparatorChar));
                if (File.Exists(fp)) return true;
            }
            foreach (var z in _archives)
            {
                if (z.GetEntry(normalised) != null) return true;
            }
            return false;
        }

        public IEnumerable<string> EnumerateAll(string prefix, string extension)
        {
            string p = NormalisePath(prefix).TrimEnd('/');
            string ext = extension.StartsWith(".", StringComparison.Ordinal) ? extension : "." + extension;
            var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var root in _looseRoots)
            {
                string baseDir = Path.Combine(root, p.Replace('/', Path.DirectorySeparatorChar));
                if (!Directory.Exists(baseDir)) continue;
                foreach (var f in Directory.EnumerateFiles(baseDir, "*" + ext, SearchOption.AllDirectories))
                {
                    string rel = Path.GetRelativePath(root, f).Replace('\\', '/');
                    if (seen.Add(rel)) yield return rel;
                }
            }
            foreach (var z in _archives)
            {
                foreach (var entry in z.Entries)
                {
                    string n = entry.FullName;
                    if (n.EndsWith(ext, StringComparison.OrdinalIgnoreCase)
                        && n.StartsWith(p + "/", StringComparison.OrdinalIgnoreCase)
                        && seen.Add(n))
                    {
                        yield return n;
                    }
                }
            }
        }

        private static string NormalisePath(string p)
        {
            string s = p.Replace('\\', '/').TrimStart('/');
            // collapse repeated slashes
            while (s.Contains("//")) s = s.Replace("//", "/");
            return s;
        }

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            foreach (var z in _archives) z.Dispose();
            _archives.Clear();
        }
    }
}
