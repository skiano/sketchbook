import { createNoise3D, createNoise2D } from 'simplex-noise';
export function exampleTexture(w, h, bg = '#fff') {
  const canvas = document.createElement('canvas');
  canvas.ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w / 2}px`;
  canvas.style.height = `${h / 2}px`;
  canvas.ctx.fillStyle = bg;
  canvas.ctx.fillRect(0, 0, w, h);

  // some dumb pattern thing...

  const imageData = canvas.ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let x = 0;
  let y = 0;
  let a = Math.random() * 200 + 10;
  let b = Math.random() * 200 + 10;
  let c = Math.random() * 200 + 10;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = (x / 12) % 2 ? a : 0; // red
    data[i + 1] = (y / 12) % 2 ? b : 0; // green
    data[i + 2] = (x / 24) % 2 ? c : 0; // blue
    x += 1;
    if (x >= canvas.width) {
      x = 0;
      y += 1;
    }
  }
  canvas.ctx.putImageData(imageData, 0, 0);

  // end example

  return canvas;
}

export function exampleShine(w, h, bg, fg) {
  const canvas = document.createElement('canvas');
  canvas.ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w / 2}px`;
  canvas.style.height = `${h / 2}px`;
  canvas.ctx.fillStyle = bg;
  canvas.ctx.fillRect(0, 0, w, h);

  // some dumb pattern thing...

  const imageData = canvas.ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let x = 0;
  let y = 0;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = (x / 12) % 2 ? bg : fg; // red
    data[i + 1] = (y / 12) % 2 ? bg : fg; // green
    data[i + 2] = (x / 24) % 2 ? bg : fg; // blue
    x += 1;
    if (x >= canvas.width) {
      x = 0;
      y += 1;
    }
  }
  canvas.ctx.putImageData(imageData, 0, 0);

  // end example

  return canvas;
}



export function exampleDisplacement(w, h) {
  const canvas = document.createElement('canvas');
  canvas.ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w / 2}px`;
  canvas.style.height = `${h / 2}px`;
  canvas.ctx.fillStyle = '#000';
  canvas.ctx.fillRect(0, 0, w, h);

  // some dumb pattern thing...

  const imageData = canvas.ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let x = 0;
  let y = 0;
  for (let i = 0; i < data.length; i += 4) {
    let g = y / canvas.height * 255;
    data[i] = g; // red
    data[i + 1] = g; // green
    data[i + 2] = g; // blue
    x += 1;
    if (x >= canvas.width) {
      x = 0;
      y += 1;
    }
  }
  canvas.ctx.putImageData(imageData, 0, 0);

  // end example

  return canvas;
}


export function exampleBump(w, h) {
  const canvas = document.createElement('canvas');
  canvas.ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w / 2}px`;
  canvas.style.height = `${h / 2}px`;
  canvas.ctx.fillStyle = '#000';
  canvas.ctx.fillRect(0, 0, w, h);

  const noise = createNoise2D();

  // some dumb pattern thing...

  const imageData = canvas.ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let x = 0;
  let y = 0;
  for (let i = 0; i < data.length; i += 4) {
    let g = ((noise(x * 10, y * 10) + 1) / 2) * 255;
    data[i] = g; // red
    data[i + 1] = g; // green
    data[i + 2] = g; // blue
    x += 1;
    if (x >= canvas.width) {
      x = 0;
      y += 1;
    }
  }
  canvas.ctx.putImageData(imageData, 0, 0);

  // end example

  return canvas;
}

export function exampleCloud(w, h) {
  const canvas = document.createElement('canvas');
  canvas.ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${w / 2}px`;
  canvas.style.height = `${h / 2}px`;
  canvas.ctx.fillStyle = '#000';
  canvas.ctx.fillRect(0, 0, w, h);

  // some dumb pattern thing...

  const noise = createNoise3D();

  const imageData = canvas.ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let x = 0;
  let y = 0;
  for (let i = 0; i < data.length; i += 4) {
    let g = ((noise(x / 150, y / 150, 1) + 1) / 2) * 255;
    data[i] = g; // red
    data[i + 1] = g; // green
    data[i + 2] = g; // blue
    x += 1;
    if (x >= canvas.width) {
      x = 0;
      y += 1;
    }
  }
  canvas.ctx.putImageData(imageData, 0, 0);

  // end example

  return canvas;
}