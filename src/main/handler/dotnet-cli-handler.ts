import fs = require("fs-extra");
import { Channel } from "@shared/types/Channel";
import child_process from "child_process";
import IpcHandler from "./ipc-handler";

const MARS_LIFE_VERSION = " --version 4.*";

class DotnetCliHandler extends IpcHandler {
  protected registerHandler(): void {
    this.handle(Channel.CLEAN_PROJECT, (_, projectPath: string) =>
      this.handleProjectClean(projectPath)
    );
    this.on(Channel.INSTALL_MARS, (_, projectPath: string) =>
      this.handleMarsInstall(projectPath)
    );
    this.on(Channel.RESTORE_PROJECT, (_, projectPath: string) =>
      this.handleProjectRestore(projectPath)
    );
  }

  private handleMarsInstall = (projectPath: string) => {
    if (!fs.pathExistsSync(projectPath)) {
      throw new Error(
        `Error while installing the MARS-Framework: Path (${projectPath}) does not exist.`
      );
    }

    const installProcess = child_process.exec(
      `dotnet add package Mars.Life.Simulations${MARS_LIFE_VERSION}`,
      {
        cwd: projectPath,
      }
    );

    installProcess.on("message", (msg: MessageEvent) =>
      this.logger.info(msg.data)
    );

    installProcess.on("exit", (code) => {
      this.logger.info(`Installation exited with code ${code}.`);
      this.send(Channel.MARS_INSTALLED);
    });
  };

  private handleProjectRestore = (projectPath: string) => {
    if (!fs.pathExistsSync(projectPath)) {
      this.send(Channel.PROJECT_RESTORED, false);
      throw new Error(
        `Error while restoring the project: Path (${projectPath}) does not exist.`
      );
    }

    const installProcess = child_process.exec("dotnet restore", {
      cwd: projectPath,
    });

    installProcess.on("message", (msg: MessageEvent) =>
      this.logger.info(msg.data)
    );
    installProcess.on("error", (msg: Error) => this.logger.error(msg));

    installProcess.on("exit", (code) => {
      this.logger.info(`[RESTORE_PROJECT] Exited with code ${code}.`);
      this.send(Channel.PROJECT_RESTORED, code === 0);
    });
  };

  private handleProjectClean = (projectPath: string) => {
    this.logger.warn("Starting to clean ", projectPath);
    child_process.execSync(`dotnet clean`, {
      cwd: projectPath,
    });
    this.logger.warn("Cleaning successful.");
  };
}

export default new DotnetCliHandler();
