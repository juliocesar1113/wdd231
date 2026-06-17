// modal.js — product detail modal module
import { renderStars, formatPrice, getProductImageSVG } from './utils.js';

let overlay;
let currentProduct = null;

function buildModal() {
  overlay = document.createElement('div');
  overlay.className = 'ab-modal-overlay';
  overlay.id = 'product-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Product details');
  overlay.innerHTML = `
    <div class="ab-modal" id="modal-content">
      <div class="ab-modal-header">
        <div></div>
        <button class="ab-modal-close" id="modal-close-btn" aria-label="Close product details">&#x2715;</button>
      </div>
      <div class="ab-modal-body" id="modal-body"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);

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
    ? `<a href="catalog.html" class="ab-btn ab-btn-primary">Shop Now</a>`
    : `<span class="ab-card-out-of-stock">Currently out of stock</span>`;

  document.getElementById('modal-body').innerHTML = `
    <div class="ab-modal-image">
      <img src="${imgSrc}" alt="${product.name}" width="300" height="300"/>
    </div>
    <div class="ab-modal-info">
      <p class="ab-modal-type">${product.type === 'shampoo' ? 'Shampoo Bar' : 'Conditioner Bar'}</p>
      <h2 class="ab-modal-name">${product.name}</h2>
      <div class="ab-card-rating">
        ${renderStars(product.rating)}
        <span class="ab-card-rating-num">${product.rating}</span>
        <span class="ab-card-rating-count">(${product.reviews} reviews)</span>
      </div>
      <p class="ab-modal-desc">${product.description}</p>
      <div class="ab-modal-meta">
        <div class="ab-modal-meta-item">
          <span class="label">Hair type</span>
          <span class="value">${product.hairType}</span>
        </div>
        <div class="ab-modal-meta-item">
          <span class="label">Scent</span>
          <span class="value">${product.scent}</span>
        </div>
        <div class="ab-modal-meta-item">
          <span class="label">Weight</span>
          <span class="value">${product.weight}</span>
        </div>
        <div class="ab-modal-meta-item">
          <span class="label">Status</span>
          <span class="value">${product.inStock ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>
      <div class="ab-modal-ingredients">
        <h4>Key ingredients</h4>
        <div class="ab-ingredient-tags">${ingredientHTML}</div>
      </div>
      <div class="ab-modal-price-row">
        <span class="ab-modal-price">${formatPrice(product.price)}</span>
        ${stockHTML}
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => document.getElementById('modal-close-btn')?.focus(), 50);
}

export function closeModal() {
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
  currentProduct = null;
}
