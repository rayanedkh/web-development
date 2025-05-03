// Fonction pour charger les résultats d'un Grand Prix pour une saison donnée et un numéro de Grand Prix (round) donné
function loadGrandPrixResults(year, round) {
    if (!year || !round) {
        return; // Si l'année ou le numéro de Grand Prix (round) n'est pas sélectionné, ne rien faire
    }
    var apiUrl = "http://ergast.com/api/f1/".concat(year, "/").concat(round, "/results.json");
    fetch(apiUrl)
        .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(function (data) {
        displayGrandPrixResults(data);
    })
        .catch(function (error) {
        console.error('Error fetching Grand Prix results:', error);
    });
}
// Fonction pour afficher les résultats d'un Grand Prix dans le HTML
function displayGrandPrixResults(data) {
    var raceResults = data.MRData.RaceTable.Races[0].Results;
    var resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = ''; // Efface le contenu existant
        var table = document.createElement('table');
        table.innerHTML = "\n            <thead>\n                <tr>\n                    <th>Position</th>\n                    <th>Driver</th>\n                    <th>Constructor</th>\n                    <th>Laps</th>\n                    <th>Grid</th>\n                    <th>Time</th>\n                    <th>Status</th>\n                    <th>Points</th>\n                </tr>\n            </thead>\n            <tbody>\n                ".concat(raceResults.map(function (result) { return "\n                    <tr>\n                        <td>".concat(result.position, "</td>\n                        <td>").concat(result.Driver.givenName, " ").concat(result.Driver.familyName, "</td>\n                        <td>").concat(result.Constructor.name, "</td>\n                        <td>").concat(result.laps, "</td>\n                        <td>").concat(result.grid, "</td>\n                        <td>").concat(result.Time ? result.Time.time : '', "</td>\n                        <td>").concat(result.status, "</td>\n                        <td>").concat(result.points, "</td>\n                    </tr>\n                "); }).join(''), "\n            </tbody>\n        ");
        resultsContainer.appendChild(table);
    }
}
// Fonction pour charger les années disponibles dans le menu déroulant des années
function loadYears() {
    var yearSelect = document.getElementById('year-select');
    if (yearSelect) {
        var currentYear = new Date().getFullYear();
        for (var year = 1950; year <= currentYear; year++) {
            var option = document.createElement('option');
            option.value = year.toString(); // Convert year to string
            option.textContent = year.toString(); // Convert year to string
            yearSelect.appendChild(option);
        }
    }
}
// Fonction pour charger les numéros de Grand Prix (round) pour une saison donnée dans le menu déroulant des rounds
function loadRounds(year) {
    var roundSelect = document.getElementById('round-select');
    roundSelect.innerHTML = ''; // Efface le contenu existant
    if (!year) {
        return; // Si aucune année n'est sélectionnée, ne rien faire
    }
    var apiUrl = "http://ergast.com/api/f1/".concat(year, ".json");
    fetch(apiUrl)
        .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(function (data) {
        var rounds = data.MRData.RaceTable.Races;
        rounds.forEach(function (race) {
            var option = document.createElement('option');
            option.value = race.round;
            option.textContent = "Round ".concat(race.round, " - ").concat(race.raceName);
            roundSelect.appendChild(option);
        });
    })
        .catch(function (error) {
        console.error('Error fetching rounds:', error);
    });
}
// Chargement des années disponibles au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    loadYears(); // Charger les années disponibles dans le menu déroulant des années
    var yearSelect = document.getElementById('year-select');
    if (yearSelect) {
        yearSelect.addEventListener('change', function () {
            var selectedYear = yearSelect.value;
            loadRounds(selectedYear); // Charger les numéros de Grand Prix (round) pour l'année sélectionnée
        });
    }
    var roundSelect = document.getElementById('round-select'); // Typecast roundSelect to HTMLSelectElement
    if (roundSelect) {
        roundSelect.addEventListener('change', function () {
            var selectedYear = yearSelect.value;
            var selectedRound = roundSelect.value;
            loadGrandPrixResults(selectedYear, selectedRound); // Charger les résultats du Grand Prix sélectionné
        });
    }
});
