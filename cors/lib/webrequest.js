app.webrequest = {
  "on": {
    "before": {
      "request": {
        "listener": function () {},
        "callback": function (callback) {
          app.webrequest.on.before.request.listener = callback;
        },
        "remove": function () {
          if (chrome.webRequest) {
            chrome.webRequest.onBeforeRequest.removeListener(app.webrequest.on.before.request.listener);
          }
        },
        "add": function (e) {
          var options = [];
          var filter = e ? e : {"urls": ["*://*/*"]};
          /*  */
          if (chrome.webRequest) {
            chrome.webRequest.onBeforeRequest.removeListener(app.webrequest.on.before.request.listener);
            chrome.webRequest.onBeforeRequest.addListener(app.webrequest.on.before.request.listener, filter, options);
          }
        }
      }
    }
  }
};
