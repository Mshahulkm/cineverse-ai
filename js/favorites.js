function toggleFav(id){
  const i=state.favs.indexOf(id);
  if(i>=0){state.favs.splice(i,1);showToast('Removed from favorites')}
  else{state.favs.push(id);showToast('❤ Added to favorites');confetti()}
  localStorage.setItem('cineai.favs',JSON.stringify(state.favs));
  $$(`[data-fav="${id}"]`).forEach(b=>{const on=state.favs.includes(id);b.classList.toggle('on',on);b.textContent=on?'❤':'♡'});
  renderFavs();
}
function toggleWatch(id){
  const i=state.watch.indexOf(id);
  if(i>=0){state.watch.splice(i,1);showToast('Removed from watchlist')}
  else{state.watch.push(id);showToast('🕒 Added to watchlist')}
  localStorage.setItem('cineai.watch',JSON.stringify(state.watch));
  renderFavs();
}
function renderFavs(){
  const ids=state.tab==='favs'?state.favs:state.watch;
  const list=ids.map(id=>state.movies.find(m=>m.id==id)).filter(Boolean);
  const g=$('#favGrid');
  if(!list.length){g.innerHTML=`<div class="empty" style="grid-column:1/-1">${state.tab==='favs'?'No favorites yet — tap ♡ on any movie.':'Your watchlist is empty.'}</div>`;return}
  g.innerHTML=list.map(cardHTML).join('');
}
function confetti(){
  const colors=['#6D28D9','#2563EB','#EC4899','#F97316','#FBBF24','#10B981'];
  for(let i=0;i<24;i++){
    const d=document.createElement('div');
    const x=window.innerWidth/2, y=window.innerHeight-80;
    d.style.cssText=`position:fixed;left:${x}px;top:${y}px;width:8px;height:8px;border-radius:2px;background:${colors[i%colors.length]};z-index:300;pointer-events:none;transition:transform 1.1s cubic-bezier(.2,.7,.3,1),opacity 1.1s`;
    document.body.appendChild(d);
    requestAnimationFrame(()=>{
      const ang=Math.random()*Math.PI-Math.PI/2;
      const dist=160+Math.random()*180;
      d.style.transform=`translate(${Math.cos(ang)*dist}px,${Math.sin(ang)*dist-120}px) rotate(${Math.random()*720}deg)`;
      d.style.opacity='0';
    });
    setTimeout(()=>d.remove(),1200);
  }
}
