import * as path from "path";
import { OmnisharpConfiguration } from "./types/OmnisharpConfiguration";
import { Server } from "./types/OmnisharpServerConfiguration";
import { PATHS } from "./main";
import { is } from "electron-util";
import os = require("os");

let currentOS: "linux" | "osx" | "win";

switch (os.type()) {
  case "Linux":
    currentOS = "linux";
    break;
  case "Darwin":
    currentOS = "osx";
    break;
  case "Windows_NT":
    currentOS = "win";
    break;
  default:
    throw new Error(`Unknown OS: ${os.type()}`);
}

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
    excludeSearchPatterns: ["**/var/**/*", "**/obj/**/*", "**/bin/**/*"],
    systemExcludeSearchPatterns: ["**/var/**/*", "**/obj/**/*", "**/bin/**/*"],
  },
  msbuild: {
    enabled: true,
    EnablePackageAutoRestore: false,
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

const OMNISHARP_BASE: Omit<Server, "command" | "options"> = {
  args: ["-lsp", "-v", ...configToArg()],
  language: "csharp",
  documentSelector: [
    {
      pattern: "**/*.cs",
    },
  ],
};

export function getServer(projectPath: string): Server {
  return {
    command: is.windows ? "Omnisharp.exe" : "sh run",
    ...OMNISHARP_BASE,
    args: [...OMNISHARP_BASE.args, `-s ${projectPath}`],
    options: {
      cwd: path.join(PATHS.resources, "omnisharp", currentOS),
      shell: true,
    },
  };
}
