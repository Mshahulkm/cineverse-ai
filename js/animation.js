function initParticles(){
  const c=document.getElementById('particles');if(!c)return;
  const ctx=c.getContext('2d');
  let w,h,parts;
  function size(){w=c.width=innerWidth;h=c.height=innerHeight;parts=Array.from({length:Math.min(70,Math.floor(w/24))},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.4,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,a:Math.random()*.5+.2}))}
  size();addEventListener('resize',size);
  function loop(){
    ctx.clearRect(0,0,w,h);
    parts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(180,180,255,${p.a})`;ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
  // mouse parallax for orbs
  document.addEventListener('mousemove',e=>{
    const x=(e.clientX/innerWidth-.5)*20, y=(e.clientY/innerHeight-.5)*20;
    document.querySelectorAll('.orb').forEach((o,i)=>{o.style.transform=`translate(${x*(i+1)*.4}px,${y*(i+1)*.4}px)`});
  });
}
