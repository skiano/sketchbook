import { createRoot } from 'react-dom';
import { createElement as h } from 'react';

function Greeting({ name }) {
  return h('h1', { className: 'greeting' }, `Hello ${ name }`);
}

window.onXBox('greeting', (root, props) => {
  createRoot(root).render(
    Greeting({
      name: props.name,
    })
  );
});