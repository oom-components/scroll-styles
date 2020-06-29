/**
 * Class to handle the scroll
 */
const defaultOptions = {
  name: "--scale",
  element: [0, 1],
  viewport: [1, 0],
  handler(element, scale, options) {
    element.style.setProperty(options.name, scale);
  },
};

export default class Scroll {
  constructor(options = {}) {
    this.observer = new IntersectionObserver(
      this.intersect.bind(this),
      options,
    );
    this.observed = new Map();
    this.visible = new Set();
    this.frame = null;
  }

  play() {
    if (this.callback) {
      return;
    }

    this.callback = this.update.bind(this);
    window.addEventListener("scroll", this.callback);
    window.addEventListener("resize", this.callback);
    this.update();
  }

  pause() {
    if (!this.callback) {
      return;
    }

    window.removeEventListener("scroll", this.callback);
    window.removeEventListener("resize", this.callback);
    this.callback = null;
  }

  observe(element, options = {}) {
    options = Object.assign({}, defaultOptions, options);

    const observe = () => {
      this.observer.observe(element);
      this.observed.set(element, options);
    };

    if (options.media) {
      const mq = matchMedia(options.media);

      mq.addListener((event) => {
        if (event.matches) {
          observe();
        } else {
          element.style.removeProperty(options.name, null);
          this.unobserve(element);
        }
      });

      if (mq.matches) {
        observe();
      }
      return;
    }

    observe();
  }

  unobserve(element) {
    this.observer.unobserve(element);
    this.observed.delete(element);
    this.visible.delete(element);
  }

  disconnect() {
    this.observer.disconnect();
    this.pause();
    this.observed = new Map();
    this.visible = new Set();
  }

  intersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        this.visible.delete(entry.target);
        return;
      }

      this.visible.add(entry.target);
    });

    if (this.visible.size) {
      this.play();
    } else {
      this.pause();
    }
  }

  update() {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }

    this.frame = requestAnimationFrame(() => {
      this.applyUpdate();
      this.frame = null;
    });
  }

  applyUpdate() {
    const viewportHeight = window.innerHeight;

    this.visible.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const options = this.observed.get(element);

      const from = (viewportHeight * options.viewport[0]) -
        (rect.height * options.element[0]);
      const to = (viewportHeight * options.viewport[1]) -
        (rect.height * options.element[1]);
      const scale = (rect.top - from) / (to - from);

      options.handler(element, Math.max(0, Math.min(scale, 1)), options);
    });
  }
}
