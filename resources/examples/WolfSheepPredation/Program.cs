using System;
using System.IO;
using Mars.Components.Starter;
using Mars.Interfaces.Model;

namespace SheepWolfStarter
{
    internal static class Program
    {
        private static void Main()
        {
            // model definition
            // all layer, agents, entities that should be part of the simulation have to be added to the model description
            var description = new ModelDescription();
            description.AddLayer<GrasslandLayer>();
            description.AddAgent<GrassGrowthAgent, GrasslandLayer>();
            description.AddAgent<Sheep, GrasslandLayer>();
            description.AddAgent<Wolf, GrasslandLayer>();

            // scenario definition
            // use config.json that holds the specification of the scenario
            var file = File.ReadAllText("config.json");
            var config = SimulationConfig.Deserialize(file);

            // start simulation
            var starter = SimulationStarter.Start(description, config);
            var handle = starter.Run();
            Console.WriteLine("Successfully executed iterations: " + handle.Iterations);
            starter.Dispose();
        }
    }
}
