import * as React from 'react';
import { FILTER_ROOT } from './svg';

export type GrayscaleProps<T extends keyof SVGElementTagNameMap> = React.SVGAttributes<T> & {
    image: HTMLImageElement;
    filter?: string;
};

export const Grayscale: React.FC<GrayscaleProps<'svg'>> = ({
    image,
    filter = FILTER_ROOT,
    ...rest
}: GrayscaleProps<'svg'>) => {
    const svg = React.useRef<SVGElement>(null);
    const img = React.useRef<SVGImageElement>(null);

    React.useEffect(() => {
        if (image && svg.current && img.current) {
            const { width, height } = image.getBoundingClientRect();

            svg.current.setAttribute('viewBox', `0 0 ${width} ${height}`);
            svg.current.setAttribute('width', width + '');
            svg.current.setAttribute('height', height + '');

            img.current.setAttribute('width', width + '');
            img.current.setAttribute('height', height + '');
            img.current.setAttribute('href', image.src);
        }
    }, [image]);

    return React.createElement(
        'svg',
        {
            version: '1.1',
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            role: 'img',
            ...rest,
        },
        <image ref={img} filter={`url("#${filter}")`} x="0" y="0" preserveAspectRatio="none meet" />
    );
};
