
// ── Timestamp hidden field ───────────

const timestampField = document.querySelector("#timestamp");
if (timestampField) {
  timestampField.value = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short"
  });
}

// ── Modal logic ────

// Open modals via "Learn More" buttons
document.querySelectorAll(".learn-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-modal");
    const modal = document.querySelector(`#${modalId}`);
    if (modal) modal.showModal();
  });
});

// Close via ✕ button
document.querySelectorAll(".modal-close").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest("dialog").close();
  });
});

// Close via "Close" button at bottom
document.querySelectorAll(".modal-close-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest("dialog").close();
  });
});

// Close when clicking the backdrop
document.querySelectorAll(".membership-modal").forEach(modal => {
  modal.addEventListener("click", e => {
    const rect = modal.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top  ||
      e.clientY > rect.bottom;
    if (clickedOutside) modal.close();
  });
});
