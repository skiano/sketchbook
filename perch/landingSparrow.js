import P5 from 'p5';
import config from './config.js';
import createSparrow from './createSparrow.js';
import addAnimationLoops from './loadAnimationLoop.js';

addAnimationLoops(P5);

export default function createLandingSparrow(opt) {
  let loops;
  let sparrow;
  let currentX;
  let currentY;
  let followX;
  let followY;

  return {
    preload(p5) {
      loops = p5.loadAnimationLoopMap(config, {
        fill: '#ff654a',
      });
    },
    setup(p5) {
      sparrow = createSparrow({
        render: loops,
        x: 0,
        y: -60,
        scale: 0.4,
      });
      currentX = -60;
      currentY = p5.height / 5;
    },
    start() {
      let { x, y } = opt.getStartingPosition();
      currentX = x;
      currentY = y;
    },
    goTo(x, y) {
      currentX = x;
      currentY = y;
      followX = false;
      followY = false;
    },
    follow() {
      followX = true;
      followY = true;
    },
    followX() {
      followX = true;
    },
    addBubblePerch(bubble) {
      sparrow.addPerch(bubble.x - bubble.rx, bubble.y - bubble.ry, bubble.width);
    },
    draw(p5) {
      if (followX) currentX = p5.lerp(currentX, p5.mouseX, 0.3);
      if (followY) currentY = p5.lerp(currentY, p5.mouseY, 0.3);
      sparrow.moveTo(currentX, currentY);
      sparrow.render();
    },
  }
}