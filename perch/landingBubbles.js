import createBubbles from "./createBubbles.js";

export default function createLandingBubbles(opt) {
  let bubbles;

  return {
    setup(p5) {
      let lineHeight = 22;
      let boxPadding = 20;

      let setBubbleFont = () => {
        p5.textFont('Literata');
        p5.textSize(15);
        p5.textLeading(lineHeight);
      }

      let content = [{
        permanent: true,
        position: [2/3, 2/3],
        lines: ['Ask anything...'],
      }];

      opt.queries.forEach((query) => {
        // super naive wrap into two lines...
        const words = query.split(' ');
        const lines = [
          words.slice(0, Math.ceil(words.length / 2)).join(' '),
          words.slice(Math.ceil(words.length / 2)).join(' '),
        ];
        content.push({
          lines: lines
        });
      });

      bubbles = createBubbles(p5, {
        bbox: opt.bbox,
        content: content,
        onHover: opt.onHover,
        onLeave: opt.onLeave,
        onSettle: opt.onSettle,
        measureBubble(b) {
          let width;
          p5.push();
          setBubbleFont();
          width = Math.max(...b.content.lines.map(l => p5.textWidth(l)));
          p5.pop();
          return {
            width: width + (boxPadding * 2),
            height: (2 * lineHeight) + (boxPadding),
          }
        },
        renderBubble(b) {
          p5.push();
          setBubbleFont();
          p5.fill(
            b.hover
              ? '#ff654a'
              : (b.content.permanent ? '#ff654a' : '#9aa1a2')
          );
          p5.textAlign(p5.LEFT, p5.CENTER);
          p5.text(b.content.lines[0], b.x - b.rx + boxPadding, b.y - (lineHeight / 2));
          p5.text(b.content.lines[1], b.x - b.rx + boxPadding, b.y + (lineHeight / 2));
          p5.pop();
        },
      });
    },
    draw(p5) {
      bubbles.render();

      if (p5.frameCount === 100) {
        bubbles.insertBubbles(8);
      }

      // if (p5.frameCount % (60 * 4) === 0 && !bubbles.isHovering()) {
      //   bubbles.removeBubbles(3);
      //   bubbles.insertBubbles(3);
      // }
    },
  }
}