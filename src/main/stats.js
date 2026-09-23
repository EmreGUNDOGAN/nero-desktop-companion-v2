// Nero kullanım istatistikleri + Achievement Sistemi v2.
// 4.1.0'da mevcut 31 achievement ID'si korunur; uzun dönem metrikleri 90 günlük
// günlük özetinden ayrı ve kalıcı tutulur.

const ACHIEVEMENTS = require('../data/achievements');
const { CORE_INTERACTIONS } = ACHIEVEMENTS;

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
const MAX_HISTORY_DAYS = 1200;

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

function unique(arr) { return [...new Set(Array.isArray(arr) ? arr : [])]; }
function addUnique(arr, value, limit = 1500) {
  const out = unique(arr);
  if (value !== undefined && value !== null && !out.includes(value)) out.push(value);
  return out.length > limit ? out.slice(-limit) : out;
}

function emptyHistoryRow() {
  return {
    todos: 0, todosCreated: 0, focus: 0, timersDone: 0, timersQuit: 0,
    notes: 0, pets: 0, active: false, meaningful: false, badMood: false,
    mode: null, rest: false, goodnight: false
  };
}

const DEFAULT_METRICS = {
  wakeCount: 0,
  waterAck: 0,
  breakAck: 0,
  scheduledCreated: 0,
  jarAdds: 0,
  jarRecalls: 0,
  weeklyLetters: 0,
  return30Count: 0,
  peekSeen: 0,
  dragDrops: 0,
  panelPinnedUsed: 0,
  mutedUsed: 0,
  maxScheduledTodos: 0,
  daySummaryCount: 0,
  modeDaysTotal: 0
};

const DEFAULT_SETS = {
  activeDays: [], meaningfulDays: [], morningDays: [], nightDays: [], focusDays: [],
  restDays: [], goodnightDays: [], daySummaryDays: [], outfitsSeen: [], statesSeen: [],
  personalizedLines: [], specialReactions: [], interactionTypes: [],
  modeDays: { sakin: [], uretken: [], kendime: [] }
};

const DEFAULTS = {
  firstUsedAt: null,
  lastActiveDay: null,
  daysActive: 0,
  streak: 0,
  bestStreak: 0,
  totals: { todos: 0, todoCreated: 0, focusMin: 0, timersDone: 0, timersQuit: 0, notes: 0, pets: 0 },
  days: {},
  history: {},
  achievements: {},
  desk: {},
  doneStreak: 0,
  displayBaseline: null,
  metrics: DEFAULT_METRICS,
  sets: DEFAULT_SETS
};

class Stats {
  constructor(store) {
    this.store = store;
    const s = store.get() || {};
    this.data = {
      ...structuredClone(DEFAULTS),
      ...s,
      totals: { ...DEFAULTS.totals, ...(s.totals || {}) },
      days: { ...(s.days || {}) },
      history: { ...(s.history || {}) },
      achievements: { ...(s.achievements || {}) },
      desk: { ...(s.desk || {}) },
      metrics: { ...DEFAULT_METRICS, ...(s.metrics || {}) },
      sets: {
        ...structuredClone(DEFAULT_SETS), ...(s.sets || {}),
        modeDays: { ...DEFAULT_SETS.modeDays, ...((s.sets && s.sets.modeDays) || {}) }
      }
    };
    for (const key of Object.keys(DEFAULT_SETS)) {
      if (key === 'modeDays') continue;
      this.data.sets[key] = unique(this.data.sets[key]);
    }
    for (const mode of Object.keys(DEFAULT_SETS.modeDays)) this.data.sets.modeDays[mode] = unique(this.data.sets.modeDays[mode]);

    this.onUnlock = null;
    this.onDeskUnlock = null;
    this.sessionStartedAt = Date.now();
    this.sessionActiveMs = 0;
    this.sessionNoProductiveMs = 0;
    this.transient = {
      wakeTimes: [], clickTimes: [], petTimes: [], dragDrops: [], positiveSulky: [],
      faceClicks: [], faceClickToken: 0
    };

    if (!this.data.firstUsedAt) this.data.firstUsedAt = Date.now();
    this._migrateHistory();
    this.markActive();
  }

  _migrateHistory() {
    for (const [key, row] of Object.entries(this.data.days || {})) {
      if (!this.data.history[key]) {
        this.data.history[key] = {
          ...emptyHistoryRow(),
          todos: row.todos || 0, focus: row.focus || 0,
          timersDone: row.timersDone || 0, timersQuit: row.timersQuit || 0,
          active: true,
          meaningful: (row.todos || 0) > 0 || (row.focus || 0) > 0
        };
      }
      this.data.sets.activeDays = addUnique(this.data.sets.activeDays, key);
      if ((row.todos || 0) > 0 || (row.focus || 0) > 0) this.data.sets.meaningfulDays = addUnique(this.data.sets.meaningfulDays, key);
      if ((row.timersDone || 0) > 0) this.data.sets.focusDays = addUnique(this.data.sets.focusDays, key);
    }
  }

  _historyDay(key = dayKey()) {
    if (!this.data.history[key]) this.data.history[key] = emptyHistoryRow();
    return this.data.history[key];
  }

  _today() {
    const key = dayKey();
    if (!this.data.days[key]) this.data.days[key] = { todos: 0, focus: 0, timersDone: 0, timersQuit: 0, notes: 0, pets: 0, todosCreated: 0 };
    const row = this.data.days[key];
    for (const f of ['todos','focus','timersDone','timersQuit','notes','pets','todosCreated']) if (!Number.isFinite(row[f])) row[f] = 0;
    return row;
  }

  markActive(date = new Date()) {
    const today = dayKey(date);
    const d = this.data;
    if (d.lastActiveDay !== today) {
      const gap = d.lastActiveDay ? daysBetween(d.lastActiveDay, today) : null;
      d.streak = gap === 1 ? d.streak + 1 : 1;
      d.bestStreak = Math.max(d.bestStreak, d.streak);
      d.daysActive += 1;
      d.lastActiveDay = today;
    }

    // "Şimdiye kadar" kartı sıfırlandıysa lifetime seriyi bozmadan
    // yalnız reset sonrasındaki yeni aktif günlerin serisini ayrıca tut.
    const baseline = d.displayBaseline;
    if (baseline && Number(date) >= Number(baseline.at || 0)) {
      if (!baseline.streak) baseline.streak = { lastActiveDay: null, current: 0, best: 0 };
      if (baseline.streak.lastActiveDay !== today) {
        const gap = baseline.streak.lastActiveDay ? daysBetween(baseline.streak.lastActiveDay, today) : null;
        baseline.streak.current = gap === 1 ? baseline.streak.current + 1 : 1;
        baseline.streak.best = Math.max(baseline.streak.best || 0, baseline.streak.current);
        baseline.streak.lastActiveDay = today;
      }
    }

    const h = this._historyDay(today);
    h.active = true;
    d.sets.activeDays = addUnique(d.sets.activeDays, today);
    const hour = date.getHours();
    if (hour < 7) d.sets.morningDays = addUnique(d.sets.morningDays, today);
    if (hour < 5) d.sets.nightDays = addUnique(d.sets.nightDays, today);
    this._prune();
    this._save();
    this.evaluate();
  }

  meaningful(kind = 'interaction', date = new Date()) {
    this.markActive(date);
    const key = dayKey(date);
    this._historyDay(key).meaningful = true;
    this.data.sets.meaningfulDays = addUnique(this.data.sets.meaningfulDays, key);
    if (kind === 'productive') this.sessionNoProductiveMs = 0;
    this._save();
  }

  productiveAction() {
    this.meaningful('productive');
    this.sessionNoProductiveMs = 0;
  }

  sessionTick(dtMs, active = true) {
    if (!active) return;
    const dt = Math.max(0, Math.min(Number(dtMs) || 0, 5 * 60 * 1000));
    this.sessionActiveMs += dt;
    this.sessionNoProductiveMs += dt;
    if (this.sessionNoProductiveMs >= 60 * 60 * 1000) this.award('secret_ikimiz_de_issiziz');
    this.evaluate();
  }

  todoCreated({ scheduled = false } = {}) {
    this.productiveAction();
    const t = this._today();
    t.todosCreated += 1;
    const h = this._historyDay();
    h.todosCreated += 1;
    this.data.totals.todoCreated += 1;
    if (scheduled) this.data.metrics.scheduledCreated += 1;
    this._save();
    this.evaluate();
  }

  scheduledTodoCount(count) {
    this.data.metrics.maxScheduledTodos = Math.max(this.data.metrics.maxScheduledTodos || 0, Number(count) || 0);
    this._save(); this.evaluate();
  }

  todoDone(delta = 1, { createdAt = null } = {}) {
    this.productiveAction();
    const t = this._today();
    t.todos = Math.max(0, t.todos + delta);
    this.data.totals.todos = Math.max(0, this.data.totals.todos + delta);
    const h = this._historyDay();
    h.todos = Math.max(0, h.todos + delta);
    if (delta > 0) {
      const now = new Date();
      if (now.getHours() < 5) this.award('gece_kusu');
      else if (now.getHours() < 7) this.award('erken_kus');
      if (createdAt && dayKey(new Date(createdAt)) === dayKey(now)) h.sameDayTodoDone = (h.sameDayTodoDone || 0) + 1;
    }
    this._save(); this.evaluate();
  }

  addFocusMinutes(minutes) {
    const m = Math.max(0, Math.round(Number(minutes) || 0));
    if (!m) return 0;
    this.productiveAction();
    const t = this._today();
    const h = this._historyDay();
    t.focus += m;
    h.focus += m;
    this.data.totals.focusMin += m;
    this.data.sets.focusDays = addUnique(this.data.sets.focusDays, dayKey());
    // Görev kronometresi odak toplamına katkı yapar; timer tamamlanma/seri achievementlarını tetiklemez.
    this._save();
    this.evaluate();
    this.evaluateDesk();
    return m;
  }

  focus(minutes, completed, meta = {}) {
    this.productiveAction();
    const m = Math.max(0, Math.round(minutes));
    const t = this._today();
    const h = this._historyDay();
    t.focus += m; h.focus += m; this.data.totals.focusMin += m;
    if (completed) {
      t.timersDone += 1; h.timersDone += 1; this.data.totals.timersDone += 1;
      this.data.doneStreak = (this.data.doneStreak || 0) + 1;
      this.data.sets.focusDays = addUnique(this.data.sets.focusDays, dayKey());
      if (m >= 60) this.award('maraton');
      if (this.data.doneStreak >= 5) this.award('pes_etmeyen');
      if (meta.pajama) {
        this.data.metrics.pajamaTimerStreak = (this.data.metrics.pajamaTimerStreak || 0) + 1;
        if (this.data.metrics.pajamaTimerStreak >= 3) this.award('secret_hala_uyaniksin');
      } else this.data.metrics.pajamaTimerStreak = 0;
      if ((meta.pauseResumeCount || 0) >= 4) this.award('secret_kacis_plani');
    } else {
      t.timersQuit += 1; h.timersQuit += 1; this.data.totals.timersQuit += 1;
      this.data.doneStreak = 0;
      this.data.metrics.pajamaTimerStreak = 0;
    }
    this._save(); this.evaluate(); this.evaluateDesk();
  }

  noteCreated() {
    this.productiveAction();
    this.data.totals.notes += 1;
    this._today().notes += 1;
    this._historyDay().notes += 1;
    this._save(); this.evaluate();
  }

  pet(meta = {}) {
    this.meaningful('interaction');
    this.data.totals.pets += 1;
    this._today().pets += 1;
    this._historyDay().pets += 1;
    this.recordInteraction('pet', meta);
    const now = Date.now();
    this.transient.petTimes = [...this.transient.petTimes.filter((t) => now - t < 120000), now];
    if ((meta.stage === 'sulky' || meta.stage === 'lonely') && this.transient.petTimes.filter((t) => now - t < 20000).length >= 6) this.award('secret_dokunma_bana');
    if (meta.stage === 'sulky' && (meta.ignoredMs || 0) >= 15 * 60 * 1000) this.award('secret_inat');
    this._save(); this.evaluate();
  }

  recordInteraction(type, meta = {}) {
    this.meaningful('interaction');
    if (CORE_INTERACTIONS.includes(type)) this.data.sets.interactionTypes = addUnique(this.data.sets.interactionTypes, type, 50);
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() <= 1) this.award('secret_yeni_gun');
    if (type === 'click' && now.getHours() === 3 && now.getMinutes() <= 10) {
      const ms = Date.now();
      this.transient.clickTimes = [...this.transient.clickTimes.filter((t) => ms - t < 10 * 60 * 1000), ms];
      if (this.transient.clickTimes.length >= 3) this.award('secret_gece_uc');
    }
    if (meta.stage === 'sulky' && ['pet','panel','todo_done','timer_done'].includes(type)) {
      const ms = Date.now();
      this.transient.positiveSulky = this.transient.positiveSulky.filter((x) => ms - x.t < 120000);
      this.transient.positiveSulky.push({ t: ms, type });
      if (new Set(this.transient.positiveSulky.map((x) => x.type)).size >= 3) this.award('secret_tam_tersi');
    }
    this._save(); this.evaluate();
  }

  recordFaceClick() {
    const now = Date.now();
    this.transient.faceClicks = [...this.transient.faceClicks.filter((t) => now - t < 1200), now];
    const token = ++this.transient.faceClickToken;
    if (this.transient.faceClicks.length === 3) {
      setTimeout(() => {
        if (this.transient.faceClickToken === token && this.transient.faceClicks.length === 3) this.award('secret_boop');
      }, 900);
    }
    if (this.transient.faceClicks.length > 3) this.transient.faceClicks = [];
  }

  recordWake() {
    this.data.metrics.wakeCount += 1;
    this.recordInteraction('wake');
    const now = Date.now();
    this.transient.wakeTimes = [...this.transient.wakeTimes.filter((t) => now - t < 10 * 60 * 1000), now];
    if (this.transient.wakeTimes.length >= 5) this.award('secret_beni_rahat_birak');
    this._save(); this.evaluate();
  }

  recordDragDrop(x, y) {
    this.data.metrics.dragDrops += 1;
    this.recordInteraction('drop');
    const now = Date.now();
    this.transient.dragDrops = this.transient.dragDrops.filter((p) => now - p.t < 10000);
    const distinct = !this.transient.dragDrops.some((p) => Math.hypot((x || 0) - p.x, (y || 0) - p.y) < 28);
    if (distinct) this.transient.dragDrops.push({ t: now, x: x || 0, y: y || 0 });
    if (this.transient.dragDrops.length >= 5) this.award('secret_karar_ver');
    this._save(); this.evaluate();
  }

  recordReminderAck(kind) {
    if (kind === 'water') this.data.metrics.waterAck += 1;
    if (kind === 'break') this.data.metrics.breakAck += 1;
    this.meaningful('interaction'); this._save(); this.evaluate();
  }

  recordReturn(offlineMs) {
    if (offlineMs >= 30 * 60 * 1000) this.data.metrics.return30Count += 1;
    if (offlineMs >= 7 * DAY_MS) this.award('secret_yabanci_degilsin');
    this._save(); this.evaluate();
  }

  recordDayMode(mode) {
    if (!['sakin','uretken','kendime'].includes(mode)) return;
    const key = dayKey();
    this.data.sets.modeDays[mode] = addUnique(this.data.sets.modeDays[mode], key);
    this.data.metrics.modeDaysTotal = Object.values(this.data.sets.modeDays).reduce((a, arr) => a + arr.length, 0);
    this._historyDay().mode = mode;
    this.meaningful('interaction'); this._save(); this.evaluate();
  }

  recordRest() {
    const key = dayKey();
    this.data.sets.restDays = addUnique(this.data.sets.restDays, key);
    this._historyDay().rest = true;
    this.meaningful('interaction'); this._save(); this.evaluate();
  }

  recordGoodnight() {
    const key = dayKey();
    this.data.sets.goodnightDays = addUnique(this.data.sets.goodnightDays, key);
    this._historyDay().goodnight = true;
    this.meaningful('interaction'); this._save(); this.evaluate();
  }

  recordJarAdd() { this.data.metrics.jarAdds += 1; this.meaningful('productive'); this._save(); this.evaluate(); }
  recordJarRecall() { this.data.metrics.jarRecalls += 1; this._save(); this.evaluate(); }
  recordWeeklyLetter() { this.data.metrics.weeklyLetters += 1; this._save(); this.evaluate(); }
  recordPeek() { this.data.metrics.peekSeen += 1; this.recordInteraction('peek'); this._save(); this.evaluate(); }
  recordDaySummary() { const k = dayKey(); this.data.sets.daySummaryDays = addUnique(this.data.sets.daySummaryDays, k); this.data.metrics.daySummaryCount = this.data.sets.daySummaryDays.length; this._save(); this.evaluate(); }
  recordOutfit(outfit) { if (outfit) this.data.sets.outfitsSeen = addUnique(this.data.sets.outfitsSeen, outfit, 20); this._save(); this.evaluate(); }
  recordState(state) { if (state) this.data.sets.statesSeen = addUnique(this.data.sets.statesSeen, state, 30); if (state === 'sulky' || state === 'lonely') this._historyDay().badMood = true; this._save(); this.evaluate(); }
  recordSpecialReaction(type) { if (type) this.data.sets.specialReactions = addUnique(this.data.sets.specialReactions, type, 100); this._save(); this.evaluate(); }
  recordPersonalized(id) { if (id) this.data.sets.personalizedLines = addUnique(this.data.sets.personalizedLines, id, 500); this._save(); this.evaluate(); }
  recordSetting(key, value) { if (key === 'panelPinned' && value) this.data.metrics.panelPinnedUsed = 1; if (key === 'muted' && value) this.data.metrics.mutedUsed = 1; this._save(); this.evaluate(); }
  recordScheduledCreated() { this.data.metrics.scheduledCreated += 1; this._save(); this.evaluate(); }
  recordEyeGesture(kind) { const map = { sweep: 'secret_beni_izliyor_musun', edge: 'secret_orada_bir_sey', wander: 'secret_nereye_bakiyorsun' }; if (map[kind]) this.award(map[kind]); }

  evaluateDesk() {
    const hours = this.data.totals.focusMin / 60;
    for (const item of DESK_ITEMS) {
      if (!this.data.desk[item.id] && hours >= item.hours) {
        this.data.desk[item.id] = Date.now(); this._save();
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

  evaluate() {
    // Meta achievementlar aynı turdaki diğer unlockları da görebilsin diye birkaç sabit nokta turu.
    for (let pass = 0; pass < 3; pass++) {
      const sum = this.summary();
      let changed = false;
      for (const a of ACHIEVEMENTS) {
        if (a.check && !this.data.achievements[a.id] && a.check(sum)) changed = this._unlock(a) || changed;
      }
      if (!changed) break;
    }
  }

  award(id) {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (a && !this.data.achievements[id]) return this._unlock(a);
    return false;
  }

  _unlock(a) {
    if (this.data.achievements[a.id]) return false;
    this.data.achievements[a.id] = Date.now();
    this._save();
    if (this.onUnlock) this.onUnlock({
      id: a.id, title: a.title, icon: a.icon, desc: a.desc,
      completedDesc: a.completedDesc, rarity: a.rarity, hidden: !!a.hidden
    });
    return true;
  }

  achievementList() {
    return ACHIEVEMENTS
      .filter((a) => !a.hidden || !!this.data.achievements[a.id])
      .map((a) => ({
        id: a.id, icon: a.icon, title: a.title, desc: a.desc,
        completedDesc: a.completedDesc, rarity: a.rarity, hidden: !!a.hidden, type: a.type,
        unlockedAt: this.data.achievements[a.id] || null
      }));
  }

  _prune() {
    const keys = Object.keys(this.data.days).sort();
    while (keys.length > KEEP_DAYS) delete this.data.days[keys.shift()];
    const historyKeys = Object.keys(this.data.history).sort();
    while (historyKeys.length > MAX_HISTORY_DAYS) delete this.data.history[historyKeys.shift()];
  }

  _save() { this.store.set(this.data); }

  resetDisplayBaseline(now = Date.now()) {
    const at = Number(now) || Date.now();
    this.data.displayBaseline = {
      at,
      totals: { ...this.data.totals },
      streak: { lastActiveDay: null, current: 0, best: 0 }
    };
    this._save();
    return this.summary();
  }

  _displayStats() {
    const d = this.data;
    const baseline = d.displayBaseline;
    if (!baseline || !baseline.totals) {
      return {
        baselineAt: null,
        totals: { ...d.totals },
        bestStreak: d.bestStreak || 0
      };
    }
    const base = baseline.totals || {};
    const diff = {};
    for (const key of ['todos','todoCreated','focusMin','timersDone','timersQuit','notes','pets']) {
      diff[key] = Math.max(0, (Number(d.totals[key]) || 0) - (Number(base[key]) || 0));
    }
    return {
      baselineAt: baseline.at || null,
      totals: diff,
      bestStreak: Math.max(0, Number(baseline.streak?.best) || 0)
    };
  }

  summary() {
    const d = this.data;
    const rawToday = this.data.days[dayKey()] || {};
    const today = {
      todos: rawToday.todos || 0, focus: rawToday.focus || 0,
      timersDone: rawToday.timersDone || 0, timersQuit: rawToday.timersQuit || 0,
      notes: rawToday.notes || 0, pets: rawToday.pets || 0, todosCreated: rawToday.todosCreated || 0
    };
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * DAY_MS);
      const k = dayKey(date);
      week.push({ day: k, weekday: date.getDay(), focus: d.days[k]?.focus || 0, todos: d.days[k]?.todos || 0 });
    }
    const together = Math.max(1, Math.floor((Date.now() - d.firstUsedAt) / DAY_MS) + 1);
    const history = Object.keys(d.history).sort().map((day) => ({ day, ...d.history[day] }));
    const activeRows = history.filter((row) => row.active);
    let safeActiveRun = 0;
    for (let i = activeRows.length - 1; i >= 0; i--) {
      if (activeRows[i].badMood) break;
      safeActiveRun += 1;
    }
    const normalUnlockedCount = ACHIEVEMENTS.filter((a) => !a.hidden && a.id !== 'tum_normal' && d.achievements[a.id]).length;
    const display = this._displayStats();
    return {
      today, week, totals: d.totals, display,
      streak: d.streak, bestStreak: d.bestStreak,
      daysActive: d.daysActive,
      activeDaysCount: Math.max(d.daysActive || 0, d.sets.activeDays.length),
      daysTogether: together,
      doneStreak: d.doneStreak || 0,
      sessionMinutes: this.sessionActiveMs / 60000,
      noProductiveSessionMinutes: this.sessionNoProductiveMs / 60000,
      metrics: { ...d.metrics, safeActiveRun },
      sets: {
        ...d.sets,
        modeDays: { ...d.sets.modeDays }
      },
      history,
      normalUnlockedCount,
      unlockedIds: Object.keys(d.achievements).filter((id) => d.achievements[id])
    };
  }
}

module.exports = { Stats, dayKey, ACHIEVEMENTS, DESK_ITEMS, CORE_INTERACTIONS };
