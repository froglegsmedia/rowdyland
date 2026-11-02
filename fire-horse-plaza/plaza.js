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

/* gold rosette find */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var layer = document.getElementById("catch-layer"), nEl = document.getElementById("jar-n"), jar = document.getElementById("jar"), hint = document.getElementById("jar-hint");
  var pop = document.getElementById("lucky"), lastFocus = null;
  var count = parseInt(sessionStorage.getItem("fhCaught") || "0", 10), GOAL = 10;
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
    hint.textContent = count >= GOAL ? "Every ember found" : "gold embers found";
  }
  var SPOTS = [
    ["r1", ".hero", "8%", "84%", -14],
    ["r2", "#ceremony .art", "90%", "14%", 18],
    ["r3", "#when .art", "8%", "86%", -10],
    ["r4", "#anthem .art", "92%", "84%", 12],
    ["r5", "#gold .art", "10%", "12%", -20],
    ["r6", "#notes .art", "88%", "60%", -8],
    ["r7", "#ceremony .art", "6%", "34%", -12],
    ["r8", "#ceremony .art", "10%", "62%", 16],
    ["r9", "#gold .art", "90%", "50%", -8],
    ["r10", "#tickets", "88%", "20%", 10]
  ];
  var found = []; try { found = JSON.parse(sessionStorage.getItem("fhFound") || "[]"); } catch (e) {}
  count = Math.max(count, found.length);
  SPOTS.forEach(function (s, i) {
    if (found.indexOf(s[0]) > -1) return;
    var host = document.querySelector(s[1]); if (!host) return;
    var b = document.createElement("button");
    b.type = "button"; b.className = "catch"; b.setAttribute("aria-label", "Gold ember");
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
      sessionStorage.setItem("fhFound", JSON.stringify(found)); sessionStorage.setItem("fhCaught", count); render();
      jar.classList.remove("bump"); void jar.offsetWidth; jar.classList.add("bump");
      if (count === GOAL) setTimeout(openPop, 500);
    });
    host.appendChild(b);
  });
  render();
  window.__fhCatch = function () { var c = document.querySelector(".catch"); if (c) c.click(); };
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
  document.querySelectorAll("[data-reserve]").forEach(function (b) { b.addEventListener("click", open); });
  pop.addEventListener("click", function (e) { if (e.target === pop || e.target.closest(".sheet-close")) close(); });
  document.addEventListener("keydown", function (e) { if (!pop.hidden && e.key === "Escape") close(); });
})();

/* day / night toggle */
(function () {
  var b = document.getElementById("daynight"); if (!b) return;
  var now = document.getElementById("now");
  function set(n) {
    document.body.classList.toggle("night", n); b.setAttribute("aria-pressed", n); b.textContent = n ? "\u2600 Day" : "\u263E Night";
    if (!window.__fhBusy) now.textContent = n ? "Final night: the fire ceremony, right before the headliner." : "Rowdy stands watch. Tap him to see the ceremony.";
  }
  b.addEventListener("click", function () { set(!document.body.classList.contains("night")); });
})();

/* fire ceremony: stone, ablaze, gold */
(function () {
  var st = document.getElementById("statue"); if (!st) return;
  var now = document.getElementById("now");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timers = [], emb = null;
  function clear() { timers.forEach(clearTimeout); timers = []; clearInterval(emb); }
  function embers() {
    if (reduce) return;
    emb = setInterval(function () {
      var r = st.getBoundingClientRect();
      for (var i = 0; i < 4; i++) {
        var e = document.createElement("span"); e.className = "ember";
        e.style.left = r.left + r.width * (0.25 + Math.random() * 0.5) + "px"; e.style.top = r.top + r.height * (0.15 + Math.random() * 0.4) + "px";
        e.style.setProperty("--ex", (Math.random() * 80 - 40) + "px"); e.style.setProperty("--t", 1.2 + Math.random() * 1.2 + "s");
        document.body.appendChild(e); setTimeout(function (z) { return function () { z.remove(); }; }(e), 2600);
      }
    }, 120);
  }
  function stage(s) {
    st.classList.toggle("ablaze", s === "fire"); st.classList.toggle("gold", s === "gold");
    st.setAttribute("aria-pressed", s !== "stone");
  }
  var song = null, fi = null;
  function play() {
    if (!song) { song = new Audio("audio/anthem.mp3?v=1"); song.preload = "auto"; }
    clearInterval(fi);
    document.querySelectorAll("audio").forEach(function (x) { if (x !== song) x.pause(); });
    song.currentTime = 0; song.volume = 0; var fv = 0;
    fi = setInterval(function () { fv = Math.min(1, fv + 0.08); song.volume = fv; if (fv >= 1) clearInterval(fi); }, 40);
    var pr = song.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  function stop() { clearInterval(fi); if (song) song.pause(); }
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); });
  st.addEventListener("click", function () {
    clear();
    if (st.classList.contains("gold") || st.classList.contains("ablaze")) { stage("stone"); stop(); window.__fhBusy = false; now.textContent = "Rowdy stands watch. Tap him to see the ceremony."; return; }
    window.__fhBusy = true;
    if (!document.body.classList.contains("night")) document.getElementById("daynight").click();
    stage("fire"); embers(); play(); now.textContent = "The anthem plays. Rowdy goes ablaze.";
    timers.push(setTimeout(function () { clearInterval(emb); stage("gold"); now.textContent = "Rowdy is revealed in gold. Tap to reset."; }, 4200));
  });
})();
