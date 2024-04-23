/**
 * 2. storage
 */
function storage() {
  const color = "#3aa757";
  // console.dir(chrome.storage);
  // 1. listen
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed. Old value was "${oldValue}", new value is "${newValue}".`,
      );
    }
  });

  // 2.1 Set sync(sync to goole account)
  chrome.storage.sync.set({ color }); //on installed
  console.log("background.js color set to %cgreen", `color: ${color}`);

  // 2.2 Set local(save in local storage)
  chrome.storage.local.set({ key: "value" }, function () {
    // console.log("Value is set !");
  });

  // 3. get
  chrome.storage.local.get(["key"], function (result) {
    console.log("current stored value is ", result.key);
  });
}

storage();
