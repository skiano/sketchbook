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
        y: 0,
        scale: 0.48,
      });
      currentX = -60;
      currentY = 0;
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
    goToY(y) {
      currentY = y;
      followY = false;
    },
    follow() {
      followX = true;
      followY = true;
    },
    followX() {
      followX = true;
    },
    unfollow() {
      followX = false;
      followY = false;
    },
    addPerch(...args) {
      return sparrow.addPerch(...args);
    },
    removeBubblePerch(perch) {
      sparrow.removePerch(perch);
    },
    draw(p5) {
      if (followX && p5.mouseX > 0) currentX = p5.lerp(currentX, p5.mouseX, 0.3);
      if (followY && p5.mouseY > 0) currentY = p5.lerp(currentY, p5.mouseY, 0.3);
      sparrow.moveTo(currentX, currentY);
      sparrow.render();
    },
  }
}