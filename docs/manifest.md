# manifest.json结构

# background
独立进程,只有一个进程,无法访问dom 

# `content_scripts`
每个网页会独立运行,可以访问dom, 可以inject js

## `run_at`
`run_at` 指的是插入内容脚本（content scripts）的时间点。它有以下几个可选值：默认值就是 `"document_idle"`。

    "document_start"：在文档被解析之后，其他任何脚本运行之前立即插入。也就是说，这时候仅 DOMContentLoaded 和 load 事件尚未发生，仅存在 <html> 和 <head> 两个元素。

    "document_end"：在文档完成解析之后，但在 DOMContentLoaded 事件触发之前立即插入。也就是说，在这个时候，文档对象模型（DOM）已经加载完毕，但可能尚未应用所有的 CSS 样式和图像，而且 DOMContentLoaded 和 load 事件尚未发生。

    "document_idle"：在没有挂起的布局或样式更改，没有 JavaScript 微任务，没有正在运行或即将运行的资源加载（例如 <script>, <link rel="stylesheet">）时插入。 

# popup && options
popup 与 options 可以通过chrome.storage.sync.set 交互数据

    "action": {
      "default_popup": "popup.html"
    },
    "options_page": "options.html",

## popup
每个页面是独立的, 可以通过chrome.tabs.sendMessage跟content scripts(chrome.runtime.onMessage)通信

## options
options_page 是全局性的

# permissions
权限控制