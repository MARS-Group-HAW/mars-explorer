using System;
using System.IO;
using Mars.Components.Starter;
using Mars.Interfaces.Model;

namespace $NAME
{
    internal static class Program
    {
        private static void Main()
        {
            var description = new ModelDescription();
            // description.AddLayer<MyLayer>(); -> add your layers this way
            // description.AddAgent<MyAgent, MyLayer>(); -> add your agents this way
           // description.AddEntity<MyEntity>(); -> add your entities this way

            throw new Exception(
                "Add your objects (agents, layers, entities) to the model description in Program.cs and delete this exception.");

            // [IMPORTANT - DO NOT DELETE] use your config
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
