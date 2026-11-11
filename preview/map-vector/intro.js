(function(){
  var K='rowdyIntroSeen';
  try{if(sessionStorage.getItem(K))return;}catch(e){}
  if(location.hash&&location.hash!=='#')return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var d=document,h=d.documentElement,done=false,started=false,cap;
  var w=d.createElement('div');w.id='rintro';w.setAttribute('aria-hidden','true');
  w.innerHTML='<video muted autoplay playsinline webkit-playsinline preload="auto" disablepictureinpicture poster="assets/rowdy-burger-poster.jpg?v=intro2"><source src="assets/rowdy-burger.mp4?v=intro2" type="video/mp4"></video>'+
    '<button type="button" class="rplay" aria-label="Play intro">&#9654; Play</button><button type="button" class="rskip" aria-label="Skip intro">Skip</button>';
  var v=w.querySelector('video'),b=w.querySelector('.rskip'),pl=w.querySelector('.rplay');
  v.muted=true;v.defaultMuted=true;v.playsInline=true;
  h.classList.add('rintro-on');
  function seen(){try{sessionStorage.setItem(K,'1');}catch(e){}}
  function end(){if(done)return;done=true;seen();w.classList.add('out');h.classList.remove('rintro-on');setTimeout(function(){w.remove();},800);}
  function showPlay(){if(!started&&!done)w.classList.add('needtap');}
  function tryPlay(){if(done||started)return;var p;try{p=v.play();}catch(e){showPlay();return;}if(p&&p.catch)p.catch(showPlay);}
  v.addEventListener('playing',function(){if(started)return;started=true;seen();w.classList.remove('needtap');clearTimeout(cap);cap=setTimeout(end,((v.duration||4)+1.5)*1000);});
  v.addEventListener('loadeddata',tryPlay);v.addEventListener('canplay',tryPlay);
  v.onended=end;v.onerror=end;var s=v.querySelector('source');if(s)s.onerror=end;
  b.onclick=end;pl.onclick=function(){v.muted=true;var p=v.play();if(p&&p.catch)p.catch(end);};
  d.addEventListener('keydown',function(e){if(e.key==='Escape')end();});
  setTimeout(showPlay,4000);
  cap=setTimeout(end,15000);
  function mount(){d.body.appendChild(w);tryPlay();}
  if(d.body)mount();else d.addEventListener('DOMContentLoaded',mount);
})();
