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

    p.background('#ff8559');
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

// const c2 = document.createElement('div');
// app.append(c2);

// new p5((p) => {
//   let birdStrip;
//   let fw = 74;
//   let fh = 120;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-2.jpg');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(20);
//   }

//   p.draw = () => {
//     let f = p.frameCount % 12;
//     let rx = f * fw;
//     p.background('#333');
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
//   };

// }, c2);



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

    p.push();
    p.blendMode(p.LIGHTEST);
    p.fill('#8ba574');
    p.rect(0, 0, p.width, p.height);
    p.pop();
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

    p.push();
    p.blendMode(p.LIGHTEST);
    p.fill('#241a0e');
    p.rect(0, 0, p.width, p.height);
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
    p.background('#7c847a');
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

const c6 = document.createElement('div');
app.append(c6);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-4.jpg');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(10);
  }

  p.draw = () => {
    let f = p.frameCount % 7;
    let rx = f * fw;
    p.background('#fff696');
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
  };

}, c6);

const c7 = document.createElement('div');
app.append(c7);


new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-5.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(10);
  }

  p.draw = () => {
    let f = p.frameCount % 6;
    let rx = f * fw;
    p.background('#e8ceb3');
    p.push();
    p.blendMode(p.REMOVE);
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
    p.pop();
  };

}, c7);


const c8 = document.createElement('div');
app.append(c8);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-9.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(15);
  }

  p.draw = () => {
    let f = p.frameCount % 6;
    let rx = f * fw;
    p.background('#241a0e');
    p.push();
    p.blendMode(p.REMOVE);
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
    p.pop();
  };
}, c8);

const c9 = document.createElement('div');
app.append(c9);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-12.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(15);
  }

  p.draw = () => {
    let f = p.frameCount % 6;
    let rx = f * fw;
    p.background('#f4f1ea');
    p.push();
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
    p.pop();
  };
}, c9);

const c10 = document.createElement('div');
app.append(c10);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-13.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(15);
  }

  p.draw = () => {
    let f = p.frameCount % 7;
    let rx = f * fw;
    p.background('#8ba574');
    p.push();
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
    p.pop();
  };
}, c10);


const c11 = document.createElement('div');
app.append(c11);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-14.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(30);
  }

  p.draw = () => {
    let f0 = (p.frameCount % 12) / 2 >> 0;
    let f1 = ((p.frameCount + 1) % 12) / 2 >> 0;

    // frame blending like...
    // 00
    // 01
    // 11

    let rx = f1 * fw;
    let rxblend = f0 * fw;
    p.background('#fff696');

    p.push();
    p.tint(255, 90);
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rxblend, 0,fw, fh);
    p.pop();

    p.push();
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
    p.pop();
  };
}, c11);

const c12 = document.createElement('div');
app.append(c12);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./bird-strip-14.png');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(30);
  }

  function drawBird(x, y, offset = 0, scale = 1) {
    let w = fw * scale;
    let h = fh * scale;
    let f = p.frameCount + offset;
    let f0 = (f % 12) / 2 >> 0;
    let f1 = ((f + 1) % 12) / 2 >> 0;
    let rx0 = f0 * fw;
    let rx1 = f1 * fw;

    p.push();
    p.tint(255, 90);
    p.image(birdStrip, x - w/2, y - h/2, w, h, rx0, 0, fw, fh);
    p.pop();

    p.push();
    p.image(birdStrip, x - w/2, y - h/2, w, h, rx1, 0, fw, fh);
    p.pop();
  }

  p.draw = () => {
    p.background('#ff8559');

    let dist = p.width + (fw);
    
    drawBird((((p.frameCount + 30) * 5) % dist) - fw / 4, 80, 4, 0.4);
    drawBird(((p.frameCount * 7) % dist) - fw / 4, 150, 1, 0.5);
    drawBird((((p.frameCount +  50) * 9) % dist) - fw / 4, 200, 3, 0.6);
    drawBird((((p.frameCount +  10) * 11) % dist) - fw / 4, 250, 5, 0.8);
  };
}, c12);


const c13 = document.createElement('div');
app.append(c13);

new p5((p) => {
  let birdStrip;
  let fw = 125;
  let fh = 115;

  p.preload = () => {
    birdStrip = p.loadImage('./alt-strip.jpg');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(30);
  }

  p.draw = () => {
    let f = p.frameCount % 16;
    let rx = (f % 8) * fw;
    let ry = ((f / 8) >> 0) * fh;

    p.background('#241a0e');
    p.image(
      birdStrip,
      p.width / 2 - fw / 2, // x-coordinate of the top-left corner of the imag
      p.height / 2 - fh / 2, // y-coordinate of the top-left corner of the image
      fw, // width to draw the image
      fh, // height to draw the image
      rx, // the x-coordinate of the destination rectangle in which to draw the source image
      ry,  // the y-coordinate of the destination rectangle in which to draw the source image
      fw, // the width of the destination rectangle
      fh, // the height of the destination rectangle
    );
  };

}, c13);

const c14 = document.createElement('div');
app.append(c14);

new p5((p) => {
  let birdStrip;
  let fw = 200;
  let fh = 200;

  p.preload = () => {
    birdStrip = p.loadImage('./landing-strip-01.jpg');
  }

  p.setup = () => {
    p.createCanvas(300, 300);
    p.frameRate(15);
  }

  p.draw = () => {
    let f = p.frameCount % 14;
    let rx = p.constrain(f, 0, 6) * fw;
    p.background('#cca77d');
    p.push();
    // p.blendMode(p.DARKEST);
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0, fw, fh);
    p.pop();
  };

}, c14);

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
      let yoffset = 56 * scale;
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

  let sparrow1 = createSparrow(0.4);
  let sparrow2 = createSparrow(0.4);
  let sparrow3 = createSparrow(0.4);

  p.draw = () => {
    p.background('#f4f1ea');
    p.noStroke();
    p.fill('#e8ceb3')
    p.rect(0, p.height / 2, p.width, p.height / 2);
    sparrow1(p.width / 2 - 80, p.height / 2);
    sparrow2(p.width / 2, p.height / 2);
    sparrow3(p.width / 2 + 80, p.height / 2);
  };
}, c16);