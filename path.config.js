module.exports = {
  //入口路径
  entry: './src/js/**/*.js',
  //输出路径
  output: '../lubi_data_home/public/wap',
  //输出文件js路径
  js: 'js/[name]/[name].js',
  //开发环境配置
  dev: {
    //图片路径
    imgSrc: '../../'
  },
  //生产环境配置
  prod: {
    //打包后的代码块分析
    codeAnalyz: false,
    //图片路径
    imgSrc: '../../',
    //生产环境下dll路径
    dll: './src/lib/vendor-manifest.json',
    //生产环境下css路径
    css: 'css/layout/layoutVw.css',
  },
  //px-to-rem配置
  rem: {
    //px-to-rem路径
    cssRem: 'css/layout/layoutRem.css'
  }
}
