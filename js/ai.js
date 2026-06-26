const AI_CHIPS=[
  "Mind-bending sci-fi like Inception",
  "Funny family movie",
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
  horror:['horror','thriller'],
  thrill:['thriller','crime','mystery','action'],
  thriller:['thriller','crime','mystery'],
  funny:['comedy','animation','family'],
  comedy:['comedy','romance','family'],
  romantic:['romance','drama'],
  romance:['romance','drama'],
  kids:['animation','family','adventure','fantasy'],
  family:['family','animation','adventure'],
  mind:['sci-fi','mystery','thriller'],
  bending:['sci-fi','mystery','thriller'],
  scifi:['sci-fi'],
  sci:['sci-fi'],
  inspire:['biography','sport','drama','history'],
  inspiring:['biography','sport','drama','history'],
  epic:['adventure','fantasy','action','history','war'],
  smart:['drama','mystery','crime','thriller'],
  feelgood:['comedy','romance','family','animation'],
  dark:['crime','thriller','horror','mystery'],
  action:['action','adventure','thriller'],
  war:['war','history','drama'],
  history:['history','biography','drama','war'],
  historical:['history','biography','drama','war'],
  fantasy:['fantasy','adventure'],
  adventure:['adventure','action','fantasy'],
  crime:['crime','thriller','mystery'],
  mystery:['mystery','thriller','crime'],
  animation:['animation','family'],
  anime:['animation'],
  documentary:['documentary'],
  doc:['documentary'],
  biopic:['biography'],
  biography:['biography','drama'],
  sport:['sport','drama'],
};

function initAI(){
  const wrap=$('#aiChips');
  if(!wrap) return;
  wrap.innerHTML=AI_CHIPS.map(c=>`<button type="button" class="chip">${c}</button>`).join('');
  wrap.addEventListener('click',e=>{
    const c=e.target.closest('.chip');
    if(!c) return;
    $('#aiPrompt').value=c.textContent;
    runAI();
  });
  const ask=$('#aiAsk'); if(ask) ask.addEventListener('click',runAI);
  const inp=$('#aiPrompt');
  if(inp) inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();runAI()}});
  $('#aiResults').innerHTML=`<div class="ai-empty">💡 Try a prompt above — like "Korean revenge thriller" or "if I loved Inception, what else?"</div>`;
}

function runAI(){
  const q=($('#aiPrompt').value||'').toLowerCase().trim();
  if(!q){showToast('Type what you’re in the mood for');return}
  $('#aiResults').innerHTML=`<div class="ai-empty">✨ Thinking…</div>`;

  // Debounced micro-delay so the "thinking" state actually shows
  setTimeout(()=>{
    const tokens=q.match(/[a-z0-9']+/g)||[];
    const negMatch=q.match(/(?:no|not|don'?t want|without|avoid)\s+([a-z\s,]+?)(?:[.!?]|$)/);
    const negGenres=negMatch?(negMatch[1].match(/[a-z]+/g)||[]):[];
    const wantHigh=/highly|best|top|acclaim|great|excellent|amazing/.test(q);
    let moodGenres=[];
    for(const k in MOOD_MAP) if(q.includes(k)) moodGenres.push(...MOOD_MAP[k]);

    // detect reference title (multi-word match)
    let refMovie=null;
    for(const m of state.movies){
      const t=m.title.toLowerCase();
      if(t.length>3 && q.includes(t)){ refMovie=m; break; }
    }

    const scored=state.movies.map(m=>{
      let score=0, reasons=[];
      const text=(m.title+' '+(m.director||'')+' '+(m.country||'')+' '+m.genres.join(' ')+' '+(m.synopsis||'')).toLowerCase();
      tokens.forEach(t=>{if(t.length>2 && text.includes(t)) score+=1.5;});
      moodGenres.forEach(g=>{
        if(m.genres.some(x=>x.toLowerCase().includes(g))){score+=3.5;if(!reasons.includes('matches your mood'))reasons.push('matches your mood')}
      });
      negGenres.forEach(g=>{
        if(g.length>2 && m.genres.some(x=>x.toLowerCase().includes(g.trim()))) score-=10;
      });
      if(m.director && q.includes(m.director.toLowerCase())){score+=10;reasons.push(`by ${m.director}`)}
      if(m.country && q.includes(m.country.toLowerCase())){score+=5;reasons.push(`from ${m.country}`)}
      m.genres.forEach(g=>{if(q.includes(g.toLowerCase())){score+=4;reasons.push(`${g}`)}});
      if(wantHigh && m.rating){score+=Math.max(0,(m.rating-6))*2;if(m.rating>=7.5)reasons.push('highly rated')}
      if(m.rating){score+=(m.rating-5)*0.4}
      if(refMovie && m.id!==refMovie.id){
        const shared=m.genres.filter(g=>refMovie.genres.includes(g)).length;
        if(shared){score+=shared*3;reasons.push(`similar to ${refMovie.title}`)}
        if(m.director&&m.director===refMovie.director){score+=5;reasons.push(`same director as ${refMovie.title}`)}
      }
      return {m,score,reasons};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,8);

    const max=scored[0]?.score||1;
    if(!scored.length){
      $('#aiResults').innerHTML=`<div class="ai-empty">No strong matches. Try mentioning a genre, mood, language, or a movie you loved.</div>`;
      return;
    }
    $('#aiResults').innerHTML=scored.map(({m,score,reasons})=>{
      const why=reasons.length?[...new Set(reasons)].slice(0,3).join(' · '):'closest match to your prompt';
      const pct=Math.min(100,Math.round(score/max*100));
      const bg = m.poster ? `background:#000 center/cover url('${m.poster}')` : posterStyle(m);
      const rating=m.rating?Number(m.rating).toFixed(1):'—';
      return `<div class="ai-card" data-id="${m.id}">
        <div class="ai-poster" style="${bg}">
          <div class="ai-poster-veil"></div>
          <span class="ai-pct">${pct}% match</span>
        </div>
        <h4>${escape(m.title)} <span class="muted">${m.year||''}</span></h4>
        <div class="ai-meta">★ ${rating} · ${escape(m.genres.slice(0,2).join(', '))}${m.director?' · '+escape(m.director):''}</div>
        <div class="score-bar"><i style="width:${pct}%"></i></div>
        <div class="why">✨ ${escape(why)}</div>
      </div>`;
    }).join('');
    $$('#aiResults .ai-card').forEach(el=>el.onclick=()=>{const m=state.movies.find(x=>x.id==el.dataset.id);if(m)openMovie(m)});
  },120);
}
