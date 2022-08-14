/**
 * Content scripts are executed in an "isolated world" environment.
 * This example will show you how to inject js to web page when `document_start`.
 * See https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions/9517879#9517879 
  */
function injectScript(src) {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(src);
    s.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}
injectScript('document_start_inject.js')
injectScript('inject/ajax.js')
