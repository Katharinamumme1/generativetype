function enableSVGInteractions() {
    let selectedElement = null;
    let offset = { x: 0, y: 0 };
    let initialScale = 1;
    let isResizing = false;

    function addResizeAndRotateControl(element) {
        const controlDiv = document.createElement('div');
        controlDiv.classList.add('resize-rotate-controls');

        const scaleControl = document.createElement('button');
        scaleControl.innerText = 'Skalieren';
        scaleControl.addEventListener('click', () => {
            scaleElement(element);
        });

        const rotateControl = document.createElement('button');
        rotateControl.innerText = 'Rotieren';
        rotateControl.addEventListener('click', () => {
            rotateElement(element);
        });

        controlDiv.appendChild(scaleControl);
        controlDiv.appendChild(rotateControl);
        element.appendChild(controlDiv);
    }

    function scaleElement(element) {
        const currentTransform = element.getAttribute('transform') || '';
        let scale = 1;

        scale = prompt("Geben Sie den Skalierungsfaktor ein (z.B. 1.5):", "1");

        if (scale) {
            const newTransform = currentTransform.replace(/scale\([^\)]+\)/, '') + ` scale(${scale})`;
            element.setAttribute('transform', newTransform);
        }
    }

    function rotateElement(element) {
        const currentTransform = element.getAttribute('transform') || '';
        let rotate = 0;

        rotate = prompt("Geben Sie den Rotationswinkel ein (z.B. 45):", "0");

        if (rotate) {
            const newTransform = currentTransform.replace(/rotate\([^\)]+\)/, '') + ` rotate(${rotate})`;
            element.setAttribute('transform', newTransform);
        }
    }

    const startDragGlyphElement = (event) => {
        if (!event.target.closest('.letter-svg') || event.target.classList.contains('line')) {
            console.log('Kein gültiges Glyphen-SVG oder ein Hilfselement wurde ausgewählt:', event.target);
            return;
        }

        selectedElement = event.target;
        const transform = selectedElement.getAttribute('transform');

        if (transform) {
            addResizeAndRotateControl(selectedElement);
        }

        const translate = transform ? transform.match(/translate\(([-\d.]+), ([-\d.]+)\)/) : null;
        if (translate) {
            offset.x = event.clientX - parseFloat(translate[1]);
            offset.y = event.clientY - parseFloat(translate[2]);
        } else {
            offset.x = event.clientX;
            offset.y = event.clientY;
            selectedElement.setAttribute('transform', 'translate(0, 0)');
        }

        document.addEventListener('mousemove', dragGlyphElement);
        document.addEventListener('mouseup', endDragGlyphElement);
        console.log('Drag gestartet für Element in Glyph:', selectedElement);
    };

    const dragGlyphElement = (event) => {
        if (!selectedElement || isResizing) return;

        const x = event.clientX - offset.x;
        const y = event.clientY - offset.y;

        const transform = selectedElement.getAttribute('transform') || 'translate(0, 0) scale(1)';
        const scaleMatch = transform.match(/scale\(([\d.]+)\)/);
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

        selectedElement.setAttribute('transform', `translate(${x}, ${y}) scale(${scale})`);
        console.log('Element bewegt zu:', x, y);
    };

    const endDragGlyphElement = () => {
        if (selectedElement) {
            console.log('Drag beendet für Element in Glyph:', selectedElement);
        }
        selectedElement = null;
        document.removeEventListener('mousemove', dragGlyphElement);
        document.removeEventListener('mouseup', endDragGlyphElement);
    };

    const startResizeGlyphElement = (event) => {
        if (!event.target.closest('.letter-svg') || event.target.classList.contains('line')) {
            console.log('Kein gültiges Glyphen-SVG oder ein Hilfselement wurde ausgewählt:', event.target);
            return;
        }

        selectedElement = event.target;
        isResizing = true;
        document.addEventListener('mousemove', resizeGlyphElement);
        document.addEventListener('mouseup', endResizeGlyphElement);
        console.log('Resize gestartet für Element in Glyph:', selectedElement);
    };

    const resizeGlyphElement = (event) => {
        if (!selectedElement || !isResizing) return;

        const boundingBox = selectedElement.getBBox();
        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const scale = Math.max(0.1, Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2) / 100);
        initialScale = scale;

        const transform = selectedElement.getAttribute('transform') || 'translate(0, 0) scale(1)';
        const translateMatch = transform.match(/translate\(([-\d.]+), ([-\d.]+)\)/);
        const translateX = translateMatch ? parseFloat(translateMatch[1]) : 0;
        const translateY = translateMatch ? parseFloat(translateMatch[2]) : 0;

        selectedElement.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
        console.log('Element skaliert zu:', scale);
    };

    const endResizeGlyphElement = () => {
        if (selectedElement) {
            console.log('Resize beendet für Element in Glyph:', selectedElement);
        }
        selectedElement = null;
        isResizing = false;
        document.removeEventListener('mousemove', resizeGlyphElement);
        document.removeEventListener('mouseup', endResizeGlyphElement);
    };

    const startDragComponent = (event) => {
        const target = event.target.closest('.component_svg');
        if (!target) {
            console.log('Kein gültiges Komponenten-SVG:', event.target);
            return;
        }

        selectedElement = target;
        const boundingBox = selectedElement.getBoundingClientRect();
        offset.x = event.clientX - boundingBox.left;
        offset.y = event.clientY - boundingBox.top;

        document.addEventListener('mousemove', dragComponent);
        document.addEventListener('mouseup', endDragComponent);

        console.log('Komponente zum Ziehen gestartet:', selectedElement.id);
    };

    const dragComponent = (event) => {
        if (!selectedElement) return;

        const x = event.clientX - offset.x;
        const y = event.clientY - offset.y;

        selectedElement.style.position = 'absolute';
        selectedElement.style.left = `${x}px`;
        selectedElement.style.top = `${y}px`;
    };

    const endDragComponent = (event) => {
        if (!selectedElement) return;

        const targetGlyph = event.target.closest('.letter-svg');
        if (targetGlyph) {
            const componentContent = selectedElement.innerHTML;
            const parser = new DOMParser();
            const componentDoc = parser.parseFromString(`<svg xmlns='http://www.w3.org/2000/svg'>${componentContent}</svg>`, 'image/svg+xml');
            const componentElement = componentDoc.documentElement.firstElementChild;

            if (componentElement) {
                const importedComponent = targetGlyph.ownerDocument.importNode(componentElement, true);
                importedComponent.setAttribute('transform', 'translate(0, 0) scale(0.25)');
                targetGlyph.appendChild(importedComponent);
                console.log('Komponente erfolgreich in Glyph platziert:', targetGlyph.id);
            }
        }

        selectedElement.style.position = '';
        selectedElement.style.left = '';
        selectedElement.style.top = '';
        selectedElement = null;

        document.removeEventListener('mousemove', dragComponent);
        document.removeEventListener('mouseup', endDragComponent);
    };

    const glyphSVGs = document.querySelectorAll('.letter-svg');
    glyphSVGs.forEach((glyph) => {
        glyph.addEventListener('mousedown', startDragGlyphElement);
        glyph.addEventListener('dblclick', startResizeGlyphElement);
    });

    const componentSVGs = document.querySelectorAll('.component_svg');
    componentSVGs.forEach((component) => {
        component.addEventListener('mousedown', startDragComponent);
    });
}

document.addEventListener('DOMContentLoaded', enableSVGInteractions);