import { Channel } from "./Channel";

export interface SafeIpcRenderer {
  invoke<I, O>(channel: Channel, ...args: I[]): Promise<O>;
  send(channel: Channel, ...args: any[]): void;
  /** @return A function that removes this listener. */
  on<T>(channel: Channel, listener: (...args: any[]) => T): () => void;
}
