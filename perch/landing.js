import p5 from 'p5';
import createLandingSparrow from './landingSparrow.js';

const DPR = window.devicePixelRatio;
const splash = document.getElementById('splash');
const heroText = document.getElementById('splash-hero');
const splashContent = document.getElementById('splash-wrap');

// NOTE: I am updating these objects, rather than recreating them
// because they are only passed once to the bubble system
// and I don't want them to go stale for the bubbles
let splashBox = {};
let mainBox = {};
let heroBox = {};

const updateBox = (bbox, elm) => {
  const r = elm.getBoundingClientRect()
  bbox.top = r.top;
  bbox.left = r.left;
  bbox.right = r.right;
  bbox.bottom = r.bottom;
  bbox.width = r.width;
  bbox.height = r.height;
}

const updateBoxes = () => {
  updateBox(splashBox, splash);
  updateBox(mainBox, splashContent);
  updateBox(heroBox, heroText);
}

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.target === splash) {
      updateBoxes();
    }
  }
});

const affixCanvas = (parent, canvas) => {
  parent.style.position = 'relative';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.right = '0';
  canvas.style.bottom = '0';
  canvas.style.pointerEvents = 'none';
}

const interleaveList = (list) => {
  const newList = [];
  const total = list.length;
  for (let i = 0; i < total; i += 1) {
    newList.push(list[i % 2 ? 'pop' : 'shift']());
  }
  return newList;
}

const landingSparrow = createLandingSparrow({
  getStartingPosition() {
    return {
      x: heroBox.left + heroBox.width * 1 / 3,
      y: heroBox.top - 8,
    }
  }
});

const queries = [
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
].map(t => ({ text: t }));

queries.push({
  primary: true,
  text: 'Ask us anything',
});

new p5((p) => {
  let hasMoved = false;
  let bubbleBlock;

  const setQueryFont = () => {
    p.textFont('Literata');
    p.textSize(15);
    p.textLeading(23);
  }

  const setupBubbles = (texts) => {
    let qHeight = heroBox.height;
    let qMargin = 16;
    let qPadding = 20;
    let primaryWidth = 250;

    // Add in width and height for bubble
    // then organize them shortest to longest
    // then make an "interleaved list" taking from opposite ends in alternation
    p.push();
    setQueryFont();
    const bubbles = interleaveList(texts.map((query) => {
      const words = query.text.split(' ');

      const lines = [ // super naive wrap into two lines...
        words.slice(0, Math.ceil(words.length / 2)).join(' '),
        words.slice(Math.ceil(words.length / 2)).join(' '),
      ];

      let qWidth = primaryWidth;
      if (!query.primary) {
        let textW = Math.max(...lines.map(l => p.textWidth(l)));
        qWidth = textW + qPadding * 2;
      }

      return {
        ...query,
        lines: lines,
        width: qWidth,
        height: qHeight,
        padding: qPadding,
      }
    }).sort((a, b) => a.primary ? -1 : a.width - b.width));
    p.pop();

    // There are two special rows (the first and the last)
    // the first must deduct the hero text
    // the last must include the primary
    // Thus, these should be made first, and then fill in as many center rows as possible

    let bubbleIdx = 0; // track where to start taking bubbles

    const getRow = (duductedWidth = 0, isTop) => {
      if (bubbleIdx >= queries.length) return; // stop making rows if there's no queries left...
      const row = {
        bubbles: [],
        width: 0,
        height: qHeight,
        isTop: isTop
      };
      let x = mainBox.left;
      let max = mainBox.right - duductedWidth;
      let isComplete;
      for (let b = bubbleIdx; b < bubbles.length; b += 1) {
        let bubble = bubbles[b];
        if (x + bubble.width > max) {
          isComplete = true;
          bubbleIdx = b; // this is where to start on the next row
          break;
        }
        row.bubbles.push(bubble);
        row.width += bubble.width + qMargin;
        x += bubble.width + qMargin;
      }
      row.bubbles.reverse(); // ensures primary ends the final line

      // don't allow an unfilled line
      if (!isComplete) return;
      return row;
    }

    const primaryRow = getRow(); // take this first to ensure primary text is taken
    const topRow = getRow(heroBox.width + qMargin, true);

    // calculate space for middle rows, and deduct two for the special rows (clamp to zero)
    let maxRows = Math.max((((mainBox.height + qMargin) / (qHeight + qMargin)) >> 0) - 2, 0);
    let middleRows = [];
    for (let r = 0; r < maxRows; r += 1) {
      middleRows.push(getRow());
    }

    // combine special rows with middle rows
    return {
      gap: qMargin,
      rows: [
        topRow,
        ...interleaveList(middleRows.sort((a, b) => a.width - b.width)),
        primaryRow,
      ].filter(v => !!v) // filter out any invalid (i.e. incomplete or empty)
    };
  }

  const renderQuery = (bubble, x, y) => {
    p.fill(bubble.primary ? '#b0f4df' : '#fff');
    p.rect(x, y, bubble.width, bubble.height, 28);
    p.fill('#696d6e');
    p.textAlign(p.LEFT, p.CENTER);
    // TODO: lineheight here is a magic number... (23...)
    let lineHeight = 23;
    p.text(bubble.lines[0], x + bubble.padding, y + (bubble.height / 2) - (lineHeight / 2));
    p.text(bubble.lines[1], x + bubble.padding, y + (bubble.height / 2) + (lineHeight / 2));
  }

  const renderPrimary = (bubble, x, y) => {
    p.push()
    p.fill('#b0f4df');
    p.rect(x, y, bubble.width, bubble.height, 28);
    p.fill('#263336');
    p.textFont('Albert Sans');
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(18);
    p.textLeading(18);
    let textW = p.textWidth(bubble.text);
    p.text(bubble.text, x + (bubble.width / 2) - (textW / 2), y + bubble.height / 2)
    p.pop()
  }

  p.setup = () => {
    p.frameRate(60);
    updateBoxes();
    p.createCanvas(splashBox.width, splashBox.height);
    affixCanvas(splash, p.canvas);
    resizeObserver.observe(splash);
    bubbleBlock = setupBubbles(queries);
  }

  p.draw = () => {
    // when the resize observer fires the canvas will no longer match the splashbox
    // and it's time to resize the canvas
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
      bubbleBlock = setupBubbles(queries);
    }
    p.clear();

    // KINDA FINICKY, but just gonna stick some keyframe logic here
    if (p.frameCount === 2) {
      heroText.classList.add('ready-to-fade');
    }

    if (p.frameCount === 30) {
      landingSparrow.start();
    }

    // DRAW SOME BUBBLES...

    p.push();
    setQueryFont();

    let y = mainBox.top;
    let x = mainBox.left + heroBox.width + bubbleBlock.gap;
    bubbleBlock.rows.forEach((row, i) => {
      // if there is no top row possible, skip this position
      if (i === 0 && !row.isTop) {
        x = mainBox.left;
        y += row.height + bubbleBlock.gap;
      }
      row.bubbles.forEach((bubble) => {
        p.noStroke();
        if (bubble.primary) {
          renderPrimary(bubble, x, y);
        } else {
          renderQuery(bubble, x, y);
        }
        x += bubble.width + bubbleBlock.gap;
      });
      x = mainBox.left;
      y += row.height + bubbleBlock.gap;
    });

    // for (let q = 0; q < queries.length; q += 1) {
    //   let query = queries[q];
    //   const words = query.text.split(' ');
    //   const lines = [ // super naive wrap into two lines...
    //     words.slice(0, Math.ceil(words.length / 2)).join(' '),
    //     words.slice(Math.ceil(words.length / 2)).join(' '),
    //   ];
    //   let textW = query.primary ? primaryWidth : Math.max(...lines.map(l => p.textWidth(l)));
    //   let qWidth = textW + qPadding * 2;

    //   if (x + qWidth > right) {
    //     x = left;
    //     y += qHeight + qMargin;
    //     row += 1;
    //   }

    //   if (y + qHeight > bottom) {
    //     break;
    //   }

    //   p.noStroke();
    //   p.fill(query.primary ? '#b0f4df' : '#fff');
    //   p.rect(x, y, qWidth, qHeight, 28);

    //   if (!query.primary) {
    //     p.fill('#696d6e');
    //     p.textAlign(p.LEFT, p.CENTER);
    //     p.text(lines[0], x + qPadding, y + (qHeight / 2) - (qLineHeight / 2));
    //     p.text(lines[1], x + qPadding, y + (qHeight / 2) + (qLineHeight / 2));
    //   } else {
    //     p.push();
    //     p.textFont('Albert Sans');
    //     p.textStyle(p.BOLD);
    //     p.textAlign(p.LEFT, p.CENTER);
    //     p.textSize(18);
    //     p.textLeading(qLineHeight);
    //     p.fill('#263336');
    //     let text = query.text;
    //     let textW = p.textWidth(text);
    //     let textX = x + (qWidth / 2) - (textW / 2);
    //     p.text(text, textX, y + (qHeight / 2));
    //     p.pop();

    //   }

    //   x += qWidth + qMargin;
    // }
    p.pop();
  }

  p.mouseMoved = () => {
    if (!hasMoved && p.frameCount > 90) {
      landingSparrow.follow();
      hasMoved = true;
    }
  }
}, splash);

new p5((p) => {
  p.preload = () => {
    landingSparrow.preload(p);
  }

  p.setup = () => {
    p.frameRate(15);
    p.createCanvas(splashBox.width, splashBox.height);
    affixCanvas(splash, p.canvas);
    landingSparrow.setup(p);
  }

  p.draw = () => {
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
    }
    p.clear();
    landingSparrow.draw(p);
  }
}, splash);