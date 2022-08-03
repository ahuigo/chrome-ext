var config = {};

config.welcome = {
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.custom = {
  set rules (val) {app.storage.write("rules", val)},
  get rules () {return app.storage.read("rules") !== undefined ? app.storage.read("rules") : {}}
};

config.session = {
  "map": {
    set tabs (val) {app.session.write("tabs", val)},
    get tabs () {return app.session.read("tabs") !== undefined ? app.session.read("tabs") : {}}
  }
};

config.addon = {
  set state (val) {app.storage.write("state", val)},
  set whitelist (val) {app.storage.write("whitelist", val)},
  get state () {return app.storage.read("state") !== undefined  ? app.storage.read("state") : "OFF"},
  get whitelist () {return app.storage.read("whitelist") !== undefined ? app.storage.read("whitelist") : []},
  /*  */
  "page": {
    "test": "https://webbrowsertools.com/test-cors/",
    "tutorial": "https://www.youtube.com/watch?v=KruSUqLdxQA"
  }
};

config.cors = {
  set patch (val) {app.storage.write("patch", val)},
  set origin (val) {app.storage.write("origin", val)},
  set methods (val) {app.storage.write("methods", val)},
  set headers (val) {app.storage.write("headers", val)},
  set sub_frame (val) {app.storage.write("sub_frame", val)},
  set main_frame (val) {app.storage.write("main_frame", val)},
  set credentials (val) {app.storage.write("credentials", val)},
  set domain_type (val) {app.storage.write("domain_type", val)},
  get patch () {return app.storage.read("patch") !== undefined ? app.storage.read("patch") : false},
  get origin () {return app.storage.read("origin") !== undefined ? app.storage.read("origin") : false},
  get headers () {return app.storage.read("headers") !== undefined ? app.storage.read("headers") : false},
  get sub_frame () {return app.storage.read("sub_frame") !== undefined ? app.storage.read("sub_frame") : true},
  get main_frame () {return app.storage.read("main_frame") !== undefined ? app.storage.read("main_frame") : true},
  get domain_type () {return app.storage.read("domain_type") !== undefined ? app.storage.read("domain_type") : "all"},
  get credentials () {return app.storage.read("credentials") !== undefined ? app.storage.read("credentials") : false},
  get methods () {return app.storage.read("methods") !== undefined ? app.storage.read("methods") : "PUT, GET, HEAD, POST, DELETE, OPTIONS"}
};