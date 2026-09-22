class FocusTimer {
  constructor(onTick = () => {}, onDone = () => {}) {
    this.onTick = onTick; this.onDone = onDone; this.reset();
  }
  reset() { clearInterval(this.handle); this.remaining = 0; this.running = false; }
  start(minutes) {
    this.reset(); this.remaining = Math.max(1, Number(minutes)) * 60; this.running = true;
    this.onTick(this.remaining);
    this.handle = setInterval(() => {
      this.remaining -= 1; this.onTick(this.remaining);
      if (this.remaining <= 0) { this.reset(); this.onDone(); }
    }, 1000);
  }
  stop() { this.reset(); }
}
module.exports = { FocusTimer };
