const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
  // 1st Entry for JS config
  {
    entry: {
      app: ['./src/home.js'],
      vendors: ['vue', 'moment', 'axios', 'milligram', 'tween.js', 'tingle.js']
    },
    output: {
      path: './dist/js',
      filename: '[name].bundle.js'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.common.js' // 'vue/dist/vue.common.js' for webpack 1
      }
    }
  },
  // 2nd Entry for CSS config
  {
    entry: {
      app: './src/scss/globals.scss'
    },
    output: {
      path: './dist/css',
      filename: '[name].bundle.css',
    },
    module: {
      loaders: [{
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      }]
    },
    plugins: [
      new ExtractTextPlugin("app.bundle.css"),
      new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.bundle.js'),
      new webpack.optimize.UglifyJsPlugin()
    ]
  }
];
