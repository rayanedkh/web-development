// Fonction pour charger le classement des pilotes pour une saison donnée
function loadDriverStandings(year) {
    if (!year) {
        return; // Si aucune année n'est sélectionnée, ne rien faire
    }
    var apiUrl = "http://ergast.com/api/f1/".concat(year, "/driverStandings.json");
    fetch(apiUrl)
        .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(function (data) {
        displayDriverStandings(data);
    })
        .catch(function (error) {
        console.error('Error fetching driver standings:', error);
    });
}
// Fonction pour afficher le classement des pilotes dans le HTML
function displayDriverStandings(data) {
    var standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    var standingsContainer = document.getElementById('standings-container');
    if (standingsContainer) {
        standingsContainer.innerHTML = ''; // Efface le contenu existant
        var table = document.createElement('table');
        table.innerHTML = "\n            <thead>\n                <tr>\n                    <th>Position</th>\n                    <th>Driver</th>\n                    <th>Team</th>\n                    <th>Points</th>\n                    <th>Wins</th>\n                </tr>\n            </thead>\n            <tbody>\n                ".concat(standings.map(function (driver) { return "\n                    <tr>\n                        <td>".concat(driver.position, "</td>\n                        <td>").concat(driver.Driver.givenName, " ").concat(driver.Driver.familyName, "</td>\n                        <td>").concat(driver.Constructors[0].name, "</td>\n                        <td>").concat(driver.points, "</td>\n                        <td>").concat(driver.wins, "</td>\n                    </tr>\n                "); }).join(''), "\n            </tbody>\n        ");
        standingsContainer.appendChild(table);
    }
}
// Fonction pour charger les années disponibles dans le menu déroulant
document.addEventListener('DOMContentLoaded', function () {
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
});
