import p5 from 'p5';

const app = document.getElementById('app');

// const c1 = document.createElement('div');
// app.append(c1);

// new p5((p) => {
//   let birdStrip;
//   let fw = 76;
//   let fh = 120;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip.jpg');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(15);
//   }

//   p.draw = () => {
//     let f = p.frameCount % 12;
//     let rx = f * fw;

//     p.background('#ff8559');
//     p.image(
//       birdStrip,
//       p.width / 2 - fw / 2, // x-coordinate of the top-left corner of the imag
//       p.height / 2 - fh / 2, // y-coordinate of the top-left corner of the image
//       fw, // width to draw the image
//       fh, // height to draw the image
//       rx, // the x-coordinate of the destination rectangle in which to draw the source image
//       0,  // the y-coordinate of the destination rectangle in which to draw the source image
//       fw, // the width of the destination rectangle
//       fh, // the height of the destination rectangle
//     );
//   };

// }, c1);

// const c3 = document.createElement('div');
// app.append(c3);

// new p5((p) => {
//   let birdStrip;
//   let fw = 74;
//   let fh = 120;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-3.jpg');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(20);
//   }

//   p.draw = () => {
//     p.background('#000');
//     let f = p.frameCount % 7;
//     let rx = f * fw;
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);

//     p.push();
//     p.blendMode(p.LIGHTEST);
//     p.fill('#8ba574');
//     p.rect(0, 0, p.width, p.height);
//     p.pop();
//   };

// }, c3);




// const c4 = document.createElement('div');
// app.append(c4);

// new p5((p) => {
//   let birdStrip;
//   let fw = 74;
//   let fh = 120;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-3.jpg');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(20);
//   }

//   function drawBird(x, y, offset = 0) {
//     let f = (p.frameCount + offset) % 7;
//     let rx = f * fw;
//     p.image(birdStrip, x - fw / 2, y - fh / 2, fw, fh, rx, 0,fw, fh,);
//   }

//   p.draw = () => {
//     p.background('#000');
//     p.push();
//     p.blendMode(p.SCREEN);
//     drawBird(p.width - ((p.frameCount * 8) % (p.width + 100)), 40);
//     drawBird(p.width -  ((p.frameCount * 10) % (p.width + 100)), 60, 2);
//     drawBird(p.width -  (((p.frameCount + 100) * 10) % (p.width + 100)), 100, 4);
//     drawBird(p.width -  (((p.frameCount + 100) * 8) % (p.width + 70)), 140, 1);
//     drawBird(p.width -  (((p.frameCount + 20) * 11) % (p.width + 70)), 190, 3);
//     drawBird(p.width -  (((p.frameCount + 0) * 11.5) % (p.width + 70)), 230, 6);
//     p.pop();

//     p.push();
//     p.blendMode(p.LIGHTEST);
//     p.fill('#241a0e');
//     p.rect(0, 0, p.width, p.height);
//     p.pop();
//   };

// }, c4);


// const c5 = document.createElement('div');
// app.append(c5);

// new p5((p) => {
//   let birdStrip;
//   let fw = 74;
//   let fh = 120;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-3.jpg');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(20);
//   }

//   function drawBird(x, y, offset = 0) {
//     let f0 = (p.frameCount + offset) % 7;
//     let rx0 = f0 * fw;

//     let f = (p.frameCount + offset + 1) % 7;    
//     let rx = f * fw;

//     p.push();
//     p.tint(255, 90);
//     p.image(birdStrip, x - fw / 2, y - fh / 2, fw, fh, rx0, 0,fw, fh);
//     p.pop();
//     p.image(birdStrip, x - fw / 2, y - fh / 2, fw, fh, rx, 0,fw, fh);
//   }

//   p.draw = () => {
//     p.background('#7c847a');
//     p.push();
//     p.blendMode(p.SCREEN);
//     drawBird(p.width - ((p.frameCount * 8) % (p.width + 100)), 40);
//     drawBird(p.width -  ((p.frameCount * 10) % (p.width + 100)), 60, 2);
//     drawBird(p.width -  (((p.frameCount + 100) * 10) % (p.width + 100)), 100, 4);
//     drawBird(p.width -  (((p.frameCount + 100) * 8) % (p.width + 70)), 140, 1);
//     drawBird(p.width -  (((p.frameCount + 20) * 11) % (p.width + 70)), 190, 3);
//     drawBird(p.width -  (((p.frameCount + 0) * 11.5) % (p.width + 70)), 230, 6);
//     p.pop();
//   };

// }, c5);

// const c6 = document.createElement('div');
// app.append(c6);

// new p5((p) => {
//   let birdStrip;
//   let fw = 200;
//   let fh = 200;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-4.jpg');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(10);
//   }

//   p.draw = () => {
//     let f = p.frameCount % 7;
//     let rx = f * fw;
//     p.background('#fff696');
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
//   };

// }, c6);

// const c7 = document.createElement('div');
// app.append(c7);


// new p5((p) => {
//   let birdStrip;
//   let fw = 200;
//   let fh = 200;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-5.png');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(10);
//   }

//   p.draw = () => {
//     let f = p.frameCount % 6;
//     let rx = f * fw;
//     p.background('#e8ceb3');
//     p.push();
//     p.blendMode(p.REMOVE);
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
//     p.pop();
//   };

// }, c7);


// const c8 = document.createElement('div');
// app.append(c8);

// new p5((p) => {
//   let birdStrip;
//   let fw = 200;
//   let fh = 200;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-9.png');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(15);
//   }

//   p.draw = () => {
//     let f = p.frameCount % 6;
//     let rx = f * fw;
//     p.background('#241a0e');
//     p.push();
//     p.blendMode(p.REMOVE);
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
//     p.pop();
//   };
// }, c8);

// const c9 = document.createElement('div');
// app.append(c9);

// new p5((p) => {
//   let birdStrip;
//   let fw = 200;
//   let fh = 200;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-12.png');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(15);
//   }

//   p.draw = () => {
//     let f = p.frameCount % 6;
//     let rx = f * fw;
//     p.background('#f4f1ea');
//     p.push();
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
//     p.pop();
//   };
// }, c9);

// const c10 = document.createElement('div');
// app.append(c10);

// new p5((p) => {
//   let birdStrip;
//   let fw = 200;
//   let fh = 200;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-13.png');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(15);
//   }

//   p.draw = () => {
//     let f = p.frameCount % 7;
//     let rx = f * fw;
//     p.background('#8ba574');
//     p.push();
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
//     p.pop();
//   };
// }, c10);


// const c11 = document.createElement('div');
// app.append(c11);

// new p5((p) => {
//   let birdStrip;
//   let fw = 200;
//   let fh = 200;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-14.png');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(30);
//   }

//   p.draw = () => {
//     let f0 = (p.frameCount % 12) / 2 >> 0;
//     let f1 = ((p.frameCount + 1) % 12) / 2 >> 0;

//     // frame blending like...
//     // 00
//     // 01
//     // 11

//     let rx = f1 * fw;
//     let rxblend = f0 * fw;
//     p.background('#fff696');

//     p.push();
//     p.tint(255, 90);
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rxblend, 0,fw, fh);
//     p.pop();

//     p.push();
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0,fw, fh,);
//     p.pop();
//   };
// }, c11);

// const c12 = document.createElement('div');
// app.append(c12);

// new p5((p) => {
//   let birdStrip;
//   let fw = 200;
//   let fh = 200;

//   p.preload = () => {
//     birdStrip = p.loadImage('./bird-strip-14.png');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(30);
//   }

//   function drawBird(x, y, offset = 0, scale = 1) {
//     let w = fw * scale;
//     let h = fh * scale;
//     let f = p.frameCount + offset;
//     let f0 = (f % 12) / 2 >> 0;
//     let f1 = ((f + 1) % 12) / 2 >> 0;
//     let rx0 = f0 * fw;
//     let rx1 = f1 * fw;

//     p.push();
//     p.tint(255, 90);
//     p.image(birdStrip, x - w/2, y - h/2, w, h, rx0, 0, fw, fh);
//     p.pop();

//     p.push();
//     p.image(birdStrip, x - w/2, y - h/2, w, h, rx1, 0, fw, fh);
//     p.pop();
//   }

//   p.draw = () => {
//     p.background('#ff8559');

//     let dist = p.width + (fw);
    
//     drawBird((((p.frameCount + 30) * 5) % dist) - fw / 4, 80, 4, 0.4);
//     drawBird(((p.frameCount * 7) % dist) - fw / 4, 150, 1, 0.5);
//     drawBird((((p.frameCount +  50) * 9) % dist) - fw / 4, 200, 3, 0.6);
//     drawBird((((p.frameCount +  10) * 11) % dist) - fw / 4, 250, 5, 0.8);
//   };
// }, c12);


// const c13 = document.createElement('div');
// app.append(c13);

// new p5((p) => {
//   let birdStrip;
//   let fw = 125;
//   let fh = 115;

//   p.preload = () => {
//     birdStrip = p.loadImage('./alt-strip.jpg');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(30);
//   }

//   p.draw = () => {
//     let f = p.frameCount % 16;
//     let rx = (f % 8) * fw;
//     let ry = ((f / 8) >> 0) * fh;

//     p.background('#241a0e');
//     p.image(
//       birdStrip,
//       p.width / 2 - fw / 2, // x-coordinate of the top-left corner of the imag
//       p.height / 2 - fh / 2, // y-coordinate of the top-left corner of the image
//       fw, // width to draw the image
//       fh, // height to draw the image
//       rx, // the x-coordinate of the destination rectangle in which to draw the source image
//       ry,  // the y-coordinate of the destination rectangle in which to draw the source image
//       fw, // the width of the destination rectangle
//       fh, // the height of the destination rectangle
//     );
//   };

// }, c13);

// const c14 = document.createElement('div');
// app.append(c14);

// new p5((p) => {
//   let birdStrip;
//   let fw = 200;
//   let fh = 200;

//   p.preload = () => {
//     birdStrip = p.loadImage('./landing-strip-01.jpg');
//   }

//   p.setup = () => {
//     p.createCanvas(300, 300);
//     p.frameRate(15);
//   }

//   p.draw = () => {
//     let f = p.frameCount % 14;
//     let rx = p.constrain(f, 0, 6) * fw;
//     p.background('#cca77d');
//     p.push();
//     // p.blendMode(p.DARKEST);
//     p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0, fw, fh);
//     p.pop();
//   };

// }, c14);

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
    let f = p.frameCount % 7;
    let rx = f * fw;
    p.background('#8ba574');
    p.push();
    p.blendMode(p.REMOVE);
    p.image(birdStrip, p.width / 2 - fw / 2, p.height / 2 - fh / 2, fw, fh, rx, 0, fw, fh);
    p.pop();
  };
}, c21);