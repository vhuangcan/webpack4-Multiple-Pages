// set NODE_ENV=development
const path = require('path')
const glob = require('glob')
const config = require('./path.config')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const devMode = process.env.NODE_ENV !== 'production'
//多线程打包
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
// 设置入口文件路径
const SRC_PATH = resolve(config.entry)
// 打包后的资源根目录（本地物理文件路径）
const TEMPLATE_BUILD_PATH = resolve(config.output)

const webpackConfig = {
  entry: getEntries(SRC_PATH),

  output: {
    path: TEMPLATE_BUILD_PATH,
    filename: config.js
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.vue'],
    alias: {
      'css': resolve('./src/css'),
      'view': resolve('./src/view'),
      'js': resolve('./src/js/')
    }
  },
  //外部依赖
  // externals: {
  //   'Highcharts': 'highcharts/highstock.src.js'
  // },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {loader: 'happypack/loader?id=happyBabel'},
        exclude: /node_modules/
      },
      {
        include: resolve('./src/assets'),
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: devMode ? 1 : 1,
              name: 'assets/[name].[ext]',
              publicPath: devMode ? config.dev.imgSrc : config.prod.imgSrc
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
              publicPath: devMode ? config.dev.imgSrc : config.prod.imgSrc
            }
          }
        ]
      },
      // {
      //   include: rootDir('./fonts'),
      //   test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options:
      //         {
      //           limit: 8192,
      //           mimetype: 'application/font-woff',
      //           name: 'fonts/[name].[ext]'
      //         }
      //     }
      //   ]
      // },
      // {
      //   test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 10000,
      //         name: 'videos/[name].[ext]'
      //       }
      //     }
      //   ],
      // },
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      },
      {
        include: resolve('./src/css/common/layout.scss'),
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader?min=false'
      }
    ]
  },

  plugins: [
    //对js转码进行多线程处理
    new HappyPack({
      //用id来标识 happypack处理那类文件
      id: 'happyBabel',
      //如何处理  用法和loader 的配置一样
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
    })
  ]
}

//开启查找入口文件
function getEntries(entryDir) {
  let files = glob.sync(entryDir),
      entries = {};
  files.forEach(function (path) {
    if (!path.includes('common') && !path.includes('priceTrendMap')) {
      let fileName = path.match(/\w+\.js/, 'g')[0].replace(/\.js/, '');
      entries[fileName] = path;
    }
  });
  return entries;
}

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = webpackConfig



