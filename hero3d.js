/* ========================================================
   HERO3D.JS — Objet 3D du hero (Three.js), pilotable au scroll
   ========================================================

   Ne fait rien si :
   - #three-canvas est absent de la page (pages secondaires sans hero 3D)
   - THREE n'a pas pu charger (CDN bloqué / hors-ligne)
   - le contexte WebGL échoue à l'initialisation
   Dans tous ces cas le hero reste utilisable sans canvas.

   ── Remplacer l'icosaèdre par ton propre modèle .glb ──
   1. Dépose ton fichier dans un dossier `assets/` à la racine (ex: assets/model.glb).
   2. Charge le GLTFLoader compatible avec la version de three.min.js utilisée
      ici (r128) : ajoute ce script AVANT hero3d.js dans le HTML —
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/loaders/GLTFLoader.js"></script>
      (le loader n'est PAS inclus dans three.min.js, c'est un fichier séparé).
   3. Ajoute `https://cdnjs.cloudflare.com` est déjà whitelisté en script-src
      dans la CSP de chaque page (nécessaire pour charger ce script).
   4. Dans ce fichier, remplace l'appel `createDefaultObject(group)` par
      `loadCustomModel(group, 'assets/model.glb')` (voir plus bas).
   5. N'utilise que des modèles dont tu détiens les droits (modèle personnel,
      ou licence explicite autorisant l'usage web/portfolio) — ne réutilise
      jamais un .glb trouvé sur un site tiers sans vérifier sa licence.
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

    /* ── Pour brancher un modèle perso plus tard (voir instructions en tête de fichier) ──
    function loadCustomModel(target, url) {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/loaders/GLTFLoader.js';
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
                var maxDim = Math.max(size.x, size.y, size.z);
                var scale = (1.9 * 2) / maxDim;
                model.scale.setScalar(scale);

                target.add(model);
            }, undefined, function () {
                // échec de chargement : on retombe sur l'objet par défaut
                createDefaultObject(target);
            });
        };
        document.head.appendChild(script);
    }
    ── Pour activer : commente la ligne createDefaultObject ci-dessous et
       décommente loadCustomModel('assets/model.glb') ── */

    createDefaultObject(group);
    // loadCustomModel(group, 'assets/model.glb');

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

    /* ── Logique de rotation partagée (idle + scroll + parallaxe souris) ──
       Réutilisable pour n'importe quel THREE.Object3D, pas seulement
       l'icosaèdre par défaut. */
    var lastScrollY = window.scrollY;
    var mouseX = 0;
    var coarsePointer = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!coarsePointer) {
        window.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth - 0.5);
        });
    }

    function applyRotationLogic(object3D) {
        var sy = window.scrollY;
        var delta = sy - lastScrollY;
        lastScrollY = sy;

        object3D.rotation.y += 0.0022 + delta * 0.0016;
        object3D.rotation.x += 0.0009 + delta * 0.0008;
        object3D.rotation.z += (-mouseX * 0.15 - object3D.rotation.z) * 0.02;
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
