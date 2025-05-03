"use strict";

// Fonction pour envoyer une nouvelle phrase au fichier PHP
function sendMessage() {
    const message = document.getElementById('textedit').value;
    if (message.trim() === "") {
        return; // Si le champ est vide, ne rien faire
    }

    // Appel AJAX pour envoyer la phrase à chat.php
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `chat.php?phrase=${encodeURIComponent(message)}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('textedit').value = ""; // Effacer le champ de texte
            loadChat(); // Recharger la discussion après envoi
        }
    };
    xhr.send();
}

// Fonction pour charger la discussion à partir de chatlog.txt
function loadChat() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "chatlog.txt", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const lines = xhr.responseText.split("\n").filter(line => line.trim() !== "");
            const container = document.getElementById("textarea");
            container.innerHTML = ""; // Vider la div avant d'ajouter les nouvelles lignes

            const maxMessages = 10;
            const recentMessages = lines.slice(-maxMessages).reverse(); // Derniers 10 messages en haut

            recentMessages.forEach(line => {
                const p = document.createElement("p");
                p.textContent = line;
                container.appendChild(p);
            });
        }
    };
    xhr.send();
}

// Ajouter un écouteur d'événements sur le bouton "Envoyer"
document.getElementById("sendb").addEventListener("click", sendMessage);

// Rafraîchir la discussion toutes les secondes
setInterval(loadChat, 1000);

// Charger les messages au démarrage
loadChat();
