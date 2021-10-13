using Mars.Components.Layers;

namespace $PROJECT_NAME
{
    // TODO: add "description.AddLayer<$CLASS_NAME>();" to your Program.cs
    public class $CLASS_NAME : AbstractLayer
    {
        // Do you want to execute custom logic, initialize Environments or spawn agents?
        public override bool InitLayer(TInitData layerInitData, RegisterAgent registerAgentHandle, UnregisterAgent unregisterAgentHandle)
        {
            // [IMPORTANT - DO NOT DELETE] do not delete this
            base.InitLayer(layerInitData, registerAgentHandle, unregisterAgentHandle);
            // Put your initialization logic here.
            return true;
        }
    }
}


