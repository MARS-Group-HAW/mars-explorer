const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
    new ForkTsCheckerWebpackPlugin(),

    /* TODO: muss das rüberkopiert werden, wenn in Resources?
    new CopyWebpackPlugin(
        {
            patterns: [{
                from: path.resolve(__dirname, '..', 'resources', 'workspace'),
                to: path.resolve(__dirname, '..', '.webpack/renderer', 'workspace')
            }],
        }
    )
     */
];
