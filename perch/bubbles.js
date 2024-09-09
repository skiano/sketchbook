import addCanvas from '../shared/addP5Canvas.js';

// -------------------------
// REFINED PARTICLE APPROACH
// -------------------------

const smoothstep = (t) => {
  t = Math.max(Math.min(t, 1), 0);
  return t * t * (3.0 - 2.0 * t);
}

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

const sphere = (x = 0, y = 0, r = 1, density = 0.1, damping = 0.99) => {
  const p = particle(x, y);
  p.rx = r;
  p.ry = r;
  p.mass = Math.pi * r * r * density;
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

const createBubbles = (p5, boundingBox) => {
  let bubbles = [];
  let focalX = p5.randomGaussian(p5.width * 0.6, 10);
  let focalY = p5.randomGaussian(p5.height * 0.6, 10);
  let center1 = sphere(focalX, focalY, 30);
  let center2 = sphere(p5.random(20, p5.width / 2), p5.random(20, p5.height / 2), 30);
  let center3 = sphere(p5.random(20, p5.width / 2), p5.random(20, p5.height / 2), 6);

  const renderBubble = (box) => {
    if (box.width < 1 || box.height < 1) return;
    p5.push();
    p5.noStroke();
    p5.fill(box.fill || '#fff');
    p5.rectMode(p5.CENTER);
    p5.rect(box.x, box.y, box.width, box.height, 8);
    p5.pop();
  }

  const makeBubble = (x, y, color, targetWidth) => {
    // TODO: this should be using the bounding box
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

  bubbles.push(makeBubble(focalX, focalY, 'yellow', 115));
  for (let i = 0; i < 2; i += 1) {
    bubbles.push(makeBubble());
  }

  return {
    draw() {

      // 1. Accumulate forces
      bubbles.forEach((b1, i) => {
        // accumulate global forces
        // TODO: brownianForce(b) ?????
        pressureBox(b1, p5, 0.06, 30);
        vacuumPoint(b1, center1, 0.08);
        vacuumPoint(b1, i % 2 ? center2 : center3, 0.04);
  
        // pairwise forces
        bubbles.forEach((b2) => {
          if (b1 !== b2) {
            pressureForce(b1, b2, 10, 0.4);
          }
        });
      });

      // 2. Render and update
      bubbles.forEach((b) => {
        renderBubble(b);
        b.update();

        // handle entry and exit animation
        let popTime = 18;
        if (b.destroyAt) {
          let t = smoothstep((p5.frameCount - b.destroyAt) / (popTime * 2));
          b.resize(
            p5.lerp(b.targetWidth, 0, t),
            p5.lerp(40, 0, t),
          );
          if (t === 1) {
            b.destroyed = true;
          }
        } else {
          let t = smoothstep((p5.frameCount - b.madeAt) / popTime);
          b.resize(
            p5.lerp(0, b.targetWidth, t),
            p5.lerp(0, 40, t),
          );
        }
      });

      // 3. Decide if/when to insert more bubbles
      if ((p5.frameCount) % Math.min((bubbles.length * bubbles.length * bubbles.length / 3.5) >> 0, 60 * 4) === 0) {
        bubbles.push(makeBubble(
          // p5.random(20, p5.width - 20),
          // p5.random(20, p5.height - 20)
        ));
  
        // mark earliest box (after the first...) for destruction
        if (bubbles.length > 8) {
          bubbles[1].destroyAt = p5.frameCount + 0;
        }
      }
  
      // 4. Remove any bubbles that are destroyed
      bubbles = bubbles.filter(b => !b.destroyed);
    }
  }
}

addCanvas((p5) => {
  let bubbles;

  p5.setup = () => {
    bubbles = createBubbles(p5);
  }

  p5.draw = () => {
    p5.background('#333');

    bubbles.draw();
  }
}, { fps: 60 });