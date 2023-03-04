# access inject.js example
Refer: https://stackoverflow.com/questions/9602022/chrome-extension-retrieving-global-variable-from-webpage/9636008#9636008

    contentinject.js ("run_at": "document_end" in manifest):

    var s = document.createElement('script');
    s.src = chrome.extension.getURL('inject.js');
    (document.head||document.documentElement).appendChild(s);
    s.onload = function() {
        s.remove();
    };

    // Event listener
    document.addEventListener('RW759_connectExtension', function(e) {
        // e.detail contains the transferred data (can be anything, ranging
        // from JavaScript objects to strings).
        // Do something, for example:
        alert(e.detail);
    });

inject.js - Located in the extension directory, this will be injected into the page itself:

    setTimeout(function() {
        /* Example: Send data from the page to your Chrome extension */
        document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
            detail: GLOBALS // Some variable from Gmail.
        }));
    }, 0);
