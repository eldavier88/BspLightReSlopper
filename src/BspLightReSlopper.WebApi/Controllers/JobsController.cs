using Microsoft.AspNetCore.Mvc;

namespace BspLightReSlopper.WebApi.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class JobsController : ControllerBase
    {
        [HttpPost("estimate")]
        public IActionResult Estimate([FromBody] object request)
        {
            return Ok(new { jobId = System.Guid.NewGuid().ToString(), status = "queued" });
        }

        [HttpGet("{jobId}/status")]
        public IActionResult Status(string jobId)
        {
            return Ok(new { jobId, status = "completed", progress = 1.0 });
        }
    }
}
