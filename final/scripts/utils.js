// utils.js 

/**
 * Generate a star rating SVG string
 */
export function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let html = '<div class="stars" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      html += `<svg class="star" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
    } else if (i === fullStars + 1 && hasHalf) {
      html += `<svg class="star" viewBox="0 0 24 24" fill="currentColor" stroke="none"><defs><linearGradient id="h${i}"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent" stop-opacity="1"/></linearGradient></defs><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="url(#h${i})" stroke="currentColor" stroke-width="1"/></svg>`;
    } else {
      html += `<svg class="star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`;
    }
  }
  html += '</div>';
  return html;
}

/**
 * Format a price number as USD string
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

/**
 * Get a badge CSS class based on badge text
 */
export function badgeClass(badge) {
  if (!badge) return '';
  const map = {
    'Best Seller': 'badge-best-seller',
    'New':         'badge-new',
    'Color Safe':  'badge-color-safe',
  };
  return map[badge] || '';
}

/**
 * Debounce a function
 */
export function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Show a toast notification
 */
export function showToast(message, icon = 'âœ“') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `<span aria-hidden="true">${icon}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/**
 * Map product id to real image filename.
 * Falls back to a colored SVG if no image is mapped.
 */
export function getProductImageSVG(product) {
  const imageMap = {
    1:  'lavros-shamp.webp',
    2:  'arganhon-sham.jpeg',
    3:  'peppermint-shamp.jpeg',
    4:  'chaoat-sham.webp',
    5:  'charcoal-shamp.jpeg',
    6:  'rosehib-sham.jpeg',
    7:  'vanillacoco-shamp.jpeg',
    8:  'eucal-shamp.jpeg',
    9:  'shmango-con.jpeg',
    10: 'coconutaloe-con.jpeg',
    11: 'argan-cond.webp',
    12: 'lavjojo-cond.jpeg',
    13: 'avo-cond.jpeg',
    14: 'rosecas-cond.jpeg',
    15: 'bananahon-cond.webp',
    16: 'oat-cond.webp',
    17: 'patch-shamp.jpeg',
    18: 'lemon-shamp.jpeg',
    19: 'mangopapa-shamp.jpeg',
    20: 'neroli-cond.jpeg',
  };

  const filename = imageMap[product.id];
  if (filename) {
    // import.meta.url points to scripts/utils.js go up one level to images/
    const base = new URL('../images/' + filename, import.meta.url);
    return base.href;
  }

  // Fallback SVG if image not found
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#F2DDD1"/><text x="60" y="65" text-anchor="middle" font-size="11" fill="#7A5C4A" font-family="serif">${product.name.slice(0,14)}</text></svg>`)}`;
}