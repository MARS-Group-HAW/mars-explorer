import { startServer } from "./server";
import { enforceMacOSAppLocation, is, isFirstAppLaunch } from "electron-util";
import * as path from "path";
import { ipcMain, IpcMainInvokeEvent } from "electron";
import { Channel } from "../shared/types/Channel";

const { app, BrowserWindow } = require("electron");
const squirrel = require("electron-squirrel-startup");
const fs = require("fs-extra");
const log4js = require("log4js");

export const PATHS = {
  workspace: path.join(app.getPath("documents"), "mars-explorer"),
  resources: is.development
    ? path.join(__dirname, "..", "..", "resources")
    : process.resourcesPath,
};

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrel) {
  // eslint-disable-line global-require
  app.quit();
}

function setupApp() {
  if (isFirstAppLaunch()) {
    console.info("First Time running. Ensuring directories ...");
    fs.ensureDirSync(PATHS.workspace);
  }
}

function createWindow() {
  // send port to renderer
  startServer();

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.whenReady().then(() => {
  enforceMacOSAppLocation();
  setupApp();
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  log4js.shutdown();

  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle(Channel.GET_WORKSPACE_PATH, () => PATHS.workspace);

ipcMain.handle(
  Channel.READ_FILE,
  (ev: IpcMainInvokeEvent, path: string): string => {
    return fs.readFileSync(path, "utf-8");
  }
);
