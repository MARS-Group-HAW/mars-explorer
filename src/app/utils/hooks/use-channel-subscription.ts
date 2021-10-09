import { useLifecycles } from "react-use";
import { Channel } from "@shared/types/Channel";

type UnsubscribeFunction = () => void;

function useChannelSubscription<ArgType>(
  channel: Channel,
  listener: (args: ArgType) => void
) {
  let unsubscribeFn: UnsubscribeFunction;

  useLifecycles(
    () => {
      unsubscribeFn = window.api.on(channel, listener as any);
    },
    () => unsubscribeFn()
  );
}

export default useChannelSubscription;
