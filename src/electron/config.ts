import { DocumentSelector } from "monaco-languageclient";
import * as path from "path";
import { SpawnOptions } from "child_process";
import { app } from "electron";
import { is } from "electron-util";

export enum SERVER_NAMES {
  OMNISHARP_TEMP_1349 = "OMNISHARP_TEMP_1349",
  OMNISHARP_TEMP_13712 = "OMNISHARP_TEMP_13712",
}

const resources = is.development
  ? path.join(__dirname, "..", "..", "resources")
  : process.resourcesPath;

type Server = {
  args: string[];
  command: string;
  options: SpawnOptions;
  // workingDirectory: string;
  language: string;
  documentSelector: DocumentSelector;
};

export type ServerMap = { [key in keyof typeof SERVER_NAMES]: Server };

const PATH_TO_OMNISHARP_DIR =
  "/Users/jvoss/Projects/master-thesis/temp/omnisharp";

const OMNISHARP_CONFIG = {
  dotnet: {
    enabled: true,
    enablePackageRestore: true,
  },
  RoslynExtensionsOptions: {
    enableAnalyzersSupport: true,
  },
  script: {
    enabled: false,
  },
  cake: {
    enabled: false,
  },
  fileOptions: {
    excludeSearchPatterns: ["**/var/**/*", "**/obj/**/*"],
  },
  msbuild: {
    enabled: true,
    EnablePackageAutoRestore: false,
    // "MSBuildSDKsPath": path.join(app.getPath('home'), 'Library', 'ApplicationSupport', 'MARS-Explorer', 'dotnet-sdk', 'sdk', '3.1.410'),
  },
};

function configToArg(): string[] {
  const args: string[] = [];
  Object.keys(OMNISHARP_CONFIG).forEach((key: any) => {
    // @ts-ignore
    Object.keys(OMNISHARP_CONFIG[key]).forEach((keyInKey) =>
      // @ts-ignore
      args.push(`${key}:${keyInKey}=${OMNISHARP_CONFIG[key][keyInKey]}`)
    );
  });
  return args;
}

const OMNISHARP_BASE: Omit<Server, "options"> = {
  command: "sh run",
  args: [
    "-lsp",
    "-v", // TODO: maybe delete -debug?
    ...configToArg(),
  ],
  language: "csharp",
  documentSelector: [
    {
      pattern: "**/*.cs",
    },
  ],
};

export const Servers: ServerMap = {
  [SERVER_NAMES.OMNISHARP_TEMP_1349]: {
    ...OMNISHARP_BASE,
    args: [
      ...OMNISHARP_BASE.args,
      "-s /Users/jvoss/Documents/mars-explorer/MyTestApp/Program.cs",
    ],
    options: {
      cwd: path.join(PATH_TO_OMNISHARP_DIR, "1.34.9"),
      shell: true,
    },
  },
  [SERVER_NAMES.OMNISHARP_TEMP_13712]: {
    ...OMNISHARP_BASE,
    args: [
      ...OMNISHARP_BASE.args,
      "-s /Users/jvoss/Documents/mars-explorer/MyTestApp/MyTestApp.sln",
    ],
    options: {
      cwd: path.join(resources, "omnisharp", "osx"),
      shell: true,
    },
  },
};
