let gameRunning = false;

const crash = new Audio("crash.mp3");
const hiss = new Audio("hiss.mp3");
hiss.loop = true;
const swallow = new Audio("swallow.mp3");

let headingElement = document.getElementById("heading");
let total_row = Number(getComputedStyle(document.documentElement).getPropertyValue("--grid-rows"));
let total_col = Number(getComputedStyle(document.documentElement).getPropertyValue("--grid-columns"));

let score = 0;
let highscore = 0;
let speed = 3;
let minute = 0;
let second = 0;
let lastPaintTime = 0;
let velocity = { x: 0, y: 0 };
let level = 1;
let obstacles = [];

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

// DOM Elements
let board = document.getElementById("board");
let speedElement = document.getElementById("speed");
let scoreElement = document.getElementById("score");
let highscoreElement = document.getElementById("highscore");
let timeElement = document.getElementById("time");
let levelSelect = document.getElementById("levelSelect");

speedElement.innerHTML = `Speed ${speed}`;
highscoreElement.innerHTML = `HighScore ${highscore}`;
setTimeout(() => hiss.play(), 10000);

// LEVEL SYSTEM
levelSelect.addEventListener("change", (e) => {
  level = parseInt(e.target.value);
  updateLevelSettings();
});

function updateLevelSettings() {
  switch (level) {
    case 1:
      speed = 3;
      obstacles = [];
      break;
    case 2:
      speed = 5;
      generateObstacles(5);
      break;
    case 3:
      speed = 7;
      generateObstacles(10);
      break;
  }
  speedElement.innerHTML = `Speed ${speed}`;
  if (gameRunning) alert(`Level changed to ${level}. Restart game to apply changes.`);
}

function generateObstacles(count) {
  obstacles = [];
  while (obstacles.length < count) {
    let x = Math.ceil(Math.random() * total_col);
    let y = Math.ceil(Math.random() * total_row);
    if (
      !snake.some(seg => seg.x === x && seg.y === y) &&
      (food.x !== x || food.y !== y)
    ) {
      obstacles.push({ x, y });
    }
  }
}

function drawObstacles() {
  obstacles.forEach(obs => {
    const el = document.createElement("div");
    el.style.gridRowStart = obs.y;
    el.style.gridColumnStart = obs.x;
    el.classList.add("obstacle");
    board.appendChild(el);
  });
}

function checkObstacleCollision(head) {
  return obstacles.some(obs => obs.x === head.x && obs.y === head.y);
}

// MAIN GAME LOOP
function main(ctime) {
  if (!gameRunning) return;
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = ctime;
  GameEngine();
}

// GAME ENGINE
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

  if (checkObstacleCollision(snake[0])) {
    crash.play();
    hiss.pause();
    resetGame("You hit an obstacle!");
    return;
  }

  drawObstacles();

  const foodElement = document.createElement("div");
  foodElement.classList.add("food");
  foodElement.style.gridColumnStart = food.x;
  foodElement.style.gridRowStart = food.y;
  board.appendChild(foodElement);

  snake.forEach((snakeBody, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.classList.add(index === 0 ? "snake-head" : "snake-body");
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
  if (snakeHead.x === food.x && snakeHead.y === food.y) {
    swallow.play();
    speed++;
    speedElement.innerHTML = `Speed ${speed}`;
    const newPart = { x: snakeHead.x + velocity.x, y: snakeHead.y + velocity.y };
    snake.unshift(newPart);
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

function resetGame(reason = "Game Over") {
  alert(`${reason}\nYour Score = ${score}\nYour Time = ${minute} Minutes ${second} seconds\nHighScore = ${highscore}`);
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
  second = 0;
  minute = 0;
  gameRunning = false;
  updateLevelSettings(); // Reset obstacles and speed for selected level
  speedElement.innerHTML = `Speed ${speed}`;
  scoreElement.innerHTML = `Score ${score}`;
  headingElement.innerHTML = "Welcome to Snake Game";
}

function collision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      crash.play();
      hiss.pause();
      resetGame("Snake bit itself!");
    }
  }
}

// BUTTONS & EVENTS
document.getElementById("startGame").addEventListener("click", () => {
  if (!gameRunning) {
    gameRunning = true;
    headingElement.innerHTML = "🚀 Game Started!";
    lastPaintTime = 0;
    updateLevelSettings();
    window.requestAnimationFrame(main);
    hiss.play();
  }
});

document.getElementById("stopGame").addEventListener("click", () => {
  if (gameRunning) {
    gameRunning = false;
    headingElement.innerHTML = "⏸️ Game Paused";
    hiss.pause();
  }
});

document.getElementById("levelCheck").addEventListener("click", () => {
  const level = document.getElementById("levelSelect").value;
  alert(`🎯 Selected Level: ${level}`);
});

// KEYBOARD CONTROL
window.addEventListener("keydown", (event) => {
  if (!gameRunning) return;
  if (event.key === "ArrowUp") {
    velocity = { x: 0, y: -1 };
    headingElement.innerHTML = 'Moving Upward <i class="fa-solid fa-arrow-up"></i>';
  }
  if (event.key === "ArrowDown") {
    velocity = { x: 0, y: 1 };
    headingElement.innerHTML = 'Moving Downward <i class="fa-solid fa-arrow-down"></i>';
  }
  if (event.key === "ArrowLeft") {
    velocity = { x: -1, y: 0 };
    headingElement.innerHTML = 'Moving Left <i class="fa-solid fa-arrow-left"></i>';
  }
  if (event.key === "ArrowRight") {
    velocity = { x: 1, y: 0 };
    headingElement.innerHTML = 'Moving Right <i class="fa-solid fa-arrow-right-long animate"></i>';
  }
});

// TOUCH BUTTON CONTROL
["up", "down", "left", "right"].forEach((dir) => {
  document.getElementById(dir).addEventListener("click", () => {
    if (!gameRunning) return;
    if (dir === "up") velocity = { x: 0, y: -1 };
    if (dir === "down") velocity = { x: 0, y: 1 };
    if (dir === "left") velocity = { x: -1, y: 0 };
    if (dir === "right") velocity = { x: 1, y: 0 };
  });
});

// TIME TRACKER
setInterval(() => {
  if (gameRunning) {
    second++;
    if (second === 60) {
      second = 0;
      minute++;
    }
    timeElement.innerHTML = `Time ${minute}:${second}`;
  }
}, 1000);

// CONTROL PANEL TOGGLE
function toggleControlPanel() {
  const panel = document.getElementById("control-panel");
  panel.classList.toggle("control-visible");
  panel.classList.toggle("control-hidden");
}
