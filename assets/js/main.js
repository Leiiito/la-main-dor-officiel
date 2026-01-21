document.addEventListener('DOMContentLoaded', () => {
  const filters = Array.from(document.querySelectorAll('.filter'));
  const cards = Array.from(document.querySelectorAll('.card.service, .service.card, article.card'));
  const searchInput = document.getElementById('prestationSearch');

  const normalize = (s) =>
    (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  let activeFilter = normalize(document.querySelector('.filter.is-active')?.dataset.filter) || 'ongles';

  function apply() {
    const q = searchInput ? normalize(searchInput.value) : '';
    cards.forEach((card) => {
      const cats = normalize(card.dataset.category || '');
      const text = normalize(card.innerText || '');
      const okCat = cats.split(/\s+/).includes(activeFilter);
      const okSearch = !q || text.includes(q);
      card.style.display = okCat && okSearch ? '' : 'none';
    });
    updateCounts();
  }

  function updateCounts() {
    filters.forEach((btn) => {
      const f = normalize(btn.dataset.filter);
      const countEl = btn.querySelector('.count');
      if (!countEl) return;
      const q = searchInput ? normalize(searchInput.value) : '';
      let n = 0;
      cards.forEach((card) => {
        const cats = normalize(card.dataset.category || '');
        const text = normalize(card.innerText || '');
        const okCat = cats.split(/\s+/).includes(f);
        const okSearch = !q || text.includes(q);
        if (okCat && okSearch) n += 1;
      });
      countEl.textContent = n ? String(n) : '';
    });
  }

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter = normalize(btn.dataset.filter);
      apply();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', apply);
  }

  apply();
});