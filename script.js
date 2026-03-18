const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = true;

function randomTile() {
    return Math.floor(Math.random() * tileCount);
}

function generateFood() {
    food = {
        x: randomTile(),
        y: randomTile()
    };
}

function drawGame() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'lime';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameRunning = false;
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameRunning = false;
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function gameLoop() {
    if (!gameRunning) return;

    moveSnake();
    drawGame();
}

function changeDirection(newDx, newDy) {
    if ((dx === 0 && newDx !== 0) || (dy === 0 && newDy !== 0)) {
        dx = newDx;
        dy = newDy;
    }
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection(0, -1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection(0, 1);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection(-1, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection(1, 0);
            break;
    }
});

document.getElementById('up').addEventListener('click', () => changeDirection(0, -1));
document.getElementById('down').addEventListener('click', () => changeDirection(0, 1));
document.getElementById('left').addEventListener('click', () => changeDirection(-1, 0));
document.getElementById('right').addEventListener('click', () => changeDirection(1, 0));

restartButton.addEventListener('click', () => {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    generateFood();
    drawGame();
});

generateFood();
drawGame();
setInterval(gameLoop, 100);