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

/* lucky horseshoe catch */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var layer = document.getElementById("catch-layer"), nEl = document.getElementById("jar-n"), jar = document.getElementById("jar"), hint = document.getElementById("jar-hint");
  var pop = document.getElementById("lucky"), lastFocus = null;
  var count = parseInt(sessionStorage.getItem("ppCaught") || "0", 10), GOAL = 10;
  function openPop() { lastFocus = document.activeElement; pop.hidden = false; pop.querySelector(".sheet-close").focus(); }
  function closePop() { if (pop.hidden) return; pop.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  pop.addEventListener("click", function (e) { if (e.target === pop || e.target.closest(".sheet-close")) closePop(); });
  document.addEventListener("keydown", function (e) {
    if (pop.hidden) return;
    if (e.key === "Escape") closePop();
    if (e.key === "Tab") {
      var f = pop.querySelectorAll("a[href], button"), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  function render() {
    var c = Math.min(count, GOAL); nEl.textContent = c;
    jar.querySelector(".jar-icon").style.setProperty("--fill-n", c);
    hint.textContent = count >= GOAL ? "Lucky streak unlocked" : "lucky horseshoes found";
  }
  var SPOTS = [
    ["h1", ".hero", "6%", "88%", -18],
    ["h2", "#maze .art", "88%", "14%", 22],
    ["h3", "#barn .art", "9%", "84%", -10],
    ["h4", "#circus .art", "91%", "70%", 14],
    ["h5", "#balcony .art", "14%", "10%", -24],
    ["h6", "#saloon .art", "86%", "90%", 8],
    ["h7", "#glam .art", "6%", "40%", -14],
    ["h8", "#tunnel .art", "93%", "30%", 18],
    ["h9", "#fountain .art", "92%", "8%", -8],
    ["h10", "#fashion .art", "10%", "92%", 12]
  ];
  var found = []; try { found = JSON.parse(sessionStorage.getItem("ppFound") || "[]"); } catch (e) {}
  count = Math.max(count, found.length);
  SPOTS.forEach(function (s, i) {
    if (found.indexOf(s[0]) > -1) return;
    var host = document.querySelector(s[1]); if (!host) return;
    var b = document.createElement("button");
    b.type = "button"; b.className = "catch"; b.setAttribute("aria-label", "Lucky horseshoe");
    b.style.left = s[2]; b.style.top = s[3]; b.style.setProperty("--rot", s[4] + "deg");
    b.style.setProperty("--gd", (i * 0.9) % 6 + "s");
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (!reduce) for (var k = 0; k < 8; k++) {
        var sp = document.createElement("span"); sp.className = "sparkle"; sp.textContent = k % 2 ? "\u2726" : "\u2727";
        sp.style.left = x + "px"; sp.style.top = y + "px";
        var a = k / 8 * Math.PI * 2; sp.style.setProperty("--sx", Math.cos(a) * 34 + "px"); sp.style.setProperty("--sy", Math.sin(a) * 34 + "px");
        document.body.appendChild(sp); setTimeout(function (z) { return function () { z.remove(); }; }(sp), 900);
      }
      b.remove(); found.push(s[0]); count = found.length;
      sessionStorage.setItem("ppFound", JSON.stringify(found)); sessionStorage.setItem("ppCaught", count); render();
      jar.classList.remove("bump"); void jar.offsetWidth; jar.classList.add("bump");
      if (count === GOAL) setTimeout(openPop, 500);
    });
    host.appendChild(b);
  });
  render();
  window.__ppCatch = function () { var c = document.querySelector(".catch"); if (c) c.click(); };
})();

/* saloon menu */
(function () {
  var pop = document.getElementById("menu"), last = null;
  function open() { last = document.activeElement; pop.hidden = false; pop.querySelector(".sheet-close").focus(); }
  function close() { if (pop.hidden) return; pop.hidden = true; if (last && last.focus) last.focus(); }
  document.querySelectorAll(".menu-open").forEach(function (el) {
    el.addEventListener("click", function (e) { if (e.target.closest(".catch, a")) return; open(); });
    el.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target === el) { e.preventDefault(); open(); } });
  });
  pop.addEventListener("click", function (e) { if (e.target === pop || e.target.closest(".sheet-close")) close(); });
  document.addEventListener("keydown", function (e) { if (!pop.hidden && e.key === "Escape") close(); });
})();

/* email signup (Kit form 9130714) */
(function () {
  document.querySelectorAll(".signup").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      if (!window.fetch || !window.FormData) return;
      e.preventDefault();
      var btn = f.querySelector("button"), msg = f.querySelector(".signup-msg");
      btn.disabled = true; msg.textContent = "";
      fetch(f.action, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.status === "success") { f.classList.add("done"); msg.textContent = "You're on the list!"; }
          else if (d.status === "quarantined" && d.url) { window.open(d.url, "_blank", "noopener"); msg.textContent = "One quick check in the new tab and you're on the list!"; btn.disabled = false; }
          else { msg.textContent = "Hmm, double check that email and try again."; btn.disabled = false; }
        })
        .catch(function () { f.submit(); });
    });
  });
})();

/* reserve popup */
(function () {
  var pop = document.getElementById("reserve"); if (!pop) return;
  var last = null;
  function open(e) { e.preventDefault(); last = document.activeElement; pop.hidden = false; pop.querySelector("input[type=email]").focus(); }
  function close() { if (pop.hidden) return; pop.hidden = true; if (last && last.focus) last.focus(); }
  var src = pop.querySelector('input[name="fields[signup_source]"]');
  document.querySelectorAll("[data-reserve]").forEach(function (b) { b.addEventListener("click", function (e) { if (src) src.value = b.classList.contains("merch-link") ? "balcony" : "tickets"; open(e); }); });
  pop.addEventListener("click", function (e) { if (e.target === pop || e.target.closest(".sheet-close")) close(); });
  document.addEventListener("keydown", function (e) { if (!pop.hidden && e.key === "Escape") close(); });
})();
