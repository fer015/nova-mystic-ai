let currentData = [];

async function switchTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }

  const container = document.getElementById('app-content');
  container.innerHTML = '<p style="text-align:center; color:#b3a5c9;">Cargando contenido místico...</p>';

  try {
    const response = await fetch(`./data/${tabName}.json`);
    if (!response.ok) throw new Error('No se pudo cargar el archivo');
    currentData = await response.json();
    renderContent(tabName, currentData);
  } catch (error) {
    container.innerHTML = `<p style="text-align:center; color:#e57373;">Error al cargar la sección ${tabName}. Verifique el archivo JSON.</p>`;
  }
}

function getItemText(item) {
  const keys = Object.keys(item);
  const title = item.titulo || item.nombre || item.signo || item.numero || item.combinacion || item[keys[0]] || 'Sin título';
  const desc = item.significado || item.descripcion || item.prediccion || item.interpretacion || item[keys[1]] || '';
  return { title, desc };
}

function renderContent(type, data) {
  const container = document.getElementById('app-content');
  let html = '';

  if (type === 'suenos') {
    html += `<input type="text" class="search-input" id="searchInput" placeholder="Buscar sueño (ej. volar, agua, serpiente)..." onkeyup="filterDreams()">`;
    html += `<div id="dreamsList">`;
    data.forEach(item => {
      const { title, desc } = getItemText(item);
      html += `
        <div class="item-card">
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>`;
    });
    html += `</div>`;
  } else {
    data.forEach(item => {
      const { title, desc } = getItemText(item);
      html += `
        <div class="item-card">
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>`;
    });
  }

  container.innerHTML = html;
}

function filterDreams() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = currentData.filter(item => {
    const { title, desc } = getItemText(item);
    return title.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
  });
  
  const listContainer = document.getElementById('dreamsList');
  if (filtered.length === 0) {
    listContainer.innerHTML = '<p style="text-align:center; color:#b3a5c9;">No se encontraron coincidencias.</p>';
    return;
  }

  listContainer.innerHTML = filtered.map(item => {
    const { title, desc } = getItemText(item);
    return `
      <div class="item-card">
        <h3>${title}</h3>
        <p>${desc}</p>
      </div>`;
  }).join('');
}

window.onload = () => switchTab('suenos');
