

const demoRoot = document.getElementById('demo');

////////////
// OUTPUT //
////////////

const outputIframe = document.createElement('iframe');
outputIframe.setAttribute('id', 'output');
demoRoot.appendChild(outputIframe);
window.addEventListener('message', (evt) => {  
  const { type, message } = evt.data;
  if (type === 'html') {
    outputIframe.srcdoc = message;
  }
});

///////////
// INPUT //
///////////

const js = await fetch('./server/page.js').then(r => r.text());

const editor = document.createElement('pre');
editor.setAttribute('id', 'editor')
demoRoot.prepend(editor);

editor.innerText = js;

const blob = new Blob([js], { type: 'text/javascript' });
const blobUrl = URL.createObjectURL(blob);
const iframe = document.createElement('iframe');
iframe.style.display = 'none';
iframe.srcdoc = `
<!doctype html>
<html lang="en">
  <head>
    <script type="text/javascript">
      window.serveHTML = (html) => window.parent.postMessage({ type: 'html', message: html }, '*');
    </script>
  </head>
  <body>
    <script type="importmap">
      { "imports": { "genz": "https://esm.run/genz@0.9.7" } }
    </script>
    <script type="module" src="${blobUrl}">
    </script>
  </body>
</html>
`;
demoRoot.appendChild(iframe);