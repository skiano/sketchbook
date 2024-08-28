// @see https://www.paulwheeler.us/articles/custom-3d-geometry-in-p5js/
// @see other thing @https://pixijs.com/8.x/playground?exampleId=basic.meshPlane
// @see https://editor.p5js.org/davepagurek/sketches/05c1DIBTp

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
    let noiseLevel = 255;
    let noiseScale = 0.009;
    return function(x, y, t = 0) {
      let nx = noiseScale * x;
      let ny = noiseScale * y;
      let nt = noiseScale * (t * 10);
      return noiseLevel * ctx.noise(nx, ny, nt);;
    }
  }

  const heightMap = createHeightMap();

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

  let cam;
  let img;
  let terrain;

  ctx.preload = () => {
    img = ctx.loadImage('./blanket-4.png');
  }

  ctx.setup = () => {
    ctx.frameRate(30);
    ctx.createCanvas(540, 540, ctx.WEBGL);
    cam = ctx.createCamera(0, -150, 300);
    terrain = terrainFromNoise(400, 600, 100, 200);
  }

  ctx.draw = () => {
    ctx.background('#000');
    ctx.orbitControl();
    ctx.directionalLight(230, 230, 230, 0.3, 1, -0.5);
    ctx.directionalLight(230, 230, 230, 0.5, 1, -100.5);
    ctx.rotateX(ctx.PI / 4);
    ctx.rotateZ(ctx.frameCount / 40);
    ctx.scale(3, 3, 0.4);
    ctx.noStroke();
    ctx.specularMaterial(50, 30, 20);
    ctx.shininess(270);
    ctx.metalness(15);
    ctx.texture(img);
    ctx.model(terrain);
  }
});