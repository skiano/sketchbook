// This loads an "animation strip" image and exposes an API for rendering the loop to the canvas
// it allows for controlling the color, timing and position of the rendering

// making a custom preloader is a bit annoying...
// @see https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md#step-5

export default function loadAnimationLoop(p5) {
  p5.prototype.loadAnimationLoop = function (filename, opt) {
    // default options...
    opt = {
      fill: 'black',
      scale: 1,
      debug: false,
      anchor: [0, 0], // where to register 
      pivot: [0, 0],
      ...opt,
    }

    // holds the eventual public interface...
    let result = {};

    this.loadImage(filename, (img) => {
      // create a graphic with the color applied
      // TODO: maybe don't clutter this plugin with this thing (since it only makes sense for solid shapes...)
      let gfx = this.createGraphics(img.width, img.height);
      gfx.image(img, 0, 0);
      gfx.loadPixels();
      result.setColor = (fill) => {
        fill = this.color(fill);
        let d = gfx.pixelDensity();
        let totalpx = 4 * (d * gfx.width) * (d * gfx.height);
        for (let i = 0; i < totalpx; i += 4) {
          gfx.pixels[i] = fill.levels[0];
          gfx.pixels[i + 1] = fill.levels[1];
          gfx.pixels[i + 2] = fill.levels[2];
        }
        gfx.updatePixels();
      }
      result.setColor(opt.fill);

      // set up some variables to track
      let totalFrames = this.round(gfx.width / gfx.height);
      let fw = opt.frameWidth || this.round(gfx.width / totalFrames);
      let fh = opt.frameHeight || fw;
      let frame = 0;
      let scale = opt.scale;
      let debug = opt.debug;
      let anchor = opt.anchor;
      let pivot = opt.pivot;

      // the main function to render a frame
      // TODO: should there be two different anchors? one for rotation and one for translation?
      result.renderFrame = (i, x, y, rotation = 0) => {
        let w = scale * fw;
        let h = scale * fh;
        let anchorX = anchor[0] * scale;
        let anchorY = anchor[1] * scale;
        let pivotX = pivot[0] * scale;
        let pivotY = pivot[1] * scale;
        let rx = i * fw;

        this.push(); // start: first translation
          this.angleMode(this.DEGREES);
          this.rectMode(this.CENTER);
          this.imageMode(this.CENTER);

          // NOTE: the relation between pivoting and anchoring is
          // super narly... tread lightly...

          this.translate(x + anchorX + pivotX, y + anchorY + pivotY);
          this.rotate(rotation);
          this.push(); // start: second translation
            this.translate(-pivotX, -pivotY);
            // this.translate(anchorX , anchorY);
            this.image(gfx, 0, 0, w, h, rx, 0, fw, fh);
            if (debug) {
              this.strokeWeight(1.5);
              this.noFill();
              this.stroke('cyan');
              this.rect(0, 0, w, h);
              this.circle(anchorX, anchorY, 12);
              this.line(pivotX - 10, pivotY, pivotX + 10, pivotY);
              this.line(pivotX, pivotY - 10, pivotX, pivotY + 10);
            }
          this.pop(); // end: second translation
        this.pop(); // end: first translation

        if (debug) {
          this.noStroke();
          this.fill('cyan');
          this.circle(x, y, 7);
        }
      }

      // expose some public stuff
      result.debug = (d) => { debug = !!d; };
      result.scale = (s) => { scale = s; };
      result.anchor = (a) => { anchor = a; };
      result.getFrame = () => frame;
      result.setFrame = (i) => { frame = i; };
      result.render = (x, y, r) => {
        result.renderFrame(frame, x, y, r);
        frame += 1;
        if (frame >= totalFrames) frame = 0;
      }

      // tell p5 this is ready...
      this._decrementPreload();
    });

    return result;
  }

  // Tell P5 this is a loader
  p5.prototype.registerPreloadMethod('loadAnimationLoop', p5.prototype);

  // A helpful function for loading a bunch of loops
  p5.prototype.loadAnimationLoopMap = function(map, sharedOpt) {
    let loops = {};
    Object.entries(map).forEach(([key, opt]) => {
      loops[key] = this.loadAnimationLoop(opt.file, {
        ...opt,
        ...sharedOpt,
      });
    });
    return loops;
  }
}