import { SafeIpcRenderer } from "./SafeIpcRenderer";
import { ILogger } from "@shared/types/Logger";

export {};

declare global {
  interface Window {
    api: SafeIpcRenderer & {
      logger: ILogger;
    };
  }
}
