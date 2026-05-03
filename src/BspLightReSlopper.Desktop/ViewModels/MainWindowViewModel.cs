using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Avalonia.Collections;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Platform.Storage;
using Avalonia.Threading;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Desktop.Services;
using BspLightReSlopper.Heuristics;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BspLightReSlopper.Desktop.ViewModels
{
    public partial class MainWindowViewModel : ObservableObject
    {
        private readonly AppServices _services;
        private readonly Action<LogEntry> _logCallback;
        private readonly CallbackSink _logSink;
        private CancellationTokenSource? _runCts;

        private BspFile? _currentBsp;
        private string? _currentBspPath;

        /// <summary>Currently loaded BSP, or null if none. Read-only for views.</summary>
        public BspFile? CurrentBsp => _currentBsp;

        // ---- Map info ----
        [ObservableProperty] private string _mapName = "No map loaded";
        [ObservableProperty] private string _mapFormat = "";
        [ObservableProperty] private string _surfaceCount = "";
        [ObservableProperty] private bool _hasMapLoaded;

        // ---- Parameters (bound to settings) ----
        [ObservableProperty] private bool _halfLambert;
        [ObservableProperty] private bool _inferAngleModel = true;
        [ObservableProperty] private bool _noBounceSuppress;
        [ObservableProperty] private bool _noVis;
        [ObservableProperty] private bool _noClassify;
        [ObservableProperty] private bool _noSun;
        [ObservableProperty] private bool _emitSkyShader;
        [ObservableProperty] private bool _minimizeLights;
        [ObservableProperty] private double _minimizeLightsTolerance = 0.02;
        [ObservableProperty] private bool _refineLights;
        [ObservableProperty] private int _refinePasses = 3;
        [ObservableProperty] private double _refineStep = 32;
        [ObservableProperty] private int _maxLights = 64;
        [ObservableProperty] private int _maxSamples = 200_000;
        [ObservableProperty] private int _pivots = 800;
        [ObservableProperty] private int _seed = 42;

        // ---- Recompile-refine ----
        [ObservableProperty] private int _recompileRefineIterations;
        [ObservableProperty] private string? _recompileRefineMapPath;
        [ObservableProperty] private bool _hasQ3Map2Configured;

        // ---- Asset directory ----
        [ObservableProperty] private string? _assetsDirectory;
        [ObservableProperty] private string _assetsStatus = "No asset directory (white-albedo fallback)";

        // ---- Run state ----
        [ObservableProperty] private bool _isRunning;
        [ObservableProperty] private double _progress;
        [ObservableProperty] private string _statusText = "";
        [ObservableProperty] private string _statusMessage = "Ready";
        [ObservableProperty] private string _runStage = "";

        // ---- Results ----
        [ObservableProperty] private bool _hasResults;
        [ObservableProperty] private string _resultSummary = "";
        [ObservableProperty] private string _resultTypeBreakdown = "";
        [ObservableProperty] private string _resultRuntime = "";
        [ObservableProperty] private string _resultSunInfo = "";
        [ObservableProperty] private bool _hasSun;
        [ObservableProperty] private string _resultGroundTruth = "";
        [ObservableProperty] private bool _hasGroundTruth;
        [ObservableProperty] private string _resultLogPath = "";
        [ObservableProperty] private string _resultEntPath = "";

        // ---- Log viewer ----
        public AvaloniaList<LogEntry> LogEntries { get; } = new();
        [ObservableProperty] private bool _logViewerExpanded = true;
        [ObservableProperty] private bool _logFilterDebug;
        [ObservableProperty] private bool _logFilterInfo = true;
        [ObservableProperty] private bool _logFilterWarn = true;
        [ObservableProperty] private bool _logFilterError = true;

        // ---- Recent files ----
        public AvaloniaList<string> RecentFiles { get; } = new();

        // ---- Last result (for viewer + export) ----
        public RunResult? LastResult { get; private set; }

        public MainWindowViewModel() : this(AppServices.Instance) { }

        public MainWindowViewModel(AppServices services)
        {
            _services = services ?? throw new ArgumentNullException(nameof(services));
            _logCallback = OnLogEvent;
            _logSink = new CallbackSink(_logCallback);
            LoadFromSettings();
        }

        private void LoadFromSettings()
        {
            var s = _services.Current;
            HalfLambert = s.HalfLambert;
            InferAngleModel = s.InferAngleModel;
            NoBounceSuppress = s.NoBounceSuppress;
            NoVis = s.NoVis;
            NoClassify = s.NoClassify;
            NoSun = s.NoSun;
            EmitSkyShader = s.EmitSkyShader;
            MinimizeLights = s.MinimizeLights;
            MinimizeLightsTolerance = s.MinimizeLightsTolerance;
            RefineLights = s.RefineLights;
            RefinePasses = s.RefinePasses;
            RefineStep = s.RefineStep;
            MaxLights = s.MaxLights;
            MaxSamples = s.MaxSamples;
            Pivots = s.Pivots;
            Seed = s.Seed;
            RecompileRefineIterations = s.RecompileRefineIterations;
            RecompileRefineMapPath = s.RecompileRefineMapPath;
            AssetsDirectory = s.AssetsDirectory;
            UpdateAssetsStatus();
            UpdateQ3Map2Status();
            RecentFiles.Clear();
            foreach (var p in s.RecentFiles) RecentFiles.Add(p);
        }

        public void PersistToSettings()
        {
            var s = _services.Current;
            s.HalfLambert = HalfLambert;
            s.InferAngleModel = InferAngleModel;
            s.NoBounceSuppress = NoBounceSuppress;
            s.NoVis = NoVis;
            s.NoClassify = NoClassify;
            s.NoSun = NoSun;
            s.EmitSkyShader = EmitSkyShader;
            s.MinimizeLights = MinimizeLights;
            s.MinimizeLightsTolerance = (float)MinimizeLightsTolerance;
            s.RefineLights = RefineLights;
            s.RefinePasses = RefinePasses;
            s.RefineStep = (float)RefineStep;
            s.MaxLights = MaxLights;
            s.MaxSamples = MaxSamples;
            s.Pivots = Pivots;
            s.Seed = Seed;
            s.RecompileRefineIterations = RecompileRefineIterations;
            s.RecompileRefineMapPath = RecompileRefineMapPath;
            s.AssetsDirectory = AssetsDirectory;
            _services.Save();
        }

        private void UpdateAssetsStatus()
        {
            if (string.IsNullOrEmpty(AssetsDirectory))
                AssetsStatus = "No asset directory (white-albedo fallback)";
            else if (!Directory.Exists(AssetsDirectory))
                AssetsStatus = $"Missing: {AssetsDirectory}";
            else
                AssetsStatus = $"Assets: {AssetsDirectory}";
        }

        partial void OnAssetsDirectoryChanged(string? value) => UpdateAssetsStatus();

        public void UpdateQ3Map2Status()
        {
            var s = _services.Current;
            HasQ3Map2Configured = !string.IsNullOrEmpty(s.Q3Map2Path) && File.Exists(s.Q3Map2Path)
                                  && !string.IsNullOrEmpty(s.BasePath) && Directory.Exists(s.BasePath);
        }

        // ============================================================
        //                        File I/O commands
        // ============================================================

        [RelayCommand]
        private async Task OpenBspAsync()
        {
            var window = _services.GetMainWindow();
            if (window == null) return;

            var files = await window.StorageProvider.OpenFilePickerAsync(new FilePickerOpenOptions
            {
                Title = "Open BSP File",
                AllowMultiple = false,
                FileTypeFilter = new[]
                {
                    new FilePickerFileType("BSP Files") { Patterns = new[] { "*.bsp" } },
                    new FilePickerFileType("All Files") { Patterns = new[] { "*.*" } },
                },
            });

            if (files.Count > 0)
                await LoadBspAsync(files[0].Path.LocalPath);
        }

        [RelayCommand]
        private async Task BrowseAssetsAsync()
        {
            var window = _services.GetMainWindow();
            if (window == null) return;

            var folders = await window.StorageProvider.OpenFolderPickerAsync(new FolderPickerOpenOptions
            {
                Title = "Select Assets Directory (containing PK3s)",
                AllowMultiple = false,
            });

            if (folders.Count > 0)
            {
                AssetsDirectory = folders[0].Path.LocalPath;
                PersistToSettings();
            }
        }

        [RelayCommand]
        private void ClearAssets()
        {
            AssetsDirectory = null;
            PersistToSettings();
        }

        [RelayCommand]
        private async Task BrowseRefineMapAsync()
        {
            var window = _services.GetMainWindow();
            if (window == null) return;

            var files = await window.StorageProvider.OpenFilePickerAsync(new FilePickerOpenOptions
            {
                Title = "Select Reference .map for recompile-refine",
                AllowMultiple = false,
                FileTypeFilter = new[] { new FilePickerFileType(".map files") { Patterns = new[] { "*.map" } } },
            });

            if (files.Count > 0)
            {
                RecompileRefineMapPath = files[0].Path.LocalPath;
                PersistToSettings();
            }
        }

        public async Task LoadBspAsync(string path)
        {
            try
            {
                StatusMessage = "Loading BSP...";
                IsRunning = true;
                using var cts = new CancellationTokenSource();
                var bsp = await PipelineRunner.LoadBspAsync(path, cts.Token);
                _currentBsp = bsp;
                _currentBspPath = path;

                MapName = Path.GetFileName(path);
                MapFormat = $"Format: {bsp.Format.DisplayName}";
                SurfaceCount = $"Surfaces: {bsp.Surfaces.Count}, DrawVerts: {bsp.DrawVerts.Count}, Atlases: {bsp.LightmapAtlasCount}";
                HasMapLoaded = true;
                LastResult = null;
                HasResults = false;

                // Auto room-detect on load (cheap, useful default for max-lights).
                var rooms = await PipelineRunner.DetectRoomsAsync(bsp, cts.Token);
                int suggested = rooms.Rooms.Count > 0
                    ? rooms.Rooms.Sum(r => Math.Min(r.SuggestedLightCount, 32))
                    : 64;
                MaxLights = Math.Min(suggested, 256);

                StatusMessage = $"Loaded: {Path.GetFileName(path)} — {bsp.Surfaces.Count} surfaces, {rooms.Rooms.Count} rooms (max-lights → {MaxLights})";

                _services.Settings.AddRecentFile(_services.Current, path);
                PersistToSettings();
                RecentFiles.Clear();
                foreach (var p in _services.Current.RecentFiles) RecentFiles.Add(p);
            }
            catch (OperationCanceledException) { StatusMessage = "Load cancelled"; }
            catch (Exception ex)
            {
                StatusMessage = $"Failed to load BSP: {ex.Message}";
                HasMapLoaded = false;
            }
            finally { IsRunning = false; }
        }

        // ============================================================
        //                          Run / Cancel
        // ============================================================

        public bool CanRun => HasMapLoaded && !IsRunning;
        public bool CanCancel => IsRunning;

        partial void OnIsRunningChanged(bool value)
        {
            OnPropertyChanged(nameof(CanRun));
            OnPropertyChanged(nameof(CanCancel));
        }

        partial void OnHasMapLoadedChanged(bool value) => OnPropertyChanged(nameof(CanRun));

        [RelayCommand(CanExecute = nameof(CanRun))]
        private async Task RunEstimatorAsync()
        {
            if (_currentBsp == null || string.IsNullOrEmpty(_currentBspPath)) return;

            PersistToSettings();
            LogEntries.Clear();
            IsRunning = true;
            Progress = 0;
            RunStage = "Starting...";
            StatusText = "";
            HasResults = false;

            string baseName = Path.Combine(
                Path.GetDirectoryName(Path.GetFullPath(_currentBspPath)) ?? ".",
                Path.GetFileNameWithoutExtension(_currentBspPath));
            string outEnt = baseName + ".ent";
            string logPath = Path.Combine(SettingsService.GetDefaultLogDirectory(),
                $"{Path.GetFileNameWithoutExtension(_currentBspPath)}-{DateTime.Now:yyyyMMdd-HHmmss}.log");

            var s = _services.Current;
            var runOpts = new RunOptions
            {
                BspInput = _currentBspPath,
                AssetsDirectory = string.IsNullOrEmpty(AssetsDirectory) ? null : AssetsDirectory,
                OutEntPath = outEnt,
                LogPath = logPath,
                MaxLights = MaxLights,
                MaxSamples = MaxSamples,
                Pivots = Pivots,
                Seed = Seed,
                HalfLambert = HalfLambert,
                InferAngleModel = InferAngleModel,
                NoVis = NoVis,
                NoBounceSuppress = NoBounceSuppress,
                MinimizeLights = MinimizeLights,
                MinimizeLightsTolerance = (float)MinimizeLightsTolerance,
                RefineLights = RefineLights,
                RefinePasses = RefinePasses,
                RefineStep = (float)RefineStep,
                NoClassify = NoClassify,
                NoSun = NoSun,
                EmitSkyShader = EmitSkyShader,
                RecompileRefineIterations = RecompileRefineIterations,
                RecompileRefineMapPath = RecompileRefineMapPath,
                Q3Map2Path = s.Q3Map2Path,
                BasePath = s.BasePath,
                GameToken = s.GameToken,
            };

            _runCts?.Dispose();
            _runCts = new CancellationTokenSource();
            var ct = _runCts.Token;
            var progress = new Progress<RunProgress>(OnRunProgress);

            try
            {
                StatusMessage = "Running estimator...";
                var result = await PipelineRunner.RunAsync(runOpts, _logSink, progress, ct);
                LastResult = result;
                PopulateResults(result);
                HasResults = true;
                StatusMessage = $"Done: {result.Lights.Count} lights estimated in {result.ElapsedSeconds:F1}s";
            }
            catch (OperationCanceledException)
            {
                StatusMessage = "Run cancelled";
                StatusText = "Cancelled";
            }
            catch (Exception ex)
            {
                StatusMessage = "Estimator failed";
                StatusText = $"Error: {ex.Message}";
            }
            finally
            {
                IsRunning = false;
                _runCts?.Dispose();
                _runCts = null;
            }
        }

        [RelayCommand(CanExecute = nameof(CanCancel))]
        private void CancelRun()
        {
            if (_runCts is { } cts && !cts.IsCancellationRequested)
            {
                cts.Cancel();
                StatusMessage = "Cancelling...";
                RunStage = "Cancelling...";
            }
        }

        private void OnRunProgress(RunProgress p)
        {
            // Already on UI thread thanks to Progress<T>.
            RunStage = p.Stage;
            Progress = p.OverallPercent;
        }

        private void OnLogEvent(LogEntry entry)
        {
            // Serilog calls us on a worker thread; marshal.
            Dispatcher.UIThread.Post(() =>
            {
                if (!PassesFilter(entry.Severity)) return;
                LogEntries.Add(entry);
                if (LogEntries.Count > 5000)
                    LogEntries.RemoveAt(0);
            });
        }

        private bool PassesFilter(LogSeverity s) => s switch
        {
            LogSeverity.Debug => LogFilterDebug,
            LogSeverity.Info => LogFilterInfo,
            LogSeverity.Warn => LogFilterWarn,
            LogSeverity.Error => LogFilterError,
            _ => true,
        };

        private void PopulateResults(RunResult r)
        {
            ResultSummary = $"{r.Lights.Count} lights estimated";
            ResultTypeBreakdown = $"point={r.PointCount}  linear={r.LinearCount}  spot={r.SpotCount}";
            ResultRuntime = $"runtime: {r.ElapsedSeconds:F1}s, rounds: {r.RoundsRun} ({r.RoundsAccepted} accepted)";
            ResultEntPath = r.OutEntPath;
            ResultLogPath = r.LogPath;
            HasSun = r.Sun != null;
            ResultSunInfo = r.Sun is { } sun
                ? $"sun: pitch {sun.Pitch:F1}° yaw {sun.Yaw:F1}° intensity {sun.Intensity:F0} (dominance {sun.DominanceScore:F1}x)"
                : "no sun detected";
            HasGroundTruth = r.Comparison != null;
            ResultGroundTruth = r.Comparison is { } cmp
                ? $"truth: {cmp.TruthCount}, matched: {cmp.MatchedCount}, recall: {cmp.Recall:P1}, precision: {cmp.Precision:P1}, median pos err: {cmp.MedianPositionError:F1}u"
                : "";
        }

        // ============================================================
        //                          Auto-detect
        // ============================================================

        [RelayCommand]
        private async Task AutoDetectAsync()
        {
            if (_currentBsp == null) return;
            try
            {
                var rooms = await PipelineRunner.DetectRoomsAsync(_currentBsp);
                int suggested = rooms.Rooms.Count > 0
                    ? rooms.Rooms.Sum(r => Math.Min(r.SuggestedLightCount, 32))
                    : 64;
                MaxLights = Math.Min(suggested, 256);
                StatusMessage = $"Auto-detected {rooms.Rooms.Count} rooms → max-lights = {MaxLights}";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Auto-detect failed: {ex.Message}";
            }
        }

        // ============================================================
        //                          Settings dialog
        // ============================================================

        [RelayCommand]
        private async Task OpenSettingsAsync()
        {
            var window = _services.GetMainWindow();
            if (window == null) return;
            var dlg = new Views.SettingsWindow();
            await dlg.ShowDialog(window);
            UpdateQ3Map2Status();
        }

        // ============================================================
        //                          Export / log
        // ============================================================

        [RelayCommand]
        private async Task ExportEntAsync()
        {
            if (LastResult == null) return;
            var window = _services.GetMainWindow();
            if (window == null) return;

            var file = await window.StorageProvider.SaveFilePickerAsync(new FilePickerSaveOptions
            {
                Title = "Save .ent file",
                DefaultExtension = "ent",
                SuggestedFileName = Path.GetFileNameWithoutExtension(LastResult.BspPath) + ".ent",
            });

            if (file != null)
            {
                try
                {
                    File.Copy(LastResult.OutEntPath, file.Path.LocalPath, overwrite: true);
                    StatusMessage = $"Exported to {file.Path.LocalPath}";
                }
                catch (Exception ex) { StatusMessage = $"Export failed: {ex.Message}"; }
            }
        }

        [RelayCommand]
        private void OpenLogFile()
        {
            if (string.IsNullOrEmpty(ResultLogPath) || !File.Exists(ResultLogPath)) return;
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = ResultLogPath,
                    UseShellExecute = true,
                });
            }
            catch (Exception ex) { StatusMessage = $"Open log failed: {ex.Message}"; }
        }

        [RelayCommand]
        private void OpenEntFile()
        {
            if (string.IsNullOrEmpty(ResultEntPath) || !File.Exists(ResultEntPath)) return;
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = ResultEntPath,
                    UseShellExecute = true,
                });
            }
            catch (Exception ex) { StatusMessage = $"Open .ent failed: {ex.Message}"; }
        }

        [RelayCommand]
        private void ClearLog()
        {
            LogEntries.Clear();
        }

        [RelayCommand]
        private async Task LoadRecentAsync(string? path)
        {
            if (string.IsNullOrEmpty(path)) return;
            if (!File.Exists(path))
            {
                _services.Current.RecentFiles.Remove(path);
                _services.Save();
                RecentFiles.Remove(path);
                StatusMessage = $"File no longer exists: {path}";
                return;
            }
            await LoadBspAsync(path);
        }
    }
}
