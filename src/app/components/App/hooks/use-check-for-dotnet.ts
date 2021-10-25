import { Channel } from "@shared/types/Channel";
import useChannelSubscription from "../../../utils/hooks/use-channel-subscription";

function useCheckForDotNet() {
  const onDotnetNotFound = () => {
    window.api.logger.warn(".NET SDK not found.");
    // eslint-disable-next-line no-alert
    alert(
      `Installation of the .NET Core SDK was not found. Make sure to have it installed and available in your PATH variable. If you've just installed the SDK, try restarting your machine. This app will exit now.`
    );
    window.api.send(Channel.EXIT_APP);
  };
  useChannelSubscription(Channel.DOTNET_NOT_FOUND, onDotnetNotFound);
}

export default useCheckForDotNet;
