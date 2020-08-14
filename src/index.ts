import { createSvg, createSvgRoot, createSvgMask, FILTER_ROOT } from './svg';

type GrayscaleOptions = {
    /**
     * Override the default polyfill check function.
     */
    polyfillCheck?: () => boolean;

    /**
     * Specify a custom SVG ID. This is the ID
     * of the grayscale mask root `svg` element.
     */
    svgId?: string;

    /**
     * Do not perform replacement. Return the instance
     * of the `SVGElement` that has been created.
     */
    mode?: 'replace' | 'manual';

    /**
     * Specify your own grayscale ID.
     */
    grayscaleFilterId?: string;
};

const requiresPolyfill = () => /Trident\/[67]\.0/gi.test(window.navigator.userAgent);

export function createSvgImage(url: string, width: number, height: number) {
    const shared = {
        width,
        height,
    };

    const root = createSvgRoot({
        ...shared,
        viewBox: `0 0 ${width} ${height}`,
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        role: 'img',
    });

    const image = createSvg('image', {
        ...shared,
        filter: `url("#${FILTER_ROOT}")`,
        x: '0',
        y: '0',
        preserveAspectRatio: 'none meet',
        href: url,
    });

    root.appendChild(image);

    return root;
}

export function gray(
    image: HTMLImageElement,
    {
        svgId,
        polyfillCheck = requiresPolyfill,
        mode = 'replace',
        grayscaleFilterId,
    }: GrayscaleOptions = {}
): HTMLImageElement | SVGElement {
    if (polyfillCheck()) {
        createSvgMask(svgId, grayscaleFilterId);
        const { width, height } = image.getBoundingClientRect();
        const svgImage = createSvgImage(image.src, width, height);

        if (mode === 'replace') {
            image.parentNode.replaceChild(svgImage, image);
        }

        return svgImage;
    }

    return image;
}

export { createSvgMask };
