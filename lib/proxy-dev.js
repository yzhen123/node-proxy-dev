require('./polyfill')

var http = require('http'),
  httpProxy = require('http-proxy'),
  connect = require('connect'),
  middleware = require('./middleware')


module.exports = {
  startServer: function(config) {
    this.config = config
    var app = connect()
    var proxy = httpProxy.createProxyServer(Object.assign({
      // target: config.target,
      changeOrigin: true
    }, config.httpProxyConfig))
    var defaultMiddleware = function(req, res) {
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

    config.middlewares && config.middlewares.forEach(function(mid) {
      app.use(middleware(mid))
    })
    config.rawMiddlewares && config.rawMiddlewares.forEach(function(middleware) {
      app.use(middleware)
    })

    app.use(middleware(defaultMiddleware));
    app.use(function(req, res) {
      if(typeof config.target === 'string'){
        proxy.web(req, res, {
          target: config.target
        });
      }else{
        var host = req.headers.host, ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if(config.target[host]){
          proxy.web(req, res, {
            target: config.target[host]
          });
        }else{
          res.write('this host is not found in config.target: '+host)
          res.end()
        }
      }
    })
    this.server = http.createServer(app)
    this.server.listen(config.port)
  }
}
