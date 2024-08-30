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


// addCanvas((p) => {
//   p.draw = () => {
//     p.background('#000');
//     renderPattern(p, TINY_EXES_LINES_01, {
//       x: p.frameCount,
//       y: p.frameCount * 1,
//       stroke: '#f00',
//       weight: 3,
//     });
//   };
// });

// addCanvas((p) => {
//   p.draw = () => {
//     p.background('#333');
//     renderPattern(p, TINY_EXES_LINES_01, {
//       x: p.frameCount,
//       y: p.frameCount * 1,
//       stroke: '#eee',
//       mask: [2, 3, 4, 5],
//     });
//   };
// });

// addCanvas((p) => {
//   p.draw = () => {
//     p.background('#333');
//     renderPattern(p, TINY_EXES_LINES_01, {
//       x: p.frameCount,
//       y: p.frameCount * 1,
//       stroke: '#eee',
//       mask: [0, 1],
//     });
//   };
// });

// addCanvas((p) => {
//   p.draw = () => {
//     p.background('#444');

//     renderPattern(p, TINY_EXES_LINES_01, {
//       x: p.frameCount,
//       y: p.frameCount * 1,
//       stroke: '#111',
//       weight: 23,
//       mask: [0, 1, 3, 5],
//     });

//     renderPattern(p, TINY_EXES_LINES_01, {
//       x: p.frameCount,
//       y: p.frameCount * 1,
//       stroke: '#333',
//       weight: 15,
//       mask: [0, 1, 3, 5],
//     });

//     renderPattern(p, TINY_EXES_LINES_01, {
//       x: p.frameCount,
//       y: p.frameCount * 1,
//       stroke: '#fff',
//       weight: 1,
//       mask: [0, 1],
//     });

//     renderPattern(p, TINY_EXES_LINES_01, {
//       x: p.frameCount,
//       y: p.frameCount * 1,
//       stroke: 'tomato',
//       weight: 1,
//       mask: [3, 5],
//     });
//   };
// });