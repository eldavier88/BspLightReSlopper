using System;
using System.Collections.Generic;
using Serilog.Core;
using Serilog.Events;

namespace BspLightReSlopper.Desktop.Services
{
    public enum LogSeverity
    {
        Debug,
        Info,
        Warn,
        Error,
    }

    public sealed class LogEntry
    {
        public DateTime TimestampUtc { get; init; }
        public LogSeverity Severity { get; init; }
        public string Message { get; init; } = string.Empty;
        public bool IsSection { get; init; }
    }

    /// <summary>
    /// Serilog sink that forwards every emitted event to a callback. Used by the Desktop
    /// GUI to pipe live log lines into the in-app log viewer. Thread-safe; the callback
    /// may be invoked on any thread (Serilog typically calls Emit on the producer's thread)
    /// and the consumer must marshal to the UI thread itself.
    /// </summary>
    public sealed class CallbackSink : ILogEventSink
    {
        private readonly Action<LogEntry> _onEvent;

        public CallbackSink(Action<LogEntry> onEvent)
        {
            _onEvent = onEvent ?? throw new ArgumentNullException(nameof(onEvent));
        }

        public void Emit(LogEvent logEvent)
        {
            string rendered = logEvent.RenderMessage();
            // The Logger.Section helper renders messages as "=== {Section} ===" with the
            // template parameter substituted; recognise that prefix to flag section breaks
            // for the UI to render with a different style.
            bool isSection = rendered.StartsWith("=== ", StringComparison.Ordinal)
                          && rendered.EndsWith(" ===", StringComparison.Ordinal);

            var entry = new LogEntry
            {
                TimestampUtc = logEvent.Timestamp.UtcDateTime,
                Severity = logEvent.Level switch
                {
                    LogEventLevel.Debug => LogSeverity.Debug,
                    LogEventLevel.Verbose => LogSeverity.Debug,
                    LogEventLevel.Information => LogSeverity.Info,
                    LogEventLevel.Warning => LogSeverity.Warn,
                    LogEventLevel.Error => LogSeverity.Error,
                    LogEventLevel.Fatal => LogSeverity.Error,
                    _ => LogSeverity.Info,
                },
                Message = rendered,
                IsSection = isSection,
            };
            _onEvent(entry);
        }
    }
}
