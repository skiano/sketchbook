import addP5Canvas from '../shared/addP5Canvas.js';

addP5Canvas((p) => {
  const render = {};
  const state = {
    zoom: 1,
    centerX: 0,
    centerY: 0,
    segments: [
      [0, 0, 1, 1],
      [2, 0, 0, 2],
    ],
    pendingSegment: [],
    width: 4,
    height: 4,
    unit: 24,
  };

  const dotSize = 5;
  const guideWeight = 2;
  const lineWeight = 3;
  const zoomFactor = 1.2;

  const zoomIn = p.createButton('+');
  zoomIn.mousePressed(() => {
    state.zoom = state.zoom * zoomFactor;
  });

  const zoomOut = p.createButton('-');
  zoomOut.mousePressed(() => {
    state.zoom = state.zoom / zoomFactor;
  });

  p.setup = () => {
    state.centerX = p.width / 2;
    state.centerY = p.height / 2;
    state.zoom = 1;
    // sync initial render state
    render.centerX = state.centerX;
    render.centerY = state.centerY;
    render.zoom = state.zoom;
  }

  p.draw = () => {
    Object.entries(render).forEach(([key, value]) => {
      render[key] = p.lerp(value, state[key], 0.3);
    });

    let renderWidth = state.width * state.unit * render.zoom;
    let renderHeight = state.height * state.unit * render.zoom;
    let shiftX = renderWidth / 2;
    let shiftY = renderHeight / 2;
    let xMin = p.ceil(((p.width - (renderWidth / 2)) / 2) / renderWidth) * -state.width;
    let xMax = p.ceil(((p.width + (renderWidth / 2)) / 2) / renderWidth) * state.width;
    let yMin = p.ceil(((p.height - (renderHeight / 2)) / 2) / renderHeight) * -state.height;
    let yMax = p.ceil(((p.height + (renderHeight / 2)) / 2) / renderHeight) * state.height;

    p.background('#1a000f');
    p.push();
    p.translate(render.centerX - shiftX, render.centerY - shiftY);
    p.scale(render.zoom);

    // draw dots...
    for (let x = xMin; x <= xMax; x += 1) {
      for (let y = yMin; y <= yMax; y += 1) {
        p.push();
        p.noStroke();
        p.fill('#433');
        p.circle(x * state.unit, y * state.unit, dotSize / render.zoom);
        p.pop();
      }
    }

    // draw pattern instances...
    let w = state.width * state.unit;
    let h = state.height * state.unit;
    let xl = p.floor(xMin / state.width);
    let xr = p.ceil((xMax - state.width / 2)  / state.width);
    let yt = p.floor(yMin / state.height);
    let yb = p.ceil((yMax - state.height / 2)  / state.height);

    // repeat guides...
    for (let x = xl; x <= xr; x += 1) {
      for (let y = yt; y <= yb; y += 1) {
        p.push();
        p.stroke('#433');
        p.strokeWeight(guideWeight / render.zoom);
        p.noFill();
        p.rect(x * w, y * h, w, h);
        p.pop();
      }
    }

    // repeat segments...
    for (let x = xl; x <= xr; x += 1) {
      for (let y = yt; y <= yb; y += 1) {
        
        p.push();
        p.stroke('#fda');
        p.strokeWeight(lineWeight / render.zoom);
        p.noFill();
        state.segments.forEach((seg) => {
          let ox = x * w;
          let oy = y * h;
          p.line(
            ...seg.map((v, i) => (i % 2 ? oy : ox) + (v * state.unit)),
          )
        });
        p.pop();
      }
    }

    p.pop();
  };
}, {
  fps: 60,
  width: 540,
  height: 540,
  background: 'transparent',
});
