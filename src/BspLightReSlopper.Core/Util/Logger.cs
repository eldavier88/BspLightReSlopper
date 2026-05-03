using System;
using System.IO;

namespace BspLightReSlopper.Util
{
    /// <summary>
    /// Mirrors writes to <see cref="Console.Out"/> and an optional log file. Phase A keeps this
    /// dead simple; Phase A13 will extend it with timestamps and section delimiters.
    /// </summary>
    public sealed class Logger : IDisposable
    {
        private readonly TextWriter _console;
        private readonly StreamWriter? _file;
        private bool _disposed;

        public Logger(TextWriter? console = null, string? logPath = null)
        {
            _console = console ?? Console.Out;
            if (!string.IsNullOrEmpty(logPath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(logPath))!);
                _file = new StreamWriter(logPath, append: false) { AutoFlush = true };
            }
        }

        public void Info(string message)
        {
            _console.WriteLine(message);
            _file?.WriteLine(message);
        }

        public void Warn(string message) => Info("warn: " + message);

        public void Error(string message) => Info("error: " + message);

        public void Section(string name) => Info("=== " + name + " ===");

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            _file?.Flush();
            _file?.Dispose();
        }
    }
}
