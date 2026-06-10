// modal.js — product detail modal module
import { renderStars, formatPrice, getProductImageSVG } from './utils.js';

let overlay;
let currentProduct = null;

function buildModal() {
  overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'product-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Product details');
  overlay.innerHTML = `
    <div class="modal" id="modal-content">
      <div class="modal-header">
        <div></div>
        <button class="modal-close" id="modal-close-btn" aria-label="Close product details">&#x2715;</button>
      </div>
      <div class="modal-body" id="modal-body"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close button
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}

export function openModal(product) {
  if (!overlay) buildModal();
  currentProduct = product;

  const imgSrc = getProductImageSVG(product);

  const ingredientHTML = product.ingredients
    .map(ing => `<span class="ingredient-tag">${ing}</span>`)
    .join('');

  const stockHTML = product.inStock
    ? `<button class="btn btn-primary" onclick="window.location='catalog.html'">Shop Now</button>`
    : `<span class="card-out-of-stock">Currently out of stock</span>`;

  document.getElementById('modal-body').innerHTML = `
    <div class="modal-image">
      <img src="${imgSrc}" alt="${product.name}" width="300" height="300"/>
    </div>
    <div class="modal-info">
      <p class="modal-type">${product.type === 'shampoo' ? 'Shampoo Bar' : 'Conditioner Bar'}</p>
      <h2 class="modal-name">${product.name}</h2>
      <div class="card-rating">
        ${renderStars(product.rating)}
        <span class="card-rating-num">${product.rating}</span>
        <span class="card-rating-count">(${product.reviews} reviews)</span>
      </div>
      <p class="modal-desc">${product.description}</p>
      <div class="modal-meta">
        <div class="modal-meta-item">
          <span class="label">Hair type</span>
          <span class="value">${product.hairType}</span>
        </div>
        <div class="modal-meta-item">
          <span class="label">Scent</span>
          <span class="value">${product.scent}</span>
        </div>
        <div class="modal-meta-item">
          <span class="label">Weight</span>
          <span class="value">${product.weight}</span>
        </div>
        <div class="modal-meta-item">
          <span class="label">Status</span>
          <span class="value">${product.inStock ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>
      <div class="modal-ingredients">
        <h4>Key ingredients</h4>
        <div class="ingredient-tags">${ingredientHTML}</div>
      </div>
      <div class="modal-price-row">
        <span class="modal-price">${formatPrice(product.price)}</span>
        ${stockHTML}
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Focus trap: focus close button
  setTimeout(() => document.getElementById('modal-close-btn')?.focus(), 50);
}

export function closeModal() {
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
  currentProduct = null;
}
