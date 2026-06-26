const AI_CHIPS=[
  "I want mind-bending sci-fi like Inception",
  "A funny family movie",
  "Korean thriller, fast pace",
  "I want to cry — sad drama",
  "Award-winning historical movie",
  "Animation for kids",
  "Romantic, happy ending",
  "Anything by Christopher Nolan",
  "Under 2 hours, highly rated",
  "Dark horror, recent",
];
const MOOD_MAP={
  happy:['comedy','romance','family','animation'],
  sad:['drama','biography','war','romance'],
  cry:['drama','romance','war'],
  scary:['horror','thriller','mystery'],
  thrill:['thriller','crime','mystery','action'],
  funny:['comedy','animation','family'],
  romantic:['romance','drama'],
  kids:['animation','family','adventure','fantasy'],
  mind:['sci-fi','mystery','thriller'],
  inspire:['biography','sport','drama','history'],
  epic:['adventure','fantasy','action','history','war'],
  smart:['drama','mystery','crime','thriller'],
  feelgood:['comedy','romance','family','animation'],
  dark:['crime','thriller','horror','mystery'],
};
function initAI(){
  const wrap=$('#aiChips');
  wrap.innerHTML=AI_CHIPS.map(c=>`<button class="chip">${c}</button>`).join('');
  wrap.onclick=e=>{if(e.target.classList.contains('chip')){$('#aiPrompt').value=e.target.textContent;runAI()}};
  $('#aiAsk').onclick=runAI;
  $('#aiPrompt').addEventListener('keydown',e=>{if(e.key==='Enter')runAI()});
  // seed with picks
  $('#aiResults').innerHTML='<div class="ai-card" style="grid-column:1/-1;text-align:center"><div class="why">💡 Try a prompt above — like "Korean revenge thriller" or "I loved 300".</div></div>';
}
function runAI(){
  const q=($('#aiPrompt').value||'').toLowerCase().trim();
  if(!q){showToast('Type what you’re in the mood for');return}
  const tokens=q.match(/[a-z0-9']+/g)||[];
  const negMatch=q.match(/(?:no|not|don'?t want|without|avoid)\s+([a-z\s]+?)(?:[.,!?]|$)/);
  const negGenres=negMatch?(negMatch[1].match(/[a-z]+/g)||[]):[];
  const wantUnder=q.match(/under\s+(\d+)/);
  const wantOscar=/oscar|award/.test(q);
  const wantHigh=/highly|best|top|acclaim|great|excellent/.test(q);
  let moodGenres=[];
  for(const k in MOOD_MAP) if(q.includes(k)) moodGenres.push(...MOOD_MAP[k]);
  const refTitle=tokens.find(t=>state.movies.some(m=>m.title.toLowerCase()===t));
  const refMovie=refTitle?state.movies.find(m=>m.title.toLowerCase()===refTitle):null;

  const scored=state.movies.map(m=>{
    let score=0, reasons=[];
    const text=(m.title+' '+m.director+' '+m.country+' '+m.genres.join(' ')).toLowerCase();
    // token overlap
    tokens.forEach(t=>{if(t.length>2 && text.includes(t)){score+=2;}});
    // mood genres
    moodGenres.forEach(g=>{
      if(m.genres.some(x=>x.toLowerCase().includes(g))){score+=3;if(!reasons.includes('matches your mood'))reasons.push('matches your mood')}
    });
    // negative genres
    negGenres.forEach(g=>{
      if(g.length>2 && m.genres.some(x=>x.toLowerCase().includes(g.trim()))) score-=8;
    });
    // explicit director/country/year mentions
    if(m.director && q.includes(m.director.toLowerCase())){score+=8;reasons.push(`directed by ${m.director}`)}
    if(m.country && q.includes(m.country.toLowerCase())){score+=4;reasons.push(`from ${m.country}`)}
    // genre direct match
    m.genres.forEach(g=>{if(q.includes(g.toLowerCase())){score+=4;reasons.push(`${g} pick`)}});
    // rating boost
    if(wantHigh && m.rating){score+=Math.max(0,(m.rating-6))*1.5;if(m.rating>=7.5)reasons.push('highly rated')}
    if(m.rating){score+=(m.rating-5)*0.4}
    // reference movie similarity
    if(refMovie && m.id!==refMovie.id){
      const shared=m.genres.filter(g=>refMovie.genres.includes(g)).length;
      if(shared){score+=shared*3;reasons.push(`similar to ${refMovie.title}`)}
      if(m.director&&m.director===refMovie.director){score+=4;reasons.push(`same director as ${refMovie.title}`)}
    }
    return {m,score,reasons};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,8);

  const max=scored[0]?.score||1;
  if(!scored.length){
    $('#aiResults').innerHTML=`<div class="ai-card" style="grid-column:1/-1"><div class="why">No strong matches found. Try another phrasing — mention a genre, mood, language, or a movie you loved.</div></div>`;
    return;
  }
  $('#aiResults').innerHTML=scored.map(({m,score,reasons})=>{
    const why=reasons.length?reasons.slice(0,3).join(' · '):'closest match to your prompt';
    const pct=Math.min(100,Math.round(score/max*100));
    return `<div class="ai-card" data-id="${m.id}">
      <div style="${posterStyle(m)};aspect-ratio:16/9;border-radius:10px;display:flex;align-items:flex-end;padding:10px;color:#fff;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.7)">${escape(m.title)}</div>
      <h4>${escape(m.title)} <span style="color:var(--muted);font-weight:500">${m.year||''}</span></h4>
      <div class="ai-meta">★ ${m.rating?Number(m.rating).toFixed(1):'—'} · ${escape(m.genres.slice(0,2).join(', '))} ${m.director?'· '+escape(m.director):''}</div>
      <div class="score-bar"><i style="width:${pct}%"></i></div>
      <div class="why">✨ ${escape(why)}</div>
    </div>`;
  }).join('');
  $$('#aiResults .ai-card').forEach(el=>el.onclick=()=>{const m=state.movies.find(x=>x.id==el.dataset.id);if(m)openMovie(m)});
}
