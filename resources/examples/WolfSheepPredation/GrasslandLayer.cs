using System.Linq;
using Mars.Common.Core.Random;
using Mars.Components.Environments;
using Mars.Components.Layers;
using Mars.Core.Data;
using Mars.Interfaces.Data;
using Mars.Interfaces.Environments;
using Mars.Interfaces.Layers;
using Mars.Numerics.Statistics;

namespace SheepWolfStarter.Model
{
    public class GrasslandLayer : RasterLayer
    {
        /// <summary>
        ///     Holds all sheep in a grid environment.
        /// </summary>
        public SpatialHashEnvironment<Sheep> SheepEnvironment { get; private set; }

        /// <summary>
        ///     Holds all wolves in a grid environment.
        /// </summary>
        public SpatialHashEnvironment<Wolf> WolfEnvironment { get; private set; }

        /// <summary>
        ///     Responsible to create new agents and initialize them with required dependencies
        /// </summary>
        public IAgentManager AgentManager { get; private set; }

        public override bool InitLayer(LayerInitData layerInitData, RegisterAgent registerAgentHandle,
            UnregisterAgent unregisterAgentHandle)
        {
            var initiated = base.InitLayer(layerInitData, registerAgentHandle, unregisterAgentHandle);

            SheepEnvironment = new SpatialHashEnvironment<Sheep>(Width - 1, Height - 1) {CheckBoundaries = true};
            WolfEnvironment = new SpatialHashEnvironment<Wolf>(Width - 1, Height - 1) {CheckBoundaries = true};

            AgentManager = layerInitData.Container.Resolve<IAgentManager>();
            AgentManager.Spawn<GrassGrowthAgent, GrasslandLayer>().ToList();
            AgentManager.Spawn<Sheep, GrasslandLayer>().ToList();
            AgentManager.Spawn<Wolf, GrasslandLayer>().ToList();

            return initiated;
        }

        public Position FindRandomPosition()
        {
            var random = RandomHelper.Random;
            return Position.CreatePosition(random.Next(Width - 1), random.Next(Height - 1));
        }
    }
}
