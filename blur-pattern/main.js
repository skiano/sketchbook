import p5 from 'p5';

const app = document.getElementById('app');

// const curve = document.createElement('div');
// app.append(curve);

// new p5((p) => {
//   p.setup = () => {
//     p.createCanvas(200, 200);
//     p.frameRate(30);
//   }

//   p.draw = () => {
//     p.background('#ff8559');
//   };
// }, curve);

const pattern = document.createElement('div');
app.append(pattern);

new p5((p) => {
  let unit = 100;
  let raw;

  p.setup = () => {
    p.frameRate(30);
    p.createCanvas(unit * 5, unit * 5);
    raw = p.createGraphics(unit * 3, unit * 3);
  }

  p.draw = () => {

    // draw onto raw...
    // raw.canvas.style.display = 'block';
    raw.noStroke();
    raw.rect(0, 0, raw.width, raw.height);
    raw.push();
    raw.fill('red');
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        raw.circle(
          (unit * x) + (unit / 2) + (p.sin(p.frameCount / 20) * 5),
          (unit * y) + (unit / 2) + (p.cos(p.frameCount / 10) * 5),
          unit * 0.42
        );
        raw.circle(
          (unit * x) + (p.sin(p.frameCount / 15) * 5),
          (unit * y) + (p.cos(p.frameCount / 30) * 5),
          unit * 0.42,
        );
        // raw.circle((unit * x) + (unit), (unit) + (unit / 2), unit / 2);
      }  
    }
    raw.filter(raw.BLUR, 14);
    raw.filter(raw.THRESHOLD, p.map(p.sin(p.frameCount / 20), -1, 1, 0.8, 0.93))
    raw.blendMode(raw.LIGHTEST);
    raw.fill('blue');
    raw.rect(0, 0, raw.width, raw.height);
    raw.pop();

    // tile clipped onto canvas...

    p.blendMode(p.BLEND);
    p.background('yellow');
    p.push();
    p.blendMode(p.EXCLUSION);
    for (let x = 0; x < 5; x += 1) {
      for (let y = 0; y < 5; y += 1) {
        p.image(raw,
          x * unit, y * unit, 
          unit, unit, 
          unit, unit,
          unit, unit
        );
      }  
    }
    p.pop();
  };
}, pattern);