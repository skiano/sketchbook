import addCanvas from '../shared/addP5Canvas.js';

const particle = (xi = 0, yi = 0, vxi = 0, vyi = 0) => {
  let mass = 1;
  let damping = 1;
  let rx = 0;
  let ry = 0;
  let x = xi;
  let y = yi;
  let vx = vxi;
  let vy = vyi;
  let fx = 0;
  let fy = 0;
  let nextX = x + vxi;
  let nextY = y + vyi;
  return new Proxy({
    position(nx, ny) {
      x = nx;
      y = ny;
    },
    velocity(nvx, nvy) {
      vx = nvx;
      vy = nvy;
    },
    force(addedfx, addedfy) {
      fx += addedfx;
      fy += addedfy;
    },
    update() {
      // apply accumulated forces
      vx += fx / mass;
      vy += fy / mass;

      // Damping for velocity if needed
      vx *= damping;
      vy *= damping;

      // update position
      x = x + vx;
      y = y + vy;

      // clear accumulated forces
      fx = 0;
      fy = 0;

      // update predicted position
      nextX = x + vx;
      nextY = y + vy;
    }
  }, {
    get(target, key) {
      switch (key) {
        case 'x': return x;
        case 'y': return y;
        case 'vx': return vx;
        case 'vy': return vy;
        case 'rx': return rx;
        case 'ry': return ry;
        case 'fx': return fx;
        case 'fy': return fy;
        case 'mass': return mass;
        case 'nextX': return nextX;
        case 'nextY': return nextY;
        default: return target[key];
      }
    },
    set(target, key, val) {
      switch (key) {
        case 'x':
        case 'y':
        case 'vx':
        case 'vy':
        case 'force':
        case 'nextX':
        case 'nextY':
        case 'update':
        case 'position':
        case 'velocity':
          throw new Error(`Cannot set [${key}] directly on a node`);
        case 'mass':
          mass = Math.max(val, 1);
          break;
        case 'damping':
          damping = val;
          break;
        case 'rx':
          rx = val;
          break;
        case 'ry':
          ry = val;
          break;
        default:
          target[key] = val;
      }
      return true;
    }
  });
}

const eachPair = (particles, fn, iterations = 1) => {
  for (let i = 0; i < iterations; i += 1) {
    for (let a = 0; a < particles.length - 1; a += 1) {
      for (let b = a + 1; b < particles.length; b += 1) {
        fn(particles[a], particles[b]);
      }
    }
  }
};

const pressureForce = (p1, p2, k = 1, margin = 30) => {
  const dx = p1.nextX - p2.nextX;
  const dy = p1.nextY - p2.nextY;
  const d = Math.sqrt(dx * dx + dy * dy);
  const minDistance = Math.max(p1.rx + p1.ry + p2.rx + p2.ry) + margin;
  if (d > 0 && d < minDistance) {
    const forceMagnitude = k * (minDistance - d);
    const forceX = (dx / d) * forceMagnitude;
    const forceY = (dy / d) * forceMagnitude;
    // Apply force to one particle 
    // (the loop should ensure that the other particle gets the symetric force)
    p1.force(forceX, forceY);
    p2.force(-forceX, -forceY);
  }
}

function springForce(n1, n2, restLength, springConstant = 0.15) {
  let dx = n1.nextX - n2.nextX;
  let dy = n1.nextY - n2.nextY;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let displacement = distance - restLength;

  // Apply Hooke's Law: F = -k * displacement
  let forceMagnitude = -springConstant * displacement;

  // Normalize the direction of the force
  let fx = (dx / distance) * forceMagnitude;
  let fy = (dy / distance) * forceMagnitude;

  // Apply force to both particles (equal and opposite)
  n1.force(fx, fy);
  n2.force(-fx, -fy);
}

eachPair(['a', 'b', 'c', 'd'], console.log);

addCanvas((p5) => {
  const particles = [];

  p5.setup = () => {
    let rows = 2;
    let cols = 1;
    let dx = 20;
    let dy = 30;
    let ox = (p5.width / 2) - (dx * cols / 2);
    let oy = (p5.height / 2) - (dy * rows / 2);
    for (let x = 0; x < cols; x += 1) {
      for (let y = 0; y < rows; y += 1) {
        let p = particle(x * dx + ox, y * dy + oy);
        p.damping = 0.9;
        particles.push(p);
      }
    }
  }

  p5.draw = () => {
    p5.background('blue');

    eachPair(particles, (a, b) => {
      springForce(a, b, 10, 0.5);
      // pressureForce(a, b);
    });

    p5.noStroke();
    p5.fill('#fff');
    particles.forEach((p) => {
      p5.circle(p.x, p.y, 5);
      p.update();
    });
  }

}, { fps: 60 });