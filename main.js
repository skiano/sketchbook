import './style.css';
import p5 from 'p5';

const app = document.getElementById('app');

function run() {
  new p5((p) => {
    const margin = 10;
    const loopFrames = 30 * 6;

    function linearGradient(g, x0, y0, x1, y1, stops) {
      let grad = g.drawingContext.createLinearGradient(x0, y0, x1, y1);
      stops.forEach(([amt, color]) => grad.addColorStop(amt, color));
      g.drawingContext.fillStyle = grad;
      return grad;
    }

    const bouncyGraphic = ({
      width,
      height,
      loopFrames,
      initialX,
      initialY,
      lapsX,
      lapsY,
      mode = p.EXCLUSION,
      preview,
      render,
    }) => {
      const g = p.createGraphics(width, height);
      render(g);
      if (preview) g.canvas.style.display = 'block';

      let x = initialX;
      let y = initialY;

      return {
        draw: () => {
          p.push();
          p.blendMode(mode);
          p.image(g, x, y, width, height);
          p.pop();

          // x1 = x1 + vx1;
          // y1 = y1 + vy1;
          // if (x1 >= p.width - size - 10 || x1 <= 10) vx1 = -vx1;
          // if (y1 >= p.height - size - 10 || y1 <= 10) vy1 = -vy1;

        },
        reset: () => {

        },
      }
    };

    const graphics = [
      bouncyGraphic({
        width: 250,
        height: 250,
        loopFrames: loopFrames,
        initialX: 100,
        initialY: 100,
        lapsX: 2,
        lapsY: 2,
        render: (g) => {
          g.noStroke();
          linearGradient(g, 0, 0, 0, g.height, [[0, 'blue'], [0.5, 'red'], [1, 'yellow']]);
          g.rect(0, 0, g.width, g.height);
          g.textAlign(p.CENTER, p.CENTER);
          g.fill('black');
          g.drawingContext.font = '700 100px ohno-blazeface';
          g.text('p5.js', g.width / 2, g.height / 2);
        },
      }),
      bouncyGraphic({
        width: 170,
        height: 170,
        loopFrames: loopFrames,
        initialX: 100,
        initialY: 100,
        lapsX: 2,
        lapsY: 2,
        render: (g) => {
          g.background('blue');
          g.textAlign(p.CENTER, p.CENTER);
          g.fill('orange');
          g.drawingContext.font = '300 150px citizen';
          g.text('4', g.width / 2, g.height / 2);
        },
      }),
      bouncyGraphic({
        width: 350,
        height: 350,
        loopFrames: loopFrames,
        initialX: 100,
        initialY: 100,
        lapsX: 2,
        lapsY: 2,
        render: (g) => {
          g.background('red');
          g.textAlign(p.CENTER, p.CENTER);
          g.fill('yellow');
          g.drawingContext.font = '80px elfreth';
          g.text('Designers', g.width / 2, g.height / 2);
        },
      }),
    ];
  
    p.setup = () => {
      let s = p.drawingContext.canvas.parentNode;
      let w = s.offsetWidth;
      let h = s.offsetHeight;
      p.createCanvas(w, h);
    }
  
    p.draw = () => {
      p.background('black');
      graphics.forEach(g => g.draw());
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
