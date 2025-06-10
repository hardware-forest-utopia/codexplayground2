// TypeScript Snake Game
var canvas = document.getElementById('game');
var scoreEl = document.getElementById('score');
var instructionsEl = document.getElementById('instructions');
var restartBtn = document.getElementById('restart');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
var cellSize;
var rows;
var cols;
var snake = [];
var direction = { x: 1, y: 0 };
var food = { x: 0, y: 0 };
var speed = 200; // ms per frame
var lastTime = 0;
var running = false;
function initGrid() {
    var size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size;
    canvas.height = size;
    cellSize = Math.floor(size / 20);
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
}
function reset() {
    initGrid();
    snake = [];
    for (var i = 5; i > 0; i--) {
        snake.push({ x: i, y: 1 });
    }
    direction = { x: 1, y: 0 };
    placeFood();
    speed = 200;
    running = true;
    updateScore();
    instructionsEl.style.display = 'block';
    window.requestAnimationFrame(loop);
}
function placeFood() {
    food.x = Math.floor(Math.random() * cols);
    food.y = Math.floor(Math.random() * rows);
}
function updateScore() {
    scoreEl.textContent = "Score: ".concat(snake.length - 5);
}
function loop(timestamp) {
    if (!running)
        return;
    if (timestamp - lastTime > speed) {
        lastTime = timestamp;
        update();
        draw();
    }
    window.requestAnimationFrame(loop);
}
function update() {
    var head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows || snake.some(function (c) { return c.x === head.x && c.y === head.y; })) {
        running = false;
        instructionsEl.textContent = 'Game Over! Tap Restart.';
        instructionsEl.style.display = 'block';
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        placeFood();
        speed = Math.max(50, speed - 5);
        updateScore();
    }
    else {
        snake.pop();
    }
    instructionsEl.style.display = 'none';
}
function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    for (var _i = 0, snake_1 = snake; _i < snake_1.length; _i++) {
        var c = snake_1[_i];
        ctx.fillRect(c.x * cellSize, c.y * cellSize, cellSize, cellSize);
    }
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}
function changeDirection(dx, dy) {
    if (dx === -direction.x && dy === -direction.y)
        return;
    direction = { x: dx, y: dy };
}
// Keyboard controls
window.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'ArrowUp':
            changeDirection(0, -1);
            break;
        case 'ArrowDown':
            changeDirection(0, 1);
            break;
        case 'ArrowLeft':
            changeDirection(-1, 0);
            break;
        case 'ArrowRight':
            changeDirection(1, 0);
            break;
    }
});
// Swipe controls
var touchStartX = 0;
var touchStartY = 0;
canvas.addEventListener('touchstart', function (e) {
    var t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
});
canvas.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0];
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30)
            changeDirection(1, 0);
        else if (dx < -30)
            changeDirection(-1, 0);
    }
    else {
        if (dy > 30)
            changeDirection(0, 1);
        else if (dy < -30)
            changeDirection(0, -1);
    }
});
restartBtn.addEventListener('click', reset);
window.addEventListener('resize', initGrid);
reset();
