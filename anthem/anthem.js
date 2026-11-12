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

/* anthem buckle player: full song, starts on tap, seekable on touch */
(function () {
  var a = document.getElementById("anthem-song"), btn = document.getElementById("play-btn"); if (!a || !btn) return;
  var hint = document.getElementById("play-hint"), seek = document.getElementById("seek");
  var nowEl = document.getElementById("time-now"), endEl = document.getElementById("time-end");
  var dragging = false;
  var tap = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  /* CBR length of audio/rowdyland-anthem.mp3, used until the browser reports duration */
  var KNOWN = 261.7;
  function dur() { var d = a.duration; return (isFinite(d) && d > 0) ? d : KNOWN; }
  function fmt(s, round) {
    if (!isFinite(s) || s < 0) s = 0;
    s = round ? Math.round(s) : Math.floor(s);
    var m = Math.floor(s / 60), r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }
  function verb(on) { return (tap ? "Tap" : "Click") + (on ? " to pause" : " to play"); }
  function ui() {
    var on = !a.paused, waiting = on && a.readyState < 3;
    if (hint) hint.textContent = waiting ? "Loading\u2026" : verb(on);
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", waiting ? "Loading the Rowdyland Anthem" : (on ? "Pause the Rowdyland Anthem" : "Play the Rowdyland Anthem"));
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = on ? "playing" : "paused";
  }
  function place() {
    var d = dur(), t = a.currentTime || 0;
    if (endEl) endEl.textContent = fmt(d, true);
    if (nowEl && !dragging) nowEl.textContent = fmt(t, false);
    if (seek && !dragging) {
      var p = Math.max(0, Math.min(1000, Math.round((t / d) * 1000)));
      seek.value = String(p);
      seek.style.setProperty("--p", (p / 10) + "%");
      seek.setAttribute("aria-valuemax", String(Math.round(d)));
      seek.setAttribute("aria-valuenow", String(Math.floor(t)));
      seek.setAttribute("aria-valuetext", fmt(t, false) + " of " + fmt(d, true));
    }
    if ("mediaSession" in navigator && navigator.mediaSession.setPositionState) {
      try { navigator.mediaSession.setPositionState({ duration: d, playbackRate: a.playbackRate || 1, position: Math.min(d, Math.max(0, t)) }); } catch (e) {}
    }
  }
  function jump(v) {
    var d = dur(), t = (Number(v) / 1000) * d;
    try { a.currentTime = Math.max(0, Math.min(d, t)); } catch (e) {}
  }
  btn.addEventListener("click", function () {
    if (a.paused) {
      if (hint && a.readyState < 3) hint.textContent = "Loading\u2026";
      var p = a.play();
      if (p && p.catch) p.catch(function () { ui(); });
    } else a.pause();
  });
  a.addEventListener("play", ui);
  a.addEventListener("pause", ui);
  a.addEventListener("playing", ui);
  a.addEventListener("waiting", function () { if (hint && !a.paused) hint.textContent = "Loading\u2026"; });
  a.addEventListener("canplay", ui);
  a.addEventListener("loadedmetadata", place);
  a.addEventListener("durationchange", place);
  a.addEventListener("timeupdate", place);
  a.addEventListener("ended", function () { try { a.currentTime = 0; } catch (e) {} ui(); place(); });
  if (seek) {
    seek.addEventListener("input", function () {
      dragging = true;
      var d = dur(), t = (Number(seek.value) / 1000) * d;
      if (nowEl) nowEl.textContent = fmt(t, false);
      seek.style.setProperty("--p", (Number(seek.value) / 10) + "%");
      seek.setAttribute("aria-valuetext", fmt(t, false) + " of " + fmt(d, true));
    });
    seek.addEventListener("change", function () { dragging = false; jump(seek.value); place(); });
    window.addEventListener("pointerup", function () { if (!dragging) return; dragging = false; jump(seek.value); place(); });
    window.addEventListener("pointercancel", function () { if (!dragging) return; dragging = false; jump(seek.value); place(); });
  }
  btn.addEventListener("keydown", function (e) {
    var d = dur();
    if (e.key === "ArrowRight") { try { a.currentTime = Math.min(d, (a.currentTime || 0) + 5); } catch (err) {} e.preventDefault(); }
    if (e.key === "ArrowLeft") { try { a.currentTime = Math.max(0, (a.currentTime || 0) - 5); } catch (err) {} e.preventDefault(); }
  });
  if ("mediaSession" in navigator && window.MediaMetadata) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "The Rowdyland Anthem",
        artist: "Rowdyland",
        artwork: [{ src: new URL("buckle.webp?v=1", document.baseURI).href, sizes: "440x369", type: "image/webp" }]
      });
      navigator.mediaSession.setActionHandler("play", function () { var p = a.play(); if (p && p.catch) p.catch(function () {}); });
      navigator.mediaSession.setActionHandler("pause", function () { a.pause(); });
      navigator.mediaSession.setActionHandler("seekbackward", function (d) { try { a.currentTime = Math.max(0, (a.currentTime || 0) - ((d && d.seekOffset) || 10)); } catch (e) {} });
      navigator.mediaSession.setActionHandler("seekforward", function (d) { try { a.currentTime = Math.min(dur(), (a.currentTime || 0) + ((d && d.seekOffset) || 10)); } catch (e) {} });
      navigator.mediaSession.setActionHandler("seekto", function (d) { if (d && typeof d.seekTime === "number") { try { a.currentTime = d.seekTime; } catch (e) {} } });
    } catch (e) {}
  }
  ui();
  place();
})();
