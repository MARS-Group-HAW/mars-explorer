using System;
using System.Linq;
using Mars.Common;
using Mars.Interfaces.Agents;
using Mars.Interfaces.Annotations;
using Mars.Interfaces.Environments;
using Mars.Interfaces.Layers;

namespace Geo_Test_CS.Model
{
    public class Elephant : IAgent<LandscapeLayer>, IPositionable
    {
        [PropertyDescription]
        public double Latitude { get; set; }
        
        [PropertyDescription]
        public double Longitude { get; set; }
        
        [PropertyDescription]
        public int HerdId { get; set; }
        
        [PropertyDescription]
        public string ElephantTypeString { get; set; }
        
        [PropertyDescription]
        public bool IsLeading { get; set; }

        [PropertyDescription(Name = "WaterLayer")]
        public WaterLayer Water { get; set; }

        [PropertyDescription(Name = "RCP85Prec")]
        public RCP85Prec Precipitation { get; set; }

        [PropertyDescription(Name = "RCP85AGBio")]
        public RCP85AGBio Biomass { get; set; }

        [PropertyDescription]
        public UnregisterAgent UnregisterHandle { get; set; }
        public void Init(LandscapeLayer layer)
        {
            Layer = layer;
            Energy = 100;
            Position = Position.CreateGeoPosition(Longitude, Latitude);
            Layer.Environment.Insert(this);
        }

        public void Tick()
        {
            var nearestWaterPos = Water.Explore(Position.PositionArray,-1D,1).FirstOrDefault().Node.NodePosition;

            Energy -= -10.0;
            if (Energy <= 0.0)
            {
                Kill();
            }

            var bearing = Position.GetBearing(nearestWaterPos);
            Position = Layer.Environment.MoveTowards(this, bearing, 10);

            var biomass = Biomass[Position.Longitude, Position.Latitude];
            if (biomass >= 0.0)
            {
                Console.WriteLine($"AGB at {Position}: {biomass}");
                Biomass[Position.Longitude, Position.Latitude] = Math.Max(0.0, biomass);
                Energy += 10.0;
            }

            var precipitation = Precipitation[Position.Longitude, Position.Latitude];
            if (biomass >= 0.0)
            {
                Console.WriteLine($"Precipitation at {Position}: {precipitation}");
            }
        }

        private LandscapeLayer Layer { get; set; }
        public double Energy { get; set; }

        private void Kill()
        {
            UnregisterHandle.Invoke(Layer, this);
        }

        public Guid ID { get; set; }
        public Position Position { get; set; }
    }
}