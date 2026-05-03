using System;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;

namespace BspLightReSlopper.Desktop.Services
{
    /// <summary>
    /// Lightweight service container. Avalonia's <c>Application.Current</c> is brittle for
    /// pulling out the main window and storage provider; we centralise that lookup here
    /// and let view-models inject the current settings + main window reference.
    /// </summary>
    public sealed class AppServices
    {
        public SettingsService Settings { get; }
        public AppSettings Current { get; private set; }

        public AppServices()
            : this(new SettingsService())
        {
        }

        public AppServices(SettingsService settings)
        {
            Settings = settings ?? throw new ArgumentNullException(nameof(settings));
            Current = settings.Load();
        }

        public void Save()
        {
            Settings.Save(Current);
        }

        public void Reset(AppSettings @new)
        {
            Current = @new ?? throw new ArgumentNullException(nameof(@new));
            Settings.Save(Current);
        }

        /// <summary>Best-effort lookup of the active main window, for dialogs / storage.</summary>
        public Window? GetMainWindow()
        {
            if (Application.Current?.ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
                return desktop.MainWindow;
            return null;
        }

        /// <summary>Singleton instance, set up in App.OnFrameworkInitializationCompleted.</summary>
        public static AppServices Instance { get; private set; } = new();

        internal static void SetInstance(AppServices services)
        {
            Instance = services ?? throw new ArgumentNullException(nameof(services));
        }
    }
}
