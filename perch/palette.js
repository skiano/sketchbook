import Color from 'color';

const keyColor = new Color('#ff8559');
const complement = keyColor.rotate(180);

console.log(keyColor);
console.log(keyColor.hex());
console.log(complement.hex());


function previewSwatch(color) {
  const swatch = document.createElement('div');
  swatch.classList.add('swatch');
  swatch.style.background = color.hex();
  swatch.style.color = color.negate().hex();
  swatch.innerHTML = `${color.hex()}`;
  document.getElementById('palette').append(swatch);
}

previewSwatch(keyColor)

