import p5 from 'p5';
import config from './config.js';
import addCanvas from './addCanvas.js';
import createSparrow from './createSparrow.js';
import addAnimationLoops from './loadAnimationLoop.js';
import addAwaitFonts from './awaitFonts.js';
import palette from './palette.js';
import './typography.js';

// install plugins
addAnimationLoops(p5);
addAwaitFonts(p5);

///////////////////////
// TESTING WITH LOGO //
///////////////////////

addCanvas((p) => {
  let loops;
  let sparrow;
  let ground;

  p.preload = () => {
    // TODO: the await fonts function is interfering with the decrement logic
    // p.awaitFonts([
    //   ['Albert Sans', '100 900'],
    // ]);
    loops = p.loadAnimationLoopMap(config, {
      fill: palette.primary[0],
    });
  }

  p.setup = () => {
    ground = p.height * 2 / 3;

    sparrow = createSparrow({
      render: loops,
      x: p.width + 50,
      y: 100,
      scale: 0.5,
    });
    sparrow.addPerch(0, ground, 455);

    p.updateFontVariables('Albert Sans', {
      ital: 1,
      wght: 650,
    });
  }

  p.draw = () => {
    p.background(palette.cool[8]);

    p.push();
    p.fill(palette.primary[0])
    p.textSize(58)
    p.text('perch', 55, ground)
    p.pop();

    let loopFrame = p.frameCount % 160;
    let right = 232;

    if (loopFrame === 1) sparrow.moveTo(p.width * 0.2, 190);
    if (loopFrame === 10) sparrow.moveTo(p.width * 0.4, 250);
    if (loopFrame === 12) sparrow.moveTo(p.width * 0.8, 220);
    if (loopFrame === 35) sparrow.moveTo(right, ground - 20);
    if (loopFrame === 37) sparrow.moveTo(right, ground + 7);
    if (loopFrame === 53) sparrow.moveTo(right - 9, ground);
    if (loopFrame === 75) sparrow.moveTo(right + 19, ground);
    if (loopFrame === 77) sparrow.moveTo(right + 30, ground);
    if (loopFrame === 79) sparrow.moveTo(right + 70, ground);
    if (loopFrame === 80) sparrow.moveTo(right + 71, ground);
    if (loopFrame === 81) sparrow.moveTo(right + 72, ground);
    if (loopFrame === 90) sparrow.moveTo(right + 90, ground);
    if (loopFrame === 115) sparrow.moveTo(right + 120, ground - 20);
    if (loopFrame === 124) sparrow.moveTo(300, 235);
    if (loopFrame === 126) sparrow.moveTo(100, 135);

    // hidden back to start
    if (loopFrame === 150) sparrow.moveTo(-80, 90);
    if (loopFrame === 151) sparrow.moveTo(-80, -200);
    if (loopFrame === 152) sparrow.moveTo(p.width + 200, -200);

    sparrow.render();
  };
}, {
  width: 455,
  height: 455,
});

///////////////////////
// TESTING BEHAVIORS //
///////////////////////

addCanvas((p) => {
  let loops;
  let sparrow;
  let homeBase;

  p.preload = () => {
    loops = p.loadAnimationLoopMap(config, { fill: palette.primary[0] });
  }

  p.setup = () => {
    sparrow = createSparrow({
      render: loops,
      x: p.width + 50,
      y: 30,
    });
    sparrow.addPerch(130, 200, 70);
    sparrow.addPerch(200, 300, 190);
    sparrow.addPerch(90, 380, 120);
    homeBase = [325, 185];
  }

  p.draw = () => {
    p.background(palette.warm[0]);

    // render the perches
    p.noFill();
    sparrow.eachPerch((x, y, w, magnet) => {
      p.push();
      p.stroke(palette.warm[4]);
      p.line(x, y, x + w, y);
      p.strokeWeight(6);
      p.point(x, y);
      p.point(x + w, y);
      // debugging...
      // p.stroke('cyan');
      // p.line(x, y - magnet, x + w, y - magnet);
      // p.line(x, y + magnet, x + w, y + magnet);
      p.pop();
    });

    // render the sparrow
    if (
      p.mouseX >= p.width ||
      p.mouseX <= 0 ||
      p.mouseY >= p.height ||
      p.mouseY <= 0
    ) {
      sparrow.moveTo(...homeBase);
    } else {
      let x = p.constrain(p.mouseX, 50, p.width - 50);
      let y = p.constrain(p.mouseY, 80, p.height - 20);
      sparrow.moveTo(x, y);
    }

    sparrow.render();
  };
}, {
  width: 455,
  height: 455,
});

