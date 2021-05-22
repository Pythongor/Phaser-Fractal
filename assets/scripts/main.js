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
const startPoint = { x: 0, y: config.height / 2 };
const endPoint = { x: config.width, y: config.height / 2 };
const maxIterations = 5;
let iterations = 0;

let points = [startPoint, endPoint];
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

  const fractalize = (points) => {
    const newPoints = [];
    points.slice(1).forEach((point, idx) => {
      let x = points[idx].x;
      let y = points[idx].y;
      const width = point.x - x;
      const height = point.y - y;
      const subPoints = [];
      for (let index = 0; index < 4; ++index) {
        const newX = x + width / 5;
        const newY = y + height / 5;
        subPoints.push({ x: newX, y: newY });
        x = newX;
        y = newY;
      }
      subPoints.push(point);
      injectFractalSeed(subPoints);
      newPoints.push(...subPoints);
    });
    // console.log(newPoints);
    return newPoints;
  };

  const injectFractalSeed = (subPoints) => {
    console.log(subPoints);
    const xDiff1 = subPoints[2].x - subPoints[1].x;
    const yDiff1 = subPoints[2].y - subPoints[1].y;
    const xDiff2 = subPoints[4].x - subPoints[3].x;
    const yDiff2 = subPoints[4].y - subPoints[3].y;
    let firstInjection = [];
    let secondInjection = [];
    firstInjection.push({
      x: subPoints[1].x + yDiff1,
      y: subPoints[1].y - xDiff1,
    });
    firstInjection.push({
      x: subPoints[2].x + yDiff1,
      y: subPoints[2].y - xDiff1,
    });
    secondInjection.push({
      x: subPoints[3].x - yDiff2,
      y: subPoints[3].y + xDiff2,
    });
    secondInjection.push({
      x: subPoints[4].x - yDiff2,
      y: subPoints[4].y + xDiff2,
    });
    subPoints.splice(1, 0, ...firstInjection);
    subPoints.splice(5, 0, ...secondInjection);
  };
  //   let firstLine = subLines[1];
  //   let secondLine = subLines[3];
  //   const xDiff = firstLine.endX - firstLine.startX;
  //   const yDiff = firstLine.endY - firstLine.startY;
  //   let firstInjection = [];
  //   let secondInjection = [];
  //   if (xDiff) {
  //     _pushNewLines(firstInjection, firstLine, {
  //       startX: firstLine.startX,
  //       startY: firstLine.startY - xDiff,
  //       endX: firstLine.endX,
  //       endY: firstLine.startY - xDiff,
  //     });
  //     _pushNewLines(secondInjection, secondLine, {
  //       startX: secondLine.startX,
  //       startY: secondLine.startY + xDiff,
  //       endX: secondLine.endX,
  //       endY: secondLine.startY + xDiff,
  //     });
  //   } else {
  //     _pushNewLines(firstInjection, firstLine, {
  //       startX: firstLine.startX + yDiff,
  //       startY: firstLine.startY,
  //       endX: firstLine.startX + yDiff,
  //       endY: firstLine.endY,
  //     });
  //     _pushNewLines(secondInjection, secondLine, {
  //       startX: secondLine.startX - yDiff,
  //       startY: secondLine.startY,
  //       endX: secondLine.startX - yDiff,
  //       endY: secondLine.endY,
  //     });
  //   }
  //   subLines.splice(1, 1, ...firstInjection);
  //   subLines.splice(5, 1, ...secondInjection);
  // };

  // const _pushNewLines = (injection, prevLine, mediumnNewLine) => {
  //   injection.push({
  //     startX: prevLine.startX,
  //     startY: prevLine.startY,
  //     endX: mediumnNewLine.startX,
  //     endY: mediumnNewLine.startY,
  //   });
  //   injection.push({
  //     startX: mediumnNewLine.startX,
  //     startY: mediumnNewLine.startY,
  //     endX: mediumnNewLine.endX,
  //     endY: mediumnNewLine.endY,
  //   });
  //   injection.push({
  //     startX: mediumnNewLine.endX,
  //     startY: mediumnNewLine.endY,
  //     endX: prevLine.endX,
  //     endY: prevLine.endY,
  //   });
  // };

  const drawFractal = (points) => {
    graphics.fillStyle(color2, 1.0);
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => {
      graphics.lineTo(point.x, point.y);
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
      points = fractalize(points);
    }
    drawFractal(points);
  };

  const redraw = (increment = false) => {
    graphics.destroy();
    graphics = this.add.graphics();
    if (increment) {
      iterations++;
      if (iterations > maxIterations) iterations = 0;
    }
    points = [startPoint, endPoint];
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
