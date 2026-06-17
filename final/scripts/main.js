// main.js — home page module
import { initNav } from './nav.js';
import { fetchProducts, renderProductCard, renderSkeletons, attachCardEvents } from './products.js';
import { showToast } from './utils.js';

const PREF_KEY = 'amondbeauty_hair_pref';

document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  await loadFeaturedProducts();
  initPreferences();
  initScrollReveal();
});

async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  renderSkeletons(4, container);

  const products = await fetchProducts();
  if (!products.length) return;

  const savedPref = localStorage.getItem(PREF_KEY);

  let featured;
  if (savedPref && savedPref !== 'all') {
    featured = products
      .filter(p => p.type === savedPref || p.hairType.toLowerCase().includes(savedPref))
      .slice(0, 4);
    if (!featured.length) featured = products.filter(p => p.badge === 'Best Seller');
  } else {
    featured = products.filter(p => p.badge === 'Best Seller' || p.rating >= 4.8).slice(0, 4);
  }
  if (featured.length < 4) {
    const extras = products.filter(p => !featured.includes(p));
    featured = [...featured, ...extras].slice(0, 4);
  }

  container.innerHTML = featured.map(renderProductCard).join('');
  attachCardEvents(container, products);
}

function initPreferences() {
  const widget = document.getElementById('pref-widget');
  if (!widget) return;

  const saved = localStorage.getItem(PREF_KEY) || 'all';
  setActivePreference(saved);

  widget.querySelectorAll('.ab-pref-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.pref;
      localStorage.setItem(PREF_KEY, val);
      setActivePreference(val);
      loadFeaturedProducts();
      showToast(`Showing ${btn.textContent.trim()} products`, '✦');
    });
  });

  document.getElementById('pref-clear')?.addEventListener('click', () => {
    localStorage.removeItem(PREF_KEY);
    setActivePreference('all');
    loadFeaturedProducts();
    showToast('Preference cleared', '↺');
  });
}

function setActivePreference(val) {
  document.querySelectorAll('.ab-pref-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.pref === val);
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}
