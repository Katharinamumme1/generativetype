// Funktion zum Zeichnen der Lissajous-Kurve
function drawLissajous() {
    const svg = document.getElementById('lissajousSVG');
    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');

    // Parameter aus den Eingabefeldern
    const freqX = parseFloat(document.getElementById('freqX').value);
    const freqY = parseFloat(document.getElementById('freqY').value);
    const ampX = parseFloat(document.getElementById('ampX').value);
    const ampY = parseFloat(document.getElementById('ampY').value);
    const phaseX = parseFloat(document.getElementById('phaseX').value);
    const phaseY = parseFloat(document.getElementById('phaseY').value);

    // Clear previous content
    svg.innerHTML = '';

    // Berechnung der Punkte der Lissajous-Kurve
    const points = [];
    for (let t = 0; t <= 2 * Math.PI; t += 0.01) {
        const x = ampX * Math.sin(freqX * t + phaseX);
        const y = ampY * Math.sin(freqY * t + phaseY);
        points.push({ x: x + width / 2, y: y + height / 2 });
    }

    // Erstelle ein "path" Element für die Lissajous-Kurve
    const pathData = points.map(p => `${p.x},${p.y}`).join(' ');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' '));
    path.setAttribute('fill', 'transparent');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '0.2');
    
    svg.appendChild(path);
}

// Event Listener für die Slider, damit die Eingabewerte live angepasst werden
document.getElementById('freqX').addEventListener('input', function() {
    document.getElementById('freqXValue').textContent = this.value;
    drawLissajous();
});

document.getElementById('freqY').addEventListener('input', function() {
    document.getElementById('freqYValue').textContent = this.value;
    drawLissajous();
});

document.getElementById('ampX').addEventListener('input', function() {
    document.getElementById('ampXValue').textContent = this.value;
    drawLissajous();
});

document.getElementById('ampY').addEventListener('input', function() {
    document.getElementById('ampYValue').textContent = this.value;
    drawLissajous();
});

document.getElementById('phaseX').addEventListener('input', function() {
    document.getElementById('phaseXValue').textContent = this.value;
    drawLissajous();
});

document.getElementById('phaseY').addEventListener('input', function() {
    document.getElementById('phaseYValue').textContent = this.value;
    drawLissajous();
});

// Initialer Aufruf, um das Muster beim Laden der Seite zu erzeugen
drawLissajous();
