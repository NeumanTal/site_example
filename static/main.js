/* =========================================================
   SIMPLE UI STATE (SINGLE SOURCE OF TRUTH)
========================================================= */

const UI = {
    menuOpen: false,
    lightboxOpen: false,
    currentIndex: 0,
};

/* =========================================================
   SAFE DOM HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================================================
   ELEMENTS
========================================================= */

const lightbox = $("#lightbox");
const lightboxImg = $("#lightbox-image");
const scrollTopBtn = $("#scrollTopBtn");

const menuToggle = $("#menu-toggle");
const sideNav = $("#side-nav");
const closeMenuBtn = $("#close-menu");
const menuOverlay = $("#menu-overlay");

/* =========================================================
   GALLERY SETUP
========================================================= */

const galleryImages = Array.from($$(".gallery-image"));

/* =========================================================
   SCROLL REVEAL (UNCHANGED)
========================================================= */

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.05 });

document.querySelectorAll(".reveal").forEach(el => {
    revealObserver.observe(el);
});

/* =========================================================
   BODY SCROLL LOCK (CRITICAL FIX)
========================================================= */

function lockPage() {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
}

function unlockPage() {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
}

/* =========================================================
   LIGHTBOX CORE (SINGLE SOURCE OF TRUTH)
========================================================= */

function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;

    UI.currentIndex = index;
    UI.lightboxOpen = true;

    const img = galleryImages[index];
    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";

    lightbox.classList.add("show");

    lockPage();
}

function closeLightbox() {
    if (!lightbox) return;

    UI.lightboxOpen = false;

    lightbox.classList.remove("show");

    if (lightboxImg) {
        lightboxImg.src = "";
    }

    unlockPage();
}

/* Bind gallery clicks */
galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => {
        openLightbox(index);
    });
});

/* click outside closes */
if (lightbox) {
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

/* ESC key closes everything safely */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (UI.lightboxOpen) closeLightbox();
        if (UI.menuOpen) closeMenu();
    }
});

/* =========================================================
   LIGHTBOX NAV (SAFE WRAPPED)
========================================================= */

function showNext() {
    if (!galleryImages.length) return;

    UI.currentIndex = (UI.currentIndex + 1) % galleryImages.length;
    openLightbox(UI.currentIndex);
}

function showPrev() {
    if (!galleryImages.length) return;

    UI.currentIndex =
        (UI.currentIndex - 1 + galleryImages.length) % galleryImages.length;

    openLightbox(UI.currentIndex);
}

/* Optional button hooks */
const nextBtn = $("#lightbox-next");
const prevBtn = $("#lightbox-prev");

if (nextBtn) nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
});

if (prevBtn) prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
});

/* =========================================================
   MENU SYSTEM
========================================================= */

function openMenu() {
    if (!sideNav || !menuOverlay) return;

    UI.menuOpen = true;

    sideNav.classList.add("open");
    menuOverlay.classList.add("show");

    document.body.style.overflow = "hidden";
}

function closeMenu() {
    if (!sideNav || !menuOverlay) return;

    UI.menuOpen = false;

    sideNav.classList.remove("open");
    menuOverlay.classList.remove("show");

    document.body.style.overflow = "";
}

if (menuToggle) menuToggle.addEventListener("click", openMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

$$(".side-nav .nav-link").forEach(link => {
    link.addEventListener("click", closeMenu);
});

/* =========================================================
   SCROLL TOP BUTTON (FIXED INTEGRATION)
========================================================= */

if (scrollTopBtn) {

    window.addEventListener("scroll", () => {
        scrollTopBtn.classList.toggle("show", window.scrollY > 500);
    });

    scrollTopBtn.addEventListener("click", () => {

        // ALWAYS close lightbox safely first
        if (UI.lightboxOpen) {
            closeLightbox();
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* =========================================================
   ACTIVE SECTION TRACKING
========================================================= */

const sections = $$("section[id]");
const navLinks = $$(".nav-link");

function updateActiveSection() {
    let current = "";

    sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (window.scrollY >= top) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        const href = link.getAttribute("href");
        if (href === "#" + current) {
            link.classList.add("active");
        }
    });
}

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