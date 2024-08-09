import './style.css';
import p5 from 'p5';

const app = document.getElementById('app');

new p5((p) => {
  
  p.setup = () => {
    let s = p.drawingContext.canvas.parentNode;
    let w = s.offsetWidth;
    let h = s.offsetHeight;
    p.createCanvas(w, h);
  }

  p.draw = () => {
    p.textAlign(p.CENTER, p.CENTER);
    
    p.fill('blue');
    p.textSize(200);
    p.text('p5.js', p.width / 2, p.height / 2);

    p.fill('red');
    p.textSize(460);
    p.text('4', p.width / 2, p.height / 2);

    p.fill('yellow');
    p.textSize(120);
    p.text('designers', p.width / 2, p.height / 2);

    // p.fill('yellow');
    // p.text('for', p.width / 2, p.height / 2);
    // p.text('designers', p.width / 2, p.height / 2 + 100);
  }

}, app);