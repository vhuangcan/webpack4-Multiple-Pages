const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const config = require('./path.config')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpackConfig = require("./webpack.base.config")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

//代码打包后大小分析
if (config.prod.codeAnalyz) {
  module.exports.plugins.push(new BundleAnalyzerPlugin())
}

const mergedConfig = merge(webpackConfig, {
  stats: {
    warnings: false
  },
  //压缩代码
  optimization: {
    minimizer: [
      //压缩js
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
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
    // 每次打包前，先清空原来目录中的内容
    new CleanWebpackPlugin(
        resolve(config.output),
        {
          verbose: false,
          root: resolve('../'),
          //排除
          exclude: ['storage', 'favicon.ico', 'index.php', 'oldbrowser.html']
        }
    ),
    //将图片目录复制到生产目录下
    new CopyWebpackPlugin([
      {
        from: resolve('./src/images'),
        to: resolve(config.output + '/images'),
        ignore: ['.*']
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: resolve('./src/assets'),
        to: resolve(config.output + '/assets'),
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


//html构建
//pagesBuild()

function pagesBuild() {
  const key = Object.keys(webpackConfig.entry)
  const value = Object.values(webpackConfig.entry)
  let htmlPlugin
  value.forEach((v, i) => {
    //删除热重载代码
    fs.readFile(v, 'UTF8', (err, data) => {
      if (!(data.indexOf(str) === -1)) {
        return
      }
      let newData = data.replace(/if \(module.hot\) \{module.hot.accept\(\)\}/g, '')
      fs.appendFileSync(v, newData);
    })

    if (!v.includes('More')) {
      const local = location(v)
      htmlPlugin = new HtmlWebpackPlugin({
        filename: local.match(/(\w+(\/+)){2}\w+\.html/g)[0],
        chunks: ['common', key[i]],
        template: local,
        hash: false,
        minify: false
      })
      mergedConfig.plugins.push(htmlPlugin)
    } else {
      const pageMore = glob.sync(location(v).replace(/\w+\.html$/, '*'))
      pageMore.forEach((v) => {
        const htmlPlugin = new HtmlWebpackPlugin({
          filename: v.match(/(\w+(\/+)){2}\w+\.html/g)[0],
          chunks: ['common', key[i]],
          template: `${v}`,
          hash: false,
          minify: false
        })
        mergedConfig.plugins.push(htmlPlugin)
      })
    }
  })
  const includeAssets = new HtmlWebpackIncludeAssetsPlugin({
    files: ['view/**/*.html'],
    assets: ['lib/vendor.dll.js'],
    append: false,
    hash: false
  })
  const includeHightCharts = new HtmlWebpackIncludeAssetsPlugin({
    files: ['view/productDetails/currencyDetails.html', 'view/productDetails/exchangeDetails.html'],
    assets: ['lib/highstock.js'],
    append: false,
    hash: false
  })
  mergedConfig.plugins.push(includeHightCharts)
  mergedConfig.plugins.push(includeAssets)
}

function resolve(src) {
  return path.join(__dirname, '..', src)
}

function location(local) {
  return local.replace(/(js)|(\.js)/g, function (match, key1, key2) {
    return key1 ? 'view' : key2 ? '.html' : ''
  })
}

module.exports = mergedConfig





