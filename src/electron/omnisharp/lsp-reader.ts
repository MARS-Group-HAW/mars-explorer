import { Message, NotificationMessage } from "vscode-jsonrpc";
import * as rpc from "@codingame/monaco-jsonrpc";
import { StreamMessageReader } from "vscode-jsonrpc/lib/node/main";
import { Readable } from "stream";
import { Channel } from "@shared/types/Channel";
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

  private handleServerMessage = (msg: Message) => {
    let msgType: string = "/";
    let method: string = "/";

    // FIXME Prevent duplication
    if (JSON.stringify(this.lastMessage) === JSON.stringify(msg)) {
      lspServerLogger.log("DUPLICATION OF ABOVE");
      return;
    }

    if (rpc.isNotificationMessage(msg)) {
      msgType = "notification";
      method = this.handleNotificationMessage(msg);
    } else {
      msgType = "/";
      method = "/";
    }

    this.lastMessage = msg;
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

    lspServerLogger.log(msg);
    main.window.webContents.send(this.channel, msg);
  };

  private handleNotificationMessage = (msg: NotificationMessage): string => {
    // eslint-disable-next-line default-case
    switch (msg.method) {
      case OmnisharpNotification.PROJECT_ADDED: {
        mainLogger.info("Project initialized.");
        SafeIpcMain.send(Channel.PROJECT_INITIALIZED);
        break;
      }
      case OmnisharpNotification.ERROR:
        if (
          (msg.params as OmnisharpErrorNotificationParams).Text.startsWith(
            OmnisharpErrorMessage.DOTNET_NOT_FOUND
          )
        ) {
          mainLogger.error("Dotnet not found.");
          SafeIpcMain.send(Channel.DOTNET_NOT_FOUND);
        }
        break;
    }

    return msg.method;
  };

  dispose = () => {
    this.reader.dispose();
  };
}

export default LspReader;
