import './style.css';
import p5 from 'p5';

const app = document.getElementById('app');

function run() {
  new p5((p) => {
    const margin = 10;
    const loopFrames = 30 * 8;
    const graphics = [];

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
      initialX = 0,
      initialY = 0,
      lapsX = 1,
      lapsY = 1,
      mode = p.EXCLUSION,
      preview,
      display = true,
      render,
    }) => {
      const g = p.createGraphics(width, height);
      render(g);
      if (preview) g.canvas.style.display = 'block';
      let xLoopDistance = (p.width - width - (2 * margin)) * 2;
      let yLoopDistance = (p.height - height - (2 * margin)) * 2;
      let rightBound = p.width - width - margin;
      let bottomBound = p.height - height - margin;
      let x;
      let y;
      let vx;
      let vy;
      const reset = () => {
        x = p.constrain(initialX, margin + 1, p.width - width - margin - 1);
        y = p.constrain(initialY, margin + 1, p.height - height - margin - 1);
        vx = xLoopDistance / (loopFrames / lapsX);
        vy = yLoopDistance / (loopFrames / lapsY);
      }
      reset();
      return {
        reset,
        draw: () => {
          if (display) {
            p.push();
            p.blendMode(mode);
            p.image(g, x, y, width, height);
            p.pop();
          }
          x = x + vx;
          y = y + vy;
          if (x >= rightBound) {
            vx = -vx;
            x = rightBound - Math.abs(x - rightBound); // FUSSY CORRECTION TO MAKE LOOP MORE SEAMLESS
          }
          if (x <= margin) {
            vx = -vx;
            x = margin + Math.abs(x - margin); // FUSSY CORRECTION TO MAKE LOOP MORE SEAMLESS
          }
          if (y >= bottomBound) {
            vy = -vy;
            y = bottomBound - Math.abs(y - bottomBound); // FUSSY CORRECTION TO MAKE LOOP MORE SEAMLESS
          }
          if (y <= margin) {
            vy = -vy;
            y = margin + Math.abs(y - margin); // FUSSY CORRECTION TO MAKE LOOP MORE SEAMLESS
          }
        },
      }
    };

    p.setup = () => {
      let s = p.drawingContext.canvas.parentNode;
      let w = s.offsetWidth;
      let h = s.offsetHeight;
      p.createCanvas(w, h);
      p.frameRate(30);

      graphics.push(bouncyGraphic({
        width: 350,
        height: 350,
        loopFrames: loopFrames,
        initialX: 60,
        initialY: 300,
        lapsX: -2,
        lapsY: -1,
        display: true,
        render: (g) => {
          linearGradient(g, 0, 0, g.width, 0, [[0, 'purple'], [1, 'yellow']]);
          g.circle(g.width / 2, g.height / 2, g.width, g.height);
          g.blendMode(p.EXCLUSION)
          linearGradient(g, 0, 0, g.width,  g.height, [[0, 'red'], [1, 'black']]);
          g.circle(g.width / 2, g.height / 2, g.width, g.height);
          g.blendMode(p.MULTIPLY)
          linearGradient(g, 0, 0, 100,  g.height, [[0, 'black'], [1, 'white']]);
          g.circle(g.width / 2, g.height / 2, g.width, g.height);
        },
      }));

      graphics.push(bouncyGraphic({
        width: 140,
        height: 140,
        loopFrames: loopFrames,
        initialX: 280,
        initialY: 200,
        lapsX: 1,
        lapsY: -1,
        display: true,
        render: (g) => {
          g.background('#0000aa');
          g.textAlign(p.CENTER, p.CENTER);
          g.fill('pink');
          g.drawingContext.font = '300 90px citizen';
          g.text('4', g.width / 2, g.height / 2);
        },
      }));

      graphics.push(bouncyGraphic({
        width: 170,
        height: 170,
        loopFrames: loopFrames,
        initialX: p.random(0, p.width),
        initialY: p.random(0, p.height),
        lapsX: p.random([-1, 1]),
        lapsY: p.random([-2, 2]),
        display: false,
        render: (g) => {
          linearGradient(g, 0, 0, 0, g.height, [[0, 'darkblue'], [1, 'blue']]);
          g.rect(0, 0, g.width, g.height);
        },
      }));

      graphics.push(bouncyGraphic({
        width: 370,
        height: 220,
        loopFrames: loopFrames,
        initialX: 120,
        initialY: 230,
        lapsX: -2,
        lapsY: 1,
        display: true,
        render: (g) => {
          g.background('#dd0022');
          g.textAlign(p.CENTER, p.CENTER);
          g.fill('gold');
          g.drawingContext.font = '80px elfreth';
          g.text('Designers', g.width / 2, g.height / 2);
        },
      }));

      graphics.push(bouncyGraphic({
        width: 300,
        height: 300,
        loopFrames: loopFrames,
        initialX: 30,
        initialY: 50,
        lapsX: 1,
        lapsY: -1,
        display: true,
        render: (g) => {
          g.noStroke();
          linearGradient(g, 0, 0, 0, g.height, [[0, 'blue'], [0.5, 'red'], [1, 'yellow']]);
          g.rect(0, 0, g.width, g.height);
          g.textAlign(p.CENTER, p.CENTER);
          g.fill('black');
          g.drawingContext.font = '700 110px ohno-blazeface';
          g.text('p5.js', g.width / 2, g.height / 2);
        },
      }));

      graphics.push(bouncyGraphic({
        width: 100,
        height: 100,
        loopFrames: loopFrames,
        initialX: p.random(0, p.width),
        initialY: p.random(0, p.height),
        lapsX: p.random([-1, 1]),
        lapsY: p.random([-1, 1]),
        display: false,
        render: (g) => {
          linearGradient(g, 0, 0, g.width, g.height, [[0, 'blue'], [1, 'red']]);
          g.rect(0, 0, g.width, g.height);
        },
      }));
    }

    p.draw = () => {
      p.background('black');
      graphics.forEach(g => g.draw());
      if (p.frameCount % loopFrames === 0) {
        console.log('loop')
        graphics.forEach(g => g.reset());
      }
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
