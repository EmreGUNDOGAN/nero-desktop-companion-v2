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
let homeCache = null;
let resize = null;
let panelDrag = null;
let petTimes = [];
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
    resizable: false,
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
    isPajama: currentOutfit() === 'pajama',
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
    speakingUntil = Date.now() + Math.min(15000, 2500 + line.text.length * 70);
  }
  sendTo(charWin, 'say', payload);
}

function scheduleNextTalk() {
  const [lo, hi] = TALK_INTERVALS[settings().talkativeness] || TALK_INTERVALS.normal;
  // Sakin günde biraz daha seyrek, üretken günde biraz daha sık konuşur.
  const mode = todayMode();
  const factor = mode === 'sakin' ? 1.3 : mode === 'uretken' ? 0.85 : 1;
  nextTalkAt = Date.now() + rand(lo, hi) * factor * MIN;
}

// Üretken günde sayaç boşsa arada bir odak önerir.
// Nero'nun kendi ruh hali: arada bir, kullanıcıdan bağımsız olarak kendi durumu olur.
// Görevleri hiçbir şekilde engellemez, sadece söylediklerinin tonunu değiştirir.
function maybeShiftSelfMood() {
  const now = Date.now();
  if (selfMood && now > selfMood.until) selfMood = null;
  if (selfMood || restActive) return;
  const s = settings();
  if (s.muted || s.hidden || mood.state.asleep || mood.state.napping) return;
  if (Math.random() > 0.02) return; // ~%2 ihtimalle, 20 sn'lik döngüde
  const type = ['sleepy', 'meh', 'energetic'][Math.floor(Math.random() * 3)];
  selfMood = { type, until: now + rand(20, 45) * MIN };
  stats.recordState(type);
  say(`self_mood_${type}`, {}, { interrupt: false });
}

function productivityNudge() {
  if (todayMode() !== 'uretken' || restActive) return;
  const s = settings();
  if (s.muted || s.hidden || mood.state.asleep || mood.state.napping || drag || peek) return;
  if (timer.snapshot().status !== 'idle') { nextProdNudgeAt = Date.now() + 40 * MIN; return; }
  if (Date.now() < nextProdNudgeAt) return;
  nextProdNudgeAt = Date.now() + rand(45, 75) * MIN;
  say('uretken_odak', {}, { interrupt: false });
}

// Akşam 9'dan sabah 6'ya kadar pijama.
function isBirthday(date = new Date()) {
  const b = settings().birthday;
  if (!b) return false;
  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return b === key;
}

// Kıyafet: gece pijama, doğum gününde parti şapkası, 15 Aralık - 15 Şubat arası atkı.
function todayKey(d = new Date()) { return d.toDateString(); }

// Bugün için seçilmiş gün tipi (dün seçilen bugüne geçmez).
function todayMode() {
  const s = settings();
  return s.dayModeDay === todayKey() ? s.dayMode : null;
}

function setDayMode(mode) {
  if (!['sakin', 'uretken', 'kendime'].includes(mode)) return null;
  settingsStore.patch({ dayMode: mode, dayModeDay: todayKey() });
  stats.recordDayMode(mode);
  mood.interact('panel');
  say(`ritual_${mode}`, {}, { force: true });
  nextProdNudgeAt = Date.now() + 40 * MIN;
  broadcastState();
  return mode;
}

// "Bugünlük yeter": günün bütün işleri bitince bir kez açılır.
function enterRest(auto = true) {
  if (restActive) return;
  if (auto && (settings().restMode === false || settings().restDay === todayKey())) return;
  restActive = true;
  settingsStore.patch({ restDay: todayKey() });
  stats.recordRest();
  if (stats.summary().sessionMinutes >= 180 && stats.summary().today.todos === 0) stats.award('secret_404');
  say('rest_start', {}, { force: true });
  broadcastState();
}

function exitRest() {
  restActive = false;
  broadcastState();
}

// Son görev kapandığında önce todo_all_done repliğinin görünmesine izin ver,
// ardından otomatik "Bugünlük yeter" moduna geç. Replik sessize alınmışsa
// kısa bir gecikmeyle devam eder; konuşuyorsa main-process konuşma süresini bekler.
function scheduleRestAfterAllDone() {
  if (settings().restMode === false || settings().restDay === todayKey()) return;
  const delay = Math.max(800, speakingUntil - Date.now() + 500);
  setTimeout(() => enterRest(true), delay);
}

function currentOutfit(date = new Date()) {
  const h = date.getHours();
  if (h >= 21 || h < 6) return 'pajama';
  if (isBirthday(date)) return 'party';
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if ((m === 12 && d >= 15) || m === 1 || (m === 2 && d <= 15)) return 'winter';
  return null;
}

function updateBaseline(force = false) {
  const expr = Date.now() < dizzyUntil ? 'dizzy' : mood.baselineExpression();
  const outfit = currentOutfit();
  if (outfit) stats.recordOutfit(outfit);
  const key = `${expr}|${outfit}`;
  if (lastOutfit !== undefined && outfit !== lastOutfit && !settings().muted) {
    const category = { pajama: 'pajama_on', party: 'outfit_party', winter: 'outfit_winter' }[outfit]
      || (lastOutfit === 'pajama' ? 'pajama_off' : null);
    if (category) setTimeout(() => say(category, {}, { interrupt: false }), 1200);
  }
  lastOutfit = outfit;
  if (force || key !== lastBaseline) {
    lastBaseline = key;
    sendTo(charWin, 'baseline', { expr, asleep: mood.state.asleep || mood.state.napping, outfit });
  }
}

// Kestirme: Nero kendi kendine uyuklar; uyandırılırsa huysuzlanır, bir süre sersem kalır.
// Gündüz nadiren ve kısa, akşam 9'dan sonra sık sık ve uzun uyur.
function napGap(night) {
  return (night ? rand(12, 35) : rand(120, 240)) * MIN;
}

function startNap() {
  const night = currentOutfit() === 'pajama';
  napStartedAt = Date.now();
  stats.recordInteraction('nap', { stage: mood.stage });
  napUntil = Date.now() + (night ? rand(10, 25) : rand(4, 9)) * MIN;
  nextSnoreAt = Date.now() + rand(1.5, 3) * MIN;
  mood.setNap(true);
  say('nap_start', {}, { interrupt: false });
  setTimeout(() => updateBaseline(true), 3200);
}

function wakeNap(reason) {
  if (!mood.state.napping) return false;
  mood.setNap(false);
  napUntil = 0;
  groggyUntil = Date.now() + 90 * 1000;
  nextNapAt = Date.now() + napGap(currentOutfit() === 'pajama');
  updateBaseline(true);
  if (reason === 'click' || reason === 'drag' || reason === 'pet') {
    stats.award('uyandirdin');
    stats.recordWake();
    if (napStartedAt && Date.now() - napStartedAt <= 5000) stats.award('secret_tam_ben_uyurken');
    if (reason === 'pet' && lastSnoreAt && Date.now() - lastSnoreAt <= 15000) stats.award('secret_uyuyan_guzel');
  }
  const category = { click: 'nap_woken', drag: 'nap_woken_drag', pet: 'nap_woken_pet', timer: 'nap_woken_timer', self: 'nap_wake_self' }[reason] || 'nap_woken';
  say(category, {}, { force: reason === 'timer' });
  return true;
}

function napTick() {
  const now = Date.now();
  if (mood.state.napping) {
    if (now >= napUntil) { wakeNap('self'); return; }
    if (now >= nextSnoreAt) {
      nextSnoreAt = now + rand(2, 4) * MIN;
      if (chance(0.5)) {
        lastSnoreAt = Date.now();
        stats.recordInteraction('snore', { stage: mood.stage });
        say('snore', {}, { interrupt: false });
      }
    }
    return;
  }
  const night = currentOutfit() === 'pajama';
  if (!nextNapAt) nextNapAt = now + (night ? rand(8, 20) * MIN : napGap(false));
  // Akşam 9 olunca gündüzden kalan uzun bekleme süresini kısalt.
  if (night && nextNapAt - now > 35 * MIN) nextNapAt = now + rand(8, 20) * MIN;
  if (now < nextNapAt) return;
  nextNapAt = now + napGap(night);
  const s = settings();
  if (s.hidden || mood.state.asleep || drag || peek) return;
  if (panelWin && panelWin.isVisible()) return;
  startNap();
}

function greet() {
  const info = mood.startupInfo();
  if (info.firstRun) return say('first_run', {}, { force: true });
  stats.recordReturn(info.offlineMs || 0);
  // Özel günler: günde bir kez
  const now = new Date();
  const todayKey = now.toDateString();
  if (settings().lastSpecialDay !== todayKey) {
    const first = new Date(stats.data.firstUsedAt);
    let special = null;
    if (isBirthday(now)) { special = 'birthday'; stats.award('dogum_gunu'); }
    else if (now.getMonth() === 0 && now.getDate() === 1) special = 'new_year';
    else if (first.getMonth() === now.getMonth() && first.getDate() === now.getDate() && first.getFullYear() < now.getFullYear()) special = 'anniversary';
    if (special) {
      settingsStore.patch({ lastSpecialDay: todayKey });
      return say(special, {}, { force: true });
    }
  }
  const off = info.offlineMs || 0;
  if (off >= 48 * HOUR) return say('return_days', { days: Math.floor(off / (24 * HOUR)) });
  if (off >= 20 * HOUR) return say('return_long', { hours: Math.floor(off / HOUR) });
  if (off < 2 * HOUR && chance(0.6)) return say('return_short');
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return say('greet_morning');
  if (h >= 12 && h < 17) return say('greet_afternoon');
  if (h >= 17 && h < 22) return say('greet_evening');
  return say('greet_night');
}

// Etkileşim sonrası: ihmal edilmişse sitem eder, uyuyorsa uyanır.
function reactToInteraction(kind, fallback, { preferFallback = false } = {}) {
  markUserInteraction();
  stats.recordInteraction(kind, { stage: mood.stage });
  const result = mood.interact(kind);
  maybeRareEvent();
  updateBaseline();
  broadcastState();
  // Bazı yüksek öncelikli olaylar (örn. bütün görevlerin bitmesi) kendi
  // tepkisini her durumda göstermeli; wake/returned bu özel tepkiyi ezmesin.
  if (preferFallback) {
    if (fallback) fallback();
    return false;
  }
  if (result.wasAsleep) { say('wake'); return true; }
  if (result.wasNeglected) { say('returned'); return true; }
  if (fallback) fallback();
  return false;
}

// ---------------------------------------------------------------------------
// Durum yayını
// ---------------------------------------------------------------------------
function fullState() {
  return {
    notes: notesStore.get(),
    todos: todosStore.get(),
    settings: settings(),
    mood: mood.summary(),
    timer: timer.snapshot(),
    themes: themes.list(),
    currentThemeId: currentTheme.id,
    ui: currentTheme.manifest.ui,
    stats: stats.summary(),
    dayMode: todayMode(),
    rest: restActive,
    achievements: stats.achievementList(),
    desk: stats.deskList(),
    jarCount: journal.jarCount(),
    moodboard: moodboardState(moodMonthKey()),
    update: updateState,
    backupDir,
    home: homeCache,
    version: app.getVersion(),
    userThemesDir
  };
}

function broadcastState() {
  if (panelWin && panelWin.isVisible()) sendTo(panelWin, 'state', fullState());
  sendTo(charWin, 'settings', settings());
}

// ---------------------------------------------------------------------------
// Sürükleme
// ---------------------------------------------------------------------------
function startDrag() {
  if (!charWin || peek || settings().lockPosition) return;
  if (drag) stopDrag();
  if (panelDrag) stopPanelDrag();
  markUserInteraction();
  stats.recordInteraction('drag', { stage: mood.stage });
  if (mood.state.napping) wakeNap('drag');
  const cursor = screen.getCursorScreenPoint();
  const b = charWin.getBounds();
  drag = {
    offsetX: cursor.x - b.x,
    offsetY: cursor.y - b.y,
    width: b.width,
    height: b.height,
    startedAt: Date.now(),
    spoke: false,
    lastX: cursor.x, lastY: cursor.y, lastDir: 0, reversals: [], distance: 0, shook: false, frames: 0,
    interval: setInterval(() => {
      if (!charWin) return stopDrag();
      const c = screen.getCursorScreenPoint();
      const nb = { x: c.x - drag.offsetX, y: c.y - drag.offsetY, width: drag.width, height: drag.height };
      charWin.setBounds(nb);
      movePanelWithCharacter(nb);
      trackShake(c);
      // Windows'ta şeffaf pencere hızlı taşınınca eski görüntü izi kalabiliyor; yeniden çizdir.
      if (++drag.frames % 6 === 0) charWin.webContents.invalidate();
      if (!drag.spoke && Date.now() - drag.startedAt > 700) {
        drag.spoke = true;
        if (chance(0.45)) say('drag_start');
      }
    }, 16)
  };
  sendTo(charWin, 'dragging', true);
  // Güvenlik: bırakma sinyali kaybolursa 30 sn sonra sürüklemeyi bitir.
  drag.safety = setTimeout(stopDrag, 30000);
}

// Sallama ve baş dönmesi: hızlı yön değiştirmeler sallama, çok uzun yol baş dönmesi sayılır.
function trackShake(c) {
  const dx = c.x - drag.lastX;
  const dy = c.y - drag.lastY;
  drag.distance += Math.hypot(dx, dy);
  drag.lastX = c.x; drag.lastY = c.y;
  if (Math.abs(dx) < 6) return;
  const dir = Math.sign(dx);
  const now = Date.now();
  if (drag.lastDir && dir !== drag.lastDir) {
    drag.reversals = [...drag.reversals.filter((t) => now - t < 1200), now];
    if (drag.reversals.length >= 4 && !drag.shook) {
      drag.shook = true;
      drag.spoke = true;
      stats.award('salladin');
      stats.recordInteraction('shake', { stage: mood.stage });
      mood.interact('shake');
      say('shake');
    }
  }
  drag.lastDir = dir;
}

function stopDrag() {
  if (!drag) return;
  const shook = drag.shook;
  const dizzy = drag.distance > 2600 || (shook && drag.reversals.length >= 7);
  clearInterval(drag.interval);
  clearTimeout(drag.safety);
  const long = Date.now() - drag.startedAt > 700;
  const spoke = drag.spoke;
  drag = null;
  sendTo(charWin, 'dragging', false);
  if (!charWin) return;
  charWin.webContents.invalidate();
  const b = charWin.getBounds();
  settingsStore.patch({ position: { x: b.x, y: b.y } });
  stats.recordDragDrop(b.x, b.y);
  if (panelIsLinkable()) movePanelWithCharacter();
  mood.interact('drag');
  if (dizzy) {
    dizzyUntil = Date.now() + 20000;
    stats.recordInteraction('dizzy', { stage: mood.stage });
    const serialAtDizzy = interactionSerial;
    setTimeout(() => { if (interactionSerial === serialAtDizzy) stats.award('secret_hicbir_sey_olmadi'); }, 20500);
    setTimeout(() => { say('dizzy'); updateBaseline(); }, 300);
    setTimeout(() => updateBaseline(), 20500);
  } else if (!shook && long && (spoke ? chance(0.5) : chance(0.3))) {
    setTimeout(() => say('drag_end'), 250);
  }
}

// ---------------------------------------------------------------------------
// Menüler ve tepsi
// ---------------------------------------------------------------------------
function buildMenu() {
  const s = settings();
  return Menu.buildFromTemplate([
    { label: 'Ana sayfa', click: () => showPanel('home') },
    { label: 'Notlar', click: () => showPanel('notes') },
    { label: 'Yapılacaklar', click: () => showPanel('todos') },
    { label: 'Zamanlayıcı', click: () => showPanel('timer') },
    { label: 'Arıcılık oyunu', click: () => openBeeWindow() },
    { label: 'Ayarlar', click: () => showPanel('settings') },
    { type: 'separator' },
    { label: s.hidden ? 'Nero\'yu göster' : 'Nero\'yu gizle', click: () => setSetting('hidden', !s.hidden) },
    timerMenuItem(),
    { label: 'Bugünlük yeter', enabled: !restActive, click: () => enterRest(false) },
    { label: 'Nero\'yu sev', click: () => petNero() },
    { type: 'separator' },
    { label: 'Sessiz mod', type: 'checkbox', checked: s.muted, click: (item) => setSetting('muted', item.checked) },
    { label: 'Yerinde sabit dur', type: 'checkbox', checked: s.lockPosition, click: (item) => setSetting('lockPosition', item.checked) },
    { label: 'Her zaman üstte', type: 'checkbox', checked: s.alwaysOnTop, click: (item) => setSetting('alwaysOnTop', item.checked) },
    { type: 'separator' },
    { label: 'Çıkış', click: () => quitWithGoodbye() }
  ]);
}

// Sevme: 2 dakikada 6'dan fazlası abartı sayılır.
// Çok nadir görülen küçük sürprizler (yaklaşık her 20-30 etkileşimde bir).
function maybeRareEvent() {
  rareEventCounter += 1;
  if (rareEventCounter < rareEventThreshold) return;
  rareEventCounter = 0;
  rareEventThreshold = 20 + Math.floor(Math.random() * 11);
  const s = settings();
  if (s.muted || s.hidden || mood.state.asleep || mood.state.napping || restActive) return;
  setTimeout(() => say('rare_event', {}, { interrupt: false }), rand(1, 4) * 1000);
}

function petNero() {
  const now = Date.now();
  const preStage = mood.stage;
  const ignoredMs = mood.state.ignoredMs || 0;
  const silentAgreement = lastSpeechEndedAt && now - lastSpeechEndedAt >= 30000 && lastUserInteractionAt <= lastSpeechEndedAt;
  markUserInteraction();
  if (silentAgreement) stats.award('secret_sessiz_anlasma');
  if (Date.now() < dizzyUntil) stats.award('secret_dunya_donuyor');
  if (currentOutfit() === 'pajama' && new Date().getHours() < 5 && stats.summary().today.todos === 0) stats.award('secret_yeterli');
  const woke = wakeNap('pet');
  stats.pet({ stage: preStage, ignoredMs, dizzy: Date.now() < dizzyUntil });
  if (woke) { mood.interact('pet'); broadcastState(); return; }
  petTimes = [...petTimes.filter((t) => now - t < 2 * MIN), now];
  if (petTimes.length >= 3) {
    mood.interact('pet_too_much');
    updateBaseline();
    say('pet_too_much');
    // Üçüncü algılanan pet olayı tepkiyi tetikler; sonraki tetik için üç yeni pet gerekir.
    petTimes = [];
  } else {
    const r = mood.interact('pet');
    updateBaseline();
    say(r.wasNeglected ? 'returned' : 'pet');
  }
  broadcastState();
}

function timerMenuItem() {
  const t = timer.snapshot();
  if (t.status === 'running') return { label: 'Sayacı duraklat', click: () => timer.pause() };
  if (t.status === 'paused') return { label: 'Sayaca devam et', click: () => timer.resume() };
  const m = settings().lastTimerMinutes || 25;
  return { label: `${m} dk odaklan`, click: () => startTimer(m) };
}

function startTimer(minutes, label = '') {
  const m = Math.max(1, Math.min(600, Math.round(Number(minutes) || 25)));
  // Aynı anda iki odak sayacı çalışıp süreyi iki kez yazmasın.
  pauseAllTodoStopwatches({ final: false });
  settingsStore.patch({ lastTimerMinutes: m });
  timerPauseResumeCount = 0;
  stats.productiveAction();
  timer.start(m, label);
}

function createTray() {
  let img = nativeImage.createFromPath(iconPath);
  if (!img.isEmpty()) img = img.resize({ width: 16, height: 16 });
  tray = new Tray(img);
  tray.setToolTip(`Nero ${app.getVersion()}`);
  tray.on('click', () => togglePanel());
  tray.on('right-click', () => tray.popUpContextMenu(buildMenu()));
}

function quitWithGoodbye() {
  if (charWin && !settings().hidden && !settings().muted) {
    say('quit', {}, { force: true });
    setTimeout(() => app.quit(), 1800);
  } else {
    app.quit();
  }
}

// ---------------------------------------------------------------------------
// Ayarlar
// ---------------------------------------------------------------------------
function loadTheme(id) {
  currentTheme = themes.get(id);
  if (!currentTheme) throw new Error('Hiç kullanılabilir tema bulunamadı.');
  dialogue.applyThemeOverrides(currentTheme.dialogue);
}

function setSetting(key, value) {
  if (!(key in DEFAULT_SETTINGS) || key === 'position') return settings();
  const s = settings();
  switch (key) {
    case 'themeId': {
      const previous = currentTheme.id;
      loadTheme(String(value));
      settingsStore.patch({ themeId: currentTheme.id, scale: currentTheme.manifest.defaultScale || s.scale });
      applyCharacterLayout();
      if (previous !== currentTheme.id) setTimeout(() => say('theme_change'), 600);
      break;
    }
    case 'scale':
      settingsStore.patch({ scale: Math.max(0.5, Math.min(2, Number(value) || 1)) });
      applyCharacterLayout();
      break;
    case 'talkativeness':
      if (!TALK_INTERVALS[value]) return s;
      settingsStore.patch({ talkativeness: value });
      scheduleNextTalk();
      break;
    case 'muted':
      settingsStore.patch({ muted: !!value });
      say(value ? 'mute_on' : 'mute_off', {}, { force: true });
      break;
    case 'alwaysOnTop':
      settingsStore.patch({ alwaysOnTop: !!value });
      if (charWin) charWin.setAlwaysOnTop(!!value, 'floating');
      // Panel de aynı kurala uyar: Nero her şeyin üstünde değilse panel de değildir.
      if (panelWin) panelWin.setAlwaysOnTop(!!value, 'floating');
      break;
    case 'launchAtStartup':
      settingsStore.patch({ launchAtStartup: !!value });
      if (app.isPackaged) app.setLoginItemSettings({ openAtLogin: !!value });
      break;
    case 'panelPinned':
      settingsStore.patch({ panelPinned: !!value });
      break;
    case 'lockPosition':
      settingsStore.patch({ lockPosition: !!value });
      if (value) {
        if (drag) stopDrag();
        if (panelDrag) stopPanelDrag();
      }
      break;
    case 'userName':
      settingsStore.patch({ userName: String(value || '').trim().slice(0, 30) });
      break;
    case 'panelSize':
      return settings();
    case 'waterEvery':
    case 'breakEvery':
      settingsStore.patch({ [key]: Math.max(0, Math.min(240, Number(value) || 0)) });
      break;
    case 'ambientSound':
      settingsStore.patch({ ambientSound: !!value });
      sendTo(charWin, 'settings', settings());
      break;
    case 'quickCapture':
      settingsStore.patch({ quickCapture: !!value });
      applyQuickShortcut();
      break;
    case 'birthday': {
      const v = String(value || '');
      settingsStore.patch({ birthday: /^\d{2}-\d{2}$/.test(v) ? v : '' });
      updateBaseline(true);
      break;
    }
    case 'hidden':
      settingsStore.patch({ hidden: !!value });
      if (charWin) value ? charWin.hide() : charWin.showInactive();
      break;
    default:
      settingsStore.patch({ [key]: typeof DEFAULT_SETTINGS[key] === 'boolean' ? !!value : value });
  }
  if (stats) stats.recordSetting(key, value);
  broadcastState();
  return settings();
}

// ---------------------------------------------------------------------------
// İş bazlı kronometre
// ---------------------------------------------------------------------------
function commitTodoStopwatch(todo, todos, { now = Date.now(), final = false } = {}) {
  if (!todo) return { todo: null, credited: 0 };
  let next = pauseTodoStopwatch(todo, now);
  const credited = todoFocusCredit(next, { final, now });
  if (credited > 0) {
    next = applyTodoFocusCredit(next, credited);
    stats.addFocusMinutes(credited);
  }
  Object.assign(todo, next);
  if (todos) todosStore.set(todos);
  return { todo, credited };
}

function pauseOtherTodoStopwatches(todos, exceptId, now = Date.now()) {
  let changed = false;
  for (const other of todos) {
    if (other.id === exceptId || !other.stopwatchStartedAt) continue;
    commitTodoStopwatch(other, null, { now, final: false });
    changed = true;
  }
  if (changed) todosStore.set(todos);
  return changed;
}

function pauseAllTodoStopwatches({ final = false } = {}) {
  if (!todosStore || !stats) return false;
  const todos = todosStore.get();
  const now = Date.now();
  let changed = false;
  for (const todo of todos) {
    if (!todo.stopwatchStartedAt) continue;
    commitTodoStopwatch(todo, null, { now, final });
    changed = true;
  }
  if (changed) todosStore.set(todos);
  return changed;
}

// ---------------------------------------------------------------------------
// IPC
// ---------------------------------------------------------------------------
function registerIpc() {
  ipcMain.handle('bee:open', () => openBeeWindow());
  ipcMain.handle('bee:state', () => {
    if (!bee) return null;
    bee.markSeen();
    return bee.view();
  });
  ipcMain.handle('bee:summary', () => (bee ? bee.takeAwaySummary() : null));
  ipcMain.handle('bee:export', () => exportBee());
  ipcMain.handle('bee:import', () => importBee());
  ipcMain.handle('bee:reset', () => resetBee());
  // Fotoğraf modu: arayüz gizliyken pencerenin görüntüsünü Resimler\Nero Arıcılık klasörüne kaydeder
  ipcMain.handle('bee:photo', async () => {
    if (!beeWin || beeWin.isDestroyed()) return { ok: false };
    const img = await beeWin.webContents.capturePage();
    const dir = path.join(app.getPath('pictures'), 'Nero Arıcılık');
    fs.mkdirSync(dir, { recursive: true });
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const file = path.join(dir, `ada-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.png`);
    fs.writeFileSync(file, img.toPNG());
    return { ok: true, file };
  });
  ipcMain.handle('bee:openPhotos', () => shell.openPath(path.join(app.getPath('pictures'), 'Nero Arıcılık')));
  // Arıcılık gerçek ses kayıtları: renderer Web Audio ile decode eder.
  ipcMain.handle('bee:sounds', () => {
    const dir = path.join(__dirname, '..', 'renderer', 'bee', 'sounds');
    const out = {};
    try {
      for (const f of fs.readdirSync(dir)) {
        if (f.toLowerCase().endsWith('.ogg')) out[f.slice(0, -4)] = fs.readFileSync(path.join(dir, f));
      }
    } catch (err) {
      log(`HATA (arıcılık sesleri): ${err.message}`);
    }
    return out;
  });
  ipcMain.handle('bee:action', (_e, action, arg1, arg2) => {
    if (!bee) return { res: { ok: false, msg: 'Arıcılık henüz hazır değil.' }, view: null, events: [] };
    const map = {
      buyTile: () => bee.buyTile(arg1),
      placeHive: () => bee.placeHive(arg1),
      buySeed: () => bee.buySeed(arg1),
      plantSeed: () => bee.plantSeed(arg1, arg2),
      removeFlower: () => bee.removeFlower(arg1),
      replant: () => bee.replant(arg1),
      harvest: () => bee.requestHarvest(arg1),
      harvestAll: () => bee.harvestAll(),
      buyBee: () => bee.buyBee(arg1),
      sellBee: () => bee.sellBee(arg1),
      upgrade: () => bee.upgrade(arg1),
      syrup: () => bee.giveSyrup(arg1),
      sellHive: () => bee.sellHive(arg1),
      sellHoney: () => bee.sellHoney(arg1, arg2),
      upgradeStorage: () => bee.upgradeStorage(),
      acceptOrder: () => bee.acceptOrder(arg1),
      deliverOrder: () => bee.deliverOrder(arg1),
      rejectOrder: () => bee.rejectOrder(arg1),
      swapOrder: () => bee.swapOrder(arg1),
      speed: () => bee.setSpeed(Number(arg1)),
      medicine: () => bee.giveMedicine(arg1),
      readNotifs: () => bee.readNotifs(),
      merchantQuote: () => bee.merchantQuote(arg1, arg2),
      merchantBuy: () => bee.merchantBuy(arg1, arg2),
      merchantSell: () => bee.merchantSell(arg1),
      readLetter: () => bee.readLetter(arg1),
      setting: () => bee.setGameSetting(arg1, arg2),
      syrupAll: () => bee.giveSyrupAll(),
      deliverReady: () => bee.deliverReady(),
      placeDecor: () => bee.placeDecor(arg1, arg2),
      removeDecor: () => bee.removeDecor(arg1),
      enterFestival: () => bee.enterFestival(arg1, arg2),
      changeBreed: () => bee.changeBreed(arg1, arg2),
      makeCandle: () => bee.makeCandle(),
      sellCandles: () => bee.sellCandles(),
      claimQuest: () => bee.claimQuest(arg1),
      refreshQuest: () => bee.refreshQuest(arg1),
      renameHive: () => bee.renameHive(arg1, arg2),
      setFarmName: () => bee.setFarmName(arg1),
      setLabel: () => bee.setLabel(arg1, arg2),
      claimEzgiWelcome: () => bee.claimEzgiWelcome(),
      finishTutorial: () => bee.finishTutorial()
    };
    const fn = map[action];
    const res = fn ? fn() : { ok: false, msg: 'Bilinmeyen işlem.' };
    return { res, view: bee.view(), events: bee.drainEvents() };
  });

  ipcMain.handle('state:get', () => fullState());
  ipcMain.handle('theme:get', () => themePayload());

  // Notlar
  ipcMain.handle('notes:save', (_e, note) => {
    const notes = notesStore.get();
    const body = String(note?.body ?? '').slice(0, 20000);
    const now = Date.now();
    const existing = note?.id ? notes.find((n) => n.id === note.id) : null;
    let saved;
    if (existing) {
      existing.body = body;
      existing.updatedAt = now;
      saved = existing;
      notesStore.set(notes);
    } else {
      saved = { id: uid(), body, createdAt: now, updatedAt: now, archivedAt: null };
      stats.noteCreated();
      notesStore.set([saved, ...notes]);
      reactToInteraction('note_add', () => { if (body.trim() && chance(0.70)) say('note_add'); });
    }
    broadcastState();
    return saved;
  });
  ipcMain.handle('notes:delete', (_e, id) => {
    notesStore.set(notesStore.get().filter((n) => n.id !== id));
    broadcastState();
    return true;
  });
  ipcMain.handle('notes:archive', (_e, id, archived = true) => {
    const notes = notesStore.get();
    const note = notes.find((n) => n.id === id);
    if (!note) return null;
    note.archivedAt = archived ? Date.now() : null;
    notesStore.set(notes);
    broadcastState();
    return note;
  });

  // Yapılacaklar
  ipcMain.handle('day:mode', (_e, mode) => { setDayMode(mode); return fullState(); });
  ipcMain.handle('rest:exit', () => { exitRest(); return fullState(); });
  ipcMain.handle('rest:start', () => { enterRest(false); return fullState(); });
  ipcMain.handle('rest:goodnight', () => {
    stats.recordGoodnight();
    say('rest_goodnight', {}, { force: true });
    exitRest();
    hidePanel();
    setTimeout(() => { if (!mood.state.napping) startNap(); }, 2500);
    return true;
  });
  ipcMain.handle('todos:add', (_e, text, time, plannedDurationMin) => {
    const clean = String(text || '').trim().slice(0, 300);
    if (!clean) return null;
    const todo = normalizeTodoTiming({
      id: uid(), text: clean, done: false, createdAt: Date.now(), doneAt: null,
      remindAt: parseRemindTime(time), reminded: false, archivedAt: null,
      plannedDurationMin: todoFiniteMin(plannedDurationMin),
      actualDurationMs: 0, stopwatchStartedAt: null, focusCreditedMin: 0
    });
    todosStore.set([...todosStore.get(), todo]);
    stats.todoCreated({ scheduled: !!todo.remindAt });
    stats.scheduledTodoCount(todosStore.get().filter((t) => !t.done && t.remindAt).length);
    reactToInteraction('todo_add', () => {
      if (restActive) say('rest_more');
      else if (chance(0.45)) say('todo_add', { label: truncate(clean, 40) });
    });
    return todo;
  });
  ipcMain.handle('todos:toggle', (_e, id) => {
    const todos = todosStore.get();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return null;
    const now = Date.now();
    todo.done = !todo.done;
    todo.doneAt = todo.done ? now : null;
    if (todo.done) {
      // Çalışan kronometre işi bitirirken otomatik durur. Kalan saniyeler finalde en yakın dakikaya tamamlanır.
      commitTodoStopwatch(todo, null, { now, final: true });
    } else {
      todo.archivedAt = null;
    }
    todosStore.set(todos);
    stats.todoDone(todo.done ? 1 : -1, { createdAt: todo.createdAt });
    if (todo.done) {
      if (bee) { bee.todoCompleted(); sendBee(); }
      journal.archiveDone(todo.text);
      if (settings().sound) sendTo(charWin, 'sound', 'pop');
      const activeTodos = todos.filter((t) => !t.archivedAt);
      const allDone = activeTodos.length >= 2 && activeTodos.every((t) => t.done);
      const today = dayKey();
      const createdToday = todos.filter((t) => t.createdAt && dayKey(new Date(t.createdAt)) === today);
      if (createdToday.length >= 5 && createdToday.every((t) => t.done && t.doneAt && dayKey(new Date(t.doneAt)) === today)) stats.award('sozunun_eri');
      reactToInteraction('todo_done', () => {
        if (allDone) {
          stats.award('hepsi_bitti');
          say('todo_all_done');
          scheduleRestAfterAllDone();
        }
        else if (chance(0.7)) say('todo_done', { label: truncate(todo.text, 40) });
      }, { preferFallback: allDone });
    } else {
      broadcastState();
    }
    return todo;
  });
  ipcMain.handle('todos:rename', (_e, id, text) => {
    const todos = todosStore.get();
    const todo = todos.find((t) => t.id === id);
    const clean = String(text || '').trim().slice(0, 300);
    if (todo && clean) { todo.text = clean; todosStore.set(todos); }
    broadcastState();
    return todo;
  });
  ipcMain.handle('todos:stopwatchStart', (_e, id) => {
    const todos = todosStore.get();
    const todo = todos.find((t) => t.id === id);
    if (!todo || todo.done || todo.archivedAt) return null;
    const now = Date.now();
    // Genel odak sayacı çalışıyorsa görev kronometresiyle üst üste binmesin.
    if (timer?.snapshot().status === 'running') timer.pause();
    pauseOtherTodoStopwatches(todos, id, now);
    Object.assign(todo, startTodoStopwatch(todo, now));
    todosStore.set(todos);
    broadcastState();
    return todo;
  });
  ipcMain.handle('todos:stopwatchPause', (_e, id) => {
    const todos = todosStore.get();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return null;
    commitTodoStopwatch(todo, todos, { now: Date.now(), final: false });
    broadcastState();
    return todo;
  });

  ipcMain.handle('todos:setReminder', (_e, id, time) => {
    const todos = todosStore.get();
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const had = !!todo.remindAt;
      todo.remindAt = parseRemindTime(time); todo.reminded = false; todosStore.set(todos);
      if (!had && todo.remindAt) stats.recordScheduledCreated();
      stats.scheduledTodoCount(todos.filter((t) => !t.done && t.remindAt).length);
    }
    broadcastState();
    return todo;
  });
  ipcMain.handle('todos:archive', (_e, id, archived = true) => {
    const todos = todosStore.get();
    const todo = todos.find((t) => t.id === id);
    if (!todo || (archived && !todo.done)) return null;
    todo.archivedAt = archived ? Date.now() : null;
    todosStore.set(todos);
    broadcastState();
    return todo;
  });
  ipcMain.handle('todos:archiveDone', () => {
    const todos = todosStore.get();
    const now = Date.now();
    let changed = false;
    for (const todo of todos) {
      if (todo.done && !todo.archivedAt) { todo.archivedAt = now; changed = true; }
    }
    if (changed) todosStore.set(todos);
    broadcastState();
    return changed;
  });
  ipcMain.handle('todos:delete', (_e, id) => {
    const todos = todosStore.get();
    const todo = todos.find((t) => t.id === id);
    if (todo?.stopwatchStartedAt) commitTodoStopwatch(todo, null, { now: Date.now(), final: false });
    todosStore.set(todos.filter((t) => t.id !== id));
    broadcastState();
    return true;
  });
  // Eski renderer sürümleri veri silmesin: eski clearDone çağrısını da arşivlemeye yönlendir.
  ipcMain.handle('todos:clearDone', () => {
    const todos = todosStore.get();
    const now = Date.now();
    for (const todo of todos) if (todo.done && !todo.archivedAt) todo.archivedAt = now;
    todosStore.set(todos);
    broadcastState();
    return true;
  });

  // Zamanlayıcı
  ipcMain.handle('timer:start', (_e, minutes, label) => { startTimer(minutes, label); return timer.snapshot(); });
  // Karakterin altındaki rozet: boşta başlatır, çalışırken duraklatır, duraklatılmışsa devam ettirir.
  ipcMain.handle('timer:badge', () => {
    const t = timer.snapshot();
    if (t.status === 'running') timer.pause();
    else if (t.status === 'paused') timer.resume();
    else startTimer(settings().lastTimerMinutes || 25);
    return timer.snapshot();
  });
  ipcMain.handle('timer:pause', () => { timer.pause(); return timer.snapshot(); });
  ipcMain.handle('timer:resume', () => { timer.resume(); return timer.snapshot(); });
  ipcMain.handle('timer:cancel', () => { timer.cancel(); return timer.snapshot(); });

  // Kullanıcı moodboard'u
  ipcMain.handle('moodboard:get', (_e, key) => {
    const currentKey = moodMonthKey();
    const months = dataMonths(userMoodStore?.get(), moodLogStore?.get(), currentKey);
    const requested = String(key || '');
    if (requested !== currentKey && !months.includes(requested)) return null;
    return moodboardState(requested);
  });
  ipcMain.handle('moodboard:set', (_e, date, value) => {
    if (!userMoodStore) return false;
    const today = dayKey();
    const key = moodMonthKey();
    const validDate = userMonth(userMoodStore.get(), key, new Date()).some((d) => d.date === date && !d.future);
    if (!validDate || date > today) return false;
    const next = setUserMood(userMoodStore.get(), date, value);
    if (!next) return false;
    userMoodStore.set(next);
    broadcastState();
    return true;
  });

  // Ayarlar ve temalar
  ipcMain.handle('settings:set', (_e, key, value) => setSetting(key, value));
  ipcMain.handle('themes:reload', () => {
    themes.scan();
    loadTheme(settings().themeId);
    applyCharacterLayout();
    broadcastState();
    return themes.list();
  });
  ipcMain.handle('themes:openFolder', () => {
    fs.mkdirSync(userThemesDir, { recursive: true });
    return shell.openPath(userThemesDir);
  });
  ipcMain.handle('themes:openGuide', () => {
    copyGuideToUserFolder();
    return shell.openPath(path.join(userThemesDir, 'TEMA-REHBERI.md'));
  });
  ipcMain.handle('mood:reset', () => {
    mood.reset();
    updateBaseline();
    broadcastState();
    return mood.summary();
  });
  ipcMain.handle('stats:resetDisplay', () => {
    stats.resetDisplayBaseline();
    broadcastState();
    return stats.summary();
  });
  ipcMain.handle('panel:hide', () => { hidePanel(); return true; });
  ipcMain.handle('quick:addTodo', async (_e, text) => {
    const clean = String(text || '').trim().slice(0, 300);
    if (clean) { todosStore.set([...todosStore.get(), { id: uid(), text: clean, done: false, createdAt: Date.now(), doneAt: null, remindAt: null, reminded: false, archivedAt: null }]); stats.todoCreated({ scheduled: false }); }
    broadcastState();
    return true;
  });
  ipcMain.handle('quick:addNote', async (_e, text) => {
    const body = String(text || '').trim().slice(0, 20000);
    if (body) {
      notesStore.set([{ id: uid(), body, createdAt: Date.now(), updatedAt: Date.now(), archivedAt: null }, ...notesStore.get()]);
      stats.noteCreated();
      // Hızlı not da normal yeni notla aynı Nero etkileşimini üretir.
      // Böylece quick add, karakter davranışı ve istatistik mantığı açısından ayrıksı kalmaz.
      reactToInteraction('note_add', () => { if (chance(0.70)) say('note_add'); });
    }
    broadcastState();
    return true;
  });
  ipcMain.on('quick:close', () => { if (quickWin) quickWin.hide(); });
  ipcMain.handle('jar:add', (_e, text) => {
    const item = journal.jarAdd(text);
    if (item) { stats.recordJarAdd(); reactToInteraction('note_add', () => say('jar_add', {}, { force: false })); }
    broadcastState();
    return item;
  });
  ipcMain.handle('data:export', () => exportData());
  ipcMain.handle('data:import', () => importData());
  ipcMain.handle('data:openBackups', () => { fs.mkdirSync(backupDir, { recursive: true }); return shell.openPath(backupDir); });
  ipcMain.handle('update:check', () => checkForUpdates(true));
  ipcMain.handle('update:install', () => installUpdateNow());
  ipcMain.handle('update:onQuit', () => {
    if (updater) updater.autoInstallOnAppQuit = true;
    updateState = { ...updateState, status: 'onquit' };
    broadcastState();
    return updateState;
  });
  ipcMain.handle('update:dismiss', () => { updateState = { ...updateState, dismissed: true }; broadcastState(); return updateState; });
  ipcMain.handle('home:seen', (_e, id) => {
    const ctx = homeDialogueContext();
    homeDialogue.markSeen(String(id || ''), ctx);
    applyHomeDialogueState(homeDialogue.publicState(ctx));
    return true;
  });
  // Yalnız NERO_HOME_DEBUG=1 veya --home-dialogue-debug ile çalışır. Normal sürümde false döner.
  ipcMain.handle('home:debugSelect', (_e, id) => {
    if (!homeDialogue.debug) return false;
    const ctx = homeDialogueContext();
    return homeDialogue.debugSelect(String(id || ''), ctx);
  });
  ipcMain.handle('home:debugContext', () => homeDialogue.debug ? homeDialogueContext() : null);
  // Panel sürükleme: renderer yalnız gesture başlangıç/bitişini bildirir;
  // gerçek konum cursor screen point üzerinden ana süreçte takip edilir.
  ipcMain.on('panel:dragStart', () => startPanelDrag());
  ipcMain.on('panel:dragEnd', () => stopPanelDrag());

  // Panel boyutlandırma: köşedeki tutamaçtan sürüklenir.
  ipcMain.on('panel:resizeStart', (_e, side) => {
    if (!panelWin || resize) return;
    if (panelDrag) stopPanelDrag();
    const b = panelWin.getBounds();
    const c = screen.getCursorScreenPoint();
    resize = {
      side: side === 'left' ? 'left' : 'right',
      start: b, cursor: c,
      interval: setInterval(() => {
        if (!panelWin) return stopResize();
        const p = screen.getCursorScreenPoint();
        const dx = p.x - resize.cursor.x;
        const dy = p.y - resize.cursor.y;
        let width = resize.side === 'right' ? resize.start.width + dx : resize.start.width - dx;
        let height = resize.start.height + dy;
        width = Math.max(PANEL_MIN.width, Math.min(PANEL_MAX.width, width));
        height = Math.max(PANEL_MIN.height, Math.min(PANEL_MAX.height, height));
        const x = resize.side === 'right' ? resize.start.x : resize.start.x + resize.start.width - width;
        syncingMove = true;
        panelWin.setBounds({ x, y: resize.start.y, width: Math.round(width), height: Math.round(height) });
        syncingMove = false;
      }, 16),
      safety: setTimeout(() => stopResize(), 60000)
    };
  });
  ipcMain.on('panel:resizeEnd', () => stopResize());
  ipcMain.handle('panel:minimize', () => {
    resetWindowInteractionState();
    if (panelWin) panelWin.minimize();
    return true;
  });
  ipcMain.handle('panel:open', (_e, tab) => { showPanel(tab); return true; });
  ipcMain.handle('app:quit', () => { quitWithGoodbye(); return true; });

  // Karakter penceresinden gelenler
  ipcMain.on('char:ready', () => {
    sendTheme();
    sendTo(charWin, 'settings', settings());
    sendTo(charWin, 'timer', timer.snapshot());
    updateBaseline(true);
    setTimeout(greet, 1500);
  setTimeout(() => {
    if (!todayMode() && !settings().muted && !settings().hidden) say('ritual_ask', {}, { interrupt: false });
  }, 12000);
  });
  ipcMain.on('char:ignoreMouse', (_e, ignore) => {
    if (charWin && !drag) charWin.setIgnoreMouseEvents(!!ignore, { forward: true });
  });
  ipcMain.on('char:dragStart', () => startDrag());
  ipcMain.on('char:dragEnd', () => stopDrag());
  ipcMain.on('char:bubbleDone', () => { speakingUntil = 0; lastSpeechEndedAt = Date.now(); });
  ipcMain.on('char:pet', () => petNero());
  ipcMain.on('char:hoverStart', () => {
    markUserInteraction();
    stats.recordInteraction('hover', { stage: mood.stage });
    if (peek) {
      peekHoverStartedAt = Date.now(); peekHoverClicked = false;
      const started = peekHoverStartedAt;
      setTimeout(() => {
        if (peek && peekHoverStartedAt === started && !peekHoverClicked && Date.now() - started >= 3000) stats.award('secret_goz_goze');
      }, 3100);
    }
  });
  ipcMain.on('char:hoverEnd', () => {
    if (peek && peekHoverStartedAt && !peekHoverClicked && Date.now() - peekHoverStartedAt >= 3000) stats.award('secret_goz_goze');
    peekHoverStartedAt = 0;
  });
  ipcMain.on('char:contextMenu', () => {
    if (charWin) buildMenu().popup({ window: charWin });
  });
  ipcMain.on('char:click', (_e, point) => {
    if (point && charWin) {
      const L = characterLayout(currentTheme, settings().scale);
      if (point.y >= L.charY && point.y <= L.charY + L.charH * 0.48) stats.recordFaceClick();
    }
    if (peek) peekHoverClicked = true;
    if (mood.state.napping) {
      // İlk tık sadece uyandırır; panel açılmaz, huysuzlanır.
      markUserInteraction();
      stats.recordInteraction('click', { stage: mood.stage });
      wakeNap('click');
      mood.interact('click');
      lastPanelToggleAt = Date.now();
      return;
    }
    if (peek) {
      markUserInteraction();
      stats.recordInteraction('click', { stage: mood.stage });
      mood.interact('click');
      say('peek_caught');
      stats.award('yakaladin');
      peek.cut();
      return;
    }
    const now = Date.now();
    clickTimes = [...clickTimes.filter((t) => now - t < 2500), now];

    if (clickTimes.length >= 4) {
      clickTimes = [];
      markUserInteraction();
      stats.recordInteraction('click', { stage: mood.stage });
      mood.interact('poke_spam');
      updateBaseline();
      say('poke_spam');
      return;
    }
    // Hızlı ardışık tıklamalarda panel açılıp kapanıp durmasın.
    if (now - lastPanelToggleAt < 600) return;
    lastPanelToggleAt = now;

    const opened = togglePanel();
    reactToInteraction(opened ? 'panel' : 'click', () => {
      if (opened && chance(0.45)) say(chance(0.5) ? 'click' : 'panel_open');
    });
  });
}

function startPanelDrag() {
  if (!panelWin || settings().lockPosition) return;
  if (panelDrag) stopPanelDrag();
  if (drag) stopDrag();
  if (resize) stopResize();

  const cursor = screen.getCursorScreenPoint();
  const panelStart = panelWin.getBounds();
  const charStart = charWin ? charWin.getBounds() : null;

  panelDrag = {
    cursor,
    panelStart,
    charStart,
    interval: setInterval(() => {
      if (!panelWin || !panelDrag) return stopPanelDrag();
      const p = screen.getCursorScreenPoint();
      const dx = p.x - panelDrag.cursor.x;
      const dy = p.y - panelDrag.cursor.y;

      const nextPanel = {
        x: Math.round(panelDrag.panelStart.x + dx),
        y: Math.round(panelDrag.panelStart.y + dy),
        width: panelDrag.panelStart.width,
        height: panelDrag.panelStart.height
      };

      syncingMove = true;
      panelWin.setBounds(nextPanel);
      syncingMove = false;

      if (charWin && panelDrag.charStart) {
        charWin.setBounds({
          x: Math.round(panelDrag.charStart.x + dx),
          y: Math.round(panelDrag.charStart.y + dy),
          width: panelDrag.charStart.width,
          height: panelDrag.charStart.height
        });
      }
    }, 16),
    safety: setTimeout(() => stopPanelDrag(), 30000)
  };
}

function stopPanelDrag() {
  if (!panelDrag) return;
  clearInterval(panelDrag.interval);
  clearTimeout(panelDrag.safety);
  panelDrag = null;

  if (charWin) {
    const b = charWin.getBounds();
    settingsStore.patch({ position: { x: b.x, y: b.y } });
  }
  captureLink();
}

function stopResize() {
  if (!resize) return;
  clearInterval(resize.interval);
  clearTimeout(resize.safety);
  resize = null;
  if (!panelWin) return;
  const b = panelWin.getBounds();
  settingsStore.patch({ panelSize: { width: b.width, height: b.height } });
  captureLink();
}

// ---------------------------------------------------------------------------
// Zamanlayıcı olayları
// ---------------------------------------------------------------------------
function wireTimer() {
  timer.on('tick', (snap) => {
    sendTo(charWin, 'timer', snap);
    sendTo(panelWin, 'timer', snap);
  });
  timer.on('started', ({ minutes }) => {
    timerPauseResumeCount = 0;
    stats.productiveAction();
    reactToInteraction('timer_start', () => say('timer_start', { minutes }));
  });
  timer.on('paused', () => {
    const rem = timer.snapshot().remainingMs;
    if (rem >= 500 && rem <= 1500) stats.award('secret_bir_dakika');
    say('timer_pause');
  });
  timer.on('resumed', () => { timerPauseResumeCount += 1; if (chance(0.8)) say('timer_resume'); });
  timer.on('done', ({ minutes, label }) => {
    const now = new Date();
    if (now.getHours() === 23 && now.getMinutes() === 59) stats.award('secret_son_dakikaci');
    stats.focus(minutes, true, { pajama: currentOutfit() === 'pajama', pauseResumeCount: timerPauseResumeCount });
    stats.recordInteraction('timer_done', { stage: mood.stage });
    timerPauseResumeCount = 0;
    if (bee && bee.focusCompleted(minutes)) sendBee();
    homeDialogue.recordTimerResult(true);
    const woke = wakeNap('timer');
    mood.interact('timer_done');
    updateBaseline();
    if (settings().sound) sendTo(charWin, 'sound', 'chime');
    if (woke) setTimeout(() => say('timer_done', { minutes, label }, { force: true }), 4500);
    else say('timer_done', { minutes, label }, { force: true });
    if (Notification.isSupported()) {
      new Notification({
        title: 'Nero: süre bitti',
        body: label ? `"${label}" için ${minutes} dakika tamam.` : `${minutes} dakika tamam. Etkilendim.`,
        icon: iconPath,
        silent: !settings().sound
      }).show();
    }
    broadcastState();
  });
  timer.on('cancelled', ({ progress, minutes }) => {
    stats.focus(minutes * progress, false, { pajama: currentOutfit() === 'pajama', pauseResumeCount: timerPauseResumeCount });
    timerPauseResumeCount = 0;
    homeDialogue.recordTimerResult(false);
    mood.interact('timer_cancel');
    updateBaseline();
    const category = progress < 0.15 ? 'timer_cancel_early' : progress > 0.85 ? 'timer_cancel_late' : 'timer_cancel_mid';
    say(category, { minutes });
    broadcastState();
  });
}

// ---------------------------------------------------------------------------
// Döngüler
// ---------------------------------------------------------------------------
function startLoops() {
  // Arıcılık ana süreçte ilerler; oyun penceresi kapalıyken de üretim sürer.
  setInterval(() => {
    if (!bee) return;
    const gameVisible = beeWin && !beeWin.isDestroyed() && beeWin.isVisible() && !beeWin.isMinimized();
    const gameInFront = gameVisible && beeWin.isFocused();
    if (gameInFront) bee.markSeen();
    if (bee.tick(Date.now(), gameInFront ? null : 2)) {
      sendBee();
      if (Math.random() < 0.1) bee.save();
    }

    // Arıcılık görünür değilken Nero önemli durumları haber verir; böylece çift ses çıkmaz.
    const alerts = bee.pendingAlerts();
    if (alerts.length && !gameVisible && Date.now() - lastBeeAlertAt > 90 * 1000) {
      const s = settings();
      if (!s.muted && !s.hidden && !mood.state.asleep && !mood.state.napping) {
        lastBeeAlertAt = Date.now();
        if (s.sound && bee.notificationSoundEnabled(alerts[0].kind)) sendTo(charWin, 'sound', 'chime');
        say(alerts[0].kind, alerts[0].vars, { interrupt: false });
      }
    }
  }, 1000);

  // Göz takibi için fare konumu (~30 fps). Sadece değiştiğinde gönderilir.
  setInterval(() => {
    if (!charWin || !charWin.isVisible()) return;
    const p = screen.getCursorScreenPoint();
    if (p.x === lastCursor.x && p.y === lastCursor.y) return;
    lastCursor = p;
    trackCursorReturn(p);
    trackAchievementCursor(p);
    const b = charWin.getBounds();
    sendTo(charWin, 'cursor', { x: p.x, y: p.y, wx: b.x, wy: b.y });
  }, 33);

  // Masaüstünde hep görünür kal: "masaüstünü göster" ya da başka bir şey Nero'yu gizlerse geri getir.
  setInterval(() => {
    const s = settings();
    if (!charWin || s.hidden || s.stayVisible === false || drag || peek) return;
    if (charWin.isMinimized()) charWin.restore();
    if (!charWin.isVisible()) charWin.showInactive();
    if (s.alwaysOnTop && !charWin.isAlwaysOnTop()) charWin.setAlwaysOnTop(true, 'floating');
  }, 1500);

  // Ruh hali: 30 saniyede bir.
  let lastTick = Date.now();
  setInterval(() => {
    const now = Date.now();
    const dt = Math.min(now - lastTick, 5 * MIN); // uyku/hazırda bekletme sonrası sıçramayı sınırla
    lastTick = now;
    const systemIdleSec = powerMonitor.getSystemIdleTime();
    mood.tick(dt, systemIdleSec, screenLocked);
    const userActive = !screenLocked && systemIdleSec < 120;
    homeDialogue.noteActivity(userActive, now);
    if (userActive) stats.markActive();
    stats.sessionTick(dt, userActive);
    journal.recordHappiness(mood.summary().happiness);
    archiveClosedMoodboards();
    trackActivity(dt);
    if (settings().lastBackupDay !== new Date().toDateString()) autoBackup();
    updateBaseline();
    if (panelWin && panelWin.isVisible()) sendTo(panelWin, 'state', fullState());
  }, 30 * 1000);

  // Ana sayfa konuşmaları panel kapalıyken de kendi 5–10 dk ritminde akar.
  setInterval(tickHomeDialogue, 15 * 1000);

  // Kendi kendine konuşma.
  scheduleNextTalk();
  setInterval(() => {
    napTick();
    productivityNudge();
    checkReminders();
    maybeShiftSelfMood();
    checkDaySummary();
    if (Date.now() >= nextPeekAt && !mood.state.napping) {
      nextPeekAt = Date.now() + rand(25, 45) * MIN;
      if (settings().peekVisits !== false) doPeek();
    }
    if (Date.now() < nextTalkAt) return;
    scheduleNextTalk();
    if (mood.state.asleep || mood.state.napping || settings().muted || settings().hidden || drag) return;
    let category = mood.selfTalkCategory();
    if (selfMood && category === 'idle' && chance(0.4)) category = `self_mood_${selfMood.type}`;
    // Yaşayan temalar: uygun temadayken arada bir o temaya özel bir şey söyler.
    const skinFlavor = { yagmur: 'idle_yagmur', kar: 'idle_kar', mum: 'idle_mum', cilek: 'idle_cilek', ege: 'idle_ege' }[currentTheme.manifest.ui.skin];
    if (skinFlavor && category === 'idle' && chance(0.35) && dialogue.has(skinFlavor)) category = skinFlavor;
    if (mood.stage === 'content' && chance(0.12)) {
      const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      say('quote_say', { quote: q.t, nero: q.nero }, { interrupt: false });
    } else if (mood.stage === 'content' && chance(0.1)) {
      const sum = stats.summary();
      say('know_you', {
        todos: sum.totals.todos, days: sum.daysTogether, hours: Math.floor(sum.totals.focusMin / 60),
        sighs: Math.floor(sum.totals.focusMin * 3) + 12, quit: sum.totals.timersQuit, pets: sum.totals.pets
      }, { interrupt: false });
    } else if ((category === 'sulky' || category === 'lonely') && chance(0.3) && journal.randomPast()) {
      const a = journal.randomPast();
      say('archive_recall', { item: truncate(a.text, 50) }, { interrupt: false });
    } else if (category === 'idle' && chance(0.12) && journal.jarCount() >= 3) {
      const j = journal.jarRandom();
      if (j) { stats.recordJarRecall(); say('jar_recall', { text: truncate(j.text, 60) }, { interrupt: false }); }
    } else {
      say(category, {}, { interrupt: false });
    }
  }, 20 * 1000);

  mood.on('stage', ({ stage, previous }) => {
    stats.recordState(stage);
    const order = ['content', 'bored', 'sulky', 'lonely'];
    // Sadece kötüye giderken duyur (kademeli geçiş hissi için).
    if (order.indexOf(stage) > order.indexOf(previous) && !settings().muted) {
      say(stage, {}, { interrupt: false });
      scheduleNextTalk();
    }
  });
  mood.on('sleep', () => {
    if (!settings().muted && chance(0.5)) say('fall_asleep', {}, { interrupt: false });
    setTimeout(() => updateBaseline(true), 3500);
  });
  mood.on('wake', () => {
    updateBaseline(true);
    if (!settings().muted && chance(0.6)) setTimeout(() => say('wake'), 800);
  });

  powerMonitor.on('lock-screen', () => { screenLocked = true; });
  powerMonitor.on('unlock-screen', () => { screenLocked = false; });
}

// ---------------------------------------------------------------------------
// Sürpriz ziyaret: Nero arada bir ekranın ortasına fırlar ya da kenardan kafasını uzatır,
// bir şey söyler ve yerine döner.
// ---------------------------------------------------------------------------
function animateBounds(from, to, ms) {
  return new Promise((resolve) => {
    const start = Date.now();
    const step = () => {
      if (!charWin) return resolve();
      const t = Math.min(1, (Date.now() - start) / ms);
      const e = 1 - Math.pow(1 - t, 3);
      charWin.setBounds({
        x: Math.round(from.x + (to.x - from.x) * e),
        y: Math.round(from.y + (to.y - from.y) * e),
        width: from.width, height: from.height
      });
      if (t < 1) setTimeout(step, 16);
      else { charWin.webContents.invalidate(); resolve(); }
    };
    step();
  });
}

async function doPeek() {
  const s = settings();
  if (!charWin || peek || drag || s.muted || s.hidden || mood.state.asleep || mood.state.napping) return;
  if (panelWin && panelWin.isVisible()) return;
  stats.recordPeek();
  const b = charWin.getBounds();
  const wa = screen.getDisplayMatching(b).workArea;
  const L = characterLayout(currentTheme, s.scale);
  const mode = chance(0.45) ? 'center' : 'edge';
  const side = chance(0.5) ? 'left' : 'right';
  let target;
  let visible = { min: 0, max: b.width };
  if (mode === 'center') {
    target = { x: Math.round(wa.x + wa.width / 2 - b.width / 2), y: Math.round(wa.y + wa.height / 2 - b.height / 2) };
  } else {
    const y = Math.round(wa.y + 40 + Math.random() * Math.max(0, wa.height - b.height - 80));
    if (side === 'right') {
      const x = Math.round(wa.x + wa.width - (L.charX + L.charW * 0.65));
      target = { x, y };
      visible = { min: 0, max: wa.x + wa.width - x };
    } else {
      const x = Math.round(wa.x - (L.charX + L.charW * 0.35));
      target = { x, y };
      visible = { min: wa.x - x, max: b.width };
    }
  }

  let cut;
  const cutPromise = new Promise((r) => { cut = r; });
  const restoreAlwaysOnTop = s.alwaysOnTop !== false;
  const visibleMs = rand(4500, 6500);
  peek = { home: { x: b.x, y: b.y }, cut };

  // Peek sırasında normal masaüstü pencerelerinin üzerinde kalır, ancak focus çalmaz.
  try {
    charWin.setAlwaysOnTop(true, 'screen-saver');
    charWin.showInactive();
    charWin.moveTop();
  } catch (_) { /* platform fallback */ }

  sendTo(charWin, 'peek', { mode, side, visible });
  await animateBounds(b, { ...b, ...target }, mode === 'center' ? 220 : 520);
  say(mode === 'center' ? 'peek_center' : 'peek_edge', {}, { force: false });
  await Promise.race([new Promise((r) => setTimeout(r, visibleMs)), cutPromise]);
  if (!charWin) { peek = null; return; }
  const now = charWin.getBounds();
  await animateBounds(now, { ...now, ...peek.home }, 480);
  sendTo(charWin, 'peek', null);

  // Kullanıcının peek öncesindeki topmost tercihine geri dön.
  try {
    if (restoreAlwaysOnTop) charWin.setAlwaysOnTop(true, 'floating');
    else charWin.setAlwaysOnTop(false);
  } catch (_) { /* platform fallback */ }
  peek = null;
}

// ---------------------------------------------------------------------------
// Hatırlatıcılar
// ---------------------------------------------------------------------------
// "15:30" gibi bir saati bir sonraki o saate çevirir (geçtiyse yarın).
function parseRemindTime(time) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(time || '').trim());
  if (!m) return null;
  const d = new Date();
  d.setHours(Math.min(23, Number(m[1])), Math.min(59, Number(m[2])), 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d.getTime();
}

// Yeni rozet: uygulama içi tepki + Windows bildirimi, yalnız locked -> unlocked anında.
let unlockDelay = 0;
let unlockNotificationAt = 0;
function handleUnlock(a) {
  unlockDelay = Math.max(unlockDelay, Date.now()) + 6500;
  setTimeout(() => {
    if (settings().sound) sendTo(charWin, 'sound', 'chime');
    say('achievement', { title: a.title }, { force: true });
  }, Math.max(2500, unlockDelay - Date.now() - 4000));

  unlockNotificationAt = Math.max(unlockNotificationAt, Date.now()) + 1800;
  setTimeout(() => {
    const title = a.hidden ? 'Gizli başarım keşfedildi!' : 'Yeni rozet açıldı!';
    notify(title, `${a.title} — ${a.completedDesc || a.desc}`);
  }, Math.max(300, unlockNotificationAt - Date.now() - 1200));
  broadcastState();
}

function notify(title, body) {
  if (!Notification.isSupported()) return null;
  const n = new Notification({ title, body, icon: iconPath, silent: !settings().sound });
  n.show();
  return n;
}

function notifyAck(title, body, kind) {
  const n = notify(title, `${body} Bildirime tıklarsan “yaptım” olarak sayacağım.`);
  if (n) n.once('click', () => { stats.recordReminderAck(kind); broadcastState(); });
}

function checkReminders() {
  const now = Date.now();
  const todos = todosStore.get();
  let changed = false;
  for (const t of todos) {
    if (t.done || !t.remindAt || t.reminded || now < t.remindAt) continue;
    t.reminded = true;
    changed = true;
    wakeNap('timer');
    if (settings().sound) sendTo(charWin, 'sound', 'chime');
    speakingUntil = 0;
    say('reminder', { label: truncate(t.text, 50) }, { force: true });
    notify('Nero hatırlatıyor', t.text);
  }
  if (changed) { todosStore.set(todos); broadcastState(); }
}

// Su ve mola: sadece bilgisayar başındayken sayılır.
let activeStreakMs = 0;
let sinceWaterMs = 0;
function trackActivity(dt) {
  const s = settings();
  const idle = powerMonitor.getSystemIdleTime();
  if (idle >= 5 * 60 || screenLocked) { activeStreakMs = 0; return; }
  activeStreakMs += dt;
  sinceWaterMs += dt;
  const quiet = s.hidden || mood.state.asleep || mood.state.napping || drag || peek;
  if (s.waterEvery > 0 && sinceWaterMs >= s.waterEvery * MIN && !quiet) {
    sinceWaterMs = 0;
    say('remind_water', {}, { interrupt: false });
    notifyAck('Nero: su molası', 'Biraz su iç.', 'water');
  }
  const breakEvery = todayMode() === 'sakin' && s.breakEvery > 45 ? 45 : s.breakEvery;
  if (breakEvery > 0 && activeStreakMs >= breakEvery * MIN && timer.snapshot().status !== 'running' && !quiet) {
    activeStreakMs = 0;
    say('remind_break', {}, { interrupt: false });
    notifyAck('Nero: mola zamanı', 'Kısa bir mola ver.', 'break');
  }
}

// Gün sonu özeti: akşam 7 ile 11 arasında, günde bir kez.
function checkDaySummary() {
  const s = settings();
  const now = new Date();
  const h = now.getHours();
  if (!s.daySummary || h < 19 || h >= 23) return;
  const key = now.toDateString();
  if (s.lastSummaryDay === key) return;
  if (s.hidden || mood.state.asleep || mood.state.napping || drag || peek) return;
  if (powerMonitor.getSystemIdleTime() > 120) return;
  settingsStore.patch({ lastSummaryDay: key });
  stats.recordDaySummary();
  const today = stats.summary().today;
  const category = today.todos === 0 && today.focus === 0 ? 'day_summary_none'
    : today.todos >= 3 || today.focus >= 60 ? 'day_summary_good' : 'day_summary_ok';
  say(category, { todos: today.todos, focus: today.focus }, { force: true });
}

// ---------------------------------------------------------------------------
// Yedekleme: her gün otomatik yedek (son 7 gün saklanır), elle dışa/içe aktarma
// ---------------------------------------------------------------------------
const backupDir = path.join(app.getPath('userData'), 'yedekler');

async function exportBee() {
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const res = await dialog.showSaveDialog(beeDialogParent(), {
    title: 'Arıcılık kaydını dışa aktar',
    defaultPath: path.join(app.getPath('documents'), `nero-aricilik-${stamp}.json`),
    filters: [{ name: 'Nero arıcılık kaydı', extensions: ['json'] }]
  });
  if (res.canceled || !res.filePath) return { ok: false };
  bee.save();
  const data = { app: 'Nero', type: 'bee', version: app.getVersion(), createdAt: d.toISOString(), bee: beeStore.get() };
  fs.writeFileSync(res.filePath, JSON.stringify(data, null, 2), 'utf8');
  return { ok: true, path: res.filePath };
}

async function importBee() {
  const parent = beeDialogParent();
  const res = await dialog.showOpenDialog(parent, {
    title: 'Arıcılık kaydını içe aktar',
    filters: [{ name: 'Nero arıcılık kaydı', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (res.canceled || !res.filePaths[0]) return { ok: false };
  let data;
  try {
    data = JSON.parse(fs.readFileSync(res.filePaths[0], 'utf8'));
    if (!data || data.app !== 'Nero' || !data.bee || !data.bee.tiles || !data.bee.hives) throw new Error('Bu dosya bir Nero arıcılık kaydı değil.');
  } catch (err) {
    await dialog.showMessageBox(parent, { type: 'error', title: 'İçe aktarılamadı', message: err.message });
    return { ok: false };
  }
  const answer = await dialog.showMessageBox(parent, {
    type: 'warning', buttons: ['İçe aktar', 'Vazgeç'], defaultId: 1, cancelId: 1,
    title: 'Arıcılık kaydını içe aktar',
    message: 'Şu anki çiftliğin bu kayıtla değiştirilecek.',
    detail: `Kayıttaki çiftlik: ${Math.floor(data.bee.coins || 0)} jeton, ${Object.keys(data.bee.hives).length} kovan.\nŞu anki çiftliğin önce yedeklenecek (${path.join(backupDir)}).`
  });
  if (answer.response !== 0) return { ok: false };
  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(path.join(backupDir, `nero-aricilik-ice-aktarma-oncesi-${Date.now()}.json`),
    JSON.stringify({ app: 'Nero', type: 'bee', createdAt: new Date().toISOString(), bee: beeStore.get() }, null, 2), 'utf8');
  beeStore.set(data.bee);
  bee = new BeeGame(beeStore);
  bee.markSeen();
  sendBee();
  return { ok: true };
}

// Oyun ayarları artık oyunun içinde: pencereler oyun penceresinin üstünde açılsın
function beeDialogParent() {
  return beeWin && !beeWin.isDestroyed() ? beeWin : panelWin;
}

async function resetBee() {
  const parent = beeDialogParent();
  const first = await dialog.showMessageBox(parent, {
    type: 'warning',
    buttons: ['Devam et', 'Vazgeç'],
    defaultId: 1,
    cancelId: 1,
    title: 'Arıcılık oyununu sıfırla',
    message: 'Çiftliğini sıfırlamak istediğine emin misin?',
    detail: 'Jetonlar, kovanlar, çiçekler, siparişler, rakip ilerlemesi ve tüm arıcılık kaydı başlangıç durumuna döner. Önce otomatik yedek alınacak.'
  });
  if (first.response !== 0) return { ok: false, cancelled: true };

  const second = await dialog.showMessageBox(parent, {
    type: 'warning',
    buttons: ['Evet, sıfırla', 'Hayır'],
    defaultId: 1,
    cancelId: 1,
    title: 'Son onay',
    message: 'Bu işlem mevcut çiftliğin yerine yeni bir çiftlik oluşturacak.',
    detail: 'Devam edersen oyun 200 jeton, ilk kovan ve başlangıç tarhlarıyla yeniden başlar.'
  });
  if (second.response !== 0) return { ok: false, cancelled: true };

  fs.mkdirSync(backupDir, { recursive: true });
  bee.save();
  fs.writeFileSync(
    path.join(backupDir, `nero-aricilik-sifirlama-oncesi-${Date.now()}.json`),
    JSON.stringify({ app: 'Nero', type: 'bee', createdAt: new Date().toISOString(), bee: beeStore.get() }, null, 2),
    'utf8'
  );

  beeStore.set(freshState());
  bee = new BeeGame(beeStore);
  bee.markSeen();
  sendBee();
  return { ok: true };
}

function snapshotData() {
  const { position, ...cleanSettings } = settings();
  return {
    app: 'Nero', version: app.getVersion(), createdAt: new Date().toISOString(),
    notes: notesStore.get(), todos: todosStore.get(), stats: statsStore.get(), settings: cleanSettings,
    moodLog: moodLogStore?.get() || null, archive: archiveStore?.get() || null, jar: jarStore?.get() || null,
    userMoodboard: userMoodStore?.get() || null,
    homeDialogue: homeDialogueStore?.get() || null,
    bee: beeStore ? beeStore.get() : null
  };
}

function autoBackup() {
  try {
    fs.mkdirSync(backupDir, { recursive: true });
    const d = new Date();
    const name = `nero-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.json`;
    fs.writeFileSync(path.join(backupDir, name), JSON.stringify(snapshotData(), null, 2), 'utf8');
    const files = fs.readdirSync(backupDir).filter((f) => /^nero-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
    for (const old of files.slice(0, Math.max(0, files.length - 7))) fs.unlinkSync(path.join(backupDir, old));
    settingsStore.patch({ lastBackupDay: d.toDateString() });
  } catch (err) {
    log('otomatik yedek alınamadı:', err);
  }
}

async function exportData() {
  const d = new Date();
  const res = await dialog.showSaveDialog(panelWin, {
    title: 'Nero verilerini dışa aktar',
    defaultPath: path.join(app.getPath('documents'), `nero-yedek-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.json`),
    filters: [{ name: 'Nero yedeği', extensions: ['json'] }]
  });
  if (res.canceled || !res.filePath) return { ok: false };
  fs.writeFileSync(res.filePath, JSON.stringify(snapshotData(), null, 2), 'utf8');
  return { ok: true, path: res.filePath };
}

async function importData() {
  const res = await dialog.showOpenDialog(panelWin, {
    title: 'Nero yedeğini geri yükle',
    filters: [{ name: 'Nero yedeği', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (res.canceled || !res.filePaths[0]) return { ok: false };
  let data;
  try {
    data = JSON.parse(fs.readFileSync(res.filePaths[0], 'utf8'));
    if (data.app !== 'Nero' || !Array.isArray(data.notes) || !Array.isArray(data.todos)) throw new Error('Bu dosya bir Nero yedeği değil.');
  } catch (err) {
    await dialog.showMessageBox(panelWin, { type: 'error', title: 'Geri yüklenemedi', message: err.message });
    return { ok: false };
  }
  const answer = await dialog.showMessageBox(panelWin, {
    type: 'question', buttons: ['Geri yükle', 'Vazgeç'], defaultId: 1, cancelId: 1,
    title: 'Yedeği geri yükle',
    message: `Bu yedekte ${data.notes.length} not ve ${data.todos.length} iş var.`,
    detail: 'Şu anki notların ve işlerin bu yedektekilerle değiştirilecek. Şu anki halin önce otomatik olarak yedeklenecek.'
  });
  if (answer.response !== 0) return { ok: false };
  autoBackup();
  fs.writeFileSync(path.join(backupDir, `nero-geri-yukleme-oncesi-${Date.now()}.json`), JSON.stringify(snapshotData(), null, 2), 'utf8');
  notesStore.set(data.notes);
  todosStore.set(data.todos);
  if (data.moodLog && typeof data.moodLog === 'object') moodLogStore.set(data.moodLog);
  if (data.archive && typeof data.archive === 'object') archiveStore.set(data.archive);
  if (data.jar && typeof data.jar === 'object') jarStore.set(data.jar);
  if (data.userMoodboard && typeof data.userMoodboard === 'object') userMoodStore.set(data.userMoodboard);
  if (data.bee && typeof data.bee === 'object' && data.bee.tiles && data.bee.hives) {
    beeStore.set(data.bee);
    bee = new BeeGame(beeStore);
    sendBee();
  }
  if (data.stats && typeof data.stats === 'object') {
    statsStore.set(data.stats); stats = new Stats(statsStore); stats.onUnlock = handleUnlock;
    stats.onDeskUnlock = (item) => { setTimeout(() => say('desk_unlock', { title: item.title }, { force: true }), 1500); };
  }
  if (data.homeDialogue && typeof data.homeDialogue === 'object') {
    homeDialogueStore.set(data.homeDialogue);
    homeDialogue = new HomeDialogueEngine({
      store: homeDialogueStore, logger: (...parts) => log(...parts), onChange: (h) => applyHomeDialogueState(h)
    });
  }
  buildHome({ checkLetter: false });
  archiveClosedMoodboards();
  broadcastState();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Otomatik güncelleme (GitHub Releases). Sormadan asla kurmaz.
// ---------------------------------------------------------------------------
let updater = null;
let updateState = { status: app.isPackaged ? 'idle' : 'dev', version: null, percent: 0, dismissed: false };

function setupUpdater() {
  if (!app.isPackaged) return;
  try {
    ({ autoUpdater: updater } = require('electron-updater'));
  } catch (err) {
    log('güncelleme modülü yüklenemedi:', err);
    updateState = { ...updateState, status: 'error' };
    return;
  }
  updater.autoDownload = true;
  updater.disableWebInstaller = true;
  updater.autoInstallOnAppQuit = false;
  updater.logger = { info: () => {}, warn: (m) => log('güncelleme uyarısı:', String(m)), error: (m) => log('güncelleme hatası:', String(m)), debug: () => {} };
  updater.on('checking-for-update', () => { updateState = { ...updateState, status: 'checking' }; broadcastState(); });
  updater.on('update-not-available', () => { updateState = { ...updateState, status: 'latest' }; broadcastState(); });
  updater.on('update-available', (info) => { updateState = { ...updateState, status: 'downloading', version: info.version, percent: 0, dismissed: false }; broadcastState(); });
  updater.on('download-progress', (p) => { updateState = { ...updateState, percent: Math.round(p.percent || 0) }; broadcastState(); });
  updater.on('update-downloaded', (info) => {
    updateState = { ...updateState, status: 'ready', version: info.version, percent: 100, dismissed: false };
    broadcastState();
    say('update_ready', { version: info.version }, { force: true });
  });
  updater.on('error', (err) => {
    const text = String(err && err.message ? err.message : err);
    // İndirilen dosya ile GitHub'daki latest.yml eşleşmiyorsa sebebi internet değildir.
    const kind = /checksum|sha512/i.test(text) ? 'mismatch' : 'error';
    updateState = { ...updateState, status: kind };
    log('güncelleme hatası:', err);
    broadcastState();
  });
  setTimeout(() => checkForUpdates(false), 30 * 1000);
  setInterval(() => checkForUpdates(false), 4 * 60 * MIN);
}

function checkForUpdates(manual) {
  if (!updater) return updateState;
  if (!manual && settings().autoUpdate === false) return updateState;
  if (['downloading', 'ready', 'onquit'].includes(updateState.status)) return updateState;
  updater.checkForUpdates().catch((err) => { updateState = { ...updateState, status: 'error' }; log('güncelleme kontrolü başarısız:', err); broadcastState(); });
  return updateState;
}

function installUpdateNow() {
  if (!updater || updateState.status === 'idle') return false;
  isQuitting = true;
  for (const store of [settingsStore, notesStore, todosStore, moodStore, statsStore, moodLogStore, archiveStore, jarStore, homeDialogueStore, userMoodStore, dialogueHistoryStore, beeStore]) store?.flush();
  setImmediate(() => updater.quitAndInstall(true, true));
  return true;
}

// ---------------------------------------------------------------------------
// Geri dönüş şakası: fare uzun süre Nero'dan uzakta kaldıktan sonra yanına gelince
// Nero seni "yakalar". Sadece fare konumu kullanılır; başka pencerelere bakılmaz.
// ---------------------------------------------------------------------------
let cursorAwaySince = Date.now();
let cursorNear = false;
function trackCursorReturn(p) {
  if (!charWin) return;
  const b = charWin.getBounds();
  const margin = 60;
  const near = p.x >= b.x - margin && p.x <= b.x + b.width + margin && p.y >= b.y - margin && p.y <= b.y + b.height + margin;
  if (near === cursorNear) return;
  cursorNear = near;
  if (!near) { cursorAwaySince = Date.now(); return; }
  const s = settings();
  const awayLong = Date.now() - cursorAwaySince > 20 * MIN;
  if (!awayLong || !s.desktopJokes || s.muted || s.hidden || drag || peek) return;
  if (mood.state.asleep || mood.state.napping) return;
  if (Date.now() - lastDesktopJokeAt < 15 * MIN || !chance(0.6)) return;
  lastDesktopJokeAt = Date.now();
  say('desktop_return');
}

// ---------------------------------------------------------------------------
// Tema dosyaları için özel protokol
// ---------------------------------------------------------------------------
const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json'
};

function registerThemeProtocol() {
  protocol.handle(SCHEME, async (request) => {
    try {
      const url = new URL(request.url);
      const file = themes.resolveAsset(url.hostname, url.pathname.replace(/^\/+/, ''));
      if (!file) return new Response('Bulunamadı', { status: 404 });
      const res = await net.fetch(pathToFileURL(file).toString());
      const body = await res.arrayBuffer();
      return new Response(body, {
        status: 200,
        headers: {
          'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
          'access-control-allow-origin': '*',
          'cache-control': 'no-cache'
        }
      });
    } catch (err) {
      return new Response(String(err.message), { status: 500 });
    }
  });
}

// ---------------------------------------------------------------------------
// Başlangıç
// ---------------------------------------------------------------------------
app.whenReady().then(() => {
  fs.mkdirSync(userData, { recursive: true });
  copyGuideToUserFolder();

  settingsStore = new JsonStore(userData, 'settings', DEFAULT_SETTINGS);
  notesStore = new JsonStore(userData, 'notes', []);
  todosStore = new JsonStore(userData, 'todos', []);
  // 4.3.0 timing migration: eski işler alanlar olmadan da çalışır.
  // Önceki oturum beklenmedik kapandıysa çalışan kronometreyi çevrimdışı zamanı saymadan duraklat.
  {
    const migratedTodos = todosStore.get().map((todo) => {
      const normalized = normalizeTodoTiming(todo);
      normalized.stopwatchStartedAt = null;
      return normalized;
    });
    todosStore.set(migratedTodos);
  }
  moodStore = new JsonStore(userData, 'mood', {});
  statsStore = new JsonStore(userData, 'stats', {});
  stats = new Stats(statsStore);
  moodLogStore = new JsonStore(userData, 'moodlog', {});
  archiveStore = new JsonStore(userData, 'archive', {});
  jarStore = new JsonStore(userData, 'jar', {});
  homeDialogueStore = new JsonStore(userData, 'home-dialogue-state', {});
  userMoodStore = new JsonStore(userData, 'user-moodboard', { days: {}, exports: {} });
  dialogueHistoryStore = new JsonStore(userData, 'dialogue-history', { recent: {} });
  beeStore = new JsonStore(userData, 'bee', {});
  bee = new BeeGame(beeStore);
  bee.markAway();
  journal = new Journal({ moodStore: moodLogStore, archiveStore, jarStore });
  // Migration sırasında mevcut saatli görevler sayılır; onUnlock henüz bağlı olmadığı için eski
  // kullanıcı verileri için toplu Windows bildirimi spamı oluşmaz.
  stats.scheduledTodoCount(todosStore.get().filter((t) => !t.done && t.remindAt).length);
  stats.onUnlock = handleUnlock;
  stats.onDeskUnlock = (item) => {
    setTimeout(() => {
      if (settings().sound) sendTo(charWin, 'sound', 'chime');
      say('desk_unlock', { title: item.title }, { force: true });
    }, 1500);
    broadcastState();
  };

  themes = new ThemeManager({ builtinDir: builtinThemesDir, userDir: userThemesDir });
  themes.scan();
  dialogue = new Dialogue({ historyStore: dialogueHistoryStore });
  loadTheme(settings().themeId);
  if (currentTheme.id !== settings().themeId) settingsStore.patch({ themeId: currentTheme.id });

  mood = new Mood(moodStore);
  timer = new Timer();
  homeDialogue = new HomeDialogueEngine({
    store: homeDialogueStore,
    logger: (...parts) => log(...parts),
    onChange: (h) => applyHomeDialogueState(h)
  });
  archiveClosedMoodboards();
  buildHome({ checkLetter: false });

  registerThemeProtocol();
  registerIpc();
  wireTimer();
  createCharacterWindow();
  createTray();
  startLoops();
  stats.evaluate();
  autoBackup();
  setupUpdater();
  applyQuickShortcut();
  // Sabitlenmiş panel açık bırakıldıysa geri aç.
  if (settings().panelPinned && settings().panelOpen) setTimeout(() => showPanel('home'), 1200);

  screen.on('display-removed', () => {
    if (!charWin) return;
    const b = charWin.getBounds();
    if (!isVisibleOnSomeDisplay(b)) {
      const pos = defaultPosition(b);
      charWin.setBounds({ ...b, ...pos });
      settingsStore.patch({ position: pos });
    }
  });
});

app.on('second-instance', () => {
  if (settings().hidden) setSetting('hidden', false);
  bringRunningWindowsToFront();
});

app.on('activate', () => {
  if (!settingsStore) return;
  if (settings().hidden) setSetting('hidden', false);
  bringRunningWindowsToFront();
});

app.on('before-quit', () => {
  isQuitting = true;
  // Açık iş kronometresini son kez güvenle durdur; kapalı geçen süre bir sonraki açılışta sayılmaz.
  try { pauseAllTodoStopwatches({ final: false }); } catch (err) { log('iş kronometresi kapatılırken durdurulamadı:', err); }
  try { globalShortcut.unregisterAll(); } catch (_) { /* yoksay */ }
  for (const store of [settingsStore, notesStore, todosStore, moodStore, statsStore, moodLogStore, archiveStore, jarStore, homeDialogueStore, userMoodStore, beeStore]) store?.flush();
});

app.on('window-all-closed', (e) => {
  // Tepside yaşamaya devam et; sadece "Çıkış" ile kapanır.
  if (!isQuitting) e.preventDefault?.();
});
