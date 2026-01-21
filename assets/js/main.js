document.addEventListener('DOMContentLoaded', () => {
  const filters = Array.from(document.querySelectorAll('.filter'));
  const panels = Array.from(document.querySelectorAll('.services-panel'));
  const searchInput = document.getElementById('prestationSearch');

  const normalize = (s) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  let activeTab =
    normalize(document.querySelector('.filter.is-active')?.dataset.tab) || 'ongles';

  function setActiveTab(tab) {
    activeTab = normalize(tab);

    filters.forEach((btn) => {
      const isActive = normalize(btn.dataset.tab) === activeTab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((p) => {
      p.classList.toggle('is-active', normalize(p.id) === activeTab);
    });

    applySearch();
  }

  function applySearch() {
    const q = searchInput ? normalize(searchInput.value) : '';
    const activePanel = document.getElementById(activeTab);
    if (!activePanel) return;

    const cards = Array.from(activePanel.querySelectorAll('.card.service'));

    cards.forEach((card) => {
      const text = normalize(card.innerText || '');
      card.style.display = !q || text.includes(q) ? '' : 'none';
    });

    updateCounts(q);
  }

  function updateCounts(q) {
    filters.forEach((btn) => {
      const panelId = normalize(btn.dataset.tab);
      const panel = document.getElementById(panelId);
      const countEl = btn.querySelector('.count');
      if (!panel || !countEl) return;

      const cards = Array.from(panel.querySelectorAll('.card.service'));
      let n = 0;

      cards.forEach((card) => {
        const text = normalize(card.innerText || '');
        if (!q || text.includes(q)) n += 1;
      });

      countEl.textContent = n ? String(n) : '';
    });
  }

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveTab(btn.dataset.tab);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applySearch);
  }

  setActiveTab(activeTab);
});