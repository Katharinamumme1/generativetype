const voronoiSVG = document.getElementById("drawingSVG-voronoi");
const voronoiWidth = voronoiSVG.getAttribute("width");
const voronoiHeight = voronoiSVG.getAttribute("height");

let voronoiPoints = [];

// Voronoi-Generator von D3.js
const voronoi = d3.voronoi().size([voronoiWidth, voronoiHeight]);

// Steuerelemente für Voronoi
const lineColorInput = document.getElementById("voronoi-lineColor");
const lineWidthInput = document.getElementById("voronoi-lineWidth");
const lineStyleInput = document.getElementById("voronoi-lineStyle");

// Funktion zum Zeichnen des Voronoi-Diagramms
function drawVoronoi() {
    voronoiSVG.innerHTML = ""; // SVG leeren

    // Voronoi-Diagramm berechnen
    const diagram = voronoi(voronoiPoints);

    // Überprüfen, ob Diagramm berechnet wurde
    if (!diagram || !diagram.polygons) {
        console.error("Voronoi-Diagramm konnte nicht berechnet werden.");
        return;
    }

    // Zellen als Polygone zeichnen
    diagram.polygons().forEach(polygon => {
        if (!polygon) return; // Leere Polygone überspringen

        let pathData = `M${polygon[0][0]},${polygon[0][1]}`; // Anfangspunkt
        polygon.slice(1).forEach(([x, y]) => {
            pathData += ` L${x},${y}`;
        });
        pathData += " Z"; // Schließt das Polygon

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", lineColorInput.value);
        path.setAttribute("stroke-width", lineWidthInput.value);

        // Linienstil anwenden
        if (lineStyleInput.value === "dashed") {
            path.setAttribute("stroke-dasharray", "5,5");
        } else if (lineStyleInput.value === "dotted") {
            path.setAttribute("stroke-dasharray", "2,2");
        }

        voronoiSVG.appendChild(path);
    });

    // Punkte als Kreise zeichnen
    voronoiPoints.forEach(([x, y]) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 3);
        circle.setAttribute("fill", "#ff0000");
        voronoiSVG.appendChild(circle);
    });
}

// Eventlistener für das Setzen der Punkte
voronoiSVG.addEventListener("click", function (event) {
    const coords = [event.offsetX, event.offsetY]; // Position des Klicks
    voronoiPoints.push(coords); // Punkt zum Array hinzufügen
    drawVoronoi(); // Voronoi-Diagramm neu zeichnen
});

// Eventlistener für Steuerungen
[lineColorInput, lineWidthInput, lineStyleInput].forEach(input => {
    input.addEventListener("input", drawVoronoi);
});
