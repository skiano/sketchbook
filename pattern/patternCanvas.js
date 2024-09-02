const DPR = window.devicePixelRatio;
const MOUSE = {};
const updateMouse = (evt) => { MOUSE.x = evt.pageX; MOUSE.y = evt.pageY; };
document.addEventListener('mousemove', updateMouse);
document.addEventListener('mousedown', updateMouse);

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
      if (prop === 'update') {
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

function createPattern(ctx) {
  const pattern = {};

  const getRepeatRange = (width, min, max, buffer = 1) => {
    let fill = (max - min) + (buffer * width * 2);
    let total = Math.ceil(fill / width);
    total = total % 2 ? total : total + 1; // make sure the total is odd and higher
    return [
      -Math.floor(total / 2),
      Math.ceil(total / 2),
    ];
  }

  pattern.update = (opt) => {
    // TODO: before a click or movement, how to gracefully handle nonexistent cursor
    // TODO: consider a caching strategy for getBoundingClientRect
    const rect = ctx.canvas.getBoundingClientRect();
    const canvasCursor = new DOMPoint((MOUSE.x - rect.left) * DPR, (MOUSE.y - rect.top) * DPR);
    const invertedMatrix = ctx.getTransform().invertSelf();
    const virtualCursor = canvasCursor.matrixTransform(invertedMatrix);
    const topLeft = new DOMPoint(0, 0).matrixTransform(invertedMatrix);
    const bottomRight = new DOMPoint(ctx.canvas.width, ctx.canvas.height).matrixTransform(invertedMatrix);
    pattern.cursorX = virtualCursor.x;
    pattern.cursorY = virtualCursor.y;
    pattern.viewTop = topLeft.y;
    pattern.viewLeft = topLeft.x;
    pattern.viewRight = bottomRight.x;
    pattern.viewBottom = bottomRight.y;
    pattern.width = opt.width * opt.unit;
    pattern.height = opt.height * opt.unit;
    // (occlusion?) logic
    // TODO: this will also depend on the bounding box of the pattern elements too...
    // the goal is to decide how many repeats to render
    // given:
    //   1) the zoom and translation of the viewport
    //   2) the actual size of the canvas
    //   3) the size of the pattern repeat
    //   4) the bounding box of the drawing in the pattern
    //   5) the main preview pattern should be centered on the origin

    const [x1, x2] = getRepeatRange(pattern.width, topLeft.x, bottomRight.x);
    const [y1, y2] = getRepeatRange(pattern.height, topLeft.y, bottomRight.y);
    pattern.repeat = [x1, y1, x2, y2];
  }

  return pattern;
}

export default function patternCanvas(opt) {
  opt = {
    unit: 20,
    width: 4,
    height: 4,
    root: null,
    view: { x: 0, y: 0, zoom: 1 },
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

  const view = smoothState(opt.view);
  const pattern = createPattern(ctx);

  function drawGrid() {
    // ctx.fillStyle = 'blue';
    // ctx.font = "32px serif";
    // ctx.fillText("(0,0)", 0, 0);
    // drawCircle(ctx, 0, 0, 3);
    // ctx.fillText("(-200,0)", -200, 0);
    // drawCircle(ctx, -200, 0, 3);
    // ctx.fillText("(100,100)", 100, 100);
    // drawCircle(ctx, 100, 100, 3);

    // ctx.font = "30px serif";
    // ctx.fillText(ctx.pattern.viewLeft.toFixed(0), -70, -40);
    // ctx.fillText(ctx.pattern.viewRight.toFixed(0), 70, -40);
    // ctx.fillText(ctx.pattern.viewTop.toFixed(0), -70, 40);
    // ctx.fillText(ctx.pattern.viewBottom.toFixed(0), 70, 40);
    // ctx.fillText(ctx.pattern.cursorX.toFixed(0), 0, 140);

    ctx.lineWidth = 2 / view.zoom;
    ctx.strokeStyle = 'rgba(0, 100, 255, 0.5)';
    ctx.beginPath();

    let ox = pattern.width / -2;
    let oy = pattern.height / -2;

    for (let rx = pattern.repeat[0]; rx <= pattern.repeat[2]; rx += 1) {
      ctx.moveTo(rx * pattern.width + ox, pattern.viewTop);
      ctx.lineTo(rx * pattern.width + ox, pattern.viewBottom);
    }

    for (let ry = pattern.repeat[1]; ry <= pattern.repeat[3]; ry += 1) {
      ctx.moveTo(pattern.viewLeft, ry * pattern.height + oy);
      ctx.lineTo(pattern.viewRight, ry * pattern.height + oy);
    }

    ctx.stroke();
  }

  // The animation loop...
  function draw() {
    requestAnimationFrame(draw);
    if (!canvas.getAttribute('pattern-ready')) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate((canvas.width / 2), (canvas.height / 2)); // TODO: deal with shift...
    ctx.scale(view.zoom, view.zoom);
    pattern.update(opt);
    drawGrid();
    ctx.restore();
    view.update();
  }
  requestAnimationFrame(draw);

  // test interactions...
  canvas.addEventListener('click', (evt) => {
    view.zoom = evt.altKey ? view.zoom / 1.3 : view.zoom * 1.3;
  });

  // Insert into the DOM, and observe size...
  elm.prepend(canvas);
  resizeObserver.observe(elm);
}