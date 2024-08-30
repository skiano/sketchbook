import p5 from 'p5';
import p5Loop from '../shared/p5Loop.js';
import p5Recorder from '../shared/p5Recorder.js';
import addCanvas from '../shared/addP5Canvas.js';
import gridPattern from './gridPattern.js';

p5Loop(p5);
p5Recorder(p5, {
  recordLoop: { repeat: 1 },
  title: 'graph-paper',
});

const SIMPLE = {
  scale: 9,
  width: 4,
  height: 4,
  layers: [
    { color: 'red', weight: 8, segments: [ [1, 1, 3, 3], [3, 1, 1, 3] ] },
  ],
}

addCanvas((p) => {
  let fillGridPattern;
  let loopLength = 30 * 5;

  p.setup = () => {
    fillGridPattern = gridPattern(SIMPLE);
    p.loopLength(loopLength);
  }

  p.draw = () => {
    p.background('#0aa');
    let offsetX = p.loopFraction * 2;
    let offsetY = p.loopFraction;

    p.push();
    p.beginClip();
    p.circle(p.width / 2, p.height / 2, 400);
    p.endClip();
    fillGridPattern(p.canvas, -offsetX, -offsetY);
    p.pop();

    p.push();
    p.beginClip({ invert: true });
    p.circle(p.width / 2, p.height / 2, 400);
    p.endClip();
    fillGridPattern(p.canvas, offsetX, offsetY);
    p.pop();
  };
});

const TINY_EXES_SEGMENTS = [
  [0, 0, 1, 1],
  [0, 1, 1, 0],
  [0, 1.5, 1, 1.5],
  [0.5, 1, 0.5, 2],
  [1.5, 0, 1.5, 1],
  [1, 0.5, 2, 0.5],
];

addCanvas((p) => {
  const fillExes_1 = gridPattern({
    width: 2,
    height: 2,
    scale: 30,
    layers: [
      { color: 'white', weight: 1, segments: [[0, 0, 2, 2], [3, 0, 1, 2], [0.5, 0, 0.5, 1], [0, 0.5, 2, 0.5]] },
      { color: 'red', weight: 5.5, segments: TINY_EXES_SEGMENTS },
      { color: 'black', weight: 2, segments: TINY_EXES_SEGMENTS },
    ],
  });
  
  const fillExes_2 = gridPattern({
    width: 2,
    height: 2,
    scale: 30,
    layers: [
      { color: 'black', weight: 3, segments: TINY_EXES_SEGMENTS },
    ],
  });

  p.setup = () => {
    p.loopLength(30 * 5);
  }

  p.draw = () => {
    p.background('#f00');
    p.rectMode(p.CENTER);
    let offsetX = p.loopFraction;
    let offsetY = p.loopFraction;

    p.fill('#000')
    p.rect(p.width / 2, p.height / 2, 400);

    p.push();
    p.beginClip();
    p.rect(p.width / 2, p.height / 2, 400);
    p.endClip();
    fillExes_1(p.canvas, 0, offsetY);
    p.pop();

    p.push();
    p.beginClip({ invert: true });
    p.rect(p.width / 2, p.height / 2, 400);
    p.endClip();
    fillExes_2(p.canvas, offsetX, 0.373);
    p.pop();
  };
});

function translate(segments, [dx, dy]) {
  return segments.map(([x1, y1, x2, y2]) => {
    return [x1 + dx, y1 + dy, x2 + dx, y2 + dy];
  });
}

function repeat(segments, [dx, dy], quant) {
  let newSegments = [];
  for (let i = 0; i < quant; i += 1) {
    newSegments = newSegments.concat(translate(segments, [dx * i, dy * i]))
  }
  return newSegments;
}

function reflectX(segments, cx) {
  return segments.map(([x1, y1, x2, y2]) => {
    return [cx + (cx - x1), y1, cx + (cx - x2), y2];
  });
}

function reflectY(segments, cy) {
  return segments.map(([x1, y1, x2, y2]) => {
    return [x1, cy + (cy - y1), x2, cy + (cy - y2)];
  });
}

let zigsag1 = repeat([[2, 0, 0, 3], [2, 0, 2, 3]], [2, 0], 3);
let zigsag2 = repeat([[0, 5, 3, 3], [3, 3, 3, 5]], [3, 0], 2);
let zigsag3 = translate(reflectY(zigsag1, 1.5), [0, 5]);
let zigsag4 = translate(reflectX(zigsag2, 3), [0, 5]);
let group1 = [
  ...zigsag1,
  ...zigsag2,
  ...zigsag3,
  ...zigsag4,
];

let final = [
  ...group1,
  ...reflectX(group1, 6),
  // borders
  [0, 0, 12, 0],
  [0, 3, 12, 3],
  [0, 5, 12, 5],
  [0, 8, 12, 8],
  [0, 0, 0, 10],
  [6, 0, 6, 10],
];

addCanvas((p) => {
  const fillWithPattern = gridPattern({
    width: 12,
    height: 10,
    scale: 20,
    layers: [
      {
        color: '#222',
        weight: 2,
        segments: final,
      },
    ],
  });

  p.setup = () => {
    p.loopLength(30 * 8);
  }

  p.draw = () => {
    p.background('#eec');
    let offsetX = p.loopFraction;
    let offsetY = p.loopFraction;
    fillWithPattern(p.canvas, offsetX, 0.55);
  };
});
