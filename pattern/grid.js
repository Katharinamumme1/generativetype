const gridCanvas = document.getElementById('gridCanvas');
const colorPicker = document.getElementById('colorPicker');
const shapeSelect = document.getElementById('shapeSelect');
const cellSizeInput = document.getElementById('cellSize');
const sizeRange = document.getElementById('sizeRange');
const spacingInput = document.getElementById('spacing');

// Parameter für das Gitter
let shape = 'rectangle';
let cellSize = parseInt(cellSizeInput.value);
let spacing = parseInt(spacingInput.value);
let sizeMode = 'equal'; // Optionen: 'equal' oder 'random'

// Funktion zum Zeichnen des Gitters
function drawGrid() {
    gridCanvas.innerHTML = ''; // Gitter zurücksetzen

    const width = gridCanvas.width.baseVal.value;
    const height = gridCanvas.height.baseVal.value;

    const rows = Math.ceil(height / (cellSize + spacing));
    const cols = Math.ceil(width / (cellSize + spacing));

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let currentCellSize = cellSize;

            if (sizeMode === 'random') {
                currentCellSize = getRandomSize();
            }

            const x = col * (currentCellSize + spacing);
            const y = row * (currentCellSize + spacing);

            let shapeElement;

            switch (shape) {
                case 'rectangle':
                    shapeElement = createRectangle(x, y, currentCellSize);
                    break;
                case 'triangle':
                    shapeElement = createTriangle(x, y, currentCellSize);
                    break;
                case 'pentagon':
                    shapeElement = createPentagon(x, y, currentCellSize);
                    break;
                case 'hexagon':
                    shapeElement = createHexagon(x, y, currentCellSize);
                    break;
                case 'circle':
                    shapeElement = createCircle(x, y, currentCellSize);
                    break;
            }

            shapeElement.addEventListener('click', () => fillShape(shapeElement));
            gridCanvas.appendChild(shapeElement);
        }
    }
}

// Funktion zur zufälligen Zellgröße
function getRandomSize() {
    const minSize = 30;
    const maxSize = parseInt(sizeRange.value);
    return Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
}

// Rechteck erstellen
function createRectangle(x, y, size) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', size);
    rect.setAttribute('height', size);
    rect.setAttribute('stroke', 'black');
    rect.setAttribute('fill', 'white');
    return rect;
}

// Dreieck erstellen
function createTriangle(x, y, size) {
    const points = `${x},${y} ${x + size / 2},${y + size} ${x + size},${y}`;
    const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    triangle.setAttribute('points', points);
    triangle.setAttribute('stroke', 'black');
    triangle.setAttribute('fill', 'white');
    return triangle;
}

// Fünfeck erstellen
function createPentagon(x, y, size) {
    const points = `${x + size / 2},${y} ${x + size},${y + size / 3} ${x + size * 0.8},${y + size} ${x + size / 5},${y + size} ${x},${y + size / 3}`;
    const pentagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    pentagon.setAttribute('points', points);
    pentagon.setAttribute('stroke', 'black');
    pentagon.setAttribute('fill', 'white');
    return pentagon;
}

// Sechseck erstellen
function createHexagon(x, y, size) {
    const points = `${x + size / 2},${y} ${x + size},${y + size / 3} ${x + size},${y + size * 2 / 3} ${x + size / 2},${y + size} ${x},${y + size * 2 / 3} ${x},${y + size / 3}`;
    const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hexagon.setAttribute('points', points);
    hexagon.setAttribute('stroke', 'black');
    hexagon.setAttribute('fill', 'white');
    return hexagon;
}

// Kreis erstellen
function createCircle(x, y, size) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x + size / 2);
    circle.setAttribute('cy', y + size / 2);
    circle.setAttribute('r', size / 2);
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('fill', 'white');
    return circle;
}

// Funktion zum Füllen einer Form
function fillShape(shape) {
    shape.setAttribute('fill', colorPicker.value);
}

// Event-Listener
shapeSelect.addEventListener('change', (event) => {
    shape = event.target.value;
    drawGrid();
});

cellSizeInput.addEventListener('input', (event) => {
    cellSize = parseInt(event.target.value);
    drawGrid();
});

spacingInput.addEventListener('input', (event) => {
    spacing = parseInt(event.target.value);
    drawGrid();
});

sizeRange.addEventListener('input', () => {
    drawGrid();
});

// Initialisiere das Gitter
drawGrid();
