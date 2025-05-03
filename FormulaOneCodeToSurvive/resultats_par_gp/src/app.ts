// Fonction pour charger les résultats d'un Grand Prix pour une saison donnée et un numéro de Grand Prix (round) donné
function loadGrandPrixResults(year, round) {
    if (!year || !round) {
        return; // Si l'année ou le numéro de Grand Prix (round) n'est pas sélectionné, ne rien faire
    }

    const apiUrl = `http://ergast.com/api/f1/${year}/${round}/results.json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayGrandPrixResults(data);
        })
        .catch(error => {
            console.error('Error fetching Grand Prix results:', error);
        });
}

// Fonction pour afficher les résultats d'un Grand Prix dans le HTML
function displayGrandPrixResults(data) {
    const raceResults = data.MRData.RaceTable.Races[0].Results;

    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = ''; // Efface le contenu existant

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Driver</th>
                    <th>Constructor</th>
                    <th>Laps</th>
                    <th>Grid</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                ${raceResults.map(result => `
                    <tr>
                        <td>${result.position}</td>
                        <td>${result.Driver.givenName} ${result.Driver.familyName}</td>
                        <td>${result.Constructor.name}</td>
                        <td>${result.laps}</td>
                        <td>${result.grid}</td>
                        <td>${result.Time ? result.Time.time : ''}</td>
                        <td>${result.status}</td>
                        <td>${result.points}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        resultsContainer.appendChild(table);
    }
}

// Fonction pour charger les années disponibles dans le menu déroulant des années
function loadYears() {
    const yearSelect = document.getElementById('year-select');

    if (yearSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = 1950; year <= currentYear; year++) {
            const option = document.createElement('option');
            option.value = year.toString(); // Convert year to string
            option.textContent = year.toString(); // Convert year to string
            yearSelect.appendChild(option);
        }
    }
}

// Fonction pour charger les numéros de Grand Prix (round) pour une saison donnée dans le menu déroulant des rounds
function loadRounds(year) {
    const roundSelect = document.getElementById('round-select');
    roundSelect.innerHTML = ''; // Efface le contenu existant

    if (!year) {
        return; // Si aucune année n'est sélectionnée, ne rien faire
    }

    const apiUrl = `http://ergast.com/api/f1/${year}.json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const rounds = data.MRData.RaceTable.Races;
            rounds.forEach(race => {
                const option = document.createElement('option');
                option.value = race.round;
                option.textContent = `Round ${race.round} - ${race.raceName}`;
                roundSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching rounds:', error);
        });
}

// Chargement des années disponibles au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadYears(); // Charger les années disponibles dans le menu déroulant des années

    const yearSelect = document.getElementById('year-select') as HTMLSelectElement;
    if (yearSelect) {
        yearSelect.addEventListener('change', () => {
            const selectedYear = yearSelect.value;
            loadRounds(selectedYear); // Charger les numéros de Grand Prix (round) pour l'année sélectionnée
        });
    }

    const roundSelect = document.getElementById('round-select') as HTMLSelectElement; // Typecast roundSelect to HTMLSelectElement
    if (roundSelect) {
        roundSelect.addEventListener('change', () => {
            const selectedYear = yearSelect.value;
            const selectedRound = roundSelect.value;
            loadGrandPrixResults(selectedYear, selectedRound); // Charger les résultats du Grand Prix sélectionné
        });
    }
});
