const samples = [
  [
    //A
    { x: 52, y: 36 },
    { x: 67, y: 36 },
    { x: 81, y: 36 },
  ],
  [
    //B
    { x: 97, y: 40 },
    { x: 94, y: 60 },
    { x: 91, y: 80 },
  ],
  [
    //C
    { x: 87, y: 110 },
    { x: 84, y: 130 },
    { x: 81, y: 150 },
  ],
  [
    //D
    { x: 38, y: 151 },
    { x: 53, y: 151 },
    { x: 67, y: 151 },
  ],
  [
    //E
    { x: 26, y: 110 },
    { x: 23, y: 130 },
    { x: 20, y: 150 },
  ],
  [
    //F
    { x: 36, y: 40 },
    { x: 33, y: 60 },
    { x: 30, y: 80 },
  ],
  [
    //G
    { x: 42, y: 93 },
    { x: 59, y: 93 },
    { x: 76, y: 93 },
  ],
  [
    //DP
    { x: 100, y: 151 },
  ],
];

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const hiddenCanvas = document.getElementById("canvash");
  const hiddenCtx = hiddenCanvas.getContext("2d");
  hiddenCanvas.width = 3000;
  hiddenCanvas.height = 1140;
  canvas.width = 3000;
  canvas.height = 1140;

  const generateButton = document.getElementById("generate");
  const outputText = document.getElementById("output");
  generateButton.onclick = () => {
    outputText.value = generate(hiddenCtx, samples, hiddenCanvas, 60);
  };

  window.requestAnimationFrame(drawWrapper(ctx, canvas));
};

const generate = (ctx, samples, canvas, steps) => {
  let array = [];
  for (let s = 0; s < steps; s++) {
    draw(ctx, s / steps);
    const image = ctx.getImageData(0, 0, canvas.height, canvas.width).data;
    for (let i = 0; i < 6 * 4; i++) {
      for (let j = 0; j < 6; j++) {
        const offset = { x: i * 126 - 10, y: j * 190 };
        array.push(sampleDigit(image, samples, offset, canvas.width));
      }
    }
  }
  return (
    array.reduce((p, c, i) => {
      const value = c.toString(16).padStart(2, "0").toUpperCase();
      const addNewline = i % (6 * 4 * 6) == 0;
      return (
        p +
        `0x${value}${i < array.length - 1 ? "," : ""}${addNewline ? "\n" : ""}`
      );
    }, "byte pattern[] = {") + "};"
  );
};

const sampleImageData = (image, x, y, canvasWidth) =>
  image[y * (canvasWidth * 4) + x * 4];

const sampleSegment = (image, segment, offset, canvasWidth) => {
  const a = segment.map((samplePoint) =>
    sampleImageData(
      image,
      samplePoint.x + offset.x + 5,
      samplePoint.y + offset.y + 5,
      canvasWidth
    )
  );
  return a.reduce((prev, curr) => prev + curr) > 128;
};

const sampleDigit = (image, samples, offset, canvasWidth) =>
  samples.reduce(
    (prev, curr, index) =>
      prev | (sampleSegment(image, curr, offset, canvasWidth) << index),
    0
  );

const drawWrapper = (ctx) => (timestamp) => {
  const t = (timestamp % 1000.0) / 1000.0;
  draw(ctx, t);
  drawSamples(ctx, samples);
  anim = window.requestAnimationFrame(drawWrapper(ctx));
};

const draw = (ctx, t) => {
  ctx.fillStyle = "white";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillRect(0, 0, 10000, 10000);
  stripeEffect(ctx, t);
};

const stripeEffect = (ctx, t) => {
  ctx.fillStyle = "black";
  ctx.translate(0, t * (Math.sqrt(2) * 2 * 100));
  ctx.rotate((45 * Math.PI) / 180);
  ctx.translate(-2000, 0);
  for (let i = 0; i < 100; i++) {
    ctx.translate(200, 0);
    ctx.fillRect(0, -10000, 100, 100000);
  }
};

const drawSamples = (ctx, samples) => {
  ctx.fillStyle = "red";
  for (let i = 0; i < 6 * 4; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.setTransform(1, 0, 0, 1, i * 126 - 10, j * 190);
      samples.map((digit) =>
        digit.map(({ x, y }) => {
          ctx.fillRect(x, y, 10, 10);
        })
      );
    }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};
