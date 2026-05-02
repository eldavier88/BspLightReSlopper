using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using BspLightReSlopper.Pk3;
using Xunit;

namespace BspLightReSlopper.Tests
{
    public class Pk3StackTests
    {
        [Fact]
        public void LooseFiles_AreFoundFirst()
        {
            using var t = new TempDir();
            File.WriteAllText(Path.Combine(t.Path, "scripts", "test.shader"), "// loose");
            string pk3Path = Path.Combine(t.Path, "z_pak.pk3");
            using (var z = ZipFile.Open(pk3Path, ZipArchiveMode.Create))
            {
                var e = z.CreateEntry("scripts/test.shader");
                using var w = new StreamWriter(e.Open());
                w.Write("// from pk3");
            }

            using var stack = new Pk3Stack(t.Path);
            using var s = stack.Open("scripts/test.shader");
            Assert.NotNull(s);
            using var sr = new StreamReader(s!);
            string content = sr.ReadToEnd();
            Assert.Contains("loose", content);
        }

        [Fact]
        public void Pk3Files_AreFoundWhenLooseAbsent()
        {
            using var t = new TempDir();
            string pk3Path = Path.Combine(t.Path, "a_pak.pk3");
            using (var z = ZipFile.Open(pk3Path, ZipArchiveMode.Create))
            {
                var e = z.CreateEntry("scripts/zoo.shader");
                using var w = new StreamWriter(e.Open());
                w.Write("// from pk3");
            }
            using var stack = new Pk3Stack(t.Path);
            Assert.True(stack.Exists("scripts/zoo.shader"));
            using var s = stack.Open("scripts/zoo.shader");
            using var sr = new StreamReader(s!);
            Assert.Contains("from pk3", sr.ReadToEnd());
        }

        [Fact]
        public void Pk3Files_LaterAlphabeticalNameOverridesEarlier()
        {
            using var t = new TempDir();
            string pkA = Path.Combine(t.Path, "a_pak.pk3");
            string pkZ = Path.Combine(t.Path, "z_pak.pk3");
            using (var z = ZipFile.Open(pkA, ZipArchiveMode.Create))
            using (var sw = new StreamWriter(z.CreateEntry("conflict.txt").Open()))
                sw.Write("from-a");
            using (var z = ZipFile.Open(pkZ, ZipArchiveMode.Create))
            using (var sw = new StreamWriter(z.CreateEntry("conflict.txt").Open()))
                sw.Write("from-z");

            using var stack = new Pk3Stack(t.Path);
            using var s = stack.Open("conflict.txt");
            using var sr = new StreamReader(s!);
            Assert.Equal("from-z", sr.ReadToEnd());
        }

        [Fact]
        public void EnumerateAll_FindsAcrossLooseAndPk3()
        {
            using var t = new TempDir();
            File.WriteAllText(Path.Combine(t.Path, "shaders", "loose.shader"), "// loose");
            string pkPath = Path.Combine(t.Path, "p.pk3");
            using (var z = ZipFile.Open(pkPath, ZipArchiveMode.Create))
            {
                using (var sw = new StreamWriter(z.CreateEntry("shaders/zip.shader").Open())) sw.Write("// zip");
                using (var sw = new StreamWriter(z.CreateEntry("scripts/x.shader").Open())) sw.Write("// other");
            }

            using var stack = new Pk3Stack(t.Path);
            var found = stack.EnumerateAll("shaders", ".shader").ToList();
            Assert.Contains(found, p => p.EndsWith("loose.shader", StringComparison.OrdinalIgnoreCase));
            Assert.Contains(found, p => p.EndsWith("zip.shader", StringComparison.OrdinalIgnoreCase));
            Assert.DoesNotContain(found, p => p.EndsWith("x.shader", StringComparison.OrdinalIgnoreCase));
        }

        [SkippableFact]
        public void RealJk2_AssetStackOpensKnownShader()
        {
            string? assets = Environment.GetEnvironmentVariable("BSPLRS_JK2_ASSETS");
            Skip.If(string.IsNullOrEmpty(assets), "BSPLRS_JK2_ASSETS not set");
            using var stack = new Pk3Stack(assets!);
            // 'common.shader' or 'system.shader' is one of the few near-universal q3 shaders.
            // We just check that *some* shader file resolves via the stack.
            var found = stack.EnumerateAll("shaders", ".shader").FirstOrDefault();
            Assert.False(string.IsNullOrEmpty(found), "no shader files reachable from JK2 asset stack");
            using var s = stack.Open(found!);
            Assert.NotNull(s);
        }
    }

    /// <summary>Self-cleaning temp directory for filesystem tests.</summary>
    internal sealed class TempDir : IDisposable
    {
        public string Path { get; }
        public TempDir()
        {
            Path = System.IO.Path.Combine(System.IO.Path.GetTempPath(),
                "bsplrs-tests-" + Guid.NewGuid().ToString("N").Substring(0, 8));
            Directory.CreateDirectory(Path);
            Directory.CreateDirectory(System.IO.Path.Combine(Path, "scripts"));
            Directory.CreateDirectory(System.IO.Path.Combine(Path, "shaders"));
        }
        public void Dispose()
        {
            try { Directory.Delete(Path, true); } catch { /* swallow */ }
        }
    }

}
