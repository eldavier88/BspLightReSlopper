using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using Avalonia.Controls;
using Avalonia.Platform.Storage;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Collision;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.EntityIo;
using BspLightReSlopper.Heuristics;
using BspLightReSlopper.Lightmaps;
using BspLightReSlopper.Sampling;
using BspLightReSlopper.Surfaces;
using BspLightReSlopper.Util;

namespace BspLightReSlopper.Desktop.ViewModels
{
    public partial class MainWindowViewModel : ObservableObject
    {
        [ObservableProperty]
        private string _mapName = "No map loaded";

        [ObservableProperty]
        private string _mapFormat = "";

        [ObservableProperty]
        private string _surfaceCount = "";

        [ObservableProperty]
        private bool _halfLambert = false;

        [ObservableProperty]
        private bool _noBounceSuppress = false;

        [ObservableProperty]
        private bool _noVis = false;

        [ObservableProperty]
        private int _maxLights = 64;

        [ObservableProperty]
        private int _maxSamples = 200_000;

        [ObservableProperty]
        private int _pivots = 800;

        [ObservableProperty]
        private bool _isRunning = false;

        [ObservableProperty]
        private double _progress = 0;

        [ObservableProperty]
        private string _statusText = "";

        [ObservableProperty]
        private bool _hasResults = false;

        [ObservableProperty]
        private string _resultSummary = "";

        [ObservableProperty]
        private bool _hasMapLoaded = false;

        [ObservableProperty]
        private string _statusMessage = "Ready";

        [ObservableProperty]
        private object? _viewerContent = null;

        private BspFile? _currentBsp;
        private string? _currentBspPath;
        private List<EstimatedLight>? _currentLights;
        private RoomDetector.Result? _roomDetectResult;

        [RelayCommand]
        private async Task OpenBspAsync()
        {
            var window = GetWindow();
            if (window == null) return;

            var files = await window.StorageProvider.OpenFilePickerAsync(new FilePickerOpenOptions
            {
                Title = "Open BSP File",
                AllowMultiple = false,
                FileTypeFilter = new[] { new FilePickerFileType("BSP Files") { Patterns = new[] { "*.bsp" } } }
            });

            if (files.Count > 0)
            {
                await LoadBspAsync(files[0].Path.LocalPath);
            }
        }

        [RelayCommand]
        private void AutoDetect()
        {
            if (_currentBsp == null) return;

            try
            {
                var rooms = RoomDetector.Detect(_currentBsp);
                _roomDetectResult = rooms;
                int suggested = rooms.Rooms.Count > 0
                    ? rooms.Rooms.Sum(r => Math.Min(r.SuggestedLightCount, 32))
                    : 64;
                MaxLights = Math.Min(suggested, 256);
                StatusMessage = $"Auto-detected: {rooms.Rooms.Count} rooms, suggested {MaxLights} max lights";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Auto-detect failed: {ex.Message}";
            }
        }

        [RelayCommand]
        private async Task RunEstimatorAsync()
        {
            if (_currentBsp == null || string.IsNullOrEmpty(_currentBspPath)) return;

            IsRunning = true;
            Progress = 0;
            StatusText = "Initializing...";
            HasResults = false;

            try
            {
                var bsp = _currentBsp;
                var log = new Logger();
                log.Info("Running estimator with white-albedo fallback (no assets required)");

                StatusText = "Sampling lightmap texels...";
                Progress = 10;

                var collision = new BspCollision(bsp);
                var unpacked = SurfaceUnpacker.Unpack(bsp);
                var atlas = new LightmapAtlas(bsp.Lightmaps, bsp.LightmapAtlasCount);
                var samples = TexelSampler.Sample(bsp, unpacked, atlas, new TexelSampler.SampleOptions { MaxSamples = MaxSamples }, collision);
                log.Info($"Sampled {samples.Samples.Count} texels");

                StatusText = "Estimating lights...";
                Progress = 30;

                Vector3 bboxMin = new(float.PositiveInfinity);
                Vector3 bboxMax = new(float.NegativeInfinity);
                foreach (var smp in samples.Samples)
                {
                    bboxMin = Vector3.Min(bboxMin, smp.World);
                    bboxMax = Vector3.Max(bboxMax, smp.World);
                }
                if (bsp.Models.Count > 0)
                {
                    bboxMin = Vector3.Min(bboxMin, bsp.Models[0].Mins);
                    bboxMax = Vector3.Max(bboxMax, bsp.Models[0].Maxs);
                }

                var vis = NoVis ? null : new BspVis(bsp);
                var result = LightEstimator.Estimate(samples.Samples, bboxMin, bboxMax, new LightEstimator.Options
                {
                    MaxPivotsPerRound = Pivots,
                    MaxLights = MaxLights,
                    RandomSeed = 42,
                    Collision = NoVis ? null : collision,
                    Visibility = NoVis ? null : vis,
                    HalfLambert = HalfLambert,
                }, log);

                StatusText = "Bounce suppression...";
                Progress = 60;

                var bsResult = BounceSuppressor.Filter(result.Lights, samples.Samples, bsp, albedo: null, HalfLambert, log: log);
                var filteredLights = bsResult.KeptLights.ToList();

                StatusText = "Classifying lights...";
                Progress = 80;

                var classified = filteredLights.Select(l => LightTypeClassifier.Classify(l, samples.Samples, HalfLambert)).ToList();

                Progress = 100;
                _currentLights = filteredLights;

                ResultSummary = $"Estimated {filteredLights.Count} lights ({result.RoundsRun} rounds, {result.RoundsAccepted} accepted)";
                HasResults = true;
                StatusMessage = $"Done: {filteredLights.Count} lights estimated";
                StatusText = ResultSummary;
            }
            catch (Exception ex)
            {
                StatusText = $"Error: {ex.Message}";
                StatusMessage = "Estimator failed";
            }
            finally
            {
                IsRunning = false;
            }
        }

        [RelayCommand]
        private async Task ExportEntAsync()
        {
            if (_currentBsp == null || _currentLights == null || string.IsNullOrEmpty(_currentBspPath)) return;

            var window = GetWindow();
            if (window == null) return;

            var file = await window.StorageProvider.SaveFilePickerAsync(new FilePickerSaveOptions
            {
                Title = "Save .ent file",
                DefaultExtension = "ent",
                SuggestedFileName = Path.GetFileNameWithoutExtension(_currentBspPath) + ".ent"
            });

            if (file != null)
            {
                try
                {
                    var path = file.Path.LocalPath;
                    var lights = _currentLights.Select(l => new EntFileWriter.GuessedLight
                    {
                        Origin = l.Origin,
                        Color = l.Color,
                        Intensity = l.Intensity,
                        Confidence = l.Confidence,
                        SupportingTexels = l.SupportingTexels,
                        ResidualEnergyExplainedFraction = l.ResidualEnergyExplainedFraction,
                        Method = l.Method,
                        BlownOut = l.BlownOut
                    }).ToList();

                    var options = new EntFileWriter.WriteOptions
                    {
                        SourceBspName = Path.GetFileName(_currentBspPath)
                    };
                    EntFileWriter.Write(path, lights, options);
                    StatusMessage = $"Exported to {path}";
                }
                catch (Exception ex)
                {
                    StatusMessage = $"Export failed: {ex.Message}";
                }
            }
        }

        public async Task LoadBspAsync(string path)
        {
            try
            {
                StatusMessage = "Loading BSP...";
                var bytes = await File.ReadAllBytesAsync(path);
                var bsp = BspLoader.LoadFromBytes(bytes);

                _currentBsp = bsp;
                _currentBspPath = path;
                _currentLights = null;
                HasResults = false;

                MapName = Path.GetFileName(path);
                MapFormat = $"Format: {bsp.Format.DisplayName}";
                SurfaceCount = $"Surfaces: {bsp.Surfaces.Count}, DrawVerts: {bsp.DrawVerts.Count}";
                HasMapLoaded = true;

                var rooms = RoomDetector.Detect(bsp);
                _roomDetectResult = rooms;
                int suggested = rooms.Rooms.Count > 0
                    ? rooms.Rooms.Sum(r => Math.Min(r.SuggestedLightCount, 32))
                    : 64;
                MaxLights = Math.Min(suggested, 256);

                StatusMessage = $"Loaded: {Path.GetFileName(path)} — {bsp.Surfaces.Count} surfaces, {rooms.Rooms.Count} rooms detected";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Failed to load BSP: {ex.Message}";
                HasMapLoaded = false;
            }
        }

        private Window? GetWindow()
        {
            if (Avalonia.Application.Current?.ApplicationLifetime is Avalonia.Controls.ApplicationLifetimes.IClassicDesktopStyleApplicationLifetime desktop)
            {
                return desktop.MainWindow;
            }
            return null;
        }
    }
}
