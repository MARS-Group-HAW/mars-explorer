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
	public class Sheep : Mars.Interfaces.Agent.IMarsDslAgent {
		private static readonly Mars.Common.Logging.ILogger _Logger = 
					Mars.Common.Logging.LoggerFactory.GetLogger(typeof(Sheep));
		private readonly System.Random _Random = new System.Random();
		private string __Rule
			 = "";
		public string Rule { 
			get { return __Rule; }
			set{
				if(__Rule != value) __Rule = value;
			}
		}
		private int __Energy
			 = default(int);
		public int Energy { 
			get { return __Energy; }
			set{
				if(__Energy != value) __Energy = value;
			}
		}
		private int __Sheep_gain_from_food
			 = default(int);
		public int Sheep_gain_from_food { 
			get { return __Sheep_gain_from_food; }
			set{
				if(__Sheep_gain_from_food != value) __Sheep_gain_from_food = value;
			}
		}
		private int __Sheep_reproduce
			 = default(int);
		public int Sheep_reproduce { 
			get { return __Sheep_reproduce; }
			set{
				if(__Sheep_reproduce != value) __Sheep_reproduce = value;
			}
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public virtual void EatGrass() 
		{
			{
			Energy = Energy + Sheep_gain_from_food;
			int grass_available = grass.GetIntegerValue(this.Position.X,this.Position.Y);
			grass.SetIntegerValue(this.Position.X,this.Position.Y,Mars.Components.Common.Math.Max(grass_available - 3,0)
			)
			;}
			return;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public virtual void Spawn(int percent) 
		{
			{
			if(_Random.Next(100)
			 < percent) {
							{
							MyWolfSheepPredation.Sheep newSheep = new System.Func<MyWolfSheepPredation.Sheep>(() => {
							var _target54_1299 = new System.Tuple<double,double>(this.Position.X,this.Position.Y);
							return _Grassland._SpawnSheep(_target54_1299.Item1, _target54_1299.Item2);}).Invoke();
							newSheep.SecondInitialize(Energy,Sheep_gain_from_food,Sheep_reproduce);
							Energy = Energy / 2
							;}
					;} 
			;}
			return;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public virtual void RandomMove() 
		{
			{
			new System.Func<Tuple<double,double>>(() => {
				
				var _speed61_1516 = 1
			;
				
				var _entity61_1516 = this;
				
				Func<double[], bool> _predicate61_1516 = null;
				
				var _target61_1516 = new System.Tuple<int,int>(_Random.Next(grass.DimensionX()
				),
				_Random.Next(grass.DimensionY()
				)
				);
				_Grassland._SheepEnvironment.MoveTo(_entity61_1516,
					 _target61_1516.Item1, _target61_1516.Item2, 
					_speed61_1516, 
					_predicate61_1516);
				
				return new Tuple<double, double>(Position.X, Position.Y);
			}).Invoke()
			;}
			return;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public virtual void EnergyLoss() 
		{
			{
			Energy = Energy - 1;
			if(Energy <= 0) {
							new System.Action(() => {
								var _target66_1647 = this;
								if (_target66_1647 != null) {
									_Grassland._KillSheep(_target66_1647, _target66_1647._executionFrequency);
								}
							}).Invoke()
					;} 
			;}
			return;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public void Killed() {
			{
			new System.Action(() => {
				var _target68_1680 = this;
				if (_target68_1680 != null) {
					_Grassland._KillSheep(_target68_1680, _target68_1680._executionFrequency);
				}
			}).Invoke()
					;
			}
			
			return;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public void SecondInitialize(
		int sheepEnergy,
		int sheepGain,
		int sheepReproduce) {
			{
			Energy = sheepEnergy / 2;
			Sheep_gain_from_food = sheepGain;
			Sheep_reproduce = sheepReproduce
			;}
			
			return;
		}
		internal bool _isAlive;
		internal int _executionFrequency;
		
		public MyWolfSheepPredation.Grassland _Layer_ => _Grassland;
		public MyWolfSheepPredation.Grassland _Grassland { get; set; }
		public MyWolfSheepPredation.Grassland grass => _Grassland;
		
		[Mars.Interfaces.LIFECapabilities.PublishForMappingInMars]
		public Sheep (
		System.Guid _id,
		MyWolfSheepPredation.Grassland _layer,
		Mars.Interfaces.Layer.RegisterAgent _register,
		Mars.Interfaces.Layer.UnregisterAgent _unregister,
		Mars.Components.Environments.SpatialHashEnvironment<Sheep> _SheepEnvironment,
		int Sheep_gain_from_food,
		int Sheep_reproduce
	,	double xcor = 0, double ycor = 0, int freq = 1)
		{
			_Grassland = _layer;
			ID = _id;
			Position = Mars.Interfaces.Environment.Position.CreatePosition(xcor, ycor);
			_Random = new System.Random(ID.GetHashCode());
			this.Sheep_gain_from_food = Sheep_gain_from_food;
			this.Sheep_reproduce = Sheep_reproduce;
			_Grassland._SheepEnvironment.Insert(this);
			_register(_layer, this, freq);
			_isAlive = true;
			_executionFrequency = freq;
			{
			new System.Func<System.Tuple<double,double>>(() => {
				
				var _taget23_678 = new System.Tuple<int,int>(_Random.Next(grass.DimensionX()
				),
				_Random.Next(grass.DimensionY()
				)
				);
				
				var _object23_678 = this;
				
				_Grassland._SheepEnvironment.PosAt(_object23_678, 
					_taget23_678.Item1, _taget23_678.Item2
				);
				return new Tuple<double, double>(Position.X, Position.Y);
			}).Invoke();
			Energy = _Random.Next(2 * Sheep_gain_from_food)
			;}
		}
		
		public void Tick()
		{
			{ if (!_isAlive) return; }
			{
			EnergyLoss();
			Spawn(Sheep_reproduce);
			RandomMove();
			if(grass.GetIntegerValue(this.Position.X,this.Position.Y)
			 > 0) {
							{
							Rule = "R1 - Eat grass";
							EatGrass()
							;}
					;} else {
							{
							Rule = "R2 - No food found"
							;}
						;}
			;}
		}
		
		public System.Guid ID { get; }
		public Mars.Interfaces.Environment.Position Position { get; set; }
		public bool Equals(Sheep other) => Equals(ID, other.ID);
		public override int GetHashCode() => ID.GetHashCode();
	}
}
