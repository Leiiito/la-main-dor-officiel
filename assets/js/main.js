
// === PRESTATIONS FILTERS + SEARCH (ROBUST) ===
document.addEventListener('DOMContentLoaded', () => {
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.card');
  const searchInput = document.getElementById('prestationSearch');

  let activeFilter = 'ongles';

  function normalize(str){
    return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  }

  function applyFilters(){
    const query = searchInput ? normalize(searchInput.value) : '';
    cards.forEach(card => {
      const cats = card.dataset.category || '';
      const text = normalize(card.innerText);
      const matchCategory = cats.includes(activeFilter);
      const matchSearch = !query || text.includes(query);
      card.style.display = (matchCategory && matchSearch) ? '' : 'none';
    });
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  if(searchInput){
    searchInput.addEventListener('input', applyFilters);
  }

  applyFilters();
});
