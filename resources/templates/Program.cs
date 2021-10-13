using System;
using System.IO;
using Mars.Components.Starter;
using Mars.Interfaces.Model;

namespace $PROJECT_NAME
{
    internal static class Program
    {
        private static void Main()
        {
            // [IMPORTANT - DO NOT DELETE] This describes your executing model
            var description = new ModelDescription();
            // description.AddLayer<MyLayer>(); -> add your layers this way
            // description.AddAgent<MyAgent, MyLayer>(); -> add your agents this way
           // description.AddEntity<MyEntity>(); -> add your entities this way

            // TODO: delete this if you've added your classes as shown above
            throw new Exception(
                "Add your classes (agents, layers, entities) to the model description in Program.cs and delete this exception.");

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
