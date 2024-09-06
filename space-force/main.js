import p5 from 'p5';
import addCanvas from '../shared/addP5Canvas.js';

const stopper = v => Math.abs(v) < 0.01 ? 0 : v;

const node = (xi = 0, yi = 0, vxi = 0, vyi = 0, axi = 1, ayi = 1) => {
  let x = xi;
  let y = yi;
  let vx = vxi;
  let vy = vyi;
  let ax = axi;
  let ay = ayi;
  return new Proxy({
    position(nx, ny) {
      x = nx;
      y = ny;
    },
    velocity(nvx, nvy) {
      vx = nvx;
      vy = nvy;
    },
    acceleration(nax, nay) {
      ax = nax;
      ay = nay;
    },
    render() {
      x = x + vx;
      y = y + vy;
      vx = stopper(vx * ax);
      vy = stopper(vy * ay);
    }
  }, {
    get(target, key) {
      switch (key) {
        case 'x': return x;
        case 'y': return y;
        case 'vx': return vx;
        case 'vy': return vy;
        case 'nextX': return x + vx;
        case 'nextY': return y + vy;
        default: return target[key];
      }
    },
    set(target, key, val) {
      switch (key) {
        case 'x':
        case 'y':
        case 'vx':
        case 'vy':
        case 'nextX':
        case 'nextY':
        case 'render':
        case 'position':
        case 'velocity':
        case 'acceleration':
          throw new Error(`Cannot set [${key}] directly on a node`);
        default:
          target[key] = val;
        return true;
      }
    }
  });
}

addCanvas((p) => {
  let loopIt;
  let nodes;

  p.setup = () => {
    loopIt = (x, y) => [x % p.width, y % p.width];
    nodes = [...Array(15)].map(_ => (
      node(p.random(p.width), p.random(p.height), p.random(2, 6), p.random(2, 6))
    ));
  }

  p.draw = () => {
    p.background('#333');
    p.noStroke();
    p.fill('#fff');

    nodes.forEach(n => {
      let [x, y] = loopIt(n.x, n.y);
      p.circle(x, y, 10);
      n.render();
      if (n.nextX > p.width || n.nextX < 0) n.velocity(-n.vx, n.vy);
      if (n.nextY > p.height || n.nextY < 0) n.velocity(n.vx, -n.vy);
    });
  }
}, { fps: 60 });

addCanvas((p) => {
  let loopIt;
  let nodes;

  p.setup = () => {
    loopIt = (x, y) => [x % p.width, y % p.width];
    nodes = [...Array(8)].map(_ => (
      node(p.random(p.width), p.height, p.random(-10, 10), p.random(-10, -20))
    ));
  }

  p.draw = () => {
    p.background('#333');
    p.noStroke();
    p.fill('#fff');

    nodes.forEach(n => {
      let [x, y] = loopIt(n.x, n.y);
      p.circle(x, y, 10);
      n.render();
      n.velocity(n.vx, n.vy + 0.25)
      if (n.nextX > p.width || n.nextX < 0) n.velocity(-n.vx * 0.9, n.vy);
      if (n.nextY > p.height || n.nextY < 0) n.velocity(n.vx, -n.vy * 0.9);
    });
  }
}, { fps: 60 });

addCanvas((p) => {
  let loopIt;
  let nodes;

  p.setup = () => {
    loopIt = (x, y) => [x % p.width, y % p.width];
    let total = 35;
    nodes = [...Array(total)].map((_, i) => {
      let x = (p.width / total) * i;
      return node(x, 50 + p.sin(x / total) * 45, 0, 0)
    });
  }

  p.draw = () => {
    p.background('#333');
    p.noStroke();
    p.fill('#fff');

    nodes.forEach(n => {
      let [x, y] = loopIt(n.x, n.y);
      p.circle(x, y, 10);
      n.render();
      n.velocity(n.vx, n.vy + 0.25)
      if (n.nextX > p.width || n.nextX < 0) n.velocity(-n.vx * 0.9, n.vy);
      if (n.nextY > p.height || n.nextY < 0) n.velocity(n.vx, -n.vy * 0.92);
    });
  }
}, { fps: 60 });