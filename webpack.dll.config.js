const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const vendors = [
  'jquery',
  'fastclick',
  'better-scroll'
];
module.exports = {
  output: {
    path: path.join(__dirname, '..', './src/lib'),
    filename: '[name].dll.js',
    library: '[name]_[hash]',
  },
  entry: {
    "vendor": vendors,
  },
  plugins: [
    new UglifyJsPlugin({
      parallel: true,
      cache: true,
      uglifyOptions: {
        mangle: true,
        output: {comments: false},
        compressor: {
          warnings: false,
          drop_console: true,
          drop_debugger: true
        }
      },
      exclude: /\.min\.js$/,
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, '..', '/src/lib/[name]-manifest.json'),
      name: '[name]_[hash]',
    })
  ]
};
