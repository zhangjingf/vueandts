const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const express = require("express");
var app = express();
app.use(express.static('dist'));
var server = app.listen(9000);
module.exports = merge(common, {
    devtool: 'inline-source-map',
    // devServer: {
    //     contentBase: path.join(__dirname, "../dist"),
    //     compress: true,
    //     port: 9000
    // }
});