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

/* Dirty South jukebox */
(function () {
  var jb = document.getElementById("jukebox"), mute = document.getElementById("mute");
  if (!jb) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var audio = null, wantPlay = false;
  function getAudio() {
    if (audio) return audio;
    audio = document.createElement("audio");
    audio.loop = true; audio.preload = "auto";
    var m = document.createElement("source"); m.src = "audio/dirty-south.mp3"; m.type = "audio/mpeg";
    var a = document.createElement("source"); a.src = "audio/dirty-south.m4a"; a.type = "audio/mp4";
    audio.appendChild(m); audio.appendChild(a);
    document.body.appendChild(audio);
    return audio;
  }
  function setUI(on) {
    document.body.classList.toggle("playing", on);
    jb.setAttribute("aria-pressed", on); jb.setAttribute("aria-label", on ? "Stop Dirty South" : "Play Dirty South");
    mute.setAttribute("aria-pressed", on); mute.setAttribute("aria-label", on ? "Mute music" : "Play music: Dirty South");
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
