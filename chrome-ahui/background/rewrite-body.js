// doc: https://developer.chrome.com/docs/extensions/reference/api/webRequest?hl=zh-cn
//  manifest.json:
//   "permissions": [
//     "webRequest",
//     "webRequestBlocking",
//   ],
console.log('rewrite body2:');
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log('rewrite webRequest before');
    fetch(details.url)
      .then(response => response.text())
      .then(body => {
        console.log('rewrite body:', body);
        const modifiedBody = body.replace(/originalText/g, 'modifiedText');
        // Here you can handle the modified body as needed
        console.log('modified body:', modifiedBody);
      })
      .catch(error => {
        console.error('Failed to fetch and modify response:', error);
      });
  },
  {
    urls: [
      "http://m:4500/dump/*",
      // "<all_urls>"
    ]
  },
  // ["blocking"], //只支持manifest v2, v3不支持
  ["requestBody"]
);

return new Proxy(globalThis.fetch, {
  apply: async (target, thisArg, argumentsList) => {
    const req = new Request(...argumentsList);
    const url = req.url || (argumentsList[0] && argumentsList[0].url);

    if (url && url.startsWith("http://m:4500/dump/")) {
      const response = await target.apply(thisArg, argumentsList);
      const body = await response.text();
      const modifiedBody = body.replace(/originalText/g, 'modifiedText');
      return new Response(modifiedBody, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }

    return target.apply(thisArg, argumentsList);
  }
});