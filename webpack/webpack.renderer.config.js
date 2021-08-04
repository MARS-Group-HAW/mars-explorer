const path = require("path");
const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const resolves = require("./webpack.resolves");

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const RemovePlugin = require("remove-files-webpack-plugin");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }]
});
rules.push({
  test: /\.(woff|woff2|eot|ttf|svg)$/,
  use: ["file-loader"]
});

plugins.push(new MonacoWebpackPlugin({
  languages: ["csharp"],
  publicPath: ".webpack/renderer"
}));

const folderPath = path.join(__dirname, "..", ".webpack", "renderer");

// see top of Modeler.tsx; due to default import *, all languages will be bundled
plugins.push(new RemovePlugin({
  after: {
    test: [
      {
        folder: folderPath,
        method: (absoluteItemPath) => {
          return new RegExp(/(vendors-)?node_modules_monaco.+$/).test(absoluteItemPath);
        },
        recursive: true
      }
    ],
    exclude: [
      path.join(folderPath, "node_modules_monaco-editor_esm_vs_basic-languages_csharp_csharp_js")
    ],
    log: false,
    logWarning: true,
    logError: true,
    logDebug: false
  }
}));

resolves.alias = {
  "vscode": require.resolve("monaco-languageclient/lib/vscode-compatibility")
};
resolves.extensions.push(".css", ".json", ".ttf");

module.exports = {
  module: {
    rules
  },
  plugins: plugins,
  resolve: resolves
};
