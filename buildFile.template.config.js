const fs = require('fs');
const path = require("path");
const fileName = ['common', 'index', 'productDetails', 'currencyRank', 'exchangeRank', 'monthRank', 'platform', 'newProduct', 'gainAndDecline']; //创建入口文件名，对应着html、scss文件名
const entryData = 'import \'jquery\'\n' + 'import \'css/common/layout.scss\'';// 入口文件写入初始内容
const scssDate = '';//scss文件写入初始内容
const htmlData = fs.readFileSync(rootDir(`./template.html`));//返回模板HTML内容
//创建目录
fileName.forEach(v => {
  fs.mkdirSync(rootDir(`./src/js/${v}`));
  fs.mkdirSync(rootDir(`./src/css/${v}`));
  fs.mkdirSync(rootDir(`./src/view/${v}`));
});
//创建文件写入内容
fileName.forEach((v) => {
  fs.writeFileSync(rootDir(`./src/js/${v}/${v}.js`), entryData);//创建入口文件并写入初始内容
  fs.writeFileSync(rootDir(`./src/css/${v}/${v}.scss`), scssDate);//创建scss文件并写入初始内容
  fs.appendFileSync(rootDir(`./src/css/common/layout.scss`), `@import '../${v}/${v}';\n`);//创建主scss文件并写入其它页面scss文件
  fs.writeFile(rootDir(`./src/view/${v}/${v}.html`), htmlData, (err) => {
    if (err) {
      throw err;
    } else {
      console.log(`${v}.html、${v}.js、${v}.scss构建完成,下一步开启devSever服务器`);
    }
  });//根据入口文件数量批量创建HTML
});

function rootDir(dir) {
  return path.join(__dirname, '..', dir)
}
