using System;
using System.Linq;
using Mars.Common;
using Mars.Common.Core.Random;
using Mars.Interfaces.Agents;
using Mars.Interfaces.Annotations;
using Mars.Interfaces.Environments;
using Mars.Interfaces.Layers;
using Mars.Numerics;
using Mars.Numerics.Statistics;

namespace SheepWolfStarter.Model
{
    public class Wolf : IAgent<GrasslandLayer>, IPositionable
    {
        [PropertyDescription]
        public UnregisterAgent UnregisterHandle { get; set; }

        [PropertyDescription]
        public int WolfGainFromFood { get; set; }

        [PropertyDescription]
        public int WolfReproduce { get; set; }

        public void Init(GrasslandLayer layer)
        {
            _grassland = layer;

            if (Energy == 0)
                Energy = 2 * RandomHelper.Random.Next(WolfGainFromFood) + WolfGainFromFood;

            //Spawn somewhere in the grid when the simulation starts
            Position ??= _grassland.FindRandomPosition();
            _grassland.WolfEnvironment.Insert(this);
        }

        private GrasslandLayer _grassland;

        public Position Position { get; set; }

        public string Type => "Wolf";
        public string Rule { get; private set; }
        public int Energy { get; private set; }

        public void Tick()
        {
            if (EnergyLoss())
            {
                // if the agent died, return to prevent further execution of the Tick() method
                return;
            }
            Spawn(WolfReproduce);

            // var target = _grassland.SheepEnvironment.Explore(Position, -1D, 1).FirstOrDefault();
            var target = _grassland.SheepEnvironment.Entities.OrderBy(sheep =>
                Distance.Chebyshev(Position.PositionArray, sheep.Position.PositionArray)).FirstOrDefault();
            if (target != null)
            {
                var targetDistance = (int) Distance.Chebyshev(Position.PositionArray, target.Position.PositionArray);
                if (targetDistance <= 2)
                {
                    Rule = "R3 - Eat Sheep";
                    EatSheep(target);
                }
                else if (targetDistance < 10)
                {
                    Rule = $"R4 - Move towards sheep: {targetDistance} tiles away";
                    MoveTowardsTarget(target);
                }
                else
                {
                    Rule = "R5 - No sheep near by - random move";
                    RandomMove();
                }
            }
            else
            {
                Rule = "R6 - No more sheep exist";
                RandomMove();
            }
        }

        private void MoveTowardsTarget(Sheep target)
        {
            var directionToEnemy =
                PositionHelper.CalculateBearingCartesian(Position.X, Position.Y, target.Position.X, target.Position.Y);
            _grassland.WolfEnvironment.MoveTowards(this, directionToEnemy, 2);
        }

        private bool EnergyLoss()
        {
            Energy -= 2;
            if (Energy <= 0)
            {
                _grassland.WolfEnvironment.Remove(this);
                UnregisterHandle.Invoke(_grassland, this);
                return true;
            }

            return false;
        }

        private void RandomMove()
        {
            var bearing = RandomHelper.Random.Next(360);
            Position = _grassland.WolfEnvironment.MoveTowards(this, bearing, 3);
        }

        private void EatSheep(Sheep sheep)
        {
            Energy += WolfGainFromFood;
            sheep.Kill();
        }

        private void Spawn(int percent)
        {
            if (RandomHelper.Random.Next(100) < percent)
            {
                var newEnergy = Energy / 2;
                if (newEnergy == 0)
                {
                    // Prevent respawning with Energy=0 -> would cause new random Energy
                    // This could happen if Energy is 1: division by 2 -> 0.5 -> cast to int -> 0
                    return;
                }

                _grassland.AgentManager.Spawn<Wolf, GrasslandLayer>(null, agent =>
                {
                    agent.Position = Position.CreatePosition(Position.X, Position.Y);
                    agent.Energy = newEnergy;
                }).Take(1).First();

                Energy = newEnergy;
            }
        }

        public Guid ID { get; set; }
    }
}
