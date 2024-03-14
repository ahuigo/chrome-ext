/**
 * Content scripts are executed in an "isolated world" environment.
 * This example will show you how to inject js to web page when `document_start`.
 * See https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions/9517879#9517879
 */
function injectScript(src) {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL(src);
  s.type = "module";
  s.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

injectScript("inject/ajax.js");
injectScript("inject/main.js");
injectScript("inject/cookie.js");

// 1. This window.ht1 could be read by document_end.js
// 2. But window.ht1 is isolated with tab's window.
Window.prototype.ht1 = "ht1";
