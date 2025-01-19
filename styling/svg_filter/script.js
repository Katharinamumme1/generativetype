const fontUpload = document.getElementById('font-upload');
const gridContainer = document.getElementById('grid-container');
const downloadFontButton = document.getElementById('download-font');
let uploadedFont;

// Filter-Steuerelemente
const baseFrequencyXSlider = document.getElementById('baseFrequencyX');
const baseFrequencyYSlider = document.getElementById('baseFrequencyY');
const numOctavesSlider = document.getElementById('numOctaves');
const scaleSlider = document.getElementById('scale');

fontUpload.addEventListener('change', (event) => {
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

function displayGlyphs(fontName) {
    gridContainer.innerHTML = '';
    for (let i = 32; i <= 126; i++) { // ASCII sichtbare Zeichen
        const glyphContainer = document.createElement('div');
        glyphContainer.className = 'glyph';

        const svg = createFilteredSVG(String.fromCharCode(i), fontName);
        glyphContainer.appendChild(svg);
        gridContainer.appendChild(glyphContainer);
    }
}

function createFilteredSVG(char, fontName) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '150');
    svg.setAttribute('height', '150');
    svg.setAttribute('xmlns', svgNS);
    svg.style.filter = 'url(#turbulenceFilter)';

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', '50%');
    text.setAttribute('y', '50%');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', fontName);
    text.setAttribute('font-size', '100');
    text.textContent = char;

    svg.appendChild(text);
    return svg;
}

function extractPathData(svg) {
    const svgData = new XMLSerializer().serializeToString(svg);
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgData, 'image/svg+xml');
    const textElement = doc.querySelector('text');
    if (!textElement) {
        throw new Error('Kein Textpfad gefunden');
    }
    return textElement.getAttribute('d') || '';
}

function svgPathToOpenTypePath(svgPathData) {
    const commands = new opentype.Path();
    const pathData = new SVGPathData(svgPathData);

    pathData.commands.forEach((command) => {
        if (command.type === SVGPathData.MOVE_TO) {
            commands.moveTo(command.x, command.y);
        } else if (command.type === SVGPathData.LINE_TO) {
            commands.lineTo(command.x, command.y);
        } else if (command.type === SVGPathData.CURVE_TO) {
            commands.curveTo(command.x1, command.y1, command.x2, command.y2, command.x, command.y);
        } else if (command.type === SVGPathData.CLOSE_PATH) {
            commands.closePath();
        }
    });

    return commands;
}

function generateFontFromFilteredGlyphs(fontName) {
    const glyphs = [];
    for (let i = 32; i <= 126; i++) {
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

downloadFontButton.addEventListener('click', () => {
    if (uploadedFont) {
        const fontName = uploadedFont.name.split('.').slice(0, -1).join('.');
        const filteredFontBlob = generateFontFromFilteredGlyphs(fontName);

        const link = document.createElement('a');
        link.href = URL.createObjectURL(filteredFontBlob);
        link.download = `${fontName}_Filtered.otf`;
        link.click();
    }
});

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
    }
}

baseFrequencyXSlider.addEventListener('input', updateFilter);
baseFrequencyYSlider.addEventListener('input', updateFilter);
numOctavesSlider.addEventListener('input', updateFilter);
scaleSlider.addEventListener('input', updateFilter);
