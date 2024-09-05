using Microsoft.AspNetCore.Mvc;

namespace Musivis.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;

        public TestController(ILogger<TestController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetTest")]
        public string Get()
        {
            return "Hello world!";
        }
    }
}
