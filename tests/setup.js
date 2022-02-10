const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { act } = require('react-dom/test-utils');
require('regenerator-runtime/runtime');

window.requestAnimationFrame = (func) => {
  window.setTimeout(func, 16);
};

Enzyme.configure({ adapter: new Adapter() });

Object.assign(Enzyme.ReactWrapper.prototype, {
  triggerMotionEvent(target) {
    const motionEvent = new Event('transitionend');
    if (target) {
      Object.defineProperty(motionEvent, 'target', {
        get: () => target.getDOMNode(),
      });
    }

    act(() => {
      const element = this.find('CSSMotion').getDOMNode();
      element.dispatchEvent(motionEvent);
      this.update();
    });

    return this;
  },
});

// https://github.com/jsdom/jsdom/issues/135#issuecomment-68191941
Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    get() {
      let offsetLeft = 0;
      for (const child of Array.from(this.parentNode.children)) {
        offsetLeft += child.clientWidth;
        if (child === this) {
          break;
        }
      }
      return offsetLeft;
    },
  },
  clientWidth: {
    get() {
      // text length + vertical padding
      return this.textContent.length * 14 + 20;
    },
  },
});
