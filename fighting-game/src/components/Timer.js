export class Timer {
    constructor({ duration, onComplete }) {
        this.duration = duration;
        this.onComplete = onComplete;
        this.timeLeft = duration;
    }

    start(ctx) {
        const interval = setInterval(() => {
            if (this.timeLeft <= 0) {
                clearInterval(interval);
                if (this.onComplete) this.onComplete();
            } else {
                this.timeLeft -= 1;
            }
            this.draw(ctx);
        }, 1000);
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Time: ${this.timeLeft}`, 20, 20);
    }
}
