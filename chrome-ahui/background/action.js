function testAction() {
  chrome.action.setBadgeText({ text: "ahui" });
  chrome.action.setBadgeBackgroundColor({ color: "#b16464" });
  chrome.action.setTitle({
    title: "ahuigo's extension",
  });

  chrome.action.onClicked.addListener((tab) => {
    // The action.onClicked event won't be sent if the extension action has specified a popup to show on click of the current tab.
    console.log("click tab:", tab);
  });
}
testAction();
