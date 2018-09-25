/**
 * Created by H
 * User: huangcan
 * Date: 2018/9/14
 * Time: 上午10:24
 */

const path = require('path');
const config = require('./path.config');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TEMPLATE_BUILD_PATH = resolve(config.output);

module.exports = {
  entry: resolve('config/cssLocal.js'),

  output: {
    path: TEMPLATE_BUILD_PATH,
    filename: config.js
  },

  resolve: {
    extensions: ['.scss'],
    alias: {
      'css': resolve('./src/css'),
      'js': resolve('./src/js/')
    }
  },

  module: {
    rules: [
      {
        include: resolve('./src/assets'),
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              name: 'assets/[name].[ext]',
              publicPath: config.prod.imgSrc
            }
          }
        ]
      },
      {
        include: resolve('./src/images'),
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              name: 'images/[name].[ext]',
              publicPath: config.prod.imgSrc
            }
          }
        ]
      },
      {
        include: resolve('./src/css/common/layout.scss'),
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },

  stats: {
    warnings: false
  },

  optimization: {
    minimizer: [
      //抽离css样式
      new MiniCssExtractPlugin({
        filename: config.rem.cssRem
      })
    ],
    //拆分代码
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'layoutRem',
          test: /\.(sa|sc|c)ss$/,
          minChunks: 2,
          enforce: true
        }
      }
    }
  },
}


function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

