const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = [
  // JS config
  {
    entry: {
      app: ['./src/home.js'],
      vendors: ['vue', 'moment', 'axios', 'tween.js', 'tingle.js', 'firebase', 'localforage', 'please-wait']
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
  // CSS config
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
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })
    ]
  }
];
