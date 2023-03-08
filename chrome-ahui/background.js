/**
 * How to debug background.js?
 *  click `Inspect views: service worker` on extension page
 */
import rules from "./background/rules.js"

/* 1. modifying headers of request
 * refer:  https://stackoverflow.com/questions/3274144/can-i-modify-outgoing-request-headers-with-a-chrome-extension
 */
chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: rules.map((rule) => rule.id), // remove existing rules
  addRules: rules
});

/** 
 * 2. storage: change color
 */
const color = '#3aa757';
chrome.runtime.onInstalled.addListener(() => {
  console.dir(chrome.storage)
  chrome.storage.sync.set({ color }); //on installed
  console.log('background.js color set to %cgreen', `color: ${color}`);
});



/** 3. Todo CORS****************
// Ajax.request('https://gql.reddit.com/','post', {id:'xxx'}).then(d=>console.log(d))
// Ajax.request('http://m:8000/','get').then(d=>console.log(d))
 * allow CORS Header
 * refer old: https://stackoverflow.com/questions/53172613/modifying-response-headers-in-chrome-extensions
 * refer new: https://stackoverflow.com/questions/15532791/getting-around-x-frame-options-deny-in-a-chrome-extension/69177790#69177790
 * https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en
 */
