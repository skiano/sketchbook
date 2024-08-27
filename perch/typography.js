import palette from "./palette.js";

function ramp(v1, v2, force = 0.5) {
  return v1 + ((v2 - v1) * force);
}

const rootElm = document.getElementById('typography');
const headings = 6;

function renderHeading(h, content) {
  let elm = document.createElement(h.tag);
  elm.style.fontFamily = h.fontFamily;
  elm.style.fontSize = h.fontSize;
  elm.style.fontWeight = h.fontWeight;
  elm.style.letterSpacing = h.letterSpacing;
  elm.style.lineHeight = h.lineHeight;
  elm.innerHTML = content;

  let label = document.createElement(h.tag);
  label.innerHTML = `${h.tag} • ${h.fontFamily}`;
  label.style.textTransform = 'uppercase';
  label.style.fontSize = '11px';
  label.style.fontWeight = 900;
  label.style.letterSpacing = '0.05em';
  label.style.color = palette.secondary[0];
  label.style.marginBottom = '8px';


  let labeled = document.createElement('div');
  labeled.style.marginBottom = '24px';

  
  labeled.append(label);
  labeled.append(elm);
  return labeled;
}

// Albert headings

const albertHeadingsWrap = document.createElement('section');
albertHeadingsWrap.style.padding = '30px';
albertHeadingsWrap.style.width = '455px';
albertHeadingsWrap.style.background = palette.warm[0];
albertHeadingsWrap.style.color = palette.warm[8];
rootElm.append(albertHeadingsWrap);

const albertHeadings = [];
const minAlbertTitleSize = 22;
const maxAlbertTitleSize = 56;
const minAlbertWeight = 520;
const maxAlbertWeight = 300;
const minAlbertLineHeight = 1.2;
const maxAlbertLineHeight = 1;
const minAlbertLetterSpacing = -0.01;
const maxAlbertLetterSpacing = -0.04;

for (let h = 0; h < headings; h += 1) {
  const step =  h / (headings - 1);
  albertHeadings.push({
    tag: `h${6 - h}`,
    fontFamily: 'Albert Sans',
    fontSize: `${ramp(minAlbertTitleSize, maxAlbertTitleSize, step) >> 0}px`,
    lineHeight: ramp(minAlbertLineHeight, maxAlbertLineHeight, step),
    fontWeight: ramp(minAlbertWeight, maxAlbertWeight, step) >> 0,
    letterSpacing: `${ramp(minAlbertLetterSpacing, maxAlbertLetterSpacing, step)}em`
  });
}

albertHeadings.reverse().forEach((h) => {
  albertHeadingsWrap.append(renderHeading(h, 'Evidence-based<br/>homebuying.'));
});

// Literata headings

const literataHeadingsWrap = document.createElement('section');
literataHeadingsWrap.style.padding = '30px';
literataHeadingsWrap.style.width = '455px';
literataHeadingsWrap.style.background = palette.warm[0];
literataHeadingsWrap.style.color = palette.warm[8];
rootElm.append(literataHeadingsWrap);

const literataHeadings = [];
const minLiterataTitleSize = 18;
const maxLiterataTitleSize = 36;
const minLiterataWeight = 775;
const maxLiterataWeight = 600;
const minLiterataLineHeight = 1.45;
const maxLiterataLineHeight = 1.25;
const minLiterataLetterSpacing = 0;
const maxLiterataLetterSpacing = -0.04;

for (let h = 0; h < headings; h += 1) {
  const step =  h / (headings - 1);
  literataHeadings.push({
    tag: `h${6 - h}`,
    fontFamily: 'Literata',
    fontSize: `${ramp(minLiterataTitleSize, maxLiterataTitleSize, step) >> 0}px`,
    lineHeight: ramp(minLiterataLineHeight, maxLiterataLineHeight, step),
    fontWeight: ramp(minLiterataWeight, maxLiterataWeight, step) >> 0,
    letterSpacing: `${ramp(minLiterataLetterSpacing, maxLiterataLetterSpacing, step)}em`
  });
}

literataHeadings.reverse().forEach((h) => {
  literataHeadingsWrap.append(renderHeading(h, 'A Wonderful Headline for a Blog Post, Don’t You Think?'));
});

