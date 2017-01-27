const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
  // 1st Entry for JS config
  {
    entry: {
      app: ['./src/app.js', './src/home.js', './src/play.js'],
      vendors: ['./vendor/js/vue.js'],
    },
    output: {
      path: './dist/js',
      filename: '[name].bundle.js',
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
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
    ]
  }
];
