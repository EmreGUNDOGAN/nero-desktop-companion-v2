const test = require('node:test');
const assert = require('node:assert/strict');
const DATA = require('../src/data/home-dialogues.tr.json');
const {
  HomeDialogueEngine,
  validateDialogueData,
  isDialogueEligible,
  isTimeInRange,
  extractPlaceholders,
  interpolateDialogue
} = require('../src/main/home-dialogue');

class MemoryStore {
  constructor(seed = {}) { this.data = structuredClone(seed); }
  get() { return this.data; }
  set(next) { this.data = structuredClone(next); return this.data; }
}

function baseContext(overrides = {}) {
  const now = Date.now();
  return {
    now,
    localMinutesOfDay: 12 * 60,
    todayTodos: 0,
    pendingTodos: 0,
    totalTodos: 0,
    todayFocus: 0,
    todayTimersDone: 0,
    streak: 1,
    daysTogether: 1,
    timersDone: 0,
    timersQuit: 0,
    timerTotal: 0,
    timerCompletionRate: 0,
    yesterdayTodos: 0,
    yesterdayFocus: 0,
    recent7Todos: 0,
    recent7Focus: 0,
    previous7Todos: 0,
    previous7Focus: 0,
    todayProductivityAboveRecentAverage: false,
    last3ActiveDaysConsistent: false,
    last10TimersCompleted: 0,
    sessionMinutes: 0,
    selfMood: null,
    moodStage: 'content',
    isPajama: false,
    isFocusRunning: false,
    absenceHours: 0,
    totalFocusMin: 0,
    ...overrides
  };
}

const byId = new Map(DATA.dialogues.map((x) => [x.id, x]));

test('665 replik datası yapısal olarak geçerli ve benzersiz', () => {
  assert.equal(DATA.dialogues.length, 665);
  assert.deepEqual(validateDialogueData(DATA), []);
  assert.equal(new Set(DATA.dialogues.map((x) => x.id)).size, 665);
  assert.equal(new Set(DATA.dialogues.map((x) => x.text)).size, 665);
});

test('gece yarısını aşan saat aralığı doğru çalışır', () => {
  assert.equal(isTimeInRange(22 * 60 + 30, '22:30', '01:00'), true);
  assert.equal(isTimeInRange(0 * 60 + 45, '22:30', '01:00'), true);
  assert.equal(isTimeInRange(1 * 60, '22:30', '01:00'), true);
  assert.equal(isTimeInRange(1 * 60 + 1, '22:30', '01:00'), false);
});

test('sabah/gece sınır replikleri yanlış saatte eligible olmaz', () => {
  const night = byId.get('home_time_045');
  const morning = byId.get('home_time_001');
  assert.equal(isDialogueEligible(night, baseContext({ localMinutesOfDay: 4 * 60 + 59 })), true);
  assert.equal(isDialogueEligible(night, baseContext({ localMinutesOfDay: 5 * 60 })), false);
  assert.equal(isDialogueEligible(morning, baseContext({ localMinutesOfDay: 4 * 60 + 59 })), false);
  assert.equal(isDialogueEligible(morning, baseContext({ localMinutesOfDay: 5 * 60 })), true);
});

test('üretkenlik koşulları yalnız doğru gerçek state ile açılır', () => {
  const sixToNine = byId.get('home_productivity_015');
  assert.equal(isDialogueEligible(sixToNine, baseContext({ todayTodos: 5 })), false);
  assert.equal(isDialogueEligible(sixToNine, baseContext({ todayTodos: 6 })), true);
  assert.equal(isDialogueEligible(sixToNine, baseContext({ todayTodos: 9 })), true);
  assert.equal(isDialogueEligible(sixToNine, baseContext({ todayTodos: 10 })), false);

  const allDone = byId.get('home_productivity_020');
  assert.equal(isDialogueEligible(allDone, baseContext({ totalTodos: 1, pendingTodos: 0 })), false);
  assert.equal(isDialogueEligible(allDone, baseContext({ totalTodos: 2, pendingTodos: 0 })), true);
  assert.equal(isDialogueEligible(allDone, baseContext({ totalTodos: 3, pendingTodos: 1 })), false);
});

test('365 günlük ilişki cümlesi 364. günde çıkmaz', () => {
  const anniversary = byId.get('home_relationship_029');
  assert.equal(isDialogueEligible(anniversary, baseContext({ daysTogether: 364 })), false);
  assert.equal(isDialogueEligible(anniversary, baseContext({ daysTogether: 365 })), true);
  assert.equal(isDialogueEligible(anniversary, baseContext({ daysTogether: 374 })), true);
  assert.equal(isDialogueEligible(anniversary, baseContext({ daysTogether: 375 })), false);
});

test('placeholderlar eksiksiz bulunur ve interpolate edilir', () => {
  const text = '{todos} iş, {focus} dakika, {streak} gün.';
  assert.deepEqual(extractPlaceholders(text), ['todos', 'focus', 'streak']);
  assert.equal(interpolateDialogue(text, { todos: 4, focus: 50, streak: 7 }), '4 iş, 50 dakika, 7 gün.');
});

test('rare replik kullanıcı görmeden recent listesine tüketilmez', () => {
  const old = process.env.NERO_HOME_DEBUG;
  process.env.NERO_HOME_DEBUG = '1';
  const store = new MemoryStore();
  const engine = new HomeDialogueEngine({ store, random: () => 0.5 });
  const ctx = baseContext({ daysTogether: 100 });
  assert.equal(engine.debugSelect('home_rare_019', ctx), true);
  assert.equal(engine.state.currentSeen, false);
  assert.equal(engine.state.recentIds.includes('home_rare_019'), false);
  engine.markSeen('home_rare_019', ctx);
  assert.equal(engine.state.currentSeen, true);
  assert.equal(engine.state.recentIds.includes('home_rare_019'), true);
  if (old === undefined) delete process.env.NERO_HOME_DEBUG; else process.env.NERO_HOME_DEBUG = old;
});

test('focus sırasında zamanı dolan home scheduler repliği değiştirmez ve sonrasında 1-3 dk erteler', () => {
  const store = new MemoryStore();
  const engine = new HomeDialogueEngine({ store, random: () => 0.5 });
  const ctx = baseContext();
  engine.ensureCurrent(ctx, { allowReturn: false });
  const id = engine.state.currentId;
  engine.state.nextAt = ctx.now - 1;
  engine.tick({ ...ctx, isFocusRunning: true }, { canRotate: true });
  assert.equal(engine.state.currentId, id);
  assert.equal(engine.state.focusDeferred, true);
  const later = { ...ctx, now: ctx.now + 1000, isFocusRunning: false };
  engine.tick(later, { canRotate: true });
  assert.equal(engine.state.currentId, id);
  assert.equal(engine.state.focusDeferred, false);
  assert.ok(engine.state.nextAt >= later.now + 60_000 && engine.state.nextAt <= later.now + 180_000);
});

test('son 20 ID kalıcı anti-repeat belleğinde tutulur', () => {
  let seed = 0;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const store = new MemoryStore();
  const engine = new HomeDialogueEngine({ store, random });
  let ctx = baseContext({ todayTodos: 4, pendingTodos: 2, totalTodos: 6, todayFocus: 45, streak: 5, daysTogether: 20 });
  for (let i = 0; i < 35; i++) {
    ctx = { ...ctx, now: ctx.now + 11 * 60_000 };
    engine.select(ctx, { allowReturn: false });
  }
  assert.ok(engine.state.recentIds.length <= 20);
  assert.equal(engine.state.recentIds.length, new Set(engine.state.recentIds).size);
  const persisted = store.get();
  assert.deepEqual(persisted.recentIds, engine.state.recentIds);
});

test('665 repliğin her koşulu en az bir sentetik context ile ulaşılabilir', () => {
  function satisfyingContext(item) {
    const c = item.conditions || {};
    const ctx = baseContext();
    const setRange = (base, target) => {
      if (c[`${base}Exact`] !== undefined) ctx[target] = c[`${base}Exact`];
      else if (c[`${base}Min`] !== undefined) ctx[target] = c[`${base}Min`];
      if (c[`${base}Max`] !== undefined && ctx[target] > c[`${base}Max`]) ctx[target] = c[`${base}Max`];
    };
    setRange('todayTodos', 'todayTodos');
    setRange('pendingTodos', 'pendingTodos');
    setRange('todayFocus', 'todayFocus');
    setRange('streak', 'streak');
    setRange('daysTogether', 'daysTogether');
    if (c.totalTodosMin !== undefined) ctx.totalTodos = c.totalTodosMin;
    ctx.totalTodos = Math.max(ctx.totalTodos, ctx.pendingTodos);
    if (c.todayTimersDoneExact !== undefined) ctx.todayTimersDone = c.todayTimersDoneExact;
    if (c.timeStart) {
      const [h,m] = c.timeStart.split(':').map(Number);
      ctx.localMinutesOfDay = h * 60 + m;
    }
    if (c.isPajama !== undefined) ctx.isPajama = c.isPajama;
    if (c.timersDoneMin !== undefined) ctx.timersDone = c.timersDoneMin;
    if (c.timersQuitMin !== undefined) ctx.timersQuit = c.timersQuitMin;
    if (c.timersDoneGreaterThanQuit) ctx.timersDone = Math.max(ctx.timersDone, ctx.timersQuit + 1);
    if (c.timersQuitGreaterThanDone) ctx.timersQuit = Math.max(ctx.timersQuit, ctx.timersDone + 1);
    if (c.timerTotalMin !== undefined && ctx.timersDone + ctx.timersQuit < c.timerTotalMin) {
      if (c.timerCompletionRateMaxExclusive !== undefined || c.timersQuitGreaterThanDone) {
        ctx.timersDone = Math.floor((c.timerTotalMin - 1) / 2);
        ctx.timersQuit = c.timerTotalMin - ctx.timersDone;
      } else {
        ctx.timersDone = c.timerTotalMin;
      }
    }
    ctx.timerTotal = ctx.timersDone + ctx.timersQuit;
    if (c.timerCompletionRateMin !== undefined) {
      ctx.timerTotal = Math.max(ctx.timerTotal, 100);
      ctx.timersDone = Math.ceil(ctx.timerTotal * c.timerCompletionRateMin);
      ctx.timersQuit = ctx.timerTotal - ctx.timersDone;
    }
    if (c.timerCompletionRateMaxExclusive !== undefined) {
      ctx.timerTotal = Math.max(ctx.timerTotal, 10);
      ctx.timersDone = Math.max(0, Math.ceil(ctx.timerTotal * c.timerCompletionRateMaxExclusive) - 1);
      ctx.timersQuit = ctx.timerTotal - ctx.timersDone;
    }
    if (c.timersDoneGreaterThanQuit && !(ctx.timersDone > ctx.timersQuit)) ctx.timersDone = ctx.timersQuit + 1;
    if (c.timersQuitGreaterThanDone && !(ctx.timersQuit > ctx.timersDone)) ctx.timersQuit = ctx.timersDone + 1;
    ctx.timerTotal = ctx.timersDone + ctx.timersQuit;
    ctx.timerCompletionRate = ctx.timerTotal ? ctx.timersDone / ctx.timerTotal : 0;

    if (c.todayTodosGreaterThanYesterday) { ctx.todayTodos = Math.max(ctx.todayTodos, 2); ctx.yesterdayTodos = ctx.todayTodos - 1; }
    if (c.todayFocusGreaterThanYesterday) { ctx.todayFocus = Math.max(ctx.todayFocus, 25); ctx.yesterdayFocus = ctx.todayFocus - 1; }
    if (c.yesterdayZero) { ctx.yesterdayTodos = 0; ctx.yesterdayFocus = 0; }
    if (c.todayMovement) ctx.todayTodos = Math.max(ctx.todayTodos, 2);
    if (c.todayProductivityAboveRecentAverage) ctx.todayProductivityAboveRecentAverage = true;
    if (c.last3ActiveDaysConsistent) ctx.last3ActiveDaysConsistent = true;
    if (c.recent7FocusMin !== undefined) ctx.recent7Focus = c.recent7FocusMin;
    if (c.recent7FocusVsPrevious7MinRatio !== undefined) {
      ctx.previous7Focus = 100;
      ctx.recent7Focus = Math.max(ctx.recent7Focus, Math.ceil(100 * c.recent7FocusVsPrevious7MinRatio));
    }
    if (c.recent7TodosMin !== undefined) ctx.recent7Todos = c.recent7TodosMin;
    if (c.recent7TodosVsPrevious7MinRatio !== undefined) {
      ctx.previous7Todos = 10;
      ctx.recent7Todos = Math.max(ctx.recent7Todos, Math.ceil(10 * c.recent7TodosVsPrevious7MinRatio));
    }
    if (c.last10TimersCompletedMin !== undefined) ctx.last10TimersCompleted = c.last10TimersCompletedMin;
    if (c.sessionMinutesMin !== undefined) ctx.sessionMinutes = c.sessionMinutesMin;
    if (c.selfMoodIn) ctx.selfMood = c.selfMoodIn[0];
    if (c.moodStageIn) ctx.moodStage = c.moodStageIn[0];
    if (c.absenceHoursMin !== undefined) ctx.absenceHours = c.absenceHoursMin;
    if (c.absenceHoursMaxExclusive !== undefined && ctx.absenceHours >= c.absenceHoursMaxExclusive) ctx.absenceHours = c.absenceHoursMaxExclusive - 0.01;
    return ctx;
  }

  for (const item of DATA.dialogues) {
    const ctx = satisfyingContext(item);
    assert.equal(isDialogueEligible(item, ctx), true, `${item.id} sentetik context ile ulaşılamıyor`);
  }
});

test('bütün placeholderlı replikler güvenli değişkenlerle tamamen interpolate edilebilir', () => {
  const vars = { todos: 7, focus: 90, streak: 12, quit: 3, done: 8, pending: 2, days: 100, hours: 42 };
  for (const item of DATA.dialogues) {
    const rendered = interpolateDialogue(item.text, vars);
    assert.equal(/\{\w+\}/.test(rendered), false, `${item.id} placeholder bıraktı`);
  }
});
