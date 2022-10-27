// listen for checkForWord request, call getTags which includes callback to sendResponse
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === 'getTitle') {
      getTitle(request, sender, sendResponse);
      // this is required to use sendResponse asynchronously
      return true;
    }
  }
);

// Returns title
function getTitle(request, sender, sendResponse) {
  var hnode = document.getElementsByTagName('h1')[0];
    let title = hnode.innerText || "no title"
  return sendResponse({ title: title });
}

function cleanBaidu(){
    let div=document.querySelector('#content_right')
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

async function cleanBilibili(){
    console.log('clean bilibili')
    const selectors = [
        '#reco_list',//推荐
        '#internationalHeader',
        '#biliMainHeader',
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
        cleanBilibili()
    }
    setTimeout(()=>{
        console.debug({c2:window._config})
    }, 5000)

    console.debug('document_end:',location.href)
})()

