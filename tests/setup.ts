require('regenerator-runtime/runtime');

window.requestAnimationFrame = (func) => {
  return window.setTimeout(func, 16);
};

window.cancelAnimationFrame = (id) => {
  return window.clearTimeout(id);
};

// https://github.com/jsdom/jsdom/issues/135#issuecomment-68191941
Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    get() {
      let offsetLeft = 0;
      const childList: HTMLElement[] = Array.from(
        (this.parentNode as HTMLElement).querySelectorAll('.rc-segmented-item'),
      );
      for (let i = 0; i < childList.length; i++) {
        const child = childList[i];
        const lastChild = childList[i - 1];
        offsetLeft += lastChild?.clientWidth || 0;
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
