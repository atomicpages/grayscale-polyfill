import { gray } from '../src/index';

window.addEventListener('DOMContentLoaded', () => {
    const opts = {
        polyfillCheck: () => true,
    };

    document.querySelectorAll('.grayscale').forEach((e: HTMLImageElement) => {
        gray(e, opts);
    });
});
