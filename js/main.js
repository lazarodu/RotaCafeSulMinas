// main.js - Comportamentos globais, navegação e utilitários
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBackToTop();
  updateFavoritesCount();
});

function initNavbar() {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav-links');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        nav.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Favoritos (LocalStorage)
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('rota_cafe_favs') || '[]');
  } catch (e) {
    return [];
  }
}

function toggleFavorite(id) {
  let favs = getFavorites();
  const numId = Number(id);
  if (favs.includes(numId)) {
    favs = favs.filter(x => x !== numId);
  } else {
    favs.push(numId);
  }
  localStorage.setItem('rota_cafe_favs', JSON.stringify(favs));
  updateFavoritesCount();
  return favs.includes(numId);
}

function updateFavoritesCount() {
  const badge = document.getElementById('favCount');
  if (badge) {
    const count = getFavorites().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

// Formatação BRL
function formatMoney(val) {
  if (val === 0) return 'Gratuito';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}
