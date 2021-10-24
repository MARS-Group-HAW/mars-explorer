using System.Linq;
using Mars.Components.Environments;
using Mars.Components.Layers;
using Mars.Core.Data;
using Mars.Interfaces.Annotations;
using Mars.Interfaces.Layers;
using Mars.Interfaces.Data;

namespace ElephantGeoModel
{
    public class LandscapeLayer : AbstractLayer
    {
        [PropertyDescription(Name = "WaterLayer")]
        public WaterLayer Water { get; set; }

        [PropertyDescription(Name = "KNPPerimeter")]
        public KNPPerimeter KnpFence { get; set; }

        [PropertyDescription(Name = "RCP85Prec")]
        public RCP85Prec Precipitation { get; set; }

        [PropertyDescription(Name = "RCP85AGBio")]
        public RCP85AGBio Biomass { get; set; }

        public override bool InitLayer(LayerInitData layerInitData, RegisterAgent registerAgentHandle,
            UnregisterAgent unregisterAgentHandle)
        {
            base.InitLayer(layerInitData, registerAgentHandle, unregisterAgentHandle);

            var baseExtent = Water.Extent;
            baseExtent.ExpandedBy(KnpFence.Extent);
            baseExtent.ExpandedBy(Precipitation.Extent);
            baseExtent.ExpandedBy(Biomass.Extent);

            Environment = GeoHashEnvironment<Elephant>.BuildByBBox(baseExtent, 1000);

            var agentManager = layerInitData.Container.Resolve<IAgentManager>();
            agentManager.Spawn<Elephant, LandscapeLayer>().ToList();
            return true;
        }

        public GeoHashEnvironment<Elephant> Environment { get; set; }
    }
}