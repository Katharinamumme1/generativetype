import { stammParameters, serifType, lineStyle, serifHeight } from './alphabet.js';

export function drawSerif(c, x, y, position, direction) {
    // Überprüfen, ob das Alphabet gepunktet ist
    if (lineStyle === 'dotted') {
        return;
    }

    const stammWidth = stammParameters.topWidth;
    const serifWidth = stammWidth * 1.5; // Breite der Serife
    const height = serifHeight; // Höhe der Serife

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let d;

    // Ganze Serife
    switch (serifType) {
        case 'rectangle':
            if (direction === 'down') {
                d = `M${x - serifWidth / 2} ${y} L${x + serifWidth / 2} ${y} L${x + serifWidth / 2} ${y - height} L${x - serifWidth / 2} ${y - height} Z`;
            } else if (direction === 'up') {
                d = `M${x - serifWidth / 2} ${y} L${x + serifWidth / 2} ${y} L${x + serifWidth / 2} ${y + height} L${x - serifWidth / 2} ${y + height} Z`;
            } else if (direction === 'left') {
                d = `M${x} ${y - serifWidth / 2} L${x} ${y + serifWidth / 2} L${x - height} ${y + serifWidth / 2} L${x - height} ${y - serifWidth / 2} Z`;
            } else if (direction === 'right') {
                d = `M${x} ${y - serifWidth / 2} L${x} ${y + serifWidth / 2} L${x + height} ${y + serifWidth / 2} L${x + height} ${y - serifWidth / 2} Z`;
            }
            break;
        case 'triangle':
            if (direction === 'up') {
                d = `M${x - serifWidth / 2} ${y} L${x} ${y - height} L${x + serifWidth / 2} ${y} Z`;
            } else if (direction === 'down') {
                d = `M${x - serifWidth / 2} ${y} L${x} ${y + height} L${x + serifWidth / 2} ${y} Z`;
            } else if (direction === 'left') {
                d = `M${x} ${y - serifWidth / 2} L${x - height} ${y} L${x} ${y + serifWidth / 2} Z`;
            } else if (direction === 'right') {
                d = `M${x} ${y - serifWidth / 2} L${x + height} ${y} L${x} ${y + serifWidth / 2} Z`;
            }
            break;
        case 'trapezoid':
            const trapezoidTopWidth = serifWidth * 0.7;
            if (direction === 'up') {
                d = `M${x - serifWidth / 2} ${y} L${x + serifWidth / 2} ${y} L${x + trapezoidTopWidth / 2} ${y - height} L${x - trapezoidTopWidth / 2} ${y - height} Z`;
            } else if (direction === 'down') {
                d = `M${x - serifWidth / 2} ${y} L${x + serifWidth / 2} ${y} L${x + trapezoidTopWidth / 2} ${y + height} L${x - trapezoidTopWidth / 2} ${y + height} Z`;
            } else if (direction === 'left') {
                d = `M${x} ${y - serifWidth / 2} L${x} ${y + serifWidth / 2} L${x - height} ${y + trapezoidTopWidth / 2} L${x - height} ${y - trapezoidTopWidth / 2} Z`;
            } else if (direction === 'right') {
                d = `M${x} ${y - serifWidth / 2} L${x} ${y + serifWidth / 2} L${x + height} ${y + trapezoidTopWidth / 2} L${x + height} ${y - trapezoidTopWidth / 2} Z`;
            }
            break;
    }

    path.setAttribute("d", d);
    path.setAttribute("fill", "black");
    c.svg.appendChild(path);
}
