// @see https://www.paulwheeler.us/articles/custom-3d-geometry-in-p5js/

import p5 from 'p5';

new p5((ctx) => {

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

  ctx.preload = () => {
    img = ctx.loadImage('./blanket.png');
  }

  ctx.setup = () => {
    // ctx.createCanvas(540, 540, ctx.WEBGL);
    ctx.createCanvas(200, 200, ctx.WEBGL);
    ctx.frameRate(30);
    cam = ctx.createCamera();
    m = createModel();
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
  }
});