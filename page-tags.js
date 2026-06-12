// Tags page logic (extracted from pages/veilles/tags.html)
document.addEventListener('DOMContentLoaded', () => {
    const ARTICLES = [
        {
            title: "CVE Tracker",
            excerpt: "Création d'une application en Flask permettant de scanner les CVE récentes des outils/services utilisés par une entreprise",
            date: "19 Mai 2026",
            type: "Projet",
            tags: ["Cyber", "Dev", "Stage"],
            url: "../projets/cve-tracker.html",
            image: "../photo/uk_ncsc.webp"
        },
        {
            title: "De l'Iran à la surveillance de masse : la double guerre de Palantir",
            excerpt: "Le rôle de Palantir a radicalement basculé avec l'escalade des tensions entre les États-Unis et l'Iran. Le logiciel n'est plus un simple assistant, mais le « cerveau » des opérations.",
            date: "11 Mars 2026",
            type: "Veille",
            tags: ["Cyber", "Veille", "Palantir", "IA", "Défense", "Surveillance"],
            url: "2026-03-11-Palantir.html",
            image: "../photo/veilles/palantir.jpg"
        },
        {
            title: "Développement d'une extension Firefox",
            excerpt: "Extension permettant de croiser ses sources automatiquement sur un site de news (LeMonde, BFMTV...).",
            date: "15 Mai 2026",
            type: "Projet",
            tags: ["Dev", "Projet", "Firefox"],
            url: "projets.html",
            image: "../photo/debAIsing.png"
        },
        {
            title: "Simulation de Phishing avec GoPhish",
            excerpt: "Mise en place d'envois de mails de phishing dans mon établissement via le framework GoPhish.",
            date: "15 Mai 2026",
            type: "Projet",
            tags: ["Cyber", "Projet", "Phishing", "Red Team"],
            url: "projets.html",
            image: "../photo/debAIsing.png"
        },
        {
            title: "Nouveautés de la mise à jour Windows 11 KB5077241",
            excerpt: "Cette version se concentre sur l’amélioration de l’expérience utilisateur, la fiabilité du système et l’ajout d’outils de diagnostic.",
            date: "25 février 2026",
            type: "Veille",
            tags: ["Cyber", "Veille", "Windows", "MAJ"],
            url: "2026-02-25-WindowsMAJ.html",
            image: "../photo/windows11.webp"
        },
        {
            title: "Les États-Unis veulent imposer leur vision des normes de cybersécurité de l’IA au reste du monde",
            excerpt: "L’administration Trump cherche activement à imposer sa vision des normes de cybersécurité liées à l’intelligence artificielle (IA) à l’échelle mondiale.",
            date: "4 février 2026",
            type: "Veille",
            tags: ["Cyber", "Veille", "USA", "Geopolitique"],
            url: "2026-02-04-USACYBER.html",
            image: "../photo/us.jpg"
        },
        {
            title: "Le gouvernement britannique met en garde contre les attaques de groupes de hacktivistes russes en cours",
            excerpt: "Le Centre national de cybersécurité du Royaume-Uni (NCSC) a émis une mise en garde officielle concernant des attaques informatiques menées par des groupes de hacktivistes pro-russes.",
            date: "21 janvier 2026",
            type: "Veille",
            tags: ["Cyber", "Veille", "UK", "Geopolitique"],
            url: "2026-01-21-UK.html",
            image: "../photo/uk_ncsc.webp"
        }
    ];

    let activeTag = null;

    function buildTagCounts() {
        const counts = {};
        ARTICLES.forEach(a => a.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
        return counts;
    }

    function renderTagCloud() {
        const counts = buildTagCounts();
        const cloud  = document.getElementById('tagCloud');
        if (!cloud) return;
        cloud.innerHTML = '';
        Object.keys(counts).sort().forEach(tag => {
            const btn = document.createElement('button');
            btn.className = 'tag-filter' + (tag === activeTag ? ' active' : '');
            btn.innerHTML = `#${tag} <span class="count">${counts[tag]}</span>`;
            btn.addEventListener('click', () => toggleTag(tag));
            cloud.appendChild(btn);
        });
    }

    function toggleTag(tag) {
        activeTag = activeTag === tag ? null : tag;
        const url = new URL(window.location);
        if (activeTag) url.searchParams.set('tag', activeTag); else url.searchParams.delete('tag');
        history.replaceState({}, '', url);
        renderTagCloud();
        renderArticles();
    }

    function renderArticles() {
        const list   = document.getElementById('articleList');
        const header = document.getElementById('resultsHeader');
        const empty  = document.getElementById('noResults');
        if (!list || !header || !empty) return;

        const filtered = activeTag ? ARTICLES.filter(a => a.tags.includes(activeTag)) : ARTICLES;

        if (activeTag) header.innerHTML = `<span>${filtered.length}</span> article${filtered.length > 1 ? 's' : ''} tagué${filtered.length > 1 ? 's' : ''} <span>#${activeTag}</span>`;
        else header.innerHTML = `Tous les articles <span>(${ARTICLES.length})</span>`;

        if (filtered.length === 0) { list.innerHTML = ''; empty.style.display = 'block'; return; }
        empty.style.display = 'none';

        list.innerHTML = filtered.map(a => `
            <div class="tag-article-card">
                <a href="${a.url}">
                    <div class="card-img">
                        <img src="${a.image}" alt="${a.title}" onerror="this.parentElement.style.display='none'">
                    </div>
                    <div class="card-body">
                        <div class="card-type">${a.type} · ${a.date}</div>
                        <h3>${a.title}</h3>
                        <p>${a.excerpt}</p>
                        <div class="card-tags">
                            ${a.tags.map(t => `<span class="card-tag ${t === activeTag ? 'highlighted' : ''}">#${t}</span>`).join('')}
                        </div>
                    </div>
                </a>
            </div>
        `).join('');
    }

    function init() {
        const params = new URLSearchParams(window.location.search);
        activeTag = params.get('tag') || null;
        renderTagCloud();
        renderArticles();
    }

    init();
});
