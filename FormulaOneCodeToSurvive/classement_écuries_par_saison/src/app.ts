// Fonction pour charger le classement des écuries pour une saison donnée
function loadConstructorStandings(year) {
    if (!year) {
        return; // Si aucune année n'est sélectionnée, ne rien faire
    }

    const apiUrl = `http://ergast.com/api/f1/${parseInt(year)}/constructorStandings.json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayConstructorStandings(data);
        })
        .catch(error => {
            console.error('Error fetching constructor standings:', error);
        });
}

// Fonction pour afficher le classement des écuries dans le HTML
function displayConstructorStandings(data) {
    const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    const standingsContainer = document.getElementById('standings-container');
    if (standingsContainer) {
        standingsContainer.innerHTML = ''; // Efface le contenu existant

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Team</th>
                    <th>Points</th>
                    <th>Wins</th>
                </tr>
            </thead>
            <tbody>
                ${standings.map(constructor => `
                    <tr>
                        <td>${constructor.position}</td>
                        <td>${constructor.Constructor.name}</td>
                        <td>${constructor.points}</td>
                        <td>${constructor.wins}</td>
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
        for (let year = 1958; year <= currentYear; year++) {
            const option = document.createElement('option');
            option.value = year.toString(); // Convert year to string
            option.textContent = year.toString(); // Convert year to string
            yearSelect.appendChild(option);
        }
    }
});
