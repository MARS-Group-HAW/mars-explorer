using System.Linq;
using Mars.Components.Environments;
using Mars.Components.Layers;
using Mars.Core.Data;
using Mars.Interfaces.Data;
using Mars.Interfaces.Layers;

namespace RandomGridMoveModel
{
    public class MyGridLayer : RasterLayer
    {
        public override bool InitLayer(LayerInitData layerInitData, RegisterAgent registerAgentHandle,
            UnregisterAgent unregisterAgentHandle)
        {
            base.InitLayer(layerInitData, registerAgentHandle, unregisterAgentHandle);
            GeoEnvironment = GeoHashEnvironment<Murkel>.BuildByBBox(0, 0, Width, Height, true);

            var agentManager = layerInitData.Container.Resolve<IAgentManager>();
            agentManager.Spawn<Murkel, MyGridLayer>().ToList();
            return true;
        }

        public GeoHashEnvironment<Murkel> GeoEnvironment { get; private set; }
    }
}