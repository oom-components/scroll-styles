# @oom/scroll-styles

Javascript library to apply css custom properties depending on the scroll position, allowing to create scrolling efects like parallax. It has the following features:

* No dependencies
* Superlight
* High performance
* Follows the **progressive enhancement strategy**
* Built with ES6, so you may need a transpiler for old browser support

It's inspired by [basicScroll](https://github.com/electerious/basicScroll) library but lighter and with better performance, in order to be more flexible and customizable.

## Install

Requirements:

* NPM or Yarn to install [the package and the dependencies](https://www.npmjs.com/@oom/scroll-styles)
* It uses [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when the elements are visible in the viewport and [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to perform the animations.

```sh
npm install @oom/scroll-styles
```

## Usage

```js
import Scroll from './vendors/@oom/scroll-styles/src/scroll.js';

const scroll = new Scroll();

//Register an element to observe
const element = document.querySelector('.parallax');

scroll.observe(element, {
    name: '--scale', // Name of the custom property
    element: 0,      // Element intersection (0 = top, 1 = bottom, 0.5 = middle, etc)
    viewport: 1,      // Viewport intersection (0 = top, 1 = bottom, 0.5 = middle, etc)

    //Custom handler, if you want to do more things that just update the property
    handler(element, scale, options) {
        element.style.setProperty(options.name, scale);
    }
})

//Init the library (attach events on scroll and resize)
scroll.init();
```

The `--scale` variable is a float number between 0 and 1, so you can use it in the css code:

```css
.parallax {
    /* Use the value as is */
    opacity: var(--scale, 1);

    /* Use calc() to convert to other units */
    transform: translateY(calc(var(--scale, 1) * 50rem));
}
```

## Demo

To run the demo, just clone this repository, enter in the directory and execute:

```sh
npm install
npm start
```

You should see something in `http://localhost:8080/`

There's an online demo here: https://oom-components.github.io/scroll-styles/
