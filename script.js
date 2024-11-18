// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = canvas.width;
const rows = canvasSize / gridSize;
const cols = canvasSize / gridSize;

let snake = [{ x: 5 * gridSize, y: 5 * gridSize }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * cols) * gridSize, y: Math.floor(Math.random() * rows) * gridSize };
let gameOver = false;

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => {
        drawCell(segment.x, segment.y, 'green');
    });
}

function drawFood() {
    drawCell(food.x, food.y, 'red');
}

function update() {
    if (gameOver) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (
        head.x < 0 ||
        head.x >= canvasSize ||
        head.y < 0 ||
        head.y >= canvasSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver = true;
        alert('Game Over!');
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        food = { x: Math.floor(Math.random() * cols) * gridSize, y: Math.floor(Math.random() * rows) * gridSize };
    } else {
        snake.pop();
        snake.unshift(head);
    }

    draw();

    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawSnake();
    drawFood();
}

document.addEventListener('keydown', (event) => {
    if (gameOver) return;

    const changeTo = { x: 0, y: 0 };

    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) changeTo.y = -gridSize;
            break;
        case 'ArrowDown':
            if (direction.y === 0) changeTo.y = gridSize;
            break;
        case 'ArrowLeft':
            if (direction.x === 0) changeTo.x = -gridSize;
            break;
        case 'ArrowRight':
            if (direction.x === 0) changeTo.x = gridSize;
            break;
    }

    if (Object.keys(changeTo).every(key => changeTo[key] === 0)) return;

    direction = changeTo;
});

update();