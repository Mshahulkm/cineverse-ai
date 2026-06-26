// Core state + utilities
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const state = {
  movies: (window.MOVIES||[]).map((m,i)=>({...m, _i:i, hue: hashHue(m.title||'') })),
  filtered: [],
  favs: JSON.parse(localStorage.getItem('cineai.favs')||'[]'),
  watch: JSON.parse(localStorage.getItem('cineai.watch')||'[]'),
  theme: localStorage.getItem('cineai.theme')||'dark',
  tab: 'favs',
};
function hashHue(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h}
function posterBg(m){
  const h=m.hue, h2=(h+60)%360;
  return `linear-gradient(135deg,hsl(${h} 70% 35%),hsl(${h2} 75% 25%))`;
}
function posterStyle(m){ return `background:${posterBg(m)}`; }

function posterHTML(m,extraClass=''){
  if(m.poster){
    return `<div class="poster ${extraClass}" style="background:${posterBg(m)}">
      <img loading="lazy" src="${m.poster}" alt="${escape(m.title)} poster" onerror="this.remove()"/>
      <div class="poster-fade"></div>
      <div class="title">${escape(m.title)}</div>
    </div>`;
  }
  return `<div class="poster ${extraClass}" style="${posterStyle(m)}">
    <div class="poster-fade"></div>
    <div class="title">${escape(m.title)}</div>
  </div>`;
}

function showToast(msg){const t=$('#toast');t.textContent=msg;t.hidden=false;t.style.animation='none';t.offsetWidth;t.style.animation='toastIn .3s ease-out';clearTimeout(window._tt);window._tt=setTimeout(()=>t.hidden=true,1900)}
function applyTheme(){document.documentElement.classList.toggle('light',state.theme==='light');$('#themeToggle').textContent=state.theme==='light'?'☀️':'🌙'}

document.addEventListener('DOMContentLoaded',()=>{
  applyTheme();
  $('#year').textContent=new Date().getFullYear();
  initStats();
  initHeroPosters();
  initFilters();
  renderTrending();
  renderCollections();
  applyFilters();
  renderFavs();
  initEvents();
  initAI();
  initParticles();
  initReveal();
});

function initStats(){
  const ms=state.movies;
  $('#statMovies').textContent=ms.length;
  $('#statGenres').textContent=new Set(ms.flatMap(m=>m.genres)).size;
  $('#statCountries').textContent=new Set(ms.map(m=>m.country).filter(Boolean)).size;
  $('#statDirectors').textContent=new Set(ms.map(m=>m.director).filter(Boolean)).size;
}
function initHeroPosters(){
  const wrap=$('#heroPosters');
  const picks=state.movies.filter(m=>m.poster).sort(()=>Math.random()-.5).slice(0,6);
  if(picks.length<6){
    const extra=[...state.movies].sort((a,b)=>(b.rating||0)-(a.rating||0)).slice(0,6);
    picks.push(...extra);
  }
  const positions=[[20,30],[210,10],[40,290],[230,260],[400,80],[400,360]];
  positions.forEach(([x,y],i)=>{
    const m=picks[i%picks.length]; if(!m) return;
    const d=document.createElement('div');
    d.className='hero-poster';
    const bg = m.poster ? `background:#000 center/cover url("${m.poster}")` : `background:${posterBg(m)}`;
    d.setAttribute('style',`${bg};left:${x}px;top:${y}px;animation-delay:${i*-1.5}s`);
    d.innerHTML=`<span>${escape(m.title)}</span>`;
    d.onclick=()=>openMovie(m);
    wrap.appendChild(d);
  });
}
function escape(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function cardHTML(m){
  const isFav=state.favs.includes(m.id);
  const rating=m.rating?Number(m.rating).toFixed(1):'—';
  const genre=m.genres[0]||'';
  return `<article class="card reveal" data-id="${m.id}">
    <button class="fav-btn ${isFav?'on':''}" data-fav="${m.id}" title="Favorite">${isFav?'❤':'♡'}</button>
    ${genre?`<span class="genre-chip">${escape(genre)}</span>`:''}
    ${posterHTML(m)}
    <div class="meta">
      <span>${m.year||'—'}</span>
      <span class="rating">★ ${rating}</span>
    </div>
    ${m.synopsis?`<div class="card-syn">${escape(m.synopsis.slice(0,140))}${m.synopsis.length>140?'…':''}</div>`:''}
  </article>`;
}

function renderTrending(){
  const row=$('#trendingRow');
  const top=[...state.movies]
    .map(m=>({m, score:(m.rating||0)*2 + (m.poster?2:0) + (m.synopsis?1:0)}))
    .sort((a,b)=>b.score-a.score).slice(0,20).map(o=>o.m);
  row.innerHTML=top.map(cardHTML).join('');
}

function renderCollections(){
  const collections=[
    {name:'Top Rated', sub:'Highest IMDb scores', icon:'⭐', filter:m=>m.rating>=7.5},
    {name:'Hidden Gems', sub:'Underrated picks', icon:'💎', filter:m=>m.rating&&m.rating>=6.5&&m.rating<7.5},
    {name:'Action & Adventure', sub:'High octane', icon:'💥', filter:m=>m.genres.some(g=>/action|adventure/i.test(g))},
    {name:'Mind Bending', sub:'Sci‑fi & mystery', icon:'🧠', filter:m=>m.genres.some(g=>/sci|mystery|thriller/i.test(g))},
    {name:'Feel Good', sub:'Comedy & romance', icon:'☀️', filter:m=>m.genres.some(g=>/comedy|family|romance/i.test(g))},
    {name:'Dark & Twisted', sub:'Horror & crime', icon:'🌑', filter:m=>m.genres.some(g=>/horror|crime/i.test(g))},
    {name:'Animation', sub:'For all ages', icon:'🎨', filter:m=>m.genres.some(g=>/animation|anime/i.test(g))},
    {name:'Drama Hall', sub:'Acclaimed dramas', icon:'🎭', filter:m=>m.genres.some(g=>/drama|biograph|histor/i.test(g))},
  ];
  $('#collections').innerHTML=collections.map((c,i)=>{
    const count=state.movies.filter(c.filter).length;
    const h=i*47%360;
    return `<div class="col-card reveal" data-col="${i}">
      <div class="col-grad" style="background:linear-gradient(135deg,hsl(${h} 70% 45%),hsl(${(h+80)%360} 70% 35%))"></div>
      <div class="col-icon">${c.icon}</div>
      <div><h3>${c.name}</h3><span>${c.sub}</span></div>
      <div class="col-foot"><b>${count} movies</b><span>→</span></div>
    </div>`;
  }).join('');
  $$('.col-card').forEach(el=>el.onclick=()=>{
    const c=collections[+el.dataset.col];
    state.filtered=state.movies.filter(c.filter);
    renderGrid();
    document.getElementById('all').scrollIntoView({behavior:'smooth'});
  });
}

function initEvents(){
  $('#themeToggle').onclick=()=>{state.theme=state.theme==='dark'?'light':'dark';localStorage.setItem('cineai.theme',state.theme);applyTheme()};
  $('#randomBtn').onclick=()=>{const m=state.movies[Math.floor(Math.random()*state.movies.length)];openMovie(m)};
  $('#heroSearch').addEventListener('input',e=>{$('#search').value=e.target.value;applyFilters();document.getElementById('all').scrollIntoView({behavior:'smooth'})});
  document.addEventListener('click',e=>{
    if(e.target.dataset.fav){e.stopPropagation();toggleFav(+e.target.dataset.fav);return}
    if(e.target.dataset.close){closeModal();return}
    const card=e.target.closest('.card');
    if(card){const m=state.movies.find(x=>x.id==card.dataset.id);if(m)openMovie(m)}
  });
  $$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');state.tab=t.dataset.tab;renderFavs()});
}

function initReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});
  $$('.reveal').forEach(el=>io.observe(el));
  window._reveal=io;
}
