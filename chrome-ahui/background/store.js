/**
 * extension lifetime:
 * 1. onInstalled
 */
const color = "#3aa757";
chrome.runtime.onInstalled.addListener(() => {
  // console.dir(chrome.storage);
  chrome.storage.sync.set({ color }); //on installed
  // console.log("background.js color set to %cgreen", `color: ${color}`);
});
