const path = require('path')
const config = require('./path.config')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpackConfig = require("./webpack.base.config")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const mergedConfig = merge(webpackConfig, {

  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },

  stats: {
    warnings: false
  },
  //压缩代码
  optimization: {
    // runtimeChunk: {
    //   name: 'manifest'
    // },
    minimizer: [
      //抽离css样式
      new MiniCssExtractPlugin({
        filename: config.prod.css
      }),
      //css压缩去重处理
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {autoprefixer: {disable: true}, safe: true, discardComments: {removeAll: true}},
      })  // use OptimizeCSSAssetsPlugin
    ],
    //拆分代码
    splitChunks: {
      cacheGroups: {
        commons: {
          //初始块
          chunks: 'initial',
          name: 'common',
          test: /\.jsx?$/,
          minChunks: 3,
          maxInitialRequests: 5,
          minSize: 10000
        },
        styles: {
          name: 'layout',
          test: /\.(sa|sc|c)ss$/,
          minChunks: 2,
          enforce: true
        }
      }
    }
  },
  //扩展功能
  devtool: 'source-map',
  //插件
  plugins: [
    //vendor
    new webpack.DllReferencePlugin({
      manifest: resolve(config.prod.dll),
    }),
    //将图片目录复制到生产目录下
    new CopyWebpackPlugin([
      {
        from: resolve('./src/images'),
        to: resolve(config.output + '/images'),
        ignore: ['.*']
      }
    ]),
    //将外部依赖目录复制到生产目录下
    new CopyWebpackPlugin([
      {
        from: resolve('./src/lib'),
        to: resolve(config.output + '/lib'),
        ignore: ['.*']
      }
    ])
  ]
})

delHotReload()

// watch之前删除热重载代码
function delHotReload() {
  const value = Object.values(webpackConfig.entry)
  value.forEach(v => {
    fs.readFile(v, 'UTF8', (err, data) => {
      let newData = data.replace(/if \(module.hot\) \{module.hot.accept\(\)\}/g, '')
      fs.writeFileSync(v, newData);
    })
  })
}

function resolve(src) {
  return path.join(__dirname, '..', src)
}

module.exports = mergedConfig

