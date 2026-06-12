// Recherche dans les cartes de posts (si présent sur la page)
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    if (!searchBar) return; // Quitter si searchBar n'existe pas
    
    const posts = document.querySelectorAll('.post-card');
    if (posts.length === 0) return; // Quitter si pas de posts

    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value.toLowerCase();

        posts.forEach(post => {
            const text = post.textContent.toLowerCase();
            post.style.display = text.includes(searchString) ? "flex" : "none";
        });
    });
});

// Menu mobile - Hamburger et Sidebar
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const searchBtn    = document.getElementById('searchBtn');
    const leftSidebar  = document.getElementById('leftSidebar');
    const rightSidebar = document.getElementById('rightSidebar');
    const overlay      = document.getElementById('sidebarOverlay');

    if (!hamburgerBtn || !searchBtn || !leftSidebar || !rightSidebar || !overlay) return;

    function closeAll() {
        leftSidebar.classList.remove('open');
        rightSidebar.classList.remove('open');
        overlay.classList.remove('active');
        hamburgerBtn.classList.remove('open');
        document.body.style.overflow = '';
    }

    function openLeft() {
        closeAll();
        leftSidebar.classList.add('open');
        overlay.classList.add('active');
        hamburgerBtn.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function openRight() {
        closeAll();
        rightSidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hamburgerBtn.addEventListener('click', () => leftSidebar.classList.contains('open') ? closeAll() : openLeft());
    searchBtn.addEventListener('click', () => rightSidebar.classList.contains('open') ? closeAll() : openRight());
    overlay.addEventListener('click', closeAll);
    leftSidebar.querySelectorAll('a').forEach(l => l.addEventListener('click', closeAll));
});

// Charger le right-sidebar depuis un fragment HTML (utiliser le aside d'index)
document.addEventListener('DOMContentLoaded', () => {
    // Ne rien faire sur la page d'accueil
    const path = window.location.pathname || '';
    const filename = path.substring(path.lastIndexOf('/') + 1);
    if (filename === '' || filename === 'index.html') return;

    // Calculer le préfixe relatif vers la racine du site
    const segments = path.split('/').filter(s => s.length > 0);
    const depth = Math.max(0, segments.length - 1);
    let prefix = '';
    for (let i = 0; i < depth; i++) prefix += '../';

    const includeUrl = prefix + 'right-sidebar.html';

    fetch(includeUrl).then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.text();
    }).then(html => {
        const container = document.getElementById('rightSidebar');
        if (!container) return;
        container.innerHTML = html;
    }).catch(() => {
        // Si fetch échoue, on ignore proprement (site peut être servi différemment)
    });
});