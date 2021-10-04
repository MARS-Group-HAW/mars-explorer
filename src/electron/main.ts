import { enforceMacOSAppLocation } from "electron-util";
import * as path from "path";
import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainInvokeEvent,
  Menu,
} from "electron";
import { Channel } from "@shared/types/Channel";
import { ExampleProject } from "@shared/types/ExampleProject";
import { Project } from "@shared/types/Project";
import fixPath from "fix-path";
import { IModelFile, ModelRef, WorkingModel } from "@shared/types/Model";
import * as child_process from "child_process";
import { SimulationStates } from "@shared/types/SimulationStates";
import { IFileRef } from "@shared/types/File";
import { ObjectCreationMessage } from "@shared/types/object-creation-message";
import SimObjects from "@shared/types/sim-objects";
import NotImplementedError from "@shared/errors/not-implemented-error";
import { Files } from "vscode-languageserver/node";
import { fileURLToPath } from "url";
import squirrel = require("electron-squirrel-startup");
import fs = require("fs-extra");
import ModelFile from "./types/ModelFile";
import FileRef from "./types/FileRef";
import { ModelsJson } from "./types/ModelsJson";
import { launchLanguageServer } from "./server-launcher";
import { Logger } from "./logger";
import appPaths from "./app-paths";
import SimulationHandler, { WebSocketCloseCodes } from "./handle-simulation";
import menuItems from "./menu";

const log = new Logger("main");

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
  fs.ensureDirSync(appPaths.workspaceExamplesDir);
  log.info(`Copying Examples to ${appPaths.workspaceExamplesDir}`);
  fs.copySync(appPaths.resourcesExamplesDir, appPaths.workspaceExamplesDir);
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

  /*
  Promise.all([
    installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: { allowFileAccess: true },
    }),
    /* disable because of errors
    installExtension(
      REDUX_DEVTOOLS,
      { loadExtensionOptions: { allowFileAccess: true } } //this is the key line
    ),
  ])
    .then((names) => console.log(`Added Extensions: ${names.join(", ")}`))
    .catch((err) => console.log("An error occurred: ", err));
  */

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
    log.info("Relevant Paths: ", appPaths);
    log.info("Enforcing Location");
    enforceMacOSAppLocation();
    log.info("Starting setup");
    setupApp();
    // log.info("Starting server");
    // webSocketPort = startServer();
    log.info("Creating window");
    createWindow();

    const menu = Menu.getApplicationMenu();
    menuItems.forEach((menuItem) => menu.append(menuItem));
    Menu.setApplicationMenu(menu);

    app.on("activate", () => {
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
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle(Channel.GET_WORKSPACE_PATH, () => appPaths.workspaceDir);

ipcMain.handle(Channel.GET_EXAMPLES_PATH, () => appPaths.workspaceExamplesDir);

ipcMain.handle(Channel.GET_EXAMPLE_PROJECTS, (): ModelRef[] => {
  const modelsJson = fs.readJsonSync(appPaths.modelsJson) as ModelsJson;
  return modelsJson.map(({ name, path }) => ({
    name,
    path,
  }));
});

ipcMain.handle(Channel.URI_TO_NAME, (_, uri: string) =>
  path.basename(fileURLToPath(uri))
);

ipcMain.handle(Channel.GET_USER_PROJECTS, (): ModelRef[] => {
  const userProjects = fs
    .readdirSync(appPaths.workspaceDir)
    .filter((file) => file !== appPaths.workspaceExamplesDir) // no example dir
    .filter((item) => !/(^|\/)\.[^/.]/g.test(item)) // remove hidden dirs
    .map((file) => path.join(appPaths.workspaceDir, file)) // to full path
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
  }
  return null;
});

async function remove(pathTo: string): Promise<boolean> {
  try {
    await fs.remove(pathTo);
    log.info("Deleted file/dir: ", pathTo);
    return true;
  } catch (e: unknown) {
    log.error("Could not delete file/dir", pathTo, e);
    return false;
  }
}

ipcMain.handle(
  Channel.DELETE_FILE_OR_DIR,
  async (_, pathToObject: string): Promise<boolean> => remove(pathToObject)
);

enum Templates {
  PROGRAMM_CS = "Program.cs",
  AGENT_CS = "Agent.cs",
  LAYER_CS = "Layer.cs",
}

const PROJECT_NAME_PLACEHOLDER = /\$PROJECT_NAME/g;
const OBJECT_NAME_PLACEHOLDER = /\$OBJECT_NAME/g;

type Replaceable = {
  placeholder: RegExp;
  value: string;
};

async function copyAndReplaceTemplate(
  templateName: Templates,
  filePath: string,
  replaceables: Replaceable[]
): Promise<string> {
  const templatePath = path.resolve(appPaths.templatesDir, templateName);
  let content = await fs.readFile(templatePath, "utf8");

  replaceables.forEach(({ placeholder, value }) => {
    content = content.replace(placeholder, value);
  });

  await fs.writeFile(filePath, content, "utf8");
  return content;
}

ipcMain.on(Channel.CREATE_PROJECT, (_, projectName: string) => {
  const args = [];
  args.push('--language "C#"');
  args.push("--framework netcoreapp3.1");
  args.push(`--name ${projectName}`);

  log.info(
    `Started "dotnet new" with the following arguments: ${args.toString()}`
  );

  const installProcess = child_process.exec(
    `dotnet new console ${args.join(" ")}`,
    {
      cwd: appPaths.workspaceDir,
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
      const projectDir = path.join(appPaths.workspaceDir, projectName);
      const filePath = path.resolve(projectDir, "Program.cs");

      copyAndReplaceTemplate(Templates.PROGRAMM_CS, filePath, [
        {
          placeholder: PROJECT_NAME_PLACEHOLDER,
          value: projectName,
        },
      ])
        .then(sendSuccessMsg)
        .catch((replaceErr: unknown) => {
          log.error(
            "Error while replacing contents in new project: ",
            replaceErr
          );
          remove(projectDir)
            .then(sendErrorMsg)
            .catch((delErr: unknown) =>
              log.error("Error cleaning up after replacing failure: ", delErr)
            );
        });
    } else {
      sendErrorMsg();
    }
  });
});

ipcMain.handle(
  Channel.CREATE_OBJECT,
  async (
    _,
    { projectPath, projectName, objectType, objectName }: ObjectCreationMessage
  ): Promise<IModelFile> => {
    let template: Templates;

    switch (objectType) {
      case SimObjects.AGENT:
        template = Templates.AGENT_CS;
        break;
      case SimObjects.LAYER:
        template = Templates.LAYER_CS;
        break;
      case SimObjects.ENTITY:
      default:
        throw new NotImplementedError("Entity");
    }

    const objectFile = `${objectName}.cs`;
    const filePath = path.resolve(projectPath, objectFile);

    const content = await copyAndReplaceTemplate(template, filePath, [
      {
        placeholder: PROJECT_NAME_PLACEHOLDER,
        value: projectName,
      },
      {
        placeholder: OBJECT_NAME_PLACEHOLDER,
        value: objectName,
      },
    ]);

    return {
      name: objectFile,
      path: filePath,
      content,
    };
  }
);

ipcMain.on(Channel.INSTALL_MARS, (_, path: string) => {
  if (!fs.pathExistsSync(path)) {
    throw new Error(
      `Error while installing the MARS-Framework: Path (${path}) does not exist.`
    );
  }

  const versionFlag = " --version 4.3.2"; // FIXME

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
  (_, modelRef: ModelRef): WorkingModel =>
    getFilesInDirWithExtension(modelRef.path, FileExtensions.CSHARP).map(
      (file) => new ModelFile(file)
    )
);

ipcMain.handle(Channel.GET_CSV_RESULTS, (_, path: string): IFileRef[] =>
  getFilesInDirWithExtension(path, FileExtensions.CSV).map(
    (file) => new FileRef(file)
  )
);

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
    }
    return null;
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
    const root = path.join(appPaths.workspaceExamplesDir, project);
    return {
      name: project,
      rootPath: root,
      entryFilePath: path.join(root, "Program.cs"),
    };
  }
);

ipcMain.handle(
  Channel.READ_FILE,
  (ev: IpcMainInvokeEvent, path: string): string =>
    fs.readFileSync(path, "utf-8")
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

  const wsHandler = new SimulationHandler({
    log,
    handleCountMsg: (msg) =>
      msg !== null &&
      mainWindow.webContents.send(Channel.SIMULATION_COUNT_PROGRESS, msg),
    handleVisMsg: (msg) =>
      msg !== null &&
      mainWindow.webContents.send(Channel.SIMULATION_COORDS_PROGRESS, msg),
    handleMaxRetries: () => simulationProcess.kill(),
  });

  const cleanupHandler = (wsCode?: WebSocketCloseCodes) => {
    ipcMain.removeHandler(Channel.TERMINATE_SIMULATION);
    wsHandler.closeSockets(wsCode);
  };

  simulationProcess.on("exit", (code) => {
    let exitState: SimulationStates;

    switch (code) {
      case ProcessExitCode.SUCCESS:
        log.info(`Simulation exited successfully (${code}).`);
        exitState = SimulationStates.SUCCESS;
        cleanupHandler(WebSocketCloseCodes.EXITING);
        break;
      case ProcessExitCode.TERMINATED:
        log.info(`Simulation was terminated (${code}).`);
        exitState = SimulationStates.TERMINATED;
        cleanupHandler(WebSocketCloseCodes.TERMINATED);
        break;
      case ProcessExitCode.ERROR:
        log.error(`Simulation errored (${code}).`);
        exitState = SimulationStates.FAILED;
        cleanupHandler();
        break;
      default:
        exitState = SimulationStates.UNKNOWN;
        cleanupHandler();
    }

    mainWindow.webContents.send(Channel.SIMULATION_EXITED, exitState);
  });
});
