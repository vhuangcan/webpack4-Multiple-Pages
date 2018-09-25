const webpack = require('webpack');
const os = require('os');
const path = require('path');
const glob = require('glob');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackConfig = require('./webpack.base.config');


const mergedConfig = merge(webpackConfig, {
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, '..', 'src/'),
    clientLogLevel: "none",
    host: getIp(),
    hot: true,
    overlay: true,
    stats: {
      warnings: false
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 30000,
          name: 'common'
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
});


//多页面html构建
pagesBuild();

//多页面html构建 带more表示1js对多页面
function pagesBuild() {
  const key = Object.keys(webpackConfig.entry);
  const value = Object.values(webpackConfig.entry);
  let htmlPlugin;
  value.forEach((v, i) => {
    if (!v.includes('More')) {
      const local = location(v);
      console.log(local.match(/(\w+(\/+)){2}\w+\.html/g)[0])
      htmlPlugin = new HtmlWebpackPlugin({
        filename: local.match(/(\w+(\/+)){2}\w+\.html/g)[0],
        // inject: 'head',
        chunks: ['common', key[i]],
        template: local,
      });
      mergedConfig.plugins.push(htmlPlugin);
    } else {
      const pageMore = glob.sync(location(v).replace(/\w+\.html$/, '*'))
      pageMore.forEach((v) => {
        const htmlPlugin = new HtmlWebpackPlugin({
          filename: v.match(/(\w+(\/+)){2}\w+\.html/g)[0],
          // inject: 'head',
          chunks: ['common', key[i]],
          template: `${v}`,
        });
        mergedConfig.plugins.push(htmlPlugin);
      })
    }
  })
}

//多页面路径查找替换
function location(local) {
  return local.replace(/(js)|(\.js)/g, function (match, key1, key2) {
    return key1 ? 'view' : key2 ? '.html' : ''
  });
}

//ip地址获取
function getIp() {
  const networkInterfaces = os.networkInterfaces();
  const key = Object.keys(networkInterfaces).find((v) => v === 'en0');
  const target = networkInterfaces[key].filter(item => item.family === 'IPv4')[0];
  return target.address
}

module.exports = mergedConfig



