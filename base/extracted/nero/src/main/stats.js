// Kullanım istatistikleri: ana sayfadaki kutucuklar ve Nero'nun laf sokmaları buradan beslenir.

const ACHIEVEMENTS = require('../data/achievements');

// Masa köşesi: toplam odak saatine göre kalıcı objeler biriktirir.
const DESK_ITEMS = [
  { id: 'fincan', hours: 1, icon: '☕', title: 'Kahve fincanı' },
  { id: 'defter', hours: 3, icon: '📓', title: 'Not defteri' },
  { id: 'saksi1', hours: 6, icon: '🌱', title: 'Küçük saksı' },
  { id: 'kitaplar', hours: 10, icon: '📚', title: 'Kitap yığını' },
  { id: 'lamba', hours: 15, icon: '💡', title: 'Masa lambası' },
  { id: 'cerceve', hours: 25, icon: '🖼️', title: 'Fotoğraf çerçevesi' },
  { id: 'plak', hours: 40, icon: '🎵', title: 'Plak çalar' },
  { id: 'saat', hours: 60, icon: '🕰️', title: 'Duvar saati' },
  { id: 'saksi2', hours: 85, icon: '🌸', title: 'Çiçek açan saksı' },
  { id: 'gramofon', hours: 120, icon: '📻', title: 'Eski radyo' }
];
const DAY_MS = 24 * 60 * 60 * 1000;
const KEEP_DAYS = 90;

function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysBetween(a, b) {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / DAY_MS);
}

const DEFAULTS = {
  firstUsedAt: null,
  lastActiveDay: null,
  daysActive: 0,
  streak: 0,
  bestStreak: 0,
  totals: { todos: 0, focusMin: 0, timersDone: 0, timersQuit: 0, notes: 0, pets: 0 },
  days: {},
  achievements: {},   // rozet kimliği -> kazanıldığı zaman
  desk: {},           // masa objesi kimliği -> kazanıldığı zaman
  doneStreak: 0       // yarıda bırakmadan üst üste tamamlanan sayaç
};

class Stats {
  constructor(store) {
    this.store = store;
    const s = store.get();
    this.data = {
      ...structuredClone(DEFAULTS),
      ...s,
      totals: { ...DEFAULTS.totals, ...(s.totals || {}) },
      days: { ...(s.days || {}) },
      achievements: { ...(s.achievements || {}) },
      desk: { ...(s.desk || {}) }
    };
    this.onUnlock = null;
    this.onDeskUnlock = null;
    if (!this.data.firstUsedAt) this.data.firstUsedAt = Date.now();
    this.markActive();
  }

  // Bugün kullanıldı olarak işaretle, seriyi güncelle.
  markActive() {
    const today = dayKey();
    const d = this.data;
    if (d.lastActiveDay !== today) {
      const gap = d.lastActiveDay ? daysBetween(d.lastActiveDay, today) : null;
      d.streak = gap === 1 ? d.streak + 1 : 1;
      d.bestStreak = Math.max(d.bestStreak, d.streak);
      d.daysActive += 1;
      d.lastActiveDay = today;
      this._prune();
      this._save();
      this.evaluate();
    }
  }

  _today() {
    const key = dayKey();
    if (!this.data.days[key]) this.data.days[key] = { todos: 0, focus: 0 };
    return this.data.days[key];
  }

  todoDone(delta = 1) {
    this.markActive();
    const t = this._today();
    t.todos = Math.max(0, t.todos + delta);
    this.data.totals.todos = Math.max(0, this.data.totals.todos + delta);
    this._save();
    if (delta > 0) {
      const h = new Date().getHours();
      if (h < 5) this.award('gece_kusu');
      else if (h < 7) this.award('erken_kus');
    }
    this.evaluate();
  }

  focus(minutes, completed) {
    this.markActive();
    const m = Math.max(0, Math.round(minutes));
    this._today().focus += m;
    this.data.totals.focusMin += m;
    if (completed) {
      this.data.totals.timersDone += 1;
      this.data.doneStreak = (this.data.doneStreak || 0) + 1;
      if (m >= 60) this.award('maraton');
      if (this.data.doneStreak >= 5) this.award('pes_etmeyen');
    } else {
      this.data.totals.timersQuit += 1;
      this.data.doneStreak = 0;
    }
    this._save();
    this.evaluate();
    this.evaluateDesk();
  }

  // Toplam odak saatine göre yeni masa objesi açılmış mı bak.
  evaluateDesk() {
    const hours = this.data.totals.focusMin / 60;
    for (const item of DESK_ITEMS) {
      if (!this.data.desk[item.id] && hours >= item.hours) {
        this.data.desk[item.id] = Date.now();
        this._save();
        if (this.onDeskUnlock) this.onDeskUnlock(item);
      }
    }
  }

  deskList() {
    const hours = this.data.totals.focusMin / 60;
    const next = DESK_ITEMS.find((i) => !this.data.desk[i.id]);
    return {
      items: DESK_ITEMS.map((i) => ({ id: i.id, icon: i.icon, title: i.title, hours: i.hours, unlockedAt: this.data.desk[i.id] || null })),
      next: next ? { title: next.title, hoursLeft: Math.max(0, Math.ceil(next.hours - hours)) } : null
    };
  }

  // Koşullu rozetleri kontrol et; yeni kazanılanları bildir.
  evaluate() {
    const sum = this.summary();
    for (const a of ACHIEVEMENTS) {
      if (a.check && !this.data.achievements[a.id] && a.check(sum)) this._unlock(a);
    }
  }

  // Olay rozetini doğrudan ver.
  award(id) {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (a && !this.data.achievements[id]) this._unlock(a);
  }

  _unlock(a) {
    this.data.achievements[a.id] = Date.now();
    this._save();
    if (this.onUnlock) this.onUnlock({ id: a.id, title: a.title, icon: a.icon, desc: a.desc });
  }

  achievementList() {
    return ACHIEVEMENTS.map((a) => ({
      id: a.id, icon: a.icon, title: a.title, desc: a.desc,
      unlockedAt: this.data.achievements[a.id] || null
    }));
  }

  noteCreated() {
    this.data.totals.notes += 1;
    this._save();
    this.evaluate();
  }

  pet() {
    this.data.totals.pets += 1;
    this._save();
    this.evaluate();
  }

  _prune() {
    const keys = Object.keys(this.data.days).sort();
    while (keys.length > KEEP_DAYS) delete this.data.days[keys.shift()];
  }

  _save() {
    this.store.set(this.data);
  }

  summary() {
    const d = this.data;
    const today = this.data.days[dayKey()] || { todos: 0, focus: 0 };
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * DAY_MS);
      const k = dayKey(date);
      week.push({ day: k, weekday: date.getDay(), focus: d.days[k]?.focus || 0, todos: d.days[k]?.todos || 0 });
    }
    const together = Math.max(1, Math.floor((Date.now() - d.firstUsedAt) / DAY_MS) + 1);
    return {
      today,
      week,
      totals: d.totals,
      streak: d.streak,
      bestStreak: d.bestStreak,
      daysActive: d.daysActive,
      daysTogether: together
    };
  }
}

module.exports = { Stats, dayKey, ACHIEVEMENTS, DESK_ITEMS };
