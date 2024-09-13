(() => {
  const pending = {};
  const handlers = {};
  const style = (e, o) => { for (let a in o) e.style[a] = o[a]; }
  const pushTask = (kind, ...args) => {
    if (handlers[kind]) handlers[kind](...args);
    else (pending[kind] ??= []).push(args);
  }

  window.onXBox = (kind, fn) =>{
    handlers[kind] = fn;
    let tasks = pending[kind];
    if (tasks) while (tasks.length) { fn(...tasks.pop()) }
  }

  customElements.define('c-box', class CBox extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<div><slot></slot></div>`;
    }
    connectedCallback() {
      const wrapper = this.shadowRoot.children[0];
      pushTask(this.getAttribute('kind'), wrapper, this.dataset);
      if (this.hasAttribute('ratio')) {
        const [w, h] = this.getAttribute('ratio').split('/');
        style(this, {
          height: 0,
          width: '100%',
          display: 'block',
          position: 'relative',
          paddingBottom: h / w * 100 + '%',
        });
        style(wrapper, {
          inset: 0,
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '1px solid orange',
        });
      }
      // TODO: fixed height components...
    }
  });
})();

