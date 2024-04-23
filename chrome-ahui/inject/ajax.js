export function addSearchParams(params = {}, oriurl = undefined) {
  const urlInfo = oriurl instanceof URL
    ? oriurl
    : new URL(oriurl || globalThis.location.href);
  const searchParams = new globalThis.URLSearchParams(urlInfo.search);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, "" + value);
    }
  });

  urlInfo.search = searchParams.toString();
  const url = urlInfo.toString();
  return url;
}

/**
 * @param headers
 * @param key
 * @param value
 * @returns
 */
function addHeader(headers, key, value) {
  if (headers instanceof Array) {
    headers.push([key, value]);
  } else if (headers instanceof Headers) {
    headers.set(key, value);
  } else {
    // @ts-ignore:
    headers[key] = value;
  }
  return headers;
}

function addHeaders(headers, newHeaders) {
  for (const [key, value] of Object.entries(newHeaders)) {
    addHeader(headers, key, value);
  }
  return headers;
}

class Callable extends Function {
  constructor() {
    super("return arguments.callee._call(...arguments)");
  }
}

class FetchFactory extends Callable {
  #defaultInit = {};
  #responseHandler;
  #errorHandler;
  #fetchTracer;

  constructor(defaultInit, responseHandler, errorHandler) {
    super();
    this.#defaultInit = defaultInit || {};
    this.#responseHandler = responseHandler;
    this.#errorHandler = errorHandler;
  }

  setResponseHandler(handler) {
    this.#responseHandler = handler;
  }

  // fetch
  async _call(input, init) {
    if (init?.data) {
      if (
        typeof init.data === "string" ||
        init.data instanceof URLSearchParams
      ) {
        init.headers = addHeader(
          init?.headers ?? {},
          "Content-Type",
          "application/x-www-form-urlencoded",
        );
        init.body = init.data;
      } else if (init.data instanceof FormData || init.data instanceof Blob) {
        init.body = init.data;
      } else {
        init.json = init.data;
      }
      delete init.data;
    }
    if (init?.params) {
      input = addSearchParams(init.params, input);
      delete init.params;
    }
    if (init?.json) {
      init.headers = addHeader(
        init?.headers ?? {},
        "Content-Type",
        "application/json",
      );
      init.body = JSON.stringify(init.json);
      delete init.json;
    }
    const newinit = { ...this.#defaultInit, ...(init || {}) };
    const req = new Request(input, newinit);
    try {
      let response;
      if (this.#fetchTracer) {
        response = await this.#fetchTracer(req);
      } else {
        response = await fetch(req);
      }
      const handledResp = this.#responseHandler(response, req);
      return handledResp;
    } catch (e) {
      this.#errorHandler(e, req);
      return Promise.reject(e);
    }
  }

  withHeader(key, value) {
    this.#defaultInit.headers = addHeader(
      this.#defaultInit.headers ?? {},
      key,
      value,
    );
    return this;
  }

  withTracer(tracer) {
    this.#fetchTracer = tracer;
  }

  get(url, init) {
    const options = Object.assign({ method: "GET" }, init);
    return this._call(url, options);
  }
  post(url, init) {
    const options = Object.assign({ method: "POST" }, init);
    return this._call(url, options);
  }
  delete(url, init) {
    const options = Object.assign({ method: "DELETE" }, init);
    return this._call(url, options);
  }
  put(url, init) {
    const options = Object.assign({ method: "PUT" }, init);
    return this._call(url, options);
  }
  patch(url, init) {
    const options = Object.assign({ method: "PUT" }, init);
    return this._call(url, options);
  }
}

const PolicyDict = {
  // Referer will never be set.
  NoReferer: "no-referrer",

  // Referer will not be set when navigating from HTTPS to HTTP.
  NoRefererWhenDowngrade: "no-referrer-when-downgrade",

  // Full Referer for same-origin requests, and no Referer for cross-origin requests.
  SameOrigin: "same-origin",

  // Referer will be set to just the origin, omitting the URL's path and search.
  Origin: "origin",

  // Referer will be set to just the origin except when navigating from HTTPS to HTTP,
  // in which case no Referer is sent.
  StrictOrigin: "strict-origin",

  // Full Referer for same-origin requests, and bare origin for cross-origin requests.
  OriginWhenCrossOrigin: "origin-when-cross-origin",

  // Full Referer for same-origin requests, and bare origin for cross-origin requests
  // except when navigating from HTTPS to HTTP, in which case no Referer is sent.
  StrictOriginWhenCrossOrigin: "strict-origin-when-cross-origin",

  // Full Referer for all requests, whether same- or cross-origin.
  UnsafeUrl: "unsafe-url",
};

/**
 * @param {*} url
 * @param {*} method
 * @param {*} params
 * @param {*} data
 * @returns
 */
function fetchX(method = "get", url, params = null, data = null) {
  const options = {
    credentials: "include",
    mode: "cors",
    method: method,
    headers: new Headers(),
  };
  /*
        headers: {
            'X-requested-with': 'XMLHttpRequest',
            "Accept": "application/json",
            //'content-type':'application/x-www-form-urlencode',
        }, */
  if (data) {
    const body = new FormData(); //不能是object!!!!!
    for (const [k, v] of Object.entries(data)) {
      body.append(k, v);
    }
    options.body = body;
  }

  return fetch(url, options);
}

/**
    fetch('http://localhost:5001').then(response=>response.json()).then(json=>{
        vm.products=json.products
    })
*/

/**
 * sends a request to the specified url via a form.
 */
function requestForm(method = "post", url, data) {
  // The rest of this code assumes you are not using a library.
  // It can be made less verbose if you use one.
  const form = document.createElement("form");
  form.method = method;
  form.action = url;

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = value;
      form.appendChild(hiddenField);
    }
  }
  document.body.appendChild(form);
  form.submit();
}
