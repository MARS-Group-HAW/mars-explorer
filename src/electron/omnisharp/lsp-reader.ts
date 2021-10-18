import { Message } from "vscode-jsonrpc";
import * as rpc from "@codingame/monaco-jsonrpc";
import { StreamMessageReader } from "vscode-jsonrpc/lib/node/main";
import { Readable } from "stream";
import { Channel } from "@shared/types/Channel";
import {
  InitializeRequest,
  LogMessageNotification,
  PublishDiagnosticsNotification,
  RegistrationRequest,
  ShowMessageNotification,
  ShowMessageParams,
} from "vscode-languageserver";
import { ILogger } from "@shared/types/Logger";
import { LogMessageParams } from "@codingame/monaco-languageclient";
import { Logger } from "../logger";
import {
  OmnisharpErrorMessage,
  OmnisharpErrorNotificationParams,
  OmnisharpNotification,
} from "./omnisharp";
import mainLogger from "../main-logger";
import SafeIpcMain from "../safe-ipc-main";
import main from "../main";

enum Labels {
  MSG_TYPE = "MSG_TYPE",
  METHOD = "METHOD",
}

const lspServerLogger = new Logger("lsp-server", {
  newFile: true,
  printToConsole: false,
  labels: Object.values(Labels),
});

class LspReader {
  private reader: StreamMessageReader;

  private lastMessage: Message;

  constructor(readable: Readable, private channel: string) {
    this.reader = new StreamMessageReader(readable);
    this.reader.listen(this.handleServerMessage);
  }

  private handleServerMessage = (lspMessage: Message) => {
    let logMethod: keyof ILogger = "log";
    let msgType: string = "/";
    let method: string = "/";
    let printMsg: string = "";

    // FIXME Prevent duplication
    if (JSON.stringify(this.lastMessage) === JSON.stringify(lspMessage)) {
      return;
    }

    if (rpc.isNotificationMessage(lspMessage)) {
      msgType = "notification";
      method = lspMessage.method;

      switch (lspMessage.method) {
        case PublishDiagnosticsNotification.type.method:
          printMsg = "<too long>";
          break;
        case LogMessageNotification.type.method:
        case ShowMessageNotification.type.method: {
          const params = lspMessage.params as
            | ShowMessageParams
            | LogMessageParams;
          printMsg = `${params.message} (T${params.type})`;
          break;
        }
        case OmnisharpNotification.ERROR:
          if (
            (
              lspMessage.params as OmnisharpErrorNotificationParams
            ).Text.startsWith(OmnisharpErrorMessage.DOTNET_NOT_FOUND)
          ) {
            mainLogger.error("Dotnet not found.");
            SafeIpcMain.send(Channel.DOTNET_NOT_FOUND);
          }
          logMethod = "error";
          break;
        case OmnisharpNotification.PROJECT_ADDED:
        case OmnisharpNotification.PROJECT_CHANGED:
        case OmnisharpNotification.PROJECT_CONFIGURATION:
        case OmnisharpNotification.PROJECT_DIAGNOSTIC_STATUS:
        case OmnisharpNotification.MS_BUILD_PROJECT_DIAGNOSTICS:
          break;
        default: {
          printMsg = "Unknown Notification Type";
          logMethod = "warn";
        }
      }
    } else if (rpc.isResponseMessage(lspMessage)) {
      msgType = "response";
    } else if (rpc.isRequestMessage(lspMessage)) {
      msgType = "request";
      method = lspMessage.method;

      switch (lspMessage.method) {
        case InitializeRequest.type.method:
        case RegistrationRequest.type.method:
          break;
        default: {
          printMsg = "Unknown Request Method";
          logMethod = "warn";
        }
      }
    }

    this.lastMessage = lspMessage;
    lspServerLogger.labels = [
      {
        key: Labels.MSG_TYPE,
        value: msgType,
      },
      {
        key: Labels.METHOD,
        value: method,
      },
    ];

    lspServerLogger[logMethod](printMsg);
    main.window.webContents.send(this.channel, lspMessage);
  };

  dispose = () => {
    this.reader.dispose();
  };
}

export default LspReader;
