const resultsEl = document.getElementById('results');
const searchInput = document.getElementById('search');
const filterT = document.getElementById('filterTingkatan');
const filterK = document.getElementById('filterKategori');

let resources = [];

async function loadResources() {
  try {
    const resp = await fetch('resources.json');
    resources = await resp.json();
    render(resources);
  } catch (e) {
    resultsEl.innerHTML = '<p>⚠️ Gagal memuat data. Pastikan fail <b>resources.json</b> tersedia.</p>';
  }
}

function render(list) {
  if (!list.length) {
    resultsEl.innerHTML = '<p>Tiada bahan ditemui.</p>';
    return;
  }
  resultsEl.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${escapeHtml(item.tajuk)}</h3>
      <div class="meta">
        <span class="badge">${item.tingkatan}</span>
        <span>${item.kategori} • ${item.topik || 'Am'}</span>
        <div>${item.keterangan || ''}</div>
        <div style="margin-top:6px;">
          <a href="${item.fail_url}" target="_blank" rel="noopener">📄 Muat turun / Buka</a>
        </div>
      </div>
    `;
    resultsEl.appendChild(card);
  });
}

function escapeHtml(s) {
  return s ? s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c])) : '';
}

function applyFilters() {
  const q = (searchInput.value || '').trim().toLowerCase();
  const ting = filterT.value;
  const kat = filterK.value;

  const filtered = resources.filter(item => {
    if (ting && item.tingkatan !== ting) return false;
    if (kat && item.kategori !== kat) return false;
    if (!q) return true;
    const hay = (item.tajuk + ' ' + (item.keterangan || '') + ' ' +
                 (item.topik || '') + ' ' + (item.tag || []).join(' ')).toLowerCase();
    return hay.includes(q);
  });
  render(filtered);
}

searchInput.addEventListener('input', applyFilters);
filterT.addEventListener('change', applyFilters);
filterK.addEventListener('change', applyFilters);

loadResources();