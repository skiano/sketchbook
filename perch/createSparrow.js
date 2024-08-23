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
  let isPaused = false;
  // A new renderer should implement this interface...
  // and each loop requires an instance of renderer
  return {
    play() {
      console.log(`
        > ${name}  
          Playing...
        `);
      isPaused = false;
    },
    pause() {
      console.log(`
        > ${name}  
          Paused...
        `);
      isPaused = true;
    },
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
      if (!isPaused) {
        frame += 1;
        if (frame >= length) frame = 0;
      }
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
  let isTakingOff = false;
  let loop = HOP_RIGHT;
  let perches = [];
  let loopTime = 0;
  let totalTime = 0;
  let activePerch;

  function changeLoop(l, frameStart) {
    if (loop === l) return; // no real change
    if (frameStart) opt.render[l].setFrame(frameStart);
    loopTime = 0;
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
        // the bottom of the hop happens when the loop returns to 1
        // at theat point we switch to the stand loop and call the landing complete
        if (opt.render[loop].getFrame() === 1) { // stop when hop gets back to this frame
          changeLoop(STAND, loop === HOP_RIGHT ? 2 : 7);
          opt.render[loop].pause(); // stop the stand loop from autoplaying
          isLanding = false;
        }
      }
      // TAKING OFF
      if (isTakingOff) {
        if (loop === HOVER_RIGHT || loop === HOVER_LEFT) {
          x = ramp(x, nx, 0.1); // notice the ramp matches the one from flying
          y = ramp(y, ny, 0.2); // notice the ramp matches the one from flying
          if (loopTime > 2) {
            isTakingOff = false;
            isAirborn = true;
          }
        } else if (opt.render[loop].getFrame() === 2) { // stop when hop gets to mid point
          changeLoop(loop === HOP_RIGHT ? HOVER_RIGHT : HOVER_LEFT);
        }
      }
      // FLYING
      else if (isAirborn) {
        activePerch = perches.find((perch) => {
          return (
            nx > perch[0] && 
            nx < perch[0] + perch[2] &&
            ny < perch[1] + perch[3] &&
            ny > perch[1] - perch[3]
          );
        });
        if (activePerch) {
          y = ramp(y, ny, 0.5);
          x = ramp(x, nx, 0.3);
          if (dist < 2) {
            isAirborn = false; // dont switch untill landing complete
            r = 0;
            y = activePerch[1];
            changeLoop(rightward ? HOP_RIGHT : HOP_LEFT, 3); // 3 is a better frame to start on...
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
      // ON THE GROUND
      else {
        if (
          ny < activePerch[1] - activePerch[3]
          // || ny > activePerch[1] + activePerch[3]
        ) {
          isTakingOff = true;
          changeLoop(rightward ? HOP_RIGHT : HOP_LEFT, 0); // reset the loop to beginning for a full hop
        } else if (loop === STAND) {
          let standLoop = opt.render[loop];
          let pose = standLoop.getFrame();
          let isFacingLeft = pose > 4;


          if (isFacingLeft) {
            if (dx < -3) pose = 9;
            if (dx < -7) pose = 8;
            if (dx < -12) pose = 7;
            if (dx < -17) pose = 6;
            if (dx < 0 && dx >= -17 && dy > 5) pose = 5;
            if (dx > 7) pose = 1; // the one that switches
          } else {
            if (dx < -7) pose = 8; // the one that switches
            if (dx > 3) pose = 1;
            if (dx > 3) pose = 0;
            if (dx > 7) pose = 1;
            if (dx > 12) pose = 2;
            if (dx > 17) pose = 3;
            if (dx > 0 && dx < 17 && dy > 5) pose = 4;
          }

          // let switchpose = ([l, r]) => isFacingLeft ? l : r;

          // if (dx < -3) pose = [8, 6];
          // if (dx < -7) pose = [9, 5];
          // if (dx < -12) pose = [7, 7];
          // if (dx < -17) pose = [6, 8];
          // if (dx < 0 && dx >= -17 && dy > 5) pose = [5, 4];

          // if (dx > 3) pose = 0;
          // if (dx > 7) pose = 1;
          // if (dx > 12) pose = 2;
          // if (dx > 17) pose = 3;
          
          // if (dx >= 0 && dy > 5) pose = [5, 4];

          // pose = switchpose(Array.isArray(pose) ? pose : [pose, pose]);

          


          standLoop.setFrame(pose);
        }
      }

      // render the actual frame...
      opt.render[loop].render(x, y, r, scale);
      // keep track of how many times this loop has rendered
      // and how many times render has been called
      loopTime += 1;
      totalTime += 1;
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