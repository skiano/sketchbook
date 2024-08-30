import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

// @see https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md#step-6
// @see https://github.com/Vanilagy/mp4-muxer/blob/main/demo/script.js

const downloadBlob = (blob, title) => {
	let url = window.URL.createObjectURL(blob);
	let a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = title;
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);
};

export default function addRecorder(p5, opt) {
  opt = {
    fps: 30,
    ...opt,
  };

  // Monkeypatch frameRate calls
  const _fr = p5.prototype.frameRate;
  p5.prototype.frameRate = function patchedFrameRate(x) {
    if (opt.fps % x !== 0) throw new Error(`animation fps (${x}) incompatible with video fps (${opt.fps})`)
    if (x > opt.fps) throw new Error(`animation fps ${x} exceeds video fps`);
    this.__current_frame_rate__ = x;
    _fr.call(this, x);
  }

  p5.prototype.startRecorder = function() {
    this._recordFrame = true;
  }

  // after setup create a muxer and a video encoder
  p5.prototype.registerMethod('afterSetup', function () {
    this.frameRate(opt.fps);
    this._videoFrame = 0;
    this._lastKeyFrame = -Infinity;
    this._muxer = new Muxer({
      target: new ArrayBufferTarget(),
      fastStart: 'in-memory',
      // Because we're directly pumping a MediaStreamTrack's data into it, which doesn't start at timestamp = 0
      firstTimestampBehavior: 'offset', // ?????
      video: {
        codec: 'avc',
        width: this.canvas.width,
        height: this.canvas.height
      },
    });
    this._encoder = new VideoEncoder({
      output: (chunk, meta) => this._muxer.addVideoChunk(chunk, meta),
      error: e => console.error(e)
    });
    this._encoder.configure({
      // codec: 'avc1.4d002a', // 'avc1.42001f', ???? WTF is a good option here?
      codec: 'avc1.64802a', // maybe higher quality? (based on chat gpt)
      width: this.canvas.width,
      height: this.canvas.height,
      bitrate: 1e6 * 3.5,
      // bitrate: 1e6 * 10,
    });
    this.stopRecorder = async function(title = 'video') {
      this._recorderStopped = true;
      await this._encoder.flush();
      this._muxer.finalize();
      let buffer = this._muxer.target.buffer;
      downloadBlob(new Blob([buffer]), `${title}.mp4`);
    }
  });

  // After each draw, render frame(s)
  p5.prototype.registerMethod('post', function() {
    if (this._recorderStopped || !this._recordFrame) return;

    let frame = new VideoFrame(this.canvas, {
      timestamp: this._videoFrame * 1e6 / opt.fps, // Ensure equally-spaced frames every 1/30th of a second
      duration: 1e6 / opt.fps
    });

    // if the frameRate has been manipulated
    // repeat the frames to fit with the fixed video fps
    const howMany = opt.fps / this.__current_frame_rate__;
    for (let f = 0; f < howMany; f++) {
      let needsKeyFrame = this._videoFrame - this._lastKeyFrame >= (opt.fps * 3);
      if (needsKeyFrame) this._lastKeyFrame = this._videoFrame;
      this._encoder.encode(frame, { keyFrame: needsKeyFrame });
      this._videoFrame = this._videoFrame + 1;
    }

    frame.close();
  });
}