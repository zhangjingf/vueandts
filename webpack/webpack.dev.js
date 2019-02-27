const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: `[name]/[name].js}`
    },
    devServer: {
        contentBase: './dist/index'
    }
});