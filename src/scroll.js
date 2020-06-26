/**
 * Class to handle the scroll
 */
const defaultOptions = {
  name: "--scale",
  element: 0,
  viewport: 1,
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

  init() {
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

    this.observer.observe(element);
    this.observed.set(element, options);
  }

  observe(element, options = {}) {
    options = Object.assign({}, defaultOptions, options);

    this.observer.observe(element);
    this.observed.set(element, options);
  }

  unobserve(element) {
    this.observer.unobserve(element);
    this.observed.delete(element);
    this.visible.delete(element);
  }

  disconnect() {
    this.observer.disconnect();
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
      this.init();
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

      const y = rect.top + rect.height * options.element;
      const height = viewportHeight * options.viewport;
      const scale = 1 - Math.max(0, Math.min((y - height) / height, 1));

      options.handler(element, scale, options);
    });
  }
}
