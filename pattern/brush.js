// Variablen für die Speicherung des Pinsels und des Gitters
let drawingPath = null;
let isDrawing = false;

// Holen des kleinen und großen SVGs
const smallCanvas = document.getElementById('smallCanvas');
const largeCanvas = document.getElementById('largeCanvas');
const drawingArea = document.getElementById('drawingArea');

// Gitter-Element für das Rechteckgitter
const rectangleGrid = document.getElementById('rectangleGrid');

// Rastergröße für das Rechteckgitter (Standardwert)
let gridSize = 20; // Abstand der Rasterlinien
let numRows = 10; // Standardanzahl der Zeilen
let numCols = 10; // Standardanzahl der Spalten

// Funktion, um auf dem kleinen Canvas zu zeichnen
smallCanvas.addEventListener('mousedown', startDrawing);
smallCanvas.addEventListener('mousemove', draw);
smallCanvas.addEventListener('mouseup', stopDrawing);

// Funktionen für das Zeichnen auf dem kleinen SVG
let pathElement;
function startDrawing(event) {
    isDrawing = true;
    const [x, y] = getMousePosition(event, smallCanvas);
    const snappedPosition = shouldSnapToGrid() ? snapToGrid(x, y) : [x, y]; // Bedingung zum Raster-Snap
    pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', `M${snappedPosition[0]},${snappedPosition[1]}`);
    pathElement.setAttribute('stroke', 'black');
    pathElement.setAttribute('stroke-width', '2');
    pathElement.setAttribute('fill', 'none');
    drawingArea.appendChild(pathElement);
}

function draw(event) {
    if (!isDrawing) return;
    const [x, y] = getMousePosition(event, smallCanvas);
    const snappedPosition = shouldSnapToGrid() ? snapToGrid(x, y) : [x, y]; // Bedingung zum Raster-Snap
    const pathData = pathElement.getAttribute('d') + ` L${snappedPosition[0]},${snappedPosition[1]}`;
    pathElement.setAttribute('d', pathData);
}

function stopDrawing() {
    isDrawing = false;
    drawingPath = pathElement.getAttribute('d'); // Speichern der gezeichneten Form
}

// Hilfsfunktion, um die Mausposition relativ zum SVG zu erhalten
function getMousePosition(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
}

// Funktion, um die Mausposition auf das Raster auszurichten
function snapToGrid(x, y) {
    const rectWidth = smallCanvas.width.baseVal.value;
    const rectHeight = smallCanvas.height.baseVal.value;

    const gridX = rectWidth / numCols;
    const gridY = rectHeight / numRows;

    const snappedX = Math.floor(x / gridX) * gridX;
    const snappedY = Math.floor(y / gridY) * gridY;
    return [snappedX, snappedY];
}

// Funktion, um zu überprüfen, ob das Raster aktiv ist
function shouldSnapToGrid() {
    return rectangleGrid.style.visibility === 'visible';
}

// Funktion, um das Rechteckgitter zu zeichnen
function drawRectangleGrid() {
    // Lösche das bestehende Gitter
    while (rectangleGrid.firstChild) {
        rectangleGrid.removeChild(rectangleGrid.firstChild);
    }

    // Berechne die Größe des Grids basierend auf der Anzahl der Zeilen und Spalten
    const width = smallCanvas.width.baseVal.value;
    const height = smallCanvas.height.baseVal.value;

    // Horizontale Linien
    for (let row = 0; row <= numRows; row++) {
        const y = (row * height) / numRows;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', y);
        line.setAttribute('x2', width);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#ccc');
        line.setAttribute('stroke-width', '1');
        rectangleGrid.appendChild(line);
    }

    // Vertikale Linien
    for (let col = 0; col <= numCols; col++) {
        const x = (col * width) / numCols;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', '0');
        line.setAttribute('x2', x);
        line.setAttribute('y2', height);
        line.setAttribute('stroke', '#ccc');
        line.setAttribute('stroke-width', '1');
        rectangleGrid.appendChild(line);
    }
}

// Funktionen zur Schablonenauswahl (Gitter ein/aus)
function toggleGrid(gridType) {
    if (gridType === 'rectangle') {
        const rectGridVisible = rectangleGrid.style.visibility === 'visible';
        rectangleGrid.style.visibility = rectGridVisible ? 'hidden' : 'visible';
        drawRectangleGrid(); // Gitter neu zeichnen
    }
}

// HTML-Button zum Ein- und Ausblenden des Rasters
document.getElementById('toggleGridBtn').addEventListener('click', () => {
    toggleGrid('rectangle');
});

// Event-Listener für die Eingabe von Zeilen und Spalten
document.getElementById('rowsInput').addEventListener('input', (event) => {
    numRows = parseInt(event.target.value, 10);
    drawRectangleGrid(); // Gitter neu zeichnen
});

document.getElementById('columnsInput').addEventListener('input', (event) => {
    numCols = parseInt(event.target.value, 10);
    drawRectangleGrid(); // Gitter neu zeichnen
});

// Beim Laden der Seite das Rechteckgitter zeichnen
window.onload = () => {
    rectangleGrid.style.visibility = 'hidden'; // Rechteckgitter ausgeblendet
    drawRectangleGrid(); // Rechteckgitter zeichnen
};

// Funktionen zum Zeichnen auf dem großen Canvas (mit dem gespeicherten Pinsel)
largeCanvas.addEventListener('mousedown', startLargeDrawing);
largeCanvas.addEventListener('mousemove', drawLarge);
largeCanvas.addEventListener('mouseup', stopLargeDrawing);

let isDrawingLarge = false;

// Start der Zeichnung auf dem großen Canvas
function startLargeDrawing(event) {
    if (!drawingPath) return; // Keine Form gespeichert
    isDrawingLarge = true;
    const [x, y] = getMousePosition(event, largeCanvas);
    drawRepeatedPattern(x, y);
}

// Zeichnen auf dem großen Canvas mit dem wiederholten Pinsel
function drawLarge(event) {
    if (!isDrawingLarge) return;
    const [x, y] = getMousePosition(event, largeCanvas);
    drawRepeatedPattern(x, y);
}

// Stoppen der Zeichnung auf dem großen Canvas
function stopLargeDrawing() {
    isDrawingLarge = false;
}

// Wiederholtes Zeichnen der gespeicherten Form
function drawRepeatedPattern(x, y) {
    const pathElementLarge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElementLarge.setAttribute('d', drawingPath);
    pathElementLarge.setAttribute('stroke', 'black');
    pathElementLarge.setAttribute('stroke-width', '2');
    pathElementLarge.setAttribute('fill', 'none');

    // Berechnung der Mausposition relativ zum SVG, ohne Offset
    const rect = largeCanvas.getBoundingClientRect();
    const svgX = x - rect.left;
    const svgY = y - rect.top;

    // Setze das transformieren des gezeichneten Musters basierend auf der Mausposition
    pathElementLarge.setAttribute('transform', `translate(${svgX - pathElementLarge.getBBox().width / 2}, ${svgY - pathElementLarge.getBBox().height / 2})`);

    largeCanvas.appendChild(pathElementLarge);
}

// Funktion zum Downloaden des großen SVGs
document.getElementById('downloadLargeSvgBtn').addEventListener('click', () => {
    const svgData = largeCanvas.outerHTML; // Holen des gesamten SVG-Inhalts des großen Canvas
    const blob = new Blob([svgData], { type: 'image/svg+xml' }); // Erstellen eines Blobs mit SVG-Daten
    const url = URL.createObjectURL(blob); // Erstellen einer URL für den Blob
    const a = document.createElement('a'); // Erstellen eines Links
    a.href = url;
    a.download = 'large-pattern.svg'; // Definieren des Dateinamens
    a.click(); // Klick auf den Link auslösen, um den Download zu starten
    URL.revokeObjectURL(url); // Aufräumen der URL
});

