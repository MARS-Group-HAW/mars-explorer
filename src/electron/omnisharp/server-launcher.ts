import { spawn } from "child_process";
import { BrowserWindow } from "electron";
import kill from "tree-kill";
import getOmnisharpRunOptions from "./server-config";
import mainLogger from "../main-logger";
import LspWriter from "./lsp-writer";
import LspReader from "./lsp-reader";

function launchLanguageServer(
  mainWindow: BrowserWindow,
  projectPath: string
): { lspChannel: string; killServer: () => void } {
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

  const killServer = () => {
    reader.dispose();
    writer.dispose();
    kill(lsProcess.pid);
  };

  mainLogger.info("Server spawned successfully!");

  return {
    lspChannel: ipcChannel,
    killServer,
  };
}

export default launchLanguageServer;
