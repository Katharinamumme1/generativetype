// stamm.js
import { useLineVersion, lineStyle, stammParameters } from './alphabet.js';
import { drawDotted } from './lines.js';

export function drawStamm(c, x1, y1, y2, reverse = false, flipHorizontal = false, isDiagonal = false, x2 = null) {
    if (useLineVersion) {
        drawLineStamm(c, x1, y1, y2, isDiagonal, x2);
    } else {
        const { numSegmentsLeftCurves, numSegmentsRightCurves, numSegmentsLeftCorners, numSegmentsRightCorners, isParallel, isCurved } = stammParameters;

        if (isCurved) { // Nutzen Sie isCurved hier
            drawCurvedStamm(c, x1, y1, y2, stammParameters.topWidth, stammParameters.bottomWidth, reverse, flipHorizontal, numSegmentsLeftCurves, numSegmentsRightCurves, isParallel, isDiagonal, x2);
        } else {
            drawRectStamm(c, x1, y1, y2, stammParameters.topWidth, stammParameters.bottomWidth, reverse, flipHorizontal, numSegmentsLeftCorners, numSegmentsRightCorners, isParallel, isDiagonal, x2);
        }
    }
}

export function drawLineStamm(c, x1, y1, y2, isDiagonal = false, x2 = null) {
    let pathData;
    if (isDiagonal && x2 !== null) {
        pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else {
        pathData = `M ${x1} ${y1} L ${x1} ${y2}`;
    }

    if (lineStyle === 'dotted') {
        drawDotted(c, pathData);
    } else {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("stroke", "black");
        path.setAttribute("stroke-width", 1);
        path.setAttribute("fill", "none");
        c.svg.appendChild(path);
    }
}

export function drawCurvedStamm(c, x1, y1, y2, topWidth, bottomWidth, reverse, flipHorizontal, numSegmentsLeft, numSegmentsRight, isParallel, isDiagonal = false, x2 = null) {
    if (reverse) {
        const temp = topWidth;
        topWidth = bottomWidth;
        bottomWidth = temp;
    }

    let leftXTop, rightXTop, leftXBottom, rightXBottom;

    if (isDiagonal && x2 !== null) {
        leftXTop = x1 - topWidth / 2;
        rightXTop = x1 + topWidth / 2;
        leftXBottom = x2 - bottomWidth / 2;
        rightXBottom = x2 + bottomWidth / 2;
    } else {
        leftXTop = x1 - topWidth / 2;
        rightXTop = x1 + topWidth / 2;
        leftXBottom = x1 - bottomWidth / 2;
        rightXBottom = x1 + bottomWidth / 2;
    }

    const createCurvedPath = (startX, startY, endX, endY, controlOffset) => {
        const controlX1 = startX + controlOffset * (Math.random() * 4 - 2);
        const controlY1 = startY + (endY - startY) / 2 + (Math.random() - 0.5) * 50;
        const controlX2 = endX - controlOffset * (Math.random() * 4 - 2);
        const controlY2 = controlY1;
        return `C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    };

    const controlOffset = Math.abs(leftXTop - rightXTop) / 2;

    let pathData = `M ${leftXTop} ${y1}`;

    // Left side curves
    let currentX = leftXTop;
    let currentY = y1;
    const segmentHeightLeft = (y2 - y1) / numSegmentsLeft;
    for (let i = 0; i < numSegmentsLeft; i++) {
        const nextY = currentY + segmentHeightLeft;
        pathData += ` ${createCurvedPath(currentX, currentY, leftXBottom, nextY, controlOffset)}`;
        currentY = nextY;
    }
    pathData += ` L ${leftXBottom} ${y2}`;

    // Bottom line
    pathData += ` L ${rightXBottom} ${y2}`;

    // Right side curves
    currentX = rightXBottom;
    currentY = y2;
    const segmentHeightRight = (y2 - y1) / numSegmentsRight;
    for (let i = 0; i < numSegmentsRight; i++) {
        const nextY = currentY - segmentHeightRight;
        if (isParallel) {
            pathData += ` ${createCurvedPath(currentX, currentY, rightXTop, nextY, controlOffset)}`;
        } else {
            pathData += ` ${createCurvedPath(currentX, currentY, rightXTop, nextY, -controlOffset)}`;
        }
        currentY = nextY;
    }

    pathData += ` L ${rightXTop} ${y1}`;
    pathData += ` Z`;

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathData);
    pathElement.setAttribute("fill", "black");
    c.svg.appendChild(pathElement);
}

export function drawRectStamm(c, x1, y1, y2, topWidth, bottomWidth, reverse, flipHorizontal, numSegmentsLeft, numSegmentsRight, isParallel, isDiagonal = false, x2 = null) {
    if (reverse) {
        const temp = topWidth;
        topWidth = bottomWidth;
        bottomWidth = temp;
    }

    let leftXTop, rightXTop, leftXBottom, rightXBottom;

    if (isDiagonal && x2 !== null) {
        leftXTop = x1 - topWidth / 2;
        rightXTop = x1 + topWidth / 2;
        leftXBottom = x2 - bottomWidth / 2;
        rightXBottom = x2 + bottomWidth / 2;
    } else {
        leftXTop = x1 - topWidth / 2;
        rightXTop = x1 + topWidth / 2;
        leftXBottom = x1 - bottomWidth / 2;
        rightXBottom = x1 + bottomWidth / 2;
    }

    const createPathSegment = (startX, startY, endX, endY) => {
        return `L ${endX} ${endY}`;
    };

    let pathData = `M ${leftXTop} ${y1}`;

    // Left side segments with larger random variations
    let currentY = y1;
    const segmentHeightLeft = (y2 - y1) / numSegmentsLeft;
    for (let i = 0; i < numSegmentsLeft; i++) {
        const nextY = currentY + segmentHeightLeft;
        const offsetX = (Math.random() - 0.5) * 30;
        pathData += ` ${createPathSegment(leftXTop + offsetX, currentY, leftXTop + offsetX, nextY)}`;
        currentY = nextY;
    }
    pathData += ` L ${leftXBottom} ${y2}`;

    // Bottom line
    pathData += ` L ${rightXBottom} ${y2}`;

    // Right side segments with larger random variations
    currentY = y2;
    const segmentHeightRight = (y2 - y1) / numSegmentsRight;
    for (let i = 0; i < numSegmentsRight; i++) {
        const nextY = currentY - segmentHeightRight;
        const offsetX = (Math.random() - 0.5) * 30;
        if (isParallel) {
            pathData += ` ${createPathSegment(rightXBottom + offsetX, currentY, rightXBottom + offsetX, nextY)}`;
        } else {
            pathData += ` ${createPathSegment(rightXBottom + offsetX, currentY, rightXBottom - (rightXBottom - rightXTop) / numSegmentsRight + offsetX, nextY)}`;
        }
        currentY = nextY;
    }

    pathData += ` L ${rightXTop} ${y1}`;
    pathData += ` Z`;

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathData);
    pathElement.setAttribute("fill", "black");
    c.svg.appendChild(pathElement);
}
