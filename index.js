const samples = [
  [
    //G
    { x: 32, y: 93 },
    { x: 49, y: 93 },
    { x: 66, y: 93 },
  ],
  [
    //F
    { x: 26, y: 40 },
    { x: 23, y: 60 },
    { x: 20, y: 80 },
  ],
  [
    //E
    { x: 16, y: 110 },
    { x: 13, y: 130 },
    { x: 10, y: 150 },
  ],
  [
    //D
    { x: 28, y: 151 },
    { x: 43, y: 151 },
    { x: 57, y: 151 },
  ],
  [
    //C
    { x: 77, y: 110 },
    { x: 74, y: 130 },
    { x: 71, y: 150 },
  ],
  [
    //B
    { x: 87, y: 40 },
    { x: 84, y: 60 },
    { x: 81, y: 80 },
  ],
  [
    //A
    { x: 42, y: 36 },
    { x: 57, y: 36 },
    { x: 71, y: 36 },
  ],
  [
    //DP
    { x: 90, y: 151 },
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
    outputText.value = generate(hiddenCtx, samples, hiddenCanvas, 30);
  };

  window.requestAnimationFrame(drawWrapper(ctx, canvas));
};

const generate = (ctx, samples, canvas, steps) => {
  let array = [];
  for (let s = 0; s < steps; s++) {
    draw(ctx, s / steps);
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 6 * 4; i++) {
        const offset = { x: i * 126, y: j * 190 };
        array.push(sampleDigit(image.data, samples, offset, image.width));
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
    }, "uint8_t pattern[] = {") +
    "};\n#define NUM_FRAMES " +
    steps.toString()
  );
};

const sampleImageData = (image, x, y, canvasWidth) => {
  return image[(y * canvasWidth + x) * 4];
};

const sampleSegment = (image, segment, offset, canvasWidth) => {
  const a = segment.map((samplePoint) =>
    sampleImageData(
      image,
      samplePoint.x + offset.x + 5,
      samplePoint.y + offset.y + 5,
      canvasWidth
    )
  );
  return a.reduce((prev, curr) => prev + curr) / a.length > 128;
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
  //drawSamples(ctx, samples);
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
  const a = 400;
  ctx.translate(0, t * (Math.sqrt(2) * 2 * a));
  ctx.rotate((45 * Math.PI) / 180);
  ctx.translate(-2000, 0);
  for (let i = 0; i < 100; i++) {
    ctx.translate(a * 2, 0);
    ctx.fillRect(0, -10000, a, 100000);
  }
};

const debugEffect = (ctx, t) => {
  ctx.fillStyle = "black";
  ctx.translate(-1260 + t * 126 * 2 * 0, 0);
  for (let i = 0; i < 100; i++) {
    ctx.translate(126 * 2, 0);
    ctx.fillRect(0, -10000, 126, 100000);
  }
};

const drawSamples = (ctx, samples) => {
  ctx.fillStyle = "red";
  for (let j = 0; j < 6; j++) {
    for (let i = 0; i < 6 * 4; i++) {
      ctx.setTransform(1, 0, 0, 1, i * 126, j * 190);
      samples.map((digit) =>
        digit.map(({ x, y }) => {
          ctx.fillRect(x, y, 10, 10);
        })
      );
    }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};
