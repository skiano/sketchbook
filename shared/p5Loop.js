// @see https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md#step-6

// USAGE:
// in setup() call loopLength() with the number of frames the loop should take
// then, inside draw(), you can access loopFrame, loopFraction, and loopAngle (radians)

export default function p5Loop(p5) {
  p5.prototype.loopLength = function(v) {
    this._loopLength = v;
  }

  p5.prototype.getLoopLength = function() {
    return this._loopLength;
  }

  p5.prototype.loopFrame = function(v) {
    return (this.frameCount - 1) % this._loopLength;
  }

  p5.prototype.registerMethod('pre', function () {
    // if there is no loopLength set... do not incur the extra calculations
    if (!this._loopLength) return;

    // NOTE: the -1 here is because frameCount begins at 1 with p5 (not helpful for using %)
    this.loopFrame = (this.frameCount - 1) % this._loopLength;
    this.loopFraction = this.loopFrame / this._loopLength;
    this.loopAngle = this.loopFraction * this.TAU;
  });
}
