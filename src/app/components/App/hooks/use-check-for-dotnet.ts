import { Channel } from "@shared/types/Channel";
import useChannelSubscription from "../../../utils/hooks/use-channel-subscription";

function useCheckForDotNet() {
  const onDotnetNotFound = () => {
    window.api.logger.warn(".NET SDK not found.");
    // eslint-disable-next-line no-alert
    alert(
      `Installation of the .NET SDK was not found in your Path. Make sure to have it installed and available in your path. If you've just installed it, try restarting your machine.`
    );
  };

  useChannelSubscription(Channel.DOTNET_NOT_FOUND, onDotnetNotFound);
}

export default useCheckForDotNet;
