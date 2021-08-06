const path = require("path");

const PATH_TO_MAIN_CONFIG = path.join(
  __dirname,
  "..",
  "electron",
  ".eslintrc.js"
);

module.exports = require(PATH_TO_MAIN_CONFIG);
