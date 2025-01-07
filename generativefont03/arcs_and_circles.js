import { useLineVersion, lineStyle, elementWidths, numPolygonPoints } from './alphabet.js';
import { drawDotted } from './lines.js';

export function drawCircle(c, cx, cy, radius) {
    if (useLineVersion) {
        if (lineStyle === 'dotted') {
            drawDottedArc(c, cx, cy, radius, 0, Math.PI);
            drawDottedArc(c, cx, cy, radius, Math.PI, 2 * Math.PI);
        } else {
            drawPolygonalArcShape(c, cx, cy, radius, 0, Math.PI, numPolygonPoints);
            drawPolygonalArcShape(c, cx, cy, radius, Math.PI, 2 * Math.PI, numPolygonPoints);
        }
    } else {
        drawShapeArc(c, cx, cy, radius, 0, Math.PI, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
        drawShapeArc(c, cx, cy, radius, Math.PI, 2 * Math.PI, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
    }
}

export function drawArc(c, cx, cy, radius, startAngle, endAngle) {
    if (useLineVersion) {
        if (lineStyle === 'dotted') {
            drawDottedArc(c, cx, cy, radius, startAngle, endAngle);
        } else {
            drawPolygonalArcShape(c, cx, cy, radius, startAngle, endAngle, numPolygonPoints);
        }
    } else {
        drawShapeArc(c, cx, cy, radius, startAngle, endAngle, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
    }
}

function drawDottedArc(c, cx, cy, radius, startAngle, endAngle) {
    const adjustedRadius = radius - elementWidths.arcStartWidth / 2;
    const pathData = getArcPathData(cx, cy, adjustedRadius, startAngle, endAngle);
    drawDotted(c, pathData);
}

export function getArcPathData(cx, cy, radius, startAngle, endAngle) {
    const startX = cx + radius * Math.cos(startAngle);
    const startY = cy + radius * Math.sin(startAngle);
    const endX = cx + radius * Math.cos(endAngle);
    const endY = cy + radius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
}

function drawShapeArc(c, cx, cy, radius, startAngle, endAngle, startWidth, endWidth) {
    const innerRadiusStart = radius - startWidth / 2;
    const outerRadiusStart = radius + startWidth / 2;
    const innerRadiusEnd = radius - endWidth / 2;
    const outerRadiusEnd = radius + endWidth / 2;

    const startInnerX = cx + innerRadiusStart * Math.cos(startAngle);
    const startInnerY = cy + innerRadiusStart * Math.sin(startAngle);
    const startOuterX = cx + outerRadiusStart * Math.cos(startAngle);
    const startOuterY = cy + outerRadiusStart * Math.sin(startAngle);
    const endInnerX = cx + innerRadiusEnd * Math.cos(endAngle);
    const endInnerY = cy + innerRadiusEnd * Math.sin(endAngle);
    const endOuterX = cx + outerRadiusEnd * Math.cos(endAngle);
    const endOuterY = cy + outerRadiusEnd * Math.sin(endAngle);

    let pathData = `M ${startInnerX} ${startInnerY}`;

    const points = 5 + Math.floor(Math.random() * 6); // 5 bis 10 Punkte
    for (let i = 1; i < points; i++) {
        const t = i / (points - 1);
        const angle = startAngle + t * (endAngle - startAngle);
        const x = cx + innerRadiusStart * Math.cos(angle);
        const y = cy + innerRadiusStart * Math.sin(angle);
        if (c.isCurve) {
            const controlX = x + (Math.random() - 0.5) * startWidth;
            const controlY = y + (Math.random() - 0.5) * startWidth;
            pathData += ` Q ${controlX} ${controlY} ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    }

    pathData += ` L ${endInnerX} ${endInnerY}`;

    for (let i = points - 1; i >= 0; i--) {
        const t = i / (points - 1);
        const angle = startAngle + t * (endAngle - startAngle);
        const x = cx + outerRadiusEnd * Math.cos(angle);
        const y = cy + outerRadiusEnd * Math.sin(angle);
        if (c.isCurve) {
            const controlX = x + (Math.random() - 0.5) * endWidth;
            const controlY = y + (Math.random() - 0.5) * endWidth;
            pathData += ` Q ${controlX} ${controlY} ${x} ${y}`;
        } else {
            pathData += ` L ${x} ${y}`;
        }
    }

    // Keine `Z` für das Schließen des Pfades
    // pathData += ` Z`; // Entfernt, damit der Pfad offen bleibt

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none"); // Kein Füllung für Shape-Arcs
    path.setAttribute("stroke", "black"); // Setze die Umrandungsfarbe
    path.setAttribute("stroke-width", "1");
    c.svg.appendChild(path);
}

function drawPolygonalArcShape(c, cx, cy, radius, startAngle, endAngle, numPolygonPoints) {
    if (isNaN(cx) || isNaN(cy) || isNaN(radius) || isNaN(startAngle) || isNaN(endAngle) || isNaN(numPolygonPoints)) {
        console.error("NaN detected in drawPolygonalArcShape parameters", { cx, cy, radius, startAngle, endAngle, numPolygonPoints });
        return;
    }

    const angleStep = (endAngle - startAngle) / (numPolygonPoints - 1);
    let pathD1 = "";

    for (let i = 0; i < numPolygonPoints; i++) {
        const angle = startAngle + i * angleStep;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) {
            pathD1 += `M ${x} ${y}`;
        } else {
            pathD1 += ` L ${x} ${y}`;
        }
    }

    // Keine `Z` für das Schließen des Pfades
    // pathD1 += ` Z`; // Entfernt, damit der Pfad offen bleibt

    const shapePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shapePath.setAttribute("d", pathD1);
    shapePath.setAttribute("fill", "none"); // Kein Füllung für Polygonal-Arcs
    shapePath.setAttribute("stroke", "black"); // Setze die Umrandungsfarbe
    shapePath.setAttribute("stroke-width", "1");
    c.svg.appendChild(shapePath);
}

function drawC(c) {
    const midX = c.width / 2;
    const radius = c.capHeight / 2;
    const centerY = c.baseline - radius;

    // Draw the arc from the baseline to the cap height
    c.drawArc(midX, centerY, radius, Math.PI / 2, 3 * Math.PI / 2);
}
