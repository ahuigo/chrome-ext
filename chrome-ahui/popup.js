/***
 * How to debug popup.js?
 *    Right click the extension's button, then 'Inspect Popup'
 */

/**
 * First function: getTitle
 *  1. get dom title via chrome.tabs.sendMessage
 *      1. active tab receive this request via chrome.tabs.sendMessage
 *      1. active tab will send title back 
 *  2. show title in popup.html
 */
document.addEventListener('DOMContentLoaded', function(event) {
    const btn = document.getElementById('getTitle')
    btn.value="ha"
    btn.onclick=getTitle
});

function getTitle() {
  const title = document.querySelector('h1')?.innerText || 'n/a'
  showTitle({title:title + ' from popup.js'});
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs) {
      chrome.tabs.sendMessage( tabs[0].id, { action: 'getTitle' }, function (response) {
          console.log('receive from tab msg:', response?.title);
          setTimeout(()=> showTitle(response), 1000)
        }
      );
    }
  );
}

function showTitle(response) {
    document.getElementById('title').value=response?.title;
}



/***
 * Second function: change dom color via chrome.scripting.executeScript
 * 
 */
// Initialize button color
const changeColorEl = document.getElementById("changeColor");
chrome.storage.sync.get("color", ({ color }) => {
  changeColorEl.style.backgroundColor = color;
});


// When the button is clicked, inject setPageBackgroundColor into current page
changeColorEl.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// injected function to tab 
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

/**
 * 3. TestWindow
 */
function testWindow(){
    // Initialize button color
    const el = document.getElementById("testWindow");
    el.addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: [
            'inject/test-window.js',
        ],
        world: 'MAIN',
      }).then(documents=>{
        console.log(documents[0]);//好像没啥用，只有documentId信息
        // 通信话，请使用chrome.tabs.sendMessage （如上例）
      });
    })
}
testWindow()
