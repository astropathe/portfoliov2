/* Page specific scripts for index.html
   Includes: STATS data, cert cards generation and lightbox handling */

const STATS = {
    thm: {
        logo:  "photo/tryhackme.svg",
        rank:  "Top 9%",
        rooms: 72,
    },
    rootme: {
        logo:       "photo/rootme.svg",
        points:     890,
        challenges: 76,
    },
    htb: {
        logo:     "photo/htb.png",
        machines: 3,
        rank:     "Beginner III",
    },

    certifications: [
        {
            name:   "Ethical Hacker",
            issuer: "Cisco Networking Academy",
            status: "done",
            cert:   "photo/certificatEHCisco.png",
        },
        {
            name:   "Introduction to Cybersecurity",
            issuer: "Cisco Networking Academy",
            status: "done",
            cert:   "photo/certificatINTROCYBERcisco.png",
        },
        {
            name:   "Pre Security",
            issuer: "TryHackMe",
            status: "done",
            cert:   "photo/presecuritypath.png",
        },
        {
            name:   "CyberOps Associate",
            issuer: "Cisco",
            status: "wip",
        }
    ]
};

/* ── Injection des stats dans le DOM ── */
document.addEventListener('DOMContentLoaded', () => {
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    const setSrc = (id, src) => {
        const el = document.getElementById(id);
        if (el) el.src = src;
    };

    setSrc('js-thm-logo', STATS.thm.logo);
    setSrc('js-rm-logo', STATS.rootme.logo);
    setSrc('js-htb-logo', STATS.htb.logo);

    setText('js-thm-rank', STATS.thm.rank);
    setText('js-thm-rooms', STATS.thm.rooms + ' rooms complétées');
    setText('js-rm-pts', STATS.rootme.points.toLocaleString('fr-FR') + ' pts');
    setText('js-rm-chall', STATS.rootme.challenges + ' challenges résolus');
    setText('js-htb-machines', STATS.htb.machines + ' machines');
    setText('js-htb-rank', STATS.htb.rank);

    /* ── Génération des lignes certifications ── */
    const certContainer = document.getElementById('js-certs');
    if (certContainer) {
        STATS.certifications.forEach(cert => {
            const isDone = cert.status === 'done';
            const label = isDone ? 'Obtenu' : 'En cours';

            const item = document.createElement('div');
            item.className = 'cert-item';
            item.innerHTML = `
                <div class="cert-item-info">
                    <div>
                        <span class="cert-name">${cert.name}</span>
                        <span class="cert-issuer">${cert.issuer}</span>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:0.6rem;">
                    ${cert.cert ? `<button class="cert-view-btn hoverable" data-img="${cert.cert}" title="Voir le certificat">Voir</button>` : ''}
                    <span class="cert-status${isDone ? ' done' : ''}">${label}</span>
                </div>
            `;
            certContainer.appendChild(item);
        });
    }

    /* ── Lightbox certificat ── */
    const lightbox = document.getElementById('certLightbox');
    const lightboxImg = document.getElementById('certLightboxImg');
    const lightboxClose = document.getElementById('certLightboxClose');
    const lightboxBackdrop = document.getElementById('certLightboxBackdrop');

    if (certContainer) {
        certContainer.addEventListener('click', e => {
            const btn = e.target.closest('.cert-view-btn');
            if (!btn) return;
            if (lightboxImg) lightboxImg.src = btn.dataset.img;
            if (lightbox) lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.src = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
});
