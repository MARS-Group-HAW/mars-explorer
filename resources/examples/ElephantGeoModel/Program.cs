using Mars.Common.Core.Logging;
using Mars.Common.Core.Logging.Enums;
using Mars.Components.Starter;
using Mars.Interfaces.Model;

namespace ElephantGeoModel
{
    internal static class Program
    {
        public static void Main(string[] args)
        {
            if (args != null && System.Linq.Enumerable.Any(args, s => s.Equals("-l")))
            {
                LoggerFactory.SetLogLevel(LogLevel.Info);
                LoggerFactory.ActivateConsoleLogging();
            }
            // Create a new model container
            var description = new ModelDescription();
            // Register layer MyGrid
            description.AddLayer<LandscapeLayer>();
            // Register additional data layer
            description.AddLayer<KNPPerimeter>();
            description.AddLayer<WaterLayer>();
            description.AddLayer<RCP85Prec>();
            description.AddLayer<RCP85AGBio>();
            // Register agent Murkel
            description.AddAgent<Elephant, LandscapeLayer>();
            
            var file = File.ReadAllText("config.json");
            var simConfig = SimulationConfig.Deserialize(file);
            using var application = SimulationStarter.BuildApplication(description, simConfig);
            var simulation = application.Resolve<ISimulation>();
            var state = simulation.StartSimulation();

            Console.WriteLine($"Simulation execution finished after {loopResults.Iterations} steps");
        }
    }
}