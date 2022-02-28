// called by document_start.js
if (window.location.hostname=='m'){
    Object.defineProperty(navigator, 'platform', {
        get: function(){
            return "Android"
    }});
}

function cleanZhihu(){
    // copy selector
    switch(location.pathname){
        case '/hot':
        case '/':
            location.href='https://geektutu.com/post/hpg-range.html'
            break
        default:
            document.querySelector('#root  header').remove()
    }
}
(function init(){
    switch(location.hostname){
        case 'www.zhihu.com':
        case 'zhihu.com': cleanZhihu();break;
    }
    console.log(location.href)
})()


console.log("new navigator.platform:", navigator.platform)
