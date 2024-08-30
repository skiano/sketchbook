
// gridPattern() creates a repeating pattern
// drawn on a grid like "graph paper"
// the pattern is defined as a set of layers,
// drawn one after the other
// where each layer has a color and a line weight along with a list
// of line segments to draw on the graph paper (integers represent points on the graph paper)
// the default renderer draws a line for each of the points with a round line cap, respecting the fill color

export default function gridPattern(opt) {
  opt = {
    render: (ctx, x1, y1, x2, y2, color = 'black', weight = 2) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = weight;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    scale: 8,
    width: 4,
    height: 4,
    layers: [
      { color: '#eee', weight: 5, segments: [[2, 0, 2, 4], [0, 2, 4, 2]] },
      { color: 'red', weight: 8, segments: [[1, 1, 3, 3], [3, 1, 1, 3]] },
    ],
    ...opt,
  }

  const dpr = window.devicePixelRatio || 1;
  const can = document.createElement('canvas');
  const ctx = can.getContext("2d");

  const scale = opt.scale * dpr;
  const width = opt.width * scale;
  const height = opt.height * scale;

  can.style.width = `${width / 2}px`;
  can.style.height = `${height / 2}px`;
  can.width = width;
  can.height = height;

  
  // the pattern is rendered nine times
  // so that bits going over the edge work correctly
  // TODO: make buffer size optionally controlled???
  opt.layers.forEach((layer) => {
    // looping each layer because overlaps cause problems otherwise...
    ctx.save();
    ctx.translate(-width, -height);
    for (let px = 0; px < 3; px += 1) {
      for (let py = 0; py < 3; py += 1) {
        layer.segments.forEach(([x1, y1, x2, y2]) => {
          opt.render(
            ctx,
            x1 * scale,
            y1 * scale,
            x2 * scale,
            y2 * scale,
            layer.color,
            (layer.weight / 24 * scale) >> 0)
          ;
        });
        ctx.translate(0, height);
      }
      ctx.translate(width, 0);
      ctx.translate(0, -height * 3);
    }
    ctx.restore();
  });

  // targetCanvas = canvas to fill with the pattern
  // x = nubmer between 0 and 1, indicating the FRACTION the pattern should be offset horizontally
  // y = nubmer between 0 and 1, indicating the FRACTION the pattern should be offset vertically
  return function fillRect(targetCanvas, x = 0, y = 0) {
    const targetCtx = targetCanvas.getContext("2d");
    if (!targetCtx._patternCache) targetCtx._patternCache = new WeakMap();
    if (!targetCtx._patternCache.get(can)) targetCtx._patternCache.set(can, targetCtx.createPattern(can, 'repeat'));
    targetCtx.fillStyle = targetCtx._patternCache.get(can);
    targetCtx.save();
    let s = 1 / dpr;
    x = x * width; // x is a fraction of the pattern width
    y = y * height; // y is a fraction of the pattern height
    targetCtx.scale(s, s);
    targetCtx.translate(x * dpr, y * dpr);
    targetCtx.fillRect(
      -x * dpr,
      -y * dpr,
      targetCanvas.width * dpr,
      targetCanvas.height * dpr
    );
    targetCtx.restore();
  }
}