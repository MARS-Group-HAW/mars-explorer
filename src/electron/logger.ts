import { ElectronLog } from "electron-log";
import { ILogger, LoggerLabel } from "@shared/types/Logger";
import log = require("electron-log");
import path = require("path");

type LoggerOptions = {
  newFile?: boolean;
  printToConsole?: boolean;
  labels?: string[];
};

const IS_DEV =
  process.env.ELECTRON_ENV && process.env.ELECTRON_ENV === "development";

// eslint-disable-next-line import/prefer-default-export
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

    if (options.labels) {
      const labelsInFormat = options.labels
        .map((label) => `[{${label}}]`)
        .join(" ");
      const newFormat = `[{h}:{i}:{s}.{ms}] [{level}]{scope} ${labelsInFormat} {text}`;
      this.electronLog.transports.console.format = newFormat;
      this.electronLog.transports.file.format = newFormat;
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

  public set label(label: LoggerLabel) {
    this.electronLog.variables[label.key] = label.value;
  }

  public set labels(labels: LoggerLabel[]) {
    labels.forEach((label) => {
      this.label = label;
    });
  }

  private format = (...params: unknown[]): string =>
    params
      .flat()
      .filter((param: unknown) => param !== null)
      .map(this.formatParam)
      .join("\n");

  private formatParam = (param: unknown): string =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    typeof param === "object"
      ? JSON.stringify(param, null, 4)
      : (param as string);

  debug = (...params: unknown[]): void =>
    this.electronLog.debug(`%c${this.format(params)}`, "color: Magenta");

  error = (...params: unknown[]): void =>
    this.electronLog.error(`%c${this.format(params)}`, "color: Red");

  info = (...params: unknown[]): void =>
    this.electronLog.info(`%c${this.format(params)}`, "color: Cyan");

  log = (...params: unknown[]): void =>
    this.electronLog.log(this.format(params));

  warn = (...params: unknown[]): void =>
    this.electronLog.warn(`%c${this.format(params)}`, "color: Yellow");
}
