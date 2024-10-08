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

const pressureForce = (p1, p2, k = 1.5, margin = 40) => {
  const dx = p1.nextX - p2.nextX;
  const dy = p1.nextY - p2.nextY;
  const d = Math.sqrt(dx * dx + dy * dy);

  const minDistance = Math.max(p1.rx, p1.ry, p2.rx, p2.ry) * 2 + margin;

  if (d > 0 && d < minDistance) {
    const ratio1 = p1.targetWidth / p1.targetHeight;
    const ratio2 = p2.targetWidth / p2.targetHeight;
    const averageRatio = (ratio1 + ratio2) / 2;
    const angle = Math.atan2(dy, dx); // Gives angle in radians (-π to π)
    const cosAngle = Math.abs(Math.cos(angle)); // Stronger when horizontally aligned
    const sinAngle = Math.abs(Math.sin(angle)); // Weaker when vertically aligned

    // Scale the force magnitude based on the width-to-height ratio and the angle
    const forceMagnitude = k * (minDistance - d) * (cosAngle * averageRatio + sinAngle / averageRatio);

    // const forceMagnitude = k * (minDistance - d);
    const forceX = (dx / d) * forceMagnitude;
    const forceY = (dy / d) * forceMagnitude;
    // Apply force to one particle 
    // (the loop should ensure that the other particle gets the symetric force)
    p1.force(forceX, forceY);
  }
}

// const pressureForce = (p1, p2, k = 1, margin = 10) => {
//   const dx = p1.nextX - p2.nextX;
//   const dy = p1.nextY - p2.nextY;
//   const d = Math.sqrt(dx * dx + dy * dy);

//   const minDistance = Math.max(p1.rx + p1.ry + p2.rx + p2.ry) + margin;

//   if (d > 0 && d < minDistance) {
//     const forceMagnitude = k * (minDistance - d);
//     const forceX = (dx / d) * forceMagnitude;
//     const forceY = (dy / d) * forceMagnitude;
//     // Apply force to one particle 
//     // (the loop should ensure that the other particle gets the symetric force)
//     p1.force(forceX, forceY);
//   }
// }

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
const pressureBox = (p, bbox, k = 0.01) => {
  const top = bbox.top || 0;
  const left = bbox.left || 0;
  const dl = (p.nextX - p.rx) - left;
  const dr = left + bbox.width - (p.nextX + p.rx);
  const dt = (p.nextY - p.ry) - top;
  const db = top + bbox.height - (p.nextY + p.ry);
  let minDx = bbox.width / 6;
  let minDy = bbox.height / 12;
  let fx = 0;
  let fy = 0;
  if (dl < minDx) fx += k * (minDx - dl);
  if (dr < minDx) fx += -k * (minDx - dr);
  if (dt < minDy) fy += k * (minDy - dt);
  if (db < minDy) fy += -k * (minDy - db);
  p.force(fx * p.mass, fy * p.mass);
}

const constrainInBox = (p, bbox, margin = 20) => {
  const pl = p.nextX - p.rx;
  const pr = p.nextX + p.rx;
  const pt = p.nextY - p.ry;
  const pb = p.nextY + p.ry;
  const bl = bbox.left + margin;
  const br = bbox.left + bbox.width - margin;
  const bt = bbox.top + margin;
  const bb = bbox.top + bbox.height - margin;

  let kx = 0;
  let ky = 0;

  if (pl < bl) kx = Math.min(bl - pl / margin, 1);
  if (pr > br) kx = Math.min(pr - br / margin, 1);

  if (pt < bt) ky = Math.min(bt - pt / margin, 1);
  if (pb > bb) ky = Math.min(pb - bb / margin, 1);

  p.force(-p.fx * kx, -p.fy * ky);
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
    content: [],
    bbox: null,
    measureBubble: () => ({ width: p5.randomGaussian(160, 20), height: 60 }),
    renderBubble: () => {},
    onHover: (b) => { console.log('hover', b); },
    onSettle: (b) => { console.log('settle', b); },
    onLeave: (b) => { console.log('leave', b); },
    focalPosition: [0.6, 0.6],
    ...opt,
  }

  // Convert a percentage 0-1 to an absolute position inside the bounding box
  const getRelX = (x) => (bbox.left || 0) + (x * bbox.width);
  const getRelY = (y) => (bbox.top || 0) + (y * bbox.height);

  let bubbles = [];
  let bbox = opt.bbox || p5;
  let focalWeight = Math.max(bbox.width, bbox.width) / 4;
  let focalX = p5.randomGaussian(getRelX(opt.focalPosition[0]), 10);
  let focalY = p5.randomGaussian(getRelY(opt.focalPosition[1]), 10);
  let center1 = sphereParticle(focalX, focalY, focalWeight);
  let center2 = sphereParticle(p5.random(20, getRelX(0.5)), p5.random(20, getRelY(0.5)), focalWeight);
  let center3 = sphereParticle(p5.random(20, getRelX(0.5)), p5.random(20, getRelY(0.5)), focalWeight);
  let bubbleIdx = 0;
  let isHovering = false;

  const renderBubble = (b) => {
    if (b.width < 1 || b.height < 1) return;
    p5.push();
    p5.noStroke();
    // p5.fill('#131f21');
    p5.fill(b.content.permanent ? '#b0f4df' : '#fff');
    p5.rectMode(p5.CENTER);
    p5.rect(b.x, b.y, b.width, b.height, 26);
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
      getRelX(content.position[0]),
      getRelY(content.position[1]),
    ] : [
      getRelX(p5.random(0.2, 0.8)),
      getRelY(p5.random(0.2, 0.8)),
    ]

    // Create a box particle to hold the content
    // TODO: would randomising the damping and density a bit make a more organic layout?
    const density = 0.6;
    const damping = 0.3;
    const b = boxParticle(x, y, 0, 0, density, damping);

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
    isHovering() {
      return isHovering;
    },
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
      isHovering = false;

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
          if (!b1.hover) {
            b1.hover = true;
            b1.hoverAt = p5.frameCount;
            opt.onHover(b1);
          }
          if (b1.shouldSettle && !b1.hasSettled) {
            opt.onSettle(b1);
            b1.hasSettled = true;
          }
          isHovering = true;
          p5.cursor(p5.HAND);
        } else {
          if (b1.hover) {
            opt.onLeave(b1);
          }
          b1.hover = false;
          b1.hasSettled = false;
          b1.hoverAt = undefined;
        }

        // accumulate global forces
        // TODO: brownianForce(b) ?????
        pressureBox(b1, bbox);
        vacuumPoint(b1, center1, 0.6);
        vacuumPoint(b1, i % 2 ? center2 : center3, 0.3);
      });

      // 1.2 Pressure force
      // pairwise forces
      // NOTE: I am applying this force multiple times each loop
      // to smooth out the solving...
      // TODO: weird to iterate inside the pairing... if i do this i think i should move it out
      // split the phases into three loops
      for (let i = 0; i < 30; i += 1) {
        bubbles.forEach((b1) => {
          bubbles.forEach((b2) => {
            if (b1 !== b2) {
              pressureForce(b1, b2, 0.08, 50);
            }
          });
        });
      }

      // 1.3 constraints

      bubbles.forEach((b1) => {
        constrainInBox(b1, bbox);
        if (b1.hover) {
          let st = p5.min((p5.frameCount - b1.hoverAt) / 15, 1);
          stubbornPoint(b1, st);
          b1.shouldSettle = st === 1;
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