import {Channel} from "./Channel";

export interface SafeIpcRenderer {
    invoke<T>(channel: Channel, ...args: any[]): Promise<T>;
    send(channel: Channel, ...args: any[]): void;
    /** @return A function that removes this listener. */
    on<T>(channel: Channel, listener: (...args: any[]) => T): () => void;
}
