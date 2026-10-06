const wardrobe = require('./wardrobe');
const motionRules=require('./motion-rules');
let lastMotionAt=0;
// Nero - ana süreç
// Karakter penceresini, paneli, tepsi simgesini, ruh hali döngüsünü, zamanlayıcıyı
// ve temaları yönetir.

const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const {
  app, BrowserWindow, ipcMain, screen, Menu, Tray, nativeImage, powerMonitor,
  protocol, net, shell, Notification, dialog, globalShortcut
} = require('electron');

// Veriler her zaman %APPDATA%\Nero altında dursun (kurulum betiği de burayı temizler).
app.setPath('userData', path.join(app.getPath('appData'), 'Nero'));
app.setAppUserModelId('com.stenwick.nero');
// Arıcılık 3D sahnesi ekran kartı olmayan sistemlerde de yazılımla çizilebilsin.
app.commandLine.appendSwitch('enable-unsafe-swiftshader');

const { JsonStore } = require('./store');
const { ThemeManager, SCHEME } = require('./themes');
const { Dialogue } = require('./dialogue');
const { Mood, HOUR, MIN } = require('./mood');
const { Timer } = require('./timer');
const { Stats, dayKey } = require('./stats');
const { HomeDialogueEngine } = require('./home-dialogue');
const { Journal, isoWeekKey } = require('./journal');
const { BeeGame, freshState } = require('./bee');
const { monthKey: moodMonthKey, monthLabelTr, userMonth, setUserMood, dataMonths, closedDataMonths, renderMoodboardSvg } = require('./moodboard');
const { svgToPng } = require('./moodboard-image');
const {
  finiteMin: todoFiniteMin,
  normalizeTodoTiming,
  start: startTodoStopwatch,
  pause: pauseTodoStopwatch,
  focusCredit: todoFocusCredit,
  applyCredit: applyTodoFocusCredit
} = require('./todo-stopwatch');
const todoTree = require('./todo-tree');
const { Budget, defaults: budgetDefaults } = require('./budget');
const { registerBudgetIPC, validateReceipt } = require('./budget-ipc');
const QUOTES = require('../data/quotes.tr.json');

protocol.registerSchemesAsPrivileged([
  { scheme: SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }
]);

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Sabitler
// ---------------------------------------------------------------------------
const BUBBLE_ZONE = 150;   // karakterin üstünde balon için ayrılan yükseklik (px)
const BUBBLE_WIDTH = 260;
const BADGE_ZONE = 34;     // karakterin altında zamanlayıcı rozeti için alan
const SIDE_PAD = 10;
const PANEL_DEFAULT = { width: 440, height: 660 }; // 12 px kenar boşluğu gölge içindir
const PANEL_MIN = { width: 380, height: 540 };
const PANEL_MAX = { width: 960, height: 1100 };

const TALK_INTERVALS = { // dakika [min, max]
  az: [20, 35],
  normal: [8, 15],
  cok: [4, 8]
};

const DEFAULT_SETTINGS = {
  themeId: 'default',
  scale: 1,
  talkativeness: 'normal',
  muted: false,
  sound: true,
  alwaysOnTop: true,
  launchAtStartup: false,
  showTimerBadge: true,
  hidden: false,
  lockPosition: false,
  lastTimerMinutes: 25,
  desktopJokes: true,
  peekVisits: true,
  weatherFx: true,
  sceneBg: true,
  ambientSound: false,
  quickCapture: false,
  dayMode: null,        // sakin | uretken | kendime
  dayModeDay: '',
  restMode: true,       // "bugünlük yeter" ekranı
  restDay: '',
  stayVisible: true,
  autoUpdate: true,
  daySummary: true,
  waterEvery: 0,        // dakika, 0 = kapalı
  breakEvery: 60,       // kesintisiz çalışma sonrası mola hatırlatması (dakika), 0 = kapalı
  wardrobeOutfit: null,
  characterAnimations: true,
  sleepNight: '',
  sleepOutfit: '',
  birthday: '',         // "AA-GG"
  lastSummaryDay: '',
  lastSpecialDay: '',
  lastBackupDay: '',
  userName: '',
  panelSize: { width: 440, height: 660 },
  panelPinned: false,
  panelOpen: false,
  position: null
};

const userData = app.getPath('userData');
const builtinThemesDir = app.isPackaged
  ? path.join(process.resourcesPath, 'themes')
  : path.join(app.getAppPath(), 'themes');
const userThemesDir = path.join(userData, 'themes');
const iconPath = path.join(app.getAppPath(), 'build', 'icon.png');

let settingsStore, notesStore, todosStore, moodStore, statsStore, moodLogStore, archiveStore, jarStore, homeDialogueStore, userMoodStore, dialogueHistoryStore;
let themes, dialogue, mood, timer, stats, journal, homeDialogue;
let budgetStore, budget;
let homeCache = null;
let resize = null;
let panelDrag = null;
let petTimes = [];
let petAngryUntil = 0;
let dizzyUntil = 0;
let lastDesktopJokeAt = 0;
let peek = null;              // sürpriz ziyaret sürerken { home, done }
let nextPeekAt = Date.now() + (25 + Math.random() * 20) * MIN;
// Kestirme (rastgele uyku) ve uyku sersemliği
let napUntil = 0;
let nextNapAt = 0; // ilk kestirme zamanı başlangıçta hesaplanır
let nextSnoreAt = 0;
let groggyUntil = 0;
let lastOutfit = undefined;
let restActive = false;
let nextProdNudgeAt = 0;
let selfMood = null; // { type, until } — Nero'nun kendi ruh hali, kullanıcıdan bağımsız
let rareEventCounter = 0;
let rareEventThreshold = 20 + Math.floor(Math.random() * 11);
const MODE_CATEGORIES = new Set(['idle', 'remark']);
const GROGGY_CATEGORIES = new Set(['click', 'panel_open', 'todo_add', 'todo_done', 'note_add', 'timer_start', 'timer_pause', 'timer_resume', 'drag_end']);

// ---------------------------------------------------------------------------
// Hata günlüğü: %APPDATA%\Nero\nero.log
// ---------------------------------------------------------------------------
const logFile = path.join(app.getPath('userData'), 'nero.log');
function log(...parts) {
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    if (fs.existsSync(logFile) && fs.statSync(logFile).size > 512 * 1024) {
      fs.renameSync(logFile, `${logFile}.eski`);
    }
    const line = parts.map((p) => (p instanceof Error ? `${p.message}\n${p.stack}` : typeof p === 'string' ? p : JSON.stringify(p))).join(' ');
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${line}\n`);
  } catch (_) { /* günlük yazılamazsa sessiz geç */ }
}
process.on('uncaughtException', (err) => log('HATA (ana süreç):', err));
process.on('unhandledRejection', (err) => log('HATA (söz verilen işlem):', err));

function watchWindow(win, name) {
  win.webContents.on('console-message', (e) => {
    const level = e.level ?? e.params?.level;
    if (level === 'error' || level === 3) log(`HATA (${name}):`, e.message ?? e.params?.message);
  });
  win.webContents.on('render-process-gone', (_e, details) => log(`ÇÖKTÜ (${name}):`, details));
  win.on('unresponsive', () => log(`YANIT VERMİYOR (${name})`));
  win.on('responsive', () => log(`tekrar yanıt veriyor (${name})`));
}
let charWin = null;
let panelWin = null;
let quickWin = null;
let focusNoticeWin = null;
let focusNoticePayload = null;
let beeWin = null;
let beeStore = null;
let bee = null;
let lastBeeAlertAt = 0;
let tray = null;
let quickShortcutOn = false;
let currentTheme = null;
let isQuitting = false;

let drag = null;              // { offsetX, offsetY, startedAt, interval }
let lastCursor = { x: -1, y: -1 };
let speakingUntil = 0;
let nextTalkAt = 0;
let lastBaseline = '';
let clickTimes = [];
let lastPanelToggleAt = 0;
let screenLocked = false;
let panelLink = null;         // panelin karaktere göre konumu { dx, dy }
let syncingMove = false;

function openBeeWindow() {
  if (!bee) return false;
  if (beeWin && !beeWin.isDestroyed()) {
    if (beeWin.isMinimized()) beeWin.restore();
    beeWin.show();
    beeWin.focus();
    bee.markSeen();
    return true;
  }

  // Pencerenin son boyutu ve konumu hatırlanır (ekran dışında kaldıysa varsayılana döner)
  const saved = settings().beeBounds;
  let bounds = { width: 1100, height: 720 };
  if (saved && saved.width >= 820 && saved.height >= 560) {
    const area = screen.getDisplayMatching(saved).workArea;
    const visible = saved.x < area.x + area.width - 100 && saved.x + saved.width > area.x + 100 && saved.y >= area.y - 20 && saved.y < area.y + area.height - 100;
    bounds = visible ? saved : { width: Math.min(saved.width, area.width), height: Math.min(saved.height, area.height) };
  }
  beeWin = new BrowserWindow({
    ...bounds, minWidth: 820, minHeight: 560,
    title: 'Nero · Arıcılık', backgroundColor: '#CFE9F7',
    autoHideMenuBar: true, show: false,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'bee-preload.js'),
      contextIsolation: true, nodeIntegration: false, sandbox: true
    }
  });
  beeWin.loadFile(path.join(__dirname, '..', 'renderer', 'bee', 'index.html'));
  beeWin.once('ready-to-show', () => {
    if (beeWin && !beeWin.isDestroyed()) {
      beeWin.show();
      if (bee) bee.markSeen();
    }
  });
  beeWin.on('focus', () => { if (bee) bee.markSeen(); });
  beeWin.on('close', () => {
    try {
      if (!beeWin.isMinimized()) settingsStore.patch({ beeBounds: beeWin.isMaximized() ? beeWin.getNormalBounds() : beeWin.getBounds() });
    } catch (_) { /* yoksay */ }
  });
  beeWin.on('closed', () => {
    beeWin = null;
    if (bee) bee.markAway();
  });
  watchWindow(beeWin, 'arıcılık');
  return true;
}

function sendBee() {
  if (!bee) return;
  const events = bee.drainEvents();
  if (!beeWin || beeWin.isDestroyed()) return;
  beeWin.webContents.send('bee:state', bee.view());
  if (events.length) beeWin.webContents.send('bee:events', events);
}

// Achievement v2 kısa süreli etkileşim durumu (kalıcı metrikler Stats içinde tutulur).
let lastSpeechEndedAt = 0;
let lastUserInteractionAt = Date.now();
let interactionSerial = 0;
let napStartedAt = 0;
let lastSnoreAt = 0;
let timerPauseResumeCount = 0;
let peekHoverStartedAt = 0;
let peekHoverClicked = false;
let achievementCursor = { reversals: [], lastDir: 0, lastX: null, lastY: null, slowSince: 0, slowDistance: 0, edgeSince: 0 };

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------
const rand = (a, b) => a + Math.random() * (b - a);
const chance = (p) => Math.random() < p;
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const truncate = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const settings = () => settingsStore.get();

function markUserInteraction() {
  lastUserInteractionAt = Date.now();
  interactionSerial += 1;
}

function trackAchievementCursor(p) {
  if (!stats || !charWin || !charWin.isVisible()) return;
  const now = Date.now();
  const b = charWin.getBounds();
  const cx = b.x + b.width / 2;
  const cy = b.y + b.height / 2;
  const dx = p.x - (achievementCursor.lastX ?? p.x);
  const dy = p.y - (achievementCursor.lastY ?? p.y);
  const dist = Math.hypot(dx, dy);
  const near = Math.hypot(p.x - cx, p.y - cy) < Math.max(360, b.width * 1.4);
  if (near && Math.abs(dx) >= 3) {
    const dir = Math.sign(dx);
    if (achievementCursor.lastDir && dir !== achievementCursor.lastDir) {
      achievementCursor.reversals = [...achievementCursor.reversals.filter((t) => now - t < 6500), now];
      if (achievementCursor.reversals.length >= 8) {
        stats.recordEyeGesture('sweep');
        achievementCursor.reversals = [];
      }
    }
    achievementCursor.lastDir = dir;
  }
  if (near && dist > 0.3 && dist < 18) {
    if (!achievementCursor.slowSince) achievementCursor.slowSince = now;
    achievementCursor.slowDistance += dist;
    if (now - achievementCursor.slowSince >= 12000 && achievementCursor.slowDistance >= 420) {
      stats.recordEyeGesture('wander');
      achievementCursor.slowSince = now;
      achievementCursor.slowDistance = 0;
    }
  } else if (!near || dist >= 30) {
    achievementCursor.slowSince = 0;
    achievementCursor.slowDistance = 0;
  }
  const wa = screen.getDisplayNearestPoint(p).workArea;
  const edge = Math.min(Math.abs(p.x - wa.x), Math.abs(p.x - (wa.x + wa.width - 1)), Math.abs(p.y - wa.y), Math.abs(p.y - (wa.y + wa.height - 1))) <= 5;
  if (edge) {
    if (!achievementCursor.edgeSince) achievementCursor.edgeSince = now;
    if (now - achievementCursor.edgeSince >= 15000) {
      stats.recordEyeGesture('edge');
      achievementCursor.edgeSince = now + 60000;
    }
  } else achievementCursor.edgeSince = 0;
  achievementCursor.lastX = p.x; achievementCursor.lastY = p.y;
}

function sendTo(win, channel, payload) {
  if (win && !win.isDestroyed()) win.webContents.send(channel, payload);
}

function copyGuideToUserFolder() {
  try {
    fs.mkdirSync(userThemesDir, { recursive: true });
    const src = path.join(app.getAppPath(), 'docs', 'TEMA-REHBERI.md');
    const dst = path.join(userThemesDir, 'TEMA-REHBERI.md');
    if (fs.existsSync(src)) fs.writeFileSync(dst, fs.readFileSync(src));
  } catch (err) {
    console.error('[rehber] kopyalanamadı:', err.message);
  }
}

// ---------------------------------------------------------------------------
// Karakter penceresi
// ---------------------------------------------------------------------------
function characterLayout(theme, scale) {
  const charW = Math.round(theme.manifest.canvas.width * scale);
  const charH = Math.round(theme.manifest.canvas.height * scale);
  const width = Math.ceil(Math.max(charW, BUBBLE_WIDTH) + SIDE_PAD * 2);
  const height = Math.ceil(BUBBLE_ZONE + charH + BADGE_ZONE);
  return {
    width, height, scale, charW, charH,
    charX: Math.round((width - charW) / 2),
    charY: BUBBLE_ZONE,
    bubbleZone: BUBBLE_ZONE,
    bubbleWidth: BUBBLE_WIDTH,
    badgeZone: BADGE_ZONE
  };
}

function isVisibleOnSomeDisplay(rect) {
  return screen.getAllDisplays().some(({ workArea: wa }) => {
    const ix = Math.max(0, Math.min(rect.x + rect.width, wa.x + wa.width) - Math.max(rect.x, wa.x));
    const iy = Math.max(0, Math.min(rect.y + rect.height, wa.y + wa.height) - Math.max(rect.y, wa.y));
    return ix * iy > (rect.width * rect.height) * 0.3;
  });
}

function defaultPosition(layout) {
  const wa = screen.getPrimaryDisplay().workArea;
  return { x: wa.x + wa.width - layout.width - 40, y: wa.y + wa.height - layout.height };
}

function showFocusNotice(minutes) {
  if (focusNoticeWin && !focusNoticeWin.isDestroyed()) focusNoticeWin.close();
  focusNoticePayload = { manifest: currentTheme.manifest, outfit: currentOutfit(), minutes };
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const area = display.workArea;
  const width = Math.min(390, area.width), height = 205;
  const win = new BrowserWindow({ width, height, x: area.x + area.width - width - 12, y: area.y + area.height - height - 12,
    frame: false, transparent: true, resizable: false, maximizable: false, minimizable: false, skipTaskbar: true, alwaysOnTop: true, show: false,
    webPreferences: { preload: path.join(__dirname, '..', 'preload', 'notification-preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  focusNoticeWin = win;
  win.setAlwaysOnTop(true, 'screen-saver');
  win.once('ready-to-show', () => { if (!win.isDestroyed()) win.showInactive(); });
  win.on('closed', () => { if (focusNoticeWin === win) { focusNoticeWin = null; focusNoticePayload = null; } });
  win.loadFile(path.join(__dirname, '..', 'renderer', 'notification', 'index.html'));
}

function createCharacterWindow() {
  const layout = characterLayout(currentTheme, settings().scale);
  let pos = settings().position;
  if (!pos || !isVisibleOnSomeDisplay({ ...pos, width: layout.width, height: layout.height })) {
    pos = defaultPosition(layout);
  }

  charWin = new BrowserWindow({
    x: Math.round(pos.x),
    y: Math.round(pos.y),
    width: layout.width,
    height: layout.height,
    transparent: true,
    frame: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    hasShadow: false,
    skipTaskbar: true,
    focusable: false,
    show: false,
    alwaysOnTop: settings().alwaysOnTop,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      autoplayPolicy: 'no-user-gesture-required',
      backgroundThrottling: false
    }
  });

  if (settings().alwaysOnTop) charWin.setAlwaysOnTop(true, 'floating');
  charWin.setIgnoreMouseEvents(true, { forward: true });
  charWin.loadFile(path.join(__dirname, '..', 'renderer', 'character', 'index.html'));

  charWin.once('ready-to-show', () => {
    if (!settings().hidden) charWin.showInactive();
  });

  charWin.on('closed', () => { charWin = null; });
  watchWindow(charWin, 'karakter');
}

function applyCharacterLayout() {
  if (!charWin) return;
  const layout = characterLayout(currentTheme, settings().scale);
  const old = charWin.getBounds();
  // Alt-orta noktayı sabit tutarak boyutlandır (karakter olduğu yerde büyür/küçülür).
  const x = Math.round(old.x + old.width / 2 - layout.width / 2);
  const y = Math.round(old.y + old.height - layout.height);
  charWin.setBounds({ x, y, width: layout.width, height: layout.height });
  settingsStore.patch({ position: { x, y } });
  sendTheme();
  if (panelIsLinkable()) positionPanel();
}

function themePayload() {
  return {
    manifest: currentTheme.manifest,
    layout: characterLayout(currentTheme, settings().scale)
  };
}

function sendTheme() {
  sendTo(charWin, 'theme', themePayload());
  sendTo(panelWin, 'theme', themePayload());
}

// ---------------------------------------------------------------------------
// Panel penceresi
// ---------------------------------------------------------------------------
function resetWindowInteractionState({ restoreCharacterMouse = false } = {}) {
  if (drag) stopDrag();
  if (panelDrag) stopPanelDrag();
  if (resize) stopResize();

  sendTo(panelWin, 'interaction:reset');
  sendTo(charWin, 'interaction:reset');

  if (restoreCharacterMouse && charWin) {
    try { charWin.setIgnoreMouseEvents(false, { forward: true }); } catch (_) { /* yoksay */ }
    try {
      // Windows'ta transparent frameless pencerenin hit-test alanı taskbar restore
      // sonrasında stale kalabiliyor. Paneli sürükleyince karakter setBounds aldığı için
      // sorun kendiliğinden düzeliyordu; aynı yenilemeyi görünmez 1px nudge ile burada yap.
      const b = charWin.getBounds();
      charWin.setBounds({ x: b.x + 1, y: b.y, width: b.width, height: b.height });
      charWin.setBounds(b);
    } catch (_) { /* yoksay */ }
    try { charWin.webContents.invalidate(); } catch (_) { /* yoksay */ }
  }
  if (panelWin) {
    try { panelWin.webContents.invalidate(); } catch (_) { /* yoksay */ }
  }
}

function createPanelWindow() {
  const size = panelSize();
  panelWin = new BrowserWindow({
    width: size.width,
    height: size.height,
    alwaysOnTop: settings().alwaysOnTop,
    show: false,
    frame: false,
    resizable: true,
    minWidth: PANEL_MIN.width,
    minHeight: PANEL_MIN.height,
    maxWidth: PANEL_MAX.width,
    maxHeight: PANEL_MAX.height,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: false,
    title: 'Nero',
    icon: iconPath,
    transparent: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  panelWin.loadFile(path.join(__dirname, '..', 'renderer', 'panel', 'index.html'));
  panelWin.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      hidePanel();
    }
  });
  panelWin.on('closed', () => { panelWin = null; panelLink = null; });
  watchWindow(panelWin, 'panel');
  panelWin.on('will-move', () => { panelUserMoving = true; });
  panelWin.on('move', onPanelMoved);
  panelWin.on('moved', () => {
    panelUserMoving = false;
    if (!charWin) return;
    const b = charWin.getBounds();
    settingsStore.patch({ position: { x: b.x, y: b.y } });
  });
  // Frameless panel native kenarlardan da yeniden boyutlandırılabilir.
  // Özel köşe grip'i sürüklenirken kayıt stopResize() içinde yapılır; native resize burada kalıcılaştırılır.
  panelWin.on('resized', () => {
    if (!panelWin || resize) return;
    const b = panelWin.getBounds();
    settingsStore.patch({ panelSize: { width: b.width, height: b.height } });
    captureLink();
  });
  panelWin.on('minimize', () => {
    resetWindowInteractionState();
  });
  panelWin.on('restore', () => {
    resetWindowInteractionState({ restoreCharacterMouse: true });
    revealCharacter({ moveTop: true });
    if (charWin) positionPanel();
    setImmediate(() => {
      if (!panelWin || panelWin.isDestroyed()) return;
      try { panelWin.moveTop(); } catch (_) { /* platform fallback */ }
      try { panelWin.focus(); } catch (_) { /* yoksay */ }
    });
  });
  panelWin.on('show', () => revealCharacter());
  panelWin.on('focus', () => {
    revealCharacter({ moveTop: true });
    try { panelWin.moveTop(); } catch (_) { /* platform fallback */ }
  });
}

function panelSize() {
  const s = settings().panelSize || PANEL_DEFAULT;
  return {
    width: Math.max(PANEL_MIN.width, Math.min(PANEL_MAX.width, Math.round(s.width) || PANEL_DEFAULT.width)),
    height: Math.max(PANEL_MIN.height, Math.min(PANEL_MAX.height, Math.round(s.height) || PANEL_DEFAULT.height))
  };
}

function positionPanel() {
  if (!panelWin) return;
  const size = panelSize();
  const cb = charWin ? charWin.getBounds() : null;
  const display = cb ? screen.getDisplayMatching(cb) : screen.getPrimaryDisplay();
  const wa = display.workArea;
  let x, y;
  if (cb) {
    const charCenterX = cb.x + cb.width / 2;
    const roomLeft = cb.x - wa.x;
    x = roomLeft >= size.width - 4 ? cb.x - size.width + 4 : cb.x + cb.width - 4;
    if (charCenterX < wa.x + wa.width / 2 && cb.x + cb.width + size.width - 4 <= wa.x + wa.width) {
      x = cb.x + cb.width - 4;
    }
    y = cb.y + cb.height - size.height;
  } else {
    x = wa.x + wa.width - size.width - 20;
    y = wa.y + wa.height - size.height - 20;
  }
  x = Math.max(wa.x, Math.min(x, wa.x + wa.width - size.width));
  y = Math.max(wa.y, Math.min(y, wa.y + wa.height - size.height));
  if (cb) {
    panelSide = x + size.width / 2 < cb.x + cb.width / 2 ? 'left' : 'right';
    panelDy = cb.height - size.height;
    movePanelWithCharacter(cb);
  } else {
    panelWin.setBounds({ x: Math.round(x), y: Math.round(y), width: size.width, height: size.height });
  }
}

// Panel açıkken karakterle panel birlikte hareket eder.
// Panelin yeri "karakterin solunda/sağında" ve "karakterin üstünden ne kadar aşağıda" olarak tutulur
// ve her seferinde bu bilgiden yeniden hesaplanır. Böylece Windows'taki piksel yuvarlamaları birikip
// paneli karakterin altına ya da üstüne kaydıramaz. Ekranın kenarına gelince panel diğer tarafa geçer.
let panelSide = 'left';
let panelDy = 0;
let panelUserMoving = false;

function panelIsLinkable() {
  return panelWin && charWin && panelWin.isVisible() && !panelWin.isMinimized();
}

function panelTarget(c) {
  const size = panelSize();
  const wa = screen.getDisplayMatching(c).workArea;
  const leftX = c.x - size.width + 4;
  const rightX = c.x + c.width - 4;
  const fitsLeft = leftX >= wa.x;
  const fitsRight = rightX + size.width <= wa.x + wa.width;
  let side = panelSide;
  if (side === 'left' && !fitsLeft && fitsRight) side = 'right';
  else if (side === 'right' && !fitsRight && fitsLeft) side = 'left';
  let x = side === 'left' ? leftX : rightX;
  x = Math.max(wa.x, Math.min(x, wa.x + wa.width - size.width));
  let y = c.y + panelDy;
  y = Math.max(wa.y, Math.min(y, wa.y + wa.height - size.height));
  return { x: Math.round(x), y: Math.round(y), width: size.width, height: size.height, side };
}

// Kullanıcının elle yaptığı değişiklikten (boyutlandırma, kilitliyken taşıma) sonra yeri yeniden öğren.
function captureLink() {
  if (!panelIsLinkable()) return;
  const p = panelWin.getBounds();
  const c = charWin.getBounds();
  panelSide = p.x + p.width / 2 < c.x + c.width / 2 ? 'left' : 'right';
  panelDy = p.y - c.y;
}

function movePanelWithCharacter(charBounds) {
  if (!panelIsLinkable()) return;
  const t = panelTarget(charBounds || charWin.getBounds());
  panelSide = t.side;
  const { side, ...bounds } = t;
  syncingMove = true;
  panelWin.setBounds(bounds);
  syncingMove = false;
}

// Sadece panel kullanıcı tarafından elle sürüklenirken Nero peşinden gelir.
function onPanelMoved() {
  if (!panelUserMoving || syncingMove || drag || resize || !panelIsLinkable()) return;
  if (settings().lockPosition) { captureLink(); return; }
  const p = panelWin.getBounds();
  const c = charWin.getBounds();
  const size = panelSize();
  const x = panelSide === 'left' ? p.x + size.width - 4 : p.x - c.width + 4;
  const y = p.y - panelDy;
  if (c.x === x && c.y === y) return;
  charWin.setBounds({ x: Math.round(x), y: Math.round(y), width: c.width, height: c.height });
}

// ---------------------------------------------------------------------------
// Hızlı yakalama: küçük, kısayolla açılan bir not/iş penceresi.
// Sadece kullanıcı Ayarlar'dan açarsa kısayol kaydediliyor.
// ---------------------------------------------------------------------------
function createQuickWindow() {
  const wa = screen.getPrimaryDisplay().workArea;
  const size = { width: 380, height: 96 };
  quickWin = new BrowserWindow({
    width: size.width, height: size.height,
    x: Math.round(wa.x + (wa.width - size.width) / 2),
    y: Math.round(wa.y + wa.height * 0.28),
    frame: false, transparent: true, resizable: false, movable: true,
    alwaysOnTop: true, skipTaskbar: true, show: false, hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'quick-preload.js'),
      contextIsolation: true, nodeIntegration: false, sandbox: true
    }
  });
  quickWin.setAlwaysOnTop(true, 'screen-saver');
  quickWin.loadFile(path.join(__dirname, '..', 'renderer', 'quick', 'index.html'));
  quickWin.on('blur', () => { if (quickWin && !quickWin.webContents.isDevToolsFocused()) quickWin.hide(); });
  quickWin.on('closed', () => { quickWin = null; });
}

function toggleQuickCapture() {
  if (!quickWin) createQuickWindow();
  if (quickWin.isVisible()) { quickWin.hide(); return; }
  quickWin.show();
  quickWin.focus();
}

function applyQuickShortcut() {
  const want = !!settings().quickCapture;
  if (want === quickShortcutOn) return;
  try {
    if (want) {
      globalShortcut.register('Control+Alt+Space', toggleQuickCapture);
      quickShortcutOn = true;
    } else {
      globalShortcut.unregister('Control+Alt+Space');
      quickShortcutOn = false;
    }
  } catch (err) {
    log('hızlı yakalama kısayolu ayarlanamadı:', err);
  }
}

function hidePanel() {
  if (panelDrag) stopPanelDrag();
  if (panelWin) panelWin.hide();
  settingsStore.patch({ panelOpen: false });
}

// ---------------------------------------------------------------------------
// Ana sayfa konuşma motoru
// ---------------------------------------------------------------------------
function statsDay(daysAgo, now = new Date()) {
  const d = new Date(now);
  d.setHours(12, 0, 0, 0); // DST sınırlarında günü güvenli biçimde geriye al.
  d.setDate(d.getDate() - daysAgo);
  const row = stats.data.days[dayKey(d)] || {};
  return { todos: row.todos || 0, focus: row.focus || 0, timersDone: row.timersDone || 0, timersQuit: row.timersQuit || 0 };
}

function homeDialogueContext(nowMs = Date.now()) {
  const now = new Date(nowMs);
  const sum = stats.summary();
  const todos = todosStore.get().filter((t) => !t.archivedAt);
  const yesterday = statsDay(1, now);
  const recent7 = Array.from({ length: 7 }, (_, i) => statsDay(i, now));
  const previous7 = Array.from({ length: 7 }, (_, i) => statsDay(i + 7, now));
  const recent7Todos = recent7.reduce((a, d) => a + d.todos, 0);
  const recent7Focus = recent7.reduce((a, d) => a + d.focus, 0);
  const previous7Todos = previous7.reduce((a, d) => a + d.todos, 0);
  const previous7Focus = previous7.reduce((a, d) => a + d.focus, 0);

  const todayKey = dayKey(now);
  const activeRows = Object.entries(stats.data.days || {})
    .filter(([key, row]) => key <= todayKey && ((row.todos || 0) > 0 || (row.focus || 0) > 0))
    .sort(([a], [b]) => a.localeCompare(b));
  const last3 = activeRows.slice(-3).map(([, row]) => row);
  const last3ActiveDaysConsistent = last3.length === 3 && last3.every((row) => (row.todos || 0) >= 1 || (row.focus || 0) >= 25);

  // Bugünün karşılaştırıldığı geçmiş ortalamasına bugün dahil edilmez.
  const previousActive = activeRows.filter(([key]) => key < todayKey).slice(-7).map(([, row]) => row);
  const avgScore = previousActive.length
    ? previousActive.reduce((a, row) => a + (row.todos || 0) * 20 + (row.focus || 0), 0) / previousActive.length
    : 0;
  const todayScore = sum.today.todos * 20 + sum.today.focus;
  const todayProductivityAboveRecentAverage = previousActive.length >= 3 && todayScore >= 50 && todayScore >= avgScore * 1.25;

  const timerHistory = homeDialogue?.state?.timerHistory || [];
  const last10TimersCompleted = timerHistory.slice(-10).filter((x) => x.completed).length;
  const timerTotal = sum.totals.timersDone + sum.totals.timersQuit;

  return {
    now: nowMs,
    localMinutesOfDay: now.getHours() * 60 + now.getMinutes(),
    todayTodos: sum.today.todos,
    pendingTodos: todos.filter((t) => !t.done).length,
    totalTodos: todos.length,
    todayFocus: sum.today.focus,
    todayTimersDone: sum.today.timersDone || 0,
    streak: sum.streak,
    daysTogether: sum.daysTogether,
    timersDone: sum.totals.timersDone,
    timersQuit: sum.totals.timersQuit,
    timerTotal,
    timerCompletionRate: timerTotal ? sum.totals.timersDone / timerTotal : 0,
    yesterdayTodos: yesterday.todos,
    yesterdayFocus: yesterday.focus,
    recent7Todos, recent7Focus, previous7Todos, previous7Focus,
    todayProductivityAboveRecentAverage,
    last3ActiveDaysConsistent,
    last10TimersCompleted,
    sessionMinutes: homeDialogue ? (nowMs - homeDialogue.sessionStartedAt) / MIN : 0,
    selfMood: selfMood?.type || null,
    moodStage: mood.stage,
    isPajama: wearingSleepwear(),
    isFocusRunning: timer.snapshot().status === 'running',
    absenceHours: homeDialogue?.pendingReturnAbsenceHours || 0,
    totalFocusMin: sum.totals.focusMin
  };
}

function applyHomeDialogueState(h) {
  if (!h) return;
  if (stats && ['productivity', 'time', 'relationship', 'return'].includes(h.category)) stats.recordPersonalized(h.id);
  if (homeCache) {
    homeCache = {
      ...homeCache, jab: h.text, dialogueId: h.id, dialogueCategory: h.category,
      dialogueRarity: h.rarity, dialogueDismissed: h.dismissed, dialogueSelectedAt: h.selectedAt, dialogueNextAt: h.nextAt
    };
    if (panelWin && panelWin.isVisible()) sendTo(panelWin, 'state', fullState());
  }
}

// Home'un Nero repliği artık panel açılışında rastgele seçilmez. buildHome yalnızca
// mevcut repliği doğrular ve mood/archive/quote/weekly-letter gibi yan verileri tazeler.
function buildHome({ checkLetter = true } = {}) {
  const sum = stats.summary();
  const archive = journal.thisMonth();
  let letter = null;
  const wk = isoWeekKey();
  if (checkLetter && settings().lastLetterWeek !== wk && sum.week.some((d) => d.focus > 0 || d.todos > 0)) {
    letter = journal.writeLetter(sum.week, sum.totals);
    settingsStore.patch({ lastLetterWeek: wk });
    stats.recordWeeklyLetter();
    setTimeout(() => say('weekly_letter_line', {}, { force: false, interrupt: false }), 3000);
  }

  const ctx = homeDialogueContext();
  homeDialogue.ensureCurrent(ctx);
  const h = homeDialogue.publicState(ctx);
  const dayIndex = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const quote = QUOTES[dayIndex % QUOTES.length];
  homeCache = {
    jab: h.text, dialogueId: h.id, dialogueCategory: h.category, dialogueRarity: h.rarity,
    dialogueDismissed: h.dismissed, dialogueSelectedAt: h.selectedAt, dialogueNextAt: h.nextAt,
    quote, archive, letter: letter || homeCache?.letter || null
  };
}

function tickHomeDialogue() {
  if (!homeDialogue) return;
  const idleSec = powerMonitor.getSystemIdleTime();
  const canRotate = !screenLocked && idleSec < 10 * 60 && !mood.state.asleep;
  homeDialogue.tick(homeDialogueContext(), { canRotate });
}

// ---------------------------------------------------------------------------
// Aylık moodboard: kullanıcı seçimi + Nero'nun otomatik mood günlüğü
// ---------------------------------------------------------------------------
function moodboardState(key = moodMonthKey(), now = new Date()) {
  const currentKey = moodMonthKey(now);
  const safeKey = /^\d{4}-(0[1-9]|1[0-2])$/.test(String(key || '')) ? String(key) : currentKey;
  const today = dayKey(now);
  const userData = userMoodStore ? userMoodStore.get() : { days: {} };
  const neroData = moodLogStore ? moodLogStore.get() : { days: {} };
  const availableMonths = dataMonths(userData, neroData, currentKey);
  const user = userMoodStore ? userMonth(userData, safeKey, now) : [];
  const nero = journal ? journal.month(safeKey).map((d) => ({ ...d, future: d.date > today })) : [];
  return {
    key: safeKey,
    label: monthLabelTr(safeKey),
    user,
    nero,
    editable: safeKey === currentKey,
    currentKey,
    availableMonths: availableMonths.map((month) => ({ key: month, label: monthLabelTr(month) }))
  };
}

function moodboardFolder() {
  return path.join(app.getPath('pictures'), 'Nero Moodboards');
}

async function exportMoodboardMonth(key) {
  if (!userMoodStore || !journal || !currentTheme) return false;
  const data = userMoodStore.get();
  const user = userMonth(data, key, new Date());
  const nero = journal.month(key);
  const hasUser = user.some((d) => d.value);
  const hasNero = nero.some((d) => d.cls);
  const exports = { ...(data.exports || {}) };
  if (exports[key]) return true;
  if (!hasUser && !hasNero) {
    exports[key] = { skipped: true, at: Date.now() };
    userMoodStore.set({ ...data, exports });
    return true;
  }

  try {
    const svg = renderMoodboardSvg({ key, userDays: user, neroDays: nero, ui: currentTheme.manifest.ui || {} });
    const png = await svgToPng(svg, { width: 1080, height: 900 });
    const dir = moodboardFolder();
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `Nero-Moodboard-${key}.png`);
    fs.writeFileSync(file, png);
    // Render sürerken mood seçimi değişmiş olabilir; son store'u baz alarak yalnız exports alanını güncelle.
    const latest = userMoodStore.get();
    userMoodStore.set({
      ...latest,
      exports: { ...(latest.exports || {}), [key]: { at: Date.now(), path: file } }
    });
    return true;
  } catch (err) {
    log('moodboard png oluşturulamadı:', key, err);
    return false;
  }
}

let moodboardArchiving = false;
async function archiveClosedMoodboards() {
  if (moodboardArchiving || !userMoodStore || !moodLogStore) return;
  moodboardArchiving = true;
  try {
    for (const key of closedDataMonths(userMoodStore.get(), moodLogStore.get(), moodMonthKey())) {
      const exported = userMoodStore.get().exports || {};
      if (!exported[key]) await exportMoodboardMonth(key);
    }
  } finally {
    moodboardArchiving = false;
  }
}

// Nero'yu görünür yap; moveTop yalnız "şimdi öne getir" davranışıdır,
// kullanıcının alwaysOnTop tercihini kalıcı olarak değiştirmez.
function revealCharacter({ moveTop = false } = {}) {
  if (!charWin) return;
  if (settings().hidden) settingsStore.patch({ hidden: false });
  if (charWin.isMinimized()) charWin.restore();
  if (!charWin.isVisible()) charWin.showInactive();
  if (settings().alwaysOnTop) charWin.setAlwaysOnTop(true, 'floating');
  if (moveTop) {
    try { charWin.moveTop(); } catch (_) { /* platform fallback */ }
  }
}

// Taskbar / ikinci instance üzerinden uygulama geri çağrıldığında:
// panel gerçekten açıksa ikisini birlikte getir, panel kapalıysa yalnız Nero'yu getir.
function bringRunningWindowsToFront() {
  const bringPanel = !!(panelWin && settings().panelOpen);
  revealCharacter({ moveTop: true });

  if (!bringPanel) return;
  if (panelWin.isMinimized()) panelWin.restore();
  if (!panelWin.isVisible()) panelWin.show();
  try { panelWin.moveTop(); } catch (_) { /* platform fallback */ }
  try { panelWin.focus(); } catch (_) { /* yoksay */ }
}

function showPanel(tab) {
  if (!panelWin) createPanelWindow();
  buildHome();
  positionPanel();
  panelWin.show();
  positionPanel(); // bazı sistemler gizli pencerenin konumunu gösterirken değiştirebiliyor
  panelWin.focus();
  settingsStore.patch({ panelOpen: true });
  if (tab) {
    if (panelWin.webContents.isLoading()) {
      panelWin.webContents.once('did-finish-load', () => sendTo(panelWin, 'panel:tab', tab));
    } else {
      sendTo(panelWin, 'panel:tab', tab);
    }
  }
  broadcastState();
}

function togglePanel() {
  if (panelWin && panelWin.isVisible()) {
    // Sabitlenmiş panel tıklamayla kapanmaz, sadece öne gelir.
    if (settings().panelPinned) { panelWin.focus(); return true; }
    hidePanel();
    return false;
  }
  showPanel();
  return true;
}

// ---------------------------------------------------------------------------
// Konuşma
// ---------------------------------------------------------------------------
function playCharacterMotion(name, manual = false) {
  const now = Date.now();
  if (!motionRules.canPlay({name,manual,now,lastMotionAt,enabled:settings().characterAnimations !== false,
    hidden:settings().hidden,asleep:mood.state.asleep || mood.state.napping,dragging:!!drag,
    compatible:!!currentTheme?.manifest.wardrobe,petAngryUntil})) return false;
  if (!charWin) return false;
  lastMotionAt=now;
  sendTo(charWin,'motion',{name});
  return true;
}

function say(category, vars = {}, { force = false, interrupt = true } = {}) {
  if (!charWin) return;
  // Yeni uyanmışsa cevapları uyku sersemi olur.
  if (Date.now() < groggyUntil && GROGGY_CATEGORIES.has(category) && chance(0.7)) category = 'groggy';
  // Günün ritüeli: seçilen güne göre Nero'nun tonu değişir (susmaz, tonu değişir).
  const mode = todayMode();
  if (mode && MODE_CATEGORIES.has(category) && chance(0.6)) category = `mode_${mode}`;
  if (mode === 'kendime' && ['remark', 'poke_spam', 'sulky', 'lonely'].includes(category) && chance(0.5)) category = 'mode_kendime';
  if (/^(birthday|new_year|anniversary|returned|peek_|dizzy|pet_too_much|reminder|day_summary_|weekly_letter_line|archive_recall|jar_recall|self_mood_)/.test(category)) stats.recordSpecialReaction(category);
  const line = dialogue.pick(category, { name: settings().userName || '', ...vars });
  if (!line) return;
  const muted = settings().muted && !force;
  if (!interrupt && Date.now() < speakingUntil) return;
  const payload = { ...line, id: uid(), silent: muted };
  if (line.expr === 'dizzy') dizzyUntil = Math.max(dizzyUntil, Date.now() + 20000);
  if (!muted) {
    speakingUntil = Date.now() + 2 * Math.min(15000, 2500 + line.text.length * 70);
  }
  sendTo(charWin, 'say', payload);
  const action=motionRules.forCategory(category);if(action)playCharacterMotion(action);
}

function scheduleNextTalk() {
  const [lo, hi] = TALK_INTERVALS[settings().talkativeness] || TALK_INTERVALS.normal;
  // Sakin günde biraz daha seyrek, üretken günde biraz daha sık konuşur.
  const mode = todayMode();
  const factor = mode === 'sakin' ? 1.3 : mode === 'uretken' ? 0.85 : 1;