const postcss = require('postcss');
const adaptive = require('postcss-adaptive');
const fs = require('fs');
const path = require('path');
const config = require('./path.config');
const {exec} = require('child_process');
const TEMPLATE_BUILD_PATH = resolve(config.output);


exec(`rm -rf ${TEMPLATE_BUILD_PATH }/js/main`)


fs.readFile(`${TEMPLATE_BUILD_PATH}/${config.rem.cssRem}`, 'utf8', (err, data) => {
  if (err) throw err;
  let newCssText = postcss().use(adaptive({remUnit: 75, autoRem: true})).process(data).css;
  fs.writeFile(`${TEMPLATE_BUILD_PATH}/${config.rem.cssRem}`, newCssText, 'utf8', (err) => {
    if (err) return console.log(err)
  })
})

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
