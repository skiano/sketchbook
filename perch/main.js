import p5 from 'p5';
import loadAnimationLoop from './loadAnimationLoop.js';

loadAnimationLoop(p5);

const app = document.getElementById('app');

const c15 = document.createElement('div');
app.append(c15);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-15.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(30);
  }

  let timeout = 0;
  let wait = p.round(p.random(20, 36));
  let frame = p.round(p.random(0, 9));

  p.draw = () => {
    // let f = p.frameCount % 10;
    let f = frame;
    let rx = f * fw;
    p.background('#241a0e');
    p.push();
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0, fw, fh);
    p.pop();

    timeout += 1;
    if (timeout > wait) {
      timeout = 0;
      wait = p.round(p.random(7, 36));
      frame = p.round(p.random(0, 9));
    }
  };
}, c15);

const c16 = document.createElement('div');
app.append(c16);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-15.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(30);
  }

  function createSparrow(scale = 0.5) {
    let timeout = 0;
    let wait = p.round(p.random(20, 36));
    let frame = p.round(p.random(0, 9));
    return (x, y) => {
      let rx = frame * fw;
      let w = fw * scale;
      let h = fh * scale;
      let yoffset = 58 * scale;
      p.push();
      p.image(birdStrip, x - w / 2, (y - h / 2) - yoffset, w, h, rx, 0, fw, fh);
      p.pop();
      timeout += 1;
      if (timeout > wait) {
        timeout = 0;
        wait = p.round(p.random(7, 36));
        frame = p.round(p.random(0, 9));
      }
    }
  }

  let sparrow1 = createSparrow(0.45);
  let sparrow2 = createSparrow(0.5);
  let sparrow3 = createSparrow(0.47);

  p.draw = () => {
    p.background('#f4efe6');
    p.noStroke();
    p.fill('#e8ceb3')
    // p.rect(0, 150, p.width, 150);
    p.stroke('#ff8559');
    p.strokeWeight(1)
    p.line(0, 150, 300, 150);
    sparrow1(p.width / 2 - 80, 150);
    sparrow2(p.width / 2, 150);
    sparrow3(p.width / 2 + 80, 150);
  };
}, c16);


const c17 = document.createElement('div');
app.append(c17);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-16.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(12);
  }

  p.draw = () => {
    let f = p.constrain(p.frameCount % 8, 0, 4);
    let rx = f * fw;
    p.background('#7c847a');
    p.push();
    p.blendMode(p.REMOVE);
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0, fw, fh);
    p.pop();
  };
}, c17);

const c18 = document.createElement('div');
app.append(c18);

new p5((p) => {
  
  let stand;
  let hopLeft;
  let hopRight;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    hopRight = p.loadImage('./bird-strip-16.png');
    stand = p.loadImage('./bird-strip-15.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(12);
    hopLeft = p.createGraphics(hopRight.width, hopRight.height);
    hopLeft.push();
    hopLeft.scale(-1, 1);
    hopLeft.image(hopRight, -hopRight.width, 0);
    hopLeft.pop();
  }

  function createTwitch() {
    let timeout = 0;
    let wait = p.round(p.random(3, 8));
    let frame = p.round(p.random(0, 9));
    return () => {
      let rx = frame;
      if (timeout > wait) {
        timeout = 0;
        wait = p.round(p.random(3, 8));
        frame = p.round(p.random(0, 9));
      }
      timeout += 1;
      return rx;
    }
  }

  function createSparrow(scale = 0.5) {
    let w = fw * scale;
    let h = fh * scale;
    let offset = 58 * scale;
    let hopSpeed = 18 * scale;

    let x = 150;
    let dir = 0;
    let countDown = 24;

    let twitch = createTwitch();

    return (y = 150) => {
      let r;
      let rx;
      let img;

      switch (dir) {
        case 0:
          img = stand;
          r = twitch();
          rx = r * fw;
          break;
        case 1:
          img = hopRight;
          r = p.frameCount % 5;
          rx = r * fw;
          x += (r === 0 || r === 4) ? 0 : hopSpeed;
          break;
        case -1:
          img = hopLeft;
          r = p.frameCount % 5
          rx = r * fw;
          x -= (r === 0 || r === 4) ? 0 : hopSpeed;
          break;
      }

      countDown--;
      if (countDown <= 0) {
        dir = p.random([-1, 0, 1]);

        switch (dir) {
          case 0:
            countDown = p.round(p.random(12, 36));
            break;
          case 1:
          case -1:
            countDown = p.random([5, 10]);
            break;
        }

        if (x > p.width && dir !== -1) {
          dir = -1;
          countDown = 20;
        }
        if (x < 0 && dir !== 1) {
          dir = 1;
          countDown = 20;
        }
      }

      p.push();
      p.image(img, x - w / 2, y - offset - h / 2, w, h, rx, 0, fw, fh);
      p.push();
    }
  }

  let sparrow = createSparrow(0.5);

  p.draw = () => {
    let f = p.frameCount % 5;
    // p.background('#fffbcc');
    p.background('#fff696');
    p.noStroke();
    // p.fill('#fff696');
    // p.rect(0, 150, 300, 150);
    sparrow(150);
  };
}, c18);


const c19 = document.createElement('div');
app.append(c19);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-17.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(12);
  }

  p.draw = () => {
    let f = p.frameCount % 7;
    let rx = f * fw;
    p.background('#ff8559');
    p.push();
    p.blendMode(p.REMOVE);
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0, fw, fh);
      p.push();
      p.blendMode(p.DARKEST);
      p.fill('#fffbcc');
      p.noStroke();
      p.rect(0, 0, p.width, p.height);
      p.pop();
    p.pop();
  };
}, c19);


const c20 = document.createElement('div');
app.append(c20);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-17.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(12);
  }

  function createSparrow(scale = 0.5, velocity = 14, xOffset, frameOffset) {
    let w = scale * fw;
    let h = scale * fh;
    let buffer = 40;
    frameOffset = frameOffset || Math.round(p.random(0, 7));
    xOffset = xOffset || Math.round(p.random(0, 600));
    return (y = 150) => {
      let f = (p.frameCount + frameOffset) % 7;
      let rx = f * fw;
      let x = ((p.frameCount * velocity + xOffset) % (p.width + buffer * 2)) - buffer;
      p.push();
      p.image(birdStrip, x - w / 2, y - h / 2, w, h, rx, 0, fw, fh);
      p.pop();
    }
  }

  let sparrow1 = createSparrow(0.4, 14, 2, 1);
  let sparrow2 = createSparrow(0.5, 17, 170, 6);
  let sparrow3 = createSparrow(0.45, 16, 70, 3);
  let sparrow4 = createSparrow(0.36, 15, 200, 2);

  p.draw = () => {
    p.background('#241a0e');
    sparrow1(60);
    sparrow4(100);
    sparrow2(160);
    sparrow3(230);
  };
}, c20);


const c21 = document.createElement('div');
app.append(c21);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-18.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(12);
  }

  p.draw = () => {
    let offset = 3;
    let f = (p.frameCount + offset) % 7;
    let rx = f * fw;
    p.background('#f4f1ea');
    p.push();
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0, fw, fh);
    p.pop();
  };
}, c21);

const c22 = document.createElement('div');
app.append(c22);

new p5((p) => {
  let fly;
  let hover;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    fly = p.loadImage('./bird-strip-17.png');
    hover = p.loadImage('./bird-strip-18.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(15);
  }

  let x = 10;
  let y = 80;
  let vx = 1;
  let vy = 2.5;

  p.draw = () => {
    let offset = 4;
    let scale = 0.5;
    let f = (p.frameCount + offset) % 7;
    let rx = f * fw;

    let w = scale * fw;
    let h = scale * fh;

    let movement;
    let anchorX = 0;
    let anchorY = 0;
    let shouldHover = (x > 130 && x < 180);

    if (shouldHover) {
      vx = p.max(vx * 0.7, 1);
      vy = 0.6 * vy;
      movement = hover;
      anchorY = 6;
    } else {
      vx = 24 * scale;
      vy = x < p.width / 2 ? 15 * scale : -6 * scale;
      anchorX = -7;
      anchorY = -4;
      movement = fly;
    }

    p.background('#8ba574');
    p.push();
    p.blendMode(p.REMOVE);
    p.image(movement, x + anchorX - w / 2, y + anchorY - h / 2, w, h, rx, 0, fw, fh);
    p.pop();

    // p.push();
    // p.noStroke();
    // p.fill('red');
    // p.circle(x, y, 6);
    // p.pop();

    x += vx;
    y += vy;
    if (x > p.width + 30) {
      x = -30;
      y = 80;
    }
    if (y > p.height + 30) y = -30;
  };
}, c22);


const c23 = document.createElement('div');
app.append(c23);

new p5((p) => {
  let fly;
  let hover;
  let fw = 200;
  let fh = 200;

  let hoverCycle;

  p.preload = () => {
    fly = p.loadImage('./bird-strip-17.png');
    hover = p.loadImage('./bird-strip-18.png');

    hoverCycle = p.loadAnimationLoop('./bird-strip-15.png', {
      debug: true,
      anchor: [0, -58],
      pivot: [0, 0],
      scale: 0.7,
    });
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(15);
  }

  let x = 10;
  let y = 80;
  let vx = 1;
  let vy = 2.5;
  let landingX = 220;
  let landingY = 220;

  p.draw = () => {
    let offset = 1;
    let scale = 0.5;
    let f = (p.frameCount + offset) % 7;
    let rx = f * fw;

    let w = scale * fw;
    let h = scale * fh;

    let movement;
    let anchorX = 0;
    let anchorY = 0;
    let shouldHover = (x > 130 && x < 180);

    if (shouldHover) {
      vx = p.max(vx * 0.7, 1);
      vy = 0.6 * vy;
      movement = hover;
      anchorY = 10 * scale;
    } else {
      vx = 24 * scale;
      vy = x < p.width / 2 ? 15 * scale : -6 * scale;
      anchorX = -14 * scale;
      anchorY = -8 * scale;
      movement = fly;
    }

    p.background('#fff696');
    p.push();
    p.image(movement, x + anchorX - w / 2, y + anchorY - h / 2, w, h, rx, 0, fw, fh);
    p.pop();

    p.push();
    p.noFill();
    p.stroke('#ff8559');
    p.line(0, landingY, p.width, landingY);
    p.strokeWeight(6)
    p.point(landingX, landingY)
    p.pop();

    p.push();
    p.noStroke();
    p.fill('black');
    p.circle(x, y, 6);
    p.pop();

    x += vx;
    y += vy;
    if (x > p.width + 30) {
      x = -30;
      y = 80;
    }
    if (y > p.height + 30) y = -30;

    // hoverCycle.render(150, 150, p.frameCount * 5)
    hoverCycle.render(150, 150)
  };
}, c23);