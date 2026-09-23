// home.js - Destaques da página inicial
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('homeFeaturedGrid');
  if (!container || typeof EXPERIENCIAS === 'undefined') return;

  const featured = EXPERIENCIAS.filter(x => x.destaque).slice(0, 3);
  container.innerHTML = featured.map(item => `
    <article class="card card-exp">
      <div class="card-img-box">
        <img src="${item.imagem}" alt="${item.titulo}" />
        <div class="card-img-overlay">
          <span class="card-city">📍 ${item.municipio}</span>
        </div>
        <span class="card-destaque">⭐ Destaque</span>
      </div>
      <div class="card-body">
        <div class="card-meta-top">
          <span class="badge badge-cafe">${item.categoria}</span>
          <span class="card-rating">★ ${item.rating.toFixed(1)}</span>
        </div>
        <h3 class="card-title"><a href="experiencia.html?id=${item.id}">${item.titulo}</a></h3>
        <p class="card-desc">${item.descricaoCurta}</p>
        <div class="card-specs">
          <span>⏱️ ${item.duracao}</span>
          <span>${item.comGuia ? '🧑‍🏫 Com guia' : '🧭 Autoguiado'}</span>
        </div>
        <div class="card-footer">
          <div class="card-price">
            <small>A partir de</small>
            <div><strong>${item.preco === 0 ? 'Gratuito' : 'R$ ' + item.preco + '/pessoa'}</strong></div>
          </div>
          <a href="experiencia.html?id=${item.id}" class="btn btn-primary btn-sm">Ver e Reservar</a>
        </div>
      </div>
    </article>
  `).join('');
});
