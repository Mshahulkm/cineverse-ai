function openMovie(m){
  const isFav=state.favs.includes(m.id), isW=state.watch.includes(m.id);
  const rating=m.rating?Number(m.rating).toFixed(1):'—';
  // similar movies: shared genre + same director priority
  const similar=state.movies.filter(x=>x.id!==m.id).map(x=>{
    let s=0; x.genres.forEach(g=>{if(m.genres.includes(g))s+=2});
    if(x.director&&x.director===m.director)s+=3;
    if(x.country&&x.country===m.country)s+=1;
    return {x,s};
  }).filter(o=>o.s>0).sort((a,b)=>b.s-a.s).slice(0,6).map(o=>o.x);
  $('#modalContent').innerHTML=`
    <div class="modal-banner" style="${posterStyle(m)}"><h2>${escape(m.title)}</h2></div>
    <div class="modal-body">
      <div class="modal-info">
        ${m.year?`<span>📅 ${m.year}</span>`:''}
        <span>★ ${rating}</span>
        ${m.country?`<span>🌍 ${escape(m.country)}</span>`:''}
        ${m.director?`<span>🎬 ${escape(m.director)}</span>`:''}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${m.genres.map(g=>`<span class="chip">${escape(g)}</span>`).join('')}</div>
      <div class="modal-actions">
        <button class="btn btn-primary" id="mFav">${isFav?'❤ Favorited':'♡ Add Favorite'}</button>
        <button class="btn btn-ghost" id="mWatch">${isW?'✓ In Watchlist':'+ Watchlist'}</button>
        <a class="btn btn-ghost" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(m.title+' '+(m.year||'')+' trailer')}">▶ Watch Trailer</a>
        <a class="btn btn-ghost" target="_blank" rel="noopener" href="https://www.imdb.com/find?q=${encodeURIComponent(m.title)}">IMDb</a>
      </div>
      ${similar.length?`<div class="modal-section"><h4>You might also like</h4><div class="similar-row">${similar.map(cardHTML).join('')}</div></div>`:''}
    </div>`;
  $('#mFav').onclick=()=>{toggleFav(m.id);openMovie(m)};
  $('#mWatch').onclick=()=>{toggleWatch(m.id);openMovie(m)};
  $('#modal').hidden=false;
  document.body.style.overflow='hidden';
}
function closeModal(){$('#modal').hidden=true;document.body.style.overflow=''}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
