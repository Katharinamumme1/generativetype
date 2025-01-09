import { useLineVersion, lineStyle, elementWidths, numPolygonPoints,topWidth } from './alphabet.js';
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
        if (Math.random() < 0.75) {
            drawRandomArc(c, cx, cy, radius, elementWidths.arcStartWidth, 0, Math.PI);
            drawRandomArc(c, cx, cy, radius, elementWidths.arcStartWidth, Math.PI, 2 * Math.PI);
        } else {
            drawShapeArc(c, cx, cy, radius, 0, Math.PI, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
            drawShapeArc(c, cx, cy, radius, Math.PI, 2 * Math.PI, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
        }
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
        if (Math.random() < 0.75) {
            drawRandomArc(c, cx, cy, radius, elementWidths.arcStartWidth, startAngle, endAngle);
        } else {
            drawShapeArc(c, cx, cy, radius, startAngle, endAngle, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
        }
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

    const points = 5 + Math.floor(Math.random() * 6);
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

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black");
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

    const shapePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shapePath.setAttribute("d", pathD1);
    shapePath.setAttribute("fill", "none");
    shapePath.setAttribute("stroke", "black");
    shapePath.setAttribute("stroke-width", "1");
    c.svg.appendChild(shapePath);
}

function drawRandomArc(c, cx, cy, radius, topWidth, startAngle = Math.PI / 2, endAngle = startAngle + Math.PI, smooth = false) {
    const createBezierCurve = (startX, startY, endX, endY, direction) => {
        const controlDistance = 100;
        const dx = endX - startX;
        const dy = endY - startY;

        const controlX1 = startX + dx * 0.3 + (Math.random() - 0.5) * controlDistance * direction;
        const controlY1 = startY + dy * 0.3 + (Math.random() - 0.5) * controlDistance * direction;
        const controlX2 = endX - dx * 0.3 + (Math.random() - 0.5) * controlDistance * direction;
        const controlY2 = endY - dy * 0.3 + (Math.random() - 0.5) * controlDistance * direction;

        return `C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    };

    const createSmoothCurve = (startX, startY, endX, endY) => {
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        return `Q ${midX} ${midY}, ${endX} ${endY}`;
    };

    const createCorner = (startX, startY, endX, endY) => `L ${endX} ${endY}`;

    // Start and end points for the outer edge, adjusted for topWidth
    const startXOuter = cx + (radius + topWidth / 2) * Math.cos(startAngle);
    const startYOuter = cy + (radius + topWidth / 2) * Math.sin(startAngle);
    const endXOuter = cx + (radius + topWidth / 2) * Math.cos(endAngle);
    const endYOuter = cy + (radius + topWidth / 2) * Math.sin(endAngle);

    // Start and end points for the inner edge
    const startXInner = cx + (radius - topWidth / 2) * Math.cos(startAngle);
    const startYInner = cy + (radius - topWidth / 2) * Math.sin(startAngle);
    const endXInner = cx + (radius - topWidth / 2) * Math.cos(endAngle);
    const endYInner = cy + (radius - topWidth / 2) * Math.sin(endAngle);

    let pathD = `M ${startXOuter} ${startYOuter}`;

    // Outer curves and corners
    const outerSegments = Math.floor(Math.random() * 6);
    let currentX = startXOuter;
    let currentY = startYOuter;
    let stepAngle = (endAngle - startAngle) / (outerSegments + 1);

    for (let i = 0; i < outerSegments; i++) {
        const angle = startAngle + stepAngle * (i + 1);
        const newX = cx + (radius + topWidth / 2) * Math.cos(angle);
        const newY = cy + (radius + topWidth / 2) * Math.sin(angle);

        if (smooth) {
            pathD += createSmoothCurve(currentX, currentY, newX, newY);
        } else if (Math.random() < 0.5) {
            pathD += createBezierCurve(currentX, currentY, newX, newY, 1);
        } else {
            pathD += createCorner(currentX, currentY, newX, newY);
        }

        currentX = newX;
        currentY = newY;
    }

    pathD += ` L ${endXOuter} ${endYOuter}`;
    pathD += ` L ${endXInner} ${endYInner}`;

    // Inner curves and corners
    let innerSegments = Math.floor(Math.random() * 6);
    if (innerSegments === 0) innerSegments = 1; // Ensure at least one segment

    currentX = endXInner;
    currentY = endYInner;
    stepAngle = (endAngle - startAngle) / (innerSegments + 1);

    for (let i = 0; i < innerSegments; i++) {
        const angle = endAngle - stepAngle * (i + 1);
        const newX = cx + (radius - topWidth / 2) * Math.cos(angle);
        const newY = cy + (radius - topWidth / 2) * Math.sin(angle);

        if (smooth) {
            pathD += createSmoothCurve(currentX, currentY, newX, newY);
        } else if (Math.random() < 0.5) {
            pathD += createBezierCurve(currentX, currentY, newX, newY, -1);
        } else {
            pathD += createCorner(currentX, currentY, newX, newY);
        }

        currentX = newX;
        currentY = newY;
    }

    pathD += ` L ${startXInner} ${startYInner}`;
    pathD += ` Z`;

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathD);
    pathElement.setAttribute("fill", "black");
    c.svg.appendChild(pathElement);

    return { outerSegments, innerSegments };
}
