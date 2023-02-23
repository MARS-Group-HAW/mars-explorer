using System;
using Mars.Common.Core;
using Mars.Common.Core.Random;
using Mars.Components.Environments;
using Mars.Interfaces.Agents;
using Mars.Interfaces.Annotations;
using Mars.Interfaces.Environments;
using Mars.Interfaces.Layers;
using Mars.Numerics.Statistics;

namespace RandomGridMoveModel
{
    public class Murkel : IAgent<MyGridLayer>, IPositionable
    {
        [PropertyDescription]
        public UnregisterAgent UnregisterHandle { get; set; }

        public void Init(MyGridLayer layer)
        {
            Layer = layer;
            Energy = 100;

            Position = RandomPosition();
            Environment.Insert(this);
        }

        public void Tick()
        {
            Console.WriteLine($"This is agent {ID} with energy of {Energy} at Position {Position}");

            Energy -= 5;
            if (Energy <= 0)
            {
                Kill();
            }

            if (Energy >= 50)
            {
                Environment.MoveTo(this, RandomPosition());
            }
            else
            {
                RandomWalk();
            }

            Energy += Layer[Position.X, Position.Y].Value<int>();
            Layer[Position.X, Position.Y] = 0;
        }

        private MyGridLayer Layer { get; set; }
        private GeoHashEnvironment<Murkel> Environment => Layer.GeoEnvironment;
        public int Energy { get; set; }
        
        private Position RandomPosition()
        {
            var random = RandomHelper.Random;
            return Position.CreatePosition(random.Next(Layer.Width - 1), random.Next(Layer.Height - 1));
        }

        private void RandomWalk()
        {
            switch (RandomHelper.Random.Next(8))
            {
                case 0:
                    Move(1, 0); //move north
                    break;
                case 1:
                    Move(1, 45); //move north-east
                    break;
                case 2:
                    Move(1, 90); //move east
                    break;
                case 3:
                    Move(1, 135); //move south-east
                    break;
                case 4:
                    Move(1, 180); //move south
                    break;
                case 5:
                    Move(1, 225); //move south-west
                    break;
                case 6:
                    Move(1, 270); //move west
                    break;
                case 7:
                    Move(1, 315); //move north-west
                    break;
            }
        }

        private void Move(int distance, int bearing)
        {
            Environment.MoveTowards(this, bearing, distance);
        }

        private void Kill()
        {
            Environment.Remove(this);
            UnregisterHandle.Invoke(Layer, this);
        }

        public Guid ID { get; set; }
        public Position Position { get; set; }
    }
}