
const svgCanvas = document.getElementById('customlinestyle_canvas');
const toggleGridButton = document.getElementById('toggle-grid');
const gridRowsInput = document.getElementById('grid-rows');
const gridColumnsInput = document.getElementById('grid-columns');
const gridTypeSelect = document.getElementById('grid-type');

let isGridVisible = false;
let isDrawing = false;
let currentPath = null;
let gridGroup = null;

// Erstelle ein Raster
function createGrid(rows, columns, type) {
    if (gridGroup) gridGroup.remove(); // Entferne das alte Grid, ohne den Rest des Inhalts zu löschen
    gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('id', 'grid-group');
    gridGroup.setAttribute('stroke', 'gray');
    gridGroup.setAttribute('stroke-width', '0.5');

    const cellWidth = svgCanvas.clientWidth / columns;
    const cellHeight = svgCanvas.clientHeight / rows;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const x = col * cellWidth;
            const y = row * cellHeight;

            if (type === 'rectangle') {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', cellWidth);
                rect.setAttribute('height', cellHeight);
                rect.setAttribute('fill', 'none');
                rect.setAttribute('stroke', 'gray');
                gridGroup.appendChild(rect);
            } else if (type === 'circle') {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x + cellWidth / 2);
                circle.setAttribute('cy', y + cellHeight / 2);
                circle.setAttribute('r', Math.min(cellWidth, cellHeight) / 2);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', 'gray');
                gridGroup.appendChild(circle);
            }
        }
    }

    svgCanvas.appendChild(gridGroup);
}

// Aktualisiere das Raster bei Änderungen
gridRowsInput.addEventListener('input', updateGrid);
gridColumnsInput.addEventListener('input', updateGrid);
gridTypeSelect.addEventListener('change', updateGrid);

function updateGrid() {
    if (isGridVisible) {
        const rows = parseInt(gridRowsInput.value, 10);
        const columns = parseInt(gridColumnsInput.value, 10);
        const type = gridTypeSelect.value;
        createGrid(rows, columns, type);
    }
}

// Raster anzeigen/verbergen
toggleGridButton.addEventListener('click', () => {
    isGridVisible = !isGridVisible;
    if (isGridVisible) {
        updateGrid();
    } else if (gridGroup) {
        gridGroup.remove();
    }
});

// Haftung an Rasterpunkten
svgCanvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    currentPath.setAttribute('stroke', 'black');
    currentPath.setAttribute('stroke-width', '2');
    currentPath.setAttribute('fill', 'none');

    const { offsetX, offsetY } = snapToGrid(event.offsetX, event.offsetY);
    currentPath.setAttribute('d', `M${offsetX},${offsetY}`);
    svgCanvas.appendChild(currentPath);
});

svgCanvas.addEventListener('mousemove', (event) => {
    if (!isDrawing || !currentPath) return;

    const { offsetX, offsetY } = snapToGrid(event.offsetX, event.offsetY);
    const d = currentPath.getAttribute('d');
    currentPath.setAttribute('d', `${d} L${offsetX},${offsetY}`);
});

svgCanvas.addEventListener('mouseup', () => {
    isDrawing = false;
    currentPath = null;
});

// Haftfunktion
function snapToGrid(x, y) {
    if (!isGridVisible || !gridGroup) return { offsetX: x, offsetY: y };

    const rows = parseInt(gridRowsInput.value, 10);
    const columns = parseInt(gridColumnsInput.value, 10);
    const type = gridTypeSelect.value;
    const cellWidth = svgCanvas.clientWidth / columns;
    const cellHeight = svgCanvas.clientHeight / rows;

    if (type === 'rectangle') {
        const snappedX = Math.round(x / cellWidth) * cellWidth;
        const snappedY = Math.round(y / cellHeight) * cellHeight;
        return { offsetX: snappedX, offsetY: snappedY };
    } else if (type === 'circle') {
        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);
        const centerX = col * cellWidth + cellWidth / 2;
        const centerY = row * cellHeight + cellHeight / 2;
        const angle = Math.atan2(y - centerY, x - centerX);
        const radius = Math.min(cellWidth, cellHeight) / 2;
        const snappedX = centerX + Math.cos(angle) * radius;
        const snappedY = centerY + Math.sin(angle) * radius;
        return { offsetX: snappedX, offsetY: snappedY };
    }
    return { offsetX: x, offsetY: y };
}

