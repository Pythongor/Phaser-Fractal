const config = {
  width: 4000,
  height: 2000,
  type: Phaser.AUTO,
  scene: {
    create: create,
  },
};
const game = new Phaser.Game(config);

const frConf = {
  startPoint: { x: 0, y: config.height / 2 },
  endPoint: { x: config.width, y: config.height / 2 },
  maxIterations: 4,
  color1: 0xffff00,
  color2: 0x550055,
  firstInjectionIndex: 1,
  secondInjectionIndex: 5,
};

let iterations = 0;
let points = [frConf.startPoint, frConf.endPoint];

const colorPicker1 = document.getElementById("colorPicker1");
const colorPicker2 = document.getElementById("colorPicker2");
colorPicker1.value = `#${frConf.color1.toString(16)}`;
colorPicker2.value = `#${frConf.color2.toString(16)}`;

const inj1 = document.getElementById("inj1");
const inj2 = document.getElementById("inj2");
inj1.value = frConf.firstInjectionIndex;
inj2.value = frConf.secondInjectionIndex;

function create() {
  let graphics = this.add.graphics();

  const drawStartRectangles = () => {
    graphics.fillStyle(frConf.color1, 1);
    graphics.fillRect(0, 0, config.width, config.height);
  };

  const fractalize = (points) => {
    const newPoints = [];
    points.slice(1).forEach((point, idx) => {
      let x = points[idx].x;
      let y = points[idx].y;
      const width = point.x - x;
      const height = point.y - y;
      let subPoints = [];
      [1, 2, 3, 4].forEach((index) => {
        subPoints.push({
          x: x + (width / 5) * index,
          y: y + (height / 5) * index,
        });
      });
      subPoints.push(point);
      subPoints = injectFractalSeed(subPoints);
      newPoints.push(points[idx], ...subPoints);
    });
    console.log(newPoints);
    return newPoints;
  };

  getSeed = () => {
    const seed = [];
    for (let i = 0; i < 4; i++) {
      seed.push(Math.random() * 5);
    }
    return seed.sort();
  };

  const injectFractalSeed = (subPoints) => {
    console.log(subPoints);
    const newSubPoints = subPoints.slice();
    const xDiff1 = subPoints[1].x - subPoints[0].x;
    const yDiff1 = subPoints[1].y - subPoints[0].y;
    const xDiff2 = subPoints[3].x - subPoints[2].x;
    const yDiff2 = subPoints[3].y - subPoints[2].y;
    let firstInjection = [
      {
        x: subPoints[0].x + yDiff1,
        y: subPoints[0].y - xDiff1,
      },
      {
        x: subPoints[1].x + yDiff1,
        y: subPoints[1].y - xDiff1,
      },
    ];
    let secondInjection = [
      {
        x: subPoints[2].x - yDiff2,
        y: subPoints[2].y + xDiff2,
      },
      {
        x: subPoints[3].x - yDiff2,
        y: subPoints[3].y + xDiff2,
      },
    ];
    newSubPoints.splice(frConf.firstInjectionIndex, 0, ...firstInjection);
    newSubPoints.splice(frConf.secondInjectionIndex, 0, ...secondInjection);
    return newSubPoints;
  };

  const drawFractal = (points) => {
    graphics.fillStyle(frConf.color2, 1.0);
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
      if (iterations > frConf.maxIterations) iterations = 0;
    }
    points = [frConf.startPoint, frConf.endPoint];
    draw(iterations);
  };

  draw(iterations);
  this.input.on("pointerdown", () => redraw(true));
  colorPicker1.onchange = () => {
    frConf.color1 = parseInt(colorPicker1.value.slice(1), 16);
    redraw();
  };
  colorPicker2.onchange = () => {
    frConf.color2 = parseInt(colorPicker2.value.slice(1), 16);
    redraw();
  };
  inj1.onchange = () => {
    frConf.firstInjectionIndex = +inj1.value;
    redraw();
  };
  inj2.onchange = () => {
    frConf.secondInjectionIndex = +inj2.value;
    redraw();
  };
}
