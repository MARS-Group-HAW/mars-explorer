import * as path from "path";
import { app } from "electron";
import { Channel } from "@shared/types/Channel";
import { IModelFile, ModelRef, WorkingModel } from "@shared/types/Model";
import * as child_process from "child_process";
import { SimulationStates } from "@shared/types/SimulationStates";
import SimObjects from "@shared/types/sim-objects";
import { fileURLToPath } from "url";
import ExampleProject from "@shared/types/ExampleProject";
import fs = require("fs-extra");
import ModelFile from "./types/ModelFile";
import FileRef from "./types/FileRef";
import { launchLanguageServer } from "./omnisharp/server-launcher";
import appPaths from "./app-paths";
import SimulationHandler, { WebSocketCloseCodes } from "./handle-simulation";
import log from "./main-logger";
import main from "./main";
import SafeIpcMain from "./safe-ipc-main";

enum FileExtensions {
  CSHARP = ".cs",
  CSV = ".csv",
}

SafeIpcMain.on(Channel.RESTART_APP, () => {
  log.warn("Restart requested by user.");
  app.relaunch();
  app.exit();
});

SafeIpcMain.handle(Channel.GET_WORKSPACE_PATH, () => appPaths.workspaceDir);

SafeIpcMain.handle(
  Channel.GET_EXAMPLES_PATH,
  () => appPaths.workspaceExamplesDir
);

SafeIpcMain.handle(Channel.URI_TO_NAME, (_, uri) =>
  path.basename(fileURLToPath(uri))
);

SafeIpcMain.handle(Channel.PATH_ABSOLUTE_TO_RELATIVE, (_, { from, to }) =>
  path.relative(from, to)
);

function getProjectsInDir(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((item) => !/(^|\/)\.[^/.]/g.test(item)) // remove hidden dirs
    .map((file) => path.join(dir, file)) // to full path
    .filter((file) => fs.lstatSync(file).isDirectory());
}

SafeIpcMain.handle(Channel.GET_USER_PROJECTS, () => {
  const userProjects = getProjectsInDir(appPaths.workspaceDir)
    .filter((file) => file !== appPaths.workspaceExamplesDir) // no example dir
    .map((file) => ({
      file,
      time: fs.statSync(file).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)
    .map((file) => file.file);

  return userProjects.map((file) => new FileRef(file));
});

SafeIpcMain.handle(Channel.GET_EXAMPLE_PROJECTS, () => {
  const userProjects = getProjectsInDir(appPaths.workspaceExamplesDir);
  return userProjects.map((file) => new FileRef(file));
});

SafeIpcMain.handle(Channel.GET_ALL_EXAMPLE_PROJECTS, (): ExampleProject[] => {
  const examplesProjectDirs = getProjectsInDir(appPaths.workspaceExamplesDir);

  return examplesProjectDirs.map((exampleProjectDir) => {
    const files = fs
      .readdirSync(exampleProjectDir)
      .map((file) => path.join(exampleProjectDir, file));

    const readme = files.find(
      (file) => path.basename(file).toLowerCase() === "readme.md"
    );
    let readmeFile: ModelFile;

    if (readme) {
      readmeFile = new ModelFile(readme);
    } else {
      log.warn(`No README.md for example project "${exampleProjectDir}" found`);
    }

    const models = files
      .filter(
        (file) => path.extname(file).toLowerCase() === FileExtensions.CSHARP
      )
      .map((file) => new ModelFile(file));

    return {
      name: path.basename(exampleProjectDir),
      path: exampleProjectDir,
      readme: readmeFile,
      models,
    };
  });
});

SafeIpcMain.handle(
  Channel.CHECK_LAST_PATH,
  (_, filePath: string): ModelRef | null => {
    if (fs.pathExistsSync(filePath)) {
      return new FileRef(filePath);
    }
    return null;
  }
);

SafeIpcMain.handle(
  Channel.COPY_EXAMPLE_PROJECT,
  (_, exampleProjectPath: string): ModelRef => {
    const nameOfProject = path.basename(exampleProjectPath);
    const newPath = path.resolve(appPaths.workspaceDir, nameOfProject);
    fs.emptyDirSync(newPath);
    fs.copySync(exampleProjectPath, newPath);
    return {
      name: nameOfProject,
      path: newPath,
    };
  }
);

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

SafeIpcMain.handle(
  Channel.DELETE_FILE_OR_DIR,
  async (_, pathToObject: string): Promise<boolean> => remove(pathToObject)
);

enum Templates {
  PROGRAMM_CS = "Program.cs",
  AGENT_CS = "Agent.cs",
  LAYER_CS = "Layer.cs",
  LAYER_DEPENDENT_CS = "LayerDependent.cs",
  ENTITY_CS = "Entity.cs",
}

const PROJECT_NAME_PLACEHOLDER = /\$PROJECT_NAME/g;
const CLASS_NAME_PLACEHOLDER = /\$CLASS_NAME/g;
const DEPENDENT_LAYER_PLACEHOLDER = /\$DEPENDENT_LAYER_NAME/g;

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

SafeIpcMain.on(Channel.CREATE_PROJECT, (_, projectName: string) => {
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

  const sendSuccessMsg = () => SafeIpcMain.send(Channel.PROJECT_CREATED, true);
  const sendErrorMsg = () => SafeIpcMain.send(Channel.PROJECT_CREATED, false);

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

SafeIpcMain.handle(
  Channel.CREATE_CLASS,
  async (
    _,
    { projectPath, projectName, type, className, args }
  ): Promise<IModelFile> => {
    const replaceables = [
      {
        placeholder: PROJECT_NAME_PLACEHOLDER,
        value: projectName,
      },
      {
        placeholder: CLASS_NAME_PLACEHOLDER,
        value: className,
      },
    ];

    let template: Templates;

    switch (type) {
      case SimObjects.AGENT:
        template = Templates.AGENT_CS;
        break;
      case SimObjects.LAYER:
        template = Templates.LAYER_CS;
        break;
      case SimObjects.DEPENDENT_LAYER:
        template = Templates.LAYER_DEPENDENT_CS;
        replaceables.push({
          placeholder: DEPENDENT_LAYER_PLACEHOLDER,
          value: args.dependentLayerName,
        });
        break;
      case SimObjects.ENTITY:
        template = Templates.ENTITY_CS;
        break;
      default:
        throw new Error(`Class Type "${type}" not found.`);
    }

    const classFile = `${className}.cs`;
    const filePath = path.resolve(projectPath, classFile);

    const content = await copyAndReplaceTemplate(
      template,
      filePath,
      replaceables
    );

    return {
      name: classFile,
      path: filePath,
      content,
    };
  }
);

SafeIpcMain.on(Channel.INSTALL_MARS, (_, projectPath: string) => {
  if (!fs.pathExistsSync(projectPath)) {
    throw new Error(
      `Error while installing the MARS-Framework: Path (${projectPath}) does not exist.`
    );
  }

  const versionFlag = " --version 4.3.2"; // FIXME

  const installProcess = child_process.exec(
    `dotnet add package Mars.Life.Simulations${versionFlag}`,
    {
      cwd: projectPath,
    }
  );

  installProcess.on("message", (msg: MessageEvent) => log.info(msg.data));

  installProcess.on("exit", (code) => {
    log.info(`Installation exited with code ${code}.`);
    SafeIpcMain.send(Channel.MARS_INSTALLED);
  });
});

SafeIpcMain.handle(Channel.CLEAN_PROJECT, (_, projectPath: string) => {
  log.warn("Starting to clean ", projectPath);

  child_process.execSync(`dotnet clean`, {
    cwd: projectPath,
  });
  log.warn("Cleaning successful.");
});

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

SafeIpcMain.handle(
  Channel.GET_USER_PROJECT,
  (_, modelRef: ModelRef): WorkingModel =>
    getFilesInDirWithExtension(modelRef.path, FileExtensions.CSHARP).map(
      (file) => new ModelFile(file)
    )
);

SafeIpcMain.handle(
  Channel.GET_DEFAULT_CONFIG_PATH,
  (_, rootPath: string): string => path.resolve(rootPath, "config.json")
);

SafeIpcMain.handle(Channel.FILE_EXISTS, (_, projectPath: string): boolean =>
  fs.existsSync(projectPath)
);

SafeIpcMain.handle(Channel.DOES_CONFIG_EXIST, (_, rootPath: string): boolean =>
  fs.existsSync(path.resolve(rootPath, "config.json"))
);

SafeIpcMain.handle(
  Channel.GET_CONFIG_IN_PROJECT,
  (_, rootPath: string): string | null => {
    const pathToDefaultConfig = path.resolve(rootPath, "config.json");

    if (fs.existsSync(pathToDefaultConfig)) {
      return fs.readFileSync(pathToDefaultConfig, "utf-8");
    }
    return null;
  }
);

SafeIpcMain.handle(
  Channel.WRITE_CONTENT_TO_FILE,
  (_, { path: pathToFile, content }: { path: string; content: string }): void =>
    fs.writeFileSync(pathToFile, content)
);

SafeIpcMain.handle(
  Channel.WRITE_CONFIG_TO_FILE,
  (
    _,
    { path: pathToProject, content }: { path: string; content: string }
  ): void =>
    fs.writeFileSync(path.resolve(pathToProject, "config.json"), content)
);

/*
SafeIpcMain.handle(Channel.OPEN_PROJECT, (_, modelRef: ModelRef): Model => {
  const modelDir = fs.readFileSync(modelRef.path, "utf-8");
  const modelsJson = JSON.parse(rawdata) as ModelsJson;
  return modelsJson.map(({ name, path }) => ({
    name,
    path,
  }));
});
 */

SafeIpcMain.handle(Channel.READ_FILE, (ev, projectPath: string): string =>
  fs.readFileSync(projectPath, "utf-8")
);

SafeIpcMain.handle(
  Channel.START_LANGUAGE_SERVER,
  (_, projectPath: string): string => {
    const { lspChannel, killServer } = launchLanguageServer(
      main.window,
      projectPath
    );

    const kill = (reason: string) => {
      if (!killServer) return;
      log.info(`Stopping Language Server (${lspChannel}) because of ${reason}`);
      killServer();
    };

    main.window.once("close", () => kill("Close-Event"));
    SafeIpcMain.once(Channel.STOP_LANGUAGE_SERVER, () =>
      kill("Channel.STOP_LANGUAGE_SERVER")
    );

    return lspChannel;
  }
);

enum ProcessExitCode {
  SUCCESS = 0,
  ERROR = 134,
  TERMINATED = 143,
}

SafeIpcMain.handle(Channel.RUN_SIMULATION, (_, projectPath: string): void => {
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
      SafeIpcMain.send(Channel.SIMULATION_FAILED, error);
    }
  );

  SafeIpcMain.once(Channel.TERMINATE_SIMULATION, () => {
    log.info(`Canceling simulation of ${projectPath}`);
    simulationProcess.kill();
  });

  const wsHandler = new SimulationHandler({
    handleCountMsg: (msg) =>
      msg !== null && SafeIpcMain.send(Channel.SIMULATION_COUNT_PROGRESS, msg),
    handleVisMsg: (msg) =>
      msg !== null && SafeIpcMain.send(Channel.SIMULATION_COORDS_PROGRESS, msg),
    handleWorldSizeMsg: (msg) =>
      msg !== null && SafeIpcMain.send(Channel.SIMULATION_WORLD_SIZES, msg),
    handleMaxRetries: () => simulationProcess.kill(),
  });

  const cleanupHandler = (wsCode?: WebSocketCloseCodes) => {
    SafeIpcMain.removeHandler(Channel.TERMINATE_SIMULATION);
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

    SafeIpcMain.send(Channel.SIMULATION_EXITED, exitState);
  });
});
