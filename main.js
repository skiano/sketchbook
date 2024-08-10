import './style.css';
import cursorUrl from './public/cursor.png';
import p5 from 'p5';
import addRecorder from './recorder';

const app = document.getElementById('app');

addRecorder(p5);

function run() {
  new p5((p) => {
    let cursorImg;
    const margin = 10;
    const loopFrames = 30 * 6;
    const graphics = [];
    const noiseLevel = 255;
    const noiseScale = 0.006;
    const noiseLoopRad = 120;
    const noiseLoopInc = p.TAU / loopFrames;

    const linearGradient = (g, x0, y0, x1, y1, stops) => {
      let grad = g.drawingContext.createLinearGradient(x0, y0, x1, y1);
      stops.forEach(([amt, color]) => grad.addColorStop(amt, color));
      g.drawingContext.fillStyle = grad;
      return grad;
    }

    // const previewNoise = () => {
    //   const s = noiseLoopRad * 2;
    //   const g = p.createGraphics(s, s);
    //   for (let y = 0; y < s; y += 1) {
    //     for (let x = 0; x < s; x += 1) {
    //       // Scale the input coordinates.
    //       let nx = noiseScale * x;
    //       let ny = noiseScale * y;
    //       let c = noiseLevel * p.noise(nx, ny);
    //       g.stroke(c);
    //       g.point(x, y);
    //     }
    //   }
    //   g.stroke('red');
    //   g.strokeWeight(2)
    //   for (let i = 0; i < loopFrames; i++) {
    //     let valX = s / 2 + p.cos(noiseLoopInc * i) * noiseLoopRad;
    //     let valY = s / 2 + p.sin(noiseLoopInc * i) * noiseLoopRad;
    //     g.point(valX, valY);
    //   }
    //   g.canvas.style.display = 'block';
    // }

    const getNaturalLoopShift = (currentLoopFrame) => {
      let x1 = noiseLoopRad + p.cos(noiseLoopInc * currentLoopFrame) * noiseLoopRad;
      let y1 = noiseLoopRad + p.sin(noiseLoopInc * currentLoopFrame) * noiseLoopRad;
      let x2 = p.cos(noiseLoopInc * currentLoopFrame) * noiseLoopRad;
      let y2 = p.sin(noiseLoopInc * currentLoopFrame) * noiseLoopRad;
      let dx = p.noise(x1 * noiseScale, y1 * noiseScale);
      let dy = p.noise(x2 * noiseScale, y2 * noiseScale);
      dx = p.map(dx, 0, 1, -120, 120);
      dy = p.map(dy, 0, 1, -120, 120);
      return [dx, dy];
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

    p.preload = () => {
      cursorImg = p.loadImage(cursorUrl);
    }

    p.setup = () => {
      let s = p.drawingContext.canvas.parentNode;
      let w = s.offsetWidth;
      let h = s.offsetHeight;
      p.createCanvas(w, h);
      p.frameRate(30);
      p.startRecorder();
      
      // p.noiseSeed(1302);
      p.noiseSeed(200734)

      graphics.push(bouncyGraphic({
        width: 390,
        height: 390,
        loopFrames: loopFrames,
        initialX: 260,
        initialY: 60,
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
        width: 160,
        height: 160,
        loopFrames: loopFrames,
        initialX: 184,
        initialY: 455,
        lapsX: 1,
        lapsY: 1,
        display: true,
        render: (g) => {
          g.background('#0000aa');
          g.textAlign(p.CENTER, p.CENTER);
          g.fill('pink');
          g.drawingContext.font = '300 100px citizen';
          g.text('4', g.width / 2, g.height / 2);
        },
      }));

      // graphics.push(bouncyGraphic({
      //   width: 170,
      //   height: 170,
      //   loopFrames: loopFrames,
      //   initialX: p.random(0, p.width),
      //   initialY: p.random(0, p.height),
      //   lapsX: p.random([-1, 1]),
      //   lapsY: p.random([-2, 2]),
      //   display: false,
      //   render: (g) => {
      //     linearGradient(g, 0, 0, 0, g.height, [[0, 'darkblue'], [1, 'blue']]);
      //     g.rect(0, 0, g.width, g.height);
      //   },
      // }));

      graphics.push(bouncyGraphic({
        width: 390,
        height: 240,
        loopFrames: loopFrames,
        initialX: 100,
        initialY: 575,
        lapsX: 1,
        lapsY: -1,
        display: true,
        render: (g) => {
          g.background('#dd0022');
          g.textAlign(p.CENTER, p.CENTER);
          g.fill('gold');
          g.drawingContext.font = '86px elfreth';
          g.text('Designers', g.width / 2, g.height / 2);
        },
      }));

      graphics.push(bouncyGraphic({
        width: 320,
        height: 320,
        loopFrames: loopFrames,
        initialX: 30,
        initialY: 173,
        lapsX: -2,
        lapsY: 1,
        display: true,
        render: (g) => {
          g.noStroke();
          linearGradient(g, 0, 0, 0, g.height, [[0, 'blue'], [0.5, 'red'], [1, 'yellow']]);
          g.rect(0, 0, g.width, g.height);
          g.textAlign(p.CENTER, p.CENTER);
          g.fill('black');
          g.drawingContext.font = '700 114px ohno-blazeface';
          g.text('p5.js', g.width / 2, g.height / 2);
        },
      }));

      // graphics.push(bouncyGraphic({
      //   width: 100,
      //   height: 100,
      //   loopFrames: loopFrames,
      //   initialX: p.random(0, p.width),
      //   initialY: p.random(0, p.height),
      //   lapsX: p.random([-1, 1]),
      //   lapsY: p.random([-1, 1]),
      //   display: false,
      //   render: (g) => {
      //     linearGradient(g, 0, 0, g.width, g.height, [[0, 'blue'], [1, 'red']]);
      //     g.rect(0, 0, g.width, g.height);
      //   },
      // }));
    }

    // p.noLoop();

    p.draw = () => {
      let currentLoopFrame = p.frameCount % loopFrames;

      p.background('black');

      // draw the main elements
      graphics.forEach(g => g.draw());
      
      // draw the cursor
      p.push();
      p.imageMode(p.CENTER);
      // this makes the periodicity loopable...
      let scaleX = loopFrames / p.TAU;
      let x = p.width / 2 + (p.sin(currentLoopFrame / (scaleX / 2)) * 140);
      let y = p.height / 2 + (p.sin(currentLoopFrame / (scaleX)) * 300);
      // this adds a loopable jank to the position to make it feel more "natural"
      let [dx, dy] = getNaturalLoopShift(currentLoopFrame);
      p.image(cursorImg, x + dx, y + dy, 32, 32, 0, 0, cursorImg.width, cursorImg.height, p.CONTAIN);
      p.pop();
      
      if (currentLoopFrame === 0) {
        graphics.forEach(g => g.reset());
      }

      // getting the loop to feel good when uplaoded is porving tricky...
      if (p.frameCount > 2 && (p.frameCount / 2) % loopFrames === 1) {
        p.stopRecorder('p5-2x-extra');
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
