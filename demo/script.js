import Scroll from '../src/scroll.js';

const scroll = new Scroll();

scroll.observe(document.querySelector('#element'), {
    viewport: 0.5,
    element: 0,
});

scroll.init();
