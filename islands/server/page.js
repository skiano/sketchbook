import { _, toString, createTag } from 'genz';

const island = createTag('gen-z');
const Greeting = ({ name }) => island({ is: 'greeting', class: 'test-box', ratio: '4/1', 'data-name': name });
const Other = ({ id }) => island({ is: 'carousel', class: 'test-box', height: '240px', 'data-id': id }, '<p>hello</p>');

const page = _.html({ lang: 'en' },
  _.head(
    _.meta({ charset: 'UTF-8' }),
    _.meta({ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
    _.title('genz server + client example'),
    _.link({ rel: 'stylesheet', href: './client/reset.css' }),
    _.link({ rel: 'stylesheet', href: './client/app.css' }),
    _.script({ src: 'https://cdn.jsdelivr.net/npm/genz@0.10.2/addons/client.min.js' }),
  ),
  _.body(
    Greeting({ name: 'Sara' }),
    Greeting({ name: 'Bob' }),
    Greeting({ name: 'Jeff' }),
    Other({ id: '1wqeqwewqe' }),
    _.script({ type: 'importmap'}, JSON.stringify({
      "imports": {
        "react": "https://esm.run/react@18.3.1",
        "react-dom": "https://esm.run/react-dom@18.3.1"
      }
    })),
    _.script({ src: './client/react-components.js', type: 'module' }),
  )
)

// Injected into global context by demo.js
serveHTML(toString(page));

// <hold-it is="greeting">