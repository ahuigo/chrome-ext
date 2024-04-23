async function matchExample() {
  await chrome.scripting.registerContentScripts([{
    // matches: ["<all_urls>"],
    // matches: ["*://*/*"],
    matches: ["http://m:4500/*"],
  }]);
}
