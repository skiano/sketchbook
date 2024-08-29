
export default function gridPattern(opt) {
  opt = {
    scale: 12,
    width: 4,
    height: 4,
    render: (ctx, x1, y1, x2, y2, color = 'black', weight = 2) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = weight;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    layers: [
      // { color: '#eee', weight: 5, segments: [[2, 0, 2, 4], [0, 2, 4, 2]] },
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

  // TODO:
  // translate to stamp out nine
  // in case edges need to be perfect
  // then crop...? or can i just draw off screen??

  opt.layers.forEach((layer) => {
    layer.segments.forEach(([x1, y1, x2, y2]) => {
      opt.render(ctx, x1 * scale, y1 * scale, x2 * scale, y2 * scale, layer.color, (layer.weight / 24 * scale) >> 0);
    });
  });

  let pattern;

  return function fillRect(targetCanvas, x = 0, y = 0, w, h) {
    const targetCtx = targetCanvas.getContext("2d");
    if (!pattern) pattern = targetCtx.createPattern(can, 'repeat');
    targetCtx.fillStyle = pattern;
    targetCtx.save();
    let s = 1 / dpr;
    targetCtx.scale(s, s);
    targetCtx.translate(x * dpr, x * dpr);
    targetCtx.fillRect(-x * dpr, -x * dpr, targetCanvas.width * dpr, targetCanvas.height * dpr);
    targetCtx.restore();
  }
}