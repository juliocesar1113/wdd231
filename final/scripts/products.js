// products.js — product loading and rendering module
import { renderStars, formatPrice, badgeClass, getProductImageSVG, showToast } from './utils.js';
import { openModal } from './modal.js';

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
    ? `<span class="ab-card-badge ${badgeCls}">${product.badge}</span>`
    : '';
  const stockBtn = product.inStock
    ? `<button class="ab-card-btn" data-id="${product.id}">Details</button>`
    : `<span class="ab-card-out-of-stock">Out of stock</span>`;

  return `
    <article
      class="ab-product-card"
      data-id="${product.id}"
      data-type="${product.type}"
      tabindex="0"
      role="button"
      aria-label="View details for ${product.name}"
    >
      <div class="ab-card-image">
        ${badgeHTML}
        <img
          src="${imgSrc}"
          alt="${product.name} — ${product.type} bar"
          width="300"
          height="300"
          loading="lazy"
        />
      </div>
      <div class="ab-card-body">
        <p class="ab-card-type">${product.type === 'shampoo' ? 'Shampoo Bar' : 'Conditioner Bar'}</p>
        <h3 class="ab-card-name">${product.name}</h3>
        <p class="ab-card-hair-type">For: ${product.hairType}</p>
        <div class="ab-card-rating">
          ${renderStars(product.rating)}
          <span class="ab-card-rating-num">${product.rating}</span>
          <span class="ab-card-rating-count">(${product.reviews})</span>
        </div>
        <div class="ab-card-footer">
          <div>
            <span class="ab-card-price">${formatPrice(product.price)}</span>
            <span class="ab-card-weight">${product.weight}</span>
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
    <div class="ab-skeleton-card">
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
