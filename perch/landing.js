import p5 from 'p5';
import createLandingSparrow from './landingSparrow.js';

const DPR = window.devicePixelRatio;
const splash = document.getElementById('splash');
const heroText = document.getElementById('splash-hero');
const splashContent = document.getElementById('splash-wrap');
const splashRoot = document.getElementById('splash-root');
const splashScrim = document.getElementById('splash-scrim');

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
    let v = list[i % 2 ? 'pop' : 'shift']();
    v.isEven = i % 2 === 0;
    newList.push(v);
  }
  return newList;
}

const smoothstep = (t) => {
  t = Math.max(Math.min(t, 1), 0);
  return t * t * (3.0 - 2.0 * t);
}

const easeOutExpo = (x) => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

const landingSparrow = createLandingSparrow({
  getStartingPosition() {
    return {
      x: heroBox.left + heroBox.width * 1 / 3,
      y: heroBox.top - 8,
    }
  }
});

// TEMPORARY QUERIES....

const fetchQueries = () => {
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
    'What is the walkability score for this neighborhood?',
    'How does the crime rate here compare to the city average?',
    'What is the average square footage of homes in this area?',
    'How energy-efficient are the homes in this neighborhood?',
    'What types of homes (single-family, condos, etc.) are most common here?',
    'What is the vacancy rate in this neighborhood?',
    'What are the typical closing costs for homes in this area?',
    'What is the homeownership rate here compared to renters?',
    'Are there any major employers nearby?',
    'How close are the nearest parks and green spaces?',
    'What is the average age of homes in this neighborhood?',
    'What are the most common architectural styles in this area?',
    'What is the percentage of first-time homebuyers in this market?',
    'How many homes have been sold in the past year?',
    'Are there any tax incentives for homebuyers in this neighborhood?',
    'How far is the nearest hospital or healthcare facility?',
    'What are the noise pollution levels from traffic or airports?',
    'How well-served is the area by grocery stores and markets?',
    'How often do homes here sell for above the asking price?',
    'What are the most common reasons homes don’t sell in this market?',
  ].map(t => ({ text: t }));
  
  queries.push({
    primary: true,
    text: 'Ask    us    anything…',
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(queries);
    }, 500 + Math.random() * 2000);
  });
}

new p5((p) => {
  let queries;
  let bubbleBlock;
  let currentPerch;
  let hasMoved = false;
  let boxRadius = 18;
  let boxEnterTime = 70;
  let boxesStartAt;
  let hoverStartAt;
  let activeBubble;
  let isPreviewing;

  // This promise should resolve at a certain frame
  // AFTER the hero text is read by user
  let startTheShow;
  let showPromise = new Promise((resolve) => {
    startTheShow = resolve;
  })

  const setQueryFont = () => {
    p.textFont('Literata');
    p.textSize(15);
    p.textLeading(23);
  }

  const setupBubbles = (texts) => {
    if (!texts) return;
    let qHeight = heroBox.height;
    let qMargin = 12;
    let qPadding = 20;
    let primaryWidth = 250;

    // Add in width and height for bubble
    // then organize them shortest to longest
    // then make an "interleaved list" taking from opposite ends in alternation
    p.push();
    setQueryFont();
    const bubbles = interleaveList(texts.map((query) => {
      // super naive wrap into two lines...
      // the goal is to give an "attractive" shape to
      // the centered text in the bubbles
      let cutter = 0.33;
      let idealSplit = Math.floor(query.text.length * cutter);
      let realSplit = query.text.indexOf(' ', idealSplit);
      const lines = [
        query.text.slice(0, realSplit),
        query.text.slice(realSplit + 1),
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

      // massage the line by distributng extra width across boxes
      row.width = row.width - qMargin; // deduct trailing margin
      let lineFraction = 1;
      let leftover = lineFraction * (mainBox.width - duductedWidth) - row.width;
      if (leftover > 0) {
        let extra = leftover / row.bubbles.length;
        row.bubbles.forEach((b) => {
          b.width += extra
        });
      }

      // TODO: rerag the text to hide the massaging

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
        ...interleaveList(middleRows.sort((a, b) => a.width - b.width)).map(r => {
          // This just seems to make the gutters more attractive...
          if (r.isEven) r.bubbles = [...r.bubbles.slice(1), r.bubbles[0]];
          return r;
        }),
        primaryRow,
      ].filter(v => !!v) // filter out any invalid (i.e. incomplete or empty)
    };
  }

  const renderQuery = (bubble, x, y, t, ti) => {
    let t1 = easeOutExpo(p.map(t, 0, 0.4, 0, 1));
    let t2 = smoothstep(p.map(ti, 0.3, 0.6, 0, 1));
    let w = p.lerp(0, bubble.width, t1);
    let h = p.lerp(0, bubble.height, t1);
    x = p.lerp(x - 40, x, t1);
    y = p.lerp(y + 140, y, t1);

    // icky... but mark ready...
    if (t2 >= 0.8) bubble.ready = true;

    let ca = p.color('rgba(255, 255, 255, 0)');
    let cb = p.color('#696d6e');
    let c1 = p.lerpColor(ca, cb, t2);

    p.push();
    p.rectMode(p.CENTER)
    p.fill('#fff');

    bubble.hoverColor = p.lerp(bubble.hoverColor || 0, bubble.hoverIntent || 0, 0.2);
    let s1 = p.color('rgba(255, 255, 255, 0)');
    let s2 = p.color('#ff654a');
    let s = p.lerpColor(s1, s2, bubble.hoverColor);
    p.stroke(s);

    p.rect(x + bubble.width / 2, y + h / 2, w, h, boxRadius);
    p.textAlign(p.CENTER, p.CENTER);
    let lineHeight = 23; // TODO: lineheight here is a magic number... (23...)
    p.fill(c1);
    p.noStroke();
    p.text(bubble.lines[0], x + bubble.width / 2, y + (bubble.height / 2) - (lineHeight / 2));
    p.text(bubble.lines[1], x + bubble.width / 2, y + (bubble.height / 2) + (lineHeight / 2));
    p.pop();
  }

  const closePreview = () => {
    isPreviewing = false;
    activeBubble = false;
    splashRoot.classList.remove('open');
    landingSparrow.follow();
  }

  const renderPrimary = (bubble, x, y, t) => {
    let t1 = easeOutExpo(p.map(t, 0, 0.4, 0, 1));
    let t2 = smoothstep(p.map(t, 0.5, 0.9, 0, 1));
    let w = p.lerp(0, bubble.width, t1);
    let h = p.lerp(0, bubble.height, t1);
    y = p.lerp(y + 160, y, t1);

    // icky... but mark ready...
    if (t2 >= 0.8) bubble.ready = true;

    p.push()
    p.rectMode(p.CENTER)
    p.fill('#b0f4df');

    bubble.hoverColor = p.lerp(bubble.hoverColor || 0, bubble.hoverIntent || 0, 0.1);
    let s1 = p.color('rgba(255, 255, 255, 0)');
    let s2 = p.color('#00ae62');
    let s = p.lerpColor(s1, s2, bubble.hoverColor);
    p.stroke(s);

    p.rect(x + bubble.width / 2, y + h / 2, w, h, boxRadius);
    p.noStroke();
    p.fill('#263336');
    p.textFont('Albert Sans');
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(18);
    p.textLeading(18);

    let text = bubble.text;
    let textW = p.textWidth(text.replace(/\s\s+/g, ' '));
    let len = Math.round(text.length * t2);
    let typedText = text.substring(0, len).replace(/\s\s+/g, ' ');
    let textX = x + (bubble.width / 2) - (textW / 2);

    p.text(typedText, textX, y + bubble.height / 2)

    if (t1 > 0.5 && ((p.frameCount / 18) >> 0) % 2) {
      p.stroke('#696d6e');
      p.strokeWeight(1.5);
      let typedW = t2 < 1 ? p.textWidth(typedText) : textW;
      let cursorX = textX + typedW + 4;
      p.line(cursorX, y + bubble.height / 2 - 15, cursorX, y + bubble.height / 2 + 15);
    }
    p.pop()
  }

  p.setup = () => {
    p.frameRate(60);
    updateBoxes();
    p.createCanvas(splashBox.width, splashBox.height);
    affixCanvas(splash, p.canvas);
    resizeObserver.observe(splash);

    Promise.all([
      showPromise,
      fetchQueries().then((qs) => { queries = qs; }),
    ]).then(() => {
      bubbleBlock = setupBubbles(queries);
      boxesStartAt = p.frameCount;
    });

    // time to close the preview
    splashScrim.addEventListener('click', closePreview);

    // force literata to load
    let gfx = p.createGraphics(20, 20);
    gfx.textFont('Literata');
    gfx.textSize(15);
    gfx.textLeading(23);
    gfx.text('load please...', 0, 0);
  }

  p.draw = () => {
    // when the resize observer fires the canvas will no longer match the splashbox
    // and it's time to resize the canvas
    if (splashBox.width * DPR !== p.canvas.width || splashBox.height * DPR !== p.canvas.height) {
      p.resizeCanvas(splashBox.width, splashBox.height);
      if (bubbleBlock) { // do not let a screen resize kick it off early
        bubbleBlock = setupBubbles(queries);
      }
    }
    p.clear();

    // KINDA FINICKY, but just gonna stick some keyframe logic here
    if (p.frameCount === 2) {
      heroText.classList.add('ready-to-fade');
    }

    if (p.frameCount === 30) {
      landingSparrow.start();
    }

    if (p.frameCount === 100) {
      startTheShow();
    }

    // Draw the bubbles

    if (bubbleBlock) {
      p.push();
      p.noStroke();
      setQueryFont();

      let y = mainBox.top;
      let x = mainBox.left + heroBox.width + bubbleBlock.gap;
      bubbleBlock.rows.forEach((row, i) => {
        // if there is no top row possible, skip this position
        if (i === 0 && !row.isTop) {
          x = mainBox.left;
          y += row.height + bubbleBlock.gap;
        }
        row.bubbles.forEach((bubble, bidx) => {
          if (
            !isPreviewing &&
            bubble.ready &&
            p.mouseX > x &&
            p.mouseX < x + bubble.width &&
            p.mouseY > y &&
            p.mouseY < y + bubble.height
          ) {
            if (!bubble.hover) {
              hoverStartAt = p.frameCount;
              bubble.hoverIntent = 1;
            }
            // really hovering
            if (p.frameCount - hoverStartAt > 5) {
              activeBubble = bubble;
              document.body.style.cursor = 'pointer';
              landingSparrow.goToY(y);
              currentPerch = landingSparrow.addPerch(x + boxRadius, y, bubble.width - boxRadius * 2);
            }

            bubble.hover = true;
          } else {
            if (bubble.hover) {
              document.body.style.cursor = 'default';
              activeBubble = null;
              bubble.hoverIntent = 0;
              if (!isPreviewing) landingSparrow.follow();
              if (currentPerch) {
                landingSparrow.removeBubblePerch(currentPerch);
                currentPerch = null;
              }
            }
            bubble.hover = false;
          }

          let offsetTime = (i + bidx) * 4;

          if (bubble.primary) {
            let t = p.constrain((p.frameCount - boxesStartAt - offsetTime) / boxEnterTime, 0, 1);
            renderPrimary(bubble, x, y, t);
          } else {
            // Animation time for the bubble
            let inverseOffsetTime = 30 + ((bubbleBlock.rows.length - i) + (row.bubbles.length - bidx)) * 2;
            let t = p.constrain((p.frameCount - boxesStartAt - offsetTime) / boxEnterTime, 0, 1);
            let t2 = p.constrain((p.frameCount - boxesStartAt - inverseOffsetTime) / boxEnterTime, 0, 1);
            renderQuery(bubble, x, y, t, t2);
          }

          x += bubble.width + bubbleBlock.gap;
        });
        x = mainBox.left;
        y += row.height + bubbleBlock.gap;
      });
      p.pop();
    }
  }

  p.mouseMoved = () => {
    if (!hasMoved && p.frameCount > 90) {
      landingSparrow.follow();
      hasMoved = true;
    }
  }

  p.mouseClicked = () => {
    if (activeBubble) {
      landingSparrow.unfollow();
      splashRoot.classList.add('open');
      isPreviewing = true;
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