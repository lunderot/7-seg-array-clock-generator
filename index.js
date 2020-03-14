window.onload = () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const maskSingle = document.getElementById("mask-single");

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
  canvas.width = 3000;
  canvas.height = 1140;
  drawSamples(ctx, samples);
};

const drawSamples = (ctx, samples) => {
  ctx.fillStyle = "red";
  for (let i = 0; i < 6 * 4; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.setTransform(1, 0, 0, 1, i * 126, j * 190);
      samples.map(digit =>
        digit.map(({ x, y }) => {
          ctx.fillRect(x, y, 10, 10);
        })
      );
    }
  }
};
