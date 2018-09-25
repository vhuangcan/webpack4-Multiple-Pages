/**
 * Created by H
 * User: huangcan
 * Date: 2018/8/25
 * Time: 下午2:52
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')


const jsDir = location('public/wap/js/**/*.js')
const cssDir = location('public/wap/css/layout/*.css')
const cssName = getEntries(cssDir)['layout']
const jsName = getEntries(jsDir)

const phpName = glob.sync(location('resources/views/wap/**/*.php'))

function writeFile() {
  // 批量修改js
  phpName.forEach((v, i) => {
    if (!v.includes('common')) {
      let dirName = v.match(/\w+\./i)[0].replace(/\./, '')
      if (dirName === 'error') dirName = 'searchError'
      if (dirName === 'detail') dirName = 'notice'
      if (dirName === 'master') dirName = 'common'
      const reg = new RegExp(`${dirName}\\.\\w+\\.js`, 'ig')
      fs.readFile(v, 'utf8', (err, files) => {
        if (err) throw err;
        let result = files.replace(reg, jsName[dirName])
        if (dirName === 'common') {
          result = result.replace(/layout\.\w+\.css/ig, cssName)
        }
        fs.writeFile(v, result, 'utf8', (err) => {
          if (err) return console.log(err)
        })
      })
    }
  })
}

writeFile()

function getEntries(entryDir) {
  let files = glob.sync(entryDir),
      entries = {}
  files.forEach(function (path) {
    let fileName = path.match(/\w+\.\w+\.(js|css)/, 'g')[0],
        dirName = path.match(/\w+\./i)[0].replace(/\./, '')
    entries[dirName] = fileName
  });
  return entries;
}

function location(dir) {
  return path.join(__dirname, '..', `../lubi_data_home/${dir}`)
}

