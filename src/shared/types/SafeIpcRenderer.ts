import { Channel } from "./Channel";

export interface SafeIpcRenderer {
  invoke<I, O>(channel: Channel | string, ...args: I[]): Promise<O>;
  send<I>(channel: Channel | string, ...args: I[]): void;
  /** @return A function that removes this listener. */
  on<T>(channel: Channel | string, listener: (arg: T) => void): () => void;
}
