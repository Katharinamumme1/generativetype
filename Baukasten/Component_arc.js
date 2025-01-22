function drawRandomArc() {
    const svg = document.getElementById("arc");
    if (!svg) {
        console.error("SVG mit ID 'arc' nicht gefunden.");
        return;
    }

    // SVG-Größe und Padding direkt im Code festgelegt
    const svgWidth = 500;
    const svgHeight = 400;
    const padding = 50;

    const topWidth = window.topWidth;

    svg.setAttribute("viewBox", `0 -${padding} ${svgWidth} ${svgHeight + padding * 2}`);

    // Zufälliger Radius im Bereich von 50 bis maxRadius
    const maxRadius = Math.min(svgWidth, svgHeight) / 2 - topWidth;
    const radius = Math.floor(Math.random() * (maxRadius - 50) + 50);

    // Mittelpunkt bleibt wie gewohnt
    const cx = svgWidth / 2;
    const cy = svgHeight / 2;

    // Winkelbereich bleibt 180 Grad
    const startAngle = Math.PI / 2;
    const endAngle = startAngle + Math.PI;

    // Zufällige Verschiebung und Asymmetrie, aber moderat
    const variationFactor = Math.random() * 10 - 5; // Weniger Variation der Krümmung (zwischen -5 und +5)

    // Funktion für Verzerrung des äußeren Radius (stärker)
    const outerRadiusVariation = (angle) => {
        return radius + topWidth + Math.random() * 50 - 10 + (Math.sin(angle) * variationFactor);
    };

    // Funktion für Verzerrung des inneren Radius (weniger stark)
    const innerRadiusVariation = (angle) => {
        return radius + Math.random() * 50 - 10 + (Math.sin(angle) * variationFactor);
    };

    // Funktion für zufällige Anzahl von Ecken und Kurven (0 bis 5)
    const randomCurves = (max) => {
        return Math.floor(Math.random() * (max + 1)); // Zufällige Zahl zwischen 0 und max
    };

    // Funktion für zufällige Entscheidung, ob nur Ecken, nur Kurven oder eine Mischung verwendet wird
    const randomPathType = () => {
        const pathTypes = ['corners', 'curves', 'mixed'];
        return pathTypes[Math.floor(Math.random() * pathTypes.length)];
    };

    // Funktion für die Erzeugung von Bezier-Kurven mit sanften Übergängen
    const createBezierCurve = (startX, startY, endX, endY, direction, smooth = false) => {
        const controlDistance = 100; // Distanz der Kontrollpunkte

        // Berechnen der Vektoren von Start- zu Endpunkt
        const dx = endX - startX;
        const dy = endY - startY;

        // Berechnen der Kontrollpunkte, um eine Tangente zu erstellen
        const controlX1 = startX + (Math.random() - 0.5) * controlDistance * direction + dx * 0.3;
        const controlY1 = startY + (Math.random() - 0.5) * controlDistance * direction + dy * 0.3;
        const controlX2 = endX + (Math.random() - 0.5) * controlDistance * direction - dx * 0.3;
        const controlY2 = endY + (Math.random() - 0.5) * controlDistance * direction - dy * 0.3;

        // Erstelle die Kurve mit den berechneten Kontrollpunkten
        return `C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    };

    // Funktion für die Erzeugung von Ecken
    const createCorner = (startX, startY, endX, endY) => {
        return `L ${endX} ${endY}`;
    };

    // Berechnung der Start- und Endpunkte des äußeren und inneren Bogens
    const startXOuter = cx + outerRadiusVariation(startAngle) * Math.cos(startAngle);
    const startYOuter = cy + outerRadiusVariation(startAngle) * Math.sin(startAngle);
    const endXOuter = cx + outerRadiusVariation(endAngle) * Math.cos(endAngle);
    const endYOuter = cy + outerRadiusVariation(endAngle) * Math.sin(endAngle);

    const startXInner = cx + innerRadiusVariation(startAngle) * Math.cos(startAngle);
    const startYInner = cy + innerRadiusVariation(startAngle) * Math.sin(startAngle);
    const endXInner = cx + innerRadiusVariation(endAngle) * Math.cos(endAngle);
    const endYInner = cy + innerRadiusVariation(endAngle) * Math.sin(endAngle);

    // Zufällige Entscheidung für den äußeren und inneren Bogen (Kurven, Ecken oder gemischt)
    const outerPathType = randomPathType();
    const innerPathType = randomPathType();

    // Zufällige Entscheidung, ob die Kurvenrichtung wechselt
    const changeDirection = Math.random() < 0.5; // 50% Chance, dass sich die Kurvenrichtung wechselt

    // Das Pfad-D (d) für den äußeren Bogen
    let pathD = `M ${startXOuter} ${startYOuter}`;

    // Zufällige Anzahl von Kurven (0-5) für den äußeren Bogen
    const outerCurves = randomCurves(5);
    let currentX = startXOuter;
    let currentY = startYOuter;
    let stepAngle = (endAngle - startAngle) / (outerCurves + 1);

    let direction = 1; // Initialrichtung der Kurven (1 oder -1 für umgekehrte Richtung)

    // Erzeuge den äußeren Bogen basierend auf dem zufällig gewählten Pfadtyp
    if (outerPathType === 'curves') {
        for (let i = 0; i < outerCurves; i++) {
            const angle = startAngle + stepAngle * (i + 1);
            const newX = cx + outerRadiusVariation(angle) * Math.cos(angle);
            const newY = cy + outerRadiusVariation(angle) * Math.sin(angle);

            // Erzeuge die Bezier-Kurve mit der entsprechenden Richtung
            pathD += createBezierCurve(currentX, currentY, newX, newY, direction, true); // smooth Übergang
            currentX = newX;
            currentY = newY;

            // Wenn Richtungswechsel gewünscht ist, wechseln wir die Richtung
            if (changeDirection) {
                direction = -direction;
            }
        }
        pathD += ` A ${outerRadiusVariation(endAngle)} ${outerRadiusVariation(endAngle)} 0 0 1 ${endXOuter} ${endYOuter}`;
    } else if (outerPathType === 'corners') {
        for (let i = 0; i < outerCurves; i++) {
            const angle = startAngle + stepAngle * (i + 1);
            const newX = cx + outerRadiusVariation(angle) * Math.cos(angle);
            const newY = cy + outerRadiusVariation(angle) * Math.sin(angle);
            pathD += createCorner(currentX, currentY, newX, newY);
            currentX = newX;
            currentY = newY;
        }
        pathD += ` L ${endXOuter} ${endYOuter}`;
    } else {
        // Mischung von Kurven und Ecken
        for (let i = 0; i < outerCurves; i++) {
            const angle = startAngle + stepAngle * (i + 1);
            const newX = cx + outerRadiusVariation(angle) * Math.cos(angle);
            const newY = cy + outerRadiusVariation(angle) * Math.sin(angle);
            if (i % 2 === 0) {
                pathD += createBezierCurve(currentX, currentY, newX, newY, direction, true); // smooth Übergang
            } else {
                pathD += createCorner(currentX, currentY, newX, newY);
            }
            currentX = newX;
            currentY = newY;

            // Wenn Richtungswechsel gewünscht ist, wechseln wir die Richtung
            if (changeDirection) {
                direction = -direction;
            }
        }
        pathD += ` A ${outerRadiusVariation(endAngle)} ${outerRadiusVariation(endAngle)} 0 0 1 ${endXOuter} ${endYOuter}`;
    }

    pathD += ` L ${endXInner} ${endYInner}`; // Übergang zum inneren Bogen

    // Der innere Bogen hat weniger starke Verzerrungen, aber auch mit Kurven oder Ecken
    const innerCurves = randomCurves(4); // Maximale Anzahl von Kurven im inneren Bogen ist jetzt 4
    currentX = endXInner;
    currentY = endYInner;
    stepAngle = (endAngle - startAngle) / (innerCurves + 1);

    direction = 1; // Initialrichtung für den inneren Bogen

    if (innerPathType === 'curves') {
        for (let i = 0; i < innerCurves; i++) {
            const angle = startAngle + stepAngle * (i + 1);
            const newX = cx + innerRadiusVariation(angle) * Math.cos(angle);
            const newY = cy + innerRadiusVariation(angle) * Math.sin(angle);

            // Erzeuge die Bezier-Kurve mit der entsprechenden Richtung
            pathD += createBezierCurve(currentX, currentY, newX, newY, direction, true); // smooth Übergang
            currentX = newX;
            currentY = newY;

            // Wenn Richtungswechsel gewünscht ist, wechseln wir die Richtung
            if (changeDirection) {
                direction = -direction; // Richtungswechsel
            }
        }
        pathD += ` A ${innerRadiusVariation(startAngle)} ${innerRadiusVariation(startAngle)} 0 0 0 ${startXInner} ${startYInner}`;
    } else if (innerPathType === 'corners') {
        for (let i = 0; i < innerCurves; i++) {
            const angle = startAngle + stepAngle * (i + 1);
            const newX = cx + innerRadiusVariation(angle) * Math.cos(angle);
            const newY = cy + innerRadiusVariation(angle) * Math.sin(angle);
            pathD += createCorner(currentX, currentY, newX, newY);
            currentX = newX;
            currentY = newY;
        }
        pathD += ` L ${startXInner} ${startYInner}`;
    } else {
        // Mischung von Kurven und Ecken
        for (let i = 0; i < innerCurves; i++) {
            const angle = startAngle + stepAngle * (i + 1);
            const newX = cx + innerRadiusVariation(angle) * Math.cos(angle);
            const newY = cy + innerRadiusVariation(angle) * Math.sin(angle);
            if (i % 2 === 0) {
                pathD += createBezierCurve(currentX, currentY, newX, newY, direction, true); // smooth Übergang
            } else {
                pathD += createCorner(currentX, currentY, newX, newY);
            }
            currentX = newX;
            currentY = newY;

            // Wenn Richtungswechsel gewünscht ist, wechseln wir die Richtung
            if (changeDirection) {
                direction = -direction;
            }
        }
        pathD += ` A ${innerRadiusVariation(startAngle)} ${innerRadiusVariation(startAngle)} 0 0 0 ${startXInner} ${startYInner}`;
    }

    pathD += ` Z`; // Pfad schließen

    // Füge den Pfad als "path"-Element in das SVG ein
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathD);
    pathElement.setAttribute("fill", "black");
    svg.appendChild(pathElement);
}


document.addEventListener('DOMContentLoaded', () => {
    const arc = document.getElementById('arc');
    const arcContent = arc.innerHTML; // Inhalte des arc-SVGs holen

    // Funktion zum Klonen und Transformieren des Inhalts
    const applyArcTransformation = (targetId, transformation) => {
        const target = document.getElementById(targetId);
        target.innerHTML = `<g transform="${transformation}">${arcContent}</g>`; // Inhalt klonen und in einer Gruppe transformieren
    };

    // Arc links (Standard)
    applyArcTransformation('arc_left', '');

    // Arc rechts (horizontal gespiegelt)
    applyArcTransformation('arc_right', 'scale(-1, 1)');

    // Arc oben (90 Grad gedreht)
    applyArcTransformation('arc_up', 'rotate(-90) translate(-100, 0)'); // Verschiebung kann angepasst werden

    // Arc unten (180 Grad gedreht)
    applyArcTransformation('arc_down', 'rotate(180) translate(-100, -100)'); // Verschiebung anpassen
});
