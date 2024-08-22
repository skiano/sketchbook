// the logic for how the sparrows behave
// hopefully decoupled from p5.js entirely

const HALF_TURN = Math.PI;
const FULL_TURN = Math.PI * 2;

function ramp(v1, v2, force = 0.5) {
  return v1 + ((v2 - v1) * force);
}

function constrain(v, min, max) {
  return Math.max(Math.min(v, max), min);
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
  let loop = 'flyRight';

  return new Proxy({
    moveTo(nx, ny) {
      r = 0; // reset the angle

      let dx = nx - x;
      let dy = ny - y;
      let angle = Math.atan2(dy, dx);

      if (Math.abs(dx) < 5) {
        loop = nx > x ? 'hoverRight' : 'hoverLeft';
      } else {
        loop = nx > x ? 'flyRight' : 'flyLeft';
        r = loop === 'flyLeft'
          ? angle + HALF_TURN // note: not totall sure why i need to spin for the left ¯\_(ツ)_/¯
          : angle;
      }

      x = ramp(x, nx, 0.4);
      y = ramp(y, ny, 0.6);
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