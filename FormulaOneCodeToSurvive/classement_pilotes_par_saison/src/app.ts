// Fonction pour charger le classement des pilotes pour une saison donnée
function loadDriverStandings(year) {
    if (!year) {
        return; // Si aucune année n'est sélectionnée, ne rien faire
    }

    const apiUrl = `http://ergast.com/api/f1/${year}/driverStandings.json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayDriverStandings(data);
        })
        .catch(error => {
            console.error('Error fetching driver standings:', error);
        });
}

// Fonction pour afficher le classement des pilotes dans le HTML
function displayDriverStandings(data) {
    const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    const standingsContainer = document.getElementById('standings-container');
    if (standingsContainer) {
        standingsContainer.innerHTML = ''; // Efface le contenu existant

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Driver</th>
                    <th>Team</th>
                    <th>Points</th>
                    <th>Wins</th>
                </tr>
            </thead>
            <tbody>
                ${standings.map(driver => `
                    <tr>
                        <td>${driver.position}</td>
                        <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
                        <td>${driver.Constructors[0].name}</td>
                        <td>${driver.points}</td>
                        <td>${driver.wins}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        standingsContainer.appendChild(table);
    }
}

// Fonction pour charger les années disponibles dans le menu déroulant
document.addEventListener('DOMContentLoaded', () => {
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
});
