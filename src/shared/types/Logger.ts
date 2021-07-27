type LogFunction = (...params: any[]) => void;

export interface ILogger {
  error: LogFunction;
  warn: LogFunction;
  info: LogFunction;
  debug: LogFunction;
}
