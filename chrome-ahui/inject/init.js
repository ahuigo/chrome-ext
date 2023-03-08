console.log('import ./init.js via es6 import')

export function initUaEdge(){
    console.log('initUaEdge')
  Object.defineProperty(navigator, 'userAgent', {
      get: function(){
          return "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.50"
  }});
}

export function initUA(){
    /*
    Object.defineProperty(navigator, 'platform', {
        get: function(){
            return "Android",//"MacIntel",
    }});
    */
    Object.defineProperty(navigator, 'userAgent', {
        get: function(){
            return "User-Agent: Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
    }});
}