const { contextBridge } = require('electron');

const calls = [];
const now = Date.now();
const currentKey = '2026-09';
const day = (n) => ({
  day: n,
  date: `2026-09-${String(n).padStart(2, '0')}`,
  value: n === 2 ? 'green' : n === 7 ? 'yellow' : n === 12 ? 'red' : null,
  future: n > 23
});
const neroDay = (n) => ({
  day: n,
  date: `2026-09-${String(n).padStart(2, '0')}`,
  cls: n % 6 === 0 ? 'c5' : null,
  label: n % 6 === 0 ? 'keyifli bir gündü' : null,
  future: n > 23
});
const pastDay = (n) => ({
  day: n,
  date: `2026-08-${String(n).padStart(2, '0')}`,
  value: n === 3 ? 'green' : null,
  future: false
});
const pastNeroDay = (n) => ({
  day: n,
  date: `2026-08-${String(n).padStart(2, '0')}`,
  cls: n % 8 === 0 ? 'c4' : null,
  label: n % 8 === 0 ? 'iyi bir gündü' : null,
  future: false
});

const state = {
  notes: [
    { id: 'n1', body: 'Toplantı notu\nİkinci satır', createdAt: now - 100000, updatedAt: now - 50000, archivedAt: null }
  ],
  todos: [
    {
      id: 't1', text: 'Strateji sunumunu bitir', done: false, createdAt: now - 10000, doneAt: null,
      remindAt: null, reminded: false, archivedAt: null,
      plannedDurationMin: 65, actualDurationMs: 3720000, stopwatchStartedAt: null, focusCreditedMin: 62
    },
    {
      id: 't2', text: 'Maili gönder', done: true, createdAt: now - 200000, doneAt: now - 5000,
      remindAt: null, reminded: false, archivedAt: null,
      plannedDurationMin: 15, actualDurationMs: 1080000, stopwatchStartedAt: null, focusCreditedMin: 18
    }
  ],
  settings: {
    themeId: 'default', scale: 1, talkativeness: 'normal', muted: false, showTimerBadge: true,
    sound: true, alwaysOnTop: true, lockPosition: false, stayVisible: true, desktopJokes: true,
    peekVisits: true, weatherFx: true, sceneBg: true, ambientSound: false, quickCapture: false,
    waterEvery: 0, breakEvery: 60, daySummary: true, autoUpdate: false, birthday: '',
    userName: 'Test', panelPinned: false, launchAtStartup: false, hidden: false, lastTimerMinutes: 25
  },
  mood: { happiness: 82, stage: 'content', asleep: false, ignoredMinutes: 2, label: 'Keyfi yerinde' },
  timer: { status: 'idle', remainingMs: 1500000, progress: 0, label: '' },
  themes: [{ id: 'default', name: 'Default', source: 'builtin', broken: false, errors: [] }],
  currentThemeId: 'default',
  ui: { skin: 'cozy' },
  stats: {
    today: { todos: 2, focus: 75, timersDone: 1, timersQuit: 0, notes: 1, pets: 2, todosCreated: 3 },
    week: [
      { day: '2026-09-17', weekday: 4, focus: 30, todos: 1 },
      { day: '2026-09-18', weekday: 5, focus: 45, todos: 2 },
      { day: '2026-09-19', weekday: 6, focus: 0, todos: 0 },
      { day: '2026-09-20', weekday: 0, focus: 60, todos: 2 },
      { day: '2026-09-21', weekday: 1, focus: 25, todos: 1 },
      { day: '2026-09-22', weekday: 2, focus: 90, todos: 3 },
      { day: '2026-09-23', weekday: 3, focus: 75, todos: 2 }
    ],
    totals: { todos: 123, todoCreated: 160, focusMin: 4320, timersDone: 88, timersQuit: 9, notes: 64, pets: 241 },
    display: {
      baselineAt: now - 86400000,
      totals: { todos: 4, todoCreated: 5, focusMin: 180, timersDone: 3, timersQuit: 1, notes: 2, pets: 6 },
      bestStreak: 2
    },
    streak: 7, bestStreak: 21, daysTogether: 140, daysActive: 120
  },
  dayMode: 'sakin',
  rest: false,
  achievements: [],
  desk: { items: [], next: null },
  jarCount: 3,
  moodboard: {
    key: currentKey, label: 'Eylül 2026',
    user: Array.from({ length: 30 }, (_, i) => day(i + 1)),
    nero: Array.from({ length: 30 }, (_, i) => neroDay(i + 1)),
    editable: true, currentKey,
    availableMonths: [
      { key: '2026-08', label: 'Ağustos 2026' },
      { key: '2026-09', label: 'Eylül 2026' }
    ]
  },
  update: { status: 'latest', version: '4.3.0', dismissed: false },
  home: {
    jab: 'Bugün sakin ilerliyoruz. Panik yok; ben buradayım.',
    dialogueId: 'test-jab', quote: { t: 'Bir şeyler yavaşça da tamamlanabilir.', nero: 'Nero' },
    archive: { total: 6, recent: Array.from({ length: 6 }, (_, i) => ({ text: `Tamamlanan iş ${i + 1}` })) },
    letter: { week: '2026-W39', text: 'Bu hafta fena değildin. Bunu çok büyütmeyeceğim.' }
  },
  version: '4.3.0'
};

const pastBoard = {
  key: '2026-08', label: 'Ağustos 2026',
  user: Array.from({ length: 31 }, (_, i) => pastDay(i + 1)),
  nero: Array.from({ length: 31 }, (_, i) => pastNeroDay(i + 1)),
  editable: false, currentKey,
  availableMonths: state.moodboard.availableMonths
};

contextBridge.exposeInMainWorld('nero', {
  invoke: async (channel, ...args) => {
    calls.push({ channel, args });
    if (channel === 'state:get') return structuredClone(state);
    if (channel === 'moodboard:get') return args[0] === '2026-08' ? structuredClone(pastBoard) : null;
    if (channel === 'stats:resetDisplay') return structuredClone(state.stats);
    if (channel === 'themes:reload') return structuredClone(state.themes);
    if (channel === 'settings:set') {
      state.settings[args[0]] = args[1];
      return structuredClone(state.settings);
    }
    if (channel === 'home:seen') return true;
    if (channel === 'todos:stopwatchStart' || channel === 'todos:stopwatchPause') return state.todos[0];
    return true;
  },
  send: (channel, ...args) => { calls.push({ channel, args }); },
  on: () => () => {},
  __getCalls: () => structuredClone(calls)
});
