using System;
using System.IO;
using Mars.Components.Starter;
using Mars.Interfaces.Model;

namespace RandomGridMoveModel
{
    internal static class Program
    {
        public static void Main(string[] args)
        {
            // [IMPORTANT - DO NOT DELETE] This describes your executing model
            // Create a new model container
            var description = new ModelDescription();
            // Register layer MyGrid
            description.AddLayer<MyGridLayer>();
            // Register agent Murkel
            description.AddAgent<Murkel, MyGridLayer>();
            
            // [IMPORTANT - DO NOT DELETE] this reads your config
            var file = File.ReadAllText("config.json");
            var config = SimulationConfig.Deserialize(file);
            
            // [IMPORTANT - DO NOT DELETE] start a simulation
            using var starter = SimulationStarter.Start(description, config);
            var handle = starter.Run();
            Console.WriteLine("Successfully executed iterations: " + handle.Iterations);
            starter.Dispose();
        }
    }
}