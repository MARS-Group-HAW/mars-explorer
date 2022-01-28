import { app, BrowserWindow, Event, ipcMain, Menu } from "electron";
import { enforceMacOSAppLocation, is } from "electron-util";
import fixPath from "fix-path";
import { Channel } from "@shared/types/Channel";
import fs = require("fs-extra");
import squirrel = require("electron-squirrel-startup");
import appPaths from "./app-paths";
import log from "./main-logger";
import menuItems from "./menu";

// will be assigned by electron-forge
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// to fix MacOS Path, see https://www.npmjs.com/package/fix-path
fixPath();

// will be used when installing on windows for the first time
if (squirrel) {
  log.info("Quitting because of squirrel");
  app.quit();
}

/**
 * Manages the browser windows (a.k.a. `/app`)
 */
class Main {
  window!: BrowserWindow;

  constructor() {
    this.ensureDirs();
    app.on("ready", this.onReady);
    app.on("window-all-closed", this.onWindowAllClosed);
    app.on("activate", this.onActivate);
  }

  onReady = () => {
    enforceMacOSAppLocation();
    if (!is.macos || app.isInApplicationsFolder() || is.development) {
      this.createMenu();
      this.window = this.createWindow();
      this.registerWebContentsListener();
    }
  };

  registerWebContentsListener() {
    this.window.webContents.on(
      "did-frame-finish-load",
      this.onDidFrameFinishLoad
    );
    this.window.on("close", this.onWindowClose);
  }

  onActivate = () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      this.window = this.createWindow();
  };

  createWindow = () => {
    // Create the browser window.
    const window = new BrowserWindow({
      width: 1300,
      height: 900,
      minWidth: 1000,
      minHeight: 700,
      icon: appPaths.iconFile,
      webPreferences: {
        // security reasons
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    });

    // and load the index.html of the app.
    window
      .loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
      .catch((e: Error) => log.error("main window could not be loaded: ", e));

    return window;
  };

  // append custom menu entries to app menu
  createMenu = () => {
    const menu = Menu.getApplicationMenu();
    menuItems.forEach((menuItem) => menu.append(menuItem));
    Menu.setApplicationMenu(menu);
  };

  /*
   * Checks weather the necessary directories exists in the users document folder.
   * If not, it will create them.
   */
  ensureDirs = () => {
    fs.ensureDirSync(appPaths.workspaceDir);
  };

  onDidFrameFinishLoad = () => {
    if (is.development) {
      this.window.webContents.openDevTools();
    }
  };

  /**
   * Is called whenever the user closes the application window.
   * A shutdown request (`Channel.SERVER_SHUTDOWN`) will be send to the app-process which should notify the language-server to shutdown.
   * If the shutdown of the language-server was successful, the app sends a message to this process (`Channel.SERVER_SHUTDOWN`) and the app will quit.
   * If the app does not response in time, the app will be forced to quit.
   * @param e The close event which will be prevented in order to wait for the language-server shutdown.
   */
  onWindowClose = (e: Event) => {
    e.preventDefault();

    try {
      this.window.webContents.send(Channel.SHUTDOWN);
    } catch (err: any) {
      log.warn("Could not send shutdown request: ", err);
    }

    ipcMain.on(Channel.SERVER_SHUTDOWN, () => {
      log.info("Server was shutdown.");
      this.window.destroy();
      app.quit();
    });
    setTimeout(() => {
      log.warn(
        "Server did not respond to the Shutdown-Request in time. Exiting."
      );
      this.window.destroy();
      app.quit();
    }, 5000);
  };

  onWindowAllClosed = () => {
    if (process.platform !== "darwin") app.quit();
  };
}

const main = new Main();

export default main;
