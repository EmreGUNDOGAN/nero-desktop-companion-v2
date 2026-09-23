const test = require('node:test');
const assert = require('node:assert/strict');
const { Stats } = require('../src/main/stats');
const { normalizeTodoTiming } = require('../src/main/todo-stopwatch');
const { userMonth, dataMonths } = require('../src/main/moodboard');

class MemoryStore {
  constructor(seed = {}) { this.data = structuredClone(seed); }
  get() { return structuredClone(this.data); }
  set(next) { this.data = structuredClone(next); return this.get(); }
}

test('4.2.x stats verisi 4.3.0 display baseline olmadan lifetime görünümü korur', () => {
  const old = {
    firstUsedAt: Date.now() - 20 * 86400000,
    totals: { todos: 41, todoCreated: 60, focusMin: 920, timersDone: 13, timersQuit: 4, notes: 18, pets: 33 },
    bestStreak: 8,
    streak: 3,
    achievements: { ilk_is: 1234 },
    desk: { fincan: 2345 }
  };
  const stats = new Stats(new MemoryStore(old));
  const sum = stats.summary();

  assert.equal(sum.totals.todos, 41);
  assert.equal(sum.totals.focusMin, 920);
  assert.equal(sum.display.baselineAt, null);
  assert.equal(sum.display.totals.todos, 41);
  assert.equal(sum.display.totals.focusMin, 920);
  assert.equal(sum.display.bestStreak >= 8, true);
  assert.equal(sum.unlockedIds.includes('ilk_is'), true);
});

test('4.2.x todo verileri yeni timing alanları olmadan kayıpsız normalize edilir', () => {
  const oldTodo = {
    id: 'legacy-1',
    text: 'Eski iş',
    done: true,
    createdAt: 1700000000000,
    doneAt: 1700001000000,
    remindAt: null,
    reminded: false,
    archivedAt: 1700002000000
  };
  const next = normalizeTodoTiming(oldTodo);

  assert.equal(next.id, oldTodo.id);
  assert.equal(next.text, oldTodo.text);
  assert.equal(next.done, true);
  assert.equal(next.archivedAt, oldTodo.archivedAt);
  assert.equal(next.plannedDurationMin, null);
  assert.equal(next.actualDurationMs, 0);
  assert.equal(next.stopwatchStartedAt, null);
  assert.equal(next.focusCreditedMin, 0);
});

test('eski moodboard gün kayıtları dinamik aylık modele taşınmadan okunmaya devam eder', () => {
  const oldUserMood = {
    days: {
      '2026-02-01': 'green',
      '2026-02-14': 'yellow',
      '2026-02-28': 'red'
    },
    exports: {}
  };
  const month = userMonth(oldUserMood, '2026-02', new Date(2026, 2, 1));
  assert.equal(month.length, 28);
  assert.equal(month[0].value, 'green');
  assert.equal(month[13].value, 'yellow');
  assert.equal(month[27].value, 'red');
  assert.deepEqual(dataMonths(oldUserMood, { days: {} }, '2026-09'), ['2026-02']);
});
