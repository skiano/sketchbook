import addCanvas from '../shared/addP5Canvas.js';

addCanvas((p) => {

  p.draw = () => {

    p.rectMode(p.CENTER);
    p.noStroke();
    p.fill('magenta');
    p.rect(p.width / 2, p.height / 2, 30, 30, 3);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.text('📓', p.width / 2 - 0.5, p.height / 2 + 1.5);

    p.noLoop();
  }
}, {
  width: 32,
  height: 32,
  background: 'transparent',
});

addCanvas((p) => {
  p.draw = () => {
    p.rectMode(p.CENTER);
    p.noStroke();
    p.fill('magenta');
    p.rect(p.width / 2, p.height / 2, 180, 180, 8);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(128);
    p.text('📓', p.width / 2 - 0.5, p.height / 2 + 8.5);
    p.noLoop();
  }
}, {
  width: 180,
  height: 180,
  background: 'transparent',
});