import { app, BrowserWindow, Menu } from "electron";
import { enforceMacOSAppLocation, is } from "electron-util";
import fixPath from "fix-path";
import fs = require("fs-extra");
import squirrel = require("electron-squirrel-startup");
import appPaths from "./app-paths";
import log from "./main-logger";
import menuItems from "./menu";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

fixPath();

if (squirrel) {
  log.info("Quitting because of squirrel");
  // eslint-disable-line global-require
  app.quit();
}

class Main {
  window!: BrowserWindow;

  constructor() {
    this.ensureDirs();
    app.on("ready", this.onReady);
    app.on("before-quit", this.onBeforeQuit);
    app.on("window-all-closed", this.onWindowAllClosed);
    app.on("activate", this.onActivate);
  }

  onReady = () => {
    enforceMacOSAppLocation();
    this.createMenu();
    this.window = this.createWindow();
    this.registerWebContentsListener();
  };

  registerWebContentsListener() {
    this.window.webContents.on(
      "did-frame-finish-load",
      this.onDidFrameFinishLoad
    );
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
      webPreferences: {
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

  createMenu = () => {
    const menu = Menu.getApplicationMenu();
    menuItems.forEach((menuItem) => menu.append(menuItem));
    Menu.setApplicationMenu(menu);
  };

  ensureDirs = () => {
    fs.ensureDirSync(appPaths.workspaceDir);
  };

  onDidFrameFinishLoad = () => {
    if (is.development) {
      this.window.webContents.openDevTools();
    }
  };

  onBeforeQuit = () => {
    log.info("Quitting app");
  };

  onWindowAllClosed = () => {
    if (process.platform !== "darwin") app.quit();
  };
}

const main = new Main();

export default main;
