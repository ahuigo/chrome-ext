async function loopTabs() {
  chrome.tabs.query({
    currentWindow: false,
    active: false,
    url: "https://test.app/",
  }, async (tabs) => {
    if (tabs.length === 0) return;
    for (var i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      chrome.tabs.update(tab.id, { selected: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          console.log("background inject ...");
        },
      })
        .then(() => console.log("injected a function"));
      break;
    }
  });
}
