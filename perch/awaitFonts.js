// SOME HACKY CRAP HAVING TO DO WITH ENSURING ADOBE FONTS RENDER...
// WITHOUT resorting to a local copy of the font loaded by p5...

// TODO: what about italics and variants etc...

export default function addAwaitFonts (p5) {
  let tasks = [];

  document.fonts.onloadingdone = (evt) => {
    tasks = tasks.filter((fn) => {
      return fn(evt);
    });
  };

  p5.prototype.awaitFonts = function(requiredFonts, timeout = 700) {
    let isCanceled;

    const t = setTimeout(() => {
      this._decrementPreload();
      isCanceled = true;
      alert('fonts failing?');
    }, timeout);

    requiredFonts.map(([f, w]) => {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      ctx.font = `${w.toString().split(' ')[0]} 100px ${f}`;
      ctx.fillText( "hello", 50, 50 );
      return f;
    });

    const check = (evt) => {
      console.log('FONT EVENT' + evt.fontfaces.map(f => `\n\tfamily='${f.family}'\n\tweight='${f.weight}'\n\tvariant='${f.variant}'`).join('\n'))
      const isFulfilled = requiredFonts.every(([family, weight]) => {
        return evt.fontfaces.some((face) => {
          return face.weight.toString() === weight.toString() && face.family === family;
        });
      });
      if (isFulfilled) {
        clearTimeout(t);
        if (!isCanceled) this._decrementPreload();
        return true;
      }
    };

    // add this waiting thing to the list of
    // tasks to run on font events
    tasks.push(check);
  }

  p5.prototype.registerPreloadMethod('awaitFonts', p5.prototype);

  p5.prototype.updateFontVariables = function(family, settings) {
    // NOTE,
    // each time we call this,
    // we must define EVERY axis (even if it doesnt change)
    this.textFont(family); // just apply the style to the canvas??
    let str = Object.entries(settings).map(([k, v]) => `'${k}' ${v}`).join(',');
    this.canvas.style.fontVariationSettings = str;
  }
}