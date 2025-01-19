const fontUpload = document.getElementById('font-upload');
const svgUpload = document.getElementById('svg-upload');
const gridContainer = document.getElementById('grid-container');
const downloadFontButton = document.getElementById('download-font');
let uploadedFont;
let uploadedSvg;

// Filter-Steuerelemente
const baseFrequencyXSlider = document.getElementById('baseFrequencyX');
const baseFrequencyYSlider = document.getElementById('baseFrequencyY');
const numOctavesSlider = document.getElementById('numOctaves');
const scaleSlider = document.getElementById('scale');

// Schriftarten-Upload
fontUpload.addEventListener('change', (event) => {
    // Entfernen der SVGs, wenn eine Font hochgeladen wird
    uploadedSvg = null;
    gridContainer.innerHTML = '';
    
    const file = event.target.files[0];
    if (file) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const fontName = file.name.split('.').slice(0, -1).join('.');
            uploadedFont = file;
            const fontFace = new FontFace(fontName, fileReader.result);
            fontFace.load().then((loadedFont) => {
                document.fonts.add(loadedFont);
                displayGlyphs(fontName);
                downloadFontButton.disabled = false;
            });
        };
        fileReader.readAsArrayBuffer(file);
    }
});

// SVG-Datei hochladen
svgUpload.addEventListener('change', (event) => {
    // Entfernen der Font, wenn eine SVG hochgeladen wird
    uploadedFont = null;
    gridContainer.innerHTML = '';
    
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            uploadedSvg = fileReader.result;
            displaySvg(uploadedSvg);
        };
        fileReader.readAsText(file);
    }
});

// Anzeige der Schriftzeichen (SVGs) mit der Klasse 'letter-svg'
function displayGlyphs(fontName) {
    gridContainer.innerHTML = '';
    for (let i = 32; i <= 126; i++) { // ASCII sichtbare Zeichen
        const glyphContainer = document.createElement('div');
        glyphContainer.className = 'glyph';

        const svg = createFilteredSVG(String.fromCharCode(i), fontName);
        svg.classList.add('letter-svg');
        glyphContainer.appendChild(svg);
        gridContainer.appendChild(glyphContainer);
    }
}

// Anzeige des hochgeladenen SVG mit der übernommenen Größe
function displaySvg(svgContent) {
    gridContainer.innerHTML = '';
    const svgElement = new DOMParser().parseFromString(svgContent, 'image/svg+xml').documentElement;
    svgElement.setAttribute('width', svgElement.getAttribute('width') || '150');
    svgElement.setAttribute('height', svgElement.getAttribute('height') || '150');
    svgElement.style.filter = 'none'; // No filter applied to the border

    // Apply turbulence filter only to the content (inside path or text)
    const svgPaths = svgElement.querySelectorAll('path, text');
    svgPaths.forEach((path) => {
        path.style.filter = 'url(#turbulenceFilter)';
    });

    gridContainer.appendChild(svgElement);
}

// Erstellen eines gefilterten SVGs für Schriftzeichen
function createFilteredSVG(char, fontName) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '150');
    svg.setAttribute('height', '150');
    svg.setAttribute('xmlns', svgNS);
    svg.style.filter = 'none'; // No filter applied to the border

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '50%');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', fontName);
    text.setAttribute('font-size', '100');
    text.textContent = char;

    // Apply turbulence filter only to the text inside the svg
    text.style.filter = 'url(#turbulenceFilter)';

    svg.appendChild(text);
    return svg;
}

// Downloaden der bearbeiteten Datei
downloadFontButton.addEventListener('click', () => {
    if (uploadedFont) {
        const fontName = uploadedFont.name.split('.').slice(0, -1).join('.');
        const filteredFontBlob = generateFontFromFilteredGlyphs(fontName);

        const link = document.createElement('a');
        link.href = URL.createObjectURL(filteredFontBlob);
        link.download = `${fontName}_Filtered.otf`;
        link.click();
    } else if (uploadedSvg) {
        const link = document.createElement('a');
        const blob = new Blob([uploadedSvg], { type: 'image/svg+xml' });
        link.href = URL.createObjectURL(blob);
        link.download = 'filtered_svg.svg';
        link.click();
    }
});

// Funktion zur Generierung der bearbeiteten Schriftart
function generateFontFromFilteredGlyphs(fontName) {
    const glyphs = [];
    for (let i = 32; i <= 126; i++) { // ASCII sichtbare Zeichen
        const char = String.fromCharCode(i);
        const svgElement = createFilteredSVG(char, fontName);
        const pathData = extractPathData(svgElement);

        const opentypePath = svgPathToOpenTypePath(pathData);

        glyphs.push(new opentype.Glyph({
            name: `glyph${i}`,
            unicode: i,
            path: opentypePath,
            advanceWidth: 600,
        }));
    }

    const font = new opentype.Font({
        familyName: `${fontName}_Filtered`,
        styleName: 'Regular',
        unitsPerEm: 1000,
        ascender: 800,
        descender: -200,
        glyphs: glyphs,
    });

    const arrayBuffer = font.toArrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'font/otf' });
    return blob;
}

// Filter anwenden
function updateFilter() {
    const turbulence = document.querySelector('#turbulenceFilter feTurbulence');
    const displacementMap = document.querySelector('#turbulenceFilter feDisplacementMap');

    const baseFrequencyValue = `${baseFrequencyXSlider.value},${baseFrequencyYSlider.value}`;
    turbulence.setAttribute('baseFrequency', baseFrequencyValue);
    turbulence.setAttribute('numOctaves', numOctavesSlider.value);
    displacementMap.setAttribute('scale', scaleSlider.value);

    if (uploadedFont) {
        const fontName = uploadedFont.name.split('.').slice(0, -1).join('.');
        displayGlyphs(fontName);
    } else if (uploadedSvg) {
        displaySvg(uploadedSvg);
    }
}

baseFrequencyXSlider.addEventListener('input', updateFilter);
baseFrequencyYSlider.addEventListener('input', updateFilter);
numOctavesSlider.addEventListener('input', updateFilter);
scaleSlider.addEventListener('input', updateFilter);
