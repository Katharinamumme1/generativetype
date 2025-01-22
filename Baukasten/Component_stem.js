// Zufallswerte generieren
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Funktion, um zufällig zu entscheiden, ob eine Ecke abgerundet wird und wie stark
function getRandomCornerRadius() {
    return Math.random() > 0.5 ? getRandomInRange(5, 20) : 0; // 50% Chance für einen Radius zwischen 5 und 20
}

// Hauptfunktion zur Generierung des "Stem"-SVGs
function generateStem() {
    const svg = document.getElementById("stem");
    svg.innerHTML = ""; // Clear any existing content

    svg.setAttribute("width", 500);  // Verwendet die globale Breite
    svg.setAttribute("height", 600);  // Verwendet die globale Höhe
    svg.setAttribute("viewBox", `0 0 500 600`);
    svg.style.border = "1px solid black";
    svg.style.margin = "10px";

    // Zufällige obere und untere Breite
    const topWidth = getRandomInRange(50, 150); // Bereich 50–150
    const bottomWidth = getRandomInRange(50, 200); // Bereich 50–200

    // Setze topWidth global, sodass es in arc_circle.js verwendet werden kann
    window.topWidth = topWidth; // Speichern von topWidth in der globalen window-Variable

    // Zufällige Werte für Ecken und Kurven
    const leftCorners = Math.floor(getRandomInRange(0, 4)); // Zufällige Anzahl an Ecken für die linke Seite
    const leftCurves = Math.floor(getRandomInRange(0, 4));  // Zufällige Anzahl an Kurven für die linke Seite
    const rightCorners = Math.floor(getRandomInRange(0, 4)); // Zufällige Anzahl an Ecken für die rechte Seite
    const rightCurves = Math.floor(getRandomInRange(0, 4));  // Zufällige Anzahl an Kurven für die rechte Seite

    // Zufallsradius für die Ecken
    const leftCornerRadius = getRandomCornerRadius();
    const rightCornerRadius = getRandomCornerRadius();

    // Stamm zeichnen
    drawShape(svg, 150, 0, 500, topWidth, bottomWidth, {
        leftCorners,
        leftCurves,
        rightCorners,
        rightCurves,
        leftCornerRadius,
        rightCornerRadius,
    });

    // Den Bogen nach dem Zeichnen des Stammes generieren
    drawRandomArc(); // Jetzt wird die Funktion aufgerufen, nachdem topWidth gesetzt wurde
}

// Funktion zum Zeichnen der Form
function drawShape(svg, x1, y1, y2, topWidth, bottomWidth, counts) {
    let pathData = `M ${x1 - topWidth / 2} ${y1}`;

    if (counts.leftCorners > 0 || counts.leftCurves > 0) {
        const leftPath = generateSidePath(
            x1 - topWidth / 2,
            y1,
            y2,
            counts.leftCorners,
            counts.leftCurves,
            counts.leftCornerRadius
        );
        pathData += leftPath;
    } else {
        pathData += ` L ${x1 - bottomWidth / 2} ${y2}`;
    }

    pathData += ` L ${x1 + bottomWidth / 2} ${y2}`;

    if (counts.rightCorners > 0 || counts.rightCurves > 0) {
        const rightPath = generateSidePath(
            x1 + bottomWidth / 2,
            y2,
            y1,
            counts.rightCorners,
            counts.rightCurves,
            counts.rightCornerRadius,
            true
        );
        pathData += rightPath;
    } else {
        pathData += ` L ${x1 + topWidth / 2} ${y1}`;
    }

    pathData += ` Z`;

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathData);
    pathElement.setAttribute("fill", "black");
    svg.appendChild(pathElement);
}

// Funktion für eine Seite (linke oder rechte Seite der Form)
function generateSidePath(startX, startY, endY, corners, curves, cornerRadius, reverse = false) {
    const totalSegments = corners + curves;
    const segmentHeight = (endY - startY) / totalSegments;
    let currentY = startY;
    let pathData = "";

    for (let i = 0; i < totalSegments; i++) {
        if (i < corners) {
            const offsetX = reverse ? -Math.random() * 30 : Math.random() * 80;
            const nextY = currentY + segmentHeight;

            // Wenn der Radius größer als 0 ist, benutze eine Kurve, um die Ecken zu runden
            if (cornerRadius > 0) {
                const controlX = startX + offsetX;
                const controlY = currentY + segmentHeight / 2;
                pathData += ` Q ${controlX} ${controlY}, ${startX} ${nextY}`;
            } else {
                pathData += ` L ${startX + offsetX} ${nextY}`;
            }

            currentY = nextY;
        } else {
            let controlOffsetX, direction;
            const randomMode = Math.random() > 0.5;

            if (randomMode) {
                direction = Math.random() > 0.5 ? 1 : -1;
                controlOffsetX = direction * Math.random() * 60;
            } else {
                direction = i % 2 === 0 ? 1 : -1;
                controlOffsetX = direction * Math.random() * 90;
            }

            const nextY = currentY + segmentHeight;
            const controlX = startX + controlOffsetX;
            const controlY = currentY + segmentHeight / 2;

            pathData += ` Q ${controlX} ${controlY}, ${startX} ${nextY}`;
            currentY = nextY;
        }
    }

    return pathData;
}

// Initialisierung der Generierung
document.addEventListener("DOMContentLoaded", generateStem); // Aufruf der Funktion bei Seitenladen
