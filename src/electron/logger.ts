import log4js = require("log4js");

log4js.configure({
  appenders: {
    lsp: { type: "file", filename: "lsp.log", backups: 0 },
  },
  categories: {
    default: { appenders: ["lsp"], level: "debug" },
  },
});

export const logger = log4js.getLogger();
