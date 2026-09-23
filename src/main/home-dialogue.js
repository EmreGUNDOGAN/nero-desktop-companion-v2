// Ana sayfadaki Nero konuşmalarını yöneten bağımsız motor.
// Karakter balonundaki Dialogue/TALK_INTERVALS sisteminden özellikle ayrıdır.

const DATA = require('../data/home-dialogues.tr.json');

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const DEFAULT_CONFIG = Object.freeze({
  intervalMinMinutes: 5,
  intervalMaxMinutes: 10,
  recentLimit: 20,
  categoryHistoryLimit: 4,
  maxSameCategoryInRow: 2,
  ultraRareRepeatDays: 180,
  categoryWeights: {
    general: 1.00,
    roast: 0.65,
    motivation: 0.65,
    care: 0.55,
    absurd: 0.70,
    productivity: 0.90,
    time: 0.55,
    relationship: 0.35,
    rare: 0.12
  },
  rarityWeights: {
    common: 1,
    uncommon: 0.45,
    rare: 0.12,
    ultra_rare: 0.02
  }
});

const VALID_CATEGORIES = new Set(['general', 'roast', 'motivation', 'care', 'absurd', 'productivity', 'time', 'relationship', 'rare', 'return']);
const VALID_RARITIES = new Set(['common', 'uncommon', 'rare', 'ultra_rare']);
const CONDITION_KEYS = new Set([
  'todayTodosExact', 'todayTodosMin', 'todayTodosMax',
  'pendingTodosExact', 'pendingTodosMin', 'pendingTodosMax', 'totalTodosMin',
  'todayFocusExact', 'todayFocusMin', 'todayFocusMax', 'todayTimersDoneExact',
  'timeStart', 'timeEndInclusive', 'isPajama',
  'streakMin', 'streakMax',
  'timersDoneMin', 'timersQuitMin', 'timersDoneGreaterThanQuit', 'timersQuitGreaterThanDone',
  'timerTotalMin', 'timerCompletionRateMin', 'timerCompletionRateMaxExclusive',
  'todayTodosGreaterThanYesterday', 'todayFocusGreaterThanYesterday', 'yesterdayZero', 'todayMovement',
  'todayProductivityAboveRecentAverage', 'last3ActiveDaysConsistent',
  'recent7FocusMin', 'recent7FocusVsPrevious7MinRatio', 'recent7TodosMin', 'recent7TodosVsPrevious7MinRatio',
  'last10TimersCompletedMin',
  'daysTogetherMin', 'daysTogetherMax', 'sessionMinutesMin',
  'selfMoodIn', 'moodStageIn',
  'absenceHoursMin', 'absenceHoursMaxExclusive'
]);

const PLACEHOLDER_KEYS = new Set(['todos', 'focus', 'streak', 'quit', 'done', 'pending', 'days', 'hours']);

function parseClock(value) {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [h, m] = value.split(':').map(Number);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function isTimeInRange(localMinutes, start, endInclusive) {
  const s = parseClock(start);
  if (s === null) return false;
  if (!endInclusive) return localMinutes >= s;
  const e = parseClock(endInclusive);
  if (e === null) return false;
  if (s <= e) return localMinutes >= s && localMinutes <= e;
  // Gece yarısını aşan aralık: 22:30–01:00 gibi.
  return localMinutes >= s || localMinutes <= e;
}

function extractPlaceholders(text) {
  return [...String(text || '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}

function interpolateDialogue(text, vars) {
  return String(text || '').replace(/\{(\w+)\}/g, (m, key) => (vars[key] !== undefined && vars[key] !== null ? String(vars[key]) : m));
}

function validateDialogueData(data = DATA) {
  const errors = [];
  if (!data || !Array.isArray(data.dialogues)) return ['dialogues dizisi bulunamadı'];
  const ids = new Set();
  const texts = new Set();
  for (const [index, d] of data.dialogues.entries()) {
    const at = `dialogues[${index}]`;
    if (!d || typeof d !== 'object') { errors.push(`${at}: nesne değil`); continue; }
    if (!d.id || typeof d.id !== 'string') errors.push(`${at}: id eksik`);
    else if (ids.has(d.id)) errors.push(`${at}: duplicate id ${d.id}`);
    else ids.add(d.id);
    if (!d.text || typeof d.text !== 'string') errors.push(`${at}: metin eksik`);
    else if (texts.has(d.text)) errors.push(`${at}: duplicate metin`);
    else texts.add(d.text);
    if (!VALID_CATEGORIES.has(d.category)) errors.push(`${at}: bilinmeyen kategori ${d.category}`);
    if (!VALID_RARITIES.has(d.rarity)) errors.push(`${at}: bilinmeyen rarity ${d.rarity}`);
    const cond = d.conditions || {};
    for (const key of Object.keys(cond)) if (!CONDITION_KEYS.has(key)) errors.push(`${at}: bilinmeyen koşul ${key}`);
    if (cond.timeStart && parseClock(cond.timeStart) === null) errors.push(`${at}: geçersiz timeStart`);
    if (cond.timeEndInclusive && parseClock(cond.timeEndInclusive) === null) errors.push(`${at}: geçersiz timeEndInclusive`);
    for (const [minKey, maxKey] of [
      ['todayTodosMin','todayTodosMax'], ['pendingTodosMin','pendingTodosMax'], ['todayFocusMin','todayFocusMax'],
      ['streakMin','streakMax'], ['daysTogetherMin','daysTogetherMax']
    ]) {
      if (Number.isFinite(cond[minKey]) && Number.isFinite(cond[maxKey]) && cond[minKey] > cond[maxKey]) errors.push(`${at}: ${minKey} > ${maxKey}`);
    }
    for (const ph of extractPlaceholders(d.text)) if (!PLACEHOLDER_KEYS.has(ph)) errors.push(`${at}: desteklenmeyen placeholder {${ph}}`);
  }
  if (Number.isFinite(data.count) && data.count !== data.dialogues.length) errors.push(`count=${data.count}, gerçek=${data.dialogues.length}`);
  return errors;
}

function checkMinMax(value, cond, base) {
  const exact = cond[`${base}Exact`];
  if (exact !== undefined && value !== exact) return false;
  const min = cond[`${base}Min`];
  if (min !== undefined && value < min) return false;
  const max = cond[`${base}Max`];
  if (max !== undefined && value > max) return false;
  return true;
}

function isDialogueEligible(dialogue, ctx, state = null, config = DEFAULT_CONFIG) {
  if (!dialogue || !ctx) return false;
  const c = dialogue.conditions || {};
  if (!checkMinMax(ctx.todayTodos, c, 'todayTodos')) return false;
  if (!checkMinMax(ctx.pendingTodos, c, 'pendingTodos')) return false;
  if (!checkMinMax(ctx.todayFocus, c, 'todayFocus')) return false;
  if (!checkMinMax(ctx.streak, c, 'streak')) return false;
  if (!checkMinMax(ctx.daysTogether, c, 'daysTogether')) return false;

  if (c.totalTodosMin !== undefined && ctx.totalTodos < c.totalTodosMin) return false;
  if (c.todayTimersDoneExact !== undefined && ctx.todayTimersDone !== c.todayTimersDoneExact) return false;
  if (c.isPajama !== undefined && !!ctx.isPajama !== c.isPajama) return false;
  if (c.timeStart && !isTimeInRange(ctx.localMinutesOfDay, c.timeStart, c.timeEndInclusive)) return false;

  if (c.timersDoneMin !== undefined && ctx.timersDone < c.timersDoneMin) return false;
  if (c.timersQuitMin !== undefined && ctx.timersQuit < c.timersQuitMin) return false;
  if (c.timersDoneGreaterThanQuit && !(ctx.timersDone > ctx.timersQuit)) return false;
  if (c.timersQuitGreaterThanDone && !(ctx.timersQuit > ctx.timersDone)) return false;
  if (c.timerTotalMin !== undefined && ctx.timerTotal < c.timerTotalMin) return false;
  if (c.timerCompletionRateMin !== undefined && ctx.timerCompletionRate < c.timerCompletionRateMin) return false;
  if (c.timerCompletionRateMaxExclusive !== undefined && ctx.timerCompletionRate >= c.timerCompletionRateMaxExclusive) return false;

  if (c.todayTodosGreaterThanYesterday && !(ctx.todayTodos > ctx.yesterdayTodos)) return false;
  if (c.todayFocusGreaterThanYesterday && !(ctx.todayFocus > ctx.yesterdayFocus)) return false;
  if (c.yesterdayZero && !(ctx.yesterdayTodos === 0 && ctx.yesterdayFocus === 0)) return false;
  if (c.todayMovement && !(ctx.todayTodos >= 2 || ctx.todayFocus >= 25)) return false;
  if (c.todayProductivityAboveRecentAverage && !ctx.todayProductivityAboveRecentAverage) return false;
  if (c.last3ActiveDaysConsistent && !ctx.last3ActiveDaysConsistent) return false;
  if (c.recent7FocusMin !== undefined && ctx.recent7Focus < c.recent7FocusMin) return false;
  if (c.recent7FocusVsPrevious7MinRatio !== undefined) {
    if (ctx.previous7Focus <= 0 || ctx.recent7Focus / ctx.previous7Focus < c.recent7FocusVsPrevious7MinRatio) return false;
  }
  if (c.recent7TodosMin !== undefined && ctx.recent7Todos < c.recent7TodosMin) return false;
  if (c.recent7TodosVsPrevious7MinRatio !== undefined) {
    if (ctx.previous7Todos <= 0 || ctx.recent7Todos / ctx.previous7Todos < c.recent7TodosVsPrevious7MinRatio) return false;
  }
  if (c.last10TimersCompletedMin !== undefined && ctx.last10TimersCompleted < c.last10TimersCompletedMin) return false;

  if (c.sessionMinutesMin !== undefined && ctx.sessionMinutes < c.sessionMinutesMin) return false;
  if (c.selfMoodIn && !c.selfMoodIn.includes(ctx.selfMood)) return false;
  if (c.moodStageIn && !c.moodStageIn.includes(ctx.moodStage)) return false;
  if (c.absenceHoursMin !== undefined && ctx.absenceHours < c.absenceHoursMin) return false;
  if (c.absenceHoursMaxExclusive !== undefined && ctx.absenceHours >= c.absenceHoursMaxExclusive) return false;

  // Ultra rare görüldüyse uzun süre tekrar seçme.
  if (state && dialogue.rarity === 'ultra_rare') {
    const seenAt = state.seenAtById?.[dialogue.id];
    if (seenAt && ctx.now - seenAt < config.ultraRareRepeatDays * DAY) return false;
  }
  return true;
}

function weightedPick(entries, weightFn, random = Math.random) {
  if (!entries.length) return null;
  const weights = entries.map((x) => Math.max(0, Number(weightFn(x)) || 0));
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return entries[Math.floor(random() * entries.length)];
  let needle = random() * total;
  for (let i = 0; i < entries.length; i++) {
    needle -= weights[i];
    if (needle <= 0) return entries[i];
  }
  return entries[entries.length - 1];
}

function topicSignature(topic, ctx) {
  switch (topic) {
    case 'todayTodos': return `${ctx.todayTodos}:${ctx.pendingTodos}:${ctx.totalTodos}`;
    case 'todayFocus': return `${ctx.todayFocus}:${ctx.todayTimersDone}`;
    case 'productivityCombo': return `${ctx.todayTodos}:${ctx.todayFocus}:${ctx.pendingTodos}`;
    case 'productivityTrend': return `${ctx.todayTodos}:${ctx.todayFocus}:${ctx.recent7Todos}:${ctx.recent7Focus}:${ctx.previous7Todos}:${ctx.previous7Focus}`;
    case 'pendingTodos': return `${ctx.pendingTodos}:${ctx.recent7Todos}`;
    case 'streak': return String(ctx.streak);
    case 'timerHistory': return `${ctx.timersDone}:${ctx.timersQuit}:${ctx.last10TimersCompleted}`;
    case 'relationship':
    case 'rareRelationship': return String(ctx.daysTogether);
    case 'rareMood': return `${ctx.moodStage}:${ctx.selfMood || ''}`;
    case 'time': return String(Math.floor(ctx.localMinutesOfDay / 60));
    case 'return': return String(Math.floor(ctx.absenceHours));
    default: return topic || '';
  }
}

const DEFAULT_STATE = {
  currentId: null,
  selectedAt: 0,
  nextAt: 0,
  currentSeen: false,
  recentIds: [],
  recentCategories: [],
  topicCooldowns: {},
  pendingRareId: null,
  seenAtById: {},
  lastMeaningfulActiveAt: 0,
  timerHistory: [],
  focusDeferred: false
};

class HomeDialogueEngine {
  constructor({ store, random = Math.random, logger = () => {}, onChange = () => {}, config = {} } = {}) {
    if (!store) throw new Error('HomeDialogueEngine için store gerekli');
    this.store = store;
    this.random = random;
    this.logger = logger;
    this.onChange = onChange;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      categoryWeights: { ...DEFAULT_CONFIG.categoryWeights, ...(config.categoryWeights || {}) },
      rarityWeights: { ...DEFAULT_CONFIG.rarityWeights, ...(config.rarityWeights || {}) }
    };
    this.dialogues = DATA.dialogues;
    this.byId = new Map(this.dialogues.map((d) => [d.id, d]));
    const saved = store.get() || {};
    this.state = {
      ...structuredClone(DEFAULT_STATE),
      ...saved,
      recentIds: Array.isArray(saved.recentIds) ? saved.recentIds.slice(-this.config.recentLimit) : [],
      recentCategories: Array.isArray(saved.recentCategories) ? saved.recentCategories.slice(-this.config.categoryHistoryLimit) : [],
      topicCooldowns: saved.topicCooldowns && typeof saved.topicCooldowns === 'object' ? saved.topicCooldowns : {},
      seenAtById: saved.seenAtById && typeof saved.seenAtById === 'object' ? saved.seenAtById : {},
      timerHistory: Array.isArray(saved.timerHistory) ? saved.timerHistory.slice(-20) : []
    };
    this.sessionStartedAt = Date.now();
    const lastActive = Number(this.state.lastMeaningfulActiveAt) || 0;
    this.pendingReturnAbsenceHours = lastActive ? Math.max(0, (this.sessionStartedAt - lastActive) / HOUR) : 0;
    this.returnHandledThisSession = false;
    this.wasMeaningfullyActive = false;
    this.lastMeaningfulPersistAt = 0;
    this.debug = process.env.NERO_HOME_DEBUG === '1' || process.argv.includes('--home-dialogue-debug');

    const errors = validateDialogueData(DATA);
    if (errors.length) {
      for (const error of errors) this.logger('[home-dialogue validation]', error);
      throw new Error(`Home dialogue verisi geçersiz: ${errors.length} hata`);
    }
  }

  _save() {
    this.store.set(this.state);
  }

  _debug(event, payload = {}) {
    if (!this.debug) return;
    this.logger('[home-dialogue]', event, payload);
  }

  scheduleNext(now = Date.now(), min = this.config.intervalMinMinutes, max = this.config.intervalMaxMinutes) {
    this.state.nextAt = now + (min + this.random() * (max - min)) * MIN;
    this._save();
    return this.state.nextAt;
  }

  recordTimerResult(completed, at = Date.now()) {
    this.state.timerHistory.push({ at, completed: !!completed });
    this.state.timerHistory = this.state.timerHistory.slice(-20);
    this._save();
  }

  noteActivity(isMeaningfullyActive, now = Date.now()) {
    if (!isMeaningfullyActive) {
      this.wasMeaningfullyActive = false;
      return;
    }
    if (!this.wasMeaningfullyActive) {
      const last = Number(this.state.lastMeaningfulActiveAt) || 0;
      const absence = last ? (now - last) / HOUR : 0;
      if (absence >= 24) {
        this.pendingReturnAbsenceHours = absence;
        this.returnHandledThisSession = false;
      }
      this.wasMeaningfullyActive = true;
    }
    if (!this.state.lastMeaningfulActiveAt || now - this.lastMeaningfulPersistAt >= MIN) {
      this.state.lastMeaningfulActiveAt = now;
      this.lastMeaningfulPersistAt = now;
      this._save();
    }
  }

  currentItem() {
    return this.state.currentId ? this.byId.get(this.state.currentId) || null : null;
  }

  _vars(ctx) {
    return {
      todos: ctx.todayTodos,
      focus: ctx.todayFocus,
      streak: ctx.streak,
      quit: ctx.timersQuit,
      done: ctx.timersDone,
      pending: ctx.pendingTodos,
      days: ctx.daysTogether,
      hours: Math.floor(ctx.totalFocusMin / 60)
    };
  }

  _render(item, ctx) {
    if (!item) return null;
    const vars = this._vars(ctx);
    const needed = extractPlaceholders(item.text);
    if (needed.some((key) => vars[key] === undefined || vars[key] === null)) return null;
    return interpolateDialogue(item.text, vars);
  }

  _topicBlocked(item, ctx) {
    if (!item.topic || !item.topicCooldownMinutes) return false;
    const row = this.state.topicCooldowns[item.topic];
    if (!row) return false;
    const signature = topicSignature(item.topic, ctx);
    // Veri gerçekten değiştiyse konu tekrar konuşulabilir.
    if (row.signature !== signature) return false;
    return ctx.now - row.at < item.topicCooldownMinutes * MIN;
  }

  _commitConsumed(item, ctx) {
    if (!item) return;
    this.state.recentIds = [...this.state.recentIds.filter((x) => x !== item.id), item.id].slice(-this.config.recentLimit);
    this.state.recentCategories = [...this.state.recentCategories, item.category].slice(-this.config.categoryHistoryLimit);
    if (item.topic && item.topicCooldownMinutes) {
      this.state.topicCooldowns[item.topic] = { at: ctx.now, signature: topicSignature(item.topic, ctx) };
    }
    this.state.seenAtById[item.id] = ctx.now;
  }

  _chooseFrom(items, ctx) {
    if (!items.length) return null;
    // Son iki kategori aynıysa ve alternatif varsa üçüncüyü engelle.
    const last = this.state.recentCategories;
    let pool = items;
    if (last.length >= this.config.maxSameCategoryInRow) {
      const recent = last.slice(-this.config.maxSameCategoryInRow);
      if (recent.every((x) => x === recent[0])) {
        const alt = pool.filter((x) => x.category !== recent[0]);
        if (alt.length) pool = alt;
      }
    }

    const categories = [...new Set(pool.map((x) => x.category))];
    const chosenCategory = weightedPick(categories, (cat) => this.config.categoryWeights[cat] ?? 1, this.random);
    const inCategory = pool.filter((x) => x.category === chosenCategory);
    return weightedPick(inCategory, (item) => {
      const rarity = this.config.rarityWeights[item.rarity] ?? 1;
      const specific = 1 + 0.25 * (Number(item.specificityBonus) || 0);
      return rarity * specific;
    }, this.random);
  }

  _eligible(ctx, { onlyCategory = null, ignoreRecent = false, ignoreCooldowns = false } = {}) {
    let pool = this.dialogues.filter((d) => (!onlyCategory || d.category === onlyCategory) && isDialogueEligible(d, ctx, this.state, this.config));
    if (!ignoreRecent) pool = pool.filter((d) => !this.state.recentIds.includes(d.id));
    if (!ignoreCooldowns) pool = pool.filter((d) => !this._topicBlocked(d, ctx));
    // Return normal havuzda asla dolaşmaz; yalnızca öncelikli dönüş state'inde seçilir.
    if (!onlyCategory) pool = pool.filter((d) => d.category !== 'return');
    return pool;
  }

  _selectReturn(ctx) {
    if (this.returnHandledThisSession || this.pendingReturnAbsenceHours < 24) return null;
    const returnCtx = { ...ctx, absenceHours: this.pendingReturnAbsenceHours };
    let pool = this._eligible(returnCtx, { onlyCategory: 'return' });
    if (!pool.length) pool = this._eligible(returnCtx, { onlyCategory: 'return', ignoreRecent: true, ignoreCooldowns: true });
    const item = weightedPick(pool, (x) => this.config.rarityWeights[x.rarity] ?? 1, this.random);
    if (item) this.returnHandledThisSession = true;
    return item ? { item, ctx: returnCtx } : null;
  }

  select(ctx, { reason = 'scheduled', allowReturn = true } = {}) {
    if (!ctx) return null;
    let selected = allowReturn ? this._selectReturn(ctx) : null;
    let item = selected?.item || null;
    let effectiveCtx = selected?.ctx || ctx;

    if (!item) {
      let pool = this._eligible(ctx);
      if (!pool.length) pool = this._eligible(ctx, { ignoreRecent: true });
      if (!pool.length) pool = this._eligible(ctx, { ignoreRecent: true, ignoreCooldowns: true });
      item = this._chooseFrom(pool, ctx);
    }

    if (!item) {
      // Son güvenlik ağı: veri hatasında kullanıcı undefined görmez.
      item = this.byId.get('home_general_001') || { id: 'fallback', category: 'general', rarity: 'common', text: 'Ben buradayım.', conditions: {} };
      effectiveCtx = ctx;
    }

    const text = this._render(item, effectiveCtx);
    if (!text || /\{\w+\}/.test(text)) {
      this._debug('placeholder-rejected', { id: item.id, text });
      if (item.id !== 'home_general_001') return this.select(ctx, { reason: `${reason}:fallback`, allowReturn: false });
    }

    this.state.currentId = item.id;
    this.state.selectedAt = ctx.now;
    this.state.currentSeen = !item.requiresSeen;
    this.state.pendingRareId = item.requiresSeen ? item.id : null;
    if (!item.requiresSeen) this._commitConsumed(item, ctx);
    this.scheduleNext(ctx.now);
    this._save();
    this._debug('selected', { reason, id: item.id, category: item.category, rarity: item.rarity });
    this.onChange(this.publicState(ctx));
    return item;
  }

  ensureCurrent(ctx, { allowReturn = true } = {}) {
    if (!ctx) return null;
    // Uzun aradan dönüş normal current'ın önüne geçer.
    if (allowReturn && !this.returnHandledThisSession && this.pendingReturnAbsenceHours >= 24) {
      return this.select(ctx, { reason: 'return', allowReturn: true });
    }
    const item = this.currentItem();
    if (!item || !isDialogueEligible(item, ctx, this.state, this.config)) {
      if (item?.requiresSeen && !this.state.currentSeen) this.state.pendingRareId = null;
      return this.select(ctx, { reason: item ? 'invalid-current' : 'initial', allowReturn: false });
    }
    // Placeholder context değişmiş olabilir; render edilemiyorsa güvenli replacement.
    const text = this._render(item, ctx);
    if (!text || /\{\w+\}/.test(text)) return this.select(ctx, { reason: 'invalid-placeholder', allowReturn: false });
    if (!this.state.nextAt) this.scheduleNext(ctx.now);
    return item;
  }

  tick(ctx, { canRotate = true } = {}) {
    if (!ctx) return false;
    this.ensureCurrent(ctx);
    if (!canRotate) return false;

    if (ctx.isFocusRunning) {
      if (ctx.now >= this.state.nextAt) {
        this.state.focusDeferred = true;
        this._save();
      }
      return false;
    }
    if (this.state.focusDeferred) {
      this.state.focusDeferred = false;
      this.scheduleNext(ctx.now, 1, 3);
      return false;
    }

    if (ctx.now < this.state.nextAt) return false;
    const current = this.currentItem();
    if (current?.requiresSeen && !this.state.currentSeen) {
      // Nadir replik kullanıcı görmeden kaybolmasın. Koşul bozulduysa ensureCurrent zaten değiştirdi.
      this.scheduleNext(ctx.now, 2, 4);
      return false;
    }
    this.select(ctx, { reason: 'scheduled', allowReturn: true });
    return true;
  }

  markSeen(id, ctx) {
    if (!id || id !== this.state.currentId) return false;
    const item = this.currentItem();
    if (!item) return false;
    if (!this.state.currentSeen) {
      this.state.currentSeen = true;
      this.state.pendingRareId = null;
      this._commitConsumed(item, ctx);
      // Panel kapalıyken uzun süre beklemiş nadir replik kullanıcı açar açmaz kaybolmasın.
      if (this.state.nextAt <= ctx.now + MIN) this.scheduleNext(ctx.now);
      this._save();
      this._debug('seen', { id });
    }
    return true;
  }

  publicState(ctx) {
    const item = this.ensureCurrentNoSelect(ctx);
    const text = item ? this._render(item, ctx) : '';
    return {
      id: item?.id || null,
      text: text || '',
      category: item?.category || 'general',
      rarity: item?.rarity || 'common',
      selectedAt: this.state.selectedAt || 0,
      nextAt: this.state.nextAt || 0,
      dismissed: false,
      pendingRare: !!(item?.requiresSeen && !this.state.currentSeen)
    };
  }

  ensureCurrentNoSelect(ctx) {
    const item = this.currentItem();
    if (!item) return null;
    return isDialogueEligible(item, ctx, this.state, this.config) ? item : null;
  }

  debugSelect(id, ctx) {
    if (!this.debug) return false;
    const item = this.byId.get(id);
    if (!item) return false;
    this.state.currentId = item.id;
    this.state.selectedAt = ctx.now;
    this.state.currentSeen = !item.requiresSeen;
    this.state.pendingRareId = item.requiresSeen ? item.id : null;
    this.scheduleNext(ctx.now);
    this._save();
    this.onChange(this.publicState(ctx));
    return true;
  }
}

module.exports = {
  HomeDialogueEngine,
  DEFAULT_CONFIG,
  validateDialogueData,
  isDialogueEligible,
  isTimeInRange,
  extractPlaceholders,
  interpolateDialogue,
  topicSignature
};
