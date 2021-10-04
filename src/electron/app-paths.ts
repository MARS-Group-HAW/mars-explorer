import { app } from "electron";
import path from "path";
import { is } from "electron-util";
import ElectronLog from "electron-log";

class AppPaths {
  private readonly userDocuments = app.getPath("documents");

  readonly logsDir = path.dirname(ElectronLog.transports.file.getFile().path);

  readonly resourcesDir = is.development
    ? path.join(__dirname, "..", "..", "resources")
    : process.resourcesPath;

  readonly resourcesExamplesDir = path.resolve(this.resourcesDir, "examples");

  readonly workspaceDir = path.join(this.userDocuments, "mars-explorer");

  readonly workspaceExamplesDir = path.join(this.workspaceDir, "examples");

  readonly modelsJson = path.resolve(this.resourcesExamplesDir, "models.json");

  readonly templatesDir = path.resolve(this.resourcesDir, "templates");
}

export default new AppPaths();
