// Writeups page filtering logic (extracted from pages/writeups.html)
document.addEventListener('DOMContentLoaded', () => {
    const platformButtons = document.querySelectorAll('.filter-btn:not(.sub-filter)');
    const typeButtons = document.querySelectorAll('.sub-filter');
    const cards = document.querySelectorAll('.post-card');
    const searchInput = document.getElementById('searchBar');

    if (!searchInput) return;

    let currentPlatform = 'all';
    let currentType = 'all';

    function filterWriteups() {
        const searchText = searchInput.value.toLowerCase();
        cards.forEach(card => {
            const matchesPlatform = (currentPlatform === 'all' || card.getAttribute('data-platform') === currentPlatform);
            const matchesType = (currentType === 'all' || card.getAttribute('data-category') === currentType);
            const title = card.querySelector('h2').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const matchesSearch = title.includes(searchText) || description.includes(searchText);
            card.style.display = (matchesPlatform && matchesType && matchesSearch) ? 'block' : 'none';
        });
    }

    platformButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            platformButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPlatform = btn.getAttribute('data-filter');
            filterWriteups();
        });
    });

    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.getAttribute('data-type');
            filterWriteups();
        });
    });

    searchInput.addEventListener('input', filterWriteups);
});
