/**
 * extension lifetime:
 * 1. onInstalled
 */
function extInstalled() {
  console.log("extension installed fired");
  const color = "#3aa757";
  chrome.storage.sync.set({ color });
}
async function extStartup() {
  console.log("chrome started fired(not extension started)");
}

//  1. fired when a Chrome extension is first loaded and whenever the browser starts up
chrome.runtime.onStartup.addListener(extStartup);
// 2. fired when the extension is first installed
chrome.runtime.onInstalled.addListener(extInstalled);
