import { useLifecycles } from "react-use";
import { Channel, ChannelOutputMap } from "@shared/types/Channel";

type UnsubscribeFunction = () => void;

function useChannelSubscription<Ch extends Channel>(
  channel: Ch,
  listener: (arg: ChannelOutputMap[Ch]) => void
) {
  let unsubscribeFn: UnsubscribeFunction;

  useLifecycles(
    () => {
      unsubscribeFn = window.api.on(channel, listener);
    },
    () => unsubscribeFn()
  );
}

export default useChannelSubscription;
