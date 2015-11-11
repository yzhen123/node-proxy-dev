#!/usr/bin/node
require('../lib/polyfill')

var program = require('commander'),
  fs = require('fs'),
  proxyDev = require('../lib/proxy-dev'),
  child = require('child_process'),
  util = require('util'),
  path = require('path')


program
  .version(require('../package.json').version)
  .usage('[options]')
  .description('a proxy server for frontend development, easy to monify or replace remote static files')
  .option('-t, --target <site>', 'the target site')
  .option('-f, --file <path>', 'a node file exports config object')
  .option('-r, --rules <path>', 'a node file exports replaceRules object')
  .option('-p, --port <int>', 'proxy server port', parseInt)
  .option('-c, --no-cache', 'disable cache')
  .option('-o, --open', 'auto open browser')
  .option('-i, --init', 'generate config file')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit()
}


var configFromFile = {}
var defaultConfigFile = './proxy-dev-config.js'

if(program.init ){
  child.exec(util.format('cp %s %s',
    path.resolve(__dirname,'./proxy-dev-config.js.sample'),
    defaultConfigFile))
}

if (program.file && fs.existsSync(program.file)) {
  configFromFile = require(program.file)
} else if (fs.existsSync(defaultConfigFile)) {
  configFromFile = require(process.cwd() + '/' + defaultConfigFile)
}

var configFromCli = {
  target: program.target,
  noCache: program.noCache,
  port: program.port
}

Object.keys(configFromCli).forEach(function(key) {
  if (configFromCli[key] === undefined) {
    delete configFromCli[key]
  }
})

var config = Object.assign({
  noCache: true,
  port: 8000
}, configFromFile, configFromCli)

proxyDev.startServer(config)
console.info('listen at: 127.0.0.1:' + config.port)
if(config.open){
  var url = 'http://127.0.0.1:' + config.port
  if(typeof config.open === 'string'){
    url = config.open
  }
  child.exec("xdg-open "+url)
}
