/* =========================================================
   SIMPLE UI STATE
========================================================= */

const UI = {
    menuOpen: false,
    lightboxOpen: false,
    currentIndex: 0,
};


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   ELEMENTS
========================================================= */

const lightbox = $("#lightbox");
const lightboxImg = $("#lightbox-image");

const nextBtn = $(".lightbox-next");
const prevBtn = $(".lightbox-prev");
const closeBtn = $(".lightbox-close");

const galleryImages = Array.from($$(".gallery-image"));

const scrollTopBtn = $("#scrollTopBtn");

const menuToggle = $("#menu-toggle");
const sideNav = $("#side-nav");
const closeMenuBtn = $("#close-menu");
const menuOverlay = $("#menu-overlay");


/* =========================================================
   REVEAL
========================================================= */

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    },
    { threshold: 0.05 }
);

$$(".reveal").forEach(el => revealObserver.observe(el));


/* =========================================================
   SCROLL LOCK
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
   LIGHTBOX
========================================================= */

function openLightbox(index) {

    if (!lightbox || !lightboxImg) return;

    const img = galleryImages[index];

    if (!img) return;


    UI.lightboxOpen = true;
    UI.currentIndex = index;


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
        lightboxImg.style.transform = "";
    }


    unlockPage();
}



function nextImage() {

    UI.currentIndex =
        (UI.currentIndex + 1) % galleryImages.length;

    openLightbox(UI.currentIndex);
}



function prevImage() {

    UI.currentIndex =
        (UI.currentIndex - 1 + galleryImages.length)
        % galleryImages.length;

    openLightbox(UI.currentIndex);
}



/* gallery open */

galleryImages.forEach((img, index) => {

    img.addEventListener("click", () => {
        openLightbox(index);
    });

});



/* buttons */

nextBtn?.addEventListener("click", e => {
    e.stopPropagation();
    nextImage();
});


prevBtn?.addEventListener("click", e => {
    e.stopPropagation();
    prevImage();
});


closeBtn?.addEventListener("click", e => {
    e.stopPropagation();
    closeLightbox();
});



/* click background */

lightbox?.addEventListener("click", e => {

    if (e.target === lightbox) {
        closeLightbox();
    }

});



/* =========================================================
   MOBILE SWIPE
========================================================= */

let startX = 0;
let deltaX = 0;
let dragging = false;


function resetSwipe() {

    if (!lightboxImg) return;

    lightboxImg.style.transform = "";
    lightboxImg.style.transition = "";

}



lightboxImg?.addEventListener(
    "pointerdown",
    e => {

        if (!UI.lightboxOpen) return;


        dragging = true;
        startX = e.clientX;
        deltaX = 0;


        e.preventDefault();

        lightboxImg.setPointerCapture(e.pointerId);

    }
);



lightboxImg?.addEventListener(
    "pointermove",
    e => {

        if (!dragging) return;


        e.preventDefault();


        deltaX = e.clientX - startX;


        lightboxImg.style.transform =
            `translateX(${deltaX * 0.35}px)`;

        lightboxImg.style.transition = "none";

    },
    { passive:false }
);



function finishSwipe() {

    if (!dragging) return;


    dragging = false;


    const threshold = 70;


    resetSwipe();


    if (Math.abs(deltaX) > threshold) {

        if (deltaX < 0) {
            nextImage();
        } else {
            prevImage();
        }

    }


    deltaX = 0;

}



lightboxImg?.addEventListener(
    "pointerup",
    finishSwipe
);


lightboxImg?.addEventListener(
    "pointercancel",
    finishSwipe
);


lightboxImg?.addEventListener(
    "pointerleave",
    finishSwipe
);



/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    e => {

        if (e.key === "Escape" && UI.lightboxOpen) {
            closeLightbox();
        }


        if (!UI.lightboxOpen) return;


        if (e.key === "ArrowRight") {
            prevImage();
        }


        if (e.key === "ArrowLeft") {
            nextImage();
        }

    }
);



/* =========================================================
   MENU
========================================================= */

function openMenu() {

    UI.menuOpen = true;

    sideNav?.classList.add("open");
    menuOverlay?.classList.add("show");

}



function closeMenu() {

    UI.menuOpen = false;

    sideNav?.classList.remove("open");
    menuOverlay?.classList.remove("show");

}



menuToggle?.addEventListener("click", openMenu);

closeMenuBtn?.addEventListener("click", closeMenu);

menuOverlay?.addEventListener("click", closeMenu);


$$(".side-nav .nav-link")
.forEach(link =>
    link.addEventListener("click", closeMenu)
);



/* =========================================================
   SCROLL TOP
========================================================= */

if (scrollTopBtn) {

    window.addEventListener("scroll", () => {

        scrollTopBtn.classList.toggle(
            "show",
            window.scrollY > 500
        );

    });


    scrollTopBtn.addEventListener(
        "click",
        () => {

            if (UI.lightboxOpen) {
                closeLightbox();
            }

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        }
    );

}



/* =========================================================
   ACTIVE NAV
========================================================= */

const sections = $$("section[id]");
const navLinks = $$(".nav-link");


function updateActive() {

    let current = "";


    sections.forEach(section => {

        if (window.scrollY >= section.offsetTop - 200) {
            current = section.id;
        }

    });


    navLinks.forEach(link => {

        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + current
        );

    });

}



window.addEventListener("scroll", updateActive);

window.addEventListener("load", updateActive);