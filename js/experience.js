// experience.js - Detalhes da experiência + formulário completo de reserva WhatsApp
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const expId = Number(params.get('id')) || 1;
  const item = EXPERIENCIAS.find(x => x.id === expId);

  if (!item) {
    document.getElementById('expContainer').innerHTML = `
      <div class="container text-center py-12">
        <h2>Experiência não encontrada</h2>
        <p>A experiência solicitada não está disponível.</p>
        <a href="experiencias.html" class="btn btn-primary mt-4">Ver todas as experiências</a>
      </div>
    `;
    return;
  }

  // Preenche dados do detalhe
  renderExperienceDetail(item);
  initBookingForm(item);
});

function renderExperienceDetail(item) {
  document.title = `${item.titulo} — Rota do Café Sul de Minas`;
  
  // Breadcrumb & Headings
  const titleEl = document.getElementById('expTitle');
  if (titleEl) titleEl.textContent = item.titulo;
  const subTitleEl = document.getElementById('expSubtitle');
  if (subTitleEl) subTitleEl.textContent = item.subtitulo;
  const cityEl = document.getElementById('expCity');
  if (cityEl) cityEl.textContent = `📍 ${item.municipio}, Sul de Minas`;
  const ratingEl = document.getElementById('expRating');
  if (ratingEl) ratingEl.innerHTML = `★ ${item.rating.toFixed(1)} <small>(${item.totalAvaliacoes} avaliações)</small>`;

  // Badges e imagens
  const heroImg = document.getElementById('expHeroImg');
  if (heroImg) heroImg.src = item.imagem;

  const descFull = document.getElementById('expDescFull');
  if (descFull) descFull.innerHTML = `<p class="lead">${item.descricaoCompleta}</p>`;

  // Destaques / Inclusos
  const inclusosList = document.getElementById('expInclusos');
  if (inclusosList) {
    inclusosList.innerHTML = item.oQueEstaIncluso.map(inc => `<li>✓ ${inc}</li>`).join('');
  }

  const naoInclusosList = document.getElementById('expNaoInclusos');
  if (naoInclusosList) {
    naoInclusosList.innerHTML = item.oQueNaoEstaIncluso.map(ninc => `<li>✕ ${ninc}</li>`).join('');
  }

  // Especificações da barra lateral
  const specDuration = document.getElementById('specDuration');
  if (specDuration) specDuration.textContent = item.duracao;
  const specGuide = document.getElementById('specGuide');
  if (specGuide) specGuide.textContent = item.comGuia ? 'Sim (guia credenciado)' : 'Autoguiado com sinalização';
  const specTransport = document.getElementById('specTransport');
  if (specTransport) specTransport.textContent = item.transporteIncluso ? 'Incluso' : item.transporteInfo;
  const specDays = document.getElementById('specDays');
  if (specDays) specDays.textContent = item.disponibilidade.join(', ');
  const specMinMax = document.getElementById('specMinMax');
  if (specMinMax) specMinMax.textContent = `De ${item.minimoPersonas} a ${item.maximoPersonas} pessoas`;

  // Preço no card
  const priceDisplay = document.getElementById('bookingPriceDisplay');
  if (priceDisplay) {
    priceDisplay.innerHTML = item.preco === 0 
      ? '<span class="text-free">Gratuito</span>' 
      : `<span class="val">R$ ${item.preco}</span> <small>/ pessoa</small>`;
  }

  // Experiências Relacionadas
  const relList = EXPERIENCIAS.filter(x => x.municipio === item.municipio && x.id !== item.id).slice(0, 3);
  const relContainer = document.getElementById('relatedGrid');
  if (relContainer && relList.length > 0) {
    relContainer.innerHTML = relList.map(rel => `
      <div class="card card-sm">
        <img src="${rel.imagem}" alt="${rel.titulo}" />
        <div class="p-4">
          <span class="badge badge-sm badge-cafe">${rel.municipio}</span>
          <h4 class="mt-2"><a href="experiencia.html?id=${rel.id}">${rel.titulo}</a></h4>
          <p class="text-sm text-muted">${rel.preco === 0 ? 'Gratuito' : 'R$ ' + rel.preco + '/pessoa'}</p>
        </div>
      </div>
    `).join('');
  }
}

function initBookingForm(item) {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const dateInput = document.getElementById('bookDate');
  const timeSelect = document.getElementById('bookTime');
  const personsInput = document.getElementById('bookPersons');
  const totalDisplay = document.getElementById('bookTotalAmount');
  const submitBtn = document.getElementById('submitBooking');

  // Define data mínima como amanhã
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  // Preenche horários disponíveis
  if (timeSelect && item.horarios) {
    timeSelect.innerHTML = item.horarios.map(h => `<option value="${h}">${h}</option>`).join('');
  }

  function updateTotal() {
    const qty = Math.max(item.minimoPersonas, Number(personsInput?.value || 1));
    if (totalDisplay) {
      if (item.preco === 0) {
        totalDisplay.textContent = 'Gratuito';
      } else {
        const total = qty * item.preco;
        totalDisplay.textContent = `R$ ${total.toFixed(2)}`;
      }
    }
  }

  personsInput?.addEventListener('input', updateTotal);
  updateTotal();

  // Envio do formulário de reserva via WhatsApp
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('bookName')?.value.trim();
    const email = document.getElementById('bookEmail')?.value.trim();
    const phone = document.getElementById('bookPhone')?.value.trim();
    const date = dateInput?.value;
    const time = timeSelect?.value;
    const persons = personsInput?.value;
    const notes = document.getElementById('bookNotes')?.value.trim() || 'Sem observações adicionais.';

    const totalStr = item.preco === 0 ? 'Gratuito' : `R$ ${(Number(persons) * item.preco).toFixed(2)}`;

    // Mensagem formatada para o operador local
    const msg = `*SOLICITAÇÃO DE RESERVA — Rota do Café Sul de Minas*\n\n` +
      `☕ *Experiência:* ${item.titulo}\n` +
      `📍 *Município:* ${item.municipio}\n` +
      `📅 *Data desejada:* ${date}\n` +
      `⏰ *Horário:* ${time}\n` +
      `👥 *Pessoas:* ${persons} participante(s)\n` +
      `💰 *Valor Estimado:* ${totalStr}\n\n` +
      `👤 *Titular:* ${nome}\n` +
      `📧 *E-mail:* ${email}\n` +
      `📱 *Telefone/WhatsApp:* ${phone}\n` +
      `📝 *Observações:* ${notes}\n\n` +
      `_Enviado através da Plataforma de Experiências da Rota do Café._`;

    const encodedMsg = encodeURIComponent(msg);
    // WhatsApp comercial do Sebrae / Central Receptiva da Rota do Café Sul de Minas
    const waNumber = '5535999887766';
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

    // Abre o WhatsApp
    window.open(waUrl, '_blank');

    // Feedback visual amigável
    alert('Sua solicitação de reserva foi gerada com sucesso! Você será redirecionado para confirmar os detalhes no WhatsApp da nossa equipe receptiva.');
  });
}
