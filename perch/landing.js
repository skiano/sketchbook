import p5 from 'p5';
import p5FontVariables from './p5FontVariables.js';
import createLandingBubbles from './landingBubbles.js';
import createLandingSparrow from './landingSparrow.js';

p5FontVariables(p5);

const DPR = window.devicePixelRatio;
const splash = document.getElementById('splash');
const heroText = document.getElementById('splash-hero');
const splashContent = document.getElementById('splash-wrap');

// NOTE: I am updating these objects, rather than recreating them
// because they are only passed once to the bubble system
// and I don't want them to go stale for the bubbles
let splashBox = {};
let mainBox = {};
let heroBox = {};

const updateBox = (bbox, elm) => {
  const r = elm.getBoundingClientRect()
  bbox.top = r.top;
  bbox.left = r.left;
  bbox.right = r.right;
  bbox.bottom = r.bottom;
  bbox.width = r.width;
  bbox.height = r.height;
}

const updateBoxes = () => {
  updateBox(splashBox, splash);
  updateBox(mainBox, splashContent);
  updateBox(heroBox, heroText);
}

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.target === splash) {
      updateBoxes();
    }
  }
});

const affixCanvas = (parent, canvas) => {
  parent.style.position = 'relative';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.right = '0';
  canvas.style.bottom = '0';
  canvas.style.pointerEvents = 'none';
}

const landingSparrow = createLandingSparrow({
  getStartingPosition() {
    return {
      x: heroBox.left + heroBox.width * 1 / 3,
      y: heroBox.top - 8,
    }
  }
})

// const landingBubbles = createLandingBubbles({
//   bbox: extraBox,
//   queries: [
//     'What are the average home prices in this neighborhood?',
//     'How have property values changed in the last 5 years?',
//     'What is the crime rate in this area?',
//     'How are the local schools rated?',
//     'What is the average commute time to downtown?',
//     'What are the property tax rates in this area?',
//     'How does the cost of living here compare to other neighborhoods?',
//     'What percentage of homes in this area are owner-occupied?',
//     'What amenities are within walking distance?',
//     'What is the average rental income for properties in this area?',
//     'How competitive is the housing market here?',
//     'Are there any planned developments or zoning changes nearby?',
//     'What are the flood or natural disaster risks in this area?',
//     'How does this area’s air quality compare to other parts of the city?',
//     'What is the average household income in this neighborhood?',
//     'How much can I expect to spend on utilities here?',
//     'What public transportation options are available nearby?',
//     'How do home prices here compare to the citywide average?',
//     'What are the noise levels like in this area?',
//     'How long do homes typically stay on the market here?',
//   ],
//   onHover(bubble) {
//     landingSparrow.goTo(bubble.x, bubble.y - bubble.ry);
//     landingSparrow.followX();
//     document.body.style.cursor = 'pointer';
//   },
//   onSettle(bubble) {
//     landingSparrow.addBubblePerch(bubble);
//   },
//   onLeave(bubble) {
//     landingSparrow.removeBubblePerch(bubble)
//     landingSparrow.follow();
//     document.body.style.cursor = 'default';
//   },
// });

const queries = [
  'What are the average home prices in this neighborhood?',
  'How have property values changed in the last 5 years?',
  'What is the crime rate in this area?',
  'How are the local schools rated?',
  'What is the average commute time to downtown?',
  'What are the property tax rates in this area?',
  'How does the cost of living here compare to other neighborhoods?',
  'What percentage of homes in this area are owner-occupied?',
  'What amenities are within walking distance?',
  'What is the average rental income for properties in this area?',
  'How competitive is the housing market here?',
  'Are there any planned developments or zoning changes nearby?',
  'What are the flood or natural disaster risks in this area?',
  'How does this area’s air quality compare to other parts of the city?',
  'What is the average household income in this neighborhood?',
  'How much can I expect to spend on utilities here?',
  'What public transportation options are available nearby?',
  'How do home prices here compare to the citywide average?',
  'What are the noise levels like in this area?',
  'How long do homes typically stay on the market here?',
].map(t => ({ text: t }));

queries.push({
  primary: true,
  text: 'Ask us anything',
});

new p5((p) => {
  let hasMoved = false;

  p.setup = () => {
    p.frameRate(60);
    updateBoxes();
    p.createCanvas(splashBox.width, splashBox.height);
    affixCanvas(splash, p.canvas);
    resizeObserver.observe(splash);
  }

  p.draw = () => {
    // when the resize observer fires the canvas will no longer match the splashbox
    // and it's time to resize the canvas
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
    }
    p.clear();

    // KINDA FINICKY, but just gonna stick some keyframe logic here
    if (p.frameCount === 2) {
      heroText.classList.add('ready-to-fade');
    }

    if (p.frameCount === 30) {
      landingSparrow.start();
    }

    // DRAW SOME BUBBLES...

    let top = mainBox.top;
    let left = mainBox.left;
    let right = mainBox.right;
    let bottom = mainBox.bottom;
    let qHeight = heroBox.height;
    let qMargin = 14;
    let qPadding = 20;
    let qTextSize = 15;
    let qLineHeight = 23;

    let y = top;
    let x = left + heroBox.width + qMargin;
    // let maxRows = ((mainBox.height + qMargin) / (qHeight + qMargin)) >> 0;
    let row = 0;

    p.push();
    p.textFont('Literata');
    p.textSize(qTextSize);
    p.textLeading(qLineHeight);
    for (let q = 0; q < queries.length; q += 1) {
      let query = queries[q];
      const words = query.text.split(' ');
      const lines = [ // super naive wrap into two lines...
        words.slice(0, Math.ceil(words.length / 2)).join(' '),
        words.slice(Math.ceil(words.length / 2)).join(' '),
      ];
      let textW = query.primary ? 200 : Math.max(...lines.map(l => p.textWidth(l)));
      let qWidth = textW + qPadding * 2;

      if (x + qWidth > right) {
        x = left;
        y += qHeight + qMargin;
        row += 1;
      }

      if (y + qHeight > bottom) {
        break;
      }

      p.noStroke();
      p.fill(query.primary ? '#b0f4df' : '#fff');
      p.rect(x, y, qWidth, qHeight, 28);

      if (!query.primary) {
        p.fill('#696d6e');
        p.textAlign(p.LEFT, p.CENTER);
        p.text(lines[0], x + qPadding, y + (qHeight / 2) - (qLineHeight / 2));
        p.text(lines[1], x + qPadding, y + (qHeight / 2) + (qLineHeight / 2));
      }

      x += qWidth + qMargin;
    }
    p.pop();
  }

  p.mouseMoved = () => {
    if (!hasMoved && p.frameCount > 90) {
      landingSparrow.follow();
      hasMoved = true;
    }
  }
}, splash);

new p5((p) => {
  p.preload = () => {
    landingSparrow.preload(p);
  }

  p.setup = () => {
    p.frameRate(15);
    p.createCanvas(splashBox.width, splashBox.height);
    affixCanvas(splash, p.canvas);
    landingSparrow.setup(p);
  }

  p.draw = () => {
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
    }
    p.clear();
    landingSparrow.draw(p);
  }
}, splash);