using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using BspLightReSlopper.Desktop.Services;
using BspLightReSlopper.Desktop.Views;

namespace BspLightReSlopper.Desktop
{
    public partial class App : Application
    {
        public override void Initialize()
        {
            AvaloniaXamlLoader.Load(this);
        }

        public override void OnFrameworkInitializationCompleted()
        {
            // Initialize the global service container before any view-model is created
            // (the design-time DataContext for MainWindow runs the parameterless ctor).
            AppServices.SetInstance(new AppServices());

            if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
            {
                desktop.MainWindow = new MainWindow();
            }

            base.OnFrameworkInitializationCompleted();
        }
    }
}
