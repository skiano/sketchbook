import p5 from 'p5';

// this is super silly,
// but it allows you to add setup steps AFTER the _standardSetup runs...
p5.prototype.registerMethod('beforeSetup', function () {
  let userSetup = this.setup;
  this.setup = function () {
    this._standardSetup();
    if (userSetup) userSetup();
  }
});

export default function addCanvas(fn, opt) {
  opt = {
    fps: 15,
    width: 300,
    height: 300,
    rootId: 'app',
    ...opt,
  }
  const c = document.createElement('div');
  c.style.width = `${opt.width}px`;
  c.style.height = `${opt.height}px`;
  c.style.background = '#f9f2f0';
  document.getElementById(opt.rootId).append(c);
  new p5((p) => {
    p._standardSetup = () => {
      p.createCanvas(opt.width, opt.height);
      p.frameRate(opt.fps);
    }
    fn(p);
  }, c);
}