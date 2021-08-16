namespace MyWolfSheepPredation {
	using System;
	using System.Linq;
	using System.Collections.Generic;
	// Pragma and ReSharper disable all warnings for generated code
	#pragma warning disable 162
	#pragma warning disable 219
	#pragma warning disable 169
	[System.Diagnostics.CodeAnalysis.SuppressMessage("ReSharper", "ConditionIsAlwaysTrueOrFalse")]
	[System.Diagnostics.CodeAnalysis.SuppressMessage("ReSharper", "InconsistentNaming")]
	[System.Diagnostics.CodeAnalysis.SuppressMessage("ReSharper", "UnusedParameter.Local")]
	[System.Diagnostics.CodeAnalysis.SuppressMessage("ReSharper", "RedundantNameQualifier")]
	[System.Diagnostics.CodeAnalysis.SuppressMessage("ReSharper", "PossibleInvalidOperationException")]
	[System.Diagnostics.CodeAnalysis.SuppressMessage("ReSharper", "ExpressionIsAlwaysNull")]
	[System.Diagnostics.CodeAnalysis.SuppressMessage("ReSharper", "MemberInitializerValueIgnored")]
	[System.Diagnostics.CodeAnalysis.SuppressMessage("ReSharper", "RedundantCheckBeforeAssignment")]
	public class GrassGrowthAgent : Mars.Interfaces.Agent.IMarsDslAgent {
		private static readonly Mars.Common.Logging.ILogger _Logger = 
					Mars.Common.Logging.LoggerFactory.GetLogger(typeof(GrassGrowthAgent));
		private readonly System.Random _Random = new System.Random();
		private int __Grass_regrowth_per_step
			 = default(int);
		internal int Grass_regrowth_per_step { 
			get { return __Grass_regrowth_per_step; }
			set{
				if(__Grass_regrowth_per_step != value) __Grass_regrowth_per_step = value;
			}
		}
		internal bool _isAlive;
		internal int _executionFrequency;
		
		public MyWolfSheepPredation.Grassland _Layer_ => _Grassland;
		public MyWolfSheepPredation.Grassland _Grassland { get; set; }
		public MyWolfSheepPredation.Grassland grass => _Grassland;
		
		[Mars.Interfaces.LIFECapabilities.PublishForMappingInMars]
		public GrassGrowthAgent (
		System.Guid _id,
		MyWolfSheepPredation.Grassland _layer,
		Mars.Interfaces.Layer.RegisterAgent _register,
		Mars.Interfaces.Layer.UnregisterAgent _unregister,
		Mars.Components.Environments.SpatialHashEnvironment<GrassGrowthAgent> _GrassGrowthAgentEnvironment,
		int Grass_regrowth_per_step
	,	double xcor = 0, double ycor = 0, int freq = 1)
		{
			_Grassland = _layer;
			ID = _id;
			Position = Mars.Interfaces.Environment.Position.CreatePosition(xcor, ycor);
			_Random = new System.Random(ID.GetHashCode());
			this.Grass_regrowth_per_step = Grass_regrowth_per_step;
			_Grassland._GrassGrowthAgentEnvironment.Insert(this);
			_register(_layer, this, freq);
			_isAlive = true;
			_executionFrequency = freq;
		}
		
		public void Tick()
		{
			{ if (!_isAlive) return; }
			{
			for(int x = 0;
					 x < grass.DimensionX()
					 ;
					 x++){
					 	{
					 	for(int y = 0;
					 			 y < grass.DimensionY()
					 			 ;
					 			 y++){
					 			 	{
					 			 	grass.SetIntegerValue(x,y,grass.GetIntegerValue(x,y)
					 			 	 + Grass_regrowth_per_step)
					 			 	;}
					 			 }
					 	;}
					 }
			;}
		}
		
		public System.Guid ID { get; }
		public Mars.Interfaces.Environment.Position Position { get; set; }
		public bool Equals(GrassGrowthAgent other) => Equals(ID, other.ID);
		public override int GetHashCode() => ID.GetHashCode();
	}
}
