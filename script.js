document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const posts = document.querySelectorAll('.post-card');

    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value.toLowerCase();

        posts.forEach(post => {
            // On récupère tout le texte à l'intérieur de la carte (titre, p, tags)
            const text = post.textContent.toLowerCase();
            
            // Si le texte contient la recherche, on affiche, sinon on cache
            if (text.includes(searchString)) {
                post.style.display = "flex"; // On remet en flex pour garder ton design
            } else {
                post.style.display = "none";
            }
        });
    });
});


//=============terminal==================

const input = document.getElementById('terminal-input');
const history = document.getElementById('terminal-history');
const terminalScreen = document.getElementById('terminal-screen');

const commands = {
    help: "Commandes : <b>whoami</b>, <b>about</b>, <b>skills</b>, <b>projects</b>, <b>clear</b>",
    about: "Étudiant en BTS SIO SISR passionné par cybersécurité.",
    skills: "Linux, Cisco, Docker, Proxmox, Wireshark.",
    projects: "Regardez la section Projets à gauche !",
    whoami: "paul_manoha (uid=1000)"
};

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const fullCommand = input.value.toLowerCase().trim();

        if (fullCommand === 'clear') {
            // On vide seulement l'historique, pas le message de bienvenue
            history.innerHTML = '';
        } else {
            // Créer l'écho de la commande
            const line = document.createElement('p');
            line.innerHTML = `<span class="prompt">paul@debian:~$</span> <span class="command-echo">${fullCommand}</span>`;
            history.appendChild(line);

            // Gérer la réponse
            if (commands[fullCommand]) {
                const resLine = document.createElement('p');
                resLine.innerHTML = commands[fullCommand];
                resLine.style.marginBottom = "1rem";
                history.appendChild(resLine);
            } else if (fullCommand !== "") {
                const errLine = document.createElement('p');
                errLine.innerHTML = `<span class="error-text">bash: ${fullCommand}: commande introuvable</span>`;
                errLine.style.marginBottom = "1rem";
                history.appendChild(errLine);
            }
        }

        input.value = '';
        // On scroll sur le container global pour toujours voir l'input
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }
});