// this configures each animation loop
// specifying the "anchor" to help align the loops
// as well as the "pivot" point, which determines how the images should react to rotation

export default {
  stand: {
    file: './images/loop-stand.png',
    anchor: [0, -58],
    pivot: [0, 58],
    fill: '#ff8559',
  },
  hop: {
    file: './images/loop-hop.png',
    anchor: [0, -58],
    pivot: [6, 15],
    fill: '#cca77d',
    mirror: true,
  },
  fly: {
    file: './images/loop-fly.png',
    anchor: [-20, -69],
    pivot: [22, 4],
    fill: '#7c847a',
    mirror: true,
  },
  hover: {
    file: './images/loop-hover.png',
    anchor: [-10, -58],
    pivot: [17, -12],
    fill: '#8ba574',
    mirror: true,
  }
};