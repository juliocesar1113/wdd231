// modal.js — product detail modal module
import { renderStars, formatPrice, getProductImageSVG } from './utils.js';

let overlay;
let currentProduct = null;

function buildModal() {
  overlay = document.createElement('div');
  overlay.className = 'ab-dialog-overlay';
  overlay.id = 'product-dialog';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Product details');
  overlay.innerHTML = `
    <div class="ab-dialog" id="dialog-content">
      <div class="ab-dialog-header">
        <div></div>
        <button class="ab-dialog-close" id="dialog-close-action" aria-label="Close product details">&#x2715;</button>
      </div>
      <div class="ab-dialog-body" id="dialog-body"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.getElementById('dialog-close-action').addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}

export function openModal(product) {
  if (!overlay) buildModal();
  currentProduct = product;

  const imgSrc = getProductImageSVG(product);

  const ingredientHTML = product.ingredients
    .map(ing => `<span class="ab-ingredient-tag">${ing}</span>`)
    .join('');

  const stockHTML = product.inStock
    ? `<a href="catalog.html" class="ab-action ab-action-primary">Shop Now</a>`
    : `<span class="ab-tile-out-of-stock">Currently out of stock</span>`;

  document.getElementById('dialog-body').innerHTML = `
    <div class="ab-dialog-image">
      <img src="${imgSrc}" alt="${product.name}" width="300" height="300"/>
    </div>
    <div class="ab-dialog-info">
      <p class="ab-dialog-type">${product.type === 'shampoo' ? 'Shampoo Bar' : 'Conditioner Bar'}</p>
      <h2 class="ab-dialog-name">${product.name}</h2>
      <div class="ab-tile-rating">
        ${renderStars(product.rating)}
        <span class="ab-tile-rating-num">${product.rating}</span>
        <span class="ab-tile-rating-count">(${product.reviews} reviews)</span>
      </div>
      <p class="ab-dialog-desc">${product.description}</p>
      <div class="ab-dialog-meta">
        <div class="ab-dialog-meta-item">
          <span class="label">Hair type</span>
          <span class="value">${product.hairType}</span>
        </div>
        <div class="ab-dialog-meta-item">
          <span class="label">Scent</span>
          <span class="value">${product.scent}</span>
        </div>
        <div class="ab-dialog-meta-item">
          <span class="label">Weight</span>
          <span class="value">${product.weight}</span>
        </div>
        <div class="ab-dialog-meta-item">
          <span class="label">Status</span>
          <span class="value">${product.inStock ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>
      <div class="ab-dialog-ingredients">
        <h4>Key ingredients</h4>
        <div class="ab-ingredient-tags">${ingredientHTML}</div>
      </div>
      <div class="ab-dialog-price-line">
        <span class="ab-dialog-price">${formatPrice(product.price)}</span>
        ${stockHTML}
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => document.getElementById('dialog-close-action')?.focus(), 50);
}

export function closeModal() {
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
  currentProduct = null;
}