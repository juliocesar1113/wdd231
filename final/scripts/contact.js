// contact.js — contact page module
import { initNav } from './nav.js';
import { showToast } from './utils.js';

const DRAFT_KEY = 'amondbeauty_contact_draft';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initForm();
  restoreDraft();
});

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = form.querySelectorAll('input[required], select[required], textarea[required]');

  // Save draft to localStorage as user types
  fields.forEach(field => {
    field.addEventListener('input', saveDraft);
  });

  // Real-time validation on blur
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    fields.forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      showToast('Please fix the errors above.', '⚠');
      // Focus first invalid field
      form.querySelector('.invalid')?.focus();
      return;
    }

    // Build form data object
    const data = Object.fromEntries(new FormData(form));
    data.timestamp = new Date().toLocaleString('en-US');

    // Save to localStorage for thank-you page
    localStorage.setItem('amondbeauty_submission', JSON.stringify(data));

    // Clear draft
    localStorage.removeItem(DRAFT_KEY);

    // Redirect to thank-you page
    window.location.href = 'thankyou.html';
  });
}

function validateField(field) {
  const group = field.closest('.form-group');
  const errorEl = group?.querySelector('.field-error');
  let message = '';

  if (field.required && !field.value.trim()) {
    message = 'This field is required.';
  } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    message = 'Please enter a valid email address.';
  } else if (field.name === 'phone' && field.value && !/^[\d\s\-()+]{7,}$/.test(field.value)) {
    message = 'Please enter a valid phone number.';
  }

  field.classList.toggle('invalid', !!message);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.toggle('visible', !!message);
  }
  return !message;
}

function saveDraft() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const data = {};
  new FormData(form).forEach((v, k) => { data[k] = v; });
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (_) { /* storage full, ignore */ }
}

function restoreDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    const data = JSON.parse(saved);
    const form = document.getElementById('contact-form');
    if (!form) return;
    Object.entries(data).forEach(([key, value]) => {
      const el = form.elements[key];
      if (el && el.type !== 'checkbox') el.value = value;
    });
    showToast('Draft restored from your last visit.', '↺');
  } catch (_) { /* ignore */ }
}
