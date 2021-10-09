import { Channel, ChannelInputMap, ChannelOutputMap } from "./Channel";

export interface SafeIpcRenderer {
  invoke<Ch extends Channel>(
    channel: Ch | string,
    args?: ChannelInputMap[Ch]
  ): Promise<ChannelOutputMap[Ch]>;

  send<Ch extends Channel>(
    channel: Ch | string,
    args?: ChannelInputMap[Ch]
  ): void;

  on<Ch extends Channel>(
    channel: Ch | string,
    listener: (arg: ChannelOutputMap[Ch]) => void
  ): () => void;
}
