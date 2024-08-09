import './style.css';
import p5 from 'p5';

const app = document.getElementById('app');

function linearGradient(p, x0, y0, x1, y1, stops) {
  let grad = p.drawingContext.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([amt, color]) => grad.addColorStop(amt, color));
  p.drawingContext.fillStyle = grad;
  return grad;
}

function run() {
  new p5((p) => {

    let g1;
    let g2;
    let g3;
  
    p.setup = () => {
      let s = p.drawingContext.canvas.parentNode;
      let w = s.offsetWidth;
      let h = s.offsetHeight;
      p.createCanvas(w, h);
  
      g1 = p.createGraphics(w, h);
      g1.background('blue');
      g1.textAlign(p.CENTER, p.CENTER);
      g1.fill('yellow');

      g1.drawingContext.font = '300 500px citizen';
      g1.text('4', p.width / 2, p.height / 2);
      g1.canvas.style.display = 'block'; // < TEMP
  
      g2 = p.createGraphics(w, h);
      g2.noStroke();
      linearGradient(g2, 100, 0, 100, g2.height, [[0, 'blue'], [0.5, 'red'], [1, 'yellow']]);
      g2.circle(g2.width / 2, g2.height / 2, g2.width, g2.height);
      g2.textAlign(p.CENTER, p.CENTER);
      g2.fill('#ff0044');
      g2.drawingContext.font = '700 200px ohno-blazeface';
      g2.text('p5.js', p.width / 2, p.height / 2);
      g2.canvas.style.display = 'block'; // < TEMP
  
      g3 = p.createGraphics(w, h);
      g3.background('red');
      g3.textAlign(p.CENTER, p.CENTER);
      g3.fill('yellow');
      g3.drawingContext.font = '125px elfreth';
      g3.text('Designers', p.width / 2, p.height / 2);
      g3.canvas.style.display = 'block'; // < TEMP
    }
  
    p.draw = () => {
      p.background('white');
  
      p.push();
      p.blendMode(p.EXCLUSION);
      p.image(g1, 0, 0);
      p.image(g2, 0, 0);
      p.image(g3, 0, 0);
      p.pop();

      p.textAlign(p.CENTER, p.CENTER);

      // p.fill('blue');
      // p.textSize(200);
      // p.text('p5.js', p.width / 2, p.height / 2);
  
      // p.fill('red');
      // p.textSize(460);
      // p.text('4', p.width / 2, p.height / 2);
  
      // p.fill('yellow');
      // p.textSize(120);
      // p.text('designers', p.width / 2, p.height / 2);
    }
  
  }, app);
}

// SOME HACKY CRAP HAVING TO DO WITH ENSURING ADOBE FONTS RENDER...

const fonts = [
  ['citizen', 300],
  ['citizen', 700],
  ['elfreth', 300],
  ['ohno-blazeface', 200],
  ['ohno-blazeface', 400],
  ['ohno-blazeface', 700],
  ['ohno-blazeface', 900],
].map(([f, w]) => {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = `${w} 100px ${f}`;
  ctx.fillText( "bold", 50, 50 );
  return f;
});

const t = setTimeout(() => {
  alert('fonts failing?');
}, 500);

document.fonts.onloadingdone = function (evt) {
  if (evt.fontfaces.length !== fonts.length) return;
  console.log('FONTS:\n\n' + evt.fontfaces.map(f => `${f.family} ${f.weight}`).join('\n'))
  clearTimeout(t);
  run();
};
