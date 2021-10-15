using System;
using System.IO;
using Mars.Components.Starter;
using Mars.Interfaces.Model;

namespace ElephantGeoModel
{
    internal static class Program
    {
        public static void Main(string[] args)
        {
            // [IMPORTANT - DO NOT DELETE] This describes your executing model
            var description = new ModelDescription();
            // Register layer
            description.AddLayer<LandscapeLayer>();
            // Register additional data layer
            description.AddLayer<KNPPerimeter>();
            description.AddLayer<WaterLayer>();
            description.AddLayer<RCP85Prec>();
            description.AddLayer<RCP85AGBio>();
            // Register agent Elephant
            description.AddAgent<Elephant, LandscapeLayer>();
            
            // [IMPORTANT - DO NOT DELETE] this reads your config
            var file = File.ReadAllText("config.json");
            var config = SimulationConfig.Deserialize(file);
            
            // [IMPORTANT - DO NOT DELETE] start a simulation
            var starter = SimulationStarter.Start(description, config);
            var handle = starter.Run();
            Console.WriteLine("Successfully executed iterations: " + handle.Iterations);
            starter.Dispose();
        }
    }
}