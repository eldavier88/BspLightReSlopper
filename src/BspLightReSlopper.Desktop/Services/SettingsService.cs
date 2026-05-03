using System;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace BspLightReSlopper.Desktop.Services
{
    /// <summary>
    /// JSON-backed persistence for <see cref="AppSettings"/>. Atomic writes (tmp + replace)
    /// so a crash mid-save can never leave a half-written settings file. Missing files /
    /// malformed JSON falls back to defaults without throwing.
    /// </summary>
    public sealed class SettingsService
    {
        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        private readonly string _path;

        public SettingsService() : this(GetDefaultPath()) { }

        public SettingsService(string path)
        {
            _path = path ?? throw new ArgumentNullException(nameof(path));
        }

        public string Path => _path;

        public static string GetDefaultPath()
        {
            string root = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            string dir = System.IO.Path.Combine(root, "BspLightReSlopper");
            Directory.CreateDirectory(dir);
            return System.IO.Path.Combine(dir, "settings.json");
        }

        public static string GetDefaultLogDirectory()
        {
            string root = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            string dir = System.IO.Path.Combine(root, "BspLightReSlopper", "logs");
            Directory.CreateDirectory(dir);
            return dir;
        }

        public static string GetDefaultCrashDirectory()
        {
            string root = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            string dir = System.IO.Path.Combine(root, "BspLightReSlopper", "crashes");
            Directory.CreateDirectory(dir);
            return dir;
        }

        public AppSettings Load()
        {
            try
            {
                if (!File.Exists(_path)) return new AppSettings();
                var text = File.ReadAllText(_path);
                if (string.IsNullOrWhiteSpace(text)) return new AppSettings();
                var s = JsonSerializer.Deserialize<AppSettings>(text, JsonOpts);
                return s ?? new AppSettings();
            }
            catch
            {
                return new AppSettings();
            }
        }

        public void Save(AppSettings settings)
        {
            if (settings == null) throw new ArgumentNullException(nameof(settings));
            // Cap recent files to 8 entries.
            if (settings.RecentFiles.Count > 8)
                settings.RecentFiles = settings.RecentFiles.Take(8).ToList();

            string? dir = System.IO.Path.GetDirectoryName(_path);
            if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);

            string tmp = _path + ".tmp";
            string json = JsonSerializer.Serialize(settings, JsonOpts);
            File.WriteAllText(tmp, json);
            // Atomic-ish replace; on Windows File.Move with overwrite is atomic for same-volume.
            if (File.Exists(_path)) File.Replace(tmp, _path, null);
            else File.Move(tmp, _path);
        }

        public void AddRecentFile(AppSettings settings, string path)
        {
            if (string.IsNullOrEmpty(path)) return;
            settings.RecentFiles.RemoveAll(p => string.Equals(p, path, StringComparison.OrdinalIgnoreCase));
            settings.RecentFiles.Insert(0, path);
            if (settings.RecentFiles.Count > 8)
                settings.RecentFiles = settings.RecentFiles.Take(8).ToList();
        }
    }
}
