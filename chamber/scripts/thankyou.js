
const params = new URLSearchParams(window.location.search);

function setField(id, paramKey, fallback = "Not provided") {
  const el = document.querySelector(`#${id}`);
  if (el) el.textContent = params.get(paramKey) || fallback;
}

setField("s-firstname", "first-name");
setField("s-lastname",  "last-name");
setField("s-email",     "email");
setField("s-phone",     "phone");
setField("s-orgname",   "org-name");
setField("s-timestamp", "timestamp");
