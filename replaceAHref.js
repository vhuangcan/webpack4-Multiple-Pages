const fs = require('fs');

function MyPlugin(options) {
  // Configure your plugin with options...
}

MyPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', (compilation) => {
    console.log('The compiler is starting a new compilation...');
    compilation.plugin(
        'html-webpack-plugin-before-html-processing',
        (data) => {
          data.html = data.html.replace(/<a\s*href\s*=\s*[\'\"]*([^>\'\"]+)*[\'\"]*/ig, (match, value) => {
            return value.includes('.html') ? `<a href="../${value.split('.')[0]}/${value}"` : `<a href="${value}"`
          });
        }
    )
  })
}

module.exports = MyPlugin
