/* =========================================================
   SIMPLE UI STATE
========================================================= */

const UI = {
    menuOpen: false,
    lightboxOpen: false
};

/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================================================
   REVEAL ON SCROLL
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

$$(".reveal").forEach((el) => revealObserver.observe(el));

/* =========================================================
   GALLERY LIGHTBOX
========================================================= */

const lightbox = $("#lightbox");
const lightboxImg = $("#lightbox-img");

const images = [...$$(".zoomable")];

let currentImage = 0;

function showImage(index) {

    currentImage = index;

    lightboxImg.src = images[currentImage].src;
    lightboxImg.alt = images[currentImage].alt;

}

function openLightbox(index) {

    showImage(index);

    lightbox.classList.add("show");

    UI.lightboxOpen = true;

}

function closeLightbox() {

    lightbox.classList.remove("show");

    UI.lightboxOpen = false;

}

function nextImage() {

    currentImage++;

    if (currentImage >= images.length)
        currentImage = 0;

    showImage(currentImage);

}

function previousImage() {

    currentImage--;

    if (currentImage < 0)
        currentImage = images.length - 1;

    showImage(currentImage);

}

images.forEach((img, index) => {

    img.addEventListener("click", () => {

        openLightbox(index);

    });

});

$(".lightbox-next").addEventListener("click", (e) => {

    e.stopPropagation();

    nextImage();

});

$(".lightbox-prev").addEventListener("click", (e) => {

    e.stopPropagation();

    previousImage();

});

$(".lightbox-close").addEventListener("click", (e) => {

    e.stopPropagation();

    closeLightbox();

});

lightbox.addEventListener("click", closeLightbox);

/* =========================================================
   SIDE MENU
========================================================= */

const menuToggle = $("#menu-toggle");
const sideNav = $("#side-nav");
const closeMenuBtn = $("#close-menu");
const menuOverlay = $("#menu-overlay");

function openMenu() {

    sideNav.classList.add("open");

    menuOverlay.classList.add("show");

    document.body.style.overflow = "hidden";

    UI.menuOpen = true;

}

function closeMenu() {

    sideNav.classList.remove("open");

    menuOverlay.classList.remove("show");

    document.body.style.overflow = "";

    UI.menuOpen = false;

}

menuToggle?.addEventListener("click", openMenu);

closeMenuBtn?.addEventListener("click", closeMenu);

menuOverlay?.addEventListener("click", closeMenu);

$$(".side-nav .nav-link").forEach((link) => {

    link.addEventListener("click", closeMenu);

});

/* =========================================================
   ESC + ARROW KEYS
========================================================= */

document.addEventListener("keydown", (e) => {

    if (UI.lightboxOpen) {

        if (e.key === "Escape") {

            closeLightbox();

        }

        if (e.key === "ArrowRight") {

            nextImage();

        }

        if (e.key === "ArrowLeft") {

            previousImage();

        }

    }

    if (UI.menuOpen && e.key === "Escape") {

        closeMenu();

    }

});

/* =========================================================
   ACTIVE SECTION
========================================================= */

const sections = $$("section[id]");
const navLinks = $$(".nav-link");

function updateActiveSection() {

    let current = "";

    sections.forEach((section) => {

        const top = section.offsetTop - 200;

        if (window.scrollY >= top)
            current = section.id;

    });

    navLinks.forEach((link) => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current)
            link.classList.add("active");

    });

}

let ticking = false;

window.addEventListener("scroll", () => {

    if (!ticking) {

        requestAnimationFrame(() => {

            updateActiveSection();

            ticking = false;

        });

        ticking = true;

    }

});

window.addEventListener("load", updateActiveSection);

/* =========================================================
   SCROLL TO TOP
========================================================= */

const scrollTopBtn = $("#scrollTopBtn");

if (scrollTopBtn) {

    window.addEventListener("scroll", () => {

        scrollTopBtn.classList.toggle("show", window.scrollY > 500);

    });

    scrollTopBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}