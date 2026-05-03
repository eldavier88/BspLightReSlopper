using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using BspLightReSlopper.Desktop.Services;
using BspLightReSlopper.Desktop.ViewModels;

namespace BspLightReSlopper.Desktop.Views
{
    public partial class SettingsWindow : Window
    {
        public SettingsWindow()
        {
            InitializeComponent();
            DataContext = new SettingsViewModel(AppServices.Instance, this);
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}
