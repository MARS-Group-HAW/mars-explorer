import { SafeIpcRenderer } from "./SafeIpcRenderer";

export {};

declare global {
  interface Window {
    api: SafeIpcRenderer;
  }
}
