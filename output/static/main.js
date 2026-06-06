/* =========================================================
   SIMPLE UI STATE
========================================================= */

const UI = {
  menuOpen: false,
  lightboxOpen: false,
};

/* =========================================================
   SAFE DOM HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================================================
   REVEAL ON SCROLL (UNCHANGED BUT SAFER)
========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, {
  threshold: 0.05
});

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

/* =========================================================
   LIGHTBOX CONTROLLER
========================================================= */

const lightbox = $("#lightbox");
const lightboxImg = $("#lightbox-img");

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;

  lightboxImg.src = src;
  lightbox.classList.add("show");
  UI.lightboxOpen = true;
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;

  lightbox.classList.remove("show");
  lightboxImg.src = "";
  UI.lightboxOpen = false;
}

/* Bind images */
$$(".zoomable").forEach((img) => {
  img.addEventListener("click", () => {
    openLightbox(img.src);
  });
});

/* click outside closes */
if (lightbox) {
  lightbox.addEventListener("click", closeLightbox);
}

/* =========================================================
   SIDE MENU CONTROLLER
========================================================= */

const menuToggle = $("#menu-toggle");
const sideNav = $("#side-nav");
const closeMenuBtn = $("#close-menu");
const menuOverlay = $("#menu-overlay");

function openMenu() {
  if (!sideNav || !menuOverlay) return;

  sideNav.classList.add("open");
  menuOverlay.classList.add("show");
  document.body.style.overflow = "hidden";

  UI.menuOpen = true;
}

function closeMenu() {
  if (!sideNav || !menuOverlay) return;

  sideNav.classList.remove("open");
  menuOverlay.classList.remove("show");
  document.body.style.overflow = "";

  UI.menuOpen = false;
}

if (menuToggle) menuToggle.addEventListener("click", openMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

/* Close menu on ANY nav click */
$$(".side-nav .nav-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* =========================================================
   ESC KEY HANDLER (SINGLE SOURCE OF TRUTH)
========================================================= */

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  if (UI.menuOpen) closeMenu();
  if (UI.lightboxOpen) closeLightbox();
});

/* =========================================================
   ACTIVE SECTION TRACKING (OPTIMIZED)
========================================================= */

const sections = $$("section[id]");
const navLinks = $$(".nav-link");

function updateActiveSection() {
  let current = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 200;
    if (window.scrollY >= top) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href");
    if (href === "#" + current) {
      link.classList.add("active");
    }
  });
}

/* throttle via rAF */
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveSection();
      ticking = false;
    });
    ticking = true;
  }
});

window.addEventListener("load", updateActiveSection);

/* =========================================================
   SCROLL TO TOP BUTTON
========================================================= */

const scrollTopBtn = $("#scrollTopBtn");

if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}