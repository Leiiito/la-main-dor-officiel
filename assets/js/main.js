/* =========================================================
   La Main d'Or — One-page premium
   Fichier : /assets/js/main.js
   - Menu mobile accessible
   - Tabs catégories prestations (30+ friendly)
   - Lightbox galerie (simple, performant)
   - Reveal au scroll (léger)
   ========================================================= */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------------------------------------
     1) Menu mobile
  ---------------------------------------------- */
  const toggleBtn = $("[data-nav-toggle]");
  const linksWrap = $("[data-nav-links]");

  if (toggleBtn && linksWrap) {
    const openMenu = () => {
      linksWrap.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.setAttribute("aria-label", "Fermer le menu");
    };

    const closeMenu = () => {
      linksWrap.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", "Ouvrir le menu");
    };

    toggleBtn.addEventListener("click", () => {
      linksWrap.classList.contains("is-open") ? closeMenu() : openMenu();
    });

    // Ferme le menu au clic sur un lien (mobile)
    $$(".nav__link, .nav__cta", linksWrap).forEach((a) => {
      a.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 859px)").matches) closeMenu();
      });
    });

    // Ferme au clic dehors (mobile)
    document.addEventListener("click", (e) => {
      if (!window.matchMedia("(max-width: 859px)").matches) return;
      const t = e.target;
      const inside = linksWrap.contains(t) || toggleBtn.contains(t);
      if (!inside) closeMenu();
    });

    // ESC pour fermer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && linksWrap.classList.contains("is-open")) closeMenu();
    });

    // Cleanup lors du passage desktop
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 860px)").matches) {
        linksWrap.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "Ouvrir le menu");
      }
    });
  }

  /* ---------------------------------------------
     2) Tabs prestations
     - Boutons : .tab[data-tab="..."]
     - Cards : .service[data-cat="..."]
  ---------------------------------------------- */
  const tabs = $$(".tab");
  const servicesWrap = $("[data-services]");
  const services = servicesWrap ? $$(".service", servicesWrap) : [];

  const setActiveTab = (btn) => {
    tabs.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
  };

  const applyTab = (tabValue) => {
    if (!services.length) return;
    const showAll = tabValue === "Tout";

    services.forEach((card) => {
      const cat = card.getAttribute("data-cat");
      const show = showAll || cat === tabValue;
      card.classList.toggle("is-hidden", !show);
    });
  };

  if (tabs.length && services.length) {
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-tab") || "Tout";
        setActiveTab(btn);
        applyTab(value);
      });
    });
  }

  /* ---------------------------------------------
     3) Lightbox galerie
  ---------------------------------------------- */
  const gallery = $("[data-gallery]");
  const lightbox = $("[data-lightbox]");
  const lightboxImg = lightbox ? $(".lightbox__img", lightbox) : null;
  const lightboxClose = $("[data-lightbox-close]");

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  if (gallery && lightbox) {
    $$(".gallery__item img", gallery).forEach((img) => {
      img.addEventListener("click", () => openLightbox(img.currentSrc || img.src, img.alt));
    });

    lightbox.addEventListener("click", (e) => {
      // Clique sur fond = ferme
      if (e.target === lightbox) closeLightbox();
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

  /* ---------------------------------------------
     4) Reveal au scroll
  ---------------------------------------------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = [];

  // Auto-tag éléments importants
  $$("section.section, section.hero, .card, .gallery__item").forEach((el) => el.setAttribute("data-reveal", ""));
  $$("[data-reveal]").forEach((el) => revealTargets.push(el));

  if (!prefersReduced && revealTargets.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------
     5) Mini tracking console (optionnel)
     (remplaçable par GA4 plus tard)
  ---------------------------------------------- */
  const track = (selector, label) => {
    $$(selector).forEach((el) => {
      el.addEventListener("click", () => {
        // eslint-disable-next-line no-console
        console.log(`[CTA] ${label}`, {
          href: el.getAttribute("href"),
          service: el.getAttribute("data-service") || null,
        });
      });
    });
  };

  track("[data-cta]", "Réserver (global)");
  track("[data-service]", "Réserver (prestation)");
})();
