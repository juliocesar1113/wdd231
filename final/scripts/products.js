// products.js — product loading and rendering module
import { renderStars, formatPrice, badgeClass, getProductImageSVG, showToast } from './utils.js';
import { openModal } from './product-dialog.js';

/**
 * Fetch products from local JSON
 */
export async function fetchProducts() {
  try {
    const base = new URL('../data/products.json', import.meta.url);
    const res = await fetch(base.href);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to load products:', err);
    showToast('Could not load products. Please refresh.', '⚠');
    return [];
  }
}

/**
 * Render a single product card HTML string
 */
export function renderProductCard(product) {
  const imgSrc = getProductImageSVG(product);
  const badgeCls = badgeClass(product.badge);
  const badgeHTML = product.badge
    ? `<span class="ab-tile-badge ${badgeCls}">${product.badge}</span>`
    : '';
  const stockBtn = product.inStock
    ? `<button class="ab-tile-action" data-id="${product.id}">Details</button>`
    : `<span class="ab-tile-out-of-stock">Out of stock</span>`;

  return `
    <article
      class="ab-product-tile"
      data-id="${product.id}"
      data-type="${product.type}"
      tabindex="0"
      role="button"
      aria-label="View details for ${product.name}"
    >
      <div class="ab-tile-image">
        ${badgeHTML}
        <img
          src="${imgSrc}"
          alt="${product.name} — ${product.type} bar"
          width="300"
          height="300"
          loading="lazy"
        />
      </div>
      <div class="ab-tile-body">
        <p class="ab-tile-type">${product.type === 'shampoo' ? 'Shampoo Bar' : 'Conditioner Bar'}</p>
        <h3 class="ab-tile-name">${product.name}</h3>
        <p class="ab-tile-hairtype">For: ${product.hairType}</p>
        <div class="ab-tile-rating">
          ${renderStars(product.rating)}
          <span class="ab-tile-rating-num">${product.rating}</span>
          <span class="ab-tile-rating-count">(${product.reviews})</span>
        </div>
        <div class="ab-tile-footer">
          <div>
            <span class="ab-tile-price">${formatPrice(product.price)}</span>
            <span class="ab-tile-weight">${product.weight}</span>
          </div>
          ${stockBtn}
        </div>
      </div>
    </article>
  `;
}

/**
 * Render skeleton loading cards
 */
export function renderSkeletons(count, container) {
  container.innerHTML = Array.from({ length: count }, () => `
    <div class="ab-skeleton-tile">
      <div class="ab-skeleton ab-skeleton-img"></div>
      <div class="ab-skeleton-body">
        <div class="ab-skeleton ab-skeleton-line w40"></div>
        <div class="ab-skeleton ab-skeleton-line w80"></div>
        <div class="ab-skeleton ab-skeleton-line w60"></div>
        <div class="ab-skeleton ab-skeleton-line w40"></div>
      </div>
    </div>
  `).join('');
}

/**
 * Attach click / keyboard events to product cards in a container
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
