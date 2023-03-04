// is called by document_start.js
function initUA(){
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

function initUaEdge(){
    console.log('initUaEdge')
    Object.defineProperty(navigator, 'userAgent', {
        get: function(){
            return "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.50"
    }});
}

function twork(){
    // ahui idea
    //location.href='https://geektutu.com/post/hpg-range.html'
    //location.href='https://www.reddit.com/r/Deno/'
    location.href='https://m:4500/idea'
}
function cleanZhihu(){
    // copy selector
    switch(location.pathname){
        case '/hot':
        case '/zvideo':
        case '/':
            return twork()
        default:
            let h = document.querySelector('#root  header')
            h && h.remove()
            h = document.querySelector('div>.App-main .SearchSideBar')
            h && h.remove()
    }
}
function cleanBilibili(){
    const blackPaths = [
        /^\/$/,
        /^\/v\//,
    ]
    for(const bpath of blackPaths){
        if(location.pathname.match(bpath)){
            twork(); 
        }
    }
}


// cookie proxy ///////////////////////////////////////
function proxyCookie(){
    var cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                 Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
    if (cookieDesc && cookieDesc.configurable) {
        Object.defineProperty(document, 'cookie', {
            get: function () {
                return cookieDesc.get.call(document);
            },
            set: function (val) {
                console.log("set cookie",val);
                //debugger;
                //alert('set cookie:'+val)
                cookieDesc.set.call(document, val);
            }
        });
    }
}

(function init(){
    switch(location.hostname){
        case 'www.zhihu.com':
        case 'zhihu.com': cleanZhihu();break;
        case 'www.bilibili.com': cleanBilibili(); break;
        case 'm2': initUA();break;
        default:
            switch (true) {
              case /\.bing211\.com$/.test(location.hostname):
                    initUaEdge();
                    break;
            }
    }
    //proxyCookie();
    //console.debug(location.href)
})()
//console.log("new navigator.platform:", navigator.platform)
