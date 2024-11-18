// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = canvas.width;
let snake = [{ x: 5 * gridSize, y: 5 * gridSize }];
let direction = { x: gridSize, y: 0 }; // Initial direction: right
let food = placeFood();
let gameOver = false;

function placeFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;

    // Ensure the food is not placed on the snake
    for (const segment of snake) {
        if (segment.x === x && segment.y === y) {
            return placeFood(); // Recurse if food is on the snake
        }
    }

    return { x, y };
}

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(segment => drawCell(segment.x, segment.y, 'green'));
}

function drawFood() {
    drawCell(food.x, food.y, 'red');
}

let speed = 200; // 速度控制变量，数值越大速度越慢

function update() {
    if (gameOver) return;

    const head = { ...snake[0] }; // Clone the head segment
    head.x += direction.x;
    head.y += direction.y;

    // Check for collisions
    if (
        head.x < 0 ||
        head.x >= canvasSize ||
        head.y < 0 ||
        head.y >= canvasSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver = true;
        alert('Game Over!');
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head); // Grow the snake
        food = placeFood(); // Place new food
    } else {
        snake.pop(); // Shorten the snake
        snake.unshift(head); // Move the head
    }

    draw();
    // 使用setTimeout来引入延迟
    setTimeout(() => {
        requestAnimationFrame(update);
    }, speed);
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawSnake();
    drawFood();
}

document.addEventListener('keydown', (event) => {
    if (gameOver) return;

    let newDirection = { x: 0, y: 0 };

    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) newDirection = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) newDirection = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) newDirection = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) newDirection = { x: gridSize, y: 0 };
            break;
    }

    // Prevent the snake from turning back on itself
    if (
        (newDirection.x === -direction.x && newDirection.y === 0) ||
        (newDirection.x === direction.x && newDirection.y === 0) ||
        (newDirection.x === 0 && newDirection.y === -direction.y) ||
        (newDirection.x === 0 && newDirection.y === direction.y)
    ) {
        direction = newDirection;
    }
});

update();