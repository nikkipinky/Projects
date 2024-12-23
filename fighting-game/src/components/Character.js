import { switchSprite } from '../utils/animations.js';

export class Character {
    constructor({ position, velocity, config }) {
        this.position = position;
        this.velocity = velocity;
        this.speed = config.speed;
        this.health = config.health;
        this.animations = config.animations;

        this.image = new Image();
        this.image.src = `assets/images/${this.animations.idle}`;
    }

    move(keys) {
        if (keys.left.pressed) {
            this.velocity.x = -this.speed;
            switchSprite(this, 'idle');
        } else if (keys.right.pressed) {
            this.velocity.x = this.speed;
            switchSprite(this, 'idle');
        } else {
            this.velocity.x = 0;
            switchSprite(this, 'idle');
        }
    }

    attack() {
        // Attack logic
    }

    update(ctx) {
        this.position.x += this.velocity.x;
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}
