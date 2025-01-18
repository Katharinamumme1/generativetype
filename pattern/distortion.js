const svg = document.getElementById('distortlines_canvas');
const layoutInput = document.getElementById('layout');
const lineCountInput = document.getElementById('lineCount');
const amplitudeInput = document.getElementById('amplitude');
const brushStrengthInput = document.getElementById('brushStrength');
const lineWidthInput = document.getElementById('lineWidth');
const lineColorInput = document.getElementById('lineColor');
const distortionTypeInput = document.getElementById('distortionType');
const lineCountValue = document.getElementById('lineCountValue');
const amplitudeValue = document.getElementById('amplitudeValue');
const brushStrengthValue = document.getElementById('brushStrengthValue');
const lineWidthValue = document.getElementById('lineWidthValue');

let isDrawing = false;
let lines = [];
let lineWidth = parseInt(lineWidthInput.value, 10);
let lineColor = lineColorInput.value;

// Generiere Linien basierend auf dem Layout
function generateLines(layout, lineCount, amplitude) {
  svg.innerHTML = ''; // Bestehendes SVG löschen
  lines = [];

  const spacing = svg.clientHeight / lineCount;

  if (layout === 'horizontal' || layout === 'grid') {
    // Horizontale Linien
    for (let i = 0; i < lineCount; i++) {
      const y = i * spacing;
      const line = {
        y,
        points: [],
      };
      for (let x = 0; x <= svg.clientWidth; x += 10) {
        const waveY = y + Math.sin((x / 100) * Math.PI * 2) * amplitude;
        line.points.push({ x, y: waveY });
      }
      lines.push(line);
      drawSmoothLine(line);
    }
  }

  if (layout === 'vertical' || layout === 'grid') {
    // Vertikale Linien
    for (let i = 0; i < lineCount; i++) {
      const x = i * spacing;
      const line = {
        x,
        points: [],
      };
      for (let y = 0; y <= svg.clientHeight; y += 10) {
        const waveX = x + Math.sin((y / 100) * Math.PI * 2) * amplitude;
        line.points.push({ x: waveX, y });
      }
      lines.push(line);
      drawSmoothLine(line);
    }
  }
}

// Zeichnet eine geschwungene Linie (Smooth Path) ins SVG
function drawSmoothLine(line) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const points = line.points;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 2; i++) {
    const ctrlPointX = (points[i].x + points[i + 1].x) / 2;
    const ctrlPointY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y} ${ctrlPointX} ${ctrlPointY}`;
  }
  d += ` T ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  path.setAttribute('d', d);

  path.setAttribute('stroke', lineColor); // Setze die Farbe
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', lineWidth); // Setze die Breite
  svg.appendChild(path);
}

// Verzerrung durch Benutzerinteraktion
svg.addEventListener('mousedown', () => (isDrawing = true));
svg.addEventListener('mouseup', () => (isDrawing = false));
svg.addEventListener('mouseleave', () => (isDrawing = false));
svg.addEventListener('mousemove', (event) => {
  if (!isDrawing) return;

  const { offsetX, offsetY } = event;
  const brushStrength = parseInt(brushStrengthInput.value, 10);
  const distortionType = distortionTypeInput.value;

  lines.forEach((line) => {
    line.points.forEach((point) => {
      const distance = Math.hypot(point.x - offsetX, point.y - offsetY);
      if (distance < brushStrength) {
        const influence = (brushStrength - distance) / brushStrength;

        if (distortionType === 'vertical') {
          point.y += influence * 30 * (offsetY < line.y ? -1 : 1);
        } else if (distortionType === 'horizontal') {
          point.x += influence * 30 * (offsetX < point.x ? -1 : 1);
        } else if (distortionType === 'radial') {
          const angle = Math.atan2(point.y - offsetY, point.x - offsetX);
          point.x += Math.cos(angle) * influence * 20;
          point.y += Math.sin(angle) * influence * 20;
        } else if (distortionType === 'chaotic') {
          point.x += (Math.random() - 0.5) * influence * 20;
          point.y += (Math.random() - 0.5) * influence * 20;
        } else if (distortionType === 'wave') {
          point.y += Math.sin((point.x / 20) + offsetX / 50) * influence * 20;
        } else if (distortionType === 'vortex') {
          const angle = Math.atan2(point.y - offsetY, point.x - offsetX);
          point.x += Math.sin(angle) * influence * 10;
          point.y += Math.cos(angle) * influence * 10;
        } else if (distortionType === 'shear') {
          point.x += influence * 30;
        } else if (distortionType === 'gravity') {
          point.y += influence * 20;
        } else if (distortionType === 'collision') {
          point.y += Math.sin(distance / 10) * influence * 10;
        } else if (distortionType === 'elastic') {
          point.y = line.y + (point.y - line.y) * 0.9;
        } else if (distortionType === 'magnetic') {
          point.x += (offsetX - point.x) * influence * 0.1;
          point.y += (offsetY - point.y) * influence * 0.1;
        } else if (distortionType === 'bulge') {
          const bulgeEffect = Math.exp(-distance / brushStrength) * influence * 50;
          point.y -= bulgeEffect;
        } else if (distortionType === 'sharp') {
          if (distance < brushStrength / 2) {
            point.y += influence * 30;
          }
        }
      }
    });
  });

  updateCanvas();
});

// Aktualisiert das Canvas
function updateCanvas() {
  svg.innerHTML = '';
  lines.forEach(drawSmoothLine);
}

// Event-Listener
layoutInput.addEventListener('input', () => {
  const layout = layoutInput.value;
  generateLines(layout, parseInt(lineCountInput.value, 10), parseInt(amplitudeInput.value, 10));
});

lineCountInput.addEventListener('input', () => {
  lineCountValue.textContent = lineCountInput.value;
  generateLines(layoutInput.value, parseInt(lineCountInput.value, 10), parseInt(amplitudeInput.value, 10));
});

amplitudeInput.addEventListener('input', () => {
  amplitudeValue.textContent = amplitudeInput.value;
  generateLines(layoutInput.value, parseInt(lineCountInput.value, 10), parseInt(amplitudeInput.value, 10));
});

brushStrengthInput.addEventListener('input', () => {
  brushStrengthValue.textContent = brushStrengthInput.value;
});

lineWidthInput.addEventListener('input', () => {
  lineWidthValue.textContent = lineWidthInput.value;
  lineWidth = parseInt(lineWidthInput.value, 10);
  updateCanvas();
});

lineColorInput.addEventListener('input', () => {
  lineColor = lineColorInput.value;
  updateCanvas();
});

// Initialisiere Linien
generateLines(layoutInput.value, parseInt(lineCountInput.value, 10), parseInt(amplitudeInput.value, 10));
