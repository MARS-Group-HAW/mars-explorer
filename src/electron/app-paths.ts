import { app } from "electron";
import path from "path";
import { is } from "electron-util";
import ElectronLog from "electron-log";

class AppPaths {
  private readonly userDocuments = app.getPath("documents");

  private readonly resourcesDir = is.development
    ? path.join(__dirname, "..", "..", "resources")
    : process.resourcesPath;

  readonly logsDir = path.dirname(ElectronLog.transports.file.getFile().path);

  readonly omnisharpDir = path.join(this.resourcesDir, "omnisharp");

  readonly resourcesExamplesDir = path.resolve(this.resourcesDir, "examples");

  readonly workspaceDir = path.join(this.userDocuments, "mars-explorer");

  readonly templatesDir = path.resolve(this.resourcesDir, "templates");
}

export default new AppPaths();
