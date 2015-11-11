require('./polyfill')

var http = require('http'),
  httpProxy = require('http-proxy'),
  connect = require('connect'),
  middleware = require('./middleware')


module.exports = {
  _config: {},
  startServer: function(config) {
    this.config = config
    var app = connect()
    var proxy = httpProxy.createProxyServer(Object.assign({
      target: config.target,
      changeOrigin: true
    }, config.httpProxyConfig))
    var defaultMiddleware = function(res) {
      if (config.noCache) {
        res.setHeader('CacheControl', 'no-cache')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '-1')
      }

      res.html = ''
      res.customWrite = function(data) {
        var _this = this
        if (res.isHtml) {
          res.html += data
        } else {
          res.originWrite(data)
        }
      }
      res.customEnd = function() {
        if (res.isHtml) {
          config.replaceRules && config.replaceRules.forEach(function(pair) {
            res.html = res.html.replace(pair.regex, pair.replace)
          })
          res.originWrite(res.html)
        }
        res.originEnd()
      }
    }

    config.middlewares && config.middlewares.forEach(function(config) {
      app.use(middleware(config))
    })
    config.rawMiddlewares && config.rawMiddlewares.forEach(function(middleware) {
      app.use(middleware)
    })

    app.use(middleware(defaultMiddleware));
    app.use(function(req, res) {
      proxy.web(req, res);
    })
    this.server = http.createServer(app)
    this.server.listen(config.port)
  }
}
