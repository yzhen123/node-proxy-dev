var http = require('http'),
    httpProxy = require('http-proxy'),
    connect = require('connect'),
    harmon = require('harmon'),
    vagrantSelect = require('./vagrantSelect');

var selects = [];
// var simpleselect = {};
//
// simpleselect.query = '<html>';
// simpleselect.func = function (node) {
//
//
// 	var rs = node.createReadStream();
// 	var ws = node.createWriteStream();
//
// 	rs.pipe(through2(function (chunk, enc, callback) {
//     // console.log(chunk.toString()+'\n================');
//     if(chunk){
//       chunk = chunk.toString()
//         .replace('/staticng_static/js/card/main.js', 'http://127.0.0.1:8080/proxy/main.js')
//         .replace('http://dae-pre83.douban.com', 'http://127.0.0.1:8000')
//         .replace('<script src="/staticng_static/js/card/ga.js"></script>', '')
//       chunk = new Buffer(chunk,'utf-8')
//     }
//     this.push(chunk)
//     callback()
//    })).pipe(ws);
// }
//
// selects.push(simpleselect);

selects.push(vagrantSelect)
// selects.push(linkHandler)

//
// Basic Connect App
//

var app = connect();

var proxy = httpProxy.createProxyServer({
   target: 'http://dae-pre83.douban.com/',
   changeOrigin: true
})

app.use(harmon([], selects));
app.use(function (req, res) {
         proxy.web(req, res);
      })



http.createServer(app).listen(8000);
