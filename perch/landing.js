import p5 from 'p5';

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

let splashBox;
let contentBox;
function updateBoxes() {
  splashBox = splash.getBoundingClientRect();
  contentBox = splashContent.getBoundingClientRect();
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
    p.frameRate(30);
    updateBoxes();
    splash.style.position = 'relative';
    const w = splash.scrollWidth;
    const h = splash.scrollHeight;
    p.createCanvas(splashBox.width, splashBox.height);
    p.canvas.style.position = 'absolute';
    p.canvas.style.top = '0';
    p.canvas.style.left = '0';
    p.canvas.style.right = '0';
    p.canvas.style.bottom = '0';
    p.canvas.style.pointerEvents = 'none';
    console.log(splashContent.getBoundingClientRect());
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

  function questionBoxes(left, top, width, height, t = 1, vert, reverse) {
    t = smoothstep(t);
    let divisions = 3;
    let size = vert ? height / divisions : width / divisions;

    for (let i = 0; i < divisions; i += 1) {
      if (vert) {
        let y = p.lerp(0, size * i, t);
        y = reverse ? top + height - y : top + y;
        perchLine(left, y, left + width, y);
      } else {
        let x = p.lerp(0, size * i, t);
        x = reverse ? left + width - x : left + x;
        perchLine(x, top, x, top + height);
      }
    }
  }

  p.draw = () => {
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
    }
    p.clear();
    p.noFill();

    let MX = 40;
    let MY = 60;
    let BT = contentBox.top - MY;
    let BL = contentBox.left - MX;
    let BR = contentBox.right + MX;
    let BB = contentBox.bottom + MY;

    // FIRST: the main lines...
    let duration = 30;
    perchLine(0, BT, BR, BT, getAnimationTime(duration, 0, 0));
    perchLine(BR, 0, BR, BB, getAnimationTime(duration, 0, duration * 0.25));
    perchLine(p.width, BB, BL, BB, getAnimationTime(duration, 0, duration * 0.5));
    perchLine(BL, p.height, BL, BT, getAnimationTime(duration, 0, duration * 0.75));

    // THEN: Box divisions...
    questionBoxes(0, 0, BR, BT, getAnimationTime(15, duration - 7, 0), false, false);
    questionBoxes(BR, 0, p.width - BR, BB, getAnimationTime(15, duration - 7, 0), true, false);
    questionBoxes(BL, BB, p.width - BL, p.height - BB, getAnimationTime(15, duration - 7, 0), false, true);
    questionBoxes(0, BT, BL, p.height - BT, getAnimationTime(15, duration - 7, 0), true, true);
  }

}, splash);