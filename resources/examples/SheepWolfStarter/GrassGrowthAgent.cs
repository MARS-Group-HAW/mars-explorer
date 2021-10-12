using System;
using Mars.Interfaces.Agents;
using Mars.Interfaces.Annotations;
using Mars.Interfaces.Environments;

namespace  SheepWolfStarter
{
    public class GrassGrowthAgent : IAgent<GrasslandLayer>
    {
        [PropertyDescription]
        public int GrassRegrowthPerStep { get; set; }

        public void Init(GrasslandLayer layer)
        {
            Grassland = layer;
        }

        private GrasslandLayer Grassland { get; set; }

        public void Tick()
        {
            for (var x = 0; x < Grassland.Width; x++)
            {
                for (var y = 0; y < Grassland.Height; y++)
                {
                    var position = Position.CreatePosition(x, y);
                    Grassland[position] = Grassland[position] + GrassRegrowthPerStep;
                }
            }
        }

        public Guid ID { get; set; }
    }
}
