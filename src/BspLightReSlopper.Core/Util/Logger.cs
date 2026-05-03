using System;
using System.IO;
using Serilog;
using Serilog.Core;

namespace BspLightReSlopper.Util
{
    /// <summary>
    /// Structured-logging facade backed by Serilog. Phase P0 migration from the
    /// hand-rolled TextWriter mirror. Keeps the same public API so existing callers
    /// (EstimateCommand, LightEstimator, RecompileRefiner, etc.) compile unchanged.
    /// </summary>
    public sealed class Logger : IDisposable
    {
        private readonly Serilog.ILogger _log;
        private readonly LoggerConfiguration? _config;
        private readonly Serilog.Core.Logger? _serilogRoot;
        private bool _disposed;

        public Logger(TextWriter? console = null, string? logPath = null)
        {
            _config = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.Console(outputTemplate: "{Message:lj}{NewLine}", standardErrorFromLevel: Serilog.Events.LogEventLevel.Error);

            if (!string.IsNullOrEmpty(logPath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(logPath))!);
                _config.WriteTo.File(
                    logPath,
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] {Message:lj}{NewLine}",
                    flushToDiskInterval: TimeSpan.FromSeconds(1));
            }

            _serilogRoot = _config.CreateLogger();
            _log = _serilogRoot;
        }

        public void Info(string message)
        {
            _log.Information(message);
        }

        public void Warn(string message) => _log.Warning(message);

        public void Error(string message) => _log.Error(message);

        public void Section(string name) => _log.Information("=== {Section} ===", name);

        /// <summary>Structured diagnostic; used by new P0+ components.</summary>
        public void Debug(string message) => _log.Debug(message);

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            _serilogRoot?.Dispose();
        }
    }
}
