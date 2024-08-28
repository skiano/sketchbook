// @see https://www.paulwheeler.us/articles/custom-3d-geometry-in-p5js/

import p5 from 'p5';

new p5((ctx) => {

  function createHeightMap() {
    let t = 0;
    let noiseLevel = 255;
    let noiseScale = 0.005;
    ctx.noiseSeed(99);
    return function(x, y, t = 0) {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let nt = noiseScale * (t * 10);
      return noiseLevel * ctx.noise(nx, ny, nt);;
    }
  }

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

  let m;
  let cam;
  let img;
  let gfx;
  let depth;
  let paintDepth;

  ctx.preload = () => {
    img = ctx.loadImage('./blanket.png');
  }

  ctx.setup = () => {
    // ctx.createCanvas(540, 540, ctx.WEBGL);
    ctx.createCanvas(200, 200, ctx.WEBGL);
    ctx.frameRate(30);
    cam = ctx.createCamera();
    m = createModel();



    depth = createHeightMap();

    // render clouds...
    gfx = ctx.createGraphics(200, 300);
    gfx.canvas.style.display = 'block';
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
    ctx.background('#aaa');
    ctx.orbitControl(2, 1, 0.05);
    ctx.ambientLight(80);

    // Shine a light in the direction the camera is pointing
    ctx.directionalLight(
      240, 240, 240,
      cam.centerX - cam.eyeX,
      cam.centerY - cam.eyeY,
      cam.centerZ - cam.eyeZ
    );

    ctx.texture(img);
    ctx.model(m);

    paintDepth()
  }
});