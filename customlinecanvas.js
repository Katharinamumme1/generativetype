const svgCanvas = document.getElementById('customlinestyle_canvas');

// Canvas-Größe festlegen
const maxWidth = 200; // Maximale Breite
svgCanvas.setAttribute('width', maxWidth);
svgCanvas.setAttribute('height', maxWidth);
svgCanvas.style.width = `${maxWidth}px`;
svgCanvas.style.height = `${maxWidth}px`;
svgCanvas.style.border = '2px solid black'; // Sichtbare Umrandung

// Zeichenlogik bleibt gleich
let isDrawing = false;
let currentPath = null;

svgCanvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    currentPath.setAttribute('stroke', 'black');
    currentPath.setAttribute('stroke-width', '2');
    currentPath.setAttribute('fill', 'none');

    const { offsetX, offsetY } = event;
    currentPath.setAttribute('d', `M${offsetX},${offsetY}`);
    svgCanvas.appendChild(currentPath);
});

svgCanvas.addEventListener('mousemove', (event) => {
    if (!isDrawing || !currentPath) return;

    const { offsetX, offsetY } = event;
    const d = currentPath.getAttribute('d');
    currentPath.setAttribute('d', `${d} L${offsetX},${offsetY}`);
});

svgCanvas.addEventListener('mouseup', () => {
    isDrawing = false;
    currentPath = null;
});

svgCanvas.addEventListener('mouseleave', () => {
    isDrawing = false;
    currentPath = null;
});
