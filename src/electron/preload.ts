import { Channel } from "@shared/types/Channel";
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { Logger } from "./logger";

const PreloadLogger = new Logger("ipc", {
  newFile: true,
  printToConsole: false,
  labels: ["method", "channel"],
});

const LspClientLogger = new Logger("lsp-client", {
  newFile: true,
  printToConsole: false,
  labels: ["method"],
});

type Methods = "invoke" | "send" | "on";

type UnknownListener = (...param: unknown[]) => unknown;

const channelsAsArray = Object.keys(Channel);

const isLSPChannel = (channelName: string) => channelName.startsWith("LSP");

function callIpcRenderer(
  method: Methods,
  channel: Channel | string,
  ...args: unknown[]
) {
  if (
    typeof channel !== "string" ||
    (!channelsAsArray.includes(channel) && !isLSPChannel(channel))
  ) {
    PreloadLogger.warn(
      `Channel "${channel}" not a string or not part of the defined channels.`
    );
    throw "Error: IPC channel name not allowed";
  }

  if (!isLSPChannel(channel)) {
    PreloadLogger.labels = [
      {
        key: "method",
        value: method,
      },
      {
        key: "channel",
        value: channel,
      },
    ];
    PreloadLogger.info(args);
  } else {
    LspClientLogger.labels = [
      {
        key: "method",
        value: method,
      },
    ];
    LspClientLogger.info(args);
  }

  if (method === "invoke" || method === "send") {
    return ipcRenderer[method](channel, ...args);
  }
  if ("on" === method) {
    if (!args[0]) throw "Listener must be provided";

    const listener = args[0] as UnknownListener;

    // Wrap the given listener in a new function to avoid exposing
    // the `event` arg to our renderer.
    const wrappedListener = (_event: IpcRendererEvent, ...a: unknown[]) =>
      listener(...a);

    ipcRenderer.on(channel, wrappedListener);

    // The returned function must not return anything (and NOT
    // return the value from `removeListener()`) to avoid exposing ipcRenderer.
    return () => {
      ipcRenderer.removeListener(channel, wrappedListener);
    };
  }
}

contextBridge.exposeInMainWorld("api", {
  invoke: (channel: Channel | string, ...args: unknown[]) =>
    callIpcRenderer("invoke", channel, ...args),
  send: (channel: Channel | string, ...args: unknown[]) =>
    callIpcRenderer("send", channel, ...args),
  on: (channel: Channel | string, ...args: unknown[]) =>
    callIpcRenderer("on", channel, ...args),
  logger: new Logger("app"),
});
