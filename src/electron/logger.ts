import { ElectronLog } from "electron-log";
import { ILogger } from "@shared/types/Logger";
import log = require("electron-log");
import path = require("path");

type LoggerOptions = {
  newFile: boolean;
  printToConsole: boolean;
};

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

    if (options.newFile) {
      this.electronLog.transports.file.resolvePath = ({ libraryDefaultDir }) =>
        path.join(libraryDefaultDir, `${scope}.log`);
    }

    if (!options.printToConsole) {
      this.electronLog.transports.console.level = false;
    }

    this.electronLog.catchErrors();
  }

  public set scope(scope: string) {
    Object.assign(this.electronLog, this.electronLog.scope(scope));
  }

  debug = (...params: any[]): void => this.electronLog.debug(params);
  error = (...params: any[]): void => this.electronLog.error(params);
  info = (...params: any[]): void => this.electronLog.info(params);
  warn = (...params: any[]): void => this.electronLog.warn(params);
}
