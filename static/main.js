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

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

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

const nextBtn = $("#lightbox-next");
const prevBtn = $("#lightbox-prev");
const closeBtn = $("#lightbox-close");

/* =========================================================
   GALLERY
========================================================= */

const galleryImages = Array.from($$(".gallery-image"));

/* =========================================================
   REVEAL
========================================================= */

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("active");
    });
}, { threshold: 0.05 });

document.querySelectorAll(".reveal").forEach(el => {
    revealObserver.observe(el);
});

/* =========================================================
   SCROLL LOCK (SAFE)
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
   LIGHTBOX CORE
========================================================= */

function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;

    UI.lightboxOpen = true;
    UI.currentIndex = index;

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

/* =========================================================
   NAVIGATION
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

/* =========================================================
   BIND GALLERY CLICK
========================================================= */

galleryImages.forEach((img, i) => {
    img.addEventListener("click", () => openLightbox(i));
});

/* =========================================================
   LIGHTBOX CLICK OUTSIDE
========================================================= */

lightbox?.addEventListener("pointerdown", (e) => {
    if (e.target === lightbox) closeLightbox();
});

/* =========================================================
   BUTTONS (FIXED POINTER EVENTS)
========================================================= */

nextBtn?.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    showNext();
});

prevBtn?.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    showPrev();
});

closeBtn?.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    closeLightbox();
});

/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (UI.lightboxOpen) closeLightbox();
        if (UI.menuOpen) closeMenu();
    }

    if (!UI.lightboxOpen) return;

    if (e.key === "ArrowRight") showPrev();
    if (e.key === "ArrowLeft") showNext();
});

/* =========================================================
   INSTAGRAM DRAG (SAFE POINTER VERSION)
========================================================= */

let startX = 0;
let dragDelta = 0;
let dragging = false;

function setDrag(px) {
    if (!lightboxImg) return;
    lightboxImg.style.transform = `translateX(${px}px)`;
    lightboxImg.style.transition = "none";
}

function resetDrag() {
    if (!lightboxImg) return;
    lightboxImg.style.transform = "";
    lightboxImg.style.transition = "";
}

lightboxImg?.addEventListener("pointerdown", (e) => {
    if (!UI.lightboxOpen) return;

    dragging = true;
    startX = e.clientX;

    lightboxImg.setPointerCapture(e.pointerId);
});

lightboxImg?.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    dragDelta = e.clientX - startX;

    setDrag(dragDelta * 0.35);
});

lightboxImg?.addEventListener("pointerup", () => {
    if (!dragging) return;

    dragging = false;

    const threshold = 70;

    resetDrag();

    if (Math.abs(dragDelta) > threshold) {
        dragDelta < 0 ? showNext() : showPrev();
    }

    dragDelta = 0;
});

lightboxImg?.addEventListener("pointercancel", () => {
    dragging = false;
    resetDrag();
});

/* =========================================================
   MENU
========================================================= */

function openMenu() {
    UI.menuOpen = true;
    sideNav?.classList.add("open");
    menuOverlay?.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeMenu() {
    UI.menuOpen = false;
    sideNav?.classList.remove("open");
    menuOverlay?.classList.remove("show");
    document.body.style.overflow = "";
}

menuToggle?.addEventListener("click", openMenu);
closeMenuBtn?.addEventListener("click", closeMenu);
menuOverlay?.addEventListener("click", closeMenu);

$$(".side-nav .nav-link").forEach(l => l.addEventListener("click", closeMenu));

/* =========================================================
   SCROLL TOP
========================================================= */

if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
        scrollTopBtn.classList.toggle("show", window.scrollY > 500);
    });

    scrollTopBtn.addEventListener("click", () => {
        if (UI.lightboxOpen) closeLightbox();

        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* =========================================================
   ACTIVE SECTION
========================================================= */

const sections = $$("section[id]");
const navLinks = $$(".nav-link");

function updateActive() {
    let current = "";

    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) {
            current = s.id;
        }
    });

    navLinks.forEach(l => {
        l.classList.toggle(
            "active",
            l.getAttribute("href") === "#" + current
        );
    });
}

let ticking = false;

window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActive();
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener("load", updateActive);