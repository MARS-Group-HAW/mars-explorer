import { Message } from "vscode-jsonrpc";
import * as rpc from "@codingame/monaco-jsonrpc";
import { InitializeParams, InitializeRequest } from "vscode-languageserver";
import { StreamMessageWriter } from "vscode-jsonrpc/lib/node/main";
import { Writable } from "stream";
import { ipcMain } from "electron";
import { Logger } from "../logger";

enum Labels {
  MSG_TYPE = "MSG_TYPE",
  METHOD = "METHOD",
}

const lspClientLogger = new Logger("lsp-client", {
  newFile: true,
  printToConsole: false,
  labels: Object.values(Labels),
});

class LspWriter {
  private writer: StreamMessageWriter;

  constructor(writable: Writable, private channel: string) {
    this.writer = new StreamMessageWriter(writable);
    ipcMain.on(channel, this.handleClientMessage);
  }

  private handleClientMessage = (event: unknown, message: Message) => {
    let msgType: string = "/";
    let method: string = "/";

    if (rpc.isNotificationMessage(message)) {
      msgType = "notification";
      method = message.method;
    } else if (rpc.isRequestMessage(message)) {
      msgType = "request";
      method = message.method;

      if (message.method === InitializeRequest.type.method) {
        const initializeParams = message.params as InitializeParams;
        initializeParams.processId = process.pid;
      }
    } else if (rpc.isResponseMessage(message)) {
      msgType = "response";
    } else {
      msgType = "?";
    }

    lspClientLogger.labels = [
      {
        key: Labels.MSG_TYPE,
        value: msgType,
      },
      {
        key: Labels.METHOD,
        value: method,
      },
    ];

    lspClientLogger.log(message);

    this.writer.write(message);
  };

  dispose = () => {
    this.writer.dispose();
    ipcMain.removeAllListeners(this.channel);
  };
}

export default LspWriter;
