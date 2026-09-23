// catalog.js - Filtros, busca e renderização de cards de experiências
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  const searchInput = document.getElementById('searchInput');
  const citySelect = document.getElementById('cityFilter');
  const catSelect = document.getElementById('catFilter');
  const priceSelect = document.getElementById('priceFilter');
  const durationSelect = document.getElementById('durationFilter');
  const guideCheck = document.getElementById('guideFilter');
  const freeCheck = document.getElementById('freeFilter');
  const countDisplay = document.getElementById('resultsCount');
  const resetBtn = document.getElementById('resetFilters');

  // Parâmetros da URL inicial (ex: ?municipio=Varginha ou ?categoria=fazenda)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('municipio') && citySelect) {
    citySelect.value = urlParams.get('municipio');
  }
  if (urlParams.get('categoria') && catSelect) {
    catSelect.value = urlParams.get('categoria');
  }
  if (urlParams.get('q') && searchInput) {
    searchInput.value = urlParams.get('q');
  }

  function filterExperiences() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const city = citySelect?.value || 'all';
    const cat = catSelect?.value || 'all';
    const price = priceSelect?.value || 'all';
    const duration = durationSelect?.value || 'all';
    const onlyGuide = guideCheck?.checked || false;
    const onlyFree = freeCheck?.checked || false;

    const filtered = EXPERIENCIAS.filter(item => {
      // Busca textual
      if (q) {
        const textContent = `${item.titulo} ${item.subtitulo} ${item.municipio} ${item.categoria} ${item.descricaoCurta} ${item.tags.join(' ')}`.toLowerCase();
        if (!textContent.includes(q)) return false;
      }

      // Município
      if (city !== 'all' && item.municipio !== city) return false;

      // Categoria
      if (cat !== 'all' && item.categoria !== cat) return false;

      // Guia
      if (onlyGuide && !item.comGuia) return false;

      // Gratuito
      if (onlyFree && item.preco !== 0) return false;

      // Preço
      if (price !== 'all') {
        if (price === 'free' && item.preco > 0) return false;
        if (price === '0-100' && (item.preco === 0 || item.preco > 100)) return false;
        if (price === '100-200' && (item.preco <= 100 || item.preco > 200)) return false;
        if (price === '200+' && item.preco <= 200) return false;
      }

      // Duração
      if (duration !== 'all') {
        const h = item.duracaoMin || 2;
        if (duration === 'short' && h > 2) return false; // até 2h
        if (duration === 'half' && (h <= 2 || h > 4)) return false; // 2h - 4h
        if (duration === 'full' && h <= 4) return false; // 4h+
      }

      return true;
    });

    renderCards(filtered);
    if (countDisplay) {
      countDisplay.textContent = `${filtered.length} experiência${filtered.length === 1 ? '' : 's'} encontrada${filtered.length === 1 ? '' : 's'}`;
    }
  }

  function renderCards(list) {
    if (!grid) return;
    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">☕</div>
          <h3>Nenhuma experiência encontrada</h3>
          <p>Tente ajustar os filtros ou pesquisar com outros termos.</p>
          <button class="btn btn-outline btn-sm" id="emptyResetBtn">Limpar filtros</button>
        </div>
      `;
      document.getElementById('emptyResetBtn')?.addEventListener('click', resetAll);
      return;
    }

    const favs = getFavorites();

    grid.innerHTML = list.map(item => {
      const isFav = favs.includes(item.id);
      const precoTxt = item.preco === 0 ? '<span class="price-free">Gratuito</span>' : `<span class="price-val">R$ ${item.preco}</span> <span class="price-sub">/ pessoa</span>`;
      const catBadge = {
        fazenda: '<span class="badge badge-fazenda">☕ Fazenda</span>',
        gastronomia: '<span class="badge badge-gastronomia">🍽️ Gastronomia</span>',
        aventura: '<span class="badge badge-aventura">🏔️ Aventura</span>',
        cultural: '<span class="badge badge-cultural">🎨 Cultural</span>',
        gratuita: '<span class="badge badge-gratuita">✨ Gratuito</span>'
      }[item.categoria] || '<span class="badge badge-cafe">Café</span>';

      return `
        <article class="card card-exp" data-id="${item.id}">
          <div class="card-img-box">
            <img src="${item.imagem}" alt="${item.titulo}" loading="lazy" />
            <div class="card-img-overlay">
              <span class="card-city"><i class="icon-pin">📍</i> ${item.municipio}</span>
              <button class="fav-btn ${isFav ? 'active' : ''}" onclick="onFavClick(event, ${item.id})" aria-label="Favoritar">
                ${isFav ? '❤️' : '🤍'}
              </button>
            </div>
            ${item.destaque ? '<span class="card-destaque">⭐ Destaque</span>' : ''}
          </div>
          <div class="card-body">
            <div class="card-meta-top">
              ${catBadge}
              <span class="card-rating">★ ${item.rating.toFixed(1)} <small>(${item.totalAvaliacoes})</small></span>
            </div>
            <h3 class="card-title"><a href="experiencia.html?id=${item.id}">${item.titulo}</a></h3>
            <p class="card-desc">${item.descricaoCurta}</p>
            
            <div class="card-specs">
              <span>⏱️ ${item.duracao}</span>
              <span>${item.comGuia ? '🧑‍🏫 Com guia' : '🧭 Autoguiado'}</span>
              <span>${item.transporteIncluso ? '🚐 Transporte incl.' : '🚗 Transporte próprio'}</span>
            </div>
            
            <div class="card-footer">
              <div class="card-price">
                <small>A partir de</small>
                <div>${precoTxt}</div>
              </div>
              <a href="experiencia.html?id=${item.id}" class="btn btn-primary btn-sm">Ver e Reservar</a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function resetAll() {
    if (searchInput) searchInput.value = '';
    if (citySelect) citySelect.value = 'all';
    if (catSelect) catSelect.value = 'all';
    if (priceSelect) priceSelect.value = 'all';
    if (durationSelect) durationSelect.value = 'all';
    if (guideCheck) guideCheck.checked = false;
    if (freeCheck) freeCheck.checked = false;
    filterExperiences();
  }

  // Listeners
  [searchInput, citySelect, catSelect, priceSelect, durationSelect].forEach(el => {
    el?.addEventListener('input', filterExperiences);
    el?.addEventListener('change', filterExperiences);
  });
  guideCheck?.addEventListener('change', filterExperiences);
  freeCheck?.addEventListener('change', filterExperiences);
  resetBtn?.addEventListener('click', resetAll);

  // Executa filtro inicial
  filterExperiences();
});

// Handler global para clique de favoritos
window.onFavClick = function(e, id) {
  e.preventDefault();
  e.stopPropagation();
  const isFav = toggleFavorite(id);
  const btn = e.currentTarget;
  btn.classList.toggle('active', isFav);
  btn.innerHTML = isFav ? '❤️' : '🤍';
};
