// Kullanıcının ve Nero'nun aylık moodboard verileri için saf yardımcılar.
// Renderer ve PNG dışa aktarma aynı takvim modelini kullanır.

const USER_MOODS = new Set(['green', 'yellow', 'red']);

function pad2(n) { return String(n).padStart(2, '0'); }

function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function validMonthKey(key) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(String(key || ''));
}

function parseMonthKey(key) {
  if (!validMonthKey(key)) return null;
  const [year, month] = key.split('-').map(Number);
  return { year, month };
}

function daysInMonthKey(key) {
  const parsed = parseMonthKey(key);
  if (!parsed) return 0;
  return new Date(parsed.year, parsed.month, 0).getDate();
}

function dateKeyFor(key, day) {
  const count = daysInMonthKey(key);
  const n = Number(day);
  if (!count || !Number.isInteger(n) || n < 1 || n > count) return null;
  return `${key}-${pad2(n)}`;
}

function monthLabelTr(key) {
  const parsed = parseMonthKey(key);
  if (!parsed) return '';
  const label = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' })
    .format(new Date(parsed.year, parsed.month - 1, 1));
  return label ? label.charAt(0).toLocaleUpperCase('tr-TR') + label.slice(1) : key;
}

function userMonth(data, key = monthKey(), now = new Date()) {
  const count = daysInMonthKey(key);
  const days = data?.days && typeof data.days === 'object' ? data.days : {};
  const today = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  return Array.from({ length: count }, (_, i) => {
    const day = i + 1;
    const date = dateKeyFor(key, day);
    const value = USER_MOODS.has(days[date]) ? days[date] : null;
    return { day, date, value, future: date > today };
  });
}

function setUserMood(data, date, value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || '')) || !USER_MOODS.has(value)) return null;
  const next = {
    ...(data && typeof data === 'object' ? data : {}),
    days: { ...((data && data.days && typeof data.days === 'object') ? data.days : {}) },
    exports: { ...((data && data.exports && typeof data.exports === 'object') ? data.exports : {}) }
  };
  next.days[date] = value;
  return next;
}

function closedDataMonths(userData, neroData, current = monthKey()) {
  const months = new Set();
  for (const key of Object.keys(userData?.days || {})) {
    const mk = key.slice(0, 7);
    if (validMonthKey(mk) && mk < current) months.add(mk);
  }
  for (const key of Object.keys(neroData?.days || {})) {
    const mk = key.slice(0, 7);
    if (validMonthKey(mk) && mk < current) months.add(mk);
  }
  return [...months].sort();
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[ch]);
}

function renderMoodboardSvg({ key, userDays = [], neroDays = [], ui = {} }) {
  const width = 1080;
  const height = 900;
  const paper = ui.paper || '#F7EFE7';
  const surface = ui.surface || '#FFFBF6';
  const ink = ui.ink || '#4A3A36';
  const muted = ui.muted || '#9A8580';
  const line = ui.line || '#EADCD2';
  const accent = ui.accent || '#E6A9A4';
  const secondary = ui.secondary || '#A9BCA2';
  const label = monthLabelTr(key);
  const week = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const parsed = parseMonthKey(key) || { year: 2000, month: 1 };
  const firstDow = (new Date(parsed.year, parsed.month - 1, 1).getDay() + 6) % 7;

  const userColors = { green: '#6FAF8F', yellow: '#D9C25A', red: '#C46F5F' };
  const neroColors = { c1: '#C46F5F', c2: '#E0A15A', c3: '#D9C25A', c4: '#8FBF8A', c5: '#6FAF8F' };

  function board(title, days, y, mode) {
    const parts = [`<text x="72" y="${y}" font-family="Segoe UI,Arial,sans-serif" font-size="30" font-weight="700" fill="${esc(ink)}">${esc(title)}</text>`];
    week.forEach((w, i) => parts.push(`<text x="${116 + i * 126}" y="${y + 42}" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="16" font-weight="600" fill="${esc(muted)}">${w}</text>`));
    for (const d of days) {
      const slot = firstDow + d.day - 1;
      const col = slot % 7;
      const row = Math.floor(slot / 7);
      const cx = 116 + col * 126;
      const cy = y + 90 + row * 62;
      const fill = mode === 'user' ? (userColors[d.value] || surface) : (neroColors[d.cls] || surface);
      const opacity = d.future ? 0.35 : 1;
      parts.push(`<circle cx="${cx}" cy="${cy}" r="21" fill="${esc(fill)}" stroke="${esc(d.value || d.cls ? fill : line)}" stroke-width="2" opacity="${opacity}"/>`);
      parts.push(`<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="13" font-weight="700" fill="${esc(ink)}" opacity="${opacity}">${d.day}</text>`);
    }
    return parts.join('');
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" rx="36" fill="${esc(paper)}"/>
  <rect x="38" y="38" width="1004" height="824" rx="28" fill="${esc(surface)}" stroke="${esc(line)}" stroke-width="2"/>
  <circle cx="90" cy="86" r="8" fill="${esc(accent)}"/><circle cx="116" cy="86" r="8" fill="${esc(secondary)}"/>
  <text x="72" y="112" font-family="Georgia,serif" font-size="48" font-weight="700" fill="${esc(ink)}">Nero</text>
  <text x="1008" y="108" text-anchor="end" font-family="Segoe UI,Arial,sans-serif" font-size="24" font-weight="600" fill="${esc(muted)}">${esc(label)} Moodboard</text>
  ${board('Benim Moodboard’um', userDays, 180, 'user')}
  <line x1="72" x2="1008" y1="492" y2="492" stroke="${esc(line)}" stroke-width="2"/>
  ${board('Nero’nun Moodboard’u', neroDays, 548, 'nero')}
  <text x="1008" y="836" text-anchor="end" font-family="Segoe UI,Arial,sans-serif" font-size="15" fill="${esc(muted)}">Nero ile bir ayın küçük izi.</text>
</svg>`;
}

module.exports = {
  USER_MOODS,
  monthKey,
  validMonthKey,
  parseMonthKey,
  daysInMonthKey,
  dateKeyFor,
  monthLabelTr,
  userMonth,
  setUserMood,
  closedDataMonths,
  renderMoodboardSvg
};
