import p5 from 'p5';

function addCanvas(fn, opt) {
  opt = {
    fps: 30,
    width: 540,
    height: 540,
    rootId: 'app',
    ...opt,
  }
  const c = document.createElement('div');
  document.getElementById(opt.rootId).append(c);
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(opt.width, opt.height);
      p.frameRate(opt.fps);
    }
    fn(p);
  }, c);
}

function createPattern(opt) {
  opt = {
    segments: [],
    ...opt,
  }
  return opt;
}

function renderPattern(ctx, pattern, opt) {
  opt = {
    x: 0, // TODO: handle these offsets...
    y: 0, // TODO: handle these offsets...
    width: 30,
    height: 30,
    fill: 'yellow',
    stroke: 'black',
    weight: 3,
    // mask???
    ...opt,
  }

  // TODO: negotiate squishing...?? or allow it...
  // TODO: modulo the offsets in case they are giant...

  let cols = Math.ceil(ctx.width / opt.width);
  let rows = Math.ceil(ctx.height / opt.height);
  let scaleX = opt.width / pattern.width;
  let scaleY = opt.height / pattern.height;

  for (let col = 0; col < cols; col +=1) {
    ctx.push();
    for (let row = 0; row < rows; row += 1) {

      // render fills...

      // render segments
      ctx.push();
      ctx.noFill();
      ctx.stroke(opt.stroke);
      ctx.strokeCap(ctx.ROUND);
      ctx.strokeWeight(opt.weight);
      pattern.segments.forEach((seg) => {
        ctx.line(...seg.map(
          v => v % 2
            ? v * scaleY
            : v * scaleX
        ));
      });
      ctx.pop();

      ctx.translate(opt.width, 0);
    }
    ctx.pop();
    ctx.translate(0, opt.height);
  }
}

const TINY_EXES_LINES_01 = createPattern({
  width: 2,
  height: 2,
  segments: [
    [0, 0, 1, 1],
    [0, 1, 1, 0],
  ],
});

addCanvas((p) => {
  p.draw = () => {
    p.background('#eee');
    renderPattern(p, TINY_EXES_LINES_01);
    p.noLoop();
  };
});