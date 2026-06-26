function initFilters(){
  const genres=[...new Set(state.movies.flatMap(m=>m.genres))].sort();
  const countries=[...new Set(state.movies.map(m=>m.country).filter(Boolean))].sort();
  const dirs=[...new Set(state.movies.map(m=>m.director).filter(Boolean))].sort();
  $('#fGenre').insertAdjacentHTML('beforeend',genres.map(g=>`<option>${escape(g)}</option>`).join(''));
  $('#fCountry').insertAdjacentHTML('beforeend',countries.map(g=>`<option>${escape(g)}</option>`).join(''));
  $('#fDirector').insertAdjacentHTML('beforeend',dirs.map(g=>`<option>${escape(g)}</option>`).join(''));
  ['#search','#fGenre','#fCountry','#fDirector','#fSort'].forEach(s=>$(s).addEventListener('input',applyFilters));
  $('#clearFilters').onclick=()=>{['#search','#fGenre','#fCountry','#fDirector'].forEach(s=>$(s).value='');$('#fSort').value='title';applyFilters()};
}
function applyFilters(){
  const q=$('#search').value.trim().toLowerCase();
  const g=$('#fGenre').value, c=$('#fCountry').value, d=$('#fDirector').value, s=$('#fSort').value;
  let list=state.movies.filter(m=>{
    if(g && !m.genres.includes(g)) return false;
    if(c && m.country!==c) return false;
    if(d && m.director!==d) return false;
    if(q){
      const hay=(m.title+' '+m.director+' '+m.country+' '+m.genres.join(' ')+' '+(m.year||'')).toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
  list.sort((a,b)=>{
    if(s==='rating') return (b.rating||0)-(a.rating||0);
    if(s==='year') return (b.year||0)-(a.year||0);
    return a.title.localeCompare(b.title);
  });
  state.filtered=list;
  renderGrid();
}
function renderGrid(){
  const g=$('#grid'); g.innerHTML=state.filtered.map(cardHTML).join('');
  $('#emptyState').hidden=state.filtered.length>0;
  if(window._reveal) $$('.card.reveal',g).forEach(el=>window._reveal.observe(el));
}
