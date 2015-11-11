
Object.assign = function () {
  var obj = typeof arguments[0] === 'object' ? arguments[0] : {}
  for (var i = 1; i < arguments.length; i++) {
    var nextObj = arguments[i]
    if(typeof nextObj === 'object'){
      Object.keys(nextObj).forEach(function (key) {
        obj[key] = nextObj[key]
      })
    }
  }
  return obj
}
