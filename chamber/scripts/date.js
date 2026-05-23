
const yearEl = document.querySelector("#currentyear");
const modifiedEl = document.querySelector("#lastModified");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (modifiedEl) {
  modifiedEl.textContent = `Last Modified: ${document.lastModified}`;
}