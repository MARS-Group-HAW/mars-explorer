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
} from "electron-devtools-installer";
import FileRef from "./types/FileRef";
import ModelFile from "./types/ModelFile";
import * as child_process from "child_process";
import { SimulationStates } from "@shared/types/SimulationStates";
import { handleSimulationProgress } from "./handle-simulation-progress";
import { IFileRef } from "@shared/types/File";
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
  templates: path.resolve(RESOURCES_PATH, "templates"),
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
    minHeight: 700,
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
    /* disable because of errors
    installExtension(
      REDUX_DEVTOOLS,
      { loadExtensionOptions: { allowFileAccess: true } } //this is the key line
    ),
     */
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
    .filter((file) => fs.lstatSync(file).isDirectory())
    .map((file) => ({
      file,
      time: fs.statSync(file).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)
    .map((file) => file.file);

  return userProjects.map((file) => new FileRef(file));
});

ipcMain.handle(Channel.CHECK_LAST_PATH, (_, path: string): ModelRef | null => {
  if (fs.pathExistsSync(path)) {
    return new FileRef(path);
  } else {
    return null;
  }
});

async function deleteDir(path: string): Promise<boolean> {
  try {
    await fs.remove(path);
    log.info("Deleted project: ", path);
    return true;
  } catch (e: unknown) {
    log.error("Could not delete project", path, e);
    return false;
  }
}

ipcMain.handle(
  Channel.DELETE_PROJECT,
  async (_, path: string): Promise<boolean> => deleteDir(path)
);

async function replaceWithName(dir: string, name: string) {
  const filePath = path.resolve(PATHS.templates, "Program.cs");
  const content = await fs.readFile(filePath, "utf8");
  const result = content.replace(/\$NAME/g, name);

  const programmcsInProj = path.resolve(dir, "Program.cs");

  await fs.writeFile(programmcsInProj, result, "utf8");
}

ipcMain.on(Channel.CREATE_PROJECT, (_, name: string) => {
  const args = [];
  args.push('--language "C#"');
  args.push("--framework netcoreapp3.1");
  args.push(`--name ${name}`);

  log.info(
    `Started "dotnet new" with the following arguments: ${args.toString()}`
  );

  const installProcess = child_process.exec(
    `dotnet new console ${args.join(" ")}`,
    {
      cwd: WORKSPACE_PATH,
    }
  );

  installProcess.on("message", (msg: MessageEvent) => log.info(msg.data));

  installProcess.on("error", (msg: MessageEvent) => log.error(msg.data));

  const sendSuccessMsg = () =>
    mainWindow.webContents.send(Channel.PROJECT_CREATED, true);
  const sendErrorMsg = () =>
    mainWindow.webContents.send(Channel.PROJECT_CREATED, false);

  installProcess.on("exit", (code) => {
    log.info(`"dotnet new" exited with code ${code}.`);

    if (code === 0) {
      const newDirPath = path.resolve(WORKSPACE_PATH, name);
      replaceWithName(newDirPath, name)
        .then(sendSuccessMsg)
        .catch((e: unknown) => {
          log.error("Error while replacing contents in new project: ", e);
          deleteDir(newDirPath)
            .then(sendErrorMsg)
            .catch((e) =>
              log.error("Error cleaning up after replacing failure: ", e)
            );
        });
    } else {
      sendErrorMsg();
    }
  });
});

ipcMain.on(Channel.INSTALL_MARS, (_, path: string) => {
  if (!fs.pathExistsSync(path)) {
    throw new Error(
      `Error while installing the MARS-Framework: Path (${path}) does not exist.`
    );
  }

  const versionFlag = " --version 4.3.0";

  const installProcess = child_process.exec(
    `dotnet add package Mars.Life.Simulations${versionFlag}`,
    {
      cwd: path,
    }
  );

  installProcess.on("message", (msg: MessageEvent) => log.info(msg.data));

  installProcess.on("exit", (code) => {
    log.info(`Installation exited with code ${code}.`);
    mainWindow.webContents.send(Channel.MARS_INSTALLED);
  });
});

enum FileExtensions {
  CSHARP = ".cs",
  CSV = ".csv",
}

function getFilesInDirWithExtension(
  dir: string,
  ext: FileExtensions
): string[] {
  return fs
    .readdirSync(dir)
    .filter(
      (fileName) =>
        path.extname(fileName).toLowerCase() === ext.toLocaleLowerCase()
    )
    .map((fileName) => path.resolve(dir, fileName));
}

ipcMain.handle(
  Channel.GET_USER_PROJECT,
  (_, modelRef: ModelRef): WorkingModel => {
    return getFilesInDirWithExtension(modelRef.path, FileExtensions.CSHARP).map(
      (file) => new ModelFile(file)
    );
  }
);

ipcMain.handle(Channel.GET_CSV_RESULTS, (_, path: string): IFileRef[] => {
  return getFilesInDirWithExtension(path, FileExtensions.CSV).map(
    (file) => new FileRef(file)
  );
});

ipcMain.handle(Channel.GET_DEFAULT_CONFIG_PATH, (_, rootPath: string): string =>
  path.resolve(rootPath, "config.json")
);

ipcMain.handle(Channel.CONFIG_EXISTS, (_, path: string): boolean =>
  fs.existsSync(path)
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
  Channel.WRITE_CONTENT_TO_FILE,
  (_, { path, content }: { path: string; content: string }): void =>
    fs.writeJSONSync(path, content)
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

enum ProcessExitCode {
  SUCCESS = 0,
  ERROR = 134,
  TERMINATED = 143,
}

ipcMain.handle(Channel.RUN_SIMULATION, (_, projectPath: string): void => {
  if (!fs.pathExistsSync(projectPath)) {
    throw new Error(
      `Error while starting the simulation: Path (${projectPath}) does not exist.`
    );
  }

  log.info(`Starting simulation in ${projectPath} ...`);
  const simulationProcess = child_process.exec(
    "dotnet run",
    {
      cwd: projectPath,
    },
    (error) => {
      if (!error || error.code === ProcessExitCode.TERMINATED) return;

      log.error("Error while simulating: ", error.name, error.message);
      mainWindow.webContents.send(Channel.SIMULATION_FAILED, error);
    }
  );

  ipcMain.once(Channel.TERMINATE_SIMULATION, () => {
    log.info(`Canceling simulation of ${projectPath}`);
    simulationProcess.kill();
  });

  const closeWs = handleSimulationProgress(
    log,
    (progress) =>
      mainWindow.webContents.send(Channel.SIMULATION_PROGRESS, progress),
    () => simulationProcess.kill()
  );

  const cleanupHandler = () => {
    ipcMain.removeHandler(Channel.TERMINATE_SIMULATION);
    closeWs();
  };

  simulationProcess.on("exit", (code) => {
    let exitState: SimulationStates;

    switch (code) {
      case ProcessExitCode.SUCCESS:
        log.info(`Simulation exited successfully (${code}).`);
        exitState = SimulationStates.SUCCESS;
        break;
      case ProcessExitCode.TERMINATED:
        log.info(`Simulation was terminated (${code}).`);
        exitState = SimulationStates.TERMINATED;
        break;
      case ProcessExitCode.ERROR:
        log.error(`Simulation errored (${code}).`);
        exitState = SimulationStates.FAILED;
        break;
      default:
        exitState = SimulationStates.UNKNOWN;
    }

    mainWindow.webContents.send(Channel.SIMULATION_EXITED, exitState);
    cleanupHandler();
  });
});
