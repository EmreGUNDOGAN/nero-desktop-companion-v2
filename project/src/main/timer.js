// Zamanlayıcı ana süreçte çalışır; panel kapalıyken de saymaya devam eder.

const { EventEmitter } = require('events');

class Timer extends EventEmitter {
  constructor() {
    super();
    this.status = 'idle'; // idle | running | paused
    this.durationMs = 0;
    this.remainingMs = 0;
    this.endsAt = 0;
    this.label = '';
    this.interval = null;
  }

  snapshot() {
    const remaining = this.status === 'running' ? Math.max(0, this.endsAt - Date.now()) : this.remainingMs;
    return {
      status: this.status,
      durationMs: this.durationMs,
      remainingMs: remaining,
      label: this.label,
      progress: this.durationMs ? 1 - remaining / this.durationMs : 0
    };
  }

  start(minutes, label = '') {
    const mins = Math.max(1, Math.min(600, Math.round(Number(minutes) || 25)));
    this.durationMs = mins * 60 * 1000;
    this.remainingMs = this.durationMs;
    this.endsAt = Date.now() + this.durationMs;
    this.label = String(label || '').slice(0, 80);
    this.status = 'running';
    this._loop();
    this.emit('started', { minutes: mins, label: this.label });
    this.emit('tick', this.snapshot());
  }

  pause() {
    if (this.status !== 'running') return;
    this.remainingMs = Math.max(0, this.endsAt - Date.now());
    this.status = 'paused';
    this._stopLoop();
    this.emit('paused');
    this.emit('tick', this.snapshot());
  }

  resume() {
    if (this.status !== 'paused') return;
    this.endsAt = Date.now() + this.remainingMs;
    this.status = 'running';
    this._loop();
    this.emit('resumed');
    this.emit('tick', this.snapshot());
  }

  cancel() {
    if (this.status === 'idle') return;
    const snap = this.snapshot();
    this._reset();
    this.emit('cancelled', { progress: snap.progress, minutes: Math.round(snap.durationMs / 60000), label: snap.label });
    this.emit('tick', this.snapshot());
  }

  _reset() {
    this._stopLoop();
    this.status = 'idle';
    this.remainingMs = 0;
    this.durationMs = 0;
    this.endsAt = 0;
    this.label = '';
  }

  _loop() {
    this._stopLoop();
    this.interval = setInterval(() => {
      const snap = this.snapshot();
      if (snap.remainingMs <= 0) {
        const minutes = Math.round(this.durationMs / 60000);
        const label = this.label;
        this._reset();
        this.emit('done', { minutes, label });
        this.emit('tick', this.snapshot());
      } else {
        this.emit('tick', snap);
      }
    }, 250);
  }

  _stopLoop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
}

module.exports = { Timer };
