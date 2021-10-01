using System;
using Mars.Common;
using Mars.Common.Core.Random;
using Mars.Interfaces.Agents;
using Mars.Interfaces.Annotations;
using Mars.Interfaces.Environments;
using Mars.Interfaces.Layers;

namespace $PROJECT_NAME.Model
{
    public class $OBJECT_NAME : IAgent<ADD_LAYER_CLASS_HERE>, IPositionable
    {

        public void Init(ADD_LAYER_CLASS_HERE layer)
        {

        }

        public Position Position { get; set; }


        public void Tick()
        {

        }

        public Guid ID { get; set; }
    }
}
