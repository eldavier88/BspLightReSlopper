using System;
using System.IO;
using BspLightReSlopper.Desktop.Services;
using Xunit;

namespace BspLightReSlopper.Desktop.Tests
{
    public sealed class SettingsServiceTests : IDisposable
    {
        private readonly string _tempDir;
        private readonly string _path;

        public SettingsServiceTests()
        {
            _tempDir = Path.Combine(Path.GetTempPath(), "bsplrs-tests-" + Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(_tempDir);
            _path = Path.Combine(_tempDir, "settings.json");
        }

        public void Dispose()
        {
            try { Directory.Delete(_tempDir, recursive: true); } catch { }
        }

        [Fact]
        public void Load_MissingFile_ReturnsDefaults()
        {
            var svc = new SettingsService(_path);
            var s = svc.Load();
            Assert.Equal("jk2", s.GameToken);
            Assert.Equal(64, s.MaxLights);
            Assert.True(s.InferAngleModel);
            Assert.False(s.HalfLambert);
        }

        [Fact]
        public void SaveLoad_RoundTripsAllFields()
        {
            var svc = new SettingsService(_path);
            var src = new AppSettings
            {
                Q3Map2Path = @"C:\tools\q3map2.exe",
                BasePath = @"C:\Games\Jedi Outcast\GameData",
                GameToken = "jka",
                AssetsDirectory = @"D:\assets",
                HalfLambert = true,
                InferAngleModel = false,
                NoBounceSuppress = true,
                NoVis = true,
                NoClassify = true,
                NoSun = false,
                EmitSkyShader = true,
                MinimizeLights = true,
                MinimizeLightsTolerance = 0.05f,
                RefineLights = true,
                RefinePasses = 7,
                RefineStep = 24f,
                MaxLights = 128,
                MaxSamples = 500_000,
                Pivots = 1500,
                Seed = 1234,
                RecompileRefineIterations = 5,
                RecompileRefineMapPath = @"D:\maps\test.map",
                WindowWidth = 1500,
                WindowHeight = 950,
                WindowX = 100,
                WindowY = 50,
                WindowMaximized = true,
                ViewerRenderMode = "shaded",
                ShowLights = false,
                ShowSpotCones = false,
                ShowGroundTruth = false,
                ViewerLightmapOverbright = 3.5f,
                ViewerLightmapGamma = false,
            };
            src.RecentFiles.Add(@"C:\maps\foo.bsp");
            src.RecentFiles.Add(@"C:\maps\bar.bsp");

            svc.Save(src);
            var dst = svc.Load();

            Assert.Equal(src.Q3Map2Path, dst.Q3Map2Path);
            Assert.Equal(src.BasePath, dst.BasePath);
            Assert.Equal(src.GameToken, dst.GameToken);
            Assert.Equal(src.AssetsDirectory, dst.AssetsDirectory);
            Assert.Equal(src.HalfLambert, dst.HalfLambert);
            Assert.Equal(src.MaxLights, dst.MaxLights);
            Assert.Equal(src.MaxSamples, dst.MaxSamples);
            Assert.Equal(src.Pivots, dst.Pivots);
            Assert.Equal(src.Seed, dst.Seed);
            Assert.Equal(src.RecompileRefineIterations, dst.RecompileRefineIterations);
            Assert.Equal(src.WindowWidth, dst.WindowWidth);
            Assert.Equal(src.WindowMaximized, dst.WindowMaximized);
            Assert.Equal(src.ViewerRenderMode, dst.ViewerRenderMode);
            Assert.Equal(src.ViewerLightmapOverbright, dst.ViewerLightmapOverbright);
            Assert.Equal(src.RecentFiles, dst.RecentFiles);
        }

        [Fact]
        public void Load_MalformedJson_FallsBackToDefaults()
        {
            File.WriteAllText(_path, "{ this is not valid json !!");
            var svc = new SettingsService(_path);
            var s = svc.Load();
            Assert.Equal("jk2", s.GameToken);
            Assert.Equal(64, s.MaxLights);
        }

        [Fact]
        public void AddRecentFile_DeduplicatesAndCapsAt8()
        {
            var svc = new SettingsService(_path);
            var s = new AppSettings();
            for (int i = 0; i < 12; i++)
                svc.AddRecentFile(s, $@"C:\maps\map{i}.bsp");
            // Adding existing entry should move it to the front, not duplicate.
            svc.AddRecentFile(s, @"C:\maps\map5.bsp");

            Assert.Equal(8, s.RecentFiles.Count);
            Assert.Equal(@"C:\maps\map5.bsp", s.RecentFiles[0]);
            // The 4 oldest must have been dropped.
            Assert.DoesNotContain(@"C:\maps\map0.bsp", s.RecentFiles);
            Assert.DoesNotContain(@"C:\maps\map1.bsp", s.RecentFiles);
        }

        [Fact]
        public void Save_TmpFileIsCleanedUp()
        {
            var svc = new SettingsService(_path);
            svc.Save(new AppSettings());
            string tmp = _path + ".tmp";
            Assert.True(File.Exists(_path));
            Assert.False(File.Exists(tmp));
        }
    }
}
