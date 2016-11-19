var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/main'
  ],
  output: {
    path: path.resolve('./dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: false,
      filename: 'index.html',
//      favicon: './src/static/favicon.ico',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },{ test: /\.json$/, loader: 'json' },]
  }
};
