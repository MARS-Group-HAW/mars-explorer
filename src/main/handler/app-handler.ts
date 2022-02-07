import { Channel } from "@shared/types/Channel";
import { app } from "electron";
import IpcHandler from "./ipc-handler";

class AppHandler extends IpcHandler {
  protected registerHandler(): void {
    this.on(Channel.EXIT_APP, () => this.handleAppExit());
    this.on(Channel.RESTART_APP, () => this.handleAppRestart());
  }

  private handleAppRestart = () => {
    this.logger.warn("Restart requested by user.");
    app.relaunch();
    app.exit();
  };

  private handleAppExit = () => {
    this.logger.warn("Exit requested by window.");
    app.exit();
  };
}

export default new AppHandler();
