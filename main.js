let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false
};

peep = {
  height: 32,
  jumping: true,
  width: 32,
  x: 320,
  xv: 0,
  y: 200,
  yv: 0,
  alive: true,
  platon: 310
};

platfs = [
  {
    xs: 310,
    xe: 380,
    y: 270
  }
];

if (!localStorage.highScore) {
  localStorage.highScore = 0;
}
highScore = localStorage.highScore;

score = 0;
clock = 0;

const p = new Path2D(
  "M14 12 L14 6 C22 0 50 0 32 28 L38 30 L50 18 L54 22 L36 38 L46 56 L40 56 L24 36 L16 56 L10 56 L14 30 L2 22 L4 18 L16 22 L16 16 L14 14 M22 12 C22 18 24 12 18 12"
);
const p1 = new Path2D(
  "M14 12 L14 6 C22 0 50 0 32 28 L38 30 L50 30 L50 36 L36 38 L32 56 L26 56 L24 36 L24 56 L18 56 L14 30 L2 22 L4 18 L16 22 L16 16 L14 14 M22 12 C22 18 24 12 18 12"
);
const p2 = new Path2D(
  "M14 12 L14 6 C22 0 50 0 32 28 L38 30 L50 22 L50 30 L36 38 L24 58 L18 56 L24 36 L38 52 L36 58 L14 30 L2 26 L4 20 L16 22 L16 16 L14 14 M22 12 C22 18 24 12 18 12"
);

const glide = new Path2D(
  "M24 18 L20 22 L16 18 L10 22 L8 12 L10 6 L44 0 L6 4 L2 4 L4 14 L2 28 L10 28 L20 26 L20 34 L6 48 L10 56 L26 38 L28 38 L50 54 L56 48 L34 30 L60 28 L60 22 L54 12 L56 6 L52 0 L2 0 L2 4 L50 6 L50 22 L42 18 L34 22 L38 16 L38 10 L34 6 L28 4 L24 6 L20 10 L20 16 Z"
);

ctx.translate(peep.x, peep.y);
ctx.fill(p);
let moves = [p, p1, p2, p1];

let move = 1;

document.onkeydown = e => {
  let kc = e.keyCode;
  if (kc === 82) {
    window.location.reload();
  }
  // e.preventDefault();
  if (kc === 37) keys.left = true;
  else if (kc === 38) keys.up = true;
  else if (kc === 39) keys.right = true;
  else if (kc === 40) keys.down = true;
  else if (kc === 32) keys.space = true;
};

document.onkeyup = e => {
  let kc = e.keyCode;
  e.preventDefault();
  if (kc === 37) keys.left = false;
  else if (kc === 38) keys.up = false;
  else if (kc === 39) keys.right = false;
  else if (kc === 40) keys.down = false;
  else if (kc === 32) keys.space = false;
};

function init() {
  for (let x = 0; x < 6; x++) {
    let ranPos = getRandomPlatformPos();
    platfs.push(ranPos);
  }
}

init();

function loop() {
  clock++;
  if (clock % 50 === 0) {
    let newpos = getRandomPlatformPos();
    newpos.y = 0;
    platfs.push(newpos);
  }
  if (keys.up && !peep.jumping) {
    peep.yv -= 30;
    peep.jumping = true;
  }
  if (keys.right) {
    peep.xv += 0.5;
  }
  if (keys.left) {
    peep.xv -= 0.5;
  }

  platfs.forEach((plat, index) => {
    plat.y += 1;
    if (plat.y > 600) {
      platfs.splice(index, 1);
    }
  });

  if (keys.space && peep.yv > 1.2) {
    peep.yv += 0.2;
  } else {
    peep.yv += 1.2;
  }

  peep.y += peep.yv;
  peep.x += peep.xv;
  peep.yv *= 0.95;
  peep.xv *= 0.95;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (peep.alive) {
    draw();
  } else {
    if (score > localStorage.highScore) {
      localStorage.highScore = score;
    }
    drawGameOver();
  }

  // old floor:

  // if (peep.y > 544) {
  //   peep.yv = 0;
  //   peep.y = 544;
  //   peep.jumping = false;
  // }

  if (peep.y > 600) {
    peep.alive = false;
    peep.jumping = false;
  }

  platfs.forEach(plat => {
    if (collision(plat)) {
      peep.yv = 0;
      peep.y = plat.y - 58;
      peep.jumping = false;
      if (peep.platon !== plat.xs) {
        peep.platon = plat.xs;
        score++;
      }
    }
  });

  if (peep.x < -10) {
    peep.x = 790;
  } else if (peep.x > 790) {
    peep.x = -10;
  }
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function getRandomPlatformPos() {
  let xs = Math.floor(Math.random() * 720);
  let xe = xs + Math.floor(Math.random() * 40) + 40;
  return {
    xs: xs,
    xe: xe,
    y: Math.floor(Math.random() * 290)
  };
}

function drawSurface({ xs: xs, xe: xe, y: y }) {
  ctx.moveTo(xs, y);
  ctx.lineTo(xe, y);
  ctx.stroke();
}

function collision({ xs: xs, xe: xe, y: y }) {
  return (
    peep.yv >= 0 &&
    peep.y <= y - 50 &&
    peep.y > y - 80 &&
    peep.x > xs - 30 &&
    peep.x < xe - 15
  );
}

function draw() {
  ctx.font = "30px Arial";
  ctx.strokeText("Score: " + score, 650, 35);
  ctx.font = "18px Arial";
  ctx.strokeText("HighScore: " + highScore, 655, 70);
  ctx.beginPath();
  platfs.forEach(plat => {
    drawSurface(plat);
  });
  ctx.stroke();
  if (peep.xv !== 0 && !peep.jumping) {
    if (Math.abs(peep.xv) < 0.4) {
      peep.xv = 0;
    }
    if (move < 4) {
      ctx.translate(peep.x, peep.y);
      ctx.fill;
      ctx.fill(moves[move]);
      move++;
    } else {
      move = 0;
      ctx.translate(peep.x, peep.y);
      ctx.fill(moves[move]);
      move++;
    }
  } else {
    if (keys.space && peep.yv > 1.2) {
      ctx.translate(peep.x, peep.y);
      ctx.fill(glide);
    } else {
      ctx.translate(peep.x, peep.y);
      ctx.fill(moves[1]);
    }
  }
}

function drawGameOver() {
  ctx.font = "30px Arial";
  ctx.strokeText("Game Over", 320, 300);
}
