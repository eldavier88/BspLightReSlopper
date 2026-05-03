using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using BspLightReSlopper.WebApi.Data;
using BspLightReSlopper.WebApi.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BspLightReSlopper.WebApi.Services
{
    /// <summary>
    /// In-memory background job queue with SignalR progress broadcasts.
    /// Phase P4: Foundation for the distributed job-processing backend.
    /// </summary>
    public sealed class JobQueueService : BackgroundService
    {
        private readonly IServiceProvider _sp;
        private readonly ILogger<JobQueueService> _log;
        private readonly IHubContext<JobHub, IJobClient> _hub;
        private readonly ConcurrentQueue<Guid> _queue = new();
        private readonly ConcurrentDictionary<Guid, CancellationTokenSource> _running = new();

        public JobQueueService(IServiceProvider sp, ILogger<JobQueueService> log, IHubContext<JobHub, IJobClient> hub)
        {
            _sp = sp;
            _log = log;
            _hub = hub;
        }

        public void Enqueue(Guid jobId)
        {
            _queue.Enqueue(jobId);
            _log.LogInformation("Job {JobId} enqueued", jobId);
        }

        public bool Cancel(Guid jobId)
        {
            if (_running.TryRemove(jobId, out var cts))
            {
                cts.Cancel();
                _log.LogInformation("Job {JobId} cancelled", jobId);
                return true;
            }
            return false;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _log.LogInformation("Job queue service started");
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_queue.TryDequeue(out var jobId))
                {
                    var cts = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
                    _running[jobId] = cts;
                    _ = Task.Run(async () => await ProcessJobAsync(jobId, cts.Token), cts.Token);
                }
                else
                {
                    await Task.Delay(500, stoppingToken);
                }
            }
        }

        private async Task ProcessJobAsync(Guid jobId, CancellationToken ct)
        {
            try
            {
                using var scope = _sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var job = await db.Jobs.FindAsync(new object[] { jobId }, ct);
                if (job == null) return;

                job.Status = "running";
                await db.SaveChangesAsync(ct);
                await _hub.Clients.Group(jobId.ToString()).JobProgress(jobId, 0, "started");

                // TODO: integrate with real BspLightReSlopper pipeline.
                // For Phase P4 this is a stub that simulates progress.
                for (int i = 0; i <= 100; i += 10)
                {
                    ct.ThrowIfCancellationRequested();
                    job.ProgressPercent = i;
                    await _hub.Clients.Group(jobId.ToString()).JobProgress(jobId, i, $"progress {i}%");
                    await Task.Delay(300, ct);
                }

                job.Status = "completed";
                job.CompletedAt = DateTime.UtcNow;
                await db.SaveChangesAsync(ct);
                await _hub.Clients.Group(jobId.ToString()).JobCompleted(jobId, "completed", null);
                _log.LogInformation("Job {JobId} completed", jobId);
            }
            catch (OperationCanceledException)
            {
                using var scope = _sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var job = await db.Jobs.FindAsync(new object[] { jobId }, CancellationToken.None);
                if (job != null)
                {
                    job.Status = "cancelled";
                    await db.SaveChangesAsync(CancellationToken.None);
                }
                await _hub.Clients.Group(jobId.ToString()).JobCompleted(jobId, "cancelled", null);
            }
            catch (Exception ex)
            {
                using var scope = _sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var job = await db.Jobs.FindAsync(new object[] { jobId }, CancellationToken.None);
                if (job != null)
                {
                    job.Status = "failed";
                    job.Error = ex.Message;
                    await db.SaveChangesAsync(CancellationToken.None);
                }
                await _hub.Clients.Group(jobId.ToString()).JobCompleted(jobId, "failed", ex.Message);
                _log.LogError(ex, "Job {JobId} failed", jobId);
            }
            finally
            {
                _running.TryRemove(jobId, out _);
            }
        }
    }
}
