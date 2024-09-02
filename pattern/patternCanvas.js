const DPR = window.devicePixelRatio;
const MOUSE = {};
const updateMouse = (evt) => { MOUSE.x = evt.pageX; MOUSE.y = evt.pageY; };
document.addEventListener('mousemove', updateMouse);
document.addEventListener('mousedown', updateMouse);

function throttle(fn, limit = 200) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Keep canvases size up to date
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    let canvas = entry.target.children[0];
    canvas.setAttribute('pattern-ready', true);
    canvas.style.width = `${entry.contentBoxSize[0].inlineSize}px`;
    canvas.style.height = `${entry.contentBoxSize[0].blockSize}px`;
    canvas.width = entry.contentBoxSize[0].inlineSize * 2;
    canvas.height = entry.contentBoxSize[0].blockSize * 2;
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
              target[p] = target[p] + ((idealValues[p] - target[p]) * 0.2);
            }
          }
        }
      }
      if (prop === 'hardSet') {
        return (key, val) => {
          target[key] = val;
          idealValues[key] = val;
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

  const updateBoundingBox = throttle(() => {
    // TODO: consider a more thoughtful caching strategy for getBoundingClientRect
    // for now, just throttling it in case the parent element moves or changes size...
    // I already have a resize observer, so that would be one moment i know
    // to evacuate the cache
    // but not sure if there is a clever way to guess that a position has changed
    ctx.boundingRect = ctx.canvas.getBoundingClientRect();
  }, 1500);

  pattern.update = (opt) => {
    updateBoundingBox();
    const canvasCursor = new DOMPoint((MOUSE.x - ctx.boundingRect.left) * DPR, (MOUSE.y - ctx.boundingRect.top) * DPR);
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
    pattern.eachRow = (fn) => {
      let oy = pattern.height / -2;
      for (let ry = pattern.repeat[1]; ry <= pattern.repeat[3]; ry += 1) {
        fn(ry * pattern.height + oy);
      }
    }
    pattern.eachCol = (fn) => {
      let ox = pattern.width / -2;
      for (let rx = pattern.repeat[0]; rx <= pattern.repeat[2]; rx += 1) {
        fn(rx * pattern.width + ox);
      }
    }
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
    layers: [
      {
        color: 'red',
        weight: 2,
        segments: [
          [0, 4, 4, 0],
          [0, 0, 4, 4],
        ]
      },
      {
        color: '#333',
        weight: 6,
        segments: [
          [1, 1, 1, 3],
          [3, 1, 3, 3],
        ]
      }
    ],
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
    ctx.lineWidth = 3 / view.zoom;
    ctx.strokeStyle = 'rgba(0, 100, 255, 0.5)';
    ctx.beginPath();
    pattern.eachCol((ox) => {
      ctx.moveTo(ox, pattern.viewTop);
      ctx.lineTo(ox, pattern.viewBottom);
    });
    pattern.eachRow((oy) => {
      ctx.moveTo(pattern.viewLeft, oy);
      ctx.lineTo(pattern.viewRight, oy);
    });
    ctx.stroke();

    ctx.lineWidth = 1 / view.zoom;
    ctx.strokeStyle = 'rgba(0, 100, 255, 0.5)';
    ctx.beginPath();
    pattern.eachCol((ox) => {
      for (let i = 1; i < opt.width; i += 1) {
        ctx.moveTo(ox + i * opt.unit, pattern.viewTop);
        ctx.lineTo(ox + i * opt.unit, pattern.viewBottom);
      }
    });
    pattern.eachRow((oy) => {
      for (let i = 1; i < opt.height; i += 1) {
        ctx.moveTo(pattern.viewLeft, oy + i * opt.unit);
        ctx.lineTo(pattern.viewRight, oy + i * opt.unit);
      }
      
    });
    ctx.stroke();
  }

  function drawLayers() {
    opt.layers.forEach((layer) => {
      // ctx.lineWidth = 6 / view.zoom;
      ctx.lineWidth = layer.weight || 1;
      ctx.lineCap = layer.lineCap || 'round';
      ctx.strokeStyle = layer.color || '#red';
      ctx.beginPath();
      pattern.eachCol((ox) => {
        pattern.eachRow((oy) => {
          layer.segments.forEach((seg) => {
            ctx.moveTo(ox + seg[0] * opt.unit, oy + seg[1] * opt.unit);
            ctx.lineTo(ox + seg[2] * opt.unit, oy + seg[3] * opt.unit);
          });
        });
      });
      ctx.stroke();
    });
  }

  let initialized;

  // The animation loop...
  function draw() {
    requestAnimationFrame(draw);
    if (!canvas.getAttribute('pattern-ready')) return;

    if (!initialized) {
      view.hardSet('zoom', Math.min(
        canvas.width / (opt.unit * opt.width) / 3,
        canvas.height / (opt.unit * opt.height) / 3,
      ));
      initialized = true;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate((canvas.width / 2) + view.x, (canvas.height / 2) + view.y);
    ctx.scale(view.zoom, view.zoom);
    pattern.update(opt);
    drawGrid();
    drawLayers();
    ctx.restore();
    view.update();
  }
  requestAnimationFrame(draw);

  // test interactions...
  canvas.addEventListener('click', (evt) => {
    view.zoom = evt.altKey ? view.zoom / 1.3 : view.zoom * 1.3;
  });

  // TODO: think about how focus would work if there were multiple
  // i.e. maybe dont do this...
  window.addEventListener('keydown', (evt) => {
    switch (evt.code) {
      case 'ArrowRight':
        view.x = view.x + 30;
        break;
      case 'ArrowLeft':
        view.x = view.x - 30;
        break;
      case 'ArrowUp':
        view.y = view.y - 30;
        break;
      case 'ArrowDown':
        view.y = view.y + 30;
        break;
      default:
        // console.log(evt.code);   
    }
  });

  // Insert into the DOM, and observe size...
  elm.prepend(canvas);
  resizeObserver.observe(elm);
}