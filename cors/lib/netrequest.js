app.netrequest = {
  "display": {
    "badge": {
      "text": async function (e) {
        if (chrome.declarativeNetRequest) {
          var displayActionCountAsBadgeText = e !== undefined ? e : true;
          await chrome.declarativeNetRequest.setExtensionActionOptions({
            "displayActionCountAsBadgeText": displayActionCountAsBadgeText
          });
        }
      }
    }
  },
  "engine": {
    "rules": {
      "get": function () {
        return new Promise((resolve, reject) => {
          app.storage.load(function () {
            if (chrome.declarativeNetRequest) {
              if (app.netrequest.rules.scope === "dynamic") {
                chrome.declarativeNetRequest.getDynamicRules().then(resolve).catch(reject);
              } else {
                chrome.declarativeNetRequest.getSessionRules().then(resolve).catch(reject);
              }
            }
          });
        });
      },
      "update": function (options) {
        return new Promise((resolve, reject) => {
          app.storage.load(function () {
            if (chrome.declarativeNetRequest) {
              if (app.netrequest.rules.scope === "dynamic") {
                chrome.declarativeNetRequest.updateDynamicRules(options).then(resolve).catch(reject);
              } else {
                chrome.declarativeNetRequest.updateSessionRules(options).then(resolve).catch(reject);
              }
            }
          });
        });
      }
    }
  },
  "rules": {
    "stack": [],
    /*  */
    set scope (val) {app.storage.write("rulescope", val)},
    get scope () {return app.storage.read("rulescope") !== undefined ? app.storage.read("rulescope") : "dynamic"},
    /*  */
    "update": async function () {
      var rules = await app.netrequest.engine.rules.get();
      if (rules && rules.length) {
        var removeRuleIds = rules.map(function (e) {return e.id});
        await app.netrequest.rules.remove.by.ids(removeRuleIds);
      }
      /*  */
      var addRules = app.netrequest.rules.stack;
      if (addRules && addRules.length) {
        await app.netrequest.engine.rules.update({
          "addRules": addRules
        });
      }
    },
    "push": function (e) {
      if (e) {
        if (e.action && e.condition) {
          var id = app.netrequest.rules.find.next.available.id();
          if (id) {
            app.netrequest.rules.stack.push({
              "id": id,
              "action": e.action,
              "condition": e.condition,
              "priority": e.priority !== undefined ? e.priority : 1
            });
          }
        }
      }
    },
    "add": async function (e) {
      if (e) {
        if (e.id && e.action && e.condition) {
          await app.netrequest.engine.rules.update({
            "removeRuleIds": [e.id],
            "addRules": [
              {
                "id": e.id,
                "action": e.action,
                "condition": e.condition,
                "priority": e.priority !== undefined ? e.priority : 1
              }
            ]
          });
        }
      }
    },
    "find": {
      "next": {
        "available": {
          "id": function () {
            var target = 1;
            /*  */
            var addRules = app.netrequest.rules.stack;
            if (addRules && addRules.length) {
              var addRulesIds = addRules.map(function (e) {return e.id}).sort(function (a, b) {return a - b});
              if (addRulesIds && addRulesIds.length) {
                for (var index in addRulesIds) {
                  if (addRulesIds[index] > -1 && addRulesIds[index] === target) {
                    target++;
                  }
                }
              }
            }
            /*  */
            return target;
          }
        }
      }
    },
    "remove": {
      "by": {
        "ids": async function (removeRuleIds) {
          if (removeRuleIds && removeRuleIds.length) {
            await app.netrequest.engine.rules.update({
              "removeRuleIds": removeRuleIds
            });
          }
        },
        "action": {
          "type": async function (type, key) {
            if (type) {
              var rules = await app.netrequest.engine.rules.get();
              if (rules && rules.length) {
                var removeRuleIds = rules.filter(function (e) {
                  if (e) {
                    if (e.action) {
                      if (e.action.type === type) {
                        if (key) {
                          if (key in e.action) {
                            return true;
                          }
                        } else {
                          return true;
                        }
                      }
                    }
                  }
                  /*  */
                  return false;
                }).map(function (e) {
                  return e.id;
                });
                /*  */
                await app.netrequest.rules.remove.by.ids(removeRuleIds);
                app.netrequest.rules.stack = await app.netrequest.engine.rules.get();
              }
            }
          }
        }
      }
    }
  }
};
