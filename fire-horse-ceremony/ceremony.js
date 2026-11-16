/* rising embers */
(function () {
  var c = document.querySelector(".embers"); if (!c || !c.getContext) return;
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var x = c.getContext("2d"), w, h, dpr, ps = [], raf = 0;
  function size() { dpr = Math.min(window.devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function spawn(p, any) { p.x = Math.random() * w; p.y = any ? Math.random() * h : h + 10; p.r = 0.6 + Math.random() * 1.9; p.vy = 0.25 + Math.random() * 0.9; p.sw = Math.random() * 6.28; p.ss = 0.004 + Math.random() * 0.012; p.life = 0.5 + Math.random() * 0.5; p.hue = 18 + Math.random() * 26; return p; }
  function init() { size(); var n = Math.round(Math.min(90, w * h / 16000)); ps = []; for (var i = 0; i < n; i++) ps.push(spawn({}, true)); }
  function draw(still) {
    x.clearRect(0, 0, w, h); x.globalCompositeOperation = "lighter";
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (!still) { p.y -= p.vy; p.sw += p.ss; p.x += Math.sin(p.sw) * 0.35; if (p.y < -10) spawn(p, false); }
      var a = Math.max(0, Math.min(1, p.y / h)) * p.life;
      var g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, "hsla(" + p.hue + ",100%,70%," + a + ")"); g.addColorStop(1, "hsla(" + p.hue + ",100%,50%,0)");
      x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, p.r * 4, 0, 6.283); x.fill();
    }
    x.globalCompositeOperation = "source-over";
  }
  function loop() { draw(false); raf = requestAnimationFrame(loop); }
  function start() { cancelAnimationFrame(raf); if (mq && mq.matches) draw(true); else loop(); }
  init(); start();
  window.addEventListener("resize", function () { init(); start(); });
  if (mq && mq.addEventListener) mq.addEventListener("change", start);
  document.addEventListener("visibilitychange", function () { if (document.hidden) cancelAnimationFrame(raf); else start(); });
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
