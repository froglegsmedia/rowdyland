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
  var box = document.querySelector(".embers");
  if (box && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (var k = 0; k < 26; k++) { var s = document.createElement("i"); s.style.left = Math.random() * 100 + "%"; s.style.setProperty("--d", 6 + Math.random() * 8 + "s"); s.style.setProperty("--delay", -Math.random() * 12 + "s"); box.appendChild(s); }
  }
})();
