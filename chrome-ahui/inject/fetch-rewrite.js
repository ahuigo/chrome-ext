(function () {
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return originalFetch.apply(this, args).then(response => {
      const url = args[0];
      if (url instanceof Request) {
        url = url.url;
      }
      if (url?.includes('http://m:4500/dump/modify-response-body')) {
        return response.clone().text().then(text => {
          // Modify the response body here
          const modifiedText = "Modified response body content";
          console.log('Modified fetch response:', modifiedText);
          // Create a new response with the modified text
          const modifiedResponse = new Response(modifiedText, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });

          // Return the modified response
          return modifiedResponse;
        });
      } else {
        return response;
      }
    });
  };
})();