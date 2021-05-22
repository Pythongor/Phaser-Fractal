const config = {
  width: 4000,
  height: 2000,
  type: Phaser.AUTO,
  parent: "phaser-example",
  scene: {
    create: create,
  },
};

const game = new Phaser.Game(config);
const initLine = {
  startX: 0,
  startY: config.height / 2,
  endX: config.width,
  endY: config.height / 2,
};
const maxIterations = 5;
let iterations = 0;

let lines = [initLine];
let color1 = 0xffff00;
let color2 = 0x550055;

const colorPicker1 = document.getElementById("colorPicker1");
const colorPicker2 = document.getElementById("colorPicker2");
colorPicker1.value = `#${color1.toString(16)}`;
colorPicker2.value = `#${color2.toString(16)}`;

function create() {
  let graphics = this.add.graphics();

  const drawStartRectangles = () => {
    graphics.fillStyle(color1, 1);
    graphics.fillRect(0, 0, config.width, config.height);
  };

  const fractalize = (lines, randomProportions = false) => {
    const newLines = [];
    lines.forEach((line, idx) => {
      let x = line.startX;
      let y = line.startY;
      const width = line.endX - line.startX;
      const height = line.endY - line.startY;
      const subLines = [];
      for (let index = 0; index < 5; ++index) {
        const newX = x + width / 5;
        const newY = y + height / 5;
        subLines.push({ startX: x, startY: y, endX: newX, endY: newY });
        x = newX;
        y = newY;
      }
      injectFractalSeed(subLines);
      newLines.push(...subLines);
    });
    return newLines;
  };

  const injectFractalSeed = (subLines) => {
    let firstLine = subLines[1];
    let secondLine = subLines[3];
    const xDiff = firstLine.endX - firstLine.startX;
    const yDiff = firstLine.endY - firstLine.startY;
    let firstInjection = [];
    let secondInjection = [];
    if (xDiff) {
      _pushNewLines(firstInjection, firstLine, {
        startX: firstLine.startX,
        startY: firstLine.startY - xDiff,
        endX: firstLine.endX,
        endY: firstLine.startY - xDiff,
      });
      _pushNewLines(secondInjection, secondLine, {
        startX: secondLine.startX,
        startY: secondLine.startY + xDiff,
        endX: secondLine.endX,
        endY: secondLine.startY + xDiff,
      });
    } else {
      _pushNewLines(firstInjection, firstLine, {
        startX: firstLine.startX + yDiff,
        startY: firstLine.startY,
        endX: firstLine.startX + yDiff,
        endY: firstLine.endY,
      });
      _pushNewLines(secondInjection, secondLine, {
        startX: secondLine.startX - yDiff,
        startY: secondLine.startY,
        endX: secondLine.startX - yDiff,
        endY: secondLine.endY,
      });
    }
    subLines.splice(1, 1, ...firstInjection);
    subLines.splice(5, 1, ...secondInjection);
  };

  const _pushNewLines = (injection, prevLine, mediumnNewLine) => {
    injection.push({
      startX: prevLine.startX,
      startY: prevLine.startY,
      endX: mediumnNewLine.startX,
      endY: mediumnNewLine.startY,
    });
    injection.push({
      startX: mediumnNewLine.startX,
      startY: mediumnNewLine.startY,
      endX: mediumnNewLine.endX,
      endY: mediumnNewLine.endY,
    });
    injection.push({
      startX: mediumnNewLine.endX,
      startY: mediumnNewLine.endY,
      endX: prevLine.endX,
      endY: prevLine.endY,
    });
  };

  const drawFractal = (lines) => {
    graphics.fillStyle(color2, 1.0);
    graphics.beginPath();
    graphics.moveTo(lines[0].startX, lines[0].startY);
    lines.forEach((line) => {
      graphics.lineTo(line.endX, line.endY);
    });
    graphics.lineTo(config.width, config.height);
    graphics.lineTo(0, config.height);
    graphics.lineTo(0, config.height / 2);
    graphics.closePath();
    graphics.strokePath();
    graphics.fillPath();
  };

  const draw = (iterations) => {
    drawStartRectangles();
    for (let iteration = iterations; iteration > 0; --iteration) {
      lines = fractalize(lines);
    }
    drawFractal(lines);
  };

  const redraw = (increment = false) => {
    graphics.destroy();
    graphics = this.add.graphics();
    if (increment) {
      iterations++;
      if (iterations > maxIterations) iterations = 0;
    }
    lines = [initLine];
    draw(iterations);
  };

  draw(iterations);
  this.input.on("pointerdown", () => redraw(true));
  colorPicker1.onchange = () => {
    color1 = parseInt(colorPicker1.value.slice(1), 16);
    console.log(color1);
    redraw();
  };
  colorPicker2.onchange = () => {
    color2 = parseInt(colorPicker2.value.slice(1), 16);
    redraw();
  };
}
