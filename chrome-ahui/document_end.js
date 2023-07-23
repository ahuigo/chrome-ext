/**
 * 1. listen event from popup/options/background
 */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request?.action === 'getTitle') {
      getTitle(request, sender, sendResponse);
      // this is required to use sendResponse asynchronously
      return true;
    }
  }
);
function getTitle(request, sender, sendResponse) {
  console.log({request, sender, sendResponse})
  const title = document.querySelector('h1')?.innerText || 'no title'
  return sendResponse({ title: title });
}

/**
 * 2. clean page
 */
function cleanBaidu(){
    const div=document.querySelector('#content_right')
    if(div){
        div.remove()
    }
}


// handle website
function cleanZhihu(){
    const selectors = [
        'div>.App-main .SearchSideBar',
        '.Question-sideColumn',
        '#root  header',
    ]
    cleanSelectors(selectors)
}
function sleep(t){
    return new Promise((r)=>setTimeout(r,t))
}

async function cleanSelectors(selectors, hide=false){
    let i=5
    while(i-->0){
        for(const q of selectors){
            const dom = document.querySelector(q)
            dom && (i=0)
            if(hide){
                dom && (dom.style.display='none')
            }else{
                dom && dom.remove()
            }
            
        }
        if(i<=0){
            break
        }
        console.log('wait remain',i)
        await sleep(200)
    }
}

function cleanBilibili(){
    console.log('clean bilibili')
    const selectors = [
        //'#biliMainHeader .mini-header',
        //'#biliMainHeader .left-entry',
        //'#biliMainHeader .right-entry',
        '#biliMainHeader .right-entry--message',
        //'.reco_list',//右侧推荐
        '#internationalHeader',
        '#bili-header-container',
    ]
    cleanSelectors(selectors)
    const r=document.querySelector('div>.right-container')
    if(r){
        const tmp = []
        const subs = [ '#v_upinfo', '#multi_page' ]
        for(const q of subs){
            const dom = document.querySelector(q)
            dom && tmp.push(dom)
        }
        r.innerHTML=''
        for(const d of tmp){
            r.appendChild(d)
        }
    }
}
(function init(){
    switch(location.hostname){
        case 'www.zhihu.com':
        case 'zhihu.com': cleanZhihu();break;
        case 'www.baidu.com': cleanBaidu();break;
    }
    if(location.hostname.match(/\.bilibili\.com$/)){
        //cleanBilibili();
        setTimeout(cleanBilibili,600);
        //setTimeout(cleanBilibili,1500);
    }
    setTimeout(()=>{
        console.debug({c2:window._config});// undefined, 因为和tab 的window是隔离
    }, 5000)

    console.debug('document_end url:',location.href)
})();

/**
 * 3. set window in document_end.js
 */
(function setWindow(){
  const ht2 = window.document.querySelector('body').outerHTML.slice(0,10)+' ...'; //能获取
  Window.prototype.ht2 = ht2
  Object.prototype.ht3 = 'ht3'
  setTimeout(()=>{
        console.debug({ht1:window.ht1, window_h2:window.ht2}); // 有值, 但是与page的window 是隔离的
  }, 1000)
})();
