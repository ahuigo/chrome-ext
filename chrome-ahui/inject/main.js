// this main.js is injected by document_start.js
import { initUA, initUaEdge } from "./init-ua.js";
import * as zhihu from "./zhihu.js";

(function init() {
  switch (location.hostname) {
    case "www.zhihu.com":
    case "zhihu.com":
      zhihu.cleanZhihu();
      break;
    case "www.bilibili.com":
      zhihu.cleanBilibili();
      break;
    case "m2":
      initUA();
      break;
    default:
      switch (true) {
        case /\.bing-test\.com$/.test(location.hostname):
          initUaEdge();
          break;
      }
  }
})();
//console.log("new navigator.platform:", navigator.platform)
