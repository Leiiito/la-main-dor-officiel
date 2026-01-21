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
     
  /* ---------------------------------------------
     2) Prestations — Filtres simplifiés + recherche
     - Boutons : .filter[data-group]
     - Panels  : .services-panel#id (groupés)
  ---------------------------------------------- */
  const groupButtons = $$(".filter[data-group]");
  const panels = $$(".services-panel");

  const GROUPS = {
    ongles: ["ongles-mains", "ongles-gel", "ongles-pose-rallongement", "ongles-remplissage"],
    pieds:  ["ongles-pieds"],
    cils:   ["cils-pose", "cils-remplissage", "cils-rehaussement"],
    packs:  ["packs"],
    depose: ["ongles-depose", "cils-depose"]
  };

  const setPanelVisibility = (groupKey) => {
    const allowed = new Set(GROUPS[groupKey] || []);
    panels.forEach((p) => {
      p.classList.toggle("is-active", allowed.has(p.id));
    });
  };

  const activateGroup = (groupKey) => {
    groupButtons.forEach((btn) => {
      const active = btn.getAttribute("data-group") === groupKey;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    setPanelVisibility(groupKey);
  };

  if (groupButtons.length && panels.length) {
    groupButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-group");
        if (!key) return;
        activateGroup(key);
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        // Réapplique la recherche en cours si besoin
        const searchInput = $("#prestationSearch");
        if (searchInput && searchInput.value) searchInput.dispatchEvent(new Event("input"));
      });
    });
    // Groupe par défaut
    activateGroup("ongles");
  }

  // Recherche (filtre les cartes visibles)
  const searchInput = $("#prestationSearch");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      const activePanels = $$(".services-panel.is-active");
      activePanels.forEach((panel) => {
        const cards = $$(".card", panel);
        let visibleCount = 0;
        cards.forEach((card) => {
          const text = card.textContent.toLowerCase();
          const show = !q || text.includes(q);
          card.style.display = show ? "" : "none";
          if (show) visibleCount++;
        });
        // Si un panel n'a plus de cartes visibles, on le masque (évite un grand vide)
        panel.style.display = visibleCount ? "" : "none";
      });
    });
  }


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
