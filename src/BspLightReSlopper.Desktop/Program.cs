using Avalonia;
using System;
using System.IO;
using BspLightReSlopper.Desktop.Services;

namespace BspLightReSlopper.Desktop
{
    class Program
    {
        [STAThread]
        public static void Main(string[] args)
        {
            AppDomain.CurrentDomain.UnhandledException += (s, e) =>
            {
                try
                {
                    string dir = SettingsService.GetDefaultCrashDirectory();
                    string path = Path.Combine(dir, $"crash-{DateTime.Now:yyyyMMdd-HHmmss}.txt");
                    File.WriteAllText(path,
                        $"BspLightReSlopper crash at {DateTime.Now:O}\nIsTerminating: {e.IsTerminating}\n\n{e.ExceptionObject}");
                }
                catch { /* best effort */ }
            };

            BuildAvaloniaApp().StartWithClassicDesktopLifetime(args);
        }

        public static AppBuilder BuildAvaloniaApp()
            => AppBuilder.Configure<App>()
                .UsePlatformDetect()
                .WithInterFont()
                .LogToTrace();
    }
}
