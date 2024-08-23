import p5 from 'p5';

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
  c.style.background = '#f4efe6';
  document.getElementById(opt.rootId).append(c);
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(opt.width, opt.height);
      p.frameRate(opt.fps);
    }
    fn(p);
  }, c);
}