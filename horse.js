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

  function openMap() {
    lastFocus = document.activeElement;
    dlg.hidden = false;
    document.body.classList.add("map-open");
    closeBtn.focus();
  }

  function closeMap() {
    if (dlg.hidden) return;
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
    if (reduce.matches) { openMap(); return; }
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
        if (!shown && b.left > window.innerWidth * 0.92) { shown = true; openMap(); }
      }, 90);
      setTimeout(function () {
        clearInterval(timer);
        btn.classList.remove("is-running");
        btn.style.top = "";
        track.classList.remove("is-galloping");
        track.classList.add("is-gone");
        if (!shown) openMap();
      }, 1600);
    }, 750);
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
