// background.js

// change color
let color = '#3aa757';
chrome.runtime.onInstalled.addListener(() => {
    console.dir(chrome.storage)
  chrome.storage.sync.set({ color });
  console.log('background.js color set to %cgreen', `color: ${color}`);
});


/** CORS****************
// Ajax.request('https://gql.reddit.com/','post', {id:'xxx'}).then(d=>console.log(d))
// Ajax.request('http://m:8000/','get').then(d=>console.log(d))
 * allow CORS Header
 * refer old: https://stackoverflow.com/questions/53172613/modifying-response-headers-in-chrome-extensions
 * refer new: https://stackoverflow.com/questions/15532791/getting-around-x-frame-options-deny-in-a-chrome-extension/69177790#69177790
 * https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en
 */
