var zlib = require('zlib')

function middlewareWrapper(middleware, req, res, next) {
    var _writeHead  = res.writeHead;
    var gunzip      = zlib.Gunzip();

    res.originWrite = res.write;
    res.originEnd = res.end;
    middleware && middleware(req, res)

    var write = function (data) {
      if(res.customWrite){
        res.customWrite(data)
      }else{
        res.originWrite(data)
      }
    }
    var end = function () {
      if(res.customEnd){
        res.customEnd()
      }else{
        res.originEnd()
      }
    }

    res.isHtml = false;
    res.isGziped = false;

    res.writeHead = function (code, headers) {
      var contentType = this.getHeader('content-type');
      var contentEncoding = this.getHeader('content-encoding');

      if (((typeof contentType != 'undefined') && (contentType.indexOf('text/html') == 0))) {
        res.isHtml = true;

        res.removeHeader('Content-Length');
        if (headers) {
          delete headers['content-length'];
        }
      }

      if (res.isHtml && contentEncoding && contentEncoding.toLowerCase() == 'gzip') {
          res.isGziped = true;

          res.removeHeader('Content-Encoding');
          if (headers) {
              delete headers['content-encoding'];
          }
     }

      _writeHead.apply(res, arguments);
    };

    res.write = function (data, encoding) {
      if (res.isHtml) {
        if (res.isGziped) {
          gunzip.write(data);
        } else {
          write(data)
        }
      } else {
        res.originWrite(data);
      }
    };

    gunzip.on('data', function (data) {
      write(data)
    });

    res.end = function (data, encoding) {
      if (res.isGziped) {
        gunzip.end(data);
      } else {
        end()
      }
    };

    gunzip.on('end', function (data) {
      end()
    });
    next()
}


/**
function (res) {
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
      res.originWrite(res.html)
    }
    res.originEnd()
  }
}
*/
module.exports = function (config) {
  return function (req, res, next) {
    middlewareWrapper(config, req, res, next)
  }
}
