using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BspLightReSlopper.WebApi.Data;
using BspLightReSlopper.WebApi.Services;

namespace BspLightReSlopper.WebApi.Controllers
{
    public class EstimateRequest
    {
        public string MapName { get; set; } = string.Empty;
        public string? FilePath { get; set; }
        public int? MaxLights { get; set; }
        public bool HalfLambert { get; set; }
    }

    [ApiController]
    [Route("api/v1/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JobQueueService _queue;

        public JobsController(AppDbContext db, JobQueueService queue)
        {
            _db = db;
            _queue = queue;
        }

        [HttpPost("estimate")]
        public async Task<IActionResult> Estimate([FromBody] EstimateRequest request)
        {
            var map = await _db.Maps.FirstOrDefaultAsync(m => m.Name == request.MapName);
            if (map == null && !string.IsNullOrEmpty(request.FilePath))
            {
                map = new Map { Name = request.MapName, FilePath = request.FilePath };
                _db.Maps.Add(map);
                await _db.SaveChangesAsync();
            }
            if (map == null) return BadRequest(new { error = "Map not found and no FilePath provided" });

            var job = new Job
            {
                Name = $"estimate-{request.MapName}",
                MapId = map.Id,
                Status = "queued"
            };
            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();
            _queue.Enqueue(job.Id);

            return Ok(new { jobId = job.Id, status = job.Status });
        }

        [HttpGet]
        public async Task<IActionResult> List()
        {
            var jobs = await _db.Jobs
                .AsNoTracking()
                .OrderByDescending(j => j.CreatedAt)
                .Take(50)
                .ToListAsync();
            return Ok(jobs);
        }

        [HttpGet("{jobId}")]
        public async Task<IActionResult> Get(Guid jobId)
        {
            var job = await _db.Jobs.AsNoTracking().FirstOrDefaultAsync(j => j.Id == jobId);
            if (job == null) return NotFound();
            return Ok(job);
        }

        [HttpPost("{jobId}/cancel")]
        public IActionResult Cancel(Guid jobId)
        {
            var ok = _queue.Cancel(jobId);
            return Ok(new { cancelled = ok });
        }
    }
}
