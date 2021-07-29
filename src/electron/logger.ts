import { ElectronLog } from "electron-log";
import { ILogger } from "@shared/types/Logger";
import log = require("electron-log");
import path = require("path");

type LoggerOptions = {
  newFile: boolean;
  printToConsole: boolean;
};

const IS_DEV =
  process.env.ELECTRON_ENV && process.env.ELECTRON_ENV === "development";

export class Logger implements ILogger {
  private readonly electronLog: ElectronLog;

  constructor(
    scope: string,
    options: LoggerOptions = {
      newFile: false,
      printToConsole: true,
    }
  ) {
    this.electronLog = log.create(scope);
    Object.assign(this.electronLog, this.electronLog.scope(scope));

    this.setFileName(options.newFile, scope);

    if (!options.printToConsole) {
      this.electronLog.transports.console.level = false;
    }

    this.electronLog.catchErrors();
    this.electronLog.log(`### NEW SESSION (${scope}) ###`);
  }

  private setFileName(newFile: boolean, scope: string) {
    let fileName = newFile
      ? `${scope}.log`
      : this.electronLog.transports.file.fileName;

    fileName = IS_DEV ? Logger.appendDevExtension(fileName) : fileName;

    if (newFile) {
      this.electronLog.transports.file.resolvePath = ({ libraryDefaultDir }) =>
        path.join(libraryDefaultDir, fileName);
    } else {
      this.electronLog.transports.file.fileName = fileName;
    }
  }

  private static appendDevExtension(filePath: string): string {
    const splitFilePath = filePath.split(".");
    splitFilePath.splice(splitFilePath.length - 1, 0, "dev");
    return splitFilePath.join(".");
  }

  public set scope(scope: string) {
    Object.assign(this.electronLog, this.electronLog.scope(scope));
  }

  debug = (...params: any[]): void => this.electronLog.debug(params);
  error = (...params: any[]): void => this.electronLog.error(params);
  info = (...params: any[]): void => this.electronLog.info(params);
  log = (...params: any[]): void => this.electronLog.info(params);
  warn = (...params: any[]): void => this.electronLog.warn(params);
}
