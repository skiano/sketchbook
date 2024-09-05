import p5 from 'p5';
import config from './config.js';
import p5FontVariables from './p5FontVariables.js';
import addAnimationLoops from './loadAnimationLoop.js';
import createSparrow from './createSparrow.js';

p5FontVariables(p5);
addAnimationLoops(p5);

// // TEMP: just forcing the font to load
// const c = document.createElement('canvas');
// const ctx = c.getContext('2d');
// ctx.font = `200 100px Literata`;
// ctx.fillText( "hello", 50, 50 );
// document.body.append(c);

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
const splashContent = document.getElementById('splash-content');
const extraContent = document.getElementById('splash-extra');

let splashBox;
let contentBox;
let extraBox;
function updateBoxes() {
  splashBox = splash.getBoundingClientRect();
  contentBox = splashContent.getBoundingClientRect();
  extraBox = extraContent.getBoundingClientRect();
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
  const perchGreen1 = p.color('#00ae62');
  const perchWarmGray5 = p.color('#bdb0ae');

  const smoothstep = (t) => {
    t = p.constrain(t, 0, 1);
    return t * t * (3.0 - 2.0 * t);
  }

  const getAnimationTime = (duration, start = 0, delay = 0) => {
    duration = duration - delay;
    start = start + delay;
    let end = start + duration;
    let f = p.constrain(p.frameCount, start, end);
    return ((f - start) / duration);
  }

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
  }

  function perchLine(x1, y1, x2, y2, t = 1, c = perchGreen1) {
    t = smoothstep(t);
    x2 = p.lerp(x1, x2, t);
    y2 = p.lerp(y1, y2, t);

    p.push();
    p.strokeWeight(1);
    p.stroke(c);
    p.line(x1, y1, x2, y2);
    p.noStroke();
    p.fill(c);
    p.circle(x1, y1, 7);
    p.circle(x2, y2, 7);
    p.pop();
  }

  p.draw = () => {
    // when the resize observer fires the canvas will no longer match the splashbox
    // and it's time to resize the canvas
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
    }

    // clear the background
    // and unset the defaults
    p.clear();
    p.noFill();
    p.noStroke();

    // FIRST: the main lines...
    let duration = 90;
    perchLine(extraBox.left, p.height + 10, extraBox.left, -10, getAnimationTime(duration, 0, 0));

    let lines = 12;
    let leading = p.height / lines;
    for (let i = 1; i < lines; i += 1) {
      let y = p.height - i * leading;
      perchLine(p.width + 10, y, extraBox.left, y, getAnimationTime(duration * 0.3, 30 + i * 6));
    }

    if (p.frameCount > 60 * 4) {
      p.fill('#696d6e');
      p.drawingContext.font = `normal 350 18px/1.2 Literata`;
      p.drawingContext.letterSpacing = "-0.03em";
  
      for (let i = 1; i <= lines; i += 1) {
        p.drawingContext.fillText(QUERIES[i + 3], extraBox.left + 20, leading * i - 25);
      }
    }
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
    p.frameRate(20);
    p.createCanvas(splashBox.width, splashBox.height);
    p.canvas.style.position = 'absolute';
    p.canvas.style.top = '0';
    p.canvas.style.left = '0';
    p.canvas.style.right = '0';
    p.canvas.style.bottom = '0';
    p.canvas.style.pointerEvents = 'none';

    sparrow = createSparrow({
      render: loops,
      x: contentBox.left + 160,
      y: contentBox.top,
      scale: 0.4,
      repeatFrames: 4,
    });
  }

  p.draw = () => {
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
    }

    p.clear();
    let x = p.constrain(p.mouseX, 50, p.width - 50);
    let y = p.constrain(p.mouseY, 80, p.height - 20);
    sparrow.moveTo(x, y);
    sparrow.render();
  }

}, splash);