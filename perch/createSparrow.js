// the logic for how the sparrows behave
// hopefully decoupled from p5.js entirely

const HALF_TURN = Math.PI;

const STAND = 'stand';
const HOP_LEFT = 'hopLeft';
const HOP_RIGHT = 'hopRight';
const HOVER_LEFT = 'hoverLeft';
const HOVER_RIGHT = 'hoverRight';
const FLY_LEFT = 'flyLeft';
const FLY_RIGHT = 'flyRight';

function ramp(v1, v2, force = 0.5) {
  return v1 + ((v2 - v1) * force);
}

const createConsoleRender = (name, length = 7) => {
  let frame = 0;
  // A new renderer should implement this interface...
  // and each loop requires an instance of renderer
  return {
    getLength() {
      return length;
    },
    getFrame() {
      return frame;
    },
    setFrame(i) {
      console.log(`
        > ${name}  
          Set frame to ${i}
        `);
      frame = 0;
    },
    render(x, y, r) {
      console.log(`
      > ${name}: frame ${frame}
        x = ${x} px
        y = ${y} px
        r = ${r} radians
      `);
      frame += 1;
      if (frame >= length) frame = 0;
    }
  }
}

export default function createSparrow(opt) {
  opt = {
    x: 0,
    y: 0,
    r: 0,
    scale: 0.5,
    render: {
      [STAND]: createConsoleRender(STAND),
      [HOP_LEFT]: createConsoleRender(HOP_LEFT),
      [HOP_RIGHT]: createConsoleRender(HOP_RIGHT),
      [HOVER_LEFT]: createConsoleRender(HOVER_LEFT),
      [HOVER_RIGHT]: createConsoleRender(HOVER_RIGHT),
      [FLY_LEFT]: createConsoleRender(FLY_LEFT),
      [FLY_RIGHT]: createConsoleRender(FLY_RIGHT),
    },
    ...opt,
  }

  let r = opt.r;
  let x = opt.x;
  let y = opt.y;
  let nx = x;
  let ny = y;
  let scale = opt.scale;
  let isAirborn = true;
  let isLanding = false;
  let loop = HOP_RIGHT;
  let perches = [];

  function changeLoop(l, frameStart) {
    if (loop === l) return; // no real change
    if (frameStart) opt.render[l].setFrame(frameStart);
    loop = l;
  }

  return new Proxy({
    addPerch(x, y, w, magnet = 16) {
      perches.push([x, y, w, magnet]);
    },
    eachPerch(fn) {
      perches.forEach(p => fn(...p));
    },
    moveTo(targetX, targetY) {
      nx = targetX;
      ny = targetY;
    },
    render() {
      let dx = nx - x;
      let dy = ny - y;
      let dist = Math.abs(dx) + Math.abs(dy); // manhattan distance
      let angle = Math.atan2(dy, dx);
      let rightward = nx > x;
      
      // LANDING
      if (isLanding) {
        if (opt.render[loop].getFrame() === 1) { // stop when hop gets back to this frame
          changeLoop(STAND, loop === HOP_RIGHT ? 2 : 7);
          isLanding = false;
        }
      }
      // FLYING
      else if (isAirborn) {
        let landingZone = perches.find((perch) => {
          return (
            nx > perch[0] && 
            nx < perch[0] + perch[2] &&
            ny < perch[1] + perch[3] &&
            ny > perch[1] - perch[3]
          );
        });
        if (landingZone) {
          y = ramp(y, ny, 0.5);
          x = ramp(x, nx, 0.3);
          if (dist < 2) {
            isAirborn = false; // dont switch untill landing complete
            r = 0;
            y = landingZone[1];
            changeLoop(nx > x ? HOP_RIGHT : HOP_LEFT, 3); // 3 is a better frame to start on...
            isLanding = true;
          } else {
            r = 0;
            changeLoop(
              dist < 23
                ? (rightward ? HOVER_RIGHT : HOVER_LEFT)
                : (rightward ? FLY_RIGHT : FLY_LEFT)
            );
          }
        } else {
          if (dist < 23) {
            changeLoop(rightward ? HOVER_RIGHT : HOVER_LEFT);
            r = 0
          } else {
            changeLoop(rightward ? FLY_RIGHT : FLY_LEFT);
            r = loop === FLY_LEFT
              ? angle + HALF_TURN // trust me on this half turn... ¯\_(ツ)_/¯
              : angle;
          }
          x = ramp(x, nx, 0.4);
          y = ramp(y, ny, 0.6);
        }
      }
      // STANDING
      else {
        // ...
        // start the ground behavior
        opt.render[loop].setFrame(opt.render[loop].getFrame() - 1)
      }

      // render the actual frame...
      opt.render[loop].render(x, y, r, scale);
    },
  }, {
    get(target, prop) {
      if (prop === 'x') return x;
      if (prop === 'y') return y;
      if (prop === 'scale') return scale;
      return target[prop];
    },
    set() {
      return true;
    }
  });
}