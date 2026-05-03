using System.IO;
using System.Threading.Tasks;
using Avalonia.Controls;
using Avalonia.Platform.Storage;
using BspLightReSlopper.Desktop.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace BspLightReSlopper.Desktop.ViewModels
{
    public partial class SettingsViewModel : ObservableObject
    {
        private readonly AppServices _services;
        private readonly Window _hostWindow;

        [ObservableProperty] private string? _q3Map2Path;
        [ObservableProperty] private string? _basePath;
        [ObservableProperty] private string _gameToken = "jk2";
        [ObservableProperty] private string _q3Map2Status = "";
        [ObservableProperty] private string _basePathStatus = "";

        public SettingsViewModel(AppServices services, Window hostWindow)
        {
            _services = services;
            _hostWindow = hostWindow;
            var s = services.Current;
            Q3Map2Path = s.Q3Map2Path;
            BasePath = s.BasePath;
            GameToken = s.GameToken;
            UpdateStatuses();
        }

        partial void OnQ3Map2PathChanged(string? value) => UpdateStatuses();
        partial void OnBasePathChanged(string? value) => UpdateStatuses();

        private void UpdateStatuses()
        {
            Q3Map2Status = string.IsNullOrEmpty(Q3Map2Path)
                ? "(not set)"
                : (File.Exists(Q3Map2Path) ? "OK" : "✗ file not found");
            BasePathStatus = string.IsNullOrEmpty(BasePath)
                ? "(not set)"
                : (Directory.Exists(BasePath) ? "OK" : "✗ directory not found");
        }

        [RelayCommand]
        private async Task BrowseQ3Map2Async()
        {
            var files = await _hostWindow.StorageProvider.OpenFilePickerAsync(new FilePickerOpenOptions
            {
                Title = "Select q3map2 executable",
                AllowMultiple = false,
                FileTypeFilter = new[]
                {
                    new FilePickerFileType("Executables") { Patterns = new[] { "*.exe", "q3map2*" } },
                    new FilePickerFileType("All Files") { Patterns = new[] { "*.*" } },
                },
            });
            if (files.Count > 0) Q3Map2Path = files[0].Path.LocalPath;
        }

        [RelayCommand]
        private async Task BrowseBasePathAsync()
        {
            var folders = await _hostWindow.StorageProvider.OpenFolderPickerAsync(new FolderPickerOpenOptions
            {
                Title = "Select fs_basepath (game install directory containing base/)",
                AllowMultiple = false,
            });
            if (folders.Count > 0) BasePath = folders[0].Path.LocalPath;
        }

        [RelayCommand]
        private void Save()
        {
            var s = _services.Current;
            s.Q3Map2Path = Q3Map2Path;
            s.BasePath = BasePath;
            s.GameToken = GameToken;
            _services.Save();
            _hostWindow.Close();
        }

        [RelayCommand]
        private void Cancel() => _hostWindow.Close();
    }
}
