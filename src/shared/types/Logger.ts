type LogFunction = (...params: any[]) => void;

export interface ILogger {
  error: LogFunction;
  warn: LogFunction;
  info: LogFunction;
  log: LogFunction;
  debug: LogFunction;
}
