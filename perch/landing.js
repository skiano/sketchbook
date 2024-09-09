import p5 from 'p5';
import p5FontVariables from './p5FontVariables.js';
import createLandingBubbles from './landingBubbles.js';
import createLandingSparrow from './landingSparrow.js';

p5FontVariables(p5);

const DPR = window.devicePixelRatio;
const splash = document.getElementById('splash');
const heroText = document.getElementById('splash-hero');
const extraContent = document.getElementById('splash-right');

// NOTE: I am updating these objects, rather than recreating them
// because they are only passed once to the bubble system
// and I don't want them to go stale for the bubbles
let splashBox = {};
let heroBox = {};
let extraBox = {};

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
  updateBox(heroBox, heroText);
  updateBox(extraBox, extraContent);
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
      y: heroBox.top,
    }
  }
})

const landingBubbles = createLandingBubbles({
  bbox: extraBox,
  queries: [
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
  ],
  onHover(bubble) {
    landingSparrow.goTo(bubble.x, bubble.y - bubble.ry);
    landingSparrow.followX();
    document.body.style.cursor = 'pointer';
  },
  onSettle(bubble) {
    landingSparrow.addBubblePerch(bubble);
  },
  onLeave(bubble) {
    landingSparrow.removeBubblePerch(bubble)
    landingSparrow.follow();
    document.body.style.cursor = 'default';
  },
});

new p5((p) => {
  let hasMoved = false;

  p.setup = () => {
    p.frameRate(60);
    updateBoxes();
    p.createCanvas(splashBox.width, splashBox.height);
    affixCanvas(splash, p.canvas);
    resizeObserver.observe(splash);
    landingBubbles.setup(p);
  }

  p.draw = () => {
    // when the resize observer fires the canvas will no longer match the splashbox
    // and it's time to resize the canvas
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
    }
    p.clear();
    landingBubbles.draw(p);

    // KINDA FINICKY, but just gonna stick some keyframe logic here
    if (p.frameCount === 2) {
      heroText.classList.add('ready-to-fade');
    }

    if (p.frameCount === 30) {
      landingSparrow.start();
    }
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