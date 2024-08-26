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
      mirror: false,
      cb: () => {},
      ...opt,
    }

    // make sure these are not currupted by reference
    opt.anchor = [...opt.anchor];
    opt.pivot = [...opt.pivot];

    if (opt.mirror) {
      opt.anchor[0] = opt.anchor[0] * -1;
      opt.pivot[0] = opt.pivot[0] * -1;
    }

    // holds the eventual public interface...
    let result = {};

    this.loadImage(filename, (img) => {
      // create a graphic with the color applied
      // TODO: maybe don't clutter this plugin with this thing (since it only makes sense for solid shapes...)
      let gfx = this.createGraphics(img.width, img.height);
      
      gfx.push();
      if (opt.mirror) {
        gfx.scale(-1, 1);
        gfx.image(img, -img.width, 0);
      } else {
        gfx.image(img, 0, 0);
      }
      gfx.pop();
      
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
      let isPaused = false;

      // the main function to render a frame
      // TODO: should there be two different anchors? one for rotation and one for translation?
      result.renderFrame = (i, x, y, rotation = 0, s = scale) => {
        let w = s * fw;
        let h = s * fh;
        let anchorX = anchor[0] * s;
        let anchorY = anchor[1] * s;
        let pivotX = pivot[0] * s;
        let pivotY = pivot[1] * s;
        let rx = i * fw;

        this.push(); // start: first translation
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
              this.line(pivotX, pivotY, pivotX + 15, pivotY);
              this.line(pivotX, pivotY - 15, pivotX, pivotY + 15);
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
      result.play = () => { isPaused = false };
      result.pause = () => { isPaused = true };
      result.debug = (d) => { debug = !!d; };
      result.scale = (s) => { scale = s; };
      result.setFrame = (i) => { frame = i; };
      result.getFrame = () => frame;
      result.getLength = () => totalFrames;
      result.render = (x, y, r, s) => {
        result.renderFrame(frame, x, y, r, s);
        if (!isPaused) frame = (frame + 1) % totalFrames;
      }

      // tell p5 this is ready...
      opt.cb();
      this._decrementPreload();
    });

    return result;
  }

  // Tell P5 this is a loader
  p5.prototype.registerPreloadMethod('loadAnimationLoop', p5.prototype);

  // A helpful function for loading a bunch of loops
  p5.prototype.loadAnimationLoopMap = function(map, sharedOpt) {
    let loops = {};
    let entries = 0;
    Object.entries(map).forEach(([key, opt]) => {
      entries += 1;
      loops[key] = this.loadAnimationLoop(opt.file, {
        ...opt,
        ...sharedOpt,
        mirror: false,
        key,
        cb: () => {
          entries -= 1;
          if (entries === 0) this._decrementPreload();
        }
      });
      if (opt.mirror) {
        entries += 1;
        loops[`${key}Right`] = loops[key];
        loops[`${key}Left`] = this.loadAnimationLoop(opt.file, {
          ...opt,
          ...sharedOpt,
          mirror: true,
          key,
          cb: () => {
            entries -= 1;
            if (entries === 0) this._decrementPreload();
          }
        });
      }
    });
    return loops;
  }

  p5.prototype.registerPreloadMethod('loadAnimationLoopMap', p5.prototype);
}