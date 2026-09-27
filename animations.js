/* ========================================================
   ANIMATIONS.JS — curseur, header réactif, menu mobile, reveal GSAP
   Chargé après script.js sur chaque page.
   ======================================================== */
(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    document.addEventListener('DOMContentLoaded', function () {
        initHeaderScroll();
        initMobileNav();
        initCursor();
        initGsapReveal();
    });

    /* ── Header qui réagit au scroll ── */
    function initHeaderScroll() {
        var header = document.getElementById('mainHeader');
        if (!header) return;
        var ticking = false;
        function update() {
            header.classList.toggle('scrolled', window.scrollY > 40);
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
    }

    /* ── Menu mobile plein écran ── */
    function initMobileNav() {
        var toggle = document.getElementById('hamburgerBtn');
        var nav = document.getElementById('mobileNav');
        if (!toggle || !nav) return;

        function close() {
            toggle.classList.remove('open');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        }
        function open() {
            toggle.classList.add('open');
            nav.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        toggle.addEventListener('click', function () {
            nav.classList.contains('open') ? close() : open();
        });
        nav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', close);
        });
    }

    /* ── Curseur personnalisé (indépendant de GSAP, pour rester robuste) ── */
    function initCursor() {
        if (!fine || reduced) return;

        var dot = document.getElementById('cdot');
        var ring = document.getElementById('cring');
        if (!dot || !ring) return;

        var mx = 0, my = 0, rx = 0, ry = 0;
        window.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
        });

        (function loop() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
            requestAnimationFrame(loop);
        })();

        document.addEventListener('mouseover', function (e) {
            if (e.target.closest('.hoverable')) ring.classList.add('hovered');
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest('.hoverable')) ring.classList.remove('hovered');
        });
    }

    /* ── Reveal au scroll (GSAP + ScrollTrigger) ── */
    function initGsapReveal() {
        var gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

        if (reduced || !gsapReady) {
            document.querySelectorAll('[data-reveal]').forEach(function (el) {
                el.style.opacity = 1;
                el.style.transform = 'none';
            });
            return;
        }

        document.documentElement.classList.add('gsap-ready');
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll('[data-reveal]').forEach(function (el) {
            gsap.to(el, {
                opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', once: true }
            });
        });

        gsap.utils.toArray('.stat-card, .cert-item, .tag-article-card').forEach(function (el, i) {
            gsap.from(el, {
                opacity: 0, y: 20, duration: 0.7, delay: i * 0.08, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 90%', once: true }
            });
        });

        gsap.utils.toArray('.proj-row').forEach(function (el, i) {
            gsap.from(el, {
                opacity: 0, x: -16, duration: 0.6, delay: (i % 6) * 0.08, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 92%', once: true }
            });
        });

        var heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            gsap.from(heroTitle, { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.1 });
            var heroTag = document.querySelector('.hero-tag');
            if (heroTag) gsap.from(heroTag, { opacity: 0, y: 10, duration: 0.8, delay: 0.05 });
            var heroPills = document.querySelectorAll('.hero-cta .pill');
            if (heroPills.length) gsap.from(heroPills, { opacity: 0, y: 10, duration: 0.6, stagger: 0.1, delay: 0.45 });
        }
    }
})();
