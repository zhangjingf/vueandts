'use strict';
const glob = require("glob");
const path = require('path');
const webpack = require('webpack');
const srcDir = path.resolve(__dirname, "../src");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const isProduction = process.env.NODE_ENV == "production";

var opts = {
    entries: {},
    plugins: []
}

var entries = {};
var files = glob.sync(`${srcDir}/views/**/index.ts`);
files.forEach(file => {
    const srcDirPosix = srcDir.replace(/\\+/g, "/");
    const array = file.replace(/^\//, "").split("/");
    const srcDirArray = `${srcDirPosix}/views`.replace(/^\//, "").split("/");
    const index = array.slice(srcDirArray.length, array.length - 1).join("/");
    opts.entries[index] = file;
    opts.plugins.push(new HtmlWebpackPlugin({
        "template": './default.ejs', 
        "filename": `${index}/${index}.html`, 
        "hash": false, //是否加上hash
        "chunks": ["common", index], //添加进去的js chunk
        "chunksSortMode": "dependency",
        "title": [index],
        "minify": {
            caseSensitive: false,//是否大小写敏感
            removeComments: true,//去除注释
            removeEmptyAttributes: true,//去除空属性
            collapseWhitespace: true//是否去除空格
        }
    }))
});
var status = {
    clean: {
        plugin: new CleanWebpackPlugin(['../dist'])
    },
    commonBundle: {
        plugin: new webpack.optimize.CommonsChunkPlugin({
            name: 'common' // 指定公共 bundle 的名称。
        })
    },
    sprites: {
        plugin: new SpritesmithPlugin({
            src: {
		        cwd: path.resolve(__dirname, '../src/images/icons/'),
		        glob: '*.png'
		      },
		    target: {
		        image: path.resolve(__dirname, '../src/images/sprite.png'),
		        css: [
		          [path.resolve(__dirname, '../src/scss/sprites.scss'), {
		            format: 'scss_template_mustache'
		          }]
		        ]
		      },
		    spritesmithOptions: {
		        algorithm: "binary-tree",
		        padding: 8
		      },
		    customTemplates: {
		        scss_template_mustache: path.resolve(__dirname, 'scss.template.mustache')
		    }
        })
    }
}
Object.keys(status).forEach(name => {
    opts.plugins.push(status[name].plugin);
})

module.exports = {
    entry: opts.entries,
    plugins: opts.plugins,
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: `[name]/[name].js${isProduction ? '?v=[chunkhash]' : ''}`
    },
    module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              loaders: {
                'scss': 'vue-style-loader!css-loader!sass-loader',
                'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
              }
            }
          },
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
              appendTsSuffixTo: [/\.vue$/],
            }
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
          },
          {
              test: /\.(jpe?g|png|gif|svg)$/,
              loader: 'url-loader',
              options: {
                  limit: '1024',
                  name: 'images/[name]-[hash:8].[ext]'
              }
          },
          {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: 'url-loader',
              options: {
                  limit: '1024',
                  name: 'font/[name]-[hash:8].[ext]'
              }
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        }
      },
};