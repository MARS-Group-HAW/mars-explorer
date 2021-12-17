const path = require("path");

const PATH_TO_MAIN_CONFIG = path.join(__dirname, "..", "main", ".eslintrc.js");

module.exports = require(PATH_TO_MAIN_CONFIG);
