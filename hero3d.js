/* ========================================================
   HERO3D.JS — Objet 3D du hero (Three.js), pilotable au scroll
   ========================================================

   Ne fait rien si :
   - #three-canvas est absent de la page (pages secondaires sans hero 3D)
   - THREE n'a pas pu charger (CDN bloqué / hors-ligne)
   - le contexte WebGL échoue à l'initialisation
   Dans tous ces cas le hero reste utilisable sans canvas.

   ── Modèle personnalisé actif : assets/model.glb ──
   cdnjs ne mirrore que le coeur de three.js (build/three.min.js), pas les
   examples/loaders — le GLTFLoader compatible r128 est donc chargé depuis
   jsdelivr (npm/three@0.128.0), whitelisté dans la CSP en script-src.
   Si le loader ou le .glb échoue à charger, on retombe automatiquement
   sur l'icosaèdre par défaut (createDefaultObject) — le hero reste
   toujours utilisable.
   Pour remplacer par un autre modèle : dépose le .glb dans assets/,
   change l'URL passée à loadCustomModel() plus bas, et vérifie que tu en
   détiens les droits (modèle personnel, ou licence explicite autorisant
   l'usage web/portfolio) — ne réutilise jamais un .glb trouvé sur un site
   tiers sans vérifier sa licence.
   ======================================================== */
(function () {
    'use strict';

    var canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    var heroEl = document.getElementById('home') || canvas.parentElement;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var renderer, scene, camera, group;

    try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) {
        canvas.style.display = 'none';
        return;
    }

    var W = heroEl.offsetWidth, H = heroEl.offsetHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0, 7);

    group = new THREE.Group();
    scene.add(group);

    /* ── Objet par défaut : icosaèdre facetté + wireframe ── */
    function createDefaultObject(target) {
        var geo = new THREE.IcosahedronGeometry(1.9, 1);
        var mat = new THREE.MeshStandardMaterial({
            color: 0xf2f0ec, flatShading: true, metalness: 0.15, roughness: 0.55
        });
        var mesh = new THREE.Mesh(geo, mat);
        target.add(mesh);

        var edges = new THREE.EdgesGeometry(geo);
        var lineMat = new THREE.LineBasicMaterial({ color: 0x0a0a0a, transparent: true, opacity: 0.5 });
        var wire = new THREE.LineSegments(edges, lineMat);
        wire.scale.setScalar(1.001);
        target.add(wire);

        return target;
    }

    /* ── Chargement d'un modèle .glb, réutilisable pour n'importe quelle URL ── */
    function loadCustomModel(target, url) {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
        script.onload = function () {
            var loader = new THREE.GLTFLoader();
            loader.load(url, function (gltf) {
                var model = gltf.scene;

                // Centre et redimensionne le modèle pour occuper un volume
                // comparable à l'objet par défaut (rayon ~1.9)
                var box = new THREE.Box3().setFromObject(model);
                var size = new THREE.Vector3();
                box.getSize(size);
                var center = new THREE.Vector3();
                box.getCenter(center);
                model.position.sub(center);
                var maxDim = Math.max(size.x, size.y, size.z) || 1;
                var scale = (1.9 * 2) / maxDim;
                model.scale.setScalar(scale);

                target.add(model);
            }, undefined, function () {
                // échec de chargement du .glb : on retombe sur l'objet par défaut
                createDefaultObject(target);
            });
        };
        script.onerror = function () {
            // échec de chargement du loader lui-même (CDN bloqué / hors-ligne)
            createDefaultObject(target);
        };
        document.head.appendChild(script);
    }

    loadCustomModel(group, 'assets/model.glb');
    // createDefaultObject(group); // repli manuel vers l'icosaèdre par défaut si besoin

    group.position.x = W < 900 ? 0 : 2.1;

    var key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 5, 6);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xffffff, 0.35);
    fill.position.set(-5, -2, 3);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x404040, 0.6));

    function resize() {
        W = heroEl.offsetWidth; H = heroEl.offsetHeight;
        renderer.setSize(W, H);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        group.position.x = W < 900 ? 0 : 2.1;
    }
    window.addEventListener('resize', resize);

    /* ── Logique "fermé → ouvert" pilotée par le scroll ──
       Réutilisable pour n'importe quel THREE.Object3D. L'objet démarre
       incliné et réduit (position "refermé"), puis pivote et grossit
       jusqu'à sa taille/orientation normale au fil du scroll dans le hero
       (barre de progression 0 → 1 sur ~90% de la hauteur de la fenêtre).
       Une fois ouvert, un très léger tournoiement continu + une parallaxe
       souris lui donnent un peu de vie sans que ça tourne dans tous les
       sens. Remonter en haut de page referme l'objet (animation réversible). */
    var mouseX = 0;
    var idleSpin = 0;
    var coarsePointer = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!coarsePointer) {
        window.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth - 0.5);
        });
    }

    var CLOSED_TILT_X = 1.4;   // objet incliné, vu presque de profil
    var OPEN_TILT_X = -0.12;   // orientation normale, légèrement penchée
    var CLOSED_SCALE = 0.55;

    function smoothstep(t) {
        return t * t * (3 - 2 * t);
    }

    function applyRotationLogic(object3D) {
        var progress = window.scrollY / (window.innerHeight * 0.9);
        progress = Math.min(Math.max(progress, 0), 1);
        var eased = smoothstep(progress);

        object3D.rotation.x = CLOSED_TILT_X + (OPEN_TILT_X - CLOSED_TILT_X) * eased;

        var scale = CLOSED_SCALE + (1 - CLOSED_SCALE) * eased;
        object3D.scale.setScalar(scale);

        idleSpin += 0.0015 * eased;
        object3D.rotation.y = idleSpin;
        object3D.rotation.z += ((-mouseX * 0.12 * eased) - object3D.rotation.z) * 0.05;
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!reduced) {
            applyRotationLogic(group);
        }
        renderer.render(scene, camera);
    }
    animate();
})();
