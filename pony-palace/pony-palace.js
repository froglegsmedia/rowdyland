(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = Math.min(innerWidth, innerHeight) < 700;
  var box = document.querySelector(".glitter");
  for (var i = 0; i < (small ? 18 : 36); i++) {
    var s = document.createElement("span"); s.className = "gl";
    s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--d", 1.5 + Math.random() * 3 + "s"); s.style.setProperty("--delay", -Math.random() * 4 + "s");
    box.appendChild(s);
  }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); }); }, { threshold: 0.25 });
  document.querySelectorAll(".feature").forEach(function (s) { io.observe(s); });
  setTimeout(function () { document.body.classList.remove("entering"); }, 1100);

  function burst(el, n) {
    if (reduce) return;
    var r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height * 0.4;
    for (var i = 0; i < n; i++) {
      var p = document.createElement("span"); p.className = "sparkle"; p.textContent = i % 2 ? "\u2726" : "\u2727";
      p.style.left = x + "px"; p.style.top = y + "px";
      var a = i / n * Math.PI * 2, d = 60 + Math.random() * 60;
      p.style.setProperty("--sx", Math.cos(a) * d + "px"); p.style.setProperty("--sy", Math.sin(a) * d + "px");
      document.body.appendChild(p); setTimeout(function (z) { return function () { z.remove(); }; }(p), 900);
    }
  }
  var statue = document.getElementById("statue");
  var song = null, fi = null;
  function setPlaying(on) { statue.classList.toggle("playing", on); statue.setAttribute("aria-pressed", on); statue.setAttribute("aria-label", on ? "Pause Hometown" : "Play Hometown"); }
  statue.addEventListener("click", function () {
    burst(statue, 14);
    if (!song) { song = new Audio("audio/hometown.mp3"); song.preload = "auto"; song.addEventListener("ended", function () { setPlaying(false); }); }
    clearInterval(fi);
    if (song.paused) {
      song.volume = 0; var fv = 0;
      fi = setInterval(function () { fv = Math.min(1, fv + 0.08); song.volume = fv; if (fv >= 1) clearInterval(fi); }, 40);
      var pr = song.play(); setPlaying(true);
      if (pr && pr.catch) pr.catch(function () { setPlaying(false); });
    } else { song.pause(); setPlaying(false); }
    statue.classList.remove("glow-up"); void statue.offsetWidth; statue.classList.add("glow-up");
  });
  document.addEventListener("visibilitychange", function () { if (document.hidden && song && !song.paused) { song.pause(); setPlaying(false); } });
  var fortunes = ["A cowboy with good manners is headed your way.", "Your boots will survive the night. Barely.", "Say yes to the next dance.", "Somebody's saving you a seat on the balcony.", "Tonight you find the way out of the maze.", "More rhinestones. Always more rhinestones.", "The statue says: go on, be trouble."];
  var wish = document.getElementById("wish"), out = document.getElementById("fortune"), last = -1;
  wish.addEventListener("click", function () {
    var k; do { k = Math.floor(Math.random() * fortunes.length); } while (k === last); last = k;
    burst(wish, 10); out.textContent = fortunes[k]; out.classList.remove("show"); void out.offsetWidth; out.classList.add("show");
  });

  if (reduce) return;
  var layers = [].slice.call(document.querySelectorAll("[data-speed]")), ticking = false;
  function update() {
    var y = scrollY;
    layers.forEach(function (el) {
      var s = parseFloat(el.dataset.speed);
      if (el.closest(".scene")) el.style.transform = "translate3d(0," + (-y * s) + "px,0)";
      else { var r = el.getBoundingClientRect(); var o = Math.max(-40, Math.min(40, (r.top + r.height / 2 - innerHeight / 2) * s)); el.style.transform = "translate3d(0," + o + "px,0)"; }
    });
    ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update); update();
})();
