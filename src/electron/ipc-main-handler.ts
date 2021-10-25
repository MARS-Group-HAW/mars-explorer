import * as path from "path";
import { app, dialog } from "electron";
import { Channel } from "@shared/types/Channel";
import { IModelFile, ModelRef, WorkingModel } from "@shared/types/Model";
import * as child_process from "child_process";
import { ChildProcess } from "child_process";
import { SimulationStates } from "@shared/types/SimulationStates";
import SimObjects from "@shared/types/sim-objects";
import { fileURLToPath } from "url";
import ExampleProject from "@shared/types/ExampleProject";
import { AgentClassCreationMessage } from "@shared/types/class-creation-message";
import fs = require("fs-extra");
import kill = require("tree-kill");
import ModelFile from "./types/ModelFile";
import FileRef from "./types/FileRef";
import launchLanguageServer from "./omnisharp/server-launcher";
import appPaths from "./app-paths";
import { WebSocketCloseCodes } from "./handle-simulation";
import log from "./main-logger";
import main from "./main";
import SafeIpcMain from "./safe-ipc-main";
import SimulationCountHandler from "./handle-simulation-count";
import SimulationVisHandler from "./handle-simulation-vis";

enum FileExtensions {
  CSHARP = ".cs",
  CSV = ".csv",
}

const MARS_LIFE_VERSION = " --version 4.3.0-beta-2";

SafeIpcMain.on(Channel.RESTART_APP, () => {
  log.warn("Restart requested by user.");
  app.relaunch();
  app.exit();
});

SafeIpcMain.handle(Channel.GET_WORKSPACE_PATH, () => appPaths.workspaceDir);

SafeIpcMain.handle(
  Channel.GET_EXAMPLES_PATH,
  () => appPaths.resourcesExamplesDir
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
    .map((file) => ({
      file,
      time: fs.statSync(file).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)
    .map((file) => file.file);

  return userProjects.map((file) => new FileRef(file));
});

SafeIpcMain.handle(Channel.GET_ALL_EXAMPLE_PROJECTS, (): ExampleProject[] => {
  const examplesProjectDirs = getProjectsInDir(appPaths.resourcesExamplesDir);

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
  LAYER_BASIC_CS = "LayerBasic.cs",
  LAYER_RASTER_CS = "LayerRaster.cs",
  LAYER_VECTOR_CS = "LayerVector.cs",
  ENTITY_CS = "Entity.cs",
}

const PROJECT_NAME_PLACEHOLDER = /\$PROJECT_NAME/g;
const CLASS_NAME_PLACEHOLDER = /\$CLASS_NAME/g;
const LAYER_CLASS_NAME_PLACEHOLDER = /\$LAYER_CLASS_NAME/g;

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
      const templateConfigJsonPath = path.resolve(
        appPaths.templatesDir,
        "config.json"
      );
      const projectConfigJsonPath = path.resolve(projectDir, "config.json");
      const programCsPath = path.resolve(projectDir, "Program.cs");

      const copyProcess = fs.copyFile(
        templateConfigJsonPath,
        projectConfigJsonPath
      );

      const copyAndReplaceProgramCs = copyAndReplaceTemplate(
        Templates.PROGRAMM_CS,
        programCsPath,
        [
          {
            placeholder: PROJECT_NAME_PLACEHOLDER,
            value: projectName,
          },
        ]
      );

      Promise.all([copyProcess, copyAndReplaceProgramCs])
        .then(sendSuccessMsg)
        .catch((err: unknown) => {
          log.error(
            "Error while replacing contents in new project or while creating a config.json: ",
            err
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
  async (_, classCreationMsg): Promise<IModelFile> => {
    const { projectPath, projectName, type, className } = classCreationMsg;

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
        replaceables.push({
          placeholder: LAYER_CLASS_NAME_PLACEHOLDER,
          value: (classCreationMsg as AgentClassCreationMessage).layerClassName,
        });
        break;
      case SimObjects.BASIC_LAYER:
        template = Templates.LAYER_BASIC_CS;
        break;
      case SimObjects.RASTER_LAYER:
        template = Templates.LAYER_RASTER_CS;
        break;
      case SimObjects.VECTOR_LAYER:
        template = Templates.LAYER_VECTOR_CS;
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

  const installProcess = child_process.exec(
    `dotnet add package Mars.Life.Simulations${MARS_LIFE_VERSION}`,
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

SafeIpcMain.on(Channel.RESTORE_PROJECT, (_, projectPath: string) => {
  if (!fs.pathExistsSync(projectPath)) {
    SafeIpcMain.send(Channel.PROJECT_RESTORED, false);
    throw new Error(
      `Error while restoring the project: Path (${projectPath}) does not exist.`
    );
  }

  const installProcess = child_process.exec("dotnet restore", {
    cwd: projectPath,
  });

  installProcess.on("message", (msg: MessageEvent) => log.info(msg.data));
  installProcess.on("error", (msg: Error) => log.error(msg));

  installProcess.on("exit", (code) => {
    log.info(`[RESTORE_PROJECT] Exited with code ${code}.`);
    SafeIpcMain.send(Channel.PROJECT_RESTORED, code === 0);
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

enum UnsavedChangesDialogButtons {
  SAVE,
  CANCEL,
  DONT_SAVE,
}

SafeIpcMain.handle(Channel.SHOW_UNSAVEABLE_CHANGES_DIALOG, async () => {
  const { response } = await dialog.showMessageBox(main.window, {
    message:
      "Your config has errors and therefore cannot be saved. Do you still want to leave this form?",
    detail: "Your changes will be lost if you leave now.",
    type: "warning",
    buttons: ["Leave", "Cancel"],
  });

  if (response === 0) return true;

  if (response === 1) return false;

  log.warn(
    `Unknown Button pressed in unsaveable changes dialog (${response}).`
  );
  return true;
});

SafeIpcMain.handle(Channel.SHOW_UNSAVED_CHANGES_DIALOG, async () => {
  const { response } = await dialog.showMessageBox(main.window, {
    message: "Do you want to save the changes you made to your config?",
    detail: "Your changes will be lost if you don't save them.",
    type: "warning",
    buttons: ["Save", "Cancel", "Don't save"],
  });

  switch (response) {
    case UnsavedChangesDialogButtons.DONT_SAVE:
      return false;
    case UnsavedChangesDialogButtons.SAVE:
      return true;
    case UnsavedChangesDialogButtons.CANCEL:
      return null;
    default: {
      log.warn(
        `Unknown Button pressed in unsaved changes dialog (${response}).`
      );
      return null;
    }
  }
});

SafeIpcMain.handle(
  Channel.START_LANGUAGE_SERVER,
  (_, projectPath: string): string =>
    launchLanguageServer(main.window, projectPath)
);

enum ProcessExitCode {
  SUCCESS = 0,
  ERROR = 134,
  TERMINATED = 143,
}

enum ProcessSignals {
  TERMINATED = "SIGTERM",
}

function runSimulation(projectPath: string): ChildProcess {
  log.info(`Starting simulation in ${projectPath} ...`);
  return child_process.spawn("dotnet", ["run", "--no-build"], {
    cwd: projectPath,
    shell: true,
  });
}

SafeIpcMain.on(
  Channel.RUN_SIMULATION,
  async (_, projectPath: string): Promise<void> => {
    if (!fs.pathExistsSync(projectPath)) {
      throw new Error(
        `Error while starting the simulation: Path (${projectPath}) does not exist.`
      );
    }

    let runProcess: ChildProcess;

    log.info(`Building project ${projectPath} ...`);
    const buildProcess = child_process.exec(
      "dotnet build",
      {
        cwd: projectPath,
      },
      (error, stdout) => {
        if (error) {
          switch (error.code) {
            case ProcessExitCode.TERMINATED: {
              SafeIpcMain.send(
                Channel.SIMULATION_EXITED,
                SimulationStates.TERMINATED
              );
              return;
            }
            default: {
              log.error(`Error while running ${error.cmd}: ${stdout}`);
              SafeIpcMain.send(Channel.SIMULATION_FAILED, stdout);
              SafeIpcMain.send(
                Channel.SIMULATION_EXITED,
                SimulationStates.FAILED
              );
              return;
            }
          }
        }

        let consoleOutput: string = "";
        let errorOutput: string = "";

        runProcess = runSimulation(projectPath);

        runProcess.stdout.setEncoding("utf8");
        runProcess.stdout.on("data", (data) => {
          consoleOutput += data.toString();
        });

        runProcess.stderr.setEncoding("utf8");
        runProcess.stderr.on("data", (data) => {
          if (!data) return;

          const dataStr = data.toString();

          if (!dataStr) return;
          errorOutput += dataStr;
        });

        const handleMaxRetries = () => runProcess.kill();

        const countWebsocket = new SimulationCountHandler({
          handleCountMsg: (msg) =>
            msg !== null &&
            SafeIpcMain.send(Channel.SIMULATION_COUNT_PROGRESS, msg),
          handleMaxRetries,
        });

        const visWebsocket = new SimulationVisHandler({
          handleVisMsg: (msg) =>
            msg !== null &&
            SafeIpcMain.send(Channel.SIMULATION_COORDS_PROGRESS, msg),
          handleWorldSizeMsg: (msg) =>
            msg !== null &&
            SafeIpcMain.send(Channel.SIMULATION_WORLD_SIZES, msg),
          handleMaxRetries,
        });

        const cleanupHandler = (wsCode?: WebSocketCloseCodes) => {
          SafeIpcMain.removeHandler(Channel.TERMINATE_SIMULATION);
          countWebsocket.close(wsCode);
          visWebsocket.close(wsCode);
        };

        runProcess.on("exit", (code, signal) => {
          let exitState: SimulationStates;
          let cleanupCode: WebSocketCloseCodes;

          log.debug(
            `Run Process exited (Code = ${
              Number.isInteger(code) ? code : "NONE"
            }, Signal = ${signal || "NONE"})`
          );

          if (Number.isInteger(code)) {
            switch (code) {
              case ProcessExitCode.SUCCESS:
                log.info(`Simulation exited successfully (${code}).`);
                exitState = SimulationStates.SUCCESS;
                cleanupCode = WebSocketCloseCodes.EXITING;
                break;
              case 1: // tree-kill termination code on windows
              case ProcessExitCode.TERMINATED:
                log.info(`Simulation was terminated (${code}).`);
                exitState = SimulationStates.TERMINATED;
                cleanupCode = WebSocketCloseCodes.TERMINATED;
                break;
              case ProcessExitCode.ERROR:
                log.error(`Simulation errored (${code}).`);
                exitState = SimulationStates.FAILED;
                SafeIpcMain.send(Channel.SIMULATION_FAILED, errorOutput);
                break;
              default:
                exitState = SimulationStates.UNKNOWN;
            }
          } else if (signal) {
            // in windows, there is no exit code if terminating
            switch (signal) {
              case ProcessSignals.TERMINATED:
                log.info(`Simulation was terminated (${signal}).`);
                exitState = SimulationStates.TERMINATED;
                cleanupCode = WebSocketCloseCodes.TERMINATED;
                break;
              default:
                exitState = SimulationStates.UNKNOWN;
            }
          }
          cleanupHandler(cleanupCode);
          SafeIpcMain.send(Channel.SIMULATION_EXITED, exitState);
          SafeIpcMain.send(Channel.SIMULATION_OUTPUT, consoleOutput);
        });
      }
    );

    SafeIpcMain.once(Channel.TERMINATE_SIMULATION, () => {
      log.info(`Canceling simulation of ${projectPath}`);
      buildProcess?.kill();

      if (runProcess?.pid) {
        kill(runProcess.pid);
      }
    });
  }
);
