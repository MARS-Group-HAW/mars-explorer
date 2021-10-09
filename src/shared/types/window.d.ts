import { ILogger } from "@shared/types/Logger";
import { SafeIpcRenderer } from "./safe-ipc-renderer";

export {};

declare global {
  interface Window {
    api: SafeIpcRenderer & {
      logger: ILogger;
    };
  }
}
