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
    // copy selector
    switch(location.pathname){
        default:
            let h = document.querySelector('div>.App-main .SearchSideBar')
            h && h.remove()
            h = document.querySelector('#root  header')
            h && h.remove()

    }
}
(function init(){
    switch(location.hostname){
        case 'www.zhihu.com':
        case 'zhihu.com': cleanZhihu();break;
        case 'www.baidu.com': cleanBaidu();break;
    }
    console.log('document_end:',location.href)
})()

