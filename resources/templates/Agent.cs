using System;
using Mars.Interfaces.Agents;
using Mars.Interfaces.Environments;
using SheepWolfStarter.Model;

namespace $PROJECT_NAME
{
    public class $CLASS_NAME : IAgent<$LAYER_CLASS_NAME>, IPositionable
    {

        public void Init($LAYER_CLASS_NAME layer)
        {

        }

        public Position Position { get; set; }


        public void Tick()
        {

        }

        public Guid ID { get; set; }
    }
}
