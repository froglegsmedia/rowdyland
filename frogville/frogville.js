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
