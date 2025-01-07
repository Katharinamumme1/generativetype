// lines.js
import { useLineVersion, lineStyle, dotSize, dotSpacing, isIrregularDotted, elementWidths } from './alphabet.js';

export function drawLine(c, x1, y1, x2, y2, width = 1) {
    const pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
    if (useLineVersion) {
        if (lineStyle === 'dotted') {
            drawDotted(c, pathData);
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
