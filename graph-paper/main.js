import p5 from 'p5';
import p5Loop from '../shared/p5Loop.js';
import addCanvas from '../shared/addP5Canvas.js';
import gridPattern from './gridPattern.js';

p5Loop(p5);

addCanvas((p) => {
  let fillGridPattern;
  let loopLength = 30 * 5; // 2 seconds

  p.setup = () => {
    fillGridPattern = gridPattern({
      scale: 9,
      width: 4,
      height: 4,
      layers: [
        {
          color: 'red',
          weight: 8,
          segments: [
            [1, 1, 3, 3],
            [3, 1, 1, 3],
          ]
        },
      ],
    });
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
}, {
  fps: 30,
});

// function createPattern(opt) {
//   opt = {
//     segments: [],
//     ...opt,
//   }
//   return opt;
// }

// function renderPattern(ctx, pattern, opt) {
//   opt = {
//     x: 0, // TODO: handle these offsets...
//     y: 0, // TODO: handle these offsets...
//     width: 60,
//     height: 60,
//     fill: 'yellow',
//     stroke: 'black',
//     weight: 3,
//     mask: null,
//     renderFills: true,
//     renderSegments: true,
//     // mask???
//     ...opt,
//   }

//   // instead of using scale to "fit", think of scale as a multiple of a fixed unit
//   // this will be, i think, easier to map to real fabric...
//   // the strokes should also scale this way (with an optical adjustment???)

//   opt.x = opt.x % opt.width; // TODO: subtle problem with dropping fractions??
//   opt.y = opt.y % opt.height; // TODO: subtle problem with dropping fractions??

//   // TODO: negotiate squishing...?? or allow it...

//   // TODO: still not getting the right number of renders on edges...
//   let cols = Math.ceil((ctx.width + opt.x) / opt.width);
//   let rows = Math.ceil((ctx.width + opt.x) / opt.width + opt.y);
//   let scaleX = opt.width / pattern.width;
//   let scaleY = opt.height / pattern.height;

//   ctx.push();

//   ctx.translate(-opt.x, -opt.y);

//   for (let col = 0; col < cols; col +=1) {
//     ctx.push();
//     for (let row = 0; row < rows; row += 1) {

//       // TODO: render fills...
//       if (opt.renderSegments) {
//         ctx.push();
//         ctx.noFill();
//         ctx.stroke(opt.stroke);
//         ctx.strokeCap(ctx.ROUND);
//         ctx.strokeWeight(opt.weight);
//         pattern.segments.forEach((seg, i) => {
//           if (opt.mask && !opt.mask.includes(i)) return;
//           // TODO: if seg.length === 2 treat it as a dot
//           ctx.line(...seg.map(
//             v => v % 2
//               ? v * scaleY
//               : v * scaleX
//           ));
//         });
//         ctx.pop();
//       }

//       ctx.translate(opt.width, 0);
//     }
//     ctx.pop();
//     ctx.translate(0, opt.height);
//   }

//   ctx.pop();
// }

// const TINY_EXES_LINES_01 = createPattern({
//   width: 2,
//   height: 2,
//   segments: [
//     [0, 0, 1, 1],
//     [0, 1, 1, 0],
//     [0, 1.5, 1, 1.5],
//     [0.5, 1, 0.5, 2],
//     [1.5, 0, 1.5, 1],
//     [1, 0.5, 2, 0.5],
//   ],
// });

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