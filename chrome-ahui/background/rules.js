const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);

// chrome.declarativeNetRequest.Rule[]
export default [
  {
    id: 1,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: [
        {
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          header: 'x-forwarded-for',
          value: '8.8.8.8',
        },
      ]
    },
    condition: {
        // http://m:4500/dump/modify-request-header
      urlFilter: 'https://www.bing21.com/',
      resourceTypes: allResourceTypes,
    }
  },
  {
    id: 2,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      responseHeaders: [
        {
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          header: 'x-test-response-header',
          value: 'test-value',
        },
      ]
    },
    condition: {
       //chrome network 观察不到
       //只能：fetch('http://m:4500/dump/modify-response-header/any').then(async d=>{console.log(...d.headers)})
      //或: response.headers.get('x-test-response-header')
      urlFilter: '/dump/modify-response-header',
      resourceTypes: allResourceTypes,
    }
  },
];
