using System.Collections.Generic;
using System.IO;
using BspLightReSlopper.Desktop.Services;
using BspLightReSlopper.Util;
using Xunit;

namespace BspLightReSlopper.Desktop.Tests
{
    public sealed class LogEventBufferTests
    {
        [Fact]
        public void CallbackSink_RecordsLevels()
        {
            var entries = new List<LogEntry>();
            var sink = new CallbackSink(entries.Add);

            using var log = new Logger(console: null, logPath: null, extraSink: sink);
            log.Info("hello");
            log.Warn("be careful");
            log.Error("boom");
            log.Debug("internal");
            log.Section("phase A");

            Assert.Contains(entries, e => e.Severity == LogSeverity.Info && e.Message == "hello");
            Assert.Contains(entries, e => e.Severity == LogSeverity.Warn);
            Assert.Contains(entries, e => e.Severity == LogSeverity.Error);
            Assert.Contains(entries, e => e.Severity == LogSeverity.Debug);
            Assert.Contains(entries, e => e.IsSection && e.Message.StartsWith("=== ") && e.Message.EndsWith(" ==="));
        }

        [Fact]
        public void Sink_DoesNotInterfereWithFileLogging()
        {
            string dir = Path.Combine(Path.GetTempPath(), "bsplrs-log-" + System.Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(dir);
            string logPath = Path.Combine(dir, "out.log");
            try
            {
                var entries = new List<LogEntry>();
                var sink = new CallbackSink(entries.Add);

                using (var log = new Logger(console: null, logPath: logPath, extraSink: sink))
                {
                    log.Info("file + sink");
                }

                Assert.Single(entries);
                Assert.True(File.Exists(logPath));
                string content = File.ReadAllText(logPath);
                Assert.Contains("file + sink", content);
            }
            finally
            {
                try { Directory.Delete(dir, recursive: true); } catch { }
            }
        }
    }
}
