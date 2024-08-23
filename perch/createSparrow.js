// the logic for how the sparrows behave
// hopefully decoupled from p5.js entirely

const HALF_TURN = Math.PI;

function ramp(v1, v2, force = 0.5) {
  return v1 + ((v2 - v1) * force);
}

const createConsoleRender = (name, length = 7) => {
  return {
    getLength() {
      return length;
    },
    render() {
      console.log(`
      > ${name}  
      frame = ${i}
      x = ${x}
      y = ${y}
      r = ${r}
      `);
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
      stand: createConsoleRender('stand'),
      hopLeft: createConsoleRender('hopLeft'),
      hopRight: createConsoleRender('hopRight'),
      hoverLeft: createConsoleRender('hoverLeft'),
      hoverRight: createConsoleRender('hoverRight'),
      flyLeft: createConsoleRender('flyLeft'),
      flyRight: createConsoleRender('flyRight'),
    },
    ...opt,
  }

  let r = opt.r;
  let x = opt.x;
  let y = opt.y;
  let scale = opt.scale;
  let isAirborn = true;
  let isLanding = false;
  let loop = 'flyRight';
  let perches = [];

  function changeLoop(l, frameStart) {
    if (frameStart && loop !== l) opt.render[l].setFrame(frameStart);
    loop = l;
  }

  return new Proxy({
    addPerch(x, y, w, magnet = 20) {
      perches.push([x, y, w, magnet]);
    },
    eachPerch(fn) {
      perches.forEach(p => fn(...p));
    },
    moveTo(nx, ny) {
      let dx = nx - x;
      let dy = ny - y;
      let angle = Math.atan2(dy, dx);

      if (isLanding) {
        if (opt.render[loop].getFrame() === 1) { // stop when hop gets back to this frame
          changeLoop('stand', 2);
          isLanding = false;
        }
      }
      else if (isAirborn) {
        let landingZone = perches.find((perch) => {
          return (
            nx > perch[0] && 
            nx < perch[0] + perch[2] &&
            ny < perch[1] &&
            ny > perch[1] - perch[3]
          );
        });

        if (landingZone) {
          y = ramp(y, ny, 0.5);
          x = ramp(x, nx, 0.3);
          if (Math.abs(dx) + Math.abs(dy) < 2) {
            isAirborn = false; // dont switch untill landing complete
            r = 0;
            y = landingZone[1];
            changeLoop(nx > x ? 'hopRight' : 'hopLeft', 3); // 3 is a better frame to start on...
            isLanding = true;
          } else {
            r = 0;
            changeLoop(nx > x ? 'hoverRight' : 'hoverLeft');
          }
        } else {
          if (Math.abs(dx) + Math.abs(dy) < 25) {
            changeLoop(nx > x ? 'hoverRight' : 'hoverLeft');
            r = 0
          } else {
            changeLoop(nx > x ? 'flyRight' : 'flyLeft');
            r = loop === 'flyLeft'
              ? angle + HALF_TURN // trust me on this half turn... ¯\_(ツ)_/¯
              : angle;
          }

          x = ramp(x, nx, 0.4);
          y = ramp(y, ny, 0.6);
        }
      } else {
        // ...
        opt.render[loop].setFrame(2)
      }
    },
    render() {
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