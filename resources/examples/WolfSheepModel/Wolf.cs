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
	public class Wolf : Mars.Interfaces.Agent.IMarsDslAgent {
		private static readonly Mars.Common.Logging.ILogger _Logger = 
					Mars.Common.Logging.LoggerFactory.GetLogger(typeof(Wolf));
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
		private MyWolfSheepPredation.Wolf __Mother
			 = default(MyWolfSheepPredation.Wolf);
		internal MyWolfSheepPredation.Wolf Mother { 
			get { return __Mother; }
			set{
				if(__Mother != value) __Mother = value;
			}
		}
		private int __Wolf_gain_from_food
			 = default(int);
		internal int Wolf_gain_from_food { 
			get { return __Wolf_gain_from_food; }
			set{
				if(__Wolf_gain_from_food != value) __Wolf_gain_from_food = value;
			}
		}
		private int __Wolf_reproduce
			 = default(int);
		internal int Wolf_reproduce { 
			get { return __Wolf_reproduce; }
			set{
				if(__Wolf_reproduce != value) __Wolf_reproduce = value;
			}
		}
		private int __Wolf_gain_temp
			 = default(int);
		public int Wolf_gain_temp { 
			get { return __Wolf_gain_temp; }
			set{
				if(__Wolf_gain_temp != value) __Wolf_gain_temp = value;
			}
		}
		private int __Wolf_rep_temp
			 = default(int);
		public int Wolf_rep_temp { 
			get { return __Wolf_rep_temp; }
			set{
				if(__Wolf_rep_temp != value) __Wolf_rep_temp = value;
			}
		}
		private MyWolfSheepPredation.Sheep __Target
			 = default(MyWolfSheepPredation.Sheep);
		internal MyWolfSheepPredation.Sheep Target { 
			get { return __Target; }
			set{
				if(__Target != value) __Target = value;
			}
		}
		private double __TargetDistance
			 = default(double);
		internal double TargetDistance { 
			get { return __TargetDistance; }
			set{
				if(System.Math.Abs(__TargetDistance - value) > 0.0000001) __TargetDistance = value;
			}
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public virtual void EnergyLoss() 
		{
			{
			Energy = Energy - 1;
			if(Energy <= 0) {
							new System.Action(() => {
								var _target130_3465 = this;
								if (_target130_3465 != null) {
									_Grassland._KillWolf(_target130_3465, _target130_3465._executionFrequency);
								}
							}).Invoke()
					;} 
			;}
			return;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public virtual void RandomMove() 
		{
			{
			new System.Func<Tuple<double,double>>(() => {
				
				var _speed134_3499 = 3
			;
				
				var _entity134_3499 = this;
				
				Func<double[], bool> _predicate134_3499 = null;
				
				var _target134_3499 = new System.Tuple<int,int>(_Random.Next(grass.DimensionX()
				),
				_Random.Next(grass.DimensionY()
				)
				);
				_Grassland._WolfEnvironment.MoveTo(_entity134_3499,
					 _target134_3499.Item1, _target134_3499.Item2, 
					_speed134_3499, 
					_predicate134_3499);
				
				return new Tuple<double, double>(Position.X, Position.Y);
			}).Invoke()
			;}
			return;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public virtual void EatSheep(MyWolfSheepPredation.Sheep sheep) 
		{
			{
			Energy = Energy + Wolf_gain_temp;
			sheep.Killed();
			Rule = "R6 - Sheep killed!"
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
							new System.Func<MyWolfSheepPredation.Wolf>(() => {
							var _target145_3750 = new System.Tuple<double,double>(this.Position.X,this.Position.Y);
							return _Grassland._SpawnWolf(_target145_3750.Item1, _target145_3750.Item2);}).Invoke();
							Energy = Energy / 2
							;}
					;} 
			;}
			return;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public int GetEnergyValue() {
			{
			return Energy
					;
			}
			
			return default(int);;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public int GetGainFromFood() {
			{
			return Wolf_gain_temp
					;
			}
			
			return default(int);;
		}
		[System.Runtime.CompilerServices.MethodImpl(System.Runtime.CompilerServices.MethodImplOptions.AggressiveInlining)]
		public int GetRepRate() {
			{
			return Wolf_rep_temp
					;
			}
			
			return default(int);;
		}
		internal bool _isAlive;
		internal int _executionFrequency;
		
		public MyWolfSheepPredation.Grassland _Layer_ => _Grassland;
		public MyWolfSheepPredation.Grassland _Grassland { get; set; }
		public MyWolfSheepPredation.Grassland grass => _Grassland;
		public Mars.Components.Environments.SpatialHashEnvironment<Wolf> _WolfEnvironment { get; set; }
		public Mars.Components.Environments.SpatialHashEnvironment<Sheep> _SheepEnvironment { get; set; }
		
		[Mars.Interfaces.LIFECapabilities.PublishForMappingInMars]
		public Wolf (
		System.Guid _id,
		MyWolfSheepPredation.Grassland _layer,
		Mars.Interfaces.Layer.RegisterAgent _register,
		Mars.Interfaces.Layer.UnregisterAgent _unregister,
		Mars.Components.Environments.SpatialHashEnvironment<Wolf> _WolfEnvironment,
		int Wolf_gain_from_food,
		int Wolf_reproduce
	,	double xcor = 0, double ycor = 0, int freq = 1)
		{
			_Grassland = _layer;
			ID = _id;
			Position = Mars.Interfaces.Environment.Position.CreatePosition(xcor, ycor);
			_Random = new System.Random(ID.GetHashCode());
			this.Wolf_gain_from_food = Wolf_gain_from_food;
			this.Wolf_reproduce = Wolf_reproduce;
			_Grassland._WolfEnvironment.Insert(this);
			_register(_layer, this, freq);
			_isAlive = true;
			_executionFrequency = freq;
			{
			new System.Func<System.Tuple<double,double>>(() => {
				
				var _taget96_2681 = new System.Tuple<int,int>(_Random.Next(grass.DimensionX()
				),
				_Random.Next(grass.DimensionY()
				)
				);
				
				var _object96_2681 = this;
				
				_Grassland._WolfEnvironment.PosAt(_object96_2681, 
					_taget96_2681.Item1, _taget96_2681.Item2
				);
				return new Tuple<double, double>(Position.X, Position.Y);
			}).Invoke();
			Wolf_gain_temp = Wolf_gain_from_food;
			Wolf_rep_temp = Wolf_reproduce;
			if(Equals((int) Mars.Core.SimulationManager.Entities.SimulationClock.CurrentStep, 0)) {
							{
							Energy = _Random.Next(2 * Wolf_gain_from_food)
							;}
					;} else {
							{
							Mother = new Func<MyWolfSheepPredation.Wolf>(() => {
								Func<MyWolfSheepPredation.Wolf, bool> _predicate102_2901 = null;
								Func<MyWolfSheepPredation.Wolf, bool> _predicateMod102_2901 = new Func<MyWolfSheepPredation.Wolf, bool>(_it => 
								{
									if (_it?.ID == this.ID)
									{
										return false;
									} else if (_predicate102_2901 != null)
									{
										return _predicate102_2901.Invoke(_it);
									} else return true;
								});
								
								const int _range102_2901 = -1;
								var _source102_2901 = this.Position;
								
								return _Grassland._WolfEnvironment.Explore(_source102_2901, _range102_2901, 1, _predicateMod102_2901)?.FirstOrDefault();
							}).Invoke();
							Energy = Mother.GetEnergyValue()
							 / 2;
							Wolf_gain_temp = Mother.GetGainFromFood();
							Wolf_rep_temp = Mother.GetRepRate()
							;}
						;}
			;}
		}
		
		public void Tick()
		{
			{ if (!_isAlive) return; }
			{
			EnergyLoss();
			Spawn(Wolf_reproduce);
			Target = new Func<MyWolfSheepPredation.Sheep>(() => {
				Func<MyWolfSheepPredation.Sheep, bool> _predicate113_3122 = null;
				Func<MyWolfSheepPredation.Sheep, bool> _predicateMod113_3122 = new Func<MyWolfSheepPredation.Sheep, bool>(_it => 
				{
					if (_it?.ID == this.ID)
					{
						return false;
					} else if (_predicate113_3122 != null)
					{
						return _predicate113_3122.Invoke(_it);
					} else return true;
				});
				
				const int _range113_3122 = -1;
				var _source113_3122 = this.Position;
				
				return _Grassland._SheepEnvironment.Explore(_source113_3122, _range113_3122, 1, _predicateMod113_3122)?.FirstOrDefault();
			}).Invoke();
			if(!Equals(Target, null)) {
							{
							TargetDistance = new Func<double>(() => {
							var _target115_3178 = (Target);
							if (_target115_3178 == null) return 0.0;
							return Mars.Mathematics.Distance.Calculate(Mars.Mathematics.SpaceDistanceMetric.Chebyshev, this.Position.PositionArray, _target115_3178.Position.PositionArray);
							}).Invoke();
							if(TargetDistance < 1) {
											{
											Rule = "R3 - Eat Sheep";
											EatSheep(Target)
											;}
									;} else {
											{
											Rule = "R4 - No sheep on my point";
											new System.Func<Tuple<double,double>>(() => {
												
												var _speed122_3328 = 2
											;
												
												var _entity122_3328 = this;
												
												Func<double[], bool> _predicate122_3328 = null;
												
												var _target122_3328 = Target.Position;
												_Grassland._WolfEnvironment.MoveTo(_entity122_3328,
													_target122_3328, 
													_speed122_3328, 
													_predicate122_3328);
												
												return new Tuple<double, double>(Position.X, Position.Y);
											}).Invoke()
											;}
										;}
							;}
					;} else {
							{
							Rule = "R5 - No more sheep exist"
							;}
						;}
			;}
		}
		
		public System.Guid ID { get; }
		public Mars.Interfaces.Environment.Position Position { get; set; }
		public bool Equals(Wolf other) => Equals(ID, other.ID);
		public override int GetHashCode() => ID.GetHashCode();
	}
}
