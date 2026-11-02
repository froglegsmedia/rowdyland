(function(){
  var K='rowdyIntroSeen';
  try{if(sessionStorage.getItem(K))return;sessionStorage.setItem(K,'1');}catch(e){}
  if(location.hash&&location.hash!=='#')return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var d=document,h=d.documentElement,done=false;
  var w=d.createElement('div');w.id='rintro';w.setAttribute('aria-hidden','true');
  var v=d.createElement('video');v.muted=true;v.defaultMuted=true;v.playsInline=true;v.autoplay=true;v.preload='auto';
  v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');
  v.poster='assets/rowdy-burger-poster.jpg?v=intro1';v.src='assets/rowdy-burger.mp4?v=intro1';
  var b=d.createElement('button');b.type='button';b.className='rskip';b.textContent='Skip';b.setAttribute('aria-label','Skip intro');
  w.appendChild(v);w.appendChild(b);h.classList.add('rintro-on');
  function end(){if(done)return;done=true;w.classList.add('out');h.classList.remove('rintro-on');setTimeout(function(){w.remove();},800);}
  b.onclick=end;v.onended=end;v.onerror=end;
  d.addEventListener('keydown',function(e){if(e.key==='Escape')end();});
  setTimeout(end,7000);
  function mount(){d.body.appendChild(w);var p=v.play();if(p&&p.catch)p.catch(function(){setTimeout(end,1200);});}
  if(d.body)mount();else d.addEventListener('DOMContentLoaded',mount);
})();
