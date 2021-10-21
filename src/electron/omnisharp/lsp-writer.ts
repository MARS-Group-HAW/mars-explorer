import { Message } from "vscode-jsonrpc";
import * as rpc from "@codingame/monaco-jsonrpc";
import {
  CodeActionParams,
  CodeActionRequest,
  CodeLensParams,
  CodeLensRequest,
  CodeLensResolveRequest,
  DidOpenTextDocumentNotification,
  DidOpenTextDocumentParams,
  FileChangeType,
  HoverRequest,
  InitializedNotification,
  InitializeParams,
  InitializeRequest,
  DidChangeWatchedFilesNotification,
  DidChangeWatchedFilesParams,
  ExitNotification,
} from "vscode-languageserver";
import { StreamMessageWriter } from "vscode-jsonrpc/lib/node/main";
import { Writable } from "stream";
import { ipcMain } from "electron";
import { ILogger } from "@shared/types/Logger";
import { Logger } from "../logger";
import mainLogger from "../main-logger";

enum Labels {
  MSG_TYPE = "MSG_TYPE",
  METHOD = "METHOD",
}

const lspClientLogger = new Logger("lsp-client", {
  newFile: true,
  printToConsole: false,
  labels: Object.values(Labels),
});

class LspWriter extends StreamMessageWriter {
  constructor(writable: Writable, private channel: string) {
    super(writable);
    ipcMain.on(channel, this.handleClientMessage);
  }

  private handleClientMessage = (event: unknown, clientMsg: Message) => {
    let logMethod: keyof ILogger = "log";
    let msgType: string = "/";
    let method: string = "/";
    let printMsg: string = "";

    if (rpc.isNotificationMessage(clientMsg)) {
      msgType = "notification";
      method = clientMsg.method;

      switch (clientMsg.method) {
        case DidOpenTextDocumentNotification.method: {
          printMsg = (clientMsg.params as DidOpenTextDocumentParams)
            .textDocument.uri;
          break;
        }
        case DidChangeWatchedFilesNotification.type.method: {
          printMsg = (clientMsg.params as DidChangeWatchedFilesParams).changes
            .map(
              ({ uri, type }) =>
                `${type === FileChangeType.Created ? "Add" : "Delete"}: ${uri}`
            )
            .join(" | ");
          break;
        }
        case ExitNotification.type.method: {
          mainLogger.info(`Exiting ${this.channel} by client notification.`);
          // eslint-disable-next-line no-param-reassign
          delete clientMsg.params;
          break;
        }
        case InitializedNotification.type.method:
          break;
        default: {
          printMsg = "Unknown Notification Message";
          logMethod = "warn";
        }
      }
    } else if (rpc.isRequestMessage(clientMsg)) {
      msgType = `request|${clientMsg.id}`;
      method = clientMsg.method;

      switch (clientMsg.method) {
        case InitializeRequest.type.method: {
          const initializeParams = clientMsg.params as InitializeParams;
          initializeParams.processId = process.pid;
          break;
        }
        case HoverRequest.method:
        case CodeLensRequest.method:
        case CodeActionRequest.method: {
          printMsg = (clientMsg.params as CodeActionParams | CodeLensParams)
            .textDocument.uri;
          break;
        }
        case CodeLensResolveRequest.method:
        case "$/cancelRequest":
          break;
        default: {
          printMsg = "Unknown Request Message";
          logMethod = "warn";
        }
      }
    } else if (rpc.isResponseMessage(clientMsg)) {
      msgType = `response|${clientMsg.id}`;
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

    lspClientLogger[logMethod](printMsg);

    super.write(clientMsg);
  };

  dispose = () => {
    super.dispose();
    ipcMain.removeAllListeners(this.channel);
  };
}

export default LspWriter;
