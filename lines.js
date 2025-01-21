// lines.js
import { useLineVersion, lineStyle, dotSize, dotSpacing, isIrregularDotted, rectangleSize, rectangleSpacing, elementWidths } from './alphabet.js';

const customCanvas = document.getElementById('customlinestyle_canvas');

export function drawLine(c, x1, y1, x2, y2, width = 1) {
    const pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
    if (useLineVersion) {
        if (lineStyle === 'dotted') {
            drawDotted(c, pathData);
        } else if (lineStyle === 'rectangles') {
            drawRectangles(c, pathData);
        } else if (lineStyle === 'custom') {
            drawCustom(c, pathData);
        } else {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            path.setAttribute("stroke", "black");
            path.setAttribute("stroke-width", width);
            path.setAttribute("fill", "none");
            c.svg.appendChild(path);
        }
    } else {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const dx = Math.sin(angle);
        const dy = -Math.cos(angle);
        const startWidth = elementWidths.lineStartWidth;
        const endWidth = elementWidths.lineEndWidth;

        const d = `M ${x1 - dx * startWidth / 2} ${y1 - dy * startWidth / 2}
                   L ${x1 + dx * startWidth / 2} ${y1 + dy * startWidth / 2}
                   L ${x2 + dx * endWidth / 2} ${y2 + dy * endWidth / 2}
                   L ${x2 - dx * endWidth / 2} ${y2 - dy * endWidth / 2} Z`;

        path.setAttribute("d", d);
        path.setAttribute("fill", "black");
        c.svg.appendChild(path);
    }
}

export function drawDotted(c, pathData) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    const totalLength = path.getTotalLength();
    const numDots = Math.floor(totalLength / dotSpacing);

    for (let i = 0; i < numDots; i++) {
        const point = path.getPointAtLength((i / numDots) * totalLength);
        const dotSizeLocal = isIrregularDotted ? 2 + Math.random() * 28 : dotSize;

        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", point.x);
        dot.setAttribute("cy", point.y);
        dot.setAttribute("r", dotSizeLocal / 2);
        dot.setAttribute("fill", "black");
        c.svg.appendChild(dot);
    }
}

export function drawRectangles(c, pathData) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    const totalLength = path.getTotalLength();
    const numRects = Math.floor(totalLength / rectangleSpacing);

    for (let i = 0; i < numRects; i++) {
        const point = path.getPointAtLength((i / numRects) * totalLength);
        const rectWidth = isIrregularDotted ? 4 + Math.random() * rectangleSize : rectangleSize;
        const rectHeight = isIrregularDotted ? 4 + Math.random() * rectangleSize : rectangleSize;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", point.x - rectWidth / 2);
        rect.setAttribute("y", point.y - rectHeight / 2);
        rect.setAttribute("width", rectWidth);
        rect.setAttribute("height", rectHeight);
        rect.setAttribute("fill", "black");
        c.svg.appendChild(rect);
    }
}

export function drawCustom(c, pathData) {
    const customCanvas = document.getElementById('customlinestyle_canvas');
    if (!customCanvas) return;

    // Prüfe, ob gezeichnete Elemente vorhanden sind
    const customElements = customCanvas.querySelectorAll('path, rect, circle, line, polyline, polygon');
    if (customElements.length === 0) return;

    // Erstelle einen Pfad aus den übergebenen Daten
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    const totalLength = path.getTotalLength();
    const numSegments = Math.floor(totalLength / rectangleSpacing);

    for (let i = 0; i < numSegments; i++) {
        // Punkt auf dem Pfad bestimmen
        const point = path.getPointAtLength((i / numSegments) * totalLength);

        customElements.forEach(customElement => {
            const clone = customElement.cloneNode(true);
            const bbox = customElement.getBBox(); // BBox für die Größe des Elements

            // Zentriere das Element um den Punkt auf dem Pfad
            const offsetX = bbox.x + bbox.width / 2;
            const offsetY = bbox.y + bbox.height / 2;

            // Setze die Transformation des geklonten Elements
            clone.setAttribute(
                "transform",
                `translate(${point.x - offsetX}, ${point.y - offsetY})`
            );

            c.svg.appendChild(clone);
        });
    }
}


