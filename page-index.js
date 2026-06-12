/* Page specific scripts for index.html
   Includes: STATS data, cert cards generation and lightbox handling */

const STATS = {
    bio: "Passionné de sécurité offensive et défensive, j'explore les réseaux, le pentest et l'administration système. En train de monter un lab Proxmox et de préparer la certification Cisco CyberOps Associate.",
    role: "Étudiant en cybersécurité · CTF Player · SysAdmin",

    thm: {
        logo:  "photo/tryhackme.svg",
        rank:  "Top 9%",
        rooms: 72,
        issuerLogo: "photo/cisco.png",
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
            name:       "Ethical Hacker",
            issuer:     "Cisco Networking Academy",
            issuerLogo: "photo/cisco.png",
            status:     "done",
            badge:      "photo/ethical-hacker.png",
            cert:       "photo/certificatEHCisco.png",
        },
        {
            name:       "Introduction to Cybersecurity",
            issuer:     "Cisco Networking Academy",
            issuerLogo: "photo/cisco.png",
            status:     "done",
            badge:      "photo/introduction-to-cybersecurity.png",
            cert:       "photo/certificatINTROCYBERcisco.png",
        },
        {
            name:       "Pre Security",
            issuer:     "TryHackMe",
            issuerLogo: "photo/tryhackme.svg",
            status:     "done",
            cert:       "photo/presecuritypath.png",
        },
        {
            name:       "CyberOps Associate",
            issuer:     "Cisco",
            issuerLogo: "photo/cisco.png",
            status:     "wip",
        }
    ]
};

/* ── Injection des stats dans le DOM ── */
document.addEventListener('DOMContentLoaded', () => {
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    setText('js-role', STATS.role);
    setText('js-bio', STATS.bio);

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

    /* ── Génération des cartes certifs ── */
    const certContainer = document.getElementById('js-certs');
    if (certContainer) {
        STATS.certifications.forEach(cert => {
            const hasBadge      = !!cert.badge;
            const hasCert       = !!cert.cert;
            const hasCertUrl    = !!cert.certUrl;
            const hasIssuerLogo = !!cert.issuerLogo;
            const isDone        = cert.status === 'done';
            const isWip         = cert.status === 'wip';

            const label      = isDone ? 'Obtenu' : isWip ? 'En cours' : 'Prévu';
            const badgeClass = isDone ? 'cert-badge-done' : isWip ? 'cert-badge-wip' : 'cert-badge-planned';

            const card = document.createElement('div');
            card.className = 'home-cert-card' + (hasBadge ? ' has-badge' : '');

            const main = document.createElement('div');
            main.className = 'cert-card-main';
            main.innerHTML = `
                <div class="cert-card-left">
                    ${hasIssuerLogo ? `<img src="${cert.issuerLogo}" alt="${cert.issuer}" class="cert-issuer-logo">` : ''}
                    <div class="cert-card-info">
                        <span class="cert-name">${cert.name}</span>
                        <span class="cert-issuer">${cert.issuer}</span>
                    </div>
                </div>
                <div class="cert-card-actions">
                    ${hasCert ? `<button class="cert-view-btn" data-img="${cert.cert}" title="Voir le certificat">
                        <i class="fa fa-file" aria-hidden="true"></i> Certificat
                    </button>` : ''}
                    ${hasCertUrl ? `<a class="cert-view-btn" href="${cert.certUrl}" target="_blank" rel="noopener" title="Voir le certificat">
                        <i class="fa fa-external-link" aria-hidden="true"></i> Certificat
                    </a>` : ''}
                    <span class="cert-badge ${badgeClass}">${label}</span>
                </div>
            `;
            card.appendChild(main);

            if (hasBadge) {
                const badgeWrap = document.createElement('div');
                badgeWrap.className = 'cert-credly-wrap';
                badgeWrap.innerHTML = `<img src="${cert.badge}" alt="Badge ${cert.name}" class="cert-badge-img">`;
                card.appendChild(badgeWrap);
            }

            certContainer.appendChild(card);
        });
    }

    /* ── Lightbox certificat ── */
    const lightbox = document.getElementById('certLightbox');
    const lightboxImg = document.getElementById('certLightboxImg');
    const lightboxClose = document.getElementById('certLightboxClose');
    const lightboxBackdrop = document.getElementById('certLightboxBackdrop');

    if (document.getElementById('js-certs')) {
        document.getElementById('js-certs').addEventListener('click', e => {
            const btn = e.target.closest('.cert-view-btn');
            if (!btn || btn.tagName === 'A') return;
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
