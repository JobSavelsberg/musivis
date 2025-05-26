using Microsoft.AspNetCore.Mvc;

namespace Musivis.API.Controllers
{
    /// <summary>
    /// Getting the status of the application.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class StatusController : ControllerBase
    {
        private readonly ILogger<StatusController> _logger;

        public StatusController(ILogger<StatusController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetStatus")]
        public string Get()
        {
            return "Coming soon...";
        }
    }
}
