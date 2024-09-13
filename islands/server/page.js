import { _, toString, createTag } from 'genz';

const cBox = createTag('c-box');
const Greeting = ({ name }) => cBox({ ratio: '4/1', kind: 'greeting', 'data-name': name });

const page = _.html({ lang: 'en' },
  _.head(`
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Skiano | Islands</title>
    <link rel="stylesheet" href="./client/reset.css">
    <link rel="stylesheet" href="./client/app.css">
    <script src="./client/cbox.js"></script>
  `),
  _.body(
    Greeting({ name: 'Sara' }),
    Greeting({ name: 'Bob' }),
    Greeting({ name: 'Jeff' }),
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