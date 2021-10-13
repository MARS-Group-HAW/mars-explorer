using System;
using Mars.Interfaces.Agents;
using Mars.Interfaces.Environments;

namespace $PROJECT_NAME
{
    public class $CLASS_NAME : IAgent<$LAYER_CLASS_NAME>, IPositionable
    {

        public void Init($LAYER_CLASS_NAME layer)
        {
            // do you have anything to initialize?
        }

        public Position Position { get; set; }


        public void Tick()
        {
            // what does the agent do on each tick?
        }

        // identifies the agent
        public Guid ID { get; set; }
    }
}
