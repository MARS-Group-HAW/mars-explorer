public static class Program {
	public static void Main(string[] args) {
		if (args != null && System.Linq.Enumerable.Any(args, s => s.Equals("-l")))
		{
			Mars.Common.Logging.LoggerFactory.SetLogLevel(Mars.Common.Logging.Enums.LogLevel.Info);
			Mars.Common.Logging.LoggerFactory.ActivateConsoleLogging();
		}
		var description = new Mars.Core.ModelContainer.Entities.ModelDescription();
		description.AddLayer<MyWolfSheepPredation.Grassland>();
		description.AddAgent<MyWolfSheepPredation.GrassGrowthAgent, MyWolfSheepPredation.Grassland>();
		description.AddAgent<MyWolfSheepPredation.Sheep, MyWolfSheepPredation.Grassland>();
		description.AddAgent<MyWolfSheepPredation.Wolf, MyWolfSheepPredation.Grassland>();
		var task = Mars.Core.SimulationStarter.SimulationStarter.Start(description, args);
		var loopResults = task.Run();
		System.Console.WriteLine($"Simulation execution finished after {loopResults.Iterations} steps");
	}
}
