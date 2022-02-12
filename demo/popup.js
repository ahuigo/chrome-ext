/***
 *
 * get dom title via chrome.tabs.sendMessage
 */
document.addEventListener('DOMContentLoaded', function(event) {
    let btn = document.getElementById('getTitle')
    btn.value="ha"
    btn.onclick=getTitle
});

function getTitle() {
  showTitle({title:"..."});
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'getTitle' },
        function (response) {
          showTitle(response);
        }
      );
    }
  );
}

function showTitle(response) {
    console.log(response)
    document.getElementById('title').value=response.title;
}



/***
 * change dom color via chrome.scripting.executeScript
 */
// Initialize button color
let changeColor = document.getElementById("changeColor");
chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});


// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

