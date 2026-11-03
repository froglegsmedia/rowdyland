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

/* anthem: reveal and highlight lines */
(function () {
  var lines = [].slice.call(document.querySelectorAll(".ln"));
  lines.forEach(function (l, i) { l.style.setProperty("--i", i % 10); });
  lines.forEach(function (l) {
    l.addEventListener("click", function () {
      var on = !l.classList.contains("lit");
      lines.forEach(function (x) { x.classList.remove("lit"); });
      if (on) l.classList.add("lit");
    });
  });
  if (!("IntersectionObserver" in window)) { lines.forEach(function (l) { l.classList.add("seen"); }); return; }
  var r = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("seen"); }); }, { rootMargin: "0px 0px -12% 0px" });
  var h = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle("hot", e.isIntersecting); }); }, { rootMargin: "-40% 0px -40% 0px" });
  lines.forEach(function (l) { r.observe(l); h.observe(l); });
})();

/* anthem player: same song as Fire Horse Plaza, starts on tap */
(function () {
  var a = document.getElementById("anthem-song"), btn = document.getElementById("play-btn"); if (!a || !btn) return;
  var bar = document.getElementById("pl-bar"), fill = document.getElementById("pl-fill"), tm = document.getElementById("pl-time"), lab = document.getElementById("pl-label");
  function fmt(t) { t = Math.max(0, Math.floor(t || 0)); return Math.floor(t / 60) + ":" + ("0" + (t % 60)).slice(-2); }
  function ui() { var on = !a.paused; btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", on); btn.setAttribute("aria-label", on ? "Pause the Rowdyland Anthem" : "Play the Rowdyland Anthem"); btn.querySelector(".ic").innerHTML = on ? "&#10074;&#10074;" : "&#9654;"; lab.textContent = on ? "Now playing: The Rowdyland Anthem" : (a.currentTime > 0 ? "Paused" : "Play the anthem"); }
  btn.addEventListener("click", function () { if (a.paused) { var p = a.play(); if (p && p.catch) p.catch(function () {}); } else a.pause(); });
  a.addEventListener("play", ui); a.addEventListener("pause", ui); a.addEventListener("ended", function () { a.currentTime = 0; ui(); });
  a.addEventListener("timeupdate", function () { var d = a.duration || 0, pc = d ? a.currentTime / d * 100 : 0; fill.style.width = pc + "%"; bar.setAttribute("aria-valuenow", Math.round(pc)); tm.textContent = fmt(a.currentTime) + (d ? " / " + fmt(d) : ""); });
  function seek(pc) { if (a.duration) a.currentTime = Math.min(1, Math.max(0, pc)) * a.duration; }
  bar.addEventListener("click", function (e) { var r = bar.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); });
  bar.addEventListener("keydown", function (e) { if (!a.duration) return; if (e.key === "ArrowRight") a.currentTime = Math.min(a.duration, a.currentTime + 5); if (e.key === "ArrowLeft") a.currentTime = Math.max(0, a.currentTime - 5); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) a.pause(); });
})();
