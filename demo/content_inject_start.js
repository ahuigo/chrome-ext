// is called by document_start.js
function initUA(){
    Object.defineProperty(navigator, 'platform', {
        get: function(){
            return "Android"
    }});
    Object.defineProperty(navigator, 'userAgent', {
        get: function(){
            return "User-Agent: Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
    }});
}

function cleanZhihu(){
    // copy selector
    switch(location.pathname){
        case '/hot':
        case '/zvideo':
        case '/':
            //location.href='https://geektutu.com/post/hpg-range.html'
            location.href='https://www.reddit.com/r/Deno/'
            break
        default:
            let h = document.querySelector('#root  header')
            h && h.remove()
            h = document.querySelector('div>.App-main .SearchSideBar')
            h && h.remove()

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
        case 'm2': initUA();break;
    }
    proxyCookie();
    console.log(location.href)
})()
console.log("new navigator.platform:", navigator.platform)
