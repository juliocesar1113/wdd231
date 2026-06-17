// nav.js — shared navigation behavior

export function initNav() {
  const header    = document.querySelector('.ab-site-head');
  const hamburger = document.querySelector('.ab-menu-toggle');
  const mobileNav = document.querySelector('.ab-mobile-menu');

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.ab-menu-links a, .ab-mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.endsWith(currentPage))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}
