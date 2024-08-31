import p5 from 'p5';
import { marked } from 'marked';

export function addMarkdown(md) {
  // TODO: will i need to import dedent to fix these strings?
  const h = marked.parse(md.trim().replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,""));
  const sect = document.createElement('section');
  sect.innerHTML = h;
  document.getElementById('app').append(sect);
}

export function addHeader(opt) {
  opt = {
    title: 'Example Title',
    ...opt,
  }

  // TODO: subtitles
  // TODO: add navigation

  addMarkdown(`
    # ${opt.title}
  `);
}

//////////////////////////////////////////////
// Manipulate p5 to work well with examples...
//////////////////////////////////////////////

// this is super silly,
// but it allows you to add setup steps AFTER the _standardSetup runs...
p5.prototype.registerMethod('beforeSetup', function () {
  let userSetup = this.setup;
  let userResize = this.windowResized;

  this.setup = function () {
    this._standardSetup();
    this._hand = this.loadImage('../../images/cursor.png');
    if (userSetup) userSetup();
  }

  this.windowResized = () => {
    this.resizeCanvas(this._wrapper.offsetWidth, this._wrapper.offsetHeight);
    if (userResize) userResize();
  }
});

p5.prototype.registerMethod('post', function () {
  if (this._hasBeenPressed) return;

  if (this.mouseIsPressed) {
    this.clear();
    this._hasBeenPressed = true;
    return;
  }

  let ctx = this;
  ctx.push();
  ctx.fill('#fff');
  ctx.stroke('#aaa');
  ctx.strokeWeight(2);
  ctx.rectMode(ctx.CENTER);
  ctx.rect(ctx.width / 2, ctx.height / 2, 150, 150, 7);
  ctx.noStroke();
  ctx.fill('#666');
  ctx.textSize(14);
  ctx.textStyle(ctx.BOLD);
  ctx.textAlign(ctx.CENTER, ctx.CENTER);
  ctx.text(this._prompt || 'Play!', ctx.width / 2, ctx.height / 2 + 28)
  if (this._hand.width) {
    ctx.imageMode(ctx.CENTER);
    ctx.image(
      this._hand,
      ctx.width / 2,
      ctx.height / 2 - 12 + (ctx.sin(ctx.frameCount / 10) * 5),
      32,
      32
    )
  }
  ctx.pop();
});

export function addP5Example(fn, opt) {
  opt = {
    fps: 60,
    width: 540,
    height: 540,
    ratio: 9 / 16,
    rootId: 'app',
    background: '#eee',
    prompt: 'Click me.',
    ...opt,
  }
  const c = document.createElement('div');
  c.classList.add('example-wrap');
  c.style.width = `100%`;
  c.style.height = `0px`;
  c.style.position = 'relative';
  c.style.paddingBottom = `${opt.ratio * 100}%`;
  c.style.background = '#eee';
  c.style.border = '3px solid #a99';
  c.style.overflow = 'hidden';
  document.getElementById(opt.rootId).append(c);

  new p5((p) => {
    p._standardSetup = () => {
      p._prompt = opt.prompt;
      p._wrapper = c;
      p.createCanvas(c.offsetWidth, c.offsetHeight);
      p.frameRate(opt.fps);
      p.canvas.style.width = '100%';
      p.canvas.style.position = 'absolute';
      p.canvas.style.top = '0';
      p.canvas.style.left = '0';
      p.canvas.style.right = '0';
      p.canvas.style.bottom = '0';
    }
    fn(p);
  }, c);
}