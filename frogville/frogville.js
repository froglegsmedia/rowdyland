(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = Math.min(innerWidth, innerHeight) < 700;
  var box = document.querySelector(".fireflies");
  var n = small ? 14 : 30;
  for (var i = 0; i < n; i++) {
    var f = document.createElement("span");
    f.className = "ff";
    f.style.left = Math.random() * 100 + "%";
    f.style.top = 25 + Math.random() * 65 + "%";
    f.style.setProperty("--d", 2 + Math.random() * 3 + "s");
    f.style.setProperty("--dd", 6 + Math.random() * 8 + "s");
    f.style.setProperty("--delay", -Math.random() * 6 + "s");
    f.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
    f.style.setProperty("--dy", (Math.random() * 60 - 30) + "px");
    box.appendChild(f);
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.3 });
  document.querySelectorAll(".feature").forEach(function (s) { io.observe(s); });
  setTimeout(function () { document.body.classList.remove("entering"); }, 1100);

  if (reduce) return;
  var layers = [].slice.call(document.querySelectorAll("[data-speed]"));
  var ticking = false;
  function update() {
    var y = scrollY;
    layers.forEach(function (el) {
      var s = parseFloat(el.dataset.speed);
      var flip = el.classList.contains("tree-r") ? " scaleX(-1)" : "";
      if (el.closest(".scene")) el.style.transform = "translate3d(0," + (-y * s) + "px,0)" + flip;
      else {
        var r = el.getBoundingClientRect();
        var mid = r.top + r.height / 2 - innerHeight / 2;
        el.style.transform = "translate3d(0," + (mid * s) + "px,0)";
      }
    });
    ticking = false;
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
})();

/* Frog Legs jukebox */
(function () {
  var jb = document.getElementById("jukebox"), mute = document.getElementById("mute");
  if (!jb) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var audio = null, wantPlay = false;
  function getAudio() {
    if (audio) return audio;
    audio = document.createElement("audio");
    audio.loop = true; audio.preload = "auto";
    var m = document.createElement("source"); m.src = "audio/frog-legs.mp3?v=3"; m.type = "audio/mpeg";
    var a = document.createElement("source"); a.src = "audio/frog-legs.m4a?v=3"; a.type = "audio/mp4";
    audio.appendChild(m); audio.appendChild(a);
    document.body.appendChild(audio);
    return audio;
  }
  function setUI(on) {
    document.body.classList.toggle("playing", on);
    jb.setAttribute("aria-pressed", on); jb.setAttribute("aria-label", on ? "Stop Frog Legs" : "Play Frog Legs");
    mute.setAttribute("aria-pressed", on); mute.setAttribute("aria-label", on ? "Mute music" : "Play music: Frog Legs");
    mute.firstElementChild.innerHTML = on ? "&#128266;" : "&#128264;";
  }
  function burst() {
    if (reduce) return;
    var b = jb.querySelector(".jb-burst"), ch = ["\u266A", "\u266B", "\u266A", "\u266C", "\u266B", "\u266A"];
    ch.forEach(function (c, i) {
      var n = document.createElement("i"); n.textContent = c;
      var ang = -Math.PI / 2 + (i - 2.5) * 0.45;
      n.style.setProperty("--bx", Math.cos(ang) * 90 + "px"); n.style.setProperty("--by", Math.sin(ang) * 110 + "px");
      n.style.setProperty("--br", (Math.random() * 60 - 30) + "deg");
      b.appendChild(n); setTimeout(function () { n.remove(); }, 1200);
    });
    jb.classList.remove("flare"); void jb.offsetWidth; jb.classList.add("flare");
  }
  function play() {
    wantPlay = true; burst();
    var p = getAudio().play();
    setUI(true); sessionStorage.setItem("fvMusic", "on");
    if (p && p.catch) p.catch(function () { wantPlay = false; setUI(false); });
  }
  function stop(remember) {
    wantPlay = false; if (audio) audio.pause(); setUI(false);
    if (remember) sessionStorage.setItem("fvMusic", "off");
  }
  function toggle() { if (wantPlay) stop(true); else play(); }
  jb.addEventListener("click", toggle);
  mute.addEventListener("click", toggle);
  if (sessionStorage.getItem("fvMusic") === "on") jb.querySelector(".jb-hint").textContent = "Tap to keep it going";
  document.addEventListener("visibilitychange", function () {
    if (!audio) return;
    if (document.hidden) audio.pause(); else if (wantPlay) audio.play().catch(function () {});
  });
  window.addEventListener("pagehide", function () { if (audio) audio.pause(); });
})();

/* panels, boil, fireflies, day/night */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = Math.min(innerWidth, innerHeight) < 700;
  var lastFocus = null, openEl = null;
  function openPanel(id) {
    var el = document.getElementById(id); if (!el) return;
    lastFocus = document.activeElement; el.hidden = false; openEl = el;
    el.querySelector(".sheet-close").focus();
  }
  function closePanel() {
    if (!openEl) return; openEl.hidden = true; openEl = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll(".sheet-wrap").forEach(function (w) {
    w.addEventListener("click", function (e) { if (e.target === w || e.target.closest(".sheet-close")) closePanel(); });
  });
  document.addEventListener("keydown", function (e) {
    if (!openEl) return;
    if (e.key === "Escape") closePanel();
    if (e.key === "Tab") {
      var f = openEl.querySelectorAll("a[href], button"), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.querySelector(".hot-stage").addEventListener("click", function () { openPanel("lineup"); });
  var pot = document.querySelector(".hot-pot"), shack = document.querySelector(".shack-art");
  pot.addEventListener("click", function () {
    if (!reduce) {
      shack.classList.remove("boiling"); void shack.offsetWidth; shack.classList.add("boiling");
      for (var i = 0; i < 8; i++) {
        var b = document.createElement("span"); b.className = "bubble";
        b.style.right = 10 + Math.random() * 22 + "%"; b.style.bottom = 30 + Math.random() * 10 + "%";
        b.style.setProperty("--bx", (Math.random() * 40 - 20) + "px"); b.style.animationDelay = i * 0.05 + "s";
        shack.appendChild(b); setTimeout(function (x) { return function () { x.remove(); }; }(b), 1300);
      }
      setTimeout(function () { shack.classList.remove("boiling"); }, 1400);
    }
    setTimeout(function () { openPanel("menu"); }, reduce ? 0 : 450);
  });

  /* firefly catch */
  var layer = document.getElementById("catch-layer"), nEl = document.getElementById("jar-n"), jar = document.getElementById("jar"), hint = document.getElementById("jar-hint");
  var count = parseInt(sessionStorage.getItem("fvCaught") || "0", 10), GOAL = 10;
  function render() {
    nEl.textContent = Math.min(count, GOAL);
    var icon = jar.querySelector(".jar-icon");
    icon.style.setProperty("--fill", Math.min(count, GOAL) * 10 + "%"); icon.style.setProperty("--fill-n", Math.min(count, GOAL));
    if (document.body.classList.contains("day")) hint.textContent = "Fireflies come out at night";
    else hint.textContent = count >= GOAL ? "Bayou glow unlocked" : "Catch fireflies";
  }
  function spawn() {
    var b = document.createElement("button");
    b.type = "button"; b.className = "catch"; b.setAttribute("aria-label", "Catch a firefly"); b.tabIndex = -1;
    b.style.left = 8 + Math.random() * 84 + "%"; b.style.top = 18 + Math.random() * 64 + "%";
    b.style.setProperty("--d", 1.8 + Math.random() * 1.5 + "s"); b.style.setProperty("--dd", 5 + Math.random() * 6 + "s");
    b.style.setProperty("--dx", (Math.random() * 120 - 60) + "px"); b.style.setProperty("--dy", (Math.random() * 90 - 45) + "px");
    b.style.animationDelay = -Math.random() * 5 + "s";
    b.addEventListener("click", function (e) {
      var r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (!reduce) for (var i = 0; i < 8; i++) {
        var s = document.createElement("span"); s.className = "sparkle"; s.style.left = x + "px"; s.style.top = y + "px";
        var a = i / 8 * Math.PI * 2; s.style.setProperty("--sx", Math.cos(a) * 30 + "px"); s.style.setProperty("--sy", Math.sin(a) * 30 + "px");
        document.body.appendChild(s); setTimeout(function (z) { return function () { z.remove(); }; }(s), 800);
      }
      b.remove(); count++; sessionStorage.setItem("fvCaught", count); render();
      jar.classList.remove("bump"); void jar.offsetWidth; jar.classList.add("bump");
      if (count === GOAL) setTimeout(function () { openPanel("glow"); }, 500);
      setTimeout(spawn, 1500 + Math.random() * 2000);
    });
    layer.appendChild(b);
  }
  for (var i = 0; i < (small ? 5 : 7); i++) spawn();
  window.__fvCatch = function () { var c = layer.querySelector(".catch"); if (c) c.click(); };

  /* day / night */
  var dn = document.getElementById("daynight");
  function setDay(on) {
    document.body.classList.toggle("day", on);
    dn.setAttribute("aria-pressed", on); dn.setAttribute("aria-label", on ? "Switch to night" : "Switch to daytime");
    dn.firstElementChild.innerHTML = on ? "&#9728;" : "&#9790;";
    sessionStorage.setItem("fvDay", on ? "1" : "0"); render();
  }
  dn.addEventListener("click", function () { setDay(!document.body.classList.contains("day")); });
  setDay(sessionStorage.getItem("fvDay") === "1");
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
