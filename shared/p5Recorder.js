import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

// NOTE:
// in order to use this,
// remember to add the muxer to the import map!!!
// {
//   "imports": {
//     "mp4-muxer": "https://esm.run/mp4-muxer@5.0.1"
//   }
// }

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

export default function p5Recorder(p5, opt) {
  opt = {
    fps: 30,
    quality: 5,
    recordLoop: null,
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

  p5.prototype.stopRecorder = async function(title = 'video') {
    if (this._recorderStopped) return;

    this._recordFrame = false;
    this._recorderStopped = true;
    await this._encoder.flush();
    this._muxer.finalize();
    let buffer = this._muxer.target.buffer;
    downloadBlob(new Blob([buffer]), `${opt.title || title}.mp4`);
  }

  p5.prototype.recordFrames = function(totalFrames) {
    this._totalFramesToRecord = totalFrames;
    this.startRecorder();
  }

  // after setup create a muxer and a video encoder
  p5.prototype.registerMethod('afterSetup', function () {

    // TODO: maybe I should wait to set this up when the recording starts??
    // that way I can make multiple recordings without refreshing

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
      bitrate: 1e6 * opt.quality,
      // bitrate: 1e6 * 10,
    });

    if (opt.recordLoop) {

      // TODO maybe set this up per sketch instead of at installation
      // AND... make it wait for the beginning of the loop
      // AND... add some indication on the screen that recording is happening
      opt.recordLoop = {
        key: 'l',
        repeat: 1,
        ...opt.recordLoop,
      }
      this.canvas.addEventListener('keyup', (evt) => {
        if (evt.key === opt.recordLoop.key && this.getLoopLength() && !this._recordFrame) {
          console.log('Start recording...', this.getLoopLength() * opt.recordLoop.repeat)
          this.recordFrames(this.getLoopLength() * opt.recordLoop.repeat);
        }
      });
      this.canvas.setAttribute('tabindex', 1);
      // this.canvas.focus();
    }
  });

  // After each draw, render frame(s)
  p5.prototype.registerMethod('post', function() {
    if (this._videoFrame === this._totalFramesToRecord) {
      this.stopRecorder();
      return;
    }
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