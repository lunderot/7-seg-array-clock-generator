const samples = [
  [
    //A
    { x: 52, y: 36 },
    { x: 67, y: 36 },
    { x: 81, y: 36 }
  ],
  [
    //B
    { x: 97, y: 40 },
    { x: 94, y: 60 },
    { x: 91, y: 80 }
  ],
  [
    //C
    { x: 87, y: 110 },
    { x: 84, y: 130 },
    { x: 81, y: 150 }
  ],
  [
    //D
    { x: 38, y: 151 },
    { x: 53, y: 151 },
    { x: 67, y: 151 }
  ],
  [
    //E
    { x: 26, y: 110 },
    { x: 23, y: 130 },
    { x: 20, y: 150 }
  ],
  [
    //F
    { x: 36, y: 40 },
    { x: 33, y: 60 },
    { x: 30, y: 80 }
  ],
  [
    //G
    { x: 42, y: 93 },
    { x: 59, y: 93 },
    { x: 76, y: 93 }
  ],
  [
    //DP
    { x: 100, y: 151 }
  ]
];

window.onload = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const maskSingle = document.getElementById("mask-single");

  canvas.width = 3000;
  canvas.height = 1140;
  window.requestAnimationFrame(draw(ctx, canvas));
};

const draw = (ctx, canvas) => timestamp => {
  ctx.fillStyle = "white";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stripeEffect(ctx, timestamp);

  //drawSamples(ctx, samples);
  window.requestAnimationFrame(draw(ctx, canvas));
};

const stripeEffect = (ctx, timestamp) => {
  const speed = 0.1;
  ctx.fillStyle = "black";
  ctx.translate(0, (timestamp * speed) % (Math.sqrt(2)*2*100));
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
      samples.map(digit =>
        digit.map(({ x, y }) => {
          ctx.fillRect(x, y, 10, 10);
        })
      );
    }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
};
