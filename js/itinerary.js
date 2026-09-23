// itinerary.js - Roteiros integrados entre os 3 municípios
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('itineraryGrid');
  if (!container) return;

  const filterCity = document.getElementById('itineraryFilterCity');

  function renderItineraries(city = 'all') {
    const filtered = ROTEIROS.filter(r => {
      if (city === 'all') return true;
      return r.cidades.includes(city);
    });

    container.innerHTML = filtered.map(r => `
      <article class="card itinerary-card">
        <div class="itinerary-header" style="background: linear-gradient(135deg, rgba(43,26,18,0.85), rgba(74,124,47,0.8)), url('${r.imagem}') center/cover;">
          <span class="badge badge-dourado">${r.duracaoDias}</span>
          <h3>${r.titulo}</h3>
          <p>${r.subtitulo}</p>
        </div>
        <div class="card-body">
          <p class="text-sm mb-4">${r.descricao}</p>
          
          <div class="itinerary-steps">
            ${r.etapas.map(step => `
              <div class="step-item">
                <div class="step-num">${step.dia}</div>
                <div class="step-content">
                  <strong>${step.titulo} (📍 ${step.cidade})</strong>
                  <p class="text-xs text-muted">${step.resumo}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="card-footer mt-4">
            <div>
              <small class="text-muted">Cidades inclusas</small>
              <div class="font-bold text-sm">${r.cidades.join(' • ')}</div>
            </div>
            <a href="experiencias.html?municipio=${encodeURIComponent(r.cidades[0])}" class="btn btn-primary btn-sm">Ver Experiências</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  filterCity?.addEventListener('change', (e) => {
    renderItineraries(e.target.value);
  });

  renderItineraries();
});
