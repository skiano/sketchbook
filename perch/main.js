import p5 from 'p5';

const app = document.getElementById('app');

const c1 = document.createElement('div');
app.append(c1);

new p5((p) => {
  let birdStrip;
  let fw = 76;
  let fh = 120;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip.jpg');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(15);
  }

  p.draw = () => {
    let f = p.frameCount % 12;
    let rx = f * fw;

    p.background('#333');
    p.image(
      birdStrip,
      p.width / 2 - fw / 2, // x-coordinate of the top-left corner of the imag
      p.height / 2 - fh / 2, // y-coordinate of the top-left corner of the image
      fw, // width to draw the image
      fh, // height to draw the image
      rx, // the x-coordinate of the destination rectangle in which to draw the source image
      0,  // the y-coordinate of the destination rectangle in which to draw the source image
      fw, // the width of the destination rectangle
      fh, // the height of the destination rectangle
    );
  };

}, c1);

const c2 = document.createElement('div');
app.append(c2);

new p5((p) => {
  let birdStrip;
  let fw = 74;
  let fh = 120;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-2.jpg');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(20);
  }

  p.draw = () => {
    let f = p.frameCount % 12;
    let rx = f * fw;
    p.background('#333');
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
  };

}, c2);



const c3 = document.createElement('div');
app.append(c3);

new p5((p) => {
  let birdStrip;
  let fw = 74;
  let fh = 120;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-3.jpg');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(20);
  }

  p.draw = () => {
    p.background('#000');
    let f = p.frameCount % 7;
    let rx = f * fw;
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
  };

}, c3);




const c4 = document.createElement('div');
app.append(c4);

new p5((p) => {
  let birdStrip;
  let fw = 74;
  let fh = 120;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-3.jpg');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(20);
  }

  function drawBird(x, y, offset = 0) {
    let f = (p.frameCount + offset) % 7;
    let rx = f * fw;
    p.image(birdStrip, x - fw / 2, y - fh / 2, fw, fh, rx, 0,fw, fh,);
  }

  p.draw = () => {
    p.background('#000');
    p.push();
    p.blendMode(p.SCREEN);
    drawBird(p.width - ((p.frameCount * 8) % (p.width + 100)), 40);
    drawBird(p.width -  ((p.frameCount * 10) % (p.width + 100)), 60, 2);
    drawBird(p.width -  (((p.frameCount + 100) * 10) % (p.width + 100)), 100, 4);
    drawBird(p.width -  (((p.frameCount + 100) * 8) % (p.width + 70)), 140, 1);
    drawBird(p.width -  (((p.frameCount + 20) * 11) % (p.width + 70)), 190, 3);
    drawBird(p.width -  (((p.frameCount + 0) * 11.5) % (p.width + 70)), 230, 6);
    p.pop();
  };

}, c4);


const c5 = document.createElement('div');
app.append(c5);

new p5((p) => {
  let birdStrip;
  let fw = 74;
  let fh = 120;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-3.jpg');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(20);
  }

  function drawBird(x, y, offset = 0) {
    let f0 = (p.frameCount + offset) % 7;
    let rx0 = f0 * fw;

    let f = (p.frameCount + offset + 1) % 7;    
    let rx = f * fw;

    p.push();
    p.tint(255, 90);
    p.image(birdStrip, x - fw / 2, y - fh / 2, fw, fh, rx0, 0,fw, fh);
    p.pop();
    p.image(birdStrip, x - fw / 2, y - fh / 2, fw, fh, rx, 0,fw, fh);
  }

  p.draw = () => {
    p.background('#000');
    p.push();
    p.blendMode(p.SCREEN);
    drawBird(p.width - ((p.frameCount * 8) % (p.width + 100)), 40);
    drawBird(p.width -  ((p.frameCount * 10) % (p.width + 100)), 60, 2);
    drawBird(p.width -  (((p.frameCount + 100) * 10) % (p.width + 100)), 100, 4);
    drawBird(p.width -  (((p.frameCount + 100) * 8) % (p.width + 70)), 140, 1);
    drawBird(p.width -  (((p.frameCount + 20) * 11) % (p.width + 70)), 190, 3);
    drawBird(p.width -  (((p.frameCount + 0) * 11.5) % (p.width + 70)), 230, 6);
    p.pop();
  };

}, c5);

