using Xunit;
using Musivis.API.Controllers;
using Microsoft.Extensions.Logging.Abstractions;

namespace Musivis.API.Tests
{
    public class StatusControllerTests
    {
        [Fact]
        public void Get_ReturnsComingSoon()
        {
            // Arrange
            var logger = NullLogger<StatusController>.Instance;
            var controller = new StatusController(logger);

            // Act
            var result = controller.Get();

            // Assert
            Assert.Equal("Coming soon...", result);
        }
    }
}
