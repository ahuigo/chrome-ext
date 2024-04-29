/**
 * sends a request to the specified url via a form.
 */
export function requestForm(method = "post", url, data) {
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
