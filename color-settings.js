// Initialfarben
let primaryColor = "#ffffff"; 
let secondaryColor = "#000000"; 

// Funktion: Farben anwenden
function applyColors() {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}

// Farben initial anwenden
applyColors();

// Event-Listener für Farbänderungen
document.getElementById("primary-color").addEventListener("input", (event) => {
    primaryColor = event.target.value;
    applyColors();
});

document.getElementById("secondary-color").addEventListener("input", (event) => {
    secondaryColor = event.target.value;
    applyColors();
});

// Farben tauschen
document.getElementById("swap-colors").addEventListener("click", () => {
    [primaryColor, secondaryColor] = [secondaryColor, primaryColor];
    applyColors();

    // Farbwerte in den Inputs aktualisieren
    document.getElementById("primary-color").value = primaryColor;
    document.getElementById("secondary-color").value = secondaryColor;
});

