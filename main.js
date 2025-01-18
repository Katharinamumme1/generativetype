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