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

const boxParticle = (cx, cy, width, height, density = 0.1, damping = 0.99) => {
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

const sphereParticle = (x = 0, y = 0, r = 1, density = 0.1, damping = 0.99) => {
  const p = particle(x, y);
  p.rx = r;
  p.ry = r;
  p.mass = Math.pi * r * r * density;
  p.damping = damping;
  return p;
}

// pressure force is a pairwise force
// that encourages particles to spread to low density
// areas as if suspended in a liquid
const pressureForce = (p1, p2, k = 1, margin = 10) => {
  const minDistance = Math.max(p1.rx + p1.ry + p2.rx + p2.ry) + margin;
  const dx = p1.nextX - p2.nextX;
  const dy = p1.nextY - p2.nextY;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d < minDistance) {
    const forceMagnitude = k * (minDistance - d);
    const forceX = (dx / d) * forceMagnitude;
    const forceY = (dy / d) * forceMagnitude;
    // Apply force to one particle 
    // (the loop should ensure that the other particle gets the symetric force)
    p1.force(forceX, forceY);
  }
}

// vacuum applies a force directly proportional
// to the distance between the points
// In this case I am applying it to the boxParticles
// but not the sphereParticles that act as control points
// so that they act like anchors
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

// pressure box applies a force inward
// to keep the boxParticles from going out of bounds
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

// this force makes the particle resist
// all forces and come to a quick stop
// it is used on hover to stop the bubble
const stubbornPoint = (p, k = 1) => {
  p.force(-p.fx * k, -p.fy * k);
}

// createBubbles creates a bubble system bound
// to a specific p5 instance and bounded by a box
export default function createBubbles(p5, opt) {
  opt = {
    boundingBox: p5,
    renderBubble: () => {},
    measureBubble: () => ({ width: p5.randomGaussian(160, 20), height: 60 }),
    content: [],
    ...opt,
  }

  let bubbles = [];
  let focalX = p5.randomGaussian(p5.width * 0.6, 10);
  let focalY = p5.randomGaussian(p5.height * 0.6, 10);
  let center1 = sphereParticle(focalX, focalY, 30);
  let center2 = sphereParticle(p5.random(20, p5.width / 2), p5.random(20, p5.height / 2), 30);
  let center3 = sphereParticle(p5.random(20, p5.width / 2), p5.random(20, p5.height / 2), 6);
  let bubbleIdx = 0;

  const renderBubble = (b) => {
    if (b.width < 1 || b.height < 1) return;
    p5.push();
    p5.noStroke();
    p5.fill('#fff');
    p5.rectMode(p5.CENTER);
    p5.rect(b.x, b.y, b.width, b.height, 8);
    // TODO: handle the fade in here so that render doesn't need to know about it
    if (b.width / b.targetWidth > 0.9) {
      opt.renderBubble(b);
    }
    p5.pop();
  }

  const createBubble = () => {
    // Decide which content to use
    let content = opt.content[bubbleIdx % opt.content.length];
    bubbleIdx += 1;
    // Prevent creation of content already on screen
    if (content.onScreen) return;

    // Set the initial position
    let [x, y] = content.position ? [
      content.position[0] * p5.width,
      content.position[1] * p5.height,
    ] : [
      p5.randomGaussian(p5.width / 2, 60),
      p5.randomGaussian(p5.height / 2, 60),
    ]

    // Create a box particle to hold the content
    // TODO: would randomising the damping and density a bit make a more organic layout?
    const b = boxParticle(x, y, 0, 0, 0.2, 0.5);

    // Mark the creation time and attach content
    b.madeAt = p5.frameCount;
    b.content = content;
    b.content.onScreen = true;

    // Save the measurement for animating in and out
    const { width, height } = opt.measureBubble(b);
    b.targetWidth = width;
    b.targetHeight = height;
    return b;
  }

  const destroyBubble = (b) => {
    b.destroyAt = p5.frameCount;
    b.content.onScreen = false;
  }

  return {
    insertBubbles(total = 1) {
      for (let i = 0; i < opt.content.length; i += 1) {
        if (!total) break;
        const b = createBubble();
        if (b) {
          bubbles.push(b);
          total -= 1;
        }
      }
    },
    removeBubbles(total = 1) {
      for (let i = 0; i < bubbles.length; i += 1) {
        let b = bubbles[i];
        if (!total) break;
        if (
          b.hover ||
          b.content.permanent ||
          !b.content.onScreen
        ) continue;
        destroyBubble(b);
        total -= 1;
      }
    },
    render() {
      p5.cursor(p5.ARROW);

      // 1. Accumulate forces
      bubbles.forEach((b1, i) => {
        // check for hover state
        if (
          b1.isReady &&
          b1.x - b1.rx < p5.mouseX &&
          b1.x + b1.rx > p5.mouseX &&
          b1.y - b1.ry < p5.mouseY &&
          b1.y + b1.ry > p5.mouseY
        ) {
          b1.hover = true;
          b1.hoverAt = b1.hoverAt || p5.frameCount;
          p5.cursor(p5.HAND);
        } else {
          b1.hover = false;
          b1.hoverAt = undefined;
        }

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

        if (b1.hover) {
          stubbornPoint(b1, p5.min((p5.frameCount - b1.hoverAt) / 15, 1));
        }
      });

      // 2. Render and update
      bubbles.forEach((b, i) => {
        renderBubble(b);
        b.update();

        // handle exit and entry animation
        let popTime = 18;
        if (b.destroyAt) {
          b.isReady = false;
          let t = smoothstep((p5.frameCount - b.destroyAt) / (popTime * 2));
          b.resize(p5.lerp(b.targetWidth, 0, t), p5.lerp(b.targetHeight, 0, t));
          if (t === 1) b.destroyed = true;
        } else {
          let t = smoothstep((p5.frameCount - b.madeAt) / popTime);
          b.resize(p5.lerp(0, b.targetWidth, t), p5.lerp(0, b.targetHeight, t));
          if (t === 1) b.isReady = true;
        }
      });
  
      // 4. Remove any bubbles that are destroyed
      bubbles = bubbles.filter(b => !b.destroyed);
    }
  }
}