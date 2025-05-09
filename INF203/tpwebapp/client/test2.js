document.addEventListener('DOMContentLoaded', function() {
    const showBtn = document.getElementById('BUTSHOW'); // Modifié: SHOW_B → BUTSHOW
    const addBtn = document.getElementById('BUT_ADD');  // Modifié: AD → BUT_ADD
    const removeBtn = document.getElementById('REMOVE');
    const clearBtn = document.getElementById('CLEAR');
    const restoreBtn = document.getElementById('RESTORE');
    const addForm = document.getElementById('addForm');
    const removeForm = document.getElementById('removeForm');
    const mainShow = document.getElementById('MAINSHOW');
    const doAddBtn = document.getElementById('SUBMITADD'); // Modifié: DOADD → SUBMITADD
    const validRemBtn = document.getElementById('VALIDREM');
    const titleTF = document.getElementById('titleTF');
    const valueTF = document.getElementById('valueTF');
    const colorTF = document.getElementById('colorTF');
    const indexTF = document.getElementById('indexTF');
    const pieButton = document.getElementById('PIEBUTTON');
    const pieContainer = document.getElementById('pieContainer');
    const localPieButton = document.getElementById('LOC_PIEB'); // Modifié: LOCAL_PIE → LOC_PIEB

    // Clear display and show form
    addBtn.addEventListener('click', function() {
        mainShow.innerHTML = '';
        addForm.style.display = 'block';
        removeForm.style.display = 'none';
    });

    // Clear display and show form
    removeBtn.addEventListener('click', function() {
        mainShow.innerHTML = '';
        removeForm.style.display = 'block';
        addForm.style.display = 'none';
    });

    // Show JSON text
    showBtn.addEventListener('click', function() {
        addForm.style.display = 'none';
        removeForm.style.display = 'none';
        fetch('../../Data') // Modifié: Show → Data
            .then(response => response.json())
            .then(data => {
                mainShow.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            })
            .catch(err => {
                mainShow.textContent = 'Error fetching data';
            });
    });

    // Add new element
    doAddBtn.addEventListener('click', function() {
        const title = titleTF.value.trim();
        const value = parseInt(valueTF.value);
        const color = colorTF.value.trim();

        if (!title || isNaN(value) || value <= 0 || !color) {
            alert('Please fill all fields with valid values');
            return;
        }

        fetch(`../../add?title=${encodeURIComponent(title)}&value=${value}&color=${encodeURIComponent(color)}`)
            .then(response => response.text())
            .then(text => {
                mainShow.textContent = text;
                addForm.style.display = 'none';
                titleTF.value = '';
                valueTF.value = '';
                colorTF.value = '';
            })
            .catch(err => {
                mainShow.textContent = 'Error adding element';
            });
    });

    // Remove element
    validRemBtn.addEventListener('click', function() {
        const index = parseInt(indexTF.value);
        if (isNaN(index) || index < 0) {
            alert('Please enter a valid index');
            return;
        }

        fetch(`../../remove?index=${index}`)
            .then(response => response.text())
            .then(text => {
                mainShow.textContent = text;
                removeForm.style.display = 'none';
                indexTF.value = '';
            })
            .catch(err => {
                mainShow.textContent = 'Error removing element';
            });
    });

    pieButton.addEventListener('click', function() {
        mainShow.innerHTML = '';
        addForm.style.display = 'none';
        removeForm.style.display = 'none';
        
        // Fetch the SVG generated by the server and insert it inline in MAINSHOW.
        fetch('../../PieChart')
            .then(response => response.text())
            .then(svgText => {
                mainShow.innerHTML = svgText;
            })
            .catch(err => {
                mainShow.textContent = 'Error loading pie chart';
            });
    });

    // Clear all elements
    clearBtn.addEventListener('click', function() {
        fetch('../../clear')
            .then(response => response.text())
            .then(text => {
                mainShow.textContent = text;
            })
            .catch(err => {
                mainShow.textContent = 'Error clearing data';
            });
    });

    // Restore default elements
    restoreBtn.addEventListener('click', function() {
        fetch('../../restore')
            .then(response => response.text())
            .then(text => {
                mainShow.textContent = text;
            })
            .catch(err => {
                mainShow.textContent = 'Error restoring data';
            });
    });

    // Display pie chart
    function displayPieChart(data) {
        if (data.length === 0 || (data.length === 1 && data[0].title === 'empty')) {
            return;
        }

        const total = data.reduce((sum, item) => sum + item.value, 0);
        let cumulativePercent = 0;
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.classList.add('pie-chart');

        data.forEach(item => {
            const percent = (item.value / total) * 100;
            const angle = (percent / 100) * 360;
            
            // Create path for each slice
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            // Calculate path data
            const startX = 50 + 50 * Math.cos(cumulativePercent * Math.PI / 180);
            const startY = 50 + 50 * Math.sin(cumulativePercent * Math.PI / 180);
            
            cumulativePercent += angle;
            
            const endX = 50 + 50 * Math.cos(cumulativePercent * Math.PI / 180);
            const endY = 50 + 50 * Math.sin(cumulativePercent * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
                `M 50 50`,
                `L ${startX} ${startY}`,
                `A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `Z`
            ].join(' ');
            
            path.setAttribute("d", pathData);
            path.setAttribute("fill", item.color);
            path.setAttribute("stroke", "white");
            path.setAttribute("stroke-width", "0.5");
            
            // Add title as tooltip
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = `${item.title}: ${percent.toFixed(1)}% (${item.value})`;
            path.appendChild(title);
            
            svg.appendChild(path);
        });

        mainShow.appendChild(svg);
    }

    localPieButton.addEventListener('click', function() {
        // Clear other displays
        mainShow.innerHTML = '';
        addForm.style.display = 'none';
        removeForm.style.display = 'none';
        pieContainer.innerHTML = '';
        
        // Fetch data and generate pie chart locally
        fetch('../../Data') // Modifié: Show → Data
            .then(response => response.json())
            .then(data => {
                if (data.length === 0 || (data.length === 1 && data[0].title === 'empty')) {
                    mainShow.innerHTML = '<p>No data available</p>';
                    return;
                }
                
                const total = data.reduce((sum, item) => sum + item.value, 0);
                let cumulativePercent = 0;
                
                const svgNS = "http://www.w3.org/2000/svg";
                const svg = document.createElementNS(svgNS, "svg");
                svg.setAttribute("viewBox", "0 0 100 100");
                svg.style.width = "300px";
                svg.style.height = "300px";
                
                // First pass: draw wedges
                data.forEach(item => {
                    const percent = (item.value / total) * 100;
                    const angle = (percent / 100) * 360;
                    
                    const startX = 50 + 50 * Math.cos(cumulativePercent * Math.PI / 180);
                    const startY = 50 + 50 * Math.sin(cumulativePercent * Math.PI / 180);
                    
                    cumulativePercent += angle;
                    
                    const endX = 50 + 50 * Math.cos(cumulativePercent * Math.PI / 180);
                    const endY = 50 + 50 * Math.sin(cumulativePercent * Math.PI / 180);
                    
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    
                    const path = document.createElementNS(svgNS, "path");
                    path.setAttribute("d", `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`);
                    path.setAttribute("fill", item.color);
                    svg.appendChild(path);
                });
                
                // Second pass: add labels
                cumulativePercent = 0;
                data.forEach(item => {
                    const percent = (item.value / total) * 100;
                    const angle = (percent / 100) * 360;
                    const middleAngle = cumulativePercent + angle/2;
                    
                    const textX = 50 + 20 * Math.cos(middleAngle * Math.PI / 180);
                    const textY = 50 + 20 * Math.sin(middleAngle * Math.PI / 180);
                    
                    // Determine contrasting text color
                    const textColor = getContrastingColor(item.color);
                    
                    const text = document.createElementNS(svgNS, "text");
                    text.setAttribute("x", textX);
                    text.setAttribute("y", textY);
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("fill", textColor);
                    text.setAttribute("font-size", "3");
                    text.textContent = item.title;
                    svg.appendChild(text);
                    
                    cumulativePercent += angle;
                });
                
                mainShow.appendChild(svg);
            })
            .catch(err => {
                mainShow.textContent = 'Error loading data';
            });
    });
    
    // Helper function to determine contrasting text color
    function getContrastingColor(bgColor) {
        if (!bgColor) return 'black';
        
        // Handle named colors
        const namedColors = {
            'black': 'white',
            'navy': 'white',
            'darkblue': 'white',
            'darkgreen': 'white',
            'maroon': 'white',
            'purple': 'white',
            'white': 'black',
            'ivory': 'black',
            'lightyellow': 'black'
        };
        
        if (namedColors[bgColor.toLowerCase()]) {
            return namedColors[bgColor.toLowerCase()];
        }
        
        // Handle hex colors (#rgb or #rrggbb)
        if (bgColor.startsWith('#')) {
            const hex = bgColor.length === 4 ? 
                bgColor.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3') : 
                bgColor;
            
            const r = parseInt(hex.substr(1,2), 16);
            const g = parseInt(hex.substr(3,2), 16);
            const b = parseInt(hex.substr(5,2), 16);
            
            // Calculate brightness (perceived luminance)
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128 ? 'black' : 'white';
        }
        
        // Default for unknown color formats
        return 'black';
    }
});