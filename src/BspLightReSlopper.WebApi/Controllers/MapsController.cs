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
    public class MapsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public MapsController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Map>>> List()
        {
            return Ok(await _db.Maps.AsNoTracking().OrderByDescending(m => m.UploadedAt).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Map>> Get(Guid id)
        {
            var map = await _db.Maps.AsNoTracking().FirstOrDefaultAsync(m => m.Id == id);
            if (map == null) return NotFound();
            return Ok(map);
        }

        [HttpPost]
        public async Task<ActionResult<Map>> Create([FromBody] Map map)
        {
            map.Id = Guid.NewGuid();
            map.UploadedAt = DateTime.UtcNow;
            _db.Maps.Add(map);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = map.Id }, map);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var map = await _db.Maps.FindAsync(id);
            if (map == null) return NotFound();
            _db.Maps.Remove(map);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
