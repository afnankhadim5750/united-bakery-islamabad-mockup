// United Bakery — mobile menu (instant toggle, no transitions), lightbox,
// horizontal pastry scroller, active nav highlighting.
(function () {
  "use strict";

  // ---- Mobile menu: toggles instantly via the hidden attribute ----
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.hasAttribute("hidden");
      if (open) {
        menu.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");
      } else {
        menu.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // ---- Lightbox ----
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  if (lightbox && lightboxImg) {
    document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lightboxImg.src = btn.getAttribute("data-lightbox");
        lightboxImg.alt = btn.getAttribute("data-alt") || "";
        lightbox.removeAttribute("hidden");
        document.body.style.overflow = "hidden";
      });
    });
    var close = function () {
      lightbox.setAttribute("hidden", "");
      lightboxImg.src = "";
      document.body.style.overflow = "";
    };
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.hasAttribute("data-lightbox-close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hasAttribute("hidden")) close();
    });
  }

  // ---- Pastry scroller arrows ----
  var row = document.querySelector("[data-scroll-row]");
  var prev = document.querySelector("[data-scroll-prev]");
  var next = document.querySelector("[data-scroll-next]");
  if (row && prev && next) {
    var step = function () { return Math.min(360, row.clientWidth * 0.8); };
    prev.addEventListener("click", function () { row.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { row.scrollBy({ left: step(), behavior: "smooth" }); });
  }

  // ---- Active nav link while scrolling ----
  var links = Array.prototype.slice.call(document.querySelectorAll(".desktop-nav a"));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
  var sections = Object.keys(map)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("active"); });
          var link = map[entry.target.id];
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
  }
})();
