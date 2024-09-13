import { createRoot } from 'react-dom';
import { createElement as h } from 'react';

const Greeting = ({ name }) => {
  return h('h1', { className: 'greeting' }, `Hello ${ name }`);
}

window.onXBox('greeting', (root, props) => createRoot(root).render(Greeting(props)));