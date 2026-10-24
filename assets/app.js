(function () {
  "use strict";
  var root = document.documentElement;
  var storageKey = "mufasa-portfolio-theme-v2";
  var themeButton = document.getElementById("theme-toggle");
  var menuButton = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-nav");
  var progress = document.getElementById("reading-progress");
  var toast = document.getElementById("toast");
  var toastTimer;

  function saveTheme(theme) {
    try { localStorage.setItem(storageKey, theme); } catch (err) { /* Private mode may disable storage. */ }
  }
  function readTheme() {
    try { return localStorage.getItem(storageKey); } catch (err) { return null; }
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeButton.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    themeButton.setAttribute("title", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", theme === "dark" ? "#090d13" : "#f4f5f0");
  }
  var preferred = readTheme();
  if (preferred !== "light" && preferred !== "dark") {
    preferred = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  applyTheme(preferred);
  themeButton.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  });

  function setMenu(open) {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    menu.classList.toggle("open", open);
    if (open) { menu.removeAttribute("inert"); }
    else { menu.setAttribute("inert", ""); }
  }
  menuButton.addEventListener("click", function () {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenu(false); menuButton.focus();
    }
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 980) setMenu(false); });

  var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-category]"));
  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var category = button.getAttribute("data-filter");
      filters.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      cards.forEach(function (card) {
        card.hidden = category !== "all" && card.getAttribute("data-category") !== category;
      });
    });
  });

  function onScroll() {
    var room = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (room <= 0 ? 0 : Math.min(100, window.scrollY / room * 100)) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  var navLinks = document.querySelectorAll(".desktop-nav a");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    ["work", "expertise", "about", "contact"].forEach(function (id) {
      var node = document.getElementById(id);
      if (node) observer.observe(node);
    });
  }

  var copyButton = document.getElementById("copy-email");
  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 3200);
  }
  copyButton.addEventListener("click", function () {
    var email = copyButton.getAttribute("data-email");
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(function () { notify("Email copied to clipboard"); }).catch(function () { notify("Copy the email address shown above"); });
    } else {
      notify("Select the email address above to copy");
    }
  });
  document.getElementById("year").textContent = String(new Date().getFullYear());
}());