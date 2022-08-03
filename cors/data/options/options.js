var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-options") {
          if (request.method === id) {
            tmp[id](request.data);
          }
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {
      tmp[id] = callback;
    },
    "send": function (id, data) {
      chrome.runtime.sendMessage({
        "method": id, 
        "data": data,
        "path": "options-to-background"
      });
    }
  }
})();

var config = {
  "elements": {},
  "render": function (e) {
    config.elements.custom.textContent = '';
    config.elements.patch.checked = e.patch;
    config.elements.origin.top.checked = true;
    config.elements.methods.value = e.methods;
    config.elements.headers.checked = e.headers;
    config.elements.origin.all.checked = e.origin;
    config.elements.sub_frame.checked = e.sub_frame;
    config.elements.main_frame.checked = e.main_frame;
    config.elements.credentials.checked = e.credentials;
    config.elements.whitelist.value = e.whitelist.join(", ");
    config.elements.domain.all.checked = e.domain_type === "all";
    config.elements.domain.first.checked = e.domain_type === "firstParty";
    config.elements.domain.third.checked = e.domain_type === "thirdParty";
    //
    for (var id in e.rules) config.listener.add(e.rules[id]);
  },
  "load": function () {
    config.elements.origin = {};
    config.elements.domain = {};
    /*  */
    config.elements.add = document.getElementById("add");
    config.elements.patch = document.getElementById("patch");
    config.elements.custom = document.getElementById("custom");
    config.elements.domain.all = document.getElementById("all");
    config.elements.methods = document.getElementById("methods");
    config.elements.headers = document.getElementById("headers");
    config.elements.whitelist = document.getElementById("whitelist");
    config.elements.sub_frame = document.getElementById("sub_frame");
    config.elements.main_frame = document.getElementById("main_frame");
    config.elements.origin.top = document.getElementById("origin-top");
    config.elements.origin.all = document.getElementById("origin-all");
    config.elements.credentials = document.getElementById("credentials");
    config.elements.domain.first = document.getElementById("firstParty");
    config.elements.domain.third = document.getElementById("thirdParty");
    /*  */
    config.elements.patch.addEventListener("change", config.listener.patch);
    config.elements.methods.addEventListener("change", config.listener.methods);
    config.elements.headers.addEventListener("change", config.listener.headers);
    config.elements.domain.all.addEventListener("change", config.listener.domain);
    config.elements.domain.first.addEventListener("change", config.listener.domain);
    config.elements.domain.third.addEventListener("change", config.listener.domain);
    config.elements.whitelist.addEventListener("change", config.listener.whitelist);
    config.elements.sub_frame.addEventListener("change", config.listener.sub_frame);
    config.elements.main_frame.addEventListener("change", config.listener.main_frame);
    config.elements.origin.top.addEventListener("change", config.listener.origin.top);
    config.elements.origin.all.addEventListener("change", config.listener.origin.all);
    config.elements.credentials.addEventListener("change", config.listener.credentials);
    config.elements.add.addEventListener("click", function () {config.listener.add('')});
    /*  */
    background.send("load");
    window.removeEventListener("load", config.load, false);
  },
  "listener": {
    "patch": function (e) {
      background.send("patch", e.target.checked);
    },
    "headers": function (e) {
      background.send("headers", e.target.checked);
    },
    "sub_frame": function (e) {
      background.send("sub_frame", e.target.checked);
    },
    "main_frame": function (e) {
      background.send("main_frame", e.target.checked);
    },
    "domain": function () {
      var inputs = [...document.querySelectorAll("input[name='domain']")];
      var domainType = inputs.filter(e => e.checked)[0].id;
      background.send("domain_type", domainType);
    },
    "remove": function (e) {
      const action = window.confirm("Are you sure you want to remove this rule?");
      if (action) {
        const table = e.target.closest("table");
        background.send("remove-custom-rule", {"id": table.id});
      }
    },
    "methods": function (e) {
      var value = "GET, PUT, POST, DELETE, HEAD, OPTIONS";
      if (e.target.value) {
        value = e.target.value.split(',').map(e => e.trim().toLocaleUpperCase()).filter(e => e).join(", ");
      }
      /*  */
      background.send("methods", value);
      e.target.value = value;
    },
    "credentials": function (e) {
      if (e.target.checked) {
        window.setTimeout(function () {
          config.elements.origin.top.click();
        }, 300);
      }
      //
      background.send("credentials", e.target.checked);
    },
    "origin": {
      "top": function () {
        background.send("origin", config.elements.origin.all.checked);
      },
      "all": function () {
        if (config.elements.origin.all.checked) {
          window.setTimeout(function () {
            config.elements.credentials.checked = false;
            background.send("credentials", config.elements.credentials.checked);
          }, 300);
        }
        //
        background.send("origin", config.elements.origin.all.checked);
      }
    },
    "whitelist": function (e) {
      var domains = [];
      if (e) {
        if (e.target) {
          if (e.target.value) {
            var list = e.target.value.split(',');
            domains = list.map(function (item) {
              try {
                item = item.trim();
                return item ? (new URL(item)).hostname : '';
              } catch (e) {
                return item;
              }
            }).filter(function(item, pos, self) {
              return item && self.indexOf(item) === pos;
            });
            /*  */
            e.target.value = domains.join(", ");
          }
        }
      }
      /*  */
      background.send("whitelist", domains);
    },
    "save": function (e) {
      const table = e.target.closest("table");
      //
      let id = Number(table.id);
      let order = table.getAttribute("order");
      let type = table.querySelector(".type").value;
      let origin = table.querySelector(".origin").value;
      let state = table.querySelector(".state").checked;
      let domain = table.querySelector(".domain").value;
      let methods = table.querySelector(".methods").value;
      let headers = table.querySelector(".headers").value;
      let hostname = table.querySelector(".hostname").value;
      let credentials = table.querySelector(".credentials").value;
      //
      if (hostname) {
        if (origin || methods || headers || credentials) {
          //
          try {origin = origin ? (new URL(origin)).origin : origin} catch (e) {}                
          try {hostname = hostname ? (new URL(hostname)).hostname : hostname} catch (e) {}
          try {methods = methods ? methods.split(',').map(e => e.trim()).filter(e => e).join(", ") : methods} catch (e) {}
          try {headers = headers ? headers.split(',').map(e => e.trim()).filter(e => e).join(", ") : headers} catch (e) {}
          //
          background.send("add-custom-rule", {
            "id": id,
            "type": type,
            "state": state,
            "order": order,
            "domain": domain,
            "origin": origin,
            "methods": methods,
            "headers": headers,
            "hostname": hostname,
            "credentials": credentials
          });
        }
      }
    },
    "add": function (rule) {
      const template = document.querySelector("template");
      const node = document.importNode(template.content, true);
      //
      if (node) {
        const table = node.querySelector("table");
        //
        if (table) {
          const save = table.querySelector(".save");
          const state = table.querySelector(".state");
          const remove = table.querySelector(".remove");
          //
          save.addEventListener("click", config.listener.save);
          state.addEventListener("change", config.listener.save);
          remove.addEventListener("click", config.listener.remove);
          //
          if (rule) {
            table.style.order = rule.order;
            table.setAttribute("id", rule.id);
            table.querySelector(".type").value = rule.type;
            table.querySelector(".state").checked = rule.state;
            table.querySelector(".domain").value = rule.domain;
            table.querySelector(".origin").value = rule.origin;
            table.querySelector(".methods").value = rule.methods;
            table.querySelector(".headers").value = rule.headers;
            table.querySelector(".hostname").value = rule.hostname;
            table.querySelector(".credentials").value = rule.credentials;
            table.setAttribute("state", rule.state ? "active" : "inactive");
          } else {
            const min = 100000;
            const max = 1000000;
            table.setAttribute("state", "active");
            table.querySelector(".state").checked = true;
            table.setAttribute("id", Math.floor(Math.random() * (max - min) + min));
            table.setAttribute("order", config.elements.custom.children.length + 1);
          }
        }
        //
        config.elements.custom.appendChild(node);
      }
    }
  }
};

background.receive("storage", config.render);
window.addEventListener("load", config.load, false);
