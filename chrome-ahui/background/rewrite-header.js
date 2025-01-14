/* see: 
- https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest?hl=zh-cn
- https://juejin.cn/post/7131360582325780510

比较“declarativeNetRequest”和“declarativeNetRequestWithHostAccess” 
相同: 
  1. 都可用于阻止 请求; 将请求重定向到不同的 URL; 修改 请求和响应的 header 。都不能修改响应body
不同：
1. 若申请的是declarativeNetRequest权限，则阻止或升级请求不需要申请"host_permissions"，但是如果需要重定向请求，或者修改请求头，则要申请相应的"host_permissions"

2. 若申请的是declarativeNetRequestWithHostAccess权限，则任何功能都需要申请相应的"host_permissions"。
  */
const allResourceTypes = Object.values(
  chrome.declarativeNetRequest.ResourceType,
); //["script","image","xmlhttprequest",...]

// https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#type-RuleActionType
// 支持: BLOCK, ALLOW, MODIFY_HEADERS, REDIRECT
const rules = [
  {
    id: 1,
    priority: 1,
    action: {
      // modify request header1
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,//modifyHeaders
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
  {
    // 重定向规则：在baidu.com页面中，把带有'/sugrec'的接口请求中，添加wa参数"a132"
    "id": 3,
    "priority": 5,
    "aciton": {
      "type": "redirect",
      "redirect": {
        "transform": {
          "queryTransform": {
            "addOrReplaceParams": [
              {
                "key": "wa",
                "replaceOnly": true,
                "value": "a132"
              }
            ]
          }
        }
      }
    },
    "condition": {
      "urlFilter": "/sugrec",
      "domains": ["||baidu.com"],
      "resourceTypes": ["xmlhttprequest"]
    }
  }
];

/* 1. modifying headers of request
 * refer:  https://stackoverflow.com/questions/3274144/can-i-modify-outgoing-request-headers-with-a-chrome-extension
 */
chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: rules.map((rule) => rule.id), // remove existing rules
  addRules: rules,
});
