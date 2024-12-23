export class HealthBar {
    constructor({ position, maxHealth }) {
        this.position = position;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
    }

    update(ctx) {
        const healthPercentage = (this.currentHealth / this.maxHealth) * 100;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, healthPercentage, 10);
    }

    reduceHealth(amount) {
        this.currentHealth = Math.max(0, this.currentHealth - amount);
    }
}
