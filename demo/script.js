import Scroll from "../src/scroll.js";

const scroll = new Scroll();

scroll.observe(document.querySelector("#element"), {
  viewport: [1, 0],
  element: [0, 0.5],
});

scroll.observe(document.querySelector("#element2"), {
  viewport: [1, 0],
  element: [0, 0.5],
  media: "(min-width: 800px)",
});
