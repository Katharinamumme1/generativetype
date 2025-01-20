import { drawLetter } from './letters.js';

export let elementWidths = {};
export let formVersion;
export let horizontalLineY;
export let middleLineLength;
export let useLineVersion;
export let lineStyle;
export let isIrregularDotted;
export let stammParameters = {}; // Hinzufügen der Initialisierung
export let dotSize;
export let dotSpacing;
export let numPolygonPoints;
export let style; 
export let serif; // Hinzufügen der Serif-Parameter
export let serifType;
export let serifHeight;
export let topWidth;


function initializeStammParameters() {
    const isCurved = Math.random() < 0.5;
    stammParameters = {
        topWidth: Math.random() * (90 - 5) + 5,
        bottomWidth: Math.random() * (130 - 20) + 5,
        numSegmentsLeftCurves: Math.floor(Math.random() * 3) + 0,
        numSegmentsRightCurves: Math.floor(Math.random() * 3) + 0,
        numSegmentsLeftCorners: Math.floor(Math.random() * 6) + 0,
        numSegmentsRightCorners: Math.floor(Math.random() * 6) + 0,
        isParallel: Math.random() < 0.5,
        isCurved
    };
    useLineVersion = Math.random() < 0.5;
}






export function generateAlphabet() {
    const alphabetContainer = document.getElementById('alphabetContainer');
    if (alphabetContainer) {
        alphabetContainer.innerHTML = '';
    }

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const width = 250;
    const capHeight = 200;
    const ascenderHeight = capHeight * 0.6;
    const descenderHeight = capHeight * 0.3;
    const xHeight = capHeight * 0.7;
    const baseline = capHeight + descenderHeight;

    initializeStammParameters(); // Initialisierung der Stammparameter

    elementWidths = {
        lineStartWidth: stammParameters.topWidth,
        lineEndWidth: stammParameters.topWidth,
        arcStartWidth: stammParameters.topWidth,
        arcEndWidth: stammParameters.topWidth,
        archStartWidth: stammParameters.bottomWidth,
        archEndWidth: stammParameters.bottomWidth
    };

    const minDistanceFromTop = capHeight / 4;
    const maxDistanceFromBottom = capHeight * 3 / 4;
    horizontalLineY = baseline - capHeight + Math.random() * (maxDistanceFromBottom - minDistanceFromTop) + minDistanceFromTop;

    const leftX = width * 0.4;
    const rightX = width * 0.6;
    const minLength = (rightX - leftX) * 0.3;
    const maxLength = rightX - leftX;
    middleLineLength = Math.random() * (maxLength - minLength) + minLength;

    serifHeight = Math.min(stammParameters.topWidth, stammParameters.bottomWidth); 

    const lineStyles = ['solid', 'dotted'];
    lineStyle = lineStyles[Math.floor(Math.random() * lineStyles.length)];
    isIrregularDotted = Math.random() > 0.5;

    dotSize = Math.random() * 110 + 5;
    dotSpacing = Math.random() * 60 + 1;

    const fontColor = document.getElementById('secondary-color').value;

    numPolygonPoints = Math.floor(Math.random() * 8) + 1;

    const styles = ['keinstyle', 'outline', 'hatched'];
    style = styles[Math.floor(Math.random() * styles.length)]; // Setzen des style-Parameters

    const serifOptions = [true, false];
    serif = serifOptions[Math.floor(Math.random() * serifOptions.length)]; // Zufällig Serifen einfügen oder nicht
    const serifTypes = ['rectangle', 'triangle', 'trapezoid'];
    serifType = serif ? serifTypes[Math.floor(Math.random() * serifTypes.length)] : null; // Zufällige Auswahl der Art der Serifen

    const alphabetSVGs = {};
    letters.forEach(letter => {
        const svg = createSvg(width, baseline + ascenderHeight + descenderHeight);

      
        drawLetter(svg, letter, 200, baseline, capHeight, ascenderHeight, descenderHeight, xHeight, style, fontColor); // Monospaced Breite fixieren
        alphabetSVGs[letter] = svg;
    });

    if (alphabetContainer) {
        Object.values(alphabetSVGs).forEach(svg => {
            const wrapperDiv = document.createElement('div');
            wrapperDiv.classList.add('letter-wrapper');
            wrapperDiv.style.width = '200px'; // Feste Breite für Monospaced
            wrapperDiv.style.height = '200px';
            wrapperDiv.appendChild(svg);
            alphabetContainer.appendChild(wrapperDiv);
        });
    }

    return alphabetSVGs;
}





function createSvg(width, height) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.classList.add('letter-canvas');
    return svg;
}



// Neue Funktion zum Generieren von 30 Variationen eines ausgewählten Buchstabens
export function generateLetterVariations(letter) {
    const letterVariationsContainer = document.getElementById('letterVariationsContainer');
    if (letterVariationsContainer) {
        letterVariationsContainer.innerHTML = '';
    }

    const width = 250;
    const capHeight = 200;
    const ascenderHeight = capHeight * 0.6;
    const descenderHeight = capHeight * 0.3;
    const xHeight = capHeight * 0.7;
    const baseline = capHeight + descenderHeight;

    const fontColor = document.getElementById('secondary-color').value;

    const variations = [];

    for (let i = 0; i < 60; i++) {
        initializeStammParameters(); // Initialisierung der Stammparameter bei jedem Zeichenvorgang

        elementWidths = {
            lineStartWidth: stammParameters.topWidth,
            lineEndWidth: stammParameters.topWidth,
            arcStartWidth: stammParameters.topWidth,
            arcEndWidth: stammParameters.topWidth,
            archStartWidth: stammParameters.bottomWidth,
            archEndWidth: stammParameters.bottomWidth
        };

        const minDistanceFromTop = capHeight / 4;
        const maxDistanceFromBottom = capHeight * 3 / 4;
        horizontalLineY = baseline - capHeight + Math.random() * (maxDistanceFromBottom - minDistanceFromTop) + minDistanceFromTop;

        const leftX = width * 0.4;
        const rightX = width * 0.6;
        const minLength = (rightX - leftX) * 0.3;
        const maxLength = rightX - leftX;
        middleLineLength = Math.random() * (maxLength - minLength) + minLength;

        serifHeight = Math.min(stammParameters.topWidth, stammParameters.bottomWidth); 

        const lineStyles = ['solid', 'dotted'];
        lineStyle = lineStyles[Math.floor(Math.random() * lineStyles.length)];
        isIrregularDotted = Math.random() > 0.5;

        dotSize = Math.random() * 110 + 5;
        dotSpacing = Math.random() * 60 + 1;

        numPolygonPoints = Math.floor(Math.random() * 8) + 1;

        const styles = ['keinstyle', 'outline', 'hatched'];
        style = styles[Math.floor(Math.random() * styles.length)]; // Setzen des style-Parameters

        const serifOptions = [true, false];
        serif = serifOptions[Math.floor(Math.random() * serifOptions.length)]; // Zufällig Serifen einfügen oder nicht
        const serifTypes = ['rectangle', 'triangle', 'trapezoid'];
        serifType = serif ? serifTypes[Math.floor(Math.random() * serifTypes.length)] : null; // Zufällige Auswahl der Art der Serifen

        const svg = createSvg(width, baseline + ascenderHeight + descenderHeight);
        drawLetter(svg, letter, width, baseline, capHeight, ascenderHeight, descenderHeight, xHeight, style, fontColor); // Stil hinzufügen

        variations.push(svg);
    }

    return variations;
}