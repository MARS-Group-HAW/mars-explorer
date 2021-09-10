import { enforceMacOSAppLocation, is } from "electron-util";
import * as path from "path";
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import { Channel } from "@shared/types/Channel";
import { ExampleProject } from "@shared/types/ExampleProject";
import { Project } from "@shared/types/Project";
import { Logger } from "./logger";
import { launchLanguageServer } from "./server-launcher";
import fixPath from "fix-path";
import { ModelsJson } from "./types/ModelsJson";
import { ModelRef, WorkingModel } from "@shared/types/Model";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";
import FileRef from "./types/FileRef";
import ModelFile from "./types/ModelFile";
import * as child_process from "child_process";
// @ts-ignore - no types available
import squirrel = require("electron-squirrel-startup");
import fs = require("fs-extra");

const log = new Logger("main");

const EXAMPLES_DIR_NAME = "examples";
const USER_DOCUMENTS_PATH = app.getPath("documents");
const RESOURCES_PATH = is.development
  ? path.join(__dirname, "..", "..", "resources")
  : process.resourcesPath;
const WORKSPACE_PATH = path.join(USER_DOCUMENTS_PATH, "mars-explorer");

export const PATHS = {
  workspace: WORKSPACE_PATH,
  workspaceExamples: path.join(WORKSPACE_PATH, EXAMPLES_DIR_NAME),
  modelsJson: path.resolve(RESOURCES_PATH, EXAMPLES_DIR_NAME, "models.json"),
  resources: RESOURCES_PATH,
};

// IMPORTANT: fixes $PATH variable for macos, see https://stackoverflow.com/questions/62067127/path-variables-empty-in-electron
fixPath();

log.log(process.env.PATH.split(":"));

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrel) {
  log.info("Quitting because of squirrel");
  // eslint-disable-line global-require
  app.quit();
}

function setupApp() {
  // FIXME: dont do on every startup
  log.info("Ensuring workspace dirs");
  fs.ensureDirSync(PATHS.workspaceExamples);
  log.info(`Copying Examples to ${PATHS.workspaceExamples}`);
  fs.copySync(path.join(PATHS.resources, "examples"), PATHS.workspaceExamples);
}

let mainWindow: BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    minWidth: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow
    .loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
    .catch((e: Error) => log.error("main window could not be loaded: ", e));

  Promise.all([
    installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: { allowFileAccess: true },
    }),
    installExtension(
      REDUX_DEVTOOLS,
      { loadExtensionOptions: { allowFileAccess: true } } //this is the key line
    ),
  ])
    .then((names) => console.log(`Added Extensions: ${names.join(", ")}`))
    .catch((err) => console.log("An error occurred: ", err));

  mainWindow.webContents.on("did-frame-finish-load", () =>
    mainWindow.webContents.openDevTools()
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app
  .whenReady()
  .then(() => {
    log.info("Configuration: ", PATHS);
    log.info("Enforcing Location");
    enforceMacOSAppLocation();
    log.info("Starting setup");
    setupApp();
    //log.info("Starting server");
    //webSocketPort = startServer();
    log.info("Creating window");
    createWindow();

    app.on("activate", function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((e: Error) => log.error("App could not be initialized: ", e));

app.on("before-quit", () => log.info("Quitting app"));

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle(Channel.GET_WORKSPACE_PATH, () => PATHS.workspace);

ipcMain.handle(Channel.GET_EXAMPLES_PATH, () => PATHS.workspaceExamples);

ipcMain.handle(Channel.GET_EXAMPLE_PROJECTS, (): ModelRef[] => {
  const modelsJson = fs.readJsonSync(PATHS.modelsJson) as ModelsJson;
  return modelsJson.map(({ name, path }) => ({
    name,
    path,
  }));
});

ipcMain.handle(Channel.GET_USER_PROJECTS, (): ModelRef[] => {
  const userProjects = fs
    .readdirSync(PATHS.workspace)
    .filter((file) => file !== EXAMPLES_DIR_NAME) // no example dir
    .filter((item) => !/(^|\/)\.[^/.]/g.test(item)) // remove hidden dirs
    .map((file) => path.join(PATHS.workspace, file)) // to full path
    .filter((file) => fs.lstatSync(file).isDirectory());

  return userProjects.map((file) => new FileRef(file));
});

ipcMain.handle(Channel.CHECK_LAST_PATH, (_, path: string): ModelRef | null => {
  if (fs.pathExistsSync(path)) {
    return new FileRef(path);
  } else {
    return null;
  }
});

ipcMain.handle(Channel.INSTALL_MARS, (_, path: string): void => {
  if (!fs.pathExistsSync(path)) {
    throw new Error(
      `Error while installing the MARS-Framework: Path (${path}) does not exist.`
    );
  }

  const result = child_process.execSync(
    "dotnet add package Mars.Life.Simulations --version 4.2.3",
    {
      cwd: path,
    }
  );

  log.info(result.toString());
  return;
});

const MODEL_FILE_EXTENSION = ".cs";

ipcMain.handle(
  Channel.GET_USER_PROJECT,
  (_, modelRef: ModelRef): WorkingModel => {
    return fs
      .readdirSync(modelRef.path)
      .filter(
        (file) => path.extname(file).toLowerCase() === MODEL_FILE_EXTENSION
      )
      .map((file) => path.resolve(modelRef.path, file))
      .map((file) => new ModelFile(file));
  }
);

ipcMain.handle(
  Channel.GET_CONFIG_IN_PROJECT,
  (_, rootPath: string): unknown | null => {
    const pathToDefaultConfig = path.resolve(rootPath, "config.json");

    console.log(rootPath, pathToDefaultConfig);

    if (fs.existsSync(pathToDefaultConfig)) {
      return fs.readJsonSync(pathToDefaultConfig);
    } else {
      return null;
    }
  }
);

ipcMain.handle(
  Channel.CREATE_DEFAULT_CONFIG,
  (_, { path, content }: { path: string; content: string }): void => {
    fs.writeJSONSync(path, content);
    return;
  }
);

/*
ipcMain.handle(Channel.OPEN_PROJECT, (_, modelRef: ModelRef): Model => {
  const modelDir = fs.readFileSync(modelRef.path, "utf-8");
  const modelsJson = JSON.parse(rawdata) as ModelsJson;
  return modelsJson.map(({ name, path }) => ({
    name,
    path,
  }));
});
 */

ipcMain.handle(
  Channel.GET_EXAMPLE_PROJECT,
  (_, project: ExampleProject): Project => {
    const root = path.join(PATHS.workspaceExamples, project);
    return {
      name: project,
      rootPath: root,
      entryFilePath: path.join(root, "Program.cs"),
    };
  }
);

ipcMain.handle(
  Channel.READ_FILE,
  (ev: IpcMainInvokeEvent, path: string): string => {
    return fs.readFileSync(path, "utf-8");
  }
);

let languageServerChannel: string;

ipcMain.handle(
  Channel.START_LANGUAGE_SERVER,
  (_, projectPath: string): string => {
    if (languageServerChannel) {
      log.info(`Reusing LSP running at ${languageServerChannel}`);
      return languageServerChannel;
    }
    return launchLanguageServer(mainWindow, projectPath);
  }
);
