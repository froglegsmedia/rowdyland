(function () {
  setTimeout(function () { document.body.classList.remove("entering"); }, 1100);
  var gl = document.querySelector(".glitter");
  for (var i = 0; i < 26; i++) { var s = document.createElement("span"); s.className = "gl"; s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 100 + "%"; s.style.setProperty("--d", 2 + Math.random() * 3 + "s"); s.style.setProperty("--delay", -Math.random() * 3 + "s"); gl.appendChild(s); }
})();

/* ring toss: tap when the swinging ring is over the glowing bottle */
(function () {
  var box = document.getElementById("toss"), ring = document.getElementById("ring"), tgt = document.getElementById("target"), msg = document.getElementById("toss-msg");
  var dots = document.querySelectorAll(".dots i"), cnt = document.getElementById("toss-count"), win = document.getElementById("win");
  // bottle neck positions (% of the toss box), from the crate art
  var NECKS = [[29.3,5.2],[48.8,5.2],[68.4,5.2],[23.9,23.4],[40.5,23.4],[54.9,23.4],[75.0,23.4],[19.7,42.3],[38.0,42.9],[55.8,42.9],[80.2,42.3]];
  var hits = 0, busy = false, t0 = performance.now(), cur = null, x = 50, TOL = 3.6;
  var cratePos = function () { var c = box.querySelector(".crate"); return { top: (box.clientHeight - c.clientHeight) / box.clientHeight * 100, h: c.clientHeight / box.clientHeight }; };
  function pick() { var n; do { n = NECKS[Math.floor(Math.random() * NECKS.length)]; } while (n === cur); cur = n; var cp = cratePos(); tgt.style.left = n[0] + "%"; tgt.style.top = (cp.top + n[1] * cp.h) + "%"; }
  function speed() { return 0.0016 + hits * 0.0004; }
  function loop(now) {
    if (!busy) { x = 50 + 40 * Math.sin((now - t0) * speed() * Math.PI); ring.style.left = x + "%"; }
    requestAnimationFrame(loop);
  }
  function setDots() { dots.forEach(function (d, i) { d.classList.toggle("on", i < hits); }); cnt.textContent = hits + " of 3 ringers"; }
  box.addEventListener("click", function () {
    if (busy) return; busy = true;
    var cp = cratePos(), ty = cp.top + cur[1] * cp.h, good = Math.abs(x - cur[0]) <= TOL;
    ring.classList.add("fly"); ring.style.top = (ty - 3) + "%"; ring.style.width = "11%";
    setTimeout(function () {
      if (good) { hits++; msg.textContent = hits >= 3 ? "Three ringers!" : "Ringer! " + (3 - hits) + " to go."; }
      else { msg.textContent = (x < cur[0] ? "Just left." : "Just right.") + " Try again!"; }
      setDots();
      setTimeout(function () {
        ring.classList.remove("fly"); ring.style.top = "6%"; ring.style.width = ""; t0 = performance.now() - Math.random() * 600; pick(); busy = false;
        if (hits >= 3) { win.hidden = false; win.querySelector(".sheet-close").focus(); hits = 0; setDots(); }
      }, 650);
    }, 460);
  });
  win.addEventListener("click", function (e) { if (e.target === win || e.target.closest(".sheet-close")) win.hidden = true; });
  document.addEventListener("keydown", function (e) { if (!win.hidden && e.key === "Escape") win.hidden = true; });
  window.__winToss = function () { win.hidden = false; };
  addEventListener("resize", pick); pick(); requestAnimationFrame(loop);
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
