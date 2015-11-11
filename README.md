# node-proxy-dev
a proxy server wrapper for frontend development, easy to modify or replace remote files.

## INSTALL

```sh
npm i -g proxy-dev
```

## USAGE
You can use this package by cli parameters or config file, and use `pd` for shotcut of `proxy-dev`

### cli

like the example below, you start a proxy server and target to website `https://github.com`, `-o/--open` means auto open browser. you can use 'proxy-dev -h' to see all available options.
```sh
proxy-dev -t https://github.com -o
```



### config file

use 'proxy-dev -i' to generate a config file in current directory, it will be load automatically if it exists.

it's a js module file like below:

```js
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
  // custome confit for node-http-proxy, see https://github.com/nodejitsu/node-http-proxy
  httpProxyConfig: { },
  noCache: true,
  open: true
}
```

## License

MIT
