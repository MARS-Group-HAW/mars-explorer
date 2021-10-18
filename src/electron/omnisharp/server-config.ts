import * as path from "path";
import { is } from "electron-util";
import os = require("os");
import { OmnisharpConfiguration } from "../types/OmnisharpConfiguration";
import appPaths from "../app-paths";

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
  msbuild: {
    enabled: true,
    EnablePackageAutoRestore: false,
  },
};

const configAsArgs = (): string[] =>
  Object.entries(OMNISHARP_CONFIG)
    .map(([k, v]) => Object.entries(v).map(([k2, v2]) => `${k}:${k2}=${v2}`))
    .flat();

const getOmnisharpRunOptions = (projectPath: string) => ({
  command: is.windows ? "Omnisharp.exe" : "sh run",
  args: [`-s ${projectPath}`, "-lsp", ...configAsArgs()],
  options: {
    cwd: path.join(appPaths.omnisharpDir, currentOS),
    shell: true,
  },
});

export default getOmnisharpRunOptions;
