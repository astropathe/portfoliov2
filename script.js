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

// Le menu mobile (bouton hamburger -> overlay plein écran) est géré dans animations.js
// (initMobileNav), au même endroit que le reste des interactions visuelles.
