    document.getElementById('rectangle-button').addEventListener('click', () => {
        const elements = document.querySelectorAll('*'); // Alle Elemente auf der Seite
        elements.forEach(element => {
            // Füge die Klasse "no-border-radius" hinzu oder entferne sie, je nach Zustand
            if (element.classList.contains('no-border-radius')) {
                element.classList.remove('no-border-radius'); // Entfernt die Klasse
                element.style.borderRadius = ''; // Entfernt border-radius
            } else {
                element.classList.add('no-border-radius'); // Fügt die Klasse hinzu
                element.style.borderRadius = '0'; // Setzt border-radius auf 0
            }
        });
    });

    document.getElementById('circle-button').addEventListener('click', () => {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            // Entferne die "no-border-radius"-Klasse und setze den border-radius zurück
            element.classList.remove('no-border-radius');
            element.style.borderRadius = ''; // Setzt border-radius zurück
        });
    });


document.addEventListener("DOMContentLoaded", () => {
    // Erstelle den benutzerdefinierten Cursor
    const cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    // Aktualisiere die Position des Cursors bei Mausbewegung
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
    });

    // Optional: Zeige den benutzerdefinierten Cursor nur, wenn die Maus sich bewegt
    document.addEventListener("mouseleave", () => {
        cursor.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
        cursor.style.opacity = "1";
    });
});
