const ns = 'http://www.w3.org/2000/svg';
const GRAY_ROOT = 'gray-root';

export const FILTER_ROOT = 'grayscale';

export function createSvg<T extends keyof SVGElementTagNameMap>(
    element: T,
    // FIXME: get working with actual SVG attributes
    attr?: Record<string, string | number>
): SVGElementTagNameMap[T] {
    const elem = document.createElementNS<T>(ns, element);

    if (attr) {
        Object.keys(attr).forEach(key => {
            elem.setAttribute(key, attr[key] + '');
        });
    }

    return elem;
}

export function createSvgRoot(attr?: Record<string, string | number>): SVGSVGElement {
    return createSvg('svg', {
        version: '1.1',
        xmlns: ns,
        ...attr,
    });
}

/**
 * Creates the default SVG mask if it doesn't exist
 * in the DOM.
 */
export function createSvgMask(
    id?: string,
    filterId: string = FILTER_ROOT,
    root: HTMLElement = document.body
): void {
    if (!document.getElementById(id || GRAY_ROOT)) {
        const svg = createSvgRoot({
            id: GRAY_ROOT,
            width: 0,
            height: 0,
            style: 'position: absolute;',
        });

        const defs = createSvg('defs');

        const filter = createSvg('filter', {
            id: filterId,
        });

        const feColorMatrix = createSvg('feColorMatrix', {
            type: 'saturate',
            values: '0',
        });

        filter.appendChild(feColorMatrix);
        defs.appendChild(filter);
        svg.appendChild(defs);

        root.appendChild(svg);
    }
}
