import { characters } from './config/characters.js';
import { Character } from './components/Character.js';
import { HealthBar } from './components/HealthBar.js';
import { Timer } from './components/Timer.js';
import { checkCollision } from './utils/collision.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const player = new Character({ position: { x: 50, y: 400 }, velocity: { x: 0, y: 0 }, config: characters.player });
const enemy = new Character({ position: { x: 800, y: 400 }, velocity: { x: 0, y: 0 }, config: characters.enemy });

const playerHealthBar = new HealthBar({ position: { x: 20, y: 20 }, maxHealth: characters.player.health });
const enemyHealthBar = new HealthBar({ position: { x: 800, y: 20 }, maxHealth: characters.enemy.health });

const timer = new Timer({ duration: 60, onComplete: () => console.log('Game Over') });

const keys = { left: { pressed: false }, right: { pressed: false } };

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update(ctx);
    enemy.update(ctx);

    if (checkCollision(player, enemy)) {
        playerHealthBar.reduceHealth(10);
    }

    playerHealthBar.update(ctx);
    enemyHealthBar.update(ctx);

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') keys.left.pressed = true;
    if (event.key === 'ArrowRight') keys.right.pressed = true;
});

window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') keys.left.pressed = false;
    if (event.key === 'ArrowRight') keys.right.pressed = false;
});

timer.start(ctx);
gameLoop();
