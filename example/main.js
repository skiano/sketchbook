// import p5 from 'p5';
import fx from 'glfx';

function getImg(src) {
  const img = new Image();
  img.src = src;
  return new Promise((resolve, reject) => {
    img.addEventListener('error', reject);
    img.addEventListener('load', () => {
      resolve(img);
    });
  });
}

const img = await getImg('../images/selfie.jpg');
const canvas = fx.canvas();
const texture = canvas.texture(img);

canvas.style.width = '540px';
document.body.append(canvas);

let i = 0;
(function loop() {
  canvas
    .draw(texture)
    // .triangleBlur(10)
    .hueSaturation(0, Math.cos(i / 20))
    .brightnessContrast(0, Math.sin(i / 13) * 0.8)
    .update();
  i++;
  requestAnimationFrame(loop);
})();
