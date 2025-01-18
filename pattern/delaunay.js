document.addEventListener("DOMContentLoaded", () => {
    const svg = document.getElementById("drawingSVG-delaunay");
    const downloadBtn = document.getElementById("downloadBtn");

    // Neue Steuerungselemente
    const lineColorInput = document.getElementById("lineColor");
    const lineWidthInput = document.getElementById("lineWidth");
    const lineStyleInput = document.getElementById("lineStyle");

    let points = [];
    let lineColor = lineColorInput.value;
    let lineWidth = lineWidthInput.value;
    let lineStyle = lineStyleInput.value;

    // Klick-Event für das Hinzufügen von Punkten
    svg.addEventListener("click", (event) => {
        const rect = svg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Punkt hinzufügen
        points.push([x, y]);
        drawPoint(x, y);

        // Wenn mindestens 3 Punkte da sind, aktualisiere die Triangulation
        if (points.length >= 3) {
            drawDelaunay(points);
        }
    });

    // Funktion zum Zeichnen eines Punktes
    function drawPoint(x, y) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 3);
        circle.setAttribute("fill", "red");
        svg.appendChild(circle);
    }

    // Funktion zum Zeichnen der Delaunay-Triangulation
    function drawDelaunay(points) {
        const delaunay = Delaunator.from(points);
        const triangles = delaunay.triangles;

        // Entferne alte Linien
        svg.querySelectorAll("line").forEach(line => line.remove());

        // Zeichne die Dreiecke
        for (let i = 0; i < triangles.length; i += 3) {
            const [p1, p2, p3] = [
                points[triangles[i]],
                points[triangles[i + 1]],
                points[triangles[i + 2]],
            ];
            drawLine(p1, p2);
            drawLine(p2, p3);
            drawLine(p3, p1);
        }
    }

    // Funktion zum Zeichnen einer Linie mit den aktuellen Einstellungen
    function drawLine([x1, y1], [x2, y2]) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", lineColor);
        line.setAttribute("stroke-width", lineWidth);
        line.setAttribute("stroke-dasharray", getDashArray(lineStyle));
        svg.appendChild(line);
    }

    // Hilfsfunktion, um die Strichart basierend auf der Auswahl zu bestimmen
    function getDashArray(style) {
        switch (style) {
            case "dashed":
                return "5,5"; // Gestrichelt
            case "dotted":
                return "1,5"; // Punktiert
            default:
                return "0"; // Durchgezogen
        }
    }

    // Event-Listener für Änderungen der Steuerungselemente
    lineColorInput.addEventListener("input", (event) => {
        lineColor = event.target.value;
        drawDelaunay(points); // Aktualisiere die Zeichnung
    });

    lineWidthInput.addEventListener("input", (event) => {
        lineWidth = event.target.value;
        drawDelaunay(points); // Aktualisiere die Zeichnung
    });

    lineStyleInput.addEventListener("change", (event) => {
        lineStyle = event.target.value;
        drawDelaunay(points); // Aktualisiere die Zeichnung
    });

    // Funktion zum Speichern des SVGs
    downloadBtn.addEventListener("click", () => {
        const svgContent = svg.outerHTML;
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "delaunay_triangulation.svg";
        link.click();
    });
});
