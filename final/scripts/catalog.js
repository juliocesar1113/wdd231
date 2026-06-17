// catalog.js — catalog page module
import { initNav } from './nav.js';
import { fetchProducts, renderProductCard, renderSkeletons, attachCardEvents } from './products.js';
import { debounce } from './utils.js';

const SORT_KEY = 'amondbeauty_sort_pref';

let allProducts = [];
let activeFilter = 'all';

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
    grid.innerHTML = '<div class="ab-empty-state"><p>No products found. Please try again later.</p></div>';
    return;
  }

  const savedSort = localStorage.getItem(SORT_KEY) || 'default';
  const sortEl = document.getElementById('sort-select');
  if (sortEl) {
    sortEl.value = savedSort;
    sortEl.addEventListener('change', () => {
      localStorage.setItem(SORT_KEY, sortEl.value);
      renderCatalog();
    });
  }

  document.querySelectorAll('.ab-filter-action').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('.ab-filter-action').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderCatalog();
    });
  });

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
    document.querySelectorAll('.ab-filter-action').forEach(btn => {
      const match = btn.dataset.filter === filter;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-pressed', String(match));
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

  let filtered = allProducts.filter(p => {
    const matchType = activeFilter === 'all' || p.type === activeFilter;
    const matchSearch = !query
      || p.name.toLowerCase().includes(query)
      || p.hairType.toLowerCase().includes(query)
      || p.scent.toLowerCase().includes(query)
      || p.description.toLowerCase().includes(query);
    return matchType && matchSearch;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortVal === 'price-asc')  return a.price - b.price;
    if (sortVal === 'price-desc') return b.price - a.price;
    if (sortVal === 'rating')     return b.rating - a.rating;
    if (sortVal === 'name')       return a.name.localeCompare(b.name);
    const bsA = a.badge === 'Best Seller' ? 0 : 1;
    const bsB = b.badge === 'Best Seller' ? 0 : 1;
    return bsA - bsB || b.rating - a.rating;
  });

  if (countEl) {
    countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
  }

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="ab-empty-state">
        <p>No products match your search.</p>
        <button class="ab-action ab-action-ghost" id="clear-search-action">Clear search</button>
      </div>`;
    document.getElementById('clear-search-action')?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      renderCatalog();
    });
    return;
  }

  grid.innerHTML = filtered.map(renderProductCard).join('');
  attachCardEvents(grid, allProducts);
}
