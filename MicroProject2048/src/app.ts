// Programme principal
test_bonjour()
initializeBoard();

function bonjour(): void {
    return console.log('Bonjour');
}

function test_bonjour(): void {
    bonjour();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        let a = up(1);
        let b = up(2);
        let c = up(3);
        let d = up(4);
        if (!(a || b || c || d)) {
            document.getElementById("affichage").innerText = ("Tu ne peux pas aller en haut");
        }
        newCase();
        if (isGameOver()) {
            document.getElementById("affichage").innerText = ("Game Over");
        }
        console.log("haut");
        incrementScore();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
        let a = down(1);
        let b = down(2);
        let c = down(3);
        let d = down(4);
        if (!(a || b || c || d)) {
            document.getElementById("affichage").innerText = ("Tu ne peux pas aller en bas");
        }
        newCase();
        if (isGameOver()) {
            document.getElementById("affichage").innerText = ("Game Over");
        }
        console.log("bas");
        incrementScore();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        let a = left(1);
        let b = left(2);
        let c = left(3);
        let d = left(4);
        if (!(a || b || c || d)) {
            document.getElementById("affichage").innerText = ("Tu ne peux pas aller à gauche");
        }
        newCase();
        if (isGameOver()) {
            document.getElementById("affichage").innerText = ("Game Over");
        }
        console.log("gauche");
        incrementScore();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        let a = right(1);
        let b = right(2);
        let c = right(3);
        let d = right(4);
        if (!(a || b || c || d)) {
            document.getElementById('affichage').innerText = "Tu ne peux pas aller à droite";
    }
    newCase();
        if (isGameOver()) {
            document.getElementById("affichage").innerText = ("Game Over");
        }
    console.log("droite");
    incrementScore();
    }
});

let score = 0;
const scoreElement = document.getElementById('score');

function incrementScore(): void {
    score++;
    console.log("Score:", score);
    if (scoreElement) {
        scoreElement.textContent = `${score}`;
    } else {
        console.error('scoreElement is null or undefined');
    }
}

function getCell(i: number, j: number): HTMLTableCellElement | undefined {
    const cellId = `cell-${i}-${j}`;
    const cell = document.getElementById(cellId) as HTMLTableCellElement;
    if (!cell) {
        console.error(`Cell ${cellId} not found`);
    }
    return cell;
}


function setValue(i, j, value) {
    const cell = getCell(i, j);
    if (cell) {
        cell.textContent = value ? `${value}` : '';
        cell.className = ''; 
        if (value) {
            cell.classList.add(`cell-${value}`);
        }
    } else {
        console.error(`Cell at ${i}, ${j} is null or undefined`);
    }
}


function getValue(i: number, j: number): number {
    const cell = getCell(i, j);
    return cell ? parseInt(cell.textContent || '0') : 0;
}

function isEmpty(i: number, j: number): boolean {
    const cell = getCell(i, j);
    return cell ? cell.textContent === '' : false;
}
function initializeBoard(): void { 
    for (let i = 1; i <= 4; i++) { for (let j = 1; j <= 4; j++) { setValue(i, j, 0); } }
 }


window.addEventListener('DOMContentLoaded', newGame);

function newGame(): void {
    let firstCell = getRandomCell();
    let secondCell = getRandomCell();

    // Ensure the two cells are different
    while (firstCell[0] === secondCell[0] && firstCell[1] === secondCell[1]) {
        secondCell = getRandomCell();
    }
    setValue(firstCell[0], firstCell[1], getRandomValue());
    setValue(secondCell[0], secondCell[1], getRandomValue());
}

function getRandomCell(): [number, number] {
    const i = Math.ceil(Math.random() * 4);
    const j = Math.ceil(Math.random() * 4);
    return [i, j];
}

function getRandomValue(): number {
    const random = Math.random();
    if (random < 0.85) {
        return 2;
    } else {
        return 4;
    }
}

function moveRight(i: number): boolean {
    let moved = false;
    for (let j = 4; j >= 1; j--) {
        if (getValue(i, j) === 0) {
            for (let k = j - 1; k >= 1; k--) {
                if (getValue(i, k) !== 0) {
                    setValue(i, j, getValue(i, k));
                    setValue(i, k, 0);
                    moved = true;
                    break;
                }
            }
        }
    }
    return moved;
}


function moveLeft(i: number): boolean {
    let moved = false;
    for (let j = 1; j <= 4; j++) {
        if (getValue(i, j) === 0) {
            for (let k = j + 1; k <= 4; k++) {
                if (getValue(i, k) !== 0) {
                    setValue(i, j, getValue(i, k));
                    setValue(i, k, 0);
                    moved = true;
                    break;
                }
            }
        }
    }
    return moved;
}

function moveUp(j: number): boolean {
    let moved = false;
    for (let i = 1; i <= 4; i++) {
        if (getValue(i, j) === 0) {
            for (let k = i + 1; k <= 4; k++) {
                if (getValue(k, j) !== 0) {
                    setValue(i, j, getValue(k, j));
                    setValue(k, j, 0);
                    moved = true;
                    break;
                }
            }
        }
    }
    return moved;
}

function moveDown(j: number): boolean {
    let moved = false;
    for (let i = 4; i >= 1; i--) {
        if (getValue(i, j) === 0) {
            for (let k = i - 1; k >= 1; k--) {
                if (getValue(k, j) !== 0) {
                    setValue(i, j, getValue(k, j));
                    setValue(k, j, 0);
                    moved = true;
                    break;
                }
            }
        }
    }
    return moved;
}

function mergeRight(i: number): boolean {
    let merged = false;
    for (let j = 4; j > 1; j--) {
        if (getValue(i, j) === 0) {
            continue;
        }
        let k = j - 1;
        while (k >= 1 && getValue(i, k) === 0) {
            k--;
        }
        if (k >= 1 && getValue(i, j) === getValue(i, k)) {
            setValue(i, j, getValue(i, j) * 2);
            setValue(i, k, 0);
            merged = true;
        }
    }
    if (merged) {
        moveRight(i);
    }
    return merged;
}

function mergeLeft(i: number): boolean {
    let merged = false;
    for (let j = 1; j < 4; j++) {
        if (getValue(i, j) === 0) {
            continue;
        }
        let k = j + 1;
        while (k <= 4 && getValue(i, k) === 0) {
            k++;
        }
        if (k <= 4 && getValue(i, j) === getValue(i, k)) {
            setValue(i, j, getValue(i, j) * 2);
            setValue(i, k, 0);
            merged = true;
        }
    }
    if (merged) {
        moveLeft(i);
    }
    return merged;
}

function mergeUp(j: number): boolean {
    let merged = false;
    for (let i = 1; i < 4; i++) {
        if (getValue(i, j) === 0) {
            continue;
        }
        let k = i + 1;
        while (k <= 4 && getValue(k, j) === 0) {
            k++;
        }
        if (k <= 4 && getValue(i, j) === getValue(k, j)) {
            setValue(i, j, getValue(i, j) * 2);
            setValue(k, j, 0);
            merged = true;
        }
    }
    if (merged) {
        moveUp(j);
    }
    return merged;
}

function mergeDown(j: number): boolean {
    let merged = false;
    for (let i = 4; i > 1; i--) {
        if (getValue(i, j) === 0) {
            continue;
        }
        let k = i - 1;
        while (k >= 1 && getValue(k, j) === 0) {
            k--;
        }
        if (k >= 1 && getValue(i, j) === getValue(k, j)) {
            setValue(i, j, getValue(i, j) * 2);
            setValue(k, j, 0);
            merged = true;
        }
    }
    if (merged) {
        moveDown(j);
    }
    return merged;
}

function right(i:number): boolean{
    let moved = moveRight(i);
    let merged = mergeRight(i);
    return moved || merged;
}

function left(i:number): boolean{
    let moved = moveLeft(i);
    let merged = mergeLeft(i);
    return moved || merged;
}

function up(j:number): boolean{
    let moved = moveUp(j);
    let merged = mergeUp(j);
    return moved || merged;
}

function down(j:number): boolean{
    let moved = moveDown(j);
    let merged = mergeDown(j);
    return moved || merged;
}

function isGameOver(): boolean {
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 4; j++) {
            let value = getValue(i, j);
            console.log(`Value at ${i}, ${j}: ${value}`);
            if (value === 0) {
                console.log('Le jeu n est pas terminé car une cellule est vide');
                return false;
            }
            if (j < 4 && value === getValue(i, j + 1)) {
                console.log('Le jeu n est pas terminé car une cellule peut fusionner avec sa voisine de droite');
                return false;
            }
            // Check if the current cell can merge with the bottom neighbor
            if (i < 4 && value === getValue(i + 1, j)) {
                console.log('Le jeu n est pas terminé car une cellule peut fusionner avec sa voisine du bas');
                return false;
            }
        }
    }
    console.log('Game is over');
    return true;
}

function newCase(): void {
    if (isBoardFull()) {
        console.log('Le plateau est plein. Aucune nouvelle case ne peut être ajoutée.');
        return; 
    }

    let i, j;
    do {
        i = Math.ceil(Math.random() * 4);
        j = Math.ceil(Math.random() * 4);
    } while (!isEmpty(i, j));

    setValue(i, j, getRandomValue());
}


function isBoardFull(): boolean {
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 4; j++) {
            if (isEmpty(i, j)) {
                return false;
            }
        }
    }
    return true; 
}

//J'AI ENFIN REUSIIIIIIIIIIIIII