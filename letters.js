import { stammParameters, elementWidths, useLineVersion, horizontalLineY, middleLineLength, lineStyle, numPolygonPoints, style } from './alphabet.js';
import { drawLine } from './lines.js';
import { drawCircle, drawArc } from './arcs_and_circles.js';
import { drawStamm } from './stamm.js';
import { drawSerif } from './serif.js';



const FIXED_WIDTH = 350;
 // Set a fixed width for all letters

export function drawLetter(svg, letter, width, baseline, capHeight, ascenderHeight, descenderHeight, xHeight, style, color) {
    const c = {
        svg,
        width: FIXED_WIDTH, // Use the fixed width
        baseline,
        capHeight,
        ascenderHeight,
        descenderHeight,
        xHeight,
        topWidth: stammParameters.topWidth,
        bottomWidth: stammParameters.bottomWidth,
        shapeType: stammParameters.shapeType,
        numSegmentsLeft: stammParameters.numSegmentsLeft,
        numSegmentsRight: stammParameters.numSegmentsRight,
        isParallel: stammParameters.isParallel,
        drawStamm: (x, y1, y2, reverse = false, flipHorizontal = false, isDiagonal = false, x2 = null) => drawStamm(c, x, y1, y2, reverse, flipHorizontal, isDiagonal, x2),
        drawLine: (x1, y1, x2, y2, width) => drawLine(c, x1, y1, x2, y2, width),
        drawCircle: (cx, cy, radius) => drawCircle(c, cx, cy, radius),
        drawArc: (cx, cy, radius, startAngle, endAngle) => drawArc(c, cx, cy, radius, startAngle, endAngle)
    };

    // Clear previous letter contents
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    // Calculate the dynamic height based on the letter's vertical extents
    const dynamicHeight = Math.max(ascenderHeight + descenderHeight, xHeight);
    svg.setAttribute('viewBox', `-${FIXED_WIDTH /300} -${descenderHeight} ${FIXED_WIDTH} ${dynamicHeight}`);
    
    // Center the content horizontally
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("transform", `translate(0, ${dynamicHeight / -1})`);
    svg.appendChild(group);
    c.svg = group; // Update reference to use the group for drawing
    


    
    if (drawFunctions[letter]) {
        drawFunctions[letter](c);
        if (style && style !== 'keinstyle') {
            applyStyle(svg, style); // Stil anwenden, wenn nicht 'keinstyle'
        }
        applyColorToElements(svg, color); // Farbe anwenden
    } else {
        console.error(`Unknown letter: ${letter}`);
    }
}

// Initialfarben
let primaryColor = "#ffffff"; 
let secondaryColor = "#000000"; 
let outlineOnly = false; // Status für Outline-Mode

// Event-Listener für Farbänderungen und Aktionen
document.getElementById("primary-color").addEventListener("input", (event) => {
    primaryColor = event.target.value;
    applyColors();
});

document.getElementById("secondary-color").addEventListener("input", (event) => {
    secondaryColor = event.target.value;
    applyColors();
});

document.getElementById("swap-colors").addEventListener("click", () => {
    [primaryColor, secondaryColor] = [secondaryColor, primaryColor];
    applyColors();

    // Farbwerte in den Inputs aktualisieren
    document.getElementById("primary-color").value = primaryColor;
    document.getElementById("secondary-color").value = secondaryColor;
});

document.getElementById("toggle-outline").addEventListener("click", () => {
    outlineOnly = !outlineOnly; // Status umschalten
    applyColors();
});

// Funktion: Farben anwenden
function applyColors() {
    // Farben auf CSS-Variablen anwenden
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);

    // SVG-Farben aktualisieren
    const svgs = document.querySelectorAll('svg'); // Alle SVGs auf der Seite finden
    svgs.forEach(svg => applyColorToElements(svg)); // Auf jedes SVG anwenden
}

// Funktion: Farben auf Elemente eines SVGs anwenden
function applyColorToElements(svg) {
    svg.querySelectorAll('*').forEach(element => {
        if (['path', 'circle', 'rect'].includes(element.tagName)) {
            if (outlineOnly) {
                // Nur Outline: Füllung entfernen, Sekundärfarbe als Stroke
                element.setAttribute('fill', 'none');
                element.setAttribute('stroke', secondaryColor);
            } else {
                // Gefüllt: Füllung mit Primärfarbe, Stroke mit Sekundärfarbe
                element.setAttribute('fill', secondaryColor);
                element.setAttribute('stroke', secondaryColor);
            }
        }
    });
}

// Farben initial anwenden
applyColors();





export const drawFunctions = {
    'A': drawA, 'B': drawB, 'C': drawC, 'D': drawD, 'E': drawE, 'F': drawF, 'G': drawG, 'H': drawH, 'I': drawI, 'J': drawJ,
    'K': drawK, 'L': drawL, 'M': drawM, 'N': drawN, 'O': drawO, 'P': drawP, 'Q': drawQ, 'R': drawR, 'S': drawS, 'T': drawT,
    'U': drawU, 'V': drawV, 'W': drawW, 'X': drawX, 'Y': drawY, 'Z': drawZ, 'a': drawLowerA, 'b': drawLowerB, 'c': drawLowerC,
    'd': drawLowerD, 'e': drawLowerE, 'f': drawLowerF, 'g': drawLowerG, 'h': drawLowerH, 'i': drawLowerI, 'j': drawLowerJ,
    'k': drawLowerK, 'l': drawLowerL, 'm': drawLowerM, 'n': drawLowerN, 'o': drawLowerO, 'p': drawLowerP, 'q': drawLowerQ,
    'r': drawLowerR, 's': drawLowerS, 't': drawLowerT, 'u': drawLowerU, 'v': drawLowerV, 'w': drawLowerW, 'x': drawLowerX,
    'y': drawLowerY, 'z': drawLowerZ
};

function applyStyle(svg, style) {
    if (style === 'outline') {
        convertToOutline(svg);
    } else if (style === 'hatched') {
        applyHatching(svg);
    }
}

function convertToOutline(svg) {
    const paths = svg.querySelectorAll('path, circle, rect, line, polygon');
    paths.forEach(path => {
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
    });
}

function applyHatching(svg) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    pattern.setAttribute("id", "hatchPattern");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", 10);
    pattern.setAttribute("height", 10);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", 10);
    line.setAttribute("y2", 10);
    line.setAttribute("stroke", "black");

    pattern.appendChild(line);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    const paths = svg.querySelectorAll('path, circle, rect, polygon');
    paths.forEach(path => {
        path.setAttribute('fill', 'url(#hatchPattern)');
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', '1');
    });
}



export function drawA(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;
    const leftX = midX - c.width * 0.2;
    const rightX = midX + c.width * 0.2;
    const topRadius = (rightX - leftX) / 2;
    const arcCenterX = midX;
    const arcCenterY = topY + topRadius;

    // Zufällige Auswahl der Form
    const formType = Math.random() < 0.5 ? 'arcVersion' : 'diagonalStems';

    if (formType === 'arcVersion') {
        // Draw the left and right stems from bottom to top
        c.drawStamm(leftX, arcCenterY, bottomY);
        c.drawStamm(rightX, arcCenterY, bottomY);
        // Draw the top arc (always upwards)
        c.drawArc(arcCenterX, arcCenterY, topRadius, Math.PI, 2 * Math.PI);

        // Draw the horizontal connecting line
        const horizontalY = topY + (bottomY - topY) * 0.5;
        c.drawLine(leftX + stammParameters.topWidth / 2, horizontalY, rightX - stammParameters.topWidth / 2, horizontalY, stammParameters.bottomWidth);
    } else {
        // Formversion mit zwei diagonalen Stämmen, die sich in der Mitte treffen
        const middleX = midX;
        const middleY = bottomY - c.capHeight / 2;

        // Draw the left diagonal stem from bottom to top
        c.drawStamm(leftX, bottomY, topY, false, false, true, middleX);

        // Draw the right diagonal stem from bottom to top
        c.drawStamm(rightX, bottomY, topY, false, false, true, middleX);

        // Draw the horizontal connecting line
        const horizontalY = middleY;
        c.drawLine(leftX, horizontalY, rightX, horizontalY, stammParameters.bottomWidth);
    }

    // Add serifs at the bottom
    drawSerif(c, leftX, bottomY, 'bottom', 'up');
    drawSerif(c, rightX, bottomY, 'bottom', 'up');
}












function drawB(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const middleY = topY + (c.capHeight / 2);
    const bottomY = c.baseline;

    // Adjust the rightX for the width of the stem
    const rightX = midX + (useLineVersion ? c.width * 0.1 : stammParameters.topWidth / 2);

    // Draw the stem
    c.drawStamm(rightX, topY, bottomY);

    // Add serifs at the top and bottom
    drawSerif(c, rightX, topY, 'top', 'down');
    drawSerif(c, rightX, bottomY, 'bottom', 'up');

    // Arc parameters
    const radius1 = (middleY - topY) / 2;
    const radius2 = (bottomY - middleY) / 2;

    const arcCenterY1 = topY + radius1;
    const arcCenterY2 = middleY + radius2;

    const startAngle = Math.PI * 1.5;
    const endAngle = Math.PI * 2.5;

    if (useLineVersion) {
        c.drawArc(rightX, arcCenterY1, radius1, startAngle, endAngle);
        c.drawArc(rightX, arcCenterY2, radius2, startAngle, endAngle);
    } else {
        const startX1 = rightX;
        const startY1 = arcCenterY1 - radius1;
        const endX1 = rightX;
        const endY1 = arcCenterY1 + radius1;

        const startX2 = rightX;
        const startY2 = arcCenterY2 - radius2;
        const endX2 = rightX;
        const endY2 = arcCenterY2 + radius2;

        drawShapeArcWithStammConnection(c, startX1, startY1, endX1, endY1, radius1, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
        drawShapeArcWithStammConnection(c, startX2, startY2, endX2, endY2, radius2, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
    }
}


function drawShapeArcWithStammConnection(c, startX, startY, endX, endY, radius, startWidth, endWidth) {
    const pathData = `
        M ${startX - startWidth / 2} ${startY}
        A ${radius} ${radius} 0 0 1 ${endX - endWidth / 2} ${endY}
        L ${endX + endWidth / 2} ${endY}
        A ${radius} ${radius} 0 0 0 ${startX + startWidth / 2} ${startY}
        Z`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "black");
    c.svg.appendChild(path);
}








function drawC(c) {
    const midX = c.width / 2;
    const radius = c.capHeight / 2;
    const centerY = c.baseline - radius;

    // Draw the arc from the baseline to the cap height
    c.drawArc(midX, centerY, radius, Math.PI / 2, 3 * Math.PI / 2);

    // Calculate arc end points
    const startX = midX - radius * Math.cos(Math.PI / 2);
    const startY = centerY + radius * Math.sin(Math.PI / 2);
    const endX = midX - radius * Math.cos(3 * Math.PI / 2);
    const endY = centerY + radius * Math.sin(3 * Math.PI / 2);

    // Add serifs at the arc ends
    drawSerif(c, startX, startY, 'left', 'left');
    drawSerif(c, endX, endY, 'left', 'left');
}









function drawD(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    // Adjust the rightX for the width of the stem
    const rightX = midX + (useLineVersion ? c.width * 0.1 : stammParameters.topWidth / 2);

    // Draw the stem
    c.drawStamm(rightX, topY, bottomY);

    // Add serifs at the top and bottom
    drawSerif(c, rightX, topY, 'top', 'down');
    drawSerif(c, rightX, bottomY, 'bottom', 'up');

    // Arc parameters
    const radius = (bottomY - topY) / 2;
    const arcCenterY = topY + radius;

    const startAngle = Math.PI * 1.5;
    const endAngle = Math.PI * 2.5;

    if (useLineVersion) {
        c.drawArc(rightX, arcCenterY, radius, startAngle, endAngle);
    } else {
        const startX = rightX;
        const startY = arcCenterY - radius;
        const endX = rightX;
        const endY = arcCenterY + radius;

        drawShapeArcWithStammConnection(c, startX, startY, endX, endY, radius, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
    }
}


function drawE(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftX = midX - c.width * 0.1;
    const rightX = midX + c.width * 0.1;

    c.drawStamm(leftX, topY, bottomY);

    // Serifen nur hinzufügen, wenn nicht 'dotted'
    if (lineStyle !== 'dotted') {
        // Add serifs at the top and bottom of the stem
        drawSerif(c, leftX, topY, 'top', 'down');
        drawSerif(c, leftX, bottomY, 'bottom', 'up');
    }

    // Obere horizontale Linie
    c.drawLine(leftX, topY, rightX, topY);
    if (lineStyle !== 'dotted') {
        // Add serif at the end of the top horizontal line
        drawSerif(c, rightX, topY, 'left', 'left');
    }

    // Untere horizontale Linie
    c.drawLine(leftX, bottomY, rightX, bottomY);
    if (lineStyle !== 'dotted') {
        // Add serif at the end of the bottom horizontal line
        drawSerif(c, rightX, bottomY, 'left', 'left');
    }

    // Mittlere horizontale Linie
    const middleLineStartX = leftX;
    const middleLineEndX = leftX + middleLineLength;

    c.drawLine(middleLineStartX, horizontalLineY, middleLineEndX, horizontalLineY);
    if (lineStyle !== 'dotted') {
        // Add serif at the end of the middle horizontal line
        drawSerif(c, middleLineEndX, horizontalLineY, 'left', 'left');
    }
}


function drawF(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftX = midX - c.width * 0.1;
    const rightX = midX + c.width * 0.1;

    c.drawStamm(leftX, topY, bottomY);

    // Add serifs at the top and bottom of the stem
    drawSerif(c, leftX, topY, 'top', 'down');
    drawSerif(c, leftX, bottomY, 'bottom', 'up');

    // Obere horizontale Linie
    c.drawLine(leftX, topY, rightX, topY);
    // Add serif at the end of the top horizontal line
    drawSerif(c, rightX, topY, 'left', 'left');

    // Mittlere horizontale Linie
    const middleLineStartX = leftX;
    const middleLineEndX = leftX + middleLineLength;

    c.drawLine(middleLineStartX, horizontalLineY, middleLineEndX, horizontalLineY);
    // Add serif at the end of the middle horizontal line
    drawSerif(c, middleLineEndX, horizontalLineY, 'left', 'left');
}


function drawG(c) {
    const midX = c.width / 2;
    const radius = c.capHeight / 2;
    const centerY = c.baseline - radius;

    c.drawArc(midX, centerY, radius, Math.PI / 8, 13 * Math.PI / 7);

    const endX = midX + radius * Math.cos(1 * Math.PI / 8);
    const endY = centerY + radius * Math.sin(17 * Math.PI / 8);
    const startX = midX;
    const startY = endY;

    c.drawLine(startX, startY, endX, endY);
}

function drawH(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftX = midX - c.width * 0.2;
    const rightX = midX + c.width * 0.2;

    c.drawStamm(leftX, topY, bottomY);
    c.drawStamm(rightX, topY, bottomY);

    // Add serifs at the top and bottom of the left stem
    drawSerif(c, leftX, topY, 'top', 'down');
    drawSerif(c, leftX, bottomY, 'bottom', 'up');

    // Add serifs at the top and bottom of the right stem
    drawSerif(c, rightX, topY, 'top', 'down');
    drawSerif(c, rightX, bottomY, 'bottom', 'up');

    // Horizontale Linie in der Mitte
    c.drawLine(leftX, horizontalLineY, rightX, horizontalLineY);
}


function drawI(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    c.drawStamm(midX, topY, bottomY);

    // Add serifs at the top and bottom of the stem
    drawSerif(c, midX, topY, 'top', 'down');
    drawSerif(c, midX, bottomY, 'bottom', 'up');
}


function drawJ(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;
    const descenderY = c.baseline + c.descenderHeight;
    const radius = (descenderY - bottomY) / 2;

    // Draw the stem from baseline to capHeight
    c.drawStamm(midX, bottomY, topY);

    // Add serif at the top of the stem
    drawSerif(c, midX, topY, 'top', 'down');

    // Draw the downward bulging arc starting from baseline and connecting with the descender
    const arcCenterY = bottomY + radius;
    c.drawArc(midX - radius, arcCenterY, radius, 0, Math.PI);
}










function drawK(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;
    const middleY = (topY + bottomY) / 2;

    const leftX = midX - c.width * 0.2;
    const rightX = midX + c.width * 0.2;

    // Draw the main vertical stem
    c.drawStamm(leftX, topY, bottomY);

    // Add serifs at the top and bottom of the main vertical stem
    drawSerif(c, leftX, topY, 'top', 'down');
    drawSerif(c, leftX, bottomY, 'bottom', 'up');

    // Draw the top diagonal stem
    c.drawStamm(leftX, middleY, topY, false, false, true, rightX);

    // Add serif at the end of the top diagonal stem
    drawSerif(c, rightX, topY, 'top', 'down');

    // Draw the bottom diagonal stem
    c.drawStamm(leftX, middleY, bottomY, false, false, true, rightX);

    // Add serif at the end of the bottom diagonal stem
    drawSerif(c, rightX, bottomY, 'bottom', 'up');
}


function drawL(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    c.drawStamm(midX, topY, bottomY);

    // Add serif at the top of the stem
    drawSerif(c, midX, topY, 'top', 'down');

    // Draw the horizontal line at the bottom
    const horizontalEndX = midX + c.width * 0.2;
    c.drawLine(midX, bottomY, horizontalEndX, bottomY);


}





function drawM(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftX = midX - c.width * 0.2;
    const rightX = midX + c.width * 0.2;

    c.drawStamm(leftX, topY, bottomY);
    c.drawStamm(rightX, topY, bottomY);

    // Add half serifs at the top of the left and right stems


    // Add serifs at the bottom of the left and right stems
    drawSerif(c, leftX, bottomY, 'bottom', 'up');
    drawSerif(c, rightX, bottomY, 'bottom', 'up');

    // Draw the diagonal lines
    c.drawLine(leftX, topY, midX, bottomY);
    c.drawLine(midX, bottomY, rightX, topY);
}



function drawN(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftX = midX - c.width * 0.2;
    const rightX = midX + c.width * 0.2;

    c.drawStamm(leftX, topY, bottomY);
    c.drawStamm(rightX, topY, bottomY);

    // Add serifs to the left stem
    drawSerif(c, leftX, topY, 'top', 'down'); // Serife oben links, nach unten
    drawSerif(c, leftX, bottomY, 'bottom', 'up'); // Serife unten links, nach oben

    // Add serif to the right stem
    drawSerif(c, rightX, topY, 'top', 'down'); // Serife oben rechts, nach unten

    // Draw the diagonal line
    c.drawLine(leftX, topY, rightX, bottomY);
}



function drawO(c) {
    const midX = c.width / 2;
    const radius = c.capHeight / 2;
    const centerY = c.baseline - radius;

    c.drawCircle(midX, centerY, radius);
}

function drawP(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const middleY = (topY + c.baseline) / 2;

    // Adjust the rightX for the width of the stem
    const rightX = midX + stammParameters.topWidth / 2;

    // Draw the stem
    c.drawStamm(rightX, topY, c.baseline);

    // Arc parameters
    const radius = (middleY - topY) / 2;
    const arcCenterY = topY + radius;

    const startAngle = Math.PI * 1.5;
    const endAngle = Math.PI * 2.5;

    c.drawArc(rightX, arcCenterY, radius, startAngle, endAngle);

    // Add serif to the bottom of the stem
    drawSerif(c, rightX, c.baseline, 'bottom', 'up');
}


function drawQ(c) {
    drawO(c);

    const midX = c.width / 2;
    const bottomY = c.baseline - c.capHeight / 2;

    c.drawLine(midX + c.width * 0.2, bottomY, midX, bottomY + c.capHeight * 0.2);
}

function drawR(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;
    const middleY = (topY + bottomY) / 2;

    // Adjust the rightX for the width of the stem
    const rightX = midX + stammParameters.topWidth / 2;

    // Draw the stem
    c.drawStamm(rightX, topY, bottomY);

    // Arc parameters
    const radius = (middleY - topY) / 2;
    const arcCenterY = topY + radius;

    const startAngle = Math.PI * 1.5;
    const endAngle = Math.PI * 2.5;

    c.drawArc(rightX, arcCenterY, radius, startAngle, endAngle);

    // Add serif to the bottom of the stem
    drawSerif(c, rightX, c.baseline, 'bottom', 'up');

    // Draw the diagonal line for the leg of R
    const diagEndX = midX + c.width * 0.3;
    c.drawLine(rightX, middleY, diagEndX, bottomY);

    // Add serif to the bottom of the diagonal line
    drawSerif(c, diagEndX, bottomY, 'bottom', 'up');
}




function drawS(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;
    const middleY = (topY + bottomY) / 2;

    // Obere Bogenparameter
    const upperRadius = (middleY - topY) / 2;
    const upperArcCenterX = midX;
    const upperArcCenterY = topY + upperRadius;
    const upperArcWidth = elementWidths.arcStartWidth;

    // Untere Bogenparameter
    const lowerRadius = (bottomY - middleY) / 2;
    const lowerArcCenterX = midX;
    const lowerArcCenterY = middleY + lowerRadius;
    const lowerArcWidth = elementWidths.arcEndWidth;

    // Zeichnen des oberen Bogens (nach oben gewölbt)
    c.drawArc(upperArcCenterX, upperArcCenterY, upperRadius, Math.PI, 2 * Math.PI);

    // Zeichnen des unteren Bogens (nach unten gewölbt)
    c.drawArc(lowerArcCenterX, lowerArcCenterY, lowerRadius, 0, Math.PI);

    // Linkes Ende des oberen Bogens
    const upperLeftX = upperArcCenterX - upperRadius;
    const upperLeftY = upperArcCenterY;

    // Rechtes Ende des oberen Bogens
    const upperRightX = upperArcCenterX + upperRadius;
    const upperRightY = upperArcCenterY;

    // Linkes Ende des unteren Bogens
    const lowerLeftX = lowerArcCenterX - lowerRadius;
    const lowerLeftY = lowerArcCenterY;

    // Rechtes Ende des unteren Bogens
    const lowerRightX = lowerArcCenterX + lowerRadius;
    const lowerRightY = lowerArcCenterY;

    // Verbinden der Enden der beiden Bögen mit einer Linie
    drawLine(c, upperLeftX, upperLeftY, lowerRightX, lowerRightY, Math.max(upperArcWidth, lowerArcWidth));

    // Add serifs
    drawSerif(c, upperRightX, upperRightY, 'top', 'left');
    drawSerif(c, lowerLeftX, lowerLeftY, 'bottom', 'right');
}

function drawT(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    // Zeichnen des Stamms
    c.drawStamm(midX, topY, bottomY);

    // Zeichnen der oberen horizontalen Linie
    c.drawLine(midX - c.width * 0.2, topY, midX + c.width * 0.2, topY);

    // Hinzufügen der Serife am unteren Ende des Stamms
    drawSerif(c, midX, bottomY, 'bottom', 'up');
}

function drawU(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftX = midX - c.width * 0.2;
    const rightX = midX + c.width * 0.2;
    const radius = (rightX - leftX) / 2;
    const centerX = midX;
    const centerY = bottomY - radius;

    // Draw the left and right stems
    c.drawStamm(leftX, centerY, topY);
    c.drawStamm(rightX, centerY, topY);

    // Draw the bottom arc (always downwards)
    c.drawArc(centerX, centerY, radius, 0, Math.PI);

    // Add serifs at the top of both stems
    drawSerif(c, leftX, topY, 'top', 'down');
    drawSerif(c, rightX, topY, 'top', 'down');
}

function drawV(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftXTop = midX - c.width * 0.2;
    const rightXTop = midX + c.width * 0.2;

    // Draw the left diagonal stem
    c.drawStamm(leftXTop, topY, bottomY, false, false, true, midX);

    // Draw the right diagonal stem
    c.drawStamm(rightXTop, topY, bottomY, false, false, true, midX);

    // Add serifs at the top of both stems
    drawSerif(c, leftXTop, topY, 'top', 'down');
    drawSerif(c, rightXTop, topY, 'top', 'down');
}





function drawW(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftX = midX - c.width * 0.3;
    const rightX = midX + c.width * 0.3;
    const innerLeftX = midX - c.width * 0.1;
    const innerRightX = midX + c.width * 0.1;

    // Draw the left diagonal stem
    c.drawStamm(leftX, topY, bottomY, false, false, true, innerLeftX);

    // Draw the right diagonal stem
    c.drawStamm(rightX, topY, bottomY, false, false, true, innerRightX);

    // Draw the inner diagonal stems (mirrored)
    c.drawStamm(innerLeftX, bottomY, topY, true, false, true, midX);
    c.drawStamm(innerRightX, bottomY, topY, true, false, true, midX);

    // Add serifs at the top of the outer stems
    drawSerif(c, leftX, topY, 'top', 'down');
    drawSerif(c, rightX, topY, 'top', 'down');
}





function drawX(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftXTop = midX - c.width * 0.2;
    const rightXTop = midX + c.width * 0.2;
    const leftXBottom = midX - c.width * 0.2;
    const rightXBottom = midX + c.width * 0.2;

    // Draw the left diagonal stem
    c.drawStamm(leftXTop, topY, bottomY, false, false, true, rightXBottom);

    // Draw the right diagonal stem
    c.drawStamm(rightXTop, topY, bottomY, false, false, true, leftXBottom);

    // Add serifs at the top of both stems
    drawSerif(c, leftXTop, topY, 'top', 'down');
    drawSerif(c, rightXTop, topY, 'top', 'down');

    // Add serifs at the bottom of both stems
    drawSerif(c, leftXBottom, bottomY, 'bottom', 'up');
    drawSerif(c, rightXBottom, bottomY, 'bottom', 'up');
}
function drawY(c) {
    const midX = c.width / 2;
    const baselineY = c.baseline;
    const xHeightY = c.baseline - c.xHeight;
    const capHeightY = c.baseline - c.capHeight;

    const leftXTop = midX - c.width * 0.2;
    const rightXTop = midX + c.width * 0.2;

    // Draw the vertical stem
    c.drawStamm(midX, baselineY, xHeightY);

    // Draw the left diagonal stem
    c.drawStamm(leftXTop, capHeightY, xHeightY, false, false, true, midX);

    // Draw the right diagonal stem
    c.drawStamm(rightXTop, capHeightY, xHeightY, false, false, true, midX);

    // Add serifs
    drawSerif(c, midX, baselineY, 'bottom', 'up');  // Serife unten am Stamm
    drawSerif(c, leftXTop, capHeightY, 'top', 'down');  // Serife oben links am diagonalen Stamm
    drawSerif(c, rightXTop, capHeightY, 'top', 'down');  // Serife oben rechts am diagonalen Stamm
}
function drawZ(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const bottomY = c.baseline;

    const leftXTop = midX - c.width * 0.2;
    const rightXTop = midX + c.width * 0.2;
    const leftXBottom = midX - c.width * 0.2;
    const rightXBottom = midX + c.width * 0.2;

    // Draw the top horizontal line
    c.drawLine(leftXTop, topY, rightXTop, topY);

    // Draw the diagonal stem
    c.drawStamm(rightXTop, topY, bottomY, false, false, true, leftXBottom);

    // Draw the bottom horizontal line
    c.drawLine(leftXBottom, bottomY, rightXBottom, bottomY);
}
function drawLowerA(c) {
    const midX = c.width / 2;
    const radius = c.xHeight / 3;  // Weniger hoher Kreis
    const centerY = c.baseline - radius;
    const topY = c.baseline - c.xHeight;
    const baselineY = c.baseline;

    // Zufällige Auswahl der Form
    const formType = Math.random() < 0.5 ? 'circleWithStem' : 'circleWithArcAndStem';

    if (formType === 'circleWithStem') {
        // Kreis mit Stamm rechts
        c.drawCircle(midX, centerY, radius);
        const rightX = midX + radius;
        c.drawStamm(rightX, topY, baselineY);
    } else {
        // Kreis mit Stamm rechts und Bogen oben
        c.drawCircle(midX, centerY, radius);
        const rightX = midX + radius;
        const stemTopY = topY;  // Der Stamm soll von der Höhe der Kleinbuchstaben nach unten gehen
        c.drawStamm(rightX, stemTopY, baselineY);

        // Bogen oben, der an den Stamm anschließt
        const arcRadius = radius;
        const arcCenterX = rightX - arcRadius; // Arc center should be to the left of the right edge of the circle
        const arcCenterY = c.baseline - c.xHeight; // Arc center is at xHeight level

        // Draw an arc from left to right to ensure it connects with the stem, with the curve going upwards
        c.drawArc(arcCenterX, arcCenterY, arcRadius, Math.PI, 2 * Math.PI);
    }
}











function drawLowerB(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const middleY = c.baseline - c.xHeight;
    const baselineY = c.baseline;

    // Adjust the rightX for the width of the stem
    const rightX = midX + (useLineVersion ? c.width * 0.1 : stammParameters.topWidth / 2);

    // Draw the stem
    c.drawStamm(rightX, topY, baselineY);

    // Arc parameters
    const radius = (baselineY - middleY) / 2;
    const arcCenterY = middleY + radius;

    const startAngle = Math.PI * 1.5;
    const endAngle = Math.PI * 2.5;

    if (useLineVersion) {
        c.drawArc(rightX, arcCenterY, radius, startAngle, endAngle);
    } else {
        const startX = rightX;
        const startY = arcCenterY - radius;
        const endX = rightX;
        const endY = arcCenterY + radius;

        drawShapeArcWithStammConnection(c, startX, startY, endX, endY, radius, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
    }
}

function drawLowerC(c) {
    const midX = c.width / 2;
    const radius = c.xHeight / 2;
    const centerY = c.baseline - radius;

    c.drawArc(midX, centerY, radius, Math.PI / 2, (3 * Math.PI) / 2);
}

function drawLowerD(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const middleY = c.baseline - c.xHeight;
    const baselineY = c.baseline;

    // Adjust the rightX for the width of the stem
    const stemWidth = stammParameters.topWidth / 2;
    const rightX = midX + stemWidth;

    // Draw the stem
    c.drawStamm(rightX, topY, baselineY);

    // Arc parameters
    const radius = (baselineY - middleY) / 2;
    const arcCenterX = rightX - radius + stemWidth; // Adjust the center to align arc ends with the stem
    const arcCenterY = middleY + radius;

    const startAngle = Math.PI * 0.5;
    const endAngle = Math.PI * 1.5;

    // Draw the arc from left to right, with the curve going to the left
    c.drawArc(arcCenterX, arcCenterY, radius, startAngle, endAngle);
}















function drawLowerE(c) {
    const midX = c.width / 2;
    const radius = c.xHeight / 2;
    const centerY = c.baseline - radius;

    c.drawArc(midX, centerY, radius, Math.PI / 2, (3 * Math.PI) / 2);
}

function drawLowerF(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const baselineY = c.baseline;
    const middleY = c.baseline - c.xHeight * 0.5;

    const leftX = midX - c.width * 0.1;
    const rightX = midX + c.width * 0.1;

    c.drawStamm(midX, topY, baselineY);
    c.drawLine(leftX, middleY, rightX, middleY);
}

function drawLowerG(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const baselineY = c.baseline;
    const descenderY = baselineY + c.descenderHeight;

    const rightX = midX + c.width * 0.1;

    // Zeichne den Stamm
    c.drawStamm(rightX, topY, descenderY);

    // Zeichne den oberen Bogen
    c.drawArc(rightX, topY + (baselineY - topY) / 2, (baselineY - topY) / 2, Math.PI * 0.5, Math.PI * 1.5);

    // Zeichne den unteren Bogen, der nach unten gewölbt ist
    const startX = rightX;
    const startY = descenderY;
    const endX = midX;
    const endY = descenderY;
    const controlX = midX + c.width * 0.1;
    const controlY = descenderY + c.descenderHeight / 2;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;
    path.setAttribute("d", d);
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", 1);
    path.setAttribute("fill", "none");
    c.svg.appendChild(path);
}

function drawLowerH(c) {
    const midX = c.width / 2;
    const baselineY = c.baseline;
    const xHeightY = c.baseline - c.xHeight;
    const capHeightY = c.baseline - c.capHeight;

    const leftX = midX - c.width * 0.2;
    const rightX = midX + c.width * 0.2;

    // Zeichne den linken Stamm, der bis zur Capheight geht
    c.drawStamm(leftX, capHeightY, baselineY);

    // Berechne den Arc
    const arcRadius = (rightX - leftX) / 2;
    const arcCenterX = (leftX + rightX) / 2;
    const arcStartY = xHeightY + (baselineY - xHeightY) / 2;
    const arcEndY = xHeightY;

    // Zeichne den Bogen (Arc) von links nach rechts
    c.drawArc(arcCenterX, arcStartY, arcRadius, Math.PI, 2 * Math.PI);

    // Berechne die Koordinaten des Endpunkts des Arcs
    const arcEndX = arcCenterX + arcRadius;

    // Zeichne den rechten Stamm, der am Ende des Bogens beginnt und bis zur Baseline geht
    c.drawStamm(rightX, arcStartY, baselineY);
}






function drawLowerI(c) {
    const midX = c.width / 2;
    const xHeightY = c.baseline - c.xHeight;

    c.drawStamm(midX, xHeightY, c.baseline);

    const dotSize = 1 / 2;
    const dotX = midX;
    const dotY = c.baseline - c.capHeight;

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", dotX);
    dot.setAttribute("cy", dotY);
    dot.setAttribute("r", dotSize / 2);
    dot.setAttribute("fill", "black");

    c.svg.appendChild(dot);
}

function drawLowerJ(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const bottomY = c.baseline + c.descenderHeight;

    c.drawStamm(midX, topY, c.baseline);
    c.drawArc(midX, c.baseline + c.descenderHeight / 2, c.descenderHeight / 2, Math.PI / 2, Math.PI);
}

function drawLowerK(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const middleY = c.baseline - c.xHeight * 0.5;

    const leftX = midX - c.width * 0.1;
    c.drawStamm(leftX, topY, c.baseline);

    c.drawLine(leftX, middleY, midX + c.width * 0.2, topY);
    c.drawLine(leftX, middleY, midX + c.width * 0.2, c.baseline);
}

function drawLowerL(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;

    c.drawStamm(midX, topY, c.baseline);
}

function drawLowerM(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const baselineY = c.baseline;

    const leftX = midX - c.width * 0.5;
    const middleX = midX;
    const rightX = midX + c.width * 0.5;

    // Zeichne den linken Stamm
    c.drawStamm(leftX, topY, baselineY);

    // Zeichne den linken Arc
    const arcRadius = (middleX - leftX) / 2;
    const arcCenterLeftX = (leftX + middleX) / 2;
    const arcStartY = topY + (baselineY - topY) / 2;
    c.drawArc(arcCenterLeftX, arcStartY, arcRadius, Math.PI, 2 * Math.PI);

    // Zeichne den mittleren Stamm
    c.drawStamm(middleX, arcStartY, baselineY);

    // Zeichne den rechten Arc
    const arcCenterRightX = (middleX + rightX) / 2;
    c.drawArc(arcCenterRightX, arcStartY, arcRadius, Math.PI, 2 * Math.PI);

    // Zeichne den rechten Stamm am Ende des rechten Arcs
    c.drawStamm(rightX, arcStartY, baselineY);
}






function drawLowerN(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const baselineY = c.baseline;

    const leftX = midX - c.width * 0.2;
    const rightX = midX + c.width * 0.2;

    // Zeichne den linken Stamm
    c.drawStamm(leftX, topY, baselineY);

    // Berechne die Parameter für den Arc
    const arcRadius = (rightX - leftX) / 2;
    const arcCenterX = (leftX + rightX) / 2;
    const arcStartY = topY + (baselineY - topY) / 2; // Der Arc beginnt etwas tiefer auf dem linken Stamm

    // Zeichne den Bogen (Arc) von links nach rechts
    c.drawArc(arcCenterX, arcStartY, arcRadius, Math.PI, 2 * Math.PI);

    // Zeichne den rechten Stamm am Ende des Arcs
    c.drawStamm(rightX, arcStartY, baselineY);
}





function drawLowerO(c) {
    const midX = c.width / 2;
    const radius = c.xHeight / 2;
    const centerY = c.baseline - radius;

    c.drawCircle(midX, centerY, radius);
}

function drawLowerP(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const baselineY = c.baseline;
    const descenderY = baselineY + c.descenderHeight;

    const leftX = midX - c.width * 0.1;

    c.drawStamm(leftX, topY, descenderY);
    c.drawArc(leftX, topY + (baselineY - topY) / 2, (baselineY - topY) / 2, Math.PI * 1.5, Math.PI * 2.5);
}

function drawLowerQ(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const baselineY = c.baseline;
    const descenderY = baselineY + c.descenderHeight;

    // Adjust the leftX for the width of the stem
    const leftX = midX - (useLineVersion ? c.width * 0.1 : stammParameters.topWidth / 2);

    // Draw the stem
    c.drawStamm(leftX, topY, descenderY);

    // Arc parameters
    const radius = (baselineY - topY) / 2;
    const arcCenterY = topY + radius;

    const startAngle = Math.PI * 0.5;
    const endAngle = Math.PI * 1.5;

    if (useLineVersion) {
        c.drawArc(leftX, arcCenterY, radius, startAngle, endAngle);
    } else {
        const startX = leftX;
        const startY = arcCenterY - radius;
        const endX = leftX;
        const endY = arcCenterY + radius;

        drawShapeArcWithStammConnection(c, startX, startY, endX, endY, radius, elementWidths.arcStartWidth, elementWidths.arcEndWidth);
    }
}

function drawLowerR(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const middleY = (c.baseline + topY) / 2;

    c.drawStamm(midX, topY, c.baseline);
    c.drawLine(midX, middleY, midX + c.width * 0.2, middleY);
}

function drawLowerS(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const bottomY = c.baseline;
    const middleY = (topY + bottomY) / 2;

    c.drawArc(midX, topY + (middleY - topY) / 2, (middleY - topY) / 2, Math.PI / 2, (3 * Math.PI) / 2);
    c.drawArc(midX, middleY + (bottomY - middleY) / 2, (bottomY - middleY) / 2, (3 * Math.PI) / 2, (5 * Math.PI) / 2);
}

function drawLowerT(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.capHeight;
    const xHeightY = c.baseline - c.xHeight;

    const leftX = midX - c.width * 0.1;
    const rightX = midX + c.width * 0.1;

    c.drawStamm(midX, topY, c.baseline);
    c.drawLine(leftX, horizontalLineY, rightX, horizontalLineY); // horizontale Linie auf horizontalLineY setzen
}

function drawLowerU(c) {
    const midX = c.width / 2;
    const baselineY = c.baseline;
    const xHeightY = baselineY - c.xHeight;

    const leftX = midX - c.width * 0.2;
    const rightX = midX + c.width * 0.2;

    // Die y-Koordinate des Kreismittelpunktes muss so angepasst werden,
    // dass der Bogen nur bis zur Baseline reicht und nicht darüber hinausgeht.
    const arcRadius = (rightX - leftX) / 2;
    const arcCenterX = (leftX + rightX) / 2;
    const arcCenterY = baselineY - arcRadius;

    // Zeichne den Bogen (nach unten gewölbt mit der Spitze an der Baseline)
    c.drawArc(arcCenterX, arcCenterY, arcRadius, 0, Math.PI, false);

    // Zeichne den linken Stamm vom linken Arc-Ende bis zur x-Höhe
    c.drawStamm(leftX, xHeightY, baselineY - arcRadius);

    // Zeichne den rechten Stamm, der direkt an der Baseline beginnt und bis zur x-Höhe geht
    c.drawStamm(rightX, xHeightY, baselineY);
}











function drawLowerV(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const bottomY = c.baseline;

    const leftXTop = midX - c.width * 0.2;
    const rightXTop = midX + c.width * 0.2;

    // Draw the left diagonal stem
    c.drawStamm(leftXTop, topY, bottomY, false, false, true, midX);

    // Draw the right diagonal stem
    c.drawStamm(rightXTop, topY, bottomY, false, false, true, midX);
}


function drawLowerW(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const bottomY = c.baseline;

    const leftX = midX - c.width * 0.3;
    const rightX = midX + c.width * 0.3;
    const innerLeftX = midX - c.width * 0.1;
    const innerRightX = midX + c.width * 0.1;

    // Draw the left diagonal stem
    c.drawStamm(leftX, topY, bottomY, false, false, true, innerLeftX);

    // Draw the right diagonal stem
    c.drawStamm(rightX, topY, bottomY, false, false, true, innerRightX);

    // Draw the inner diagonal stems (mirrored)
    c.drawStamm(innerLeftX, bottomY, topY, true, false, true, midX);
    c.drawStamm(innerRightX, bottomY, topY, true, false, true, midX);
}


function drawLowerX(c) {
    const midX = c.width / 2;
    const topY = c.baseline - c.xHeight;
    const bottomY = c.baseline;

    const leftXTop = midX - c.width * 0.2;
    const rightXTop = midX + c.width * 0.2;
    const leftXBottom = midX - c.width * 0.2;
    const rightXBottom = midX + c.width * 0.2;

    // Draw the left diagonal stem
    c.drawStamm(leftXTop, topY, bottomY, false, false, true, rightXBottom);

    // Draw the right diagonal stem
    c.drawStamm(rightXTop, topY, bottomY, false, false, true, leftXBottom);
}


function drawLowerY(c) {
    const midX = c.width / 2;
    const xHeightY = c.baseline - c.xHeight;
    const baselineY = c.baseline;
    const descenderY = baselineY + c.descenderHeight;

    const leftXTop = midX - c.width * 0.1;
    const rightXTop = midX + c.width * 0.1;

    // Draw the left diagonal stem
    c.drawStamm(leftXTop, xHeightY, baselineY, true, false, true, midX);

    // Draw the right diagonal stem
    c.drawStamm(rightXTop, xHeightY, baselineY, true, false, true, midX);

    // Draw the vertical stem
    c.drawStamm(midX, baselineY, descenderY);
}


function drawLowerZ(c) {
    const midX = c.width / 2;
    const xHeightY = c.baseline - c.xHeight;
    const baselineY = c.baseline;

    const leftXTop = midX - c.width * 0.2;
    const rightXTop = midX + c.width * 0.2;

    // Zeichne die obere horizontale Linie
    c.drawLine(leftXTop, xHeightY, rightXTop, xHeightY);

    // Zeichne den diagonalen Stamm von links oben nach rechts unten
    c.drawStamm(rightXTop, xHeightY, baselineY, false, false, true, leftXTop);

    // Zeichne die untere horizontale Linie
    c.drawLine(leftXTop, baselineY, rightXTop, baselineY);
}





function getPathDataForLetter(letter) {
    // Rückgabepfad für den Buchstaben (SVG-Pfad-Daten)
    // Dies ist ein Platzhalter. Du musst die tatsächlichen Pfaddaten für jeden Buchstaben hier einfügen.
    return "M10 10 H 90 V 90 H 10 L 10 10";
}