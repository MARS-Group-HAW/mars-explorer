using System;
using Geo_Test_CS.Model;
using Mars.Components.Starter;
using Mars.Interfaces.Model;

namespace Geo_Test_CS
{
    internal static class Program
    {
        public static void Main(string[] args)
        {
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
            // Create simulation task
            var task = SimulationStarter.Start(description, args);
            // Run simulation
            var loopResults = task.Run();
            // Feedback to user that simulation run was successful
            Console.WriteLine($"Simulation execution finished after {loopResults.Iterations} steps");
        }
    }
}