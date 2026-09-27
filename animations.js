/* ========================================================
   ANIMATIONS.JS — GSAP / ScrollTrigger / SplitText
   Chargé après script.js sur chaque page. Ne fait rien si
   GSAP n'a pas pu charger (CDN bloqué / hors-ligne) ou si
   l'utilisateur préfère un mouvement réduit : le contenu
   reste visible et statique dans ces cas (voir style.css,
   section "REVEAL AU SCROLL", état par défaut opacity:1).
   ======================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

    if (reduceMotion || !gsapReady) {
        return;
    }

    var hasSplitText = typeof window.SplitText !== 'undefined';

    gsap.registerPlugin(ScrollTrigger);
    if (hasSplitText) {
        gsap.registerPlugin(SplitText);
    }

    document.documentElement.classList.add('gsap-ready');

    document.addEventListener('DOMContentLoaded', function () {
        initRevealOnScroll();
        initHeroIntro();
        initReactiveSidebar();
        initCustomCursor();
    });

    /* ----------------------------------------------------
       1. REVEAL AU SCROLL — [data-reveal]
       data-reveal="lines"  -> titres, découpés en lignes (SplitText si dispo)
       data-reveal (seul)   -> fade + translateY simple (paragraphes, cards)
       data-reveal="hero"   -> ignoré ici, géré par initHeroIntro() au chargement
       ---------------------------------------------------- */
    function initRevealOnScroll() {
        var nodes = document.querySelectorAll('[data-reveal]:not([data-reveal="hero"])');

        nodes.forEach(function (el) {
            if (el.getAttribute('data-reveal') === 'lines') {
                revealLines(el, { scroll: true });
            } else {
                gsap.set(el, { opacity: 0, y: 24 });
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                    onEnter: function () {
                        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
                    }
                });
            }
        });

        // Groupes de cards : stagger léger entre les cartes d'une même liste
        document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
            var items = group.querySelectorAll(':scope > *');
            if (!items.length) return;
            gsap.set(items, { opacity: 0, y: 24 });
            ScrollTrigger.create({
                trigger: group,
                start: 'top 85%',
                once: true,
                onEnter: function () {
                    gsap.to(items, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 });
                }
            });
        });
    }

    function revealLines(el, opts) {
        opts = opts || {};
        var targets;
        var split;

        if (hasSplitText) {
            split = new SplitText(el, { type: 'lines', linesClass: 'reveal-line' });
            targets = split.lines;
        } else {
            // Repli sans SplitText : on anime le bloc entier comme une seule "ligne"
            el.classList.add('is-split');
            targets = [el];
        }

        gsap.set(targets, { opacity: 0, y: '100%' });

        var play = function () {
            gsap.to(targets, { opacity: 1, y: '0%', duration: 0.8, ease: 'power3.out', stagger: 0.06 });
        };

        if (opts.scroll) {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: play
            });
        } else {
            play();
        }
    }

    /* ----------------------------------------------------
       2. INTRO HERO (page d'accueil) — au chargement, sans scroll
       ---------------------------------------------------- */
    function initHeroIntro() {
        var heroNodes = document.querySelectorAll('[data-reveal="hero"]');
        if (!heroNodes.length) return;

        heroNodes.forEach(function (el, i) {
            if (el.tagName === 'H2' || el.tagName === 'H1') {
                revealLines(el, { scroll: false });
            } else {
                gsap.set(el, { opacity: 0, y: 16 });
                gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.15 + i * 0.12 });
            }
        });
    }

    /* ----------------------------------------------------
       3. SIDEBAR RÉACTIVE AU SCROLL
       ---------------------------------------------------- */
    function initReactiveSidebar() {
        var sidebar = document.getElementById('leftSidebar');
        if (!sidebar) return;

        var ticking = false;
        function update() {
            sidebar.classList.toggle('is-scrolled', window.scrollY > 60);
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }

    /* ----------------------------------------------------
       4. CURSEUR PERSONNALISÉ (desktop uniquement)
       ---------------------------------------------------- */
    function initCustomCursor() {
        var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!canHover) return;

        document.documentElement.classList.add('custom-cursor-active');

        var dot = document.createElement('div');
        dot.id = 'cursor-dot';
        var ring = document.createElement('div');
        ring.id = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        var moveDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
        var moveDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
        var moveRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
        var moveRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

        window.addEventListener('mousemove', function (e) {
            moveDot(e.clientX);
            moveDotY(e.clientY);
            moveRing(e.clientX);
            moveRingY(e.clientY);
        });

        var hoverTargets = 'a, button, .interactive-box, .post-card, .cv-download-card, .cert-view-btn, .filter-btn, .tag-filter';
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest(hoverTargets)) {
                ring.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest(hoverTargets)) {
                ring.classList.remove('cursor-hover');
            }
        });
    }
})();
