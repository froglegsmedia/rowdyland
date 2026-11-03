(function () {
  var btn = document.getElementById("horse-btn");
  var track = btn && btn.closest(".track");
  var dlg = document.getElementById("map-dialog");
  if (!btn || !dlg) return;
  var closeBtn = dlg.querySelector(".map-close");
  var sheet = dlg.querySelector(".map-sheet");
  var busy = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var lastFocus = null;

  var vista = document.getElementById("vista"), vEnter = document.getElementById("vista-enter");
  function showVista() {
    if (!vista) { openMap(); return; }
    lastFocus = document.activeElement;
    vista.hidden = false; document.body.classList.add("map-open");
    requestAnimationFrame(function () { vista.classList.add("in"); });
    vEnter.focus();
  }
  if (vEnter) vEnter.addEventListener("click", function () {
    var f = lastFocus; vista.classList.remove("in"); vista.hidden = true; openMap(); lastFocus = f;
  });
  if (vista) document.addEventListener("keydown", function (e) {
    if (vista.hidden || e.key !== "Escape" || !document.getElementById("reserve").hidden) return;
    vista.hidden = true; vista.classList.remove("in"); closeMap.call(null, true);
  });

  function openMap() {
    lastFocus = document.activeElement;
    dlg.hidden = false;
    document.body.classList.add("map-open");
    closeBtn.focus();
  }

  function closeMap(force) {
    if (dlg.hidden && force !== true) return;
    dlg.hidden = true;
    document.body.classList.remove("map-open");
    track.classList.remove("is-gone");
    track.parentNode.style.height = "";
    if (!reduce.matches) {
      track.classList.add("is-returning");
      setTimeout(function () { track.classList.remove("is-returning"); }, 950);
    }
    busy = false;
    (lastFocus && lastFocus.focus ? lastFocus : btn).focus();
  }

  function puff(x, y) {
    var d = document.createElement("span");
    d.className = "dust";
    d.style.left = x - 13 + "px";
    d.style.top = y - 13 + "px";
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 950);
  }

  function run() {
    if (busy) return;
    busy = true;
    if (song && !song.paused) song.pause();
    if (reduce.matches) { showVista(); return; }
    track.classList.add("is-rearing");
    setTimeout(function () {
      track.classList.remove("is-rearing");
      var pad = track.parentNode;
      pad.style.height = pad.getBoundingClientRect().height + "px";
      var r = btn.getBoundingClientRect();
      btn.style.top = r.top + "px";
      btn.style.setProperty("--start-x", r.left + "px");
      btn.classList.add("is-running");
      track.classList.add("is-galloping");
      var shown = false;
      var timer = setInterval(function () {
        var b = btn.getBoundingClientRect();
        puff(b.left + b.width * 0.25, b.bottom - 8);
        if (!shown && b.left > window.innerWidth * 0.92) { shown = true; showVista(); }
      }, 90);
      setTimeout(function () {
        clearInterval(timer);
        btn.classList.remove("is-running");
        btn.style.top = "";
        track.classList.remove("is-galloping");
        track.classList.add("is-gone");
        if (!shown) showVista();
      }, 1600);
    }, 750);
  }

  var song = document.getElementById("horse-song");
  var noteTimer = null;
  function note() {
    var n = document.createElement("span");
    n.className = "note";
    n.setAttribute("aria-hidden", "true");
    n.textContent = Math.random() < 0.5 ? "\u266A" : "\u266B";
    n.style.left = 30 + Math.random() * 40 + "%";
    n.style.top = 10 + Math.random() * 20 + "%";
    n.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
    track.appendChild(n);
    setTimeout(function () { n.remove(); }, 1900);
  }
  function setSinging(on) {
    track.classList.toggle("is-singing", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    clearInterval(noteTimer);
    noteTimer = null;
    if (on && !reduce.matches) { note(); noteTimer = setInterval(note, 450); }
  }
  var START = 94.4; /* "Yeah, we didn't like that" */
  var fresh = true;
  if (song) {
    song.addEventListener("loadedmetadata", function () { if (fresh && song.paused) song.currentTime = START; });
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (busy) return;
      if (song.paused) { if (fresh) { try { song.currentTime = START; } catch (err) {} fresh = false; } song.volume = 0; var fv = 0, fi = setInterval(function () { fv = Math.min(1, fv + 0.08); song.volume = fv; if (fv >= 1) clearInterval(fi); }, 50); var p = song.play(); if (p && p.catch) p.catch(function () { setSinging(false); }); }
      else song.pause();
    });
    song.addEventListener("play", function () { setSinging(true); });
    song.addEventListener("pause", function () { setSinging(false); });
    song.addEventListener("ended", function () { setSinging(false); fresh = true; });
  }

  document.querySelectorAll('a[href="#map"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      track.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "center" });
      setTimeout(run, reduce.matches ? 0 : 450);
    });
  });
  closeBtn.addEventListener("click", closeMap);
  dlg.addEventListener("click", function (e) { if (!sheet.contains(e.target)) closeMap(); });
  document.addEventListener("keydown", function (e) {
    if (dlg.hidden) return;
    if (e.key === "Escape") { closeMap(); return; }
    if (e.key === "Tab") {
      var f = sheet.querySelectorAll("a[href], button");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();

/* interactive map zones */
(function () {
  var zoom = document.querySelector(".map-zoom");
  if (!zoom) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  zoom.querySelectorAll("button.zone").forEach(function (z) {
    z.addEventListener("click", function () {
      zoom.querySelectorAll(".show-tip").forEach(function (o) { if (o !== z) o.classList.remove("show-tip"); });
      z.classList.toggle("show-tip");
    });
  });
  zoom.querySelectorAll("a.zone-live").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (reduce || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      var cx = parseFloat(a.style.left) + parseFloat(a.style.width) / 2;
      var cy = parseFloat(a.style.top) + parseFloat(a.style.height) / 2;
      zoom.style.transformOrigin = cx + "% " + cy + "%";
      zoom.classList.add("is-zooming");
      zoom.style.transform = "scale(5)";
      zoom.style.filter = "brightness(0.35) saturate(1.4)";
      setTimeout(function () { location.href = a.href; }, 950);
    });
  });
  if (location.hash === "#map-open") {
    var btn = document.getElementById("horse-btn");
    var dlg = document.getElementById("map-dialog");
    if (btn && dlg) { dlg.hidden = false; document.body.classList.add("map-open"); history.replaceState(null, "", location.pathname); }
  }
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) { zoom.style.transform = ""; zoom.style.filter = ""; zoom.classList.remove("is-zooming"); }
  });
})();

/* Chuckwagon Row popup + email signup (Kit form 9130714) */
(function () {
  var pop = document.getElementById("chuck"); if (!pop) return;
  var last = null;
  function open(e) { e.preventDefault(); e.stopPropagation(); last = document.activeElement; if (last && last.classList) last.classList.remove("show-tip"); pop.hidden = false; pop.querySelector("input[type=email]").focus(); }
  function close() { if (pop.hidden) return; pop.hidden = true; if (last && last.focus) last.focus(); }
  document.querySelectorAll("[data-chuck]").forEach(function (b) { b.addEventListener("click", open); });
  pop.addEventListener("click", function (e) { if (e.target === pop || e.target.closest(".sheet-close")) close(); });
  document.addEventListener("keydown", function (e) {
    if (pop.hidden) return;
    e.stopImmediatePropagation();
    if (e.key === "Escape") { close(); return; }
    if (e.key === "Tab") {
      var f = pop.querySelectorAll("input, button"), first = f[0], lastF = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastF.focus(); }
      else if (!e.shiftKey && document.activeElement === lastF) { e.preventDefault(); first.focus(); }
    }
  }, true);
  pop.querySelectorAll(".signup").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      if (!window.fetch || !window.FormData) return;
      e.preventDefault();
      var btn = f.querySelector("button"), msg = f.querySelector(".signup-msg");
      btn.disabled = true; msg.textContent = "";
      fetch(f.action, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.status === "success") { f.classList.add("done"); msg.textContent = "Thanks! We'll be in touch."; }
          else if (d.status === "quarantined" && d.url) { window.open(d.url, "_blank", "noopener"); msg.textContent = "One quick check in the new tab and you're all set!"; btn.disabled = false; }
          else { msg.textContent = "Hmm, double check that email and try again."; btn.disabled = false; }
        })
        .catch(function () { f.submit(); });
    });
  });
})();

/* map pinch / wheel zoom + drag pan */
(function () {
  var box = document.querySelector(".map-zoom"), pan = box && box.querySelector(".map-pan");
  if (!pan) return;
  var s = 1, x = 0, y = 0, MAX = 3, moved = false;
  function clamp() {
    s = Math.min(MAX, Math.max(1, s));
    var w = box.clientWidth, h = box.clientHeight;
    x = Math.min(0, Math.max(w - w * s, x)); y = Math.min(0, Math.max(h - h * s, y));
    if (s === 1) { x = 0; y = 0; }
    pan.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
    box.classList.toggle("is-zoomed", s > 1);
  }
  function zoomAt(ns, cx, cy) { /* cx,cy relative to box */
    ns = Math.min(MAX, Math.max(1, ns));
    x = cx - (cx - x) * ns / s; y = cy - (cy - y) * ns / s; s = ns; clamp();
  }
  function rel(px, py) { var r = box.getBoundingClientRect(); return [px - r.left, py - r.top]; }
  box.querySelector(".map-ctl").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    e.stopPropagation();
    var cx = box.clientWidth / 2, cy = box.clientHeight / 2, z = b.getAttribute("data-z");
    if (z === "reset") { s = 1; clamp(); } else zoomAt(s * (z === "in" ? 1.5 : 1 / 1.5), cx, cy);
  });
  box.addEventListener("wheel", function (e) {
    if (!e.ctrlKey && s === 1 && e.deltaY > 0) return;
    e.preventDefault();
    var p = rel(e.clientX, e.clientY);
    zoomAt(s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0025)), p[0], p[1]);
  }, { passive: false });
  /* mouse drag */
  var md = null;
  pan.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    md = { sx: e.clientX, sy: e.clientY, x: x, y: y }; moved = false;
  });
  window.addEventListener("pointermove", function (e) {
    if (!md) return;
    var dx = e.clientX - md.sx, dy = e.clientY - md.sy;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 6) { moved = true; box.classList.add("is-dragging"); }
    if (moved && s > 1) { x = md.x + dx; y = md.y + dy; clamp(); }
  });
  window.addEventListener("pointerup", function () { md = null; box.classList.remove("is-dragging"); });
  /* touch: pinch + one-finger pan when zoomed */
  var t = null;
  function mid(a, b) { return rel((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2); }
  function dist(a, b) { return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); }
  pan.addEventListener("touchstart", function (e) {
    var a = e.touches[0];
    if (e.touches.length === 1) { moved = false; t = { one: true, sx: a.clientX, sy: a.clientY, x: x, y: y }; }
    else if (e.touches.length === 2) { moved = true; var m = mid(a, e.touches[1]); t = { d: dist(a, e.touches[1]), s: s, m: m, x: x, y: y }; }
  }, { passive: true });
  pan.addEventListener("touchmove", function (e) {
    if (!t) return;
    if (e.touches.length === 2 && !t.one) {
      e.preventDefault();
      var a = e.touches[0], b = e.touches[1], m = mid(a, b), ns = Math.min(MAX, Math.max(1, t.s * dist(a, b) / t.d));
      x = m[0] - (t.m[0] - t.x) * ns / t.s; y = m[1] - (t.m[1] - t.y) * ns / t.s; s = ns; clamp();
    } else if (e.touches.length === 2) {
      var a2 = e.touches[0]; t = { d: dist(a2, e.touches[1]), s: s, m: mid(a2, e.touches[1]), x: x, y: y }; moved = true; e.preventDefault();
    } else if (t.one) {
      var dx = e.touches[0].clientX - t.sx, dy = e.touches[0].clientY - t.sy;
      if (Math.abs(dx) + Math.abs(dy) > 8) moved = true;
      if (s > 1) { e.preventDefault(); if (moved) { box.classList.add("is-dragging"); x = t.x + dx; y = t.y + dy; clamp(); } }
    }
  }, { passive: false });
  pan.addEventListener("touchend", function (e) { if (!e.touches.length) { t = null; box.classList.remove("is-dragging"); } });
  /* a drag is not a tap */
  box.addEventListener("click", function (e) {
    if (moved && e.target.closest(".zone")) { e.preventDefault(); e.stopImmediatePropagation(); }
    moved = false;
  }, true);
  pan.addEventListener("dragstart", function (e) { e.preventDefault(); });
  window.addEventListener("resize", clamp);
})();

/* mobile: map buttons sit below the map, centered */
(function () {
  var fig = document.querySelector(".map-sheet figure"), frame = fig && fig.querySelector(".map-frame");
  var ctl = document.querySelector(".map-ctl"), btns = document.querySelector(".head-btns");
  if (!frame || !ctl || !btns) return;
  var zoom = ctl.parentNode, head = btns.parentNode, close = head.querySelector(".map-close");
  var row = document.createElement("div"); row.className = "map-btn-row";
  var mq = window.matchMedia("(max-width: 760px)");
  function place() {
    if (mq.matches) { row.appendChild(ctl); row.appendChild(btns); frame.after(row); }
    else { zoom.appendChild(ctl); head.insertBefore(btns, close); if (row.parentNode) row.remove(); }
  }
  place(); mq.addEventListener ? mq.addEventListener("change", place) : mq.addListener(place);
})();

/* ticket reserve popup */
(function () {
  var pop = document.getElementById("reserve"); if (!pop) return;
  var last = null;
  function close() { if (pop.hidden) return; pop.hidden = true; if (last && last.focus) last.focus(); }
  document.querySelectorAll("[data-reserve]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); last = document.activeElement; pop.hidden = false; pop.querySelector("input[type=email]").focus(); }); });
  pop.addEventListener("click", function (e) { if (e.target === pop || e.target.closest(".sheet-close")) close(); });
  document.addEventListener("keydown", function (e) { if (!pop.hidden && e.key === "Escape") { e.stopImmediatePropagation(); close(); } }, true);
  pop.querySelector(".signup").addEventListener("submit", function (e) {
    if (!window.fetch || !window.FormData) return; e.preventDefault();
    var f = e.target, msg = f.querySelector(".signup-msg");
    fetch(f.action, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } }).then(function () { msg.textContent = "You're on the list!"; f.reset(); }).catch(function () { f.submit(); });
  });
})();
