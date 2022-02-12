# chrome extension example 
    ├── background.js   //  init js when install extension
    ├── content.js      // access & write page dom
    └── stackoverflow_content.js
    ├── document_start.js   // access & write page be

    // inject js, see https://developer.chrome.com/docs/extensions/mv3/content_scripts/
    ├── inject_start.js 

config: 

```javascript
{
    "name": "ahuigo dev",
    "version": "1.0",
    "description": "ahui dev",
    "manifest_version": 3,
    "background": {
      "service_worker": "background.js"
    },

    // access & write page dom
    "content_scripts": [
      {
            "matches": ["<all_urls>"],
            "js": ["document_start.js"],
            "run_at": "document_start" //default document end
      },
      {
        "matches": ["*://*.stackoverflow.com/*"],
        "js": ["stackoverflow_content.js"]
      },

      // 
      {
          "matches": ["<all_urls>"],
          "js": ["content.js"],
          "run_at": "document_end"
        }
    ],
    "web_accessible_resources": [{
      "resources": ["inject_start.js"],
      "matches": ["<all_urls>"]
    }],

    // click popup page
    "action": {
      "default_popup": "popup.html"
    },

    // extension icon's option menu
    "options_page": "options.html",

    // permissions
    "host_permissions": [
        "https://*/*"
    ],
    "permissions": [
        "tabs",
      "contextMenus",
      "storage", "activeTab", "scripting"
    ]
  }
```
