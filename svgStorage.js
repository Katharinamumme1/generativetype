// svgStorage.js

/**
 * Speichert ein SVG im localStorage.
 * @param {string} svgContent - Der Inhalt des SVGs als String.
 */
function saveSVG(svgContent) {
    const savedSVGs = JSON.parse(localStorage.getItem('svgData')) || [];
    savedSVGs.push(svgContent);
    localStorage.setItem('svgData', JSON.stringify(savedSVGs));
}

/**
 * Lädt alle gespeicherten SVGs aus dem localStorage und gibt sie zurück.
 * @returns {Array} - Array der gespeicherten SVG-Strings.
 */
function loadSVGs() {
    return JSON.parse(localStorage.getItem('svgData')) || [];
}

/**
 * Zeigt alle gespeicherten SVGs in einem angegebenen Container an.
 * @param {string} containerId - Die ID des Containers, in dem die SVGs angezeigt werden sollen.
 */
function displaySVGs(containerId) {
    const savedSVGs = loadSVGs();
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID "${containerId}" nicht gefunden.`);
        return;
    }
    container.innerHTML = savedSVGs.map(svg => `<div>${svg}</div>`).join('');
}

/**
 * Löscht alle gespeicherten SVGs aus dem localStorage und leert den angegebenen Container.
 * @param {string} containerId - Die ID des Containers, der geleert werden soll.
 */
function clearSVGs(containerId) {
    localStorage.removeItem('svgData');
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}
