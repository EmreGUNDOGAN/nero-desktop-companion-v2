// Nero'nun ruh hali motoru.
//
// Temel fikir: Nero, sen bilgisayarın başındayken onunla ilgilenmediğin süreyi sayar.
// Bilgisayardan uzaktaysan (sistem boşta) uyur ve bu süre sayılmaz.
//   0 - 3 saat   : keyfi yerinde (kendi kendine konuşur, laf atar)
//   3 - 3:45     : sıkılmış
//   3:45 - 5 saat: küsmüş
//   5 saat +     : yalnız hissediyor
// Mutluluk puanı (0-100) etkileşimlerle artar, uzun ihmalde yavaşça düşer ve
// hangi tür repliklerin seçileceğini etkiler.

const { EventEmitter } = require('events');

const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;

const STAGES = ['content', 'bored', 'sulky', 'lonely'];
const STAGE_THRESHOLDS = { bored: 3 * HOUR, sulky: 3.75 * HOUR, lonely: 5 * HOUR };
const SLEEP_AFTER_IDLE_SEC = 10 * 60; // bilgisayar 10 dk boşta kalırsa uyur

const INTERACTION_WEIGHTS = {
  click: 3,
  panel: 2,
  drag: 1,
  note_add: 3,
  todo_add: 3,
  todo_done: 7,
  timer_start: 4,
  timer_done: 12,
  timer_cancel: -4,
  poke_spam: -6,
  pet: 5,
  pet_too_much: -3,
  shake: -5
};

const STAGE_LABELS = {
  content: 'Keyfi yerinde',
  happy: 'Keyifli (kimseye söyleme)',
  bored: 'Sıkılmış',
  sulky: 'Küsmüş',
  lonely: 'Yalnız hissediyor',
  asleep: 'Uyuyor'
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

class Mood extends EventEmitter {
  constructor(store) {
    super();
    this.store = store;
    const s = store.get();
    this.state = {
      happiness: typeof s.happiness === 'number' ? s.happiness : 65,
      ignoredMs: typeof s.ignoredMs === 'number' ? s.ignoredMs : 0,
      lastInteractionAt: s.lastInteractionAt || Date.now(),
      lastSeenAt: s.lastSeenAt || null,
      asleep: false,
      napping: false
    };
    this.stage = this._computeStage();
  }

  // Uygulama açılırken çağrılır: en son ne zaman açıktı?
  startupInfo() {
    const now = Date.now();
    const firstRun = !this.state.lastSeenAt;
    const offlineMs = firstRun ? null : now - this.state.lastSeenAt;
    this.state.lastSeenAt = now;
    this._persist();
    return { offlineMs, firstRun };
  }

  tick(dtMs, systemIdleSec, locked = false) {
    const shouldSleep = locked || systemIdleSec >= SLEEP_AFTER_IDLE_SEC;
    if (shouldSleep && !this.state.asleep) {
      this.state.asleep = true;
      this.emit('sleep');
    } else if (!shouldSleep && this.state.asleep) {
      this.state.asleep = false;
      this.emit('wake');
    }

    if (!this.state.asleep && !this.state.napping) {
      this.state.ignoredMs += dtMs;
      if (this.state.ignoredMs > STAGE_THRESHOLDS.bored) {
        // Sıkılmaya başladıktan sonra her 10 dakikada 1 puan düşer.
        this.state.happiness -= dtMs / (10 * MIN);
      } else if (this.state.happiness > 75) {
        // Aşırı neşe de kalıcı değil; 20 dakikada 1 puan normale döner.
        this.state.happiness -= dtMs / (20 * MIN);
      }
      this.state.happiness = clamp(this.state.happiness, 5, 100);
    }

    this.state.lastSeenAt = Date.now();
    this._updateStage();
    this._persist();
  }

  // Etkileşim sonrası hangi aşamadan dönüldüğünü döndürür (ör. "küsmüştüm ama geldin").
  interact(kind) {
    const weight = INTERACTION_WEIGHTS[kind] ?? 2;
    const previousStage = this.stage;
    const wasAsleep = this.state.asleep;
    this.state.happiness = clamp(this.state.happiness + weight, 5, 100);
    if (weight > 0) {
      this.state.ignoredMs = 0;
      this.state.lastInteractionAt = Date.now();
    }
    this._updateStage();
    this._persist();
    return { previousStage, wasAsleep, wasNeglected: STAGES.indexOf(previousStage) >= 1 };
  }

  reset() {
    this.state.happiness = 65;
    this.state.ignoredMs = 0;
    this.state.lastInteractionAt = Date.now();
    this._updateStage();
    this._persist();
  }

  _computeStage() {
    const t = this.state.ignoredMs;
    if (t >= STAGE_THRESHOLDS.lonely) return 'lonely';
    if (t >= STAGE_THRESHOLDS.sulky) return 'sulky';
    if (t >= STAGE_THRESHOLDS.bored) return 'bored';
    return 'content';
  }

  _updateStage() {
    const next = this._computeStage();
    if (next !== this.stage) {
      const prev = this.stage;
      this.stage = next;
      this.emit('stage', { stage: next, previous: prev });
    }
  }

  isNight(date = new Date()) {
    const h = date.getHours();
    return h >= 0 && h < 5;
  }

  // Konuşmadığı anlarda yüzünde duracak ifade.
  setNap(on) {
    this.state.napping = !!on;
  }

  baselineExpression() {
    if (this.state.asleep || this.state.napping) return 'asleep';
    switch (this.stage) {
      case 'lonely': return 'sad';
      case 'sulky': return 'sulky';
      case 'bored': return 'bored';
      default:
        if (this.isNight()) return 'sleepy';
        return this.state.happiness >= 80 ? 'content' : 'normal';
    }
  }

  // Kendi kendine konuşurken hangi replik havuzundan seçeceği.
  selfTalkCategory() {
    if (this.stage === 'lonely') return 'lonely';
    if (this.stage === 'sulky') return 'sulky';
    if (this.stage === 'bored') return 'bored';
    if (this.isNight() && Math.random() < 0.5) return 'late_night';
    if (this.state.happiness >= 80 && Math.random() < 0.4) return 'happy';
    return Math.random() < 0.55 ? 'idle' : 'remark';
  }

  summary() {
    const key = this.state.asleep || this.state.napping ? 'asleep' : (this.stage === 'content' && this.state.happiness >= 80 ? 'happy' : this.stage);
    return {
      stage: this.stage,
      asleep: this.state.asleep || this.state.napping,
      happiness: Math.round(this.state.happiness),
      label: STAGE_LABELS[key],
      ignoredMinutes: Math.floor(this.state.ignoredMs / MIN)
    };
  }

  _persist() {
    this.store.set({
      happiness: this.state.happiness,
      ignoredMs: this.state.ignoredMs,
      lastInteractionAt: this.state.lastInteractionAt,
      lastSeenAt: this.state.lastSeenAt
    });
  }
}

module.exports = { Mood, HOUR, MIN };
