var chunks = [];
var entries = {};
var htmlWebpackPlugins = [];
var glob = require("glob");
var path = require('path');
var webpack = require('webpack');
var srcDir = path.resolve(__dirname, "./src");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SpritesmithPlugin = require("webpack-spritesmith");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var isProduction = process.env.NODE_ENV == "production";
glob.sync(`${srcDir}/views/**/index.ts`).forEach(file => {
    const srcDirPosix = srcDir.replace(/\\+/g, "/");
    const array = file.replace(/^\//, "").split("/");
    const srcDirArray = `${srcDirPosix}/views`.replace(/^\//, "").split("/");
    const index = array.slice(srcDirArray.length, array.length-1).join("/");
    entries[index] = file;
    chunks.push(index);
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      "template": `${srcDir}/views/${index}/index.html`, //模板
      "filename": `${index}.html`, //生成文件名
      "hash": false, //是否加上hash
      "chunks": ["common", index], //添加进去的js chunk
      "xhtml": true, // 是否用<tag />表示自闭合
      "chunksSortMode": "dependency", // chunk排序方式
      "minify": !isProduction ? false : { // 是否压缩
        "removeComments": true,
        "collapseWhitespace": true
      }
    }))
})

module.exports = {
  entry: entries,
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: `[name]/[name].js${isProduction ? '?v=[chunkhash]' : ''}`,
    chunkFilename: `[id]/[id].js${isProduction ? '?v=[chunkhash]' : ''}`
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          }
          // other vue-loader options go here
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
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: "title"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "")
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}