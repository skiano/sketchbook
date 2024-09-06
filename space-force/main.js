import addCanvas from '../shared/addP5Canvas.js';

// To be transparent...
// parts of this were in discussion with chatGPT

const stopper = v => Math.abs(v) < 0.001 ? 0 : v;

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
    nodes = [...Array(8)].map(_ => (
      node(p.random(p.width), p.height * 2 / 3, p.random(-5, 5), p.random(-6, -18))
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
}, { fps: 60, prepend: true });

addCanvas((p) => {
  let loopIt;
  let nodes;

  p.setup = () => {
    loopIt = (x, y) => [x % p.width, y % p.width];
    let total = 24;
    let da = p.TAU / total;
    let cx = p.width / 2;
    let cy = p.height / 2;
    let r = 20;
    nodes = [...Array(total)].map((_, i) => {
      let a = da * i;
      let x = p.cos(a);
      let y = p.sin(a);
      let n = node(p.randomGaussian(cx + x * r, r / 6), p.randomGaussian(cy + y * r, r / 6));
      n.acceleration(0.998, 0.998);
      n.mass = 1;
      return n;
    });
  }

  p.draw = () => {
    p.background('#333');
    p.noStroke();
    p.fill('#fff');

    nodes.forEach((n) => {
      let [x, y] = loopIt(n.x, n.y);
      p.circle(x, y, 10);
      n.render();

      // repulsion
      nodes.forEach((other) => {
        let dx = other.nextX - n.nextX;
        let dy = other.nextY - n.nextY;
        let minDistance = 30;
        let d = Math.max(Math.sqrt(dx * dx + dy * dy), minDistance);
        let strength = 100 / (d * d);
        let fx = (dx / d) * strength;
        let fy = (dy / d) * strength;
        other.velocity(
          other.vx + fx / (other.mass || 1),
          other.vy + fy / (other.mass || 1)
        );
      });

      if (n.nextX > p.width || n.nextX < 0) n.velocity(-n.vx, n.vy);
      if (n.nextY > p.height || n.nextY < 0) n.velocity(n.vx, -n.vy);
    });
  }
}, { fps: 60, prepend: true });

function springForce(n1, n2, restLength, springConstant = 0.15, springDamping = 1) {
  let dx = n1.nextX - n2.nextX;
  let dy = n1.nextY - n2.nextY;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let displacement = distance - restLength;

  // Apply Hooke's Law: F = -k * displacement
  let forceMagnitude = -springConstant * displacement;

  // Normalize the direction of the force
  let fx = (dx / distance) * forceMagnitude;
  let fy = (dy / distance) * forceMagnitude;

  // Dampen the force
  fx *= springDamping;
  fy *= springDamping;

  // Apply force to both particles (equal and opposite)
  n1.velocity(
    n1.vx + (fx / (n1.mass || 5)),
    n1.vy + (fy / (n1.mass || 5))
  );
  n2.velocity(
    n2.vx - (fx / (n2.mass || 5)),
    n2.vy - (fy / (n2.mass || 5))
  );
}

addCanvas((p) => {
  let nodes;
  let springs = [];

  p.setup = () => {
    const randomNode = (cx = p.width / 2, cy = p.height / 2, sd = p.width / 4) => {
      return node(p.randomGaussian(cx, sd), p.randomGaussian(cy, sd));
    }

    const getSpringLength = (a, b, r = 0.5) => {
      return r * p.dist(a.x, a.y, b.x, b.y);
    }

    nodes = [];

    for (let i = 0; i < 9; i += 1) {

      let cx = p.random(100, p.width - 100);
      let cy = p.random(100, p.height - 100);

      let a = randomNode(cx, cy, 40);
      let b = randomNode(cx, cy, 40);
      let c = randomNode(cx, cy, 40);
      let d = randomNode(cx, cy, 40);
      nodes.push(a);
      nodes.push(b);
      nodes.push(c);
      nodes.push(d);
      let k = p.random(0.05, 0.1);
      let damp = p.random(0.98, 1);
      springs.push([a, b, getSpringLength(a, b, p.random(1.3, 1.6)), k, damp]);
      springs.push([b, c, getSpringLength(a, b, p.random(1.3, 1.6)), k, damp]);
      springs.push([c, d, getSpringLength(a, b, p.random(1.3, 1.6)), k, damp]);
      springs.push([d, a, getSpringLength(a, b, p.random(1.3, 1.6)), k, damp]);
      springs.push([a, c, getSpringLength(a, b, p.random(1.3, 1.6)), k, damp]);
      springs.push([b, d, getSpringLength(a, b, p.random(1.3, 1.6)), k, damp]);
    }
  }

  p.draw = () => {
    p.background('#333');

    nodes.forEach((n) => {
      p.push();
      p.noStroke();
      p.fill('#fff');
      p.circle(n.x, n.y, 6);
      n.render();
      p.pop();
    });

    springs.forEach(([n1, n2]) => {
      p.push();
      p.stroke('#fff');
      p.line(n1.x, n1.y, n2.x, n2.y);
      p.pop();
    });

    springs.forEach(([n1, n2, length, k, d]) => {
      springForce(n1, n2, length, k, d);
    });
  }
}, { fps: 60, prepend: true });

addCanvas((p) => {
  let nodes;
  let springs = [];

  p.setup = () => {
    const randomNode = (cx = p.width / 2, cy = p.height / 2, sd = p.width / 4) => {
      return node(p.randomGaussian(cx, sd), p.randomGaussian(cy, sd));
    }

    const getSpringLength = (a, b, r = 0.5) => {
      return r * p.dist(a.x, a.y, b.x, b.y);
    }

    nodes = [];

    for (let i = 0; i < 20; i += 1) {

      let cx = p.random(100, p.width - 100);
      let cy = p.random(100, p.height - 100);

      let a = randomNode(cx, cy, 40);
      let b = randomNode(cx, cy, 40);
      let c = node(a.x, b.y);
      let d = node(b.x, a.y);
      nodes.push(a);
      nodes.push(b);
      nodes.push(c);
      nodes.push(d);
      let k = p.random(0.01, 0.08);
      let damp = 1;
      let lengthFactor = p.random(1.3, 1.9);
      springs.push([a, b, getSpringLength(a, b, lengthFactor), k, damp]);
      springs.push([b, c, getSpringLength(a, b, lengthFactor), k, damp]);
      springs.push([c, d, getSpringLength(a, b, lengthFactor), k, damp]);
      springs.push([d, a, getSpringLength(a, b, lengthFactor), k, damp]);
      springs.push([a, c, getSpringLength(a, b, lengthFactor), k, damp]);
      springs.push([b, d, getSpringLength(a, b, lengthFactor), k, damp]);
    }
  }

  p.draw = () => {
    p.background('#333');

    nodes.forEach((n) => {
      p.push();
      p.noStroke();
      p.fill('#fff');
      p.circle(n.x, n.y, 6);
      n.render();
      p.pop();
    });

    springs.forEach(([n1, n2]) => {
      p.push();
      p.stroke('#fff');
      p.line(n1.x, n1.y, n2.x, n2.y);
      p.pop();
    });

    springs.forEach(([n1, n2, length, k, d]) => {
      springForce(n1, n2, length, k, d);
    });
  }
}, { fps: 60, prepend: true });

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

const relativeGravity = (p1, p2, k = 100) => {
  const dx = p1.nextX - p2.nextX;
  const dy = p1.nextY - p2.nextY;
  const d = Math.sqrt(dx * dx + dy * dy);
  const minR = Math.max(p1.rx, p1.ry, p2.rx, p2.ry);
  if (d < minR) return;
  const force = -k * (p1.mass * p2.mass) / (d * d);
  const fx = (dx / d) * force;
  const fy = (dy / d) * force;
  p1.force(fx, fy);
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

const springPoint = (p1, p2, restLength, springConstant = 0.15, springDamping = 1) => {
  let dx = p1.nextX - p2.nextX;
  let dy = p1.nextY - p2.nextY;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let displacement = distance - restLength;
  // Apply Hooke's Law: F = -k * displacement
  let forceMagnitude = -springConstant * displacement;
  // Normalize the direction of the force
  let fx = (dx / distance) * forceMagnitude;
  let fy = (dy / distance) * forceMagnitude;
  // Dampen the force
  fx *= springDamping;
  fy *= springDamping;
  p1.force(fx, fy);
}

// BOX placement

addCanvas((p5) => {
  let boxes = [];
  const renderBox = (box) => {
    p5.push();
    p5.noFill();
    p5.stroke('#fff');
    p5.fill('rgba(255, 255, 255, 0.3)')
    p5.rectMode(p5.CENTER);
    p5.rect(box.x, box.y, box.width, box.height, 4);
    p5.pop();
  }

  const randomBox = () => {
    return box(
      p5.randomGaussian(p5.width / 2, 20),
      p5.randomGaussian(p5.width / 2, 20),
      100,
      30,
      0.2,
    )
  }

  p5.setup = () => {
    for (let i = 0; i < 16; i += 1) {
      boxes.push(randomBox());
    }
  }

  p5.draw = () => {
    p5.background('#333');

    boxes.forEach((bx1) => {
      // accumulate global forces
      pressureBox(bx1, p5)

      // pairwise forces
      boxes.forEach((bx2) => {
        if (bx1 !== bx2) {
          pressureForce(bx1, bx2);
        }
      });

      // collisions?
    });

    // render and update boxes
    boxes.forEach((bx) => {
      renderBox(bx);
      bx.update();
    });
  }
}, { fps: 60, prepend: true });

addCanvas((p5) => {
  let boxes = [];
  let centerParticle;
  let otherCenter;
  let thirdCenter;

  const renderBox = (box) => {
    p5.push();
    p5.noFill();
    p5.stroke('#fff');
    p5.fill('rgba(255, 255, 255, 0.3)')
    p5.rectMode(p5.CENTER);
    p5.rect(box.x, box.y, box.width, box.height, 4);
    p5.pop();
  }

  const renderParticle = (p) => {
    p5.push();
    p5.noStroke();
    p5.fill('#fff');
    p5.circle(p.x, p.y, Math.max(p.rx, 6), Math.max(p.ry, 6));
    p5.pop();
  }

  const randomBox = () => {
    return box(
      p5.randomGaussian(p5.width / 2, 60),
      p5.randomGaussian(p5.width / 2, 60),
      100,
      30,
      0.2,
      0.75,
    )
  }

  p5.setup = () => {
    centerParticle = particle(p5.random(20, p5.width - 20), p5.random(20, p5.height - 20));
    centerParticle.rx = 30;
    centerParticle.ry = 30;

    otherCenter = particle(p5.random(20, p5.width - 20), p5.random(20, p5.height - 20));
    centerParticle.rx = 15;
    centerParticle.ry = 15;

    thirdCenter = particle(p5.random(20, p5.width - 20), p5.random(20, p5.height - 20));
    thirdCenter.rx = 6;
    thirdCenter.ry = 6;

    for (let i = 0; i < 12; i += 1) {
      boxes.push(randomBox());
    }
  }

  p5.draw = () => {
    p5.background('#333');

    boxes.forEach((bx1) => {
      // accumulate global forces
      pressureBox(bx1, p5, 0.05, 30);
      vacuumPoint(bx1, centerParticle, 0.06);
      vacuumPoint(bx1, otherCenter, 0.02);
      vacuumPoint(bx1, thirdCenter, 0.01);

      // pairwise forces
      boxes.forEach((bx2) => {
        if (bx1 !== bx2) {
          pressureForce(bx1, bx2, 15, 0.4);
        }
      });

      // collisions?
    });

    // render and update boxes
    boxes.forEach((bx) => {
      renderBox(bx);
      bx.update();
    });

    renderParticle(centerParticle);
    renderParticle(otherCenter);
    renderParticle(thirdCenter);
  }
}, { fps: 60, prepend: true });

addCanvas((p5) => {
  let boxes = [];
  let centerParticle;
  let otherCenter;
  let thirdCenter;

  const renderBox = (box) => {
    // if (box.width < 1 || box.height < 1) return;
    p5.push();
    p5.noFill();
    p5.stroke('#fff');
    p5.fill('rgba(255, 255, 255, 1)')
    p5.rectMode(p5.CENTER);
    p5.rect(box.x, box.y, box.width + 10, box.height + 10, 8);
    p5.pop();
  }

  const randomBox = () => {
    return box(
      p5.randomGaussian(p5.width / 2, 60),
      p5.randomGaussian(p5.width / 2, 60),
      0,
      0,
      0.2,
      0.75,
    )
  }

  p5.setup = () => {
    centerParticle = particle(p5.random(20, p5.width - 20), p5.random(20, p5.height - 20));
    centerParticle.rx = 30;
    centerParticle.ry = 30;

    otherCenter = particle(p5.random(20, p5.width - 20), p5.random(20, p5.height - 20));
    centerParticle.rx = 15;
    centerParticle.ry = 15;

    thirdCenter = particle(p5.random(20, p5.width - 20), p5.random(20, p5.height - 20));
    thirdCenter.rx = 6;
    thirdCenter.ry = 6;

    for (let i = 0; i < 12; i += 1) {
      boxes.push(randomBox());
    }
  }

  p5.draw = () => {
    p5.background('#333');

    boxes.forEach((bx1) => {
      // accumulate global forces
      pressureBox(bx1, p5, 0.05, 30);
      vacuumPoint(bx1, centerParticle, 0.06);
      vacuumPoint(bx1, otherCenter, 0.02);
      vacuumPoint(bx1, thirdCenter, 0.01);

      // pairwise forces
      boxes.forEach((bx2) => {
        if (bx1 !== bx2) {
          pressureForce(bx1, bx2, 15, 0.4);
        }
      });

      // collisions?
    });

    // render and update boxes
    boxes.forEach((bx, i) => {
      renderBox(bx);
      bx.update();
      // also update box size
      let popTime = 10;
      let t = smoothstep((p5.frameCount - 0) / popTime);
      bx.resize(
        p5.lerp(0, 100, t),
        p5.lerp(0, 30, t),
      );
    });

    // p5.noLoop();
  }
}, { fps: 60, prepend: true });