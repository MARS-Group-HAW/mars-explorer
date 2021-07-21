import * as path from "path";
import { is } from "electron-util";
import { OmnisharpConfiguration } from "./types/OmnisharpConfiguration";
import {
  Server,
  SERVER_NAMES,
  ServerMap,
} from "./types/OmnisharpServerConfiguration";

const resources = is.development
  ? path.join(__dirname, "..", "..", "resources")
  : process.resourcesPath;

const PATH_TO_OMNISHARP_DIR =
  "/Users/jvoss/Projects/master-thesis/temp/omnisharp";

const OMNISHARP_CONFIG: OmnisharpConfiguration = {
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

  for (const [k, v] of Object.entries(OMNISHARP_CONFIG)) {
    for (const [k2, v2] of Object.entries(v)) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      args.push(`${k}:${k2}=${v2}`);
    }
  }

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
