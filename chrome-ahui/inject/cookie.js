// cookie proxy ///////////////////////////////////////
function proxyCookie() {
  const cookieDesc =
    Object.getOwnPropertyDescriptor(Document.prototype, "cookie") ||
    Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "cookie");
  if (cookieDesc && cookieDesc.configurable) {
    Object.defineProperty(document, "cookie", {
      get: function () {
        return cookieDesc.get.call(document);
      },
      set: function (val) {
        console.log("set cookie", val);
        //debugger;
        //alert('set cookie:'+val)
        cookieDesc.set.call(document, val);
      },
    });
  }
}
// proxyCookie();
