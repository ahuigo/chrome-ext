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

function hasHeader(headers, key) {
  if (headers instanceof Array) {
    return headers.some(([k]) => k === key);
  } else if (headers instanceof Headers) {
    return headers.has(key);
  } else {
    return key in headers;
  }
}
/**
 * @param headers
 * @param key
 * @param value
 * @returns
 */
function setHeader(headers, key, value) {
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

function setHeaders(headers, newHeaders) {
  for (const [key, value] of Object.entries(newHeaders)) {
    setHeader(headers, key, value);
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
  withResponseHandler(handler) {
    return new FetchFactoryAlias(
      this.#defaultInit,
      handler,
      this.#errorHandler,
    );
  }
  withErrorHandler(errHandler) {
    return new FetchFactoryAlias(
      this.#defaultInit,
      this.#responseHandler,
      errHandler,
    );
  }

  // fetch
  async _call(input, init) {
    if (init?.data) {
      if (
        typeof init.data === "string" ||
        init.data instanceof ArrayBuffer ||
        init.data instanceof Number ||
        typeof init.data === "number" ||
        init.data instanceof URLSearchParams
      ) {
        if (!hasHeader(init?.headers ?? {}, "Content-Type")) {
          init.headers = setHeader(
            init?.headers ?? {},
            "Content-Type",
            "application/x-www-form-urlencoded",
          );
        }
        init.body = `${init.data}`;
      } else if (init.data instanceof FormData || init.data instanceof Blob) {
        init.body = init.data;
      } else {
        init.headers = setHeader(
          init?.headers ?? {},
          "Content-Type",
          "application/x-www-form-urlencoded",
        );
        init.body = Object.entries(init.data)
          .map(
            ([key, val]) =>
              encodeURIComponent(key) + "=" + encodeURIComponent(val),
          )
          .join("&");
      }
      delete init.data;
    }
    if (init?.params) {
      input = addSearchParams(init.params, input);
      delete init.params;
    }
    if (init?.json !== undefined) {
      init.headers = setHeader(
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
    this.#defaultInit.headers = setHeader(
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

const FetchFactoryAlias = FetchFactory;

export { FetchFactoryAlias as FetchFactory };
export default FetchFactory;

export const PolicyDict = {
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

/*
Object.values(PolicyDict).forEach(policy => {
  fetch(url, {referrerPolicy: policy});
});
*/

export const fetchx = new FetchFactory(
  {
    mode: "cors",
    credentials: "include", // include cookie
  },
  function responseDefaultHandler(response, request) {
    return Promise.resolve(response);
  },
  function errorHandler(err, req) {
    const url = req.url;
    const msg = `can't access: ${url.slice(0, 200)}\n`;
    console.error(msg, err);
    throw Error(err);
  },
);
// window.addSearchParams = addSearchParams;
window.fetchx = fetchx;
window.fetchjson = fetchx.withResponseHandler(async (response, req) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
});
