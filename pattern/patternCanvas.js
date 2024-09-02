const DPR = window.devicePixelRatio;

// Keep canvases size up to date
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    let canvas = entry.target.children[0];
    canvas.setAttribute('pattern-ready', true);
    canvas.style.width = `${entry.contentBoxSize[0].inlineSize}px`;
    canvas.style.height = `${entry.contentBoxSize[0].blockSize}px`;
    canvas.width = entry.devicePixelContentBoxSize[0].inlineSize;
    canvas.height = entry.devicePixelContentBoxSize[0].blockSize;
  }
});

// maintain a "interpolated" view state for smooth zooming, panning, unitSize etc...
function smoothState(initialState) {
  let idealValues = {
    ...initialState
  };
  return new Proxy(initialState, {
    get(target, prop) {
      if (prop === 'updateProps') {
        return () => {
          for (let p in idealValues) {
            if (Math.abs(idealValues[p] - target[p]) < 0.005) {
              target[p] = idealValues[p];
            } else {
              target[p] = target[p] + ((idealValues[p] - target[p]) * 0.3);
            }
          }
        }
      }
      return target[prop];
    },
    set(_, prop, value) {
      idealValues[prop] = value;
      return true;
    }
  });
}

const MOUSE = {};
const updateMouse = (evt) => { MOUSE.x = evt.pageX; MOUSE.y = evt.pageY; };
document.addEventListener('mousemove', updateMouse);
document.addEventListener('mousedown', updateMouse);

function addPatternInfo(ctx) {
  // TODO: consider a caching strategy for getBoundingClientRect
  const rect = ctx.canvas.getBoundingClientRect();
  const canvasCursor = new DOMPoint((MOUSE.x - rect.left) * DPR, (MOUSE.y - rect.top) * DPR);
  const invertedMatrix = ctx.getTransform().invertSelf();
  const virtualCursor = canvasCursor.matrixTransform(invertedMatrix);
  ctx.pattern = {
    cursorX: canvasCursor.x,
    cursorY: canvasCursor.y,
    virtualX: virtualCursor.x,
    virtualY: virtualCursor.y,
  }
}

function drawCircle(ctx, cx, cy, r) {
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.stroke();
}

export default function patternCanvas(opt) {
  opt = {
    root: null,
    width: 2,
    height: 2,
    ...opt,
  };

  const elm = opt.root || document.body;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {
    alpha: true,
    colorSpace: 'srgb', // wide gamut = display-p3
    desynchronized: true,
    willReadFrequently: false,
  });

  const view = smoothState({ x: 0, y: 0, zoom: 1, unit: 20 });

  function drawGrid() {
    ctx.fillStyle = 'blue';
    ctx.font = "32px serif";
    ctx.fillText("(0,0)", 0, 0);
    ctx.fillRect(0, 0, view.unit / 2, view.unit / 2);
    ctx.fillText("(-200,0)", -200, 0);
    ctx.fillRect(-200, 0, view.unit / 2, view.unit / 2);
    ctx.fillText("(100,100)", 100, 100);
    ctx.fillRect(100, 100, view.unit / 2, view.unit / 2);

    ctx.font = "16px serif";
    ctx.fillText(JSON.stringify(ctx.pattern), -200, -100);
  }

  // The animation loop...
  function draw() {
    requestAnimationFrame(draw);
    if (!canvas.getAttribute('pattern-ready')) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // TODO: deal with shift...
    ctx.translate((canvas.width / 2), (canvas.height / 2));
    ctx.scale(view.zoom, view.zoom);

    addPatternInfo(ctx);

    drawGrid();
    ctx.restore();
    view.updateProps();
  }
  requestAnimationFrame(draw);

  // test interactions...
  canvas.addEventListener('click', () => {
    view.zoom = view.zoom * 1.3;
  });

  // Insert into the DOM, and observe size...
  elm.prepend(canvas);
  resizeObserver.observe(elm);
}