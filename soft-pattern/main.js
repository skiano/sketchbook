// @see https://www.paulwheeler.us/articles/custom-3d-geometry-in-p5js/
// other thing @https://pixijs.com/8.x/playground?exampleId=basic.meshPlane

import p5 from 'p5';

// Generate a hash code from an array of integers
const cyrb53 = function (ary) {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0, v; i < ary.length; i++) {
    v = ary[i];
    h1 = Math.imul(h1 ^ v, 2654435761);
    h2 = Math.imul(h2 ^ v, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

new p5((ctx) => {

  function createHeightMap() {
    let t = 0;
    let noiseLevel = 255;
    let noiseScale = 0.007;
    // let noiseScale = 0.005;
    ctx.noiseSeed(99);
    return function(x, y, t = 0) {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let nt = noiseScale * (t * 10);
      return noiseLevel * ctx.noise(nx, ny, nt);;
    }
  }

  const heightMap = createHeightMap();

  function createModel() {
    return new p5.Geometry(1, 1, function createGeometry() {

      let v0 = new p5.Vector(-50, -56, 0);
      let v1 = new p5.Vector(50, -56, 0);
      let v2 = new p5.Vector(0, 30, 0);

      this.vertices.push(v0, v1, v2);

      this.faces.push([0, 1, 2]);

      this.uvs.push([0.28, 0]);
      this.uvs.push([0.87, 0.43]);
      this.uvs.push([0.62, 1.0]);

      // Call this once, after all vertices and faces have been initialized
      this.computeNormals();

      this.gid = 'my-example-geometry';
    });
  }

  function terrainFromNoise(width, height, detailX = 100, detailY = 100) {
    return new p5.Geometry(detailX, detailY, function createGeometry() {
      // Pixels per sample
      const xpps = (width - 1) / detailX;
      const ypps = (height - 1) / detailY;
      const xoff = -width / 2;
      const yoff = -height / 2;
      const unitX = width / detailX;
      const unitY = height / detailY;

      let values = [];
      for (let j = 0; j <= detailY; j++) {
        for (let i = 0; i <= detailX; i++) {
          let v = heightMap(i * xpps, j * ypps);
          // make vertical ridges...??? to test making  a subtle texture...
          // v = v + (i % 2 ? 4 : -4);
          // v = v + (j % 2 ? 4 : -4);
          this.vertices.push(new p5.Vector(
            xoff + i * unitX,
            yoff + j * unitY,
            v * 2
          ));

          this.uvs.push([i * unitX / width, j * unitY / height]);

          values.push(v);
        }
      }

      this.computeFaces();
      this.computeNormals();
      this.gid = `terrain|${cyrb53(values)}`;
    });
  }

  let m;
  let cam;
  let img;
  let gfx;
  let depth;
  let paintDepth;
  let terrain;

  ctx.preload = () => {
    img = ctx.loadImage('./blanket-3.png');
  }

  ctx.setup = () => {
    // ctx.createCanvas(540, 540, ctx.WEBGL);
    ctx.createCanvas(540, 540, ctx.WEBGL);
    ctx.frameRate(30);
    cam = ctx.createCamera(0, -150, 300);



    m = createModel();
    depth = createHeightMap();
    terrain = terrainFromNoise(400, 600, 100, 200);

    // render clouds...
    gfx = ctx.createGraphics(200, 300);
    // gfx.canvas.style.display = 'block';
    let d = gfx.pixelDensity();
    let t = 4 * (d * gfx.width) * (d * gfx.height);
    gfx.loadPixels();
    // Copy the top half of the canvas to the bottom.

    paintDepth = () => {
      let x = 0;
      let y = 0;
      let vx;
      let vy;
      let vz;
      let maxX = gfx.width * d;
      let maxY = gfx.height * d;
      for (let i = 0; i < t; i += 4) {
        vx = ctx.map(x, 0, maxX, 0, 255);
        vy = ctx.map(y, 0, maxY, 0, 255);
        vz = depth(x, y, ctx.frameCount);
        gfx.pixels[i] = vz;
        gfx.pixels[i + 1] = vz;
        gfx.pixels[i + 2] = vz;
        gfx.pixels[i + 3] = 255;
        x += 1;
        if (x >= maxX) {
          x = 0;
          y += 1;
        }
      }
      gfx.updatePixels();
    }
  }

  ctx.draw = () => {
    ctx.background('#000');
    ctx.orbitControl();
    ctx.directionalLight(255, 255, 255, 0.3, 1, -0.5);
    ctx.rotateX(ctx.PI / 4);
    ctx.rotateZ(ctx.frameCount / 40);
    ctx.scale(3, 3, 0.4);

    ctx.noStroke();
    ctx.specularMaterial(50, 30, 20);
    ctx.shininess(300);
    ctx.metalness(20);
    ctx.texture(img);
    ctx.model(terrain);



    // paintDepth()
  }
});