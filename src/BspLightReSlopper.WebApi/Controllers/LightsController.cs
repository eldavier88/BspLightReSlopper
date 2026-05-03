using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BspLightReSlopper.WebApi.Data;

namespace BspLightReSlopper.WebApi.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class LightsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public LightsController(AppDbContext db) => _db = db;

        [HttpGet("by-job/{jobId}")]
        public async Task<ActionResult<IEnumerable<LightResult>>> ByJob(Guid jobId)
        {
            var lights = await _db.LightResults
                .AsNoTracking()
                .Where(l => l.JobId == jobId)
                .ToListAsync();
            return Ok(lights);
        }

        [HttpPost("by-job/{jobId}")]
        public async Task<ActionResult<IEnumerable<LightResult>>> Import(Guid jobId, [FromBody] List<LightResult> lights)
        {
            foreach (var l in lights)
            {
                l.Id = Guid.NewGuid();
                l.JobId = jobId;
            }
            _db.LightResults.AddRange(lights);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(ByJob), new { jobId }, lights);
        }
    }
}
