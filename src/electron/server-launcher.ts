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
  InitializeParams,
  InitializeRequest,
} from "vscode-languageserver";
import uri2path from "file-uri-to-path";
import fs = require("fs-extra");

const launcherLogger = new Logger("launcher");
const lspLogger = new Logger("lsp", { newFile: true, printToConsole: false });

let lastMessage: Message;

export function launchLanguageServer(mainWindow: BrowserWindow): string {
  const connectTo = getServer();
  launcherLogger.info("Spawning Server");

  // FIXME:   handle WINDOWS    process.platform.startsWith("win") ? ".cmd" : ""
  const lsProcess = spawn(connectTo.command, connectTo.args, connectTo.options);

  // choose a unique channel name, e.g. by using the PID
  const ipcChannel = `LSP_${lsProcess.pid}`;

  // create reader/writer for I/O streams
  const reader = new StreamMessageReader(lsProcess.stdout);
  const writer = new StreamMessageWriter(lsProcess.stdin);

  // forward everything from process's stdout to the mainWindow's renderer process
  reader.listen((msg) => {
    lspLogger.scope = "LSP => Client";

    // FIXME Prevent duplication
    if (JSON.stringify(lastMessage) === JSON.stringify(msg)) {
      lspLogger.warn("DUPLICATION OF ABOVE");
      return;
    } else {
      lastMessage = msg;
    }

    if (rpc.isNotificationMessage(msg) && msg.method.includes("error")) {
      lspLogger.error(msg);
    } else {
      lspLogger.debug(msg);
    }

    mainWindow.webContents.send(ipcChannel, msg);
  });

  // listen to incoming messages and forward them to the language server process
  ipcMain.on(ipcChannel, (event: any, message: Message) => {
    lspLogger.scope = "Client => LSP";
    lspLogger.debug(message);

    if (rpc.isRequestMessage(message)) {
      if (message.method === InitializeRequest.type.method) {
        const initializeParams = message.params as InitializeParams;
        initializeParams.processId = process.pid;
      }
    }

    if (rpc.isNotificationMessage(message)) {
      switch (message.method) {
        case DidOpenTextDocumentNotification.type.method: {
          const didOpenParams = message.params as DidOpenTextDocumentParams;
          const uri = didOpenParams.textDocument.uri;
          const text = didOpenParams.textDocument.text;
          const uriAsPath = uri2path(uri);

          if (uri) fs.writeFileSync(uriAsPath, text);
          break;
        }
      }
    }

    void writer.write(message);
    return;
  });

  return ipcChannel;
}
