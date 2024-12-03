// doc2: https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest?hl=zh-cn
//  “declarativeNetRequest”和“declarativeNetRequestWithHostAccess”权限 它们的功能相同两者的区别在于 请求或同意: 只能改headers，不能改body
const allResourceTypes = Object.values(
  chrome.declarativeNetRequest.ResourceType,
);

// https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#type-RuleActionType
// 支持: BLOCK, ALLOW, MODIFY_HEADERS, REDIRECT
const rules = [
  {
    id: 1,
    priority: 1,
    action: {
      // modify request header1
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: [
        {
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          header: "x-forwarded-for",
          value: "8.8.8.8",
        },
      ],
    },
    condition: {
      urlFilter: "http://m:4500/dump/modify-request-header",
      // urlFilter: "https://www.bing21.com/",
      resourceTypes: allResourceTypes,
    },
  },
  {
    id: 2,
    priority: 1,
    action: {
      // add response header
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      responseHeaders: [
        {
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          header: "x-test-response-header",
          value: "test-value",
        },
      ],
    },
    condition: {
      //chrome network 观察不到
      //只能：fetch('http://m:4500/dump/modify-response-header/any').then(async d=>{console.log(...d.headers)})
      //或: response.headers.get('x-test-response-header')
      urlFilter: "/dump/modify-response-header",
      resourceTypes: allResourceTypes,
    },
  },
];

/* 1. modifying headers of request
 * refer:  https://stackoverflow.com/questions/3274144/can-i-modify-outgoing-request-headers-with-a-chrome-extension
 */
chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: rules.map((rule) => rule.id), // remove existing rules
  addRules: rules,
});
