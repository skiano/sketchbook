import tinycolor from 'tinycolor2';

function ramp(v1, v2, force = 0.5) {
  return v1 + ((v2 - v1) * force);
}

function swatchGroup(titleText) {
  const wrap = document.createElement('div');
  wrap.classList.add('swatch-wrap');
  const group = document.createElement('div');
  group.classList.add('swatch-group');
  const title = document.createElement('h3');
  title.innerText = titleText;
  wrap.append(title);
  wrap.append(group);
  document.getElementById('palette').append(wrap);
  return function previewSwatch(color) {
    const swatch = document.createElement('div');
    swatch.classList.add('swatch');
    swatch.style.background = color.toHexString();
    swatch.style.color = color.getLuminance() < 0.3 ? '#edf5f6' : '#171f20';
    swatch.innerHTML = `${color.toHexString()}`;
    group.append(swatch);
  }
}

function matchLuminance(input, targetLuminance = 0.5) {
  const { h, s } = input.toHsl();
  let l;
  let c;
  let lum;
  let err;
  let safety = 120;
  let min = 0;
  let max = 1;
  while (safety-- > 0) {
    l = (min + max) / 2;
    c = tinycolor.fromRatio({ h, s, l });
    lum = c.getLuminance();
    err = Math.abs(lum - targetLuminance);

    if (err < 0.001) break;

    if (lum > targetLuminance) {
      max = l;
    } else {
      min = l;
    }
  };
  return c;
};

const splitAngle = 35;
const keyLuminance = 0.33;
const keyColor = matchLuminance(tinycolor('#ff8559').spin(-4), keyLuminance);
const complement = keyColor.clone().spin(180);
const splitA = matchLuminance(complement.clone().spin(-splitAngle), keyColor.getLuminance());
const splitB = matchLuminance(complement.clone().spin(splitAngle), keyColor.getLuminance());


const previewPrimary = swatchGroup('Primary');
previewPrimary(keyColor);

const secondaryColors = [];
const tertiaryColors = [];

secondaryColors.push(splitA)
secondaryColors.push(matchLuminance(splitA.clone().spin(4).desaturate(20), ramp(keyLuminance, 1, 0.5)));
secondaryColors.push(matchLuminance(splitA.clone().spin(8).desaturate(25), ramp(keyLuminance, 1, 0.7)));

tertiaryColors.push(splitB);
tertiaryColors.push(matchLuminance(splitB.clone().spin(-4).desaturate(20), ramp(keyLuminance, 1, 0.5)));
tertiaryColors.push(matchLuminance(splitB.clone().spin(-8).desaturate(25), ramp(keyLuminance, 1, 0.7)));

const previewSecondary = swatchGroup('Secondary & Tertiary');
secondaryColors.forEach(previewSecondary);
[...tertiaryColors].reverse().forEach(previewSecondary);

function makeGrays(col, strength = 1) {
  let lumPattern = [0.93, 0.88, 0.8, 0.65, 0.45, 0.15, 0.075, 0.03, 0.012, 0.005];
  let satPattern = [40, 55, 80, 85, 90, 95, 85, 80, 70, 40];
  return lumPattern.map((l, i) => matchLuminance(col.clone().desaturate(satPattern[i] * strength), l));
}

const previewGrays = swatchGroup('Warm Neutrals');
const warmGrays = makeGrays(keyColor);
warmGrays.forEach(previewGrays);

const previewGrays2 = swatchGroup('Cool Neutrals');
const coolGrays = makeGrays(complement, 1.2);
coolGrays.forEach(previewGrays2);

// chart colors

const chart2 = swatchGroup('Chart Colors');
const previewChartColors = swatchGroup('Chart Colors (Expanded)');

const tetrad = complement.spin(splitAngle)
  .tetrad()
  .map((c, i) => {
    return matchLuminance(c, i % 2 ? 0.15 : 0.28)
  });

tetrad.forEach(chart2)

const octad = tetrad.concat(
    tetrad.map((t) => {
      return t.clone().spin(45)
    })
  );

octad.forEach(previewChartColors);

export default {
  primary: [keyColor.toHexString()],
  secondary: secondaryColors.map(c => c.toHexString()),
  tertiary: tertiaryColors.map(c => c.toHexString()),
  warm: warmGrays.map(c => c.toHexString()),
  cool: coolGrays.map(c => c.toHexString()),
  chart: tetrad.map(c => c.toHexString()),
  chartExpanded: octad.map(c => c.toHexString()),
}
