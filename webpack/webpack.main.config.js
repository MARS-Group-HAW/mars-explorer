const rules = require('./webpack.rules');
const resolves = require('./webpack.resolves');

rules.push({
  test: /\.(m?js|node)$/,
      parser: { amd: false },
  use: {
    // replaced because of https://github.com/electron-userland/electron-forge/issues/2154
    loader: "@timfish/webpack-asset-relocator-loader",
        options: {
      outputAssetBase: "native_modules",
    },
  },
});

rules.push(
    {
      test: /\.node$/,
      use: 'node-loader',
    },
)

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/electron/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: rules,
  },
  resolve: resolves,
  // see https://github.com/websockets/ws/issues/1126
  externals: {
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  }
};
