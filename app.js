let currentData = [];

async function switchTab(tabName) {
  // Actualizar botones activos de la navegación
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }

  const container = document.getElementById('app-content');
  container.innerHTML = '<p style="text-align:center; color:#b3a5c9;">Cargando contenido místico...</p>';

  try {
    const response = await fetch(`./data/${tabName}.json`);
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo JSON');
    }
    currentData = await response.json();
    renderContent(tabName, currentData);
  } catch (error) {
    container.innerHTML = `<p style="text-align:center; color:#e57373;">Aún no se ha cargado la base de datos para esta sección (${tabName}).</p>`;
  }
}

function renderContent(type, data) {
  const container = document.getElementById('app-content');
  let html = '';

  if (type === 'suenos') {
    html += `<input type="text" class="search-input" id="searchInput" placeholder="Buscar sueño (ej. volar, agua, serpiente)..." onkeyup="filterDreams()">`;
    html += `<div id="dreamsList">`;
    data.forEach(item => {
      html += `
        <div class="item-card">
          <h3>${item.titulo}</h3>
          <p>${item.significado}</p>
        </div>`;
    });
    html += `</div>`;
  } else {
    data.forEach(item => {
      html += `
        <div class="item-card">
          <h3>${item.nombre || item.signo || item.titulo || item.numero || item.combinacion}</h3>
          <p>${item.descripcion || item.significado || item.prediccion || item.interpretacion}</p>
        </div>`;
    });
  }

  container.innerHTML = html;
}

function filterDreams() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = currentData.filter(item => 
    (item.titulo && item.titulo.toLowerCase().includes(query)) || 
    (item.significado && item.significado.toLowerCase().includes(query))
  );
  
  const listContainer = document.getElementById('dreamsList');
  if (filtered.length === 0) {
    listContainer.innerHTML = '<p style="text-align:center; color:#b3a5c9;">No se encontraron coincidencias.</p>';
    return;
  }

  listContainer.innerHTML = filtered.map(item => `
    <div class="item-card">
      <h3>${item.titulo}</h3>
      <p>${item.significado}</p>
    </div>
  `).join('');
}

// Cargar sección de sueños al iniciar
window.onload = () => switchTab('suenos');
