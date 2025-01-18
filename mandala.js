// Mandala Canvas Setup
const mandalaCanvas = document.getElementById('mandala-canvas');
const mandalaSectionCountInput = document.getElementById('mandala-section-count');
const mandalaGridToggle = document.getElementById('mandala-grid-toggle');
const mandalaStrokeWidthInput = document.getElementById('mandala-stroke-width');
const mandalaColorPicker = document.getElementById('mandala-color-picker');

let sectionCount = parseInt(mandalaSectionCountInput.value);
let drawing = false;
let lastPoint = null;
let gridEnabled = false;
let strokeWidth = parseInt(mandalaStrokeWidthInput.value);
let strokeColor = mandalaColorPicker.value;

// Funktion zum Zeichnen des Mandalas
function drawMandala() {
    console.log('Drawing mandala...');
    mandalaCanvas.innerHTML = ''; // Clear previous drawing
    const centerX = mandalaCanvas.width.baseVal.value / 2;
    const centerY = mandalaCanvas.height.baseVal.value / 2;
    const radius = Math.min(centerX, centerY) * 0.9; // Radius der Symmetrie

    // Radiale Linien für Symmetrie
    for (let i = 0; i < sectionCount; i++) {
        const angle = (2 * Math.PI / sectionCount) * i;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', x1);
        line.setAttribute('y2', y1);
        line.setAttribute('stroke', 'black');
        line.setAttribute('stroke-width', 1);
        mandalaCanvas.appendChild(line);
    }

    // Hilfsgitter (falls aktiviert)
    if (gridEnabled) {
        drawGrid();
    }
}

// Funktion zum Zeichnen der Hilfslinien
function drawGrid() {
    console.log('Drawing grid...');
    const gridSize = 20;
    const width = mandalaCanvas.width.baseVal.value;
    const height = mandalaCanvas.height.baseVal.value;

    for (let i = 0; i <= width / gridSize; i++) {
        const x = i * gridSize;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', x);
        line.setAttribute('y2', height);
        line.setAttribute('class', 'mandala-grid-line');
        mandalaCanvas.appendChild(line);
    }

    for (let i = 0; i <= height / gridSize; i++) {
        const y = i * gridSize;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', y);
        line.setAttribute('x2', width);
        line.setAttribute('y2', y);
        line.setAttribute('class', 'mandala-grid-line');
        mandalaCanvas.appendChild(line);
    }
}

// Funktion zum Zeichnen einer Linie
function drawLine(x1, y1, x2, y2) {
    console.log('Drawing line:', x1, y1, x2, y2);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', strokeColor);
    line.setAttribute('stroke-width', strokeWidth);
    mandalaCanvas.appendChild(line);
}

// Funktion für das Spiegeln der gezeichneten Linien
function reflectAndDrawLine(x1, y1, x2, y2) {
    const centerX = mandalaCanvas.width.baseVal.value / 2;
    const centerY = mandalaCanvas.height.baseVal.value / 2;
    const angleStep = 2 * Math.PI / sectionCount;

    for (let i = 0; i < sectionCount; i++) {
        const angle = angleStep * i;
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        const rx1 = centerX + (x1 - centerX) * cosAngle - (y1 - centerY) * sinAngle;
        const ry1 = centerY + (x1 - centerX) * sinAngle + (y1 - centerY) * cosAngle;
        const rx2 = centerX + (x2 - centerX) * cosAngle - (y2 - centerY) * sinAngle;
        const ry2 = centerY + (x2 - centerX) * sinAngle + (y2 - centerY) * cosAngle;

        drawLine(rx1, ry1, rx2, ry2);
    }
}

// Event Listener für das Drücken der Maus
mandalaCanvas.addEventListener('mousedown', (e) => {
    console.log('Mouse down event triggered');
    drawing = true;
    const rect = mandalaCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPoint = { x, y };
});

// Event Listener für das Bewegen der Maus
mandalaCanvas.addEventListener('mousemove', (e) => {
    if (drawing && lastPoint) {
        const rect = mandalaCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (gridEnabled) {
            const gridSize = 20;
            const snapX = Math.round(x / gridSize) * gridSize;
            const snapY = Math.round(y / gridSize) * gridSize;
            reflectAndDrawLine(lastPoint.x, lastPoint.y, snapX, snapY);
            lastPoint = { x: snapX, y: snapY };
        } else {
            reflectAndDrawLine(lastPoint.x, lastPoint.y, x, y);
            lastPoint = { x, y };
        }
    }
});

// Event Listener für das Loslassen der Maus
mandalaCanvas.addEventListener('mouseup', () => {
    console.log('Mouse up event triggered');
    drawing = false;
    lastPoint = null;
});

// Event Listener für Änderungen an der Anzahl der Abschnitte
mandalaSectionCountInput.addEventListener('input', () => {
    sectionCount = parseInt(mandalaSectionCountInput.value);
    drawMandala();
});

// Event Listener für das Umschalten des Gitters
mandalaGridToggle.addEventListener('change', () => {
    gridEnabled = mandalaGridToggle.checked;
    drawMandala();
});

// Event Listener für die Strichstärke
mandalaStrokeWidthInput.addEventListener('input', () => {
    strokeWidth = parseInt(mandalaStrokeWidthInput.value);
});

// Event Listener für die Farbauswahl
mandalaColorPicker.addEventListener('input', () => {
    strokeColor = mandalaColorPicker.value;
});

// Initiales Zeichnen
drawMandala();
