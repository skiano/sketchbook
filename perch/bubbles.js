import addCanvas from '../shared/addP5Canvas.js';

// -------------------------
// REFINED PARTICLE APPROACH
// -------------------------

const smoothstep = (t) => {
  t = Math.max(Math.min(t, 1), 0);
  return t * t * (3.0 - 2.0 * t);
}

// An improved version of node
// that allows for mass and damping
// as well as accumulation of force during a frame
const particle = (xi = 0, yi = 0, vxi = 0, vyi = 0) => {
  let mass = 1;
  let damping = 1;
  let x = xi;
  let y = yi;
  let vx = vxi;
  let vy = vyi;
  let fx = 0;
  let fy = 0;
  let nextX = x + vxi;
  let nextY = y + vyi;
  let rx = 0;
  let ry = 0;
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

const box = (cx, cy, width, height, density = 0.1, damping = 0.99) => {
  const p = particle(cx, cy);
  p.isBox = true;
  p.damping = damping;
  p.resize = (w, h) => {
    p.width = w;
    p.height = h;
    p.rx = Math.max(w / 2, 10);
    p.ry = Math.max(h / 2, 10);
    p.mass = Math.max(width * height * density, 100);
  }
  p.resize(width, height);
  return p;
}

const pressureForce = (p1, p2, k = 1, margin = 10) => {
  const minDistance = Math.max(p1.rx + p1.ry + p2.rx + p2.ry) + margin;
  const dx = p1.nextX - p2.nextX;
  const dy = p1.nextY - p2.nextY;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d < minDistance) {
    const forceMagnitude = k * (minDistance - d);
    const forceX = (dx / d) * forceMagnitude;
    const forceY = (dy / d) * forceMagnitude;
    // Apply force to one particle (the loop should ensure that the other particle gets the symetric force)
    p1.force(forceX, forceY);
  }
}

const vacuumPoint = (p1, p2, k = 1) => {
  const dx = p1.nextX - p2.nextX;
  const dy = p1.nextY - p2.nextY;
  const d = Math.sqrt(dx * dx + dy * dy);
  const minR = Math.max(p1.rx, p1.ry, p2.rx, p2.ry);
  if (d < minR) return;
  const force = -k * d;
  const fx = (dx / d) * force;
  const fy = (dy / d) * force;
  p1.force(fx, fy);
}

const pressureBox = (p, bbox, k = 0.4, minDist) => {
  const top = bbox.top || 0;
  const left = bbox.left || 0;
  const dl = (p.nextX - p.rx) - left;
  const dr = left + bbox.width - (p.nextX + p.rx);
  const dt = (p.nextY - p.ry) - top;
  const db = top + bbox.height - (p.nextY + p.ry);
  let minD = minDist || ((p.rx + p.ry) / 4);
  let fx = 0;
  let fy = 0;
  if (dl < minD) fx += k * (minD - dl);
  if (dr < minD) fx += -k * (minD - dr);
  if (dt < minD) fy += k * (minD - dt);
  if (db < minD) fy += -k * (minD - db);
  p.force(fx * p.mass, fy * p.mass);
}

addCanvas((p5) => {
  let boxes = [];
  let centerParticle;
  let otherCenter;
  let thirdCenter;

  const renderBox = (box) => {
    if (box.width < 1 || box.height < 1) return;
    p5.push();
    p5.noStroke();
    p5.fill(box.fill || '#fff');
    p5.rectMode(p5.CENTER);
    p5.rect(box.x, box.y, box.width, box.height, 8);
    p5.pop();
  }

  const makeBox = (x, y, color, targetWidth) => {
    const b = box(
      x || p5.randomGaussian(p5.width / 2, 60),
      y || p5.randomGaussian(p5.width / 2, 60),
      0,
      0,
      0.2,
      0.5,
    );
    b.fill = color;
    b.madeAt = p5.frameCount;
    b.targetWidth = targetWidth || p5.randomGaussian(100, 20);
    return b;
  }

  p5.setup = () => {
    let focalX = p5.randomGaussian(p5.width * 0.6, 10);
    let focalY = p5.randomGaussian(p5.height * 0.6, 10);

    centerParticle = particle(focalX, focalY);
    centerParticle.rx = 30;
    centerParticle.ry = 30;

    otherCenter = particle(p5.random(20, p5.width / 2), p5.random(20, p5.height / 2));
    centerParticle.rx = 15;
    centerParticle.ry = 15;

    thirdCenter = particle(p5.random(20, p5.width / 2), p5.random(20, p5.height / 2));
    thirdCenter.rx = 6;
    thirdCenter.ry = 6;

    boxes.push(makeBox(focalX, focalY, 'yellow', 115));
    for (let i = 0; i < 2; i += 1) {
      boxes.push(makeBox());
    }
  }

  p5.draw = () => {
    p5.background('#333');

    boxes.forEach((bx1, i) => {
      // accumulate global forces
      // brownianForce(bx1);
      pressureBox(bx1, p5, 0.06, 30);
      vacuumPoint(bx1, centerParticle, 0.08);
      vacuumPoint(bx1, i % 2 ? otherCenter : thirdCenter, 0.04);

      // pairwise forces
      boxes.forEach((bx2) => {
        if (bx1 !== bx2) {
          pressureForce(bx1, bx2, 10, 0.4);
        }
      });

      // collisions?
    });

    // render and update boxes
    boxes.forEach((bx, i) => {
      renderBox(bx);
      bx.update();
      // also update box size
      let popTime = 18;

      if (bx.destroyAt) {
        let t = smoothstep((p5.frameCount - bx.destroyAt) / (popTime * 2));
        bx.resize(
          p5.lerp(bx.targetWidth, 0, t),
          p5.lerp(40, 0, t),
        );
        if (t === 1) {
          bx.destroyed = true;
        }
      } else {
        let t = smoothstep((p5.frameCount - bx.madeAt) / popTime);
        bx.resize(
          p5.lerp(0, bx.targetWidth, t),
          p5.lerp(0, 40, t),
        );
      }
    });

    if ((p5.frameCount) % Math.min((boxes.length * boxes.length * boxes.length / 3.5) >> 0, 60 * 4) === 0) {
      // boxes.pop();
      boxes.push(makeBox(
        // p5.random(20, p5.width - 20),
        // p5.random(20, p5.height - 20)
      ));

      // mark earliest box (after the first...) for destruction
      if (boxes.length > 8) {
        boxes[1].destroyAt = p5.frameCount + 0;
      }
    }

    boxes = boxes.filter(b => !b.destroyed);

  }
}, { fps: 60 });