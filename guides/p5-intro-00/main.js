import { addMarkdown, addHeader, addP5Example, addCodeExample } from '../utils.js';

addHeader({ title: 'Week One: The Mouse' });

addMarkdown(`
  Nam quis luctus neque. **Aliquam congue** viverra lacinia. Nullam [finibus](./) et turpis eu commodo. Nunc eu libero nec lectus ornare pharetra id at leo. Nulla luctus nisl nec ipsum mattis accumsan. Nunc finibus pretium diam, quis varius augue viverra eu. Curabitur feugiat lacus ut sapien sagittis blandit. Etiam commodo et tellus et tincidunt. Duis hendrerit facilisis sem, vitae posuere massa scelerisque in. Vestibulum ac venenatis risus, ornare malesuada elit.

  Nam quis luctus neque. Aliquam congue viverra lacinia. _Nullam finibus et turpis eu commodo._ Nunc eu libero nec lectus ornare pharetra id at leo. Nulla luctus nisl nec ipsum mattis accumsan. Nunc finibus pretium diam, quis varius augue viverra eu. Curabitur feugiat lacus ut sapien sagittis blandit. Etiam commodo et tellus et tincidunt. Duis hendrerit facilisis sem, vitae posuere massa scelerisque in. Vestibulum ac venenatis risus, ornare malesuada elit.
`);

addP5Example((p) => {
  p.draw = () => {
    if (p.mouseIsPressed === true) {
      p.circle(p.mouseX, p.mouseY, p.height / 10);
    }
  }
}, {
  background: '#e6e6e6',
});

addCodeExample(`
// and here is a comment...

function setup() {
  createCanvas(540, 540);
  background('white');
}

function draw() {
  if (mouseIsPressed) {
    circle(mouseX, mouseY, 30);
  }
}
`)

addMarkdown(`
  Nam quis luctus neque. Aliquam congue viverra lacinia. _Nullam finibus et turpis eu commodo._ Nunc eu libero nec lectus ornare pharetra id at leo. Nulla luctus nisl nec ipsum mattis accumsan. Nunc finibus pretium diam, quis varius augue viverra eu. Curabitur feugiat lacus ut sapien sagittis blandit. Etiam commodo et tellus et tincidunt. Duis hendrerit facilisis sem, vitae posuere massa scelerisque in. Vestibulum ac venenatis risus, ornare malesuada elit.
`);

addP5Example((p) => {
  p.draw = () => {

    p.background('#e6e6e6');
    p.noFill();
    p.strokeWeight(2);
    
    p.line(0, 0, p.mouseX, p.mouseY);
    p.line(p.width, 0, p.mouseX, p.mouseY);
    p.line(0, p.height, p.mouseX, p.mouseY);
    p.line(p.width, p.height, p.mouseX, p.mouseY);

    p.fill('black');
    p.circle(p.mouseX, p.mouseY, 30);
  }
});