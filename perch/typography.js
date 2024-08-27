import palette from "./palette.js";
import { parse as markdown } from 'marked';

function ramp(v1, v2, force = 0.5) {
  return v1 + ((v2 - v1) * force);
}

const rootElm = document.getElementById('typography');
const headings = 6;

function renderLabel(content) {
  let label = document.createElement('h5');
  label.innerHTML = content;
  label.style.textTransform = 'uppercase';
  label.style.fontSize = '11px';
  label.style.fontWeight = 900;
  label.style.letterSpacing = '0.05em';
  label.style.color = palette.secondary[0];
  label.style.marginBottom = '8px';
  return label;
}

function renderHeading(h, content) {
  let elm = document.createElement(h.tag);
  elm.style.fontFamily = h.fontFamily;
  elm.style.fontSize = h.fontSize;
  elm.style.fontWeight = h.fontWeight;
  elm.style.letterSpacing = h.letterSpacing;
  elm.style.lineHeight = h.lineHeight;
  elm.innerHTML = content;

  let labeled = document.createElement('div');
  labeled.style.marginBottom = '30px';

  
  labeled.append(renderLabel(`${h.tag} • ${h.fontFamily}`));
  labeled.append(elm);
  return labeled;
}

// Albert headings

const albertHeadingsWrap = document.createElement('section');
albertHeadingsWrap.style.padding = '36px 30px';
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


// Albert body and caption

const albertBodyWrap = document.createElement('section');
albertBodyWrap.classList.add('test-body-copy');
albertBodyWrap.style.padding = '36px 30px';
albertBodyWrap.style.width = '455px';
albertBodyWrap.style.background = palette.warm[0];
albertBodyWrap.style.color = palette.warm[8];
rootElm.append(albertBodyWrap);

albertBodyWrap.append(renderLabel('P • Albert Sans'));

const div = document.createElement('div');
div.innerHTML = markdown(`
  Nullam id commodo mauris, nec porta orci. **Maecenas vehicula** nisi eget cursus convallis. Vivamus vel viverra leo. Suspendisse eleifend risus non egestas luctus. Mauris sollicitudin nisl quis ante condimentum accumsan. Curabitur aliquam facilisis est et scelerisque. Nulla ac dictum nunc. Nam sed auctor augue.

  Fusce interdum congue ornare. _Pellentesque et molestie lorem. Etiam aliquam nibh leo, vitae vestibulum quam pharetra nec._ Donec non nunc eu lorem condimentum eleifend non ac arcu. Etiam rhoncus [ipsum eleifend](/) mauris gravida, sed pellentesque arcu maximus. Sed facilisis ornare elementum. Integer eu iaculis lorem. Mauris at ultrices lectus. Aenean massa mauris, imperdiet in ultricies tempus, accumsan id ligula. Maecenas iaculis augue ipsum, ut tempor tortor tempor vitae. Maecenas ante tortor, gravida quis dapibus ut, vulputate at tortor. Nunc consectetur est eget tortor gravida, at imperdiet nulla molestie. Donec efficitur molestie mi a pulvinar.
`);
div.style.fontSize = '16px';
div.style.lineHeight = '24px';
div.style.fontWeight = 460;
div.style.letterSpacing = '-0.008em';
div.style.wordSpacing = '-0.07em';
div.style.color = palette.cool[7];
albertBodyWrap.append(div)

// literata body and caption

const literataBodyWrap = document.createElement('section');
literataBodyWrap.classList.add('test-body-copy');
literataBodyWrap.style.padding = '36px 30px';
literataBodyWrap.style.width = '455px';
literataBodyWrap.style.background = palette.warm[0];
literataBodyWrap.style.color = palette.warm[8];
rootElm.append(literataBodyWrap);

literataBodyWrap.append(renderLabel('P • literata'))

const ldiv = document.createElement('div');
ldiv.innerHTML = markdown(`
  Nullam id commodo mauris, nec porta orci. **Maecenas vehicula** nisi eget cursus convallis. Vivamus vel viverra leo. Suspendisse eleifend risus non egestas luctus. Mauris sollicitudin nisl quis ante condimentum accumsan. Curabitur aliquam facilisis est et scelerisque. Nulla ac dictum nunc. Nam sed auctor augue.

  Fusce interdum congue ornare. _Pellentesque et molestie lorem. Etiam aliquam nibh leo, vitae vestibulum quam pharetra nec._ Donec non nunc eu lorem condimentum eleifend non ac arcu. Etiam rhoncus [ipsum eleifend](/) mauris gravida, sed pellentesque arcu maximus. Sed facilisis ornare elementum. Integer eu iaculis lorem. Mauris at ultrices lectus. Aenean massa mauris, imperdiet in ultricies tempus, accumsan id ligula. Maecenas iaculis augue ipsum, ut tempor tortor tempor vitae. Maecenas ante tortor, gravida quis dapibus ut, vulputate at tortor. Nunc consectetur est eget tortor gravida, at imperdiet nulla molestie. Donec efficitur molestie mi a pulvinar.
`);
ldiv.style.fontFamily = 'Literata';
ldiv.style.fontSize = '15.2px';
ldiv.style.lineHeight = '24px';
ldiv.style.fontWeight = 470;
ldiv.style.color = palette.cool[7];
literataBodyWrap.append(ldiv)