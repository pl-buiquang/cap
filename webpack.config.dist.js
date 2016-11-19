var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
    './src/main'
  ],
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    publicPath: '/',
    library: "CapCarto",
  },
  resolve: {
    root: [path.resolve('./src'), path.resolve('./node_modules')],
    extensions: ['', '.js', '.jsx', '.json'],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify('production'),
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     unused: true,
    //     dead_code: true,
    //     warnings: false
    //   }
    // })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src')
    },
    { test: /\.json$/, loader: 'json' },
    ]
  }
}
