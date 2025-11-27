const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const overlay = document.getElementById('overlay');
const scoreEl = document.getElementById('score');

const gridSize = 20;
let snake, direction, food, score, running, paused;

function initGame() {
  snake = [{ x: 200, y: 200 }];
  direction = { x: gridSize, y: 0 };
  food = randomFood();
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  running = true;
  paused = false;
  overlay.classList.add('hidden');
  requestAnimationFrame(loop);
}

function loop() {
  if (!running) return;
  if (!paused) update();
  render();
  setTimeout(() => requestAnimationFrame(loop), 100); // ~10 FPS
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wrap around edges
  head.x = (head.x + canvas.width) % canvas.width;
  head.y = (head.y + canvas.height) % canvas.height;

  // Collision with self
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    running = false;
    alert('Game Over! Final Score: ' + score);
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    food = randomFood();
  } else {
    snake.pop();
  }
}

function render() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#4caf50';
  snake.forEach(seg => ctx.fillRect(seg.x, seg.y, gridSize, gridSize));

  // Draw food
  ctx.fillStyle = '#f44336';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
  };
}

// Controls
window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -gridSize }; break;
    case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: gridSize }; break;
    case 'ArrowLeft': if (direction.x === 0) direction = { x: -gridSize, y: 0 }; break;
    case 'ArrowRight': if (direction.x === 0) direction = { x: gridSize, y: 0 }; break;
  }
});

btnStart.addEventListener('click', initGame);
btnPause.addEventListener('click', () => { paused = true; overlay.classList.remove('hidden'); });
btnResume.addEventListener('click', () => { paused = false; overlay.classList.add('hidden'); });

