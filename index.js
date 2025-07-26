const crash = new Audio("crash.mp3");
const hiss = new Audio("hiss.mp3");
hiss.loop = true;
const swallow = new Audio("swallow.mp3");
let headingElement = document.getElementById('heading')
let total_row = getComputedStyle(document.documentElement).getPropertyValue(
  "--grid-rows"
);
let total_col = getComputedStyle(document.documentElement).getPropertyValue(
  "--grid-columns"
);
total_col = Number(total_col);
total_row = Number(total_row);
let score = 0;
let highscore = 0;

let food = {
  x: Math.ceil(Math.random() * total_col),
  y: Math.ceil(Math.random() * total_row),
};

let snake = [
  {
    x: Math.ceil(Math.random() * total_col),
    y: Math.ceil(Math.random() * total_row),
  },
];
let velocity = { x: 0, y: 0 };

let lastPaintTime = 0;
let speed = 3;
let speedElement = document.getElementById("speed");
let scoreElement = document.getElementById("score");
let highscoreElement = document.getElementById("highscore");
let timeElement = document.getElementById("time");
let minute = 0;
let second = 0;
speedElement.innerHTML = `Speed ${speed}`;
highscoreElement.innerHTML = `HighScore ${highscore}`;

setTimeout(()=> hiss.play(),1000*10)

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
  console.log(ctime);
  lastPaintTime = ctime;
  GameEngine();
}
let gameOver = false;
function GameEngine() {
  borderCollide();
  eatFood();

  collision();

  for (let i = snake.length - 2; i >= 0; i--) {
    snake[i + 1] = { ...snake[i] };
  }
  snake[0].x += velocity.x;
  snake[0].y += velocity.y;

  board.innerHTML = "";
  // Display food
  let foodElement = document.createElement("div");
  foodElement.classList.add("food");
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  board.appendChild(foodElement);

  //   Display snake
  snake.forEach((snakeBody, index) => {
    let snakeElement = document.createElement("div");
    if (index == 0) snakeElement.classList.add("snake-head");
    else snakeElement.classList.add("snake-body");
    snakeElement.style.gridColumnStart = snakeBody.x;
    snakeElement.style.gridRowStart = snakeBody.y;
    board.appendChild(snakeElement);
  });
}

function borderCollide() {
  let snakeHead = snake[0];
  if (snakeHead.x < 1) snakeHead.x = total_col;
  if (snakeHead.x > total_col) snakeHead.x = 1;
  if (snakeHead.y < 1) snakeHead.y = total_row;
  if (snakeHead.y > total_row) snakeHead.y = 1;
}

function eatFood() {
  let snakeHead = snake[0];
  if (snakeHead.x == food.x && snakeHead.y == food.y) {
    swallow.play();
    speed += 1;
    speedElement.innerHTML = `Speed ${speed}`;
    console.log(speed);
    newBodyPart = { x: snakeHead.x + velocity.x, y: snakeHead.y + velocity.y };
    snake.unshift(newBodyPart);
    score += 5;
    scoreElement.innerHTML = `Score ${score}`;
    if (score > highscore) {
      highscore = score;
      highscoreElement.innerHTML = `HighScore ${highscore}`;
    }
    food.x = Math.ceil(Math.random() * total_col);
    food.y = Math.ceil(Math.random() * total_row);
  }
}

function resetGame() {
  alert(
    `Game Over\nYour Score = ${score}\nYour Time = ${minute} Minutes ${second} seconds\nHighScore = ${highscore}`
  );
  hiss.play();
  snake = [
    {
      x: Math.ceil(Math.random() * total_col),
      y: Math.ceil(Math.random() * total_row),
    },
  ];
  velocity = { x: 0, y: 0 };
  lastPaintTime = 0;
  score = 0;
  speed = 3;
  speedElement.innerHTNL = `Speed ${speed}`;
  scoreElement.innerHTML = `Score ${score}`;
  headingElement.innerHTML = 'Welcome to Snake Game'
  second = 0;
  minute = 0;
}
function collision() {
  for (let i = 1; i < snake.length; i++)
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      console.log("Game Over");
      hiss.pause();
      crash.play();
      resetGame();
    }
}

window.requestAnimationFrame(main);
// hiss.play()

window.addEventListener("keydown", (event) => {
  // start = Math.floor(Math.random()*2)
  // if(start)
  // velocity.x = 1
  // else
  // velocity.y = 1
  if (event.key == "ArrowUp"){
  velocity = { x: 0, y: -1 };
  headingElement.innerHTML = 'Moving Upward <i class="fa-solid fa-arrow-up"></i>'
  }
  if (event.key == "ArrowDown") {
  velocity = { x: 0, y: 1 };
  headingElement.innerHTML = 'Moving Downward <i class="fa-solid fa-arrow-down"></i>'
  }
  if (event.key == "ArrowLeft") {
  velocity = { x: -1, y: 0 };
  headingElement.innerHTML = 'Moving Left <i class="fa-solid fa-arrow-left">'
  }
  if (event.key == "ArrowRight") {
  velocity = { x: 1, y: 0 };
  headingElement.innerHTML = 'Moving Right <i class="fa-solid fa-arrow-right-long animate"></i>'
  }
});

up = document.getElementById("up");
up.addEventListener("click", () => {
  velocity = { x: 0, y: -1 };
  headingElement.innerHTML = 'Moving Upward <i class="fa-solid fa-arrow-up"></i>'
});

down = document.getElementById("down");
down.addEventListener("click", () => {
  velocity = { x: 0, y: 1 };
  headingElement.innerHTML = 'Moving Downward <i class="fa-solid fa-arrow-down"></i>'
});

left = document.getElementById("left");
left.addEventListener("click", () => {
  velocity = { x: -1, y: 0 };
  headingElement.innerHTML = 'Moving Left <i class="fa-solid fa-arrow-left">'
});

right = document.getElementById("right");
right.addEventListener("click", () => {
  velocity = { x: 1, y: 0 };
  headingElement.innerHTML = 'Moving Right <i class="fa-solid fa-arrow-right-long animate"></i>'
});

setInterval(() => {
  second += 1;
  timeElement.innerHTML = `Time ${minute}:${second}`;
  if (second == 59) {
    second = 0;
    minute += 1;
  }
}, 1000);
