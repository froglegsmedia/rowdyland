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

/* story-v2: shift background tint by chapter */
(function () {
  var sky = document.querySelector(".sky"); if (!sky || !("IntersectionObserver" in window)) return;
  var T = {
    wild: "linear-gradient(180deg, rgba(255,170,90,0.45), rgba(150,80,40,0.2))",
    stride: "linear-gradient(180deg, rgba(255,120,70,0.45), rgba(120,50,90,0.25))",
    ancestors: "linear-gradient(180deg, rgba(40,60,160,0.55), rgba(20,20,70,0.4))",
    "pony-tale": "linear-gradient(180deg, rgba(60,80,170,0.5), rgba(30,30,80,0.35))",
    captured: "linear-gradient(180deg, rgba(110,60,140,0.45), rgba(40,20,50,0.4))",
    plan: "linear-gradient(180deg, rgba(180,40,40,0.4), rgba(60,20,30,0.35))",
    taken: "linear-gradient(180deg, rgba(20,30,70,0.6), rgba(10,10,25,0.55))",
    firehorse: "linear-gradient(180deg, rgba(255,90,20,0.6), rgba(200,40,10,0.45))",
    free: "linear-gradient(180deg, rgba(255,200,80,0.6), rgba(230,140,40,0.4))"
  };
  var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && T[e.target.id]) sky.style.setProperty("--tint", T[e.target.id]); }); }, { rootMargin: "-45% 0px -45% 0px" });
  Object.keys(T).forEach(function (id) { var el = document.getElementById(id); if (el) o.observe(el); });
})();
