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
function cleanSelectors(selectors){
    for(const q of selectors){
        const dom = document.querySelector(q)
        dom && dom.remove()
    }
}

function cleanBilibili(){
    console.log('clean bilibili')
    const selectors = [
        '#bili-header-container',
        '#biliMainHeader',
        'div>.right-container',
        //'div>.App-main .SearchSideBar',
        //'#reco_list',
    ]
    cleanSelectors(selectors)
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
        console.log({c2:window._config})
    }, 5000)

    console.log('document_end:',location.href)
})()

