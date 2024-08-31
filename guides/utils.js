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
    if (userSetup) userSetup();
  }

  this.windowResized = () => {
    this.resizeCanvas(this._wrapper.offsetWidth, this._wrapper.offsetHeight);
    if (userResize) userResize();
  }
});

export function addP5Example(fn, opt) {
  opt = {
    fps: 60,
    width: 540,
    height: 540,
    ratio: 9 / 16,
    rootId: 'app',
    background: '#eee',
    ...opt,
  }
  const c = document.createElement('div');
  c.classList.add('example-wrap');
  c.style.width = `100%`;
  c.style.height = `0px`;
  c.style.position = 'relative';
  c.style.paddingBottom = `${opt.ratio * 100}%`;
  c.style.background = '#eee';
  c.style.border = '1px solid #ccc';
  c.style.overflow = 'hidden';
  document.getElementById(opt.rootId).append(c);

  new p5((p) => {
    p._standardSetup = () => {
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