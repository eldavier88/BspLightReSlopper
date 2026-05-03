using System;
using System.ComponentModel;
using System.IO;
using System.Linq;
using Avalonia.Controls;
using Avalonia.Controls.Primitives;
using Avalonia.Input;
using Avalonia.Markup.Xaml;
using BspLightReSlopper.Desktop.Rendering;
using BspLightReSlopper.Desktop.Services;
using BspLightReSlopper.Desktop.ViewModels;

namespace BspLightReSlopper.Desktop.Views
{
    public partial class MainWindow : Window
    {
        private MainWindowViewModel? _vm;
        private BspViewerControl? _viewer;
        private ContentControl? _viewerHost;
        private ComboBox? _renderModeCombo;
        private CheckBox? _showLightsCheck;
        private CheckBox? _showConesCheck;
        private CheckBox? _showGtCheck;
        private Slider? _overbrightSlider;
        private Button? _frameButton;

        public MainWindow()
        {
            InitializeComponent();

            _vm = new MainWindowViewModel(AppServices.Instance);
            DataContext = _vm;

            // Drag-drop wiring.
            AddHandler(DragDrop.DropEvent, OnDrop);
            AddHandler(DragDrop.DragOverEvent, OnDragOver);

            // Restore window state from settings.
            var s = AppServices.Instance.Current;
            if (s.WindowWidth > 0) Width = s.WindowWidth;
            if (s.WindowHeight > 0) Height = s.WindowHeight;
            if (s.WindowX is double wx && s.WindowY is double wy)
                Position = new Avalonia.PixelPoint((int)wx, (int)wy);
            if (s.WindowMaximized) WindowState = WindowState.Maximized;

            // Viewer hookup.
            _viewerHost = this.FindControl<ContentControl>("ViewerHost");
            _viewer = new BspViewerControl();
            if (_viewerHost != null) _viewerHost.Content = _viewer;

            _renderModeCombo = this.FindControl<ComboBox>("RenderModeCombo");
            _showLightsCheck = this.FindControl<CheckBox>("ShowLightsCheck");
            _showConesCheck = this.FindControl<CheckBox>("ShowConesCheck");
            _showGtCheck = this.FindControl<CheckBox>("ShowGtCheck");
            _overbrightSlider = this.FindControl<Slider>("OverbrightSlider");
            _frameButton = this.FindControl<Button>("FrameButton");

            // Apply persisted viewer settings.
            ApplyViewerSettings(s);

            if (_renderModeCombo != null) _renderModeCombo.SelectionChanged += OnRenderModeChanged;
            if (_showLightsCheck != null) _showLightsCheck.IsCheckedChanged += OnVisibilityToggled;
            if (_showConesCheck != null) _showConesCheck.IsCheckedChanged += OnVisibilityToggled;
            if (_showGtCheck != null) _showGtCheck.IsCheckedChanged += OnVisibilityToggled;
            if (_overbrightSlider != null) _overbrightSlider.PropertyChanged += OnOverbrightChanged;
            if (_frameButton != null) _frameButton.Click += OnFrameClicked;

            _vm.PropertyChanged += OnVmPropertyChanged;
            Closing += OnClosing;
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
            DragDrop.SetAllowDrop(this, true);
        }

        private void ApplyViewerSettings(AppSettings s)
        {
            if (_renderModeCombo != null)
            {
                _renderModeCombo.SelectedIndex = s.ViewerRenderMode switch
                {
                    "lightmap" => 0,
                    "shaded" => 1,
                    "wireframe" => 2,
                    "normals" => 3,
                    _ => 0,
                };
            }
            if (_showLightsCheck != null) _showLightsCheck.IsChecked = s.ShowLights;
            if (_showConesCheck != null) _showConesCheck.IsChecked = s.ShowSpotCones;
            if (_showGtCheck != null) _showGtCheck.IsChecked = s.ShowGroundTruth;
            if (_overbrightSlider != null) _overbrightSlider.Value = s.ViewerLightmapOverbright;
            if (_viewer != null)
            {
                _viewer.RenderMode = s.ViewerRenderMode switch
                {
                    "lightmap" => ViewerRenderMode.Lightmap,
                    "shaded" => ViewerRenderMode.Shaded,
                    "wireframe" => ViewerRenderMode.Wireframe,
                    "normals" => ViewerRenderMode.Normals,
                    _ => ViewerRenderMode.Lightmap,
                };
                _viewer.ShowLights = s.ShowLights;
                _viewer.ShowSpotCones = s.ShowSpotCones;
                _viewer.ShowGroundTruth = s.ShowGroundTruth;
                _viewer.LightmapOverbright = s.ViewerLightmapOverbright;
                _viewer.LightmapGammaEncode = s.ViewerLightmapGamma;
            }
        }

        private void OnVmPropertyChanged(object? sender, PropertyChangedEventArgs e)
        {
            if (_viewer == null || _vm == null) return;
            if (e.PropertyName == nameof(MainWindowViewModel.HasMapLoaded) && _vm.HasMapLoaded)
            {
                if (_vm.CurrentBsp != null) _viewer.SetBsp(_vm.CurrentBsp);
            }
            else if (e.PropertyName == nameof(MainWindowViewModel.HasResults))
            {
                _viewer.SetRunResult(_vm.LastResult);
            }
        }

        private void OnRenderModeChanged(object? sender, SelectionChangedEventArgs e)
        {
            if (_viewer == null || _renderModeCombo == null) return;
            _viewer.RenderMode = _renderModeCombo.SelectedIndex switch
            {
                0 => ViewerRenderMode.Lightmap,
                1 => ViewerRenderMode.Shaded,
                2 => ViewerRenderMode.Wireframe,
                3 => ViewerRenderMode.Normals,
                _ => ViewerRenderMode.Lightmap,
            };
            AppServices.Instance.Current.ViewerRenderMode = _renderModeCombo.SelectedIndex switch
            {
                0 => "lightmap",
                1 => "shaded",
                2 => "wireframe",
                3 => "normals",
                _ => "lightmap",
            };
            _viewer.RequestRedraw();
        }

        private void OnVisibilityToggled(object? sender, Avalonia.Interactivity.RoutedEventArgs e)
        {
            if (_viewer == null) return;
            _viewer.ShowLights = _showLightsCheck?.IsChecked ?? true;
            _viewer.ShowSpotCones = _showConesCheck?.IsChecked ?? true;
            _viewer.ShowGroundTruth = _showGtCheck?.IsChecked ?? true;
            var s = AppServices.Instance.Current;
            s.ShowLights = _viewer.ShowLights;
            s.ShowSpotCones = _viewer.ShowSpotCones;
            s.ShowGroundTruth = _viewer.ShowGroundTruth;
            _viewer.RequestRedraw();
        }

        private void OnOverbrightChanged(object? sender, Avalonia.AvaloniaPropertyChangedEventArgs e)
        {
            if (e.Property != RangeBase.ValueProperty || _viewer == null || _overbrightSlider == null) return;
            _viewer.LightmapOverbright = (float)_overbrightSlider.Value;
            AppServices.Instance.Current.ViewerLightmapOverbright = (float)_overbrightSlider.Value;
            _viewer.RequestRedraw();
        }

        private void OnFrameClicked(object? sender, Avalonia.Interactivity.RoutedEventArgs e)
        {
            // Force redraw; the viewer auto-frames on BSP upload but the user might want a re-frame.
            _viewer?.RequestRedraw();
        }

        private async void OnDrop(object? sender, DragEventArgs e)
        {
            if (DataContext is not MainWindowViewModel vm) return;
            try
            {
                var files = e.Data.GetFiles();
                if (files == null) return;
                var bspPath = files
                    .Select(f => f.Path?.LocalPath)
                    .FirstOrDefault(p => !string.IsNullOrEmpty(p)
                        && string.Equals(Path.GetExtension(p), ".bsp", StringComparison.OrdinalIgnoreCase));
                if (!string.IsNullOrEmpty(bspPath))
                    await vm.LoadBspAsync(bspPath);
            }
            catch
            {
                // Drop errors are silent; user can retry via Open BSP button.
            }
        }

        private void OnDragOver(object? sender, DragEventArgs e)
        {
            e.DragEffects = e.Data.Contains(DataFormats.Files) ? DragDropEffects.Link : DragDropEffects.None;
        }

        private void OnClosing(object? sender, WindowClosingEventArgs e)
        {
            try
            {
                if (DataContext is MainWindowViewModel vm)
                {
                    var s = AppServices.Instance.Current;
                    s.WindowWidth = Width;
                    s.WindowHeight = Height;
                    s.WindowX = Position.X;
                    s.WindowY = Position.Y;
                    s.WindowMaximized = WindowState == WindowState.Maximized;
                    vm.PersistToSettings();
                }
            }
            catch { /* don't block shutdown */ }
        }
    }
}
