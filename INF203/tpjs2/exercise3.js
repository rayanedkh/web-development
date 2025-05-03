"use strict";

// Fonction pour charger le fichier slides.json via AJAX
function loadSlides() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "slides.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const slidesData = JSON.parse(xhr.responseText);
            startSlideshow(slidesData.slides); // Démarrer le diaporama une fois les données chargées
        }
    };
    xhr.send();
}

// Fonction pour lancer le diaporama
function startSlideshow(slides) {
    let currentIndex = 0;

    function showNextSlide() {
        // Vider la div "MAIN" avant d'afficher la nouvelle diapositive
        const mainDiv = document.getElementById("MAIN");
        mainDiv.innerHTML = "";

        if (currentIndex < slides.length) {
            const slide = slides[currentIndex];
            if (slide.url) {
                const iframe = document.createElement("iframe");
                iframe.src = slide.url;
                iframe.width = "800";
                iframe.height = "600";
                mainDiv.appendChild(iframe);
            }
            currentIndex++;
        } else {
            clearInterval(slideInterval); // Arrêter le diaporama lorsque toutes les diapositives sont affichées
        }
    }

    // Afficher la première diapositive immédiatement
    showNextSlide();

    // Lancer un setTimeout pour afficher les diapositives à chaque time
    const slideInterval = setInterval(showNextSlide, 2000); // Intervalle de 2 secondes entre chaque diapositive
}

// Ajouter un écouteur d'événements pour le bouton "Démarrer le diaporama"
document.getElementById("start").addEventListener("click", loadSlides);
