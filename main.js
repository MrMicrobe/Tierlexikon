
async function loadEntries() {
  try {
    const resp = await fetch('data/entries.json');
    if (!resp.ok) throw new Error('Netzwerk‑Fehler');

    const entries = await resp.json();


    entries.sort((a, b) => 
      a.family.localeCompare(b.family, undefined, { sensitivity: 'base' })
    );

    return entries;
  } catch (e) {
    console.error('Einträge konnten nicht geladen werden:', e);
    return [];
  }
}


function createCard(entry) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.type   = entry.type;
  card.dataset.id     = entry.id;
  card.dataset.family = entry.family; 

  card.innerHTML = `
    <img src="${entry.image}" alt="${entry.name}">
    <div class="card-body">
      <p><strong>${entry.name}</strong></p>
      <p><em>${entry.latin}</em></p>
      <p><small>Familie: ${entry.family}</small></p>
    </div>
  `;

  card.addEventListener('click', () => openModal(entry));
  return card;
}



function renderGallery(entries) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  entries.forEach(e => gallery.appendChild(createCard(e)));
}


function applyFilter(type) {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const match = (type === 'all') || (card.dataset.type === type);
    card.style.display = match ? '' : 'none';
  });
}



const modal = document.getElementById('detail-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalExtra = document.getElementById('modal-detail');
const modalSource = document.getElementById('modal-source'); // neu!
const closeBtn = document.getElementById('modal-close');

function openModal(entry) {
  modalImg.src = entry.image;
  modalImg.alt = entry.name;
  modalTitle.textContent = entry.name;
  modalDesc.textContent = entry.short;
  modalExtra.textContent = entry.detail;

  // Zusätzliche Felder anzeigen
  document.getElementById('modal-latin').textContent = entry.latin;
  document.getElementById('modal-family').textContent = entry.family;
  modalSource.innerHTML = `<strong>Bildquelle:</strong> ${entry.source}`; // HTML erlaubt Links

  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// Filter
function initFilters() {
  const btns = document.querySelectorAll('.filter-nav button');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Aktive Klasse toggeln
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });
}

// Start
document.addEventListener('DOMContentLoaded', async () => {
  const entries = await loadEntries(); // bereits sortiert
  renderGallery(entries);
  initFilters();
});