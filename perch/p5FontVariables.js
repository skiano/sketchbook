export default function p5FontVariables(p5) {
  p5.prototype.updateFontVariables = function(family, settings) {
    // NOTE,
    // each time we call this,
    // we must define EVERY axis (even if it doesnt change)
    this.textFont(family); // just apply the style to the canvas??
    let str = Object.entries(settings).map(([k, v]) => `'${k}' ${v}`).join(',');
    this.canvas.style.fontVariationSettings = str;
  }
}