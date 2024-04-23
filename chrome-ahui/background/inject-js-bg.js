function scriptExectueFunc(tabDetail) {
  // v2:
  // chrome.tabs.executeScript(details.tabId, { });
  // v3:
  chrome.scripting.executeScript({
    target: { tabId: tabDetail.tabId },
    // files: ['content.js'],
    func: () => {
      window.xahui = 123;
      document.addEventListener("visibilitychange", (e) => {
        console.log("change visibilityState...", document.visibilityState);
        Object.defineProperty(Document.prototype, "visibilityState", {
          get() {
            return "visible";
          },
        });
      }, false);
    },
  });
}

// Via chrome.scripting.executeScript(service worker)
// 1. permission: "webNavigation", "scripting","tabs",
// 2. lifetime: onBeforeNavigate -> onCommitted -> [onDOMContentLoaded] -> onCompleted
chrome.webNavigation.onCompleted.addListener(function (tabDetail) {
  console.log("inject tab js(webNavigation.onCompleted)");
  scriptExectueFunc(tabDetail);
}, { url: [{ urlMatches: "http://m:4500/*" }] });

// **Via chrome.scripting.registerContentScripts**
const registerScripts = async () => {
  try {
    await chrome.scripting.unregisterContentScripts();
    await chrome.scripting.registerContentScripts([{
      matches: ["http://m:4500/*"],
      js: ["data/page.js"],
      id: "page-script",

      // refer to: https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#isolated_world
      // "world": "ISOLATED", // Default
      "world": "MAIN", // share the execution environment with the host page's JavaScript.

      "allFrames": true,
      "matchOriginAsFallback": true,
      "runAt": "document_start",
    }]);
  } catch (e) {
    console.error("Blocker Registration Failed", e);
  }
};
chrome.runtime.onInstalled.addListener(registerScripts);
