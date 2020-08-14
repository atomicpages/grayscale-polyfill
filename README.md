# Grayscale Polyfill

A tiny IE polyfill to make images grayscale.

## Motivation

[IE 10 and above dropped support for legacy DX filters](https://docs.microsoft.com/en-us/archive/blogs/ie/legacy-dx-filters-removed-from-ie10-release-preview) which cases major issues with applications that need to support legacy browsers. Currently solutions are written in jQuery or use the Canvas API which has issues with cross-browser compatibility. For those needing to support IE 10/11 and are not using something like d3 (or some other SVG manipulation library) this is for you.

## Usage

This package exports a single function `Grayscale` and expected to receive a single `HTMLImageElement`.

### Webpack/Rollup

```js
import { gray } from 'grayscale-polyfill';

gray(document.querySelector('img'));
```

### Browser

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Grayscale Demo</title>
    </head>
    <body>
        <img src="wowow.jpg" class="grayscale" alt="Something cool" />
        <script src="https://unpkg.com/grayscale-polyfill/dist-browser/index.js"></script>
        <script>
            Grayscale.gray(document.querySelector('.grayscale'));
        </script>
    </body>
</html>
```

## API

### Options API

| Option              | Type                   | Required | Description                                                                                |
| ------------------- | ---------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `polyfillCheck`     | `() => boolean`        | No       | Override the default polyfill check function.                                              |
| `svgId`             | `string`               | No       | Specify a custom SVG ID. This is the ID of the grayscale mask root `svg` element.          |
| `mode`              | `'replace' | 'manual'` | No       | Do not perform replacement. Return the instance of the `SVGElement` that has been created. |
| `grayscaleFilterId` | `string`               | No       | Specify a custom grayscale filter ID referenced by the SVG `Image` element                 |

### Exported Functions

Aside from options API, there are three (named) functions exported by this package:

| Function         | Parameters                                                           | Return Value                    | Description                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gray`           | `image: HTMLImageElement` <br /> `options?: GrayscaleOptions`        | `HTMLImageElement | SVGElement` | The main export from this package. This function creates the grayscale mask using the default grayscale filter ID and takes care of replacing `image` with the generated SVG `Image` element. |
| `createSvgImage` | `url: string` <br /> `width: number` <br /> `height: number`         | `SVGElement`                    | Creates the SVG `Image` element that is used to replace the original image                                                                                                                    |
| `createSvgMask`  | `id?: string` <br /> `filterId?: string` <br /> `root?: HTMLElement` | `SVGElement`                    | Returns the SVG element that contains the grayscale matrix                                                                                                                                    |

## Usage with React

```jsx
import * as React from 'react';
import { gray } from 'grayscale-polyfill';

const opts = { mode: 'manual' };

function App() {
    const [image, setImage] = React.useState(null);
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (ref.current) {
            setImage({ __html: gray(ref.current, opts).innerHTML });
        }
    }, []);

    return image ? <div dangerouslySetInnerHTML={image} /> : <img ref={ref} src="someimage.jpg" />;
}
```

Alternatively you can use something like [`react-html-parser`](https://www.npmjs.com/package/react-html-parser) to safely convert the resulting SVG code to a rea
ct component.

## Usage in Other Browsers

For really old versions of IE _and_ modern clients you can use regular CSS:

```css
.grayscale {
    filter: gray; /* IE 6 - 9 */
    filter: grayscale(1); /* evergreen browsers*/
}
```

If you have certain browsers that are especially fickle you can save a new file `gray.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
    <filter id="grayscale">
        <feColorMatrix
            type="matrix"
            values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"
        />
    </filter>
</svg>

<!-- or in a more compact way -->

<svg xmlns="http://www.w3.org/2000/svg">
    <filter id="grayscale">
        <feColorMatrix type="saturate" values="0" />
    </filter>
</svg>
```

then you can reference in CSS:

```css
.grayscale {
    filter: url('../../gray.svg#grayscale');
}
```
