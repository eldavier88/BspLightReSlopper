using Xunit;

namespace BspLightReSlopper.Tests
{
    public class SmokeTests
    {
        [Fact]
        public void Bootstrap_ReferencedAssemblyLoads()
        {
            // Pulls a type from the main project so the project reference is exercised at build time.
            var name = typeof(BspLightReSlopper.Bsp.BspLoader).Assembly.GetName().Name;
            Assert.Equal("BspLightReSlopper.Core", name);
        }
    }
}
