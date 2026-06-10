// catalog.js — catalog page module
import { initNav } from './nav.js';
import { fetchProducts, renderProductCard, renderSkeletons, attachCardEvents } from './products.js';
import { debounce } from './utils.js';

const SORT_KEY = 'amondbeauty_sort_pref';

let allProducts = [];
let activeFilter = 'all';
let activeSortEl = null;

document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  await initCatalog();
  readURLFilter();
});

async function initCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  renderSkeletons(8, grid);

  allProducts = await fetchProducts();
  if (!allProducts.length) {
    grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:3rem 0;">No products found. Please try again later.</p>';
    return;
  }

  // Restore saved sort
  const savedSort = localStorage.getItem(SORT_KEY) || 'default';
  const sortEl = document.getElementById('sort-select');
  if (sortEl) {
    sortEl.value = savedSort;
    sortEl.addEventListener('change', () => {
      localStorage.setItem(SORT_KEY, sortEl.value);
      renderCatalog();
    });
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCatalog();
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(renderCatalog, 250));
  }

  renderCatalog();
  attachCardEvents(grid, allProducts);
}

function readURLFilter() {
  const params = new URLSearchParams(window.location.search);
  const filter = params.get('filter');
  if (filter && ['shampoo', 'conditioner'].includes(filter)) {
    activeFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderCatalog();
  }
}

function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  const countEl = document.getElementById('products-count');
  const searchInput = document.getElementById('search-input');
  const sortEl = document.getElementById('sort-select');
  if (!grid) return;

  const query = searchInput?.value.trim().toLowerCase() || '';
  const sortVal = sortEl?.value || 'default';

  // Filter
  let filtered = allProducts.filter(p => {
    const matchType = activeFilter === 'all' || p.type === activeFilter;
    const matchSearch = !query
      || p.name.toLowerCase().includes(query)
      || p.hairType.toLowerCase().includes(query)
      || p.scent.toLowerCase().includes(query)
      || p.description.toLowerCase().includes(query);
    return matchType && matchSearch;
  });

  // Sort using array method
  filtered = [...filtered].sort((a, b) => {
    if (sortVal === 'price-asc')  return a.price - b.price;
    if (sortVal === 'price-desc') return b.price - a.price;
    if (sortVal === 'rating')     return b.rating - a.rating;
    if (sortVal === 'name')       return a.name.localeCompare(b.name);
    // default: best sellers first, then by rating
    const bsA = a.badge === 'Best Seller' ? 0 : 1;
    const bsB = b.badge === 'Best Seller' ? 0 : 1;
    return bsA - bsB || b.rating - a.rating;
  });

  if (countEl) {
    countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
  }

  if (!filtered.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:4rem 0;">
        <p style="font-size:1.1rem; color:var(--muted); margin-bottom:1rem;">No products match your search.</p>
        <button class="btn btn-ghost" onclick="document.getElementById('search-input').value=''; window.catalog?.renderCatalog()">Clear search</button>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(renderProductCard).join('');
  // Re-attach events after re-render
  attachCardEvents(grid, allProducts);
}

// Expose for inline clear button
window.catalog = { renderCatalog };
