import { spawn } from "child_process";
import { BrowserWindow } from "electron";
import getOmnisharpRunOptions from "./server-config";
import mainLogger from "../main-logger";
import LspWriter from "./lsp-writer";
import LspReader from "./lsp-reader";

function launchLanguageServer(
  mainWindow: BrowserWindow,
  projectPath: string
): string {
  const connectTo = getOmnisharpRunOptions(projectPath);
  mainLogger.info("Spawning Server");
  mainLogger.info("Project Path: ", projectPath);

  const lsProcess = spawn(connectTo.command, connectTo.args, connectTo.options);

  // choose a unique channel name, e.g. by using the PID
  const ipcChannel = `LSP_${lsProcess.pid}`;

  mainLogger.info(`IPC_Channel: ${ipcChannel}`);

  // create reader/writer for I/O streams
  const reader = new LspReader(lsProcess.stdout, ipcChannel);
  const writer = new LspWriter(lsProcess.stdin, ipcChannel);

  lsProcess.on("exit", (code) => {
    mainLogger.info(`LSP Process (${ipcChannel}) has exited (${code})`);
    reader.dispose();
    writer.dispose();
  });

  mainLogger.info("Server spawned successfully!");

  return ipcChannel;
}

export default launchLanguageServer;
