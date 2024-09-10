import createBubbles from "./createBubbles.js";

const smoothstep = (t) => {
  t = Math.max(Math.min(t, 1), 0);
  return t * t * (3.0 - 2.0 * t);
}

export default function createLandingBubbles(opt) {
  let bubbles;

  return {
    setup(p5) {
      let lineHeight = 23;
      let boxPadding = 22;

      let setBubbleFont = () => {
        p5.textFont('Literata');
        p5.textSize(15);
        p5.textLeading(lineHeight);
      }

      let content = [{
        permanent: true,
        position: [1/2, 1/2],
        // lines: ['Ask    us    anything…'],
        lines: ['Ask    us    anything'],
        // lines: ['Ask us anything'],
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
        focalPosition: [0.5, 0.5],
        measureBubble(b) {
          let width;
          p5.push();
          setBubbleFont();
          width = Math.max(...b.content.lines.map(l => p5.textWidth(l)));
          p5.pop();
          return {
            width: b.content.permanent ? 220 : width + (boxPadding * 2),
            height: (2 * lineHeight) + (boxPadding * 1.5),
          }
        },
        renderBubble(b) {
          p5.push();
          if (b.content.permanent) {
            p5.textAlign(p5.LEFT, p5.CENTER);
            p5.textFont('Albert Sans');
            p5.textSize(17);
            p5.textStyle(p5.BOLD);
            p5.textLeading(lineHeight);
            p5.fill(b.hover ? '#00ae62' : '#263336');

            let text = b.content.lines[0];
            let textW = p5.textWidth(text.replace(/\s\s+/g, ' '));
            let textX = b.x - (textW / 2);
            let typeTime = 55;
            let time = smoothstep(Math.min((p5.frameCount - b.madeAt - 45) / typeTime, 1));
            let len = Math.round(text.length * time);
            let typedText = text.substring(0, len).replace(/\s\s+/g, ' ');
            p5.text(typedText, textX, b.y);
            if (((p5.frameCount / 15) >> 0) % 2) {
              p5.stroke(b.hover ? '#00ae62' : '#696d6e');
              p5.strokeWeight(1.5);
              let typedW = time < 1 ? p5.textWidth(typedText) : textW;
              let cursorX = textX + typedW + 4;
              p5.line(cursorX, b.y - 12, cursorX, b.y + 12);
            }
          } else {
            setBubbleFont();
            p5.fill(b.hover ? '#00ae62' : '#415053');
            p5.textAlign(p5.LEFT, p5.CENTER);
            p5.text(b.content.lines[0], b.x - b.rx + boxPadding, b.y - (lineHeight / 2));
            p5.text(b.content.lines[1], b.x - b.rx + boxPadding, b.y + (lineHeight / 2));
            
          }
          p5.pop();
        },
      });
    },
    draw(p5) {
      bubbles.render();

      // if (p5.frameCount === 90) {
      //   bubbles.insertBubbles(1);
      // }

      if (p5.frameCount === 120) {
        bubbles.insertBubbles(1);
      }

      if (p5.frameCount === 160) {
        bubbles.insertBubbles(12);
      }

      // if (p5.frameCount % (60 * 4) === 0 && !bubbles.isHovering()) {
      //   bubbles.removeBubbles(3);
      //   bubbles.insertBubbles(3);
      // }
    },
  }
}