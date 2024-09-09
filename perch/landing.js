import p5 from 'p5';
import config from './config.js';
import p5FontVariables from './p5FontVariables.js';
import addAnimationLoops from './loadAnimationLoop.js';
import createSparrow from './createSparrow.js';

p5FontVariables(p5);
addAnimationLoops(p5);

const QUERIES = [
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
];

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
function updateBox(bbox, elm) {
  const r = elm.getBoundingClientRect()
  bbox.top = r.top;
  bbox.left = r.left;
  bbox.right = r.right;
  bbox.bottom = r.bottom;
  bbox.width = r.width;
  bbox.height = r.height;
}
function updateBoxes() {
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

new p5((p) => {
  // COLORS
  const perchOrange = p.color('#ff654a');

  const createBubble = (txt, x = 0, y = 0, isSpecial) => {
    const txtSize = 15;
    const txtLeading = 22;

    // super naive wrap into two lines...
    const words = txt.split(' ');
    const lines = [
      words.slice(0, p.ceil(words.length / 2)).join(' '),
      words.slice(p.ceil(words.length / 2)).join(' '),
    ];

    const setFont = () => {
      p.textFont('Literata');
      p.textSize(txtSize);
      p.textLeading(txtLeading);
    }

    let open = true;
    let txtW = 0;
    let width = 0;
    let loopOffset = p.random(0, 40);

    let randomFactorX = p.randomGaussian(0.8, 0.1);
    let randomFactorY = p.randomGaussian(0.8, 0.1);

    return {
      getRandomFactor() {
        return [randomFactorX, randomFactorY];
      },
      move(nx, ny) {
        x = nx;
        y = ny;
      },
      isOpen() {
        return open;
      },
      open() {
        open = true;
        setFont();
        let w = Math.max(
          p.textWidth(lines[0]),
          p.textWidth(lines[1])
        );
        txtW = w;
      },
      render() {

        p.push();

        let ry = y + (p.sin((p.frameCount + loopOffset) / 15) * 6);
        ry = y // debug
        
        p.rectMode(p.CENTER);
        p.noStroke();
        p.fill('#fff');
        if (open) {
          p.rect(x, ry, txtW + 40, txtLeading * 3, 8);
        } else {
          p.rect(x, ry, 10, 10, 5);
        }
        p.pop();

        p.push();
        p.fill(isSpecial ? perchOrange : '#9aa1a2')
        p.textAlign(p.LEFT, p.CENTER);
        setFont();
        p.text(lines[0], x - (txtW / 2), ry - txtLeading / 2, txtW + 15);
        p.text(lines[1], x - (txtW / 2), ry + txtLeading / 2, txtW + 15);
        p.pop();
      },
    }
  }

  let bubbles;

  p.setup = () => {
    p.frameRate(60);
    updateBoxes();
    splash.style.position = 'relative';
    p.createCanvas(splashBox.width, splashBox.height);
    p.canvas.style.position = 'absolute';
    p.canvas.style.top = '0';
    p.canvas.style.left = '0';
    p.canvas.style.right = '0';
    p.canvas.style.bottom = '0';
    p.canvas.style.pointerEvents = 'none';
    resizeObserver.observe(splash);

    bubbles = QUERIES.slice(0, 9).map((q, i) => createBubble(q));
    bubbles.forEach(b => b.open());
  }

  p.draw = () => {
    // when the resize observer fires the canvas will no longer match the splashbox
    // and it's time to resize the canvas
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
    }
    p.clear();

    let cx = extraBox.left + (extraBox.right - extraBox.left) / 2;
    let cy = extraBox.top + (extraBox.bottom - extraBox.top) / 2;
    let rx = extraBox.width / 6;
    let ry = extraBox.height / 6;
    bubbles.forEach((b, i) => {
      let a = i / bubbles.length * p.TAU;
      b.move(cx + p.cos(a) * rx, cy + p.sin(a) * ry);
    });
    bubbles.forEach(b => b.render());
  }

}, splash);

new p5((p) => {
  let loops;
  let sparrow;

  // COLORS
  const perchOrange = p.color('#ff654a');

  p.preload = () => {
    loops = p.loadAnimationLoopMap(config, {
      fill: perchOrange,
    });
  }

  p.setup = () => {
    p.frameRate(15);
    p.createCanvas(splashBox.width, splashBox.height);
    p.canvas.style.position = 'absolute';
    p.canvas.style.top = '0';
    p.canvas.style.left = '0';
    p.canvas.style.right = '0';
    p.canvas.style.bottom = '0';
    p.canvas.style.pointerEvents = 'none';

    sparrow = createSparrow({
      render: loops,
      x: 0,
      y: -60,
      scale: 0.4,
      repeatFrames: 4,
    });
  }

  p.draw = () => {
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
    }
    p.clear();

    if (p.frameCount > 0) {
      let x = p.constrain(p.mouseX, 50, p.width - 50);
      let y = p.constrain(p.mouseY, 80, p.height - 20);
      sparrow.moveTo(heroBox.left + heroBox.width * 1 / 3, heroBox.top);
    } else {
      sparrow.moveTo(-60, 160);
    }
    
    sparrow.render();
  }

}, splash);