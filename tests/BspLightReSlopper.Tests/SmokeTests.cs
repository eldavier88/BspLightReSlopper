using Xunit;

namespace BspLightReSlopper.Tests
{
    public class SmokeTests
    {
        [Fact]
        public void Bootstrap_ReferencedAssemblyLoads()
        {
            // Pulls a type from the main project so the project reference is exercised at build time.
            var name = typeof(Program).Assembly.GetName().Name;
            Assert.Equal("bsplrs", name);
        }
    }
}
