import addP5Canvas from '../shared/addP5Canvas.js';

function toLoopNumber(x, loopLength) {
  return x >= 0 ? x % loopLength : x % loopLength + loopLength;
}

addP5Canvas((p) => {
  const render = {};
  const state = {
    zoom: 1,
    centerX: 0,
    centerY: 0,
    segments: [
      // [1, 1, 3, 3],
      // [3, 1, 1, 3],
    ],
    pendingSegment: null,
    width: 5,
    height: 5,
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

  p.mousePressed = () => {
    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
      return;
    }

    if (!state.pendingSegment) {
      state.pendingSegment = [p.patternX, p.patternY].map(v => p.round(v * 2, 0) / 2);
    } else {
      state.segments = [
        ...state.segments,
        [
          ...state.pendingSegment,
          p.patternX,
          p.patternY
        ].map(v => p.round(v * 2, 0) / 2)
      ];
      state.pendingSegment = null;
    }
  }

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
      if (p.abs(value - state[key]) < 0.001) render[key] = state[key];
      else render[key] = p.lerp(value, state[key], 0.3);
    });

    let renderWidth = state.width * state.unit * render.zoom;
    let renderHeight = state.height * state.unit * render.zoom;
    let shiftX = renderWidth / 2;
    let shiftY = renderHeight / 2;
    let xMin = p.ceil(((p.width - (renderWidth / 2)) / 2) / renderWidth) * -state.width;
    let xMax = p.ceil(((p.width + (renderWidth / 2)) / 2) / renderWidth) * state.width;
    let yMin = p.ceil(((p.height - (renderHeight / 2)) / 2) / renderHeight) * -state.height;
    let yMax = p.ceil(((p.height + (renderHeight / 2)) / 2) / renderHeight) * state.height;

    // set the "patternX" and "patternY" to make interactions easier
    // p.patternX = toLoopNumber((p.mouseX - render.centerX + shiftX) / render.zoom, state.width * state.unit) / state.unit;
    // p.patternY = toLoopNumber((p.mouseY - render.centerY + shiftY) / render.zoom, state.height * state.unit) / state.unit;
    p.patternX = ((p.mouseX - render.centerX + shiftX) / render.zoom) / state.unit;
    p.patternY = ((p.mouseY - render.centerY + shiftY) / render.zoom) / state.unit;

    // START RENDERING

    p.background('#1a000f');

    p.push();
    
    // manipulate the render context
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

    // repeat interaction...
    for (let x = xl; x <= xr; x += 1) {
      for (let y = yt; y <= yb; y += 1) {
        let ox = x * w;
        let oy = y * h;
        let rx = p.patternX * state.unit + ox;
        let ry = p.patternY * state.unit + oy;

        // p.push();
        // p.fill('#977');
        // p.noStroke();
        // p.circle(
        //   p.round(p.patternX * 2) / 2 * state.unit + ox,
        //   p.round(p.patternY * 2) / 2 * state.unit + oy,
        //   dotSize * 2 / render.zoom
        // )
        // p.pop();

        if (state.pendingSegment) {
          p.push();
          p.stroke('#fda');
          p.strokeWeight(lineWeight / render.zoom);
          p.noFill();
          p.line(
            state.pendingSegment[0] * state.unit + ox,
            state.pendingSegment[1] * state.unit + oy,
            rx,
            ry
          );
          // p.fill('#fda');
          // p.noStroke();
          // p.strokeWeight(lineWeight / render.zoom);
          // p.circle(p.patternX * state.unit + ox, p.patternY * state.unit + oy, dotSize / render.zoom)
          // p.textSize(14 / render.zoom)
          // p.textAlign(p.CENTER, p.CENTER)
          // p.text(p.patternX.toFixed(2), p.patternX * state.unit + ox, p.patternY * state.unit + oy - (15 / render.zoom))
          // p.text(p.patternY.toFixed(2), p.patternX * state.unit + ox, p.patternY * state.unit + oy + (15 / render.zoom))
          p.noFill();
        }
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
