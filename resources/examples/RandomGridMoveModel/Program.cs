using System;
using Grid_Test_CS.Model;
using Mars.Components.Starter;
using Mars.Interfaces.Model;
using RandomGridMoveModel.Model;

namespace RandomGridMoveModel
{
    internal static class Program
    {
        public static void Main(string[] args)
        {
            // Create a new model container
            var description = new ModelDescription();
            // Register layer MyGrid
            description.AddLayer<MyGridLayer>();
            // Register agent Murkel
            description.AddAgent<Murkel, MyGridLayer>();
            
            var file = File.ReadAllText("config.json");
            var simConfig = SimulationConfig.Deserialize(file);
            using var application = SimulationStarter.BuildApplication(description, simConfig);
            var simulation = application.Resolve<ISimulation>();
            var state = simulation.StartSimulation();
            Console.WriteLine($"Simulation execution finished after {loopResults.Iterations} steps");
        }
    }
}