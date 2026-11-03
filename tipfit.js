/* keep map hotspot tooltips inside the map */
(function () {
  function fit(z) {
    var t = z.querySelector(".zone-tip"), box = z.closest(".map-zoom") || document.body; if (!t) return;
    t.style.setProperty("--tip-dx", "0px");
    var r = t.getBoundingClientRect(), b = box.getBoundingClientRect(), pad = 6, dx = 0;
    var L = Math.max(b.left, 0) + pad, R = Math.min(b.right, innerWidth) - pad;
    if (r.left < L) dx = L - r.left; else if (r.right > R) dx = R - r.right;
    t.style.setProperty("--tip-dx", dx + "px");
  }
  document.querySelectorAll(".zone").forEach(function (z) {
    ["mouseenter", "focus", "touchstart"].forEach(function (ev) { z.addEventListener(ev, function () { fit(z); }, { passive: true }); });
  });
})();
