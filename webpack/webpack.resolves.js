// to sync type aliases from tsconfig.json
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");


module.exports = {
  extensions: [".ts", ".tsx", ".js", ".jsx"],
  plugins: [new TsconfigPathsPlugin({ extensions: [".ts", ".tsx", ".js", ".jsx"] })]
};
