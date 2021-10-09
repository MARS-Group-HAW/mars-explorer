import { spawn } from "child_process";
import { Message } from "vscode-jsonrpc";
import {
  StreamMessageReader,
  StreamMessageWriter,
} from "vscode-jsonrpc/lib/node/main";
import * as rpc from "@codingame/monaco-jsonrpc";
import {
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
import { Channel } from "@shared/types/Channel";
import { BrowserWindow, ipcMain } from "electron";
import {
  OmnisharpErrorMessage,
  OmnisharpErrorNotificationParams,
  OmnisharpNotification,
} from "./Omnisharp";
import { Logger } from "../logger";
import { getServer } from "./server-config";
import SafeIpcMain from "../safe-ipc-main";

type Test = {
  msgType: string;
  method: string;
  classpath: string;
};

const Labels: (keyof Test)[] = ["msgType", "method", "classpath"];

const launcherLogger = new Logger("launcher");
const lspLogger = new Logger("lsp-server", {
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
    value: labels.msgType || "/",
  });

  x.push({
    key: "method",
    value: labels.method || "/",
  });

  x.push({
    key: "classpath",
    value: labels.classpath || "/",
  });

  lspLogger.labels = x;
}

export function launchLanguageServer(
  mainWindow: BrowserWindow,
  projectPath: string
): { lspChannel: string; killServer: () => void } {
  const connectTo = getServer(projectPath);
  launcherLogger.info("Spawning Server");
  launcherLogger.info("Project Path: ", projectPath);

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
    }
    lastMessage = msg;

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
        case OmnisharpNotification.PROJECT_ADDED: {
          launcherLogger.info("Project initialized.");
          SafeIpcMain.send(Channel.PROJECT_INITIALIZED);
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
        case OmnisharpNotification.ERROR:
          handleOmnisharpErrorNotification(
            msg.params as OmnisharpErrorNotificationParams
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

  const ipcChannelHandler = (event: unknown, message: Message) => {
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
        /*
        case DidOpenTextDocumentNotification.type.method: {
          const didOpenParams = message.params as DidOpenTextDocumentParams;
          const { uri, text } = didOpenParams.textDocument;
          const uriAsPath = fileURLToPath(uri);

          if (uri) fs.writeFileSync(uriAsPath, text);
          break;
        }
         */
        default:
          lspLogger.warn(
            `Handle for notification method "${message.method}" not found.`
          );
      }
    } else {
      // FIXME LOG BY METHOD
      setLabels({
        msgType: "?",
        method: "?",
      });
      lspLogger.log(message);
    }

    writer.write(message);
  };

  // listen to incoming messages and forward them to the language server process
  ipcMain.on(ipcChannel, ipcChannelHandler);

  const killServer = () => {
    reader.dispose();
    writer.dispose();
    lsProcess.kill("SIGINT");
    ipcMain.removeListener(ipcChannel, ipcChannelHandler);
  };

  launcherLogger.info("Server spawned successfully!");
  return {
    lspChannel: ipcChannel,
    killServer,
  };
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
  params: OmnisharpErrorNotificationParams
) {
  lspLogger.error(params.Text);

  if (params.Text.startsWith(OmnisharpErrorMessage.DOTNET_NOT_FOUND)) {
    SafeIpcMain.send(Channel.DOTNET_NOT_FOUND);
  }
}
