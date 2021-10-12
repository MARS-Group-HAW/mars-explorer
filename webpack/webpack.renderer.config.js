const path = require("path");
const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const resolves = require("./webpack.resolves");

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const RemovePlugin = require("remove-files-webpack-plugin");

const IS_DEVELOPMENT = Boolean(process.env.ELECTRON_ENV);

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }]
});
rules.push({
  test: /\.(woff|woff2|eot|ttf|svg)$/,
  use: ["file-loader"]
});

plugins.push(new MonacoWebpackPlugin({
  languages: ["csharp", "markdown"],
  publicPath: ".webpack/renderer"
}));

const folderPath = path.join(__dirname, "..", ".webpack", "renderer");

// see top of Modeler.tsx; due to default import *, all languages will be bundled
if (!IS_DEVELOPMENT) {
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
        path.join(folderPath, "node_modules_monaco-editor_esm_vs_basic-languages_csharp_csharp_js"),
        path.join(folderPath, "node_modules_monaco-editor_esm_vs_basic-languages_markdown_markdown_js")
      ],
      log: false,
      logWarning: true,
      logError: true,
      logDebug: false
    }
  }));
}

resolves.alias = {
  "vscode": require.resolve("@codingame/monaco-languageclient/lib/vscode-compatibility")
};
resolves.extensions.push(".css", ".json", ".ttf");

module.exports = {
  module: {
    rules
  },
  devtool: IS_DEVELOPMENT && "inline-source-map",
  plugins: plugins,
  resolve: resolves
};
