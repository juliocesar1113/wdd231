// products.js product loading and rendering module
import { renderStars, formatPrice, badgeClass, getProductImageSVG, showToast } from './utils.js';
import { openModal } from './modal.js';

/**
 * Fetch products from local JSON
 * @returns {Promise<Array>}
 */
export async function fetchProducts() {
  try {
    // Build path relative to the scripts folder /
    const base = new URL('../data/products.json', import.meta.url);
    const res = await fetch(base.href);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to load products:', err);
    showToast('Could not load products. Please refresh.', 'âš ');
    return [];
  }
}

/**
 * Render a single product card HTML string
 * @param {Object} product
 * @returns {string}
 */
export function renderProductCard(product) {
  const imgSrc = getProductImageSVG(product);
  const badgeCls = badgeClass(product.badge);
  const badgeHTML = product.badge
    ? `<span class="card-badge ${badgeCls}">${product.badge}</span>`
    : '';
  const stockBtn = product.inStock
    ? `<button class="card-btn" data-id="${product.id}">Details</button>`
    : `<span class="card-out-of-stock">Out of stock</span>`;

  return `
    <article
      class="product-card"
      data-id="${product.id}"
      data-type="${product.type}"
      tabindex="0"
      role="button"
      aria-label="View details for ${product.name}"
    >
      <div class="card-image">
        ${badgeHTML}
        <img
          src="${imgSrc}"
          alt="${product.name} â€” ${product.type} bar"
          width="300"
          height="300"
          loading="lazy"
        />
      </div>
      <div class="card-body">
        <p class="card-type">${product.type === 'shampoo' ? 'Shampoo Bar' : 'Conditioner Bar'}</p>
        <h3 class="card-name">${product.name}</h3>
        <p class="card-hair-type">For: ${product.hairType}</p>
        <div class="card-rating">
          ${renderStars(product.rating)}
          <span class="card-rating-num">${product.rating}</span>
          <span class="card-rating-count">(${product.reviews})</span>
        </div>
        <div class="card-footer">
          <div>
            <span class="card-price">${formatPrice(product.price)}</span>
            <span class="card-weight">${product.weight}</span>
          </div>
          ${stockBtn}
        </div>
      </div>
    </article>
  `;
}

/**
 * Render skeleton loading cards
 * @param {number} count
 * @param {HTMLElement} container
 */
export function renderSkeletons(count, container) {
  container.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line w40"></div>
        <div class="skeleton skeleton-line w80"></div>
        <div class="skeleton skeleton-line w60"></div>
        <div class="skeleton skeleton-line w40"></div>
      </div>
    </div>
  `).join('');
}

/**
 * Attach click / keyboard events to product cards in a container
 * @param {HTMLElement} container
 * @param {Array} products
 */
export function attachCardEvents(container, products) {
  container.addEventListener('click', (e) => {
    const card = e.target.closest('[data-id]');
    if (!card) return;
    const id = parseInt(card.dataset.id, 10);
    const product = products.find(p => p.id === id);
    if (product) openModal(product);
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('[data-id]');
      if (!card) return;
      e.preventDefault();
      const id = parseInt(card.dataset.id, 10);
      const product = products.find(p => p.id === id);
      if (product) openModal(product);
    }
  });
}