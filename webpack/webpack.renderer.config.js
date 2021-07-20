const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
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

module.exports = {
    target: 'electron-renderer',
    module: {
        rules,
    },
    plugins: plugins,
    resolve: {
        alias: {
            'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json', '.ttf']
    },
};
