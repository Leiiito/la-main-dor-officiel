/* =========================================================
   La Main d'Or — One-page premium
   Fichier : /assets/js/main.js
   - Menu mobile accessible
   - Tabs catégories prestations
   - Lightbox galerie (simple)
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

    // Fermer au clic sur un lien (mobile)
    $$(".nav__link, .nav__cta", linksWrap).forEach((a) => {
      a.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 859px)").matches) closeMenu();
      });
    });

    // Fermer au clic dehors (mobile)
    document.addEventListener("click", (e) => {
      if (!window.matchMedia("(max-width: 859px)").matches) return;
      const target = e.target;
      const clickedInside = linksWrap.contains(target) || toggleBtn.contains(target);
      if (!clickedInside) closeMenu();
    });

    // ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && linksWrap.classList.contains("is-open")) closeMenu();
    });

    // Resize vers desktop
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 860px)").matches) {
        linksWrap.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "Ouvrir le menu");
      }
    });
  }

  /* ---------------------------------------------
     2) Tabs Prestations
     - Boutons : .filter[data-tab="id"]
     - Panels  : .services-panel#id
  ---------------------------------------------- */
  const tabButtons = $$(".filter[data-tab]");
  const panels = $$(".services-panel");

  const activateTab = (id) => {
    tabButtons.forEach((btn) => {
      const active = btn.getAttribute("data-tab") === id;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach((p) => {
      const active = p.id === id;
      p.classList.toggle("is-active", active);
    });
  };

  if (tabButtons.length && panels.length) {
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-tab");
        if (!id) return;
        activateTab(id);
        // Sur mobile, recentre le tab actif dans le scroll horizontal
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });
  }

  /* ---------------------------------------------
     3) Lightbox Galerie
     - Clique sur une image => ouvre
     - ESC / clic fond / bouton => ferme
  ---------------------------------------------- */
  const gallery = $("[data-gallery]");
  const lightbox = $("[data-lightbox]");
  const lightboxImg = $("[data-lightbox-img]");
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
    // Nettoyage pour éviter clignotement au prochain open
    lightboxImg.removeAttribute("src");
    lightboxImg.alt = "";
    document.body.style.overflow = "";
  };

  if (gallery && lightbox && lightboxImg) {
    $$(".gallery__item img", gallery).forEach((img) => {
      img.addEventListener("click", () => openLightbox(img.currentSrc || img.src, img.alt));
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter") openLightbox(img.currentSrc || img.src, img.alt);
      });
      // rendre focusable pour accessibilité clavier
      img.setAttribute("tabindex", "0");
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

    // clic sur fond pour fermer
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

  /* ---------------------------------------------
     4) Mini tracking (console)
     Remplacez par GA4 si besoin
  ---------------------------------------------- */
  const track = (selector, label) => {
    $$(selector).forEach((el) => {
      el.addEventListener("click", () => {
        // eslint-disable-next-line no-console
        console.log(`[CTA] ${label}`, {
          href: el.getAttribute("href"),
          service: el.getAttribute("data-service") || null
        });
      });
    });
  };

  track('[data-cta^="reserve"]', "Réserver");
  track("[data-service]", "Réserver (prestation)");
})();

/* ---------------------------------------------------------
   Recherche prestations (filtre texte)
--------------------------------------------------------- */
(function(){
  const input = document.getElementById("prestationSearch");
  if (!input) return;

  const normalize = (s) => (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const match = () => {
    const q = normalize(input.value.trim());
    const cards = document.querySelectorAll("section.services-panel article.card.service");
    cards.forEach((card) => {
      const txt = normalize(card.innerText);
      card.style.display = (!q || txt.includes(q)) ? "" : "none";
    });
  };

  input.addEventListener("input", match);

  // Quand on change d’onglet, on garde la recherche active (mais on recalcule au cas où)
  document.querySelectorAll('.filter[data-tab]').forEach((btn) => {
    btn.addEventListener("click", () => {
      // petit délai pour laisser l’onglet s’activer
      setTimeout(match, 0);
    });
  });

  /* ---------------------------------------------
     5) Recherche prestations (filtre texte)
  ---------------------------------------------- */
  const searchInput = $("#prestationSearch");
  const getActivePanel = () => $(".services-panel.is-active") || $(".services-panel");

  const normalize = (s) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const applySearch = () => {
    const q = normalize(searchInput ? searchInput.value : "");
    const activePanel = getActivePanel();
    if (!activePanel) return;

    $$(".card.service", activePanel).forEach((card) => {
      const text = normalize(card.innerText);
      card.style.display = !q || text.includes(q) ? "" : "none";
    });
  };

  if (searchInput) {
    searchInput.addEventListener("input", applySearch);
  }

  // Quand on change d'onglet, on réapplique la recherche sur le panel actif
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // petite attente pour laisser l'onglet s'activer
      window.requestAnimationFrame(applySearch);
    });
  });

})();
