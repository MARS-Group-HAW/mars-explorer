import { spawn } from "child_process";
import { BrowserWindow, ipcMain } from "electron";
import { Message } from "vscode-jsonrpc";
import {
  StreamMessageReader,
  StreamMessageWriter,
} from "vscode-jsonrpc/lib/node/main";
import { getServer } from "./server-config";
import { Logger } from "./logger";
import * as rpc from "@codingame/monaco-jsonrpc";
import {
  DidOpenTextDocumentNotification,
  DidOpenTextDocumentParams,
  InitializedNotification,
  InitializeParams,
  InitializeRequest,
  LogMessageNotification,
  LogMessageParams,
  MessageType,
  ShowMessageNotification,
  ShowMessageParams,
} from "vscode-languageserver";
import { LoggerLabel } from "@shared/types/Logger";
import { fileURLToPath } from "url";
import {
  OmnisharpErrorMessage,
  OmnisharpErrorNotification,
  OmnisharpErrorNotificationParams,
} from "./Omnisharp";
import { Channel } from "@shared/types/Channel";
import fs = require("fs-extra");

type Test = {
  msgType: string;
  method: string;
  classpath: string;
};

const Labels: (keyof Test)[] = ["msgType", "method", "classpath"];

const launcherLogger = new Logger("launcher");
const lspLogger = new Logger("lsp", {
  newFile: true,
  printToConsole: false,
  labels: Labels,
});

let lastMessage: Message;

function setLabel(key: keyof Test, value: string) {
  lspLogger.label = {
    key,
    value,
  };
}

function setLabels(labels: Partial<Test>) {
  const x: LoggerLabel[] = [];

  x.push({
    key: "msgType",
    value: labels["msgType"] || "/",
  });

  x.push({
    key: "method",
    value: labels["method"] || "/",
  });

  x.push({
    key: "classpath",
    value: labels["classpath"] || "/",
  });

  lspLogger.labels = x;
}

export function launchLanguageServer(mainWindow: BrowserWindow): string {
  const connectTo = getServer();
  launcherLogger.info("Spawning Server");
  launcherLogger.info(connectTo);

  const lsProcess = spawn(connectTo.command, connectTo.args, connectTo.options);

  // choose a unique channel name, e.g. by using the PID
  const ipcChannel = `LSP_${lsProcess.pid}`;

  launcherLogger.info(`IPC_Channel: ${ipcChannel}`);

  // create reader/writer for I/O streams
  const reader = new StreamMessageReader(lsProcess.stdout);
  const writer = new StreamMessageWriter(lsProcess.stdin);

  // forward everything from process's stdout to the mainWindow's renderer process
  reader.listen((msg) => {
    lspLogger.scope = "LSP => Client";

    // FIXME Prevent duplication
    if (JSON.stringify(lastMessage) === JSON.stringify(msg)) {
      setLabels({});
      lspLogger.log("DUPLICATION OF ABOVE");
      return;
    } else {
      lastMessage = msg;
    }

    if (rpc.isNotificationMessage(msg)) {
      setLabels({
        msgType: "notification",
        method: msg.method,
      });

      switch (msg.method) {
        case InitializedNotification.type.method: {
          lspLogger.info(msg.params);
          break;
        }
        // TODO: show in GUI by LSP Standard
        case ShowMessageNotification.type.method: {
          handleShowMessageNotification(msg.params as ShowMessageParams);
          break;
        }
        case LogMessageNotification.type.method: {
          handleLogMessageNotification(msg.params as LogMessageParams);
          break;
        }
        case OmnisharpErrorNotification:
          handleOmnisharpErrorNotification(
            msg.params as OmnisharpErrorNotificationParams,
            mainWindow
          );
          break;
        default:
          lspLogger.log(msg.params);
      }
    } else {
      setLabels({
        msgType: "?",
        method: "?",
      });
      lspLogger.log(msg);
    }

    mainWindow.webContents.send(ipcChannel, msg);
  });

  // listen to incoming messages and forward them to the language server process
  ipcMain.on(ipcChannel, (event: unknown, message: Message) => {
    lspLogger.scope = "Client => LSP";

    if (rpc.isRequestMessage(message)) {
      setLabels({
        msgType: "request",
        method: message.method,
      });

      if (message.method === InitializeRequest.type.method) {
        const initializeParams = message.params as InitializeParams;
        initializeParams.processId = process.pid;
      }
    } else if (rpc.isNotificationMessage(message)) {
      setLabels({
        msgType: "notification",
        method: message.method,
      });
      switch (message.method) {
        case DidOpenTextDocumentNotification.type.method: {
          const didOpenParams = message.params as DidOpenTextDocumentParams;
          const uri = didOpenParams.textDocument.uri;
          const text = didOpenParams.textDocument.text;
          const uriAsPath = fileURLToPath(uri);

          if (uri) fs.writeFileSync(uriAsPath, text);
          break;
        }
      }
    } else {
      // FIXME LOG BY METHOD
      setLabels({
        msgType: "?",
        method: "?",
      });
      lspLogger.log(message);
    }

    void writer.write(message);
    return;
  });

  launcherLogger.info("Server spawned successfully!");
  return ipcChannel;
}

function logMessageByType(params: { type: MessageType; message: string }) {
  let msg = params.message;

  const splitMessage = msg.split(":");

  if (splitMessage[0]) {
    setLabel("classpath", splitMessage.shift());
    msg = splitMessage.join(":");
  }

  switch (params.type) {
    case MessageType.Log:
      lspLogger.log(msg);
      break;
    case MessageType.Info:
      lspLogger.info(msg);
      break;
    case MessageType.Warning:
      lspLogger.warn(msg);
      break;
    case MessageType.Error:
      lspLogger.error(msg);
      break;
  }
}

function handleLogMessageNotification(params: LogMessageParams) {
  logMessageByType(params);
}

function handleShowMessageNotification(params: ShowMessageParams) {
  logMessageByType(params);
}

function handleOmnisharpErrorNotification(
  params: OmnisharpErrorNotificationParams,
  mainWindow: Electron.BrowserWindow
) {
  lspLogger.error(params.Text);

  if (params.Text.startsWith(OmnisharpErrorMessage.DOTNET_NOT_FOUND)) {
    mainWindow.webContents.send(Channel.DOTNET_NOT_FOUND);
  }
}
