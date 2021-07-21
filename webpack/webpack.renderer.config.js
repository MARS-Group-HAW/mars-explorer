const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const resolves = require('./webpack.resolves');

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

rules.push({
    test: /\.css$/,
    use: [{loader: 'style-loader'}, {loader: 'css-loader'}],
});
rules.push({
    test: /\.ttf$/,
    use: ['file-loader']
})

plugins.push(new MonacoWebpackPlugin({
    languages: ['csharp'],
    publicPath: ".webpack/renderer"
}))

resolves.alias = {
    'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
};
resolves.extensions.push('.css', '.json', '.ttf');

module.exports = {
    module: {
        rules,
    },
    plugins: plugins,
    resolve: resolves,
};
