module.exports = {
  'target': 'https://yzhen123.github.io/',
  'port': 8000,
  replaceRules: [{
      regex: /<p(.*?)>(.*?)<\/p>/g,
      replace: '<p$1>I have being replaced, plz go to <a href="https://yzhen123.github.io/">real site</a></p>'
    }],
  rawMiddlewares: [function (rep, res, next) {
    next()
  }],
  httpProxyConfig: { //https://github.com/nodejitsu/node-http-proxy

  },
  noCache: true,
  open: true
}
