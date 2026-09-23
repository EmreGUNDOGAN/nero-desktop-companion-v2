// Duygu günlüğü, küçük başarı arşivi, kavanoz ve haftalık mektup.
// Her biri kendi küçük JSON deposunda tutulur ve boyutu kendiliğinden sınırlanır.

const DAY_MS = 24 * 60 * 60 * 1000;
const MOOD_KEEP_DAYS = 90;
const ARCHIVE_KEEP = 400;
const JAR_KEEP = 200;

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ISO hafta anahtarı: "2026-W38" gibi. Pazar günü yeni haftaya geçer (bizim takvimimizde).
function isoWeekKey(d = new Date()) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7; // pazartesi=0 ... pazar=6
  date.setDate(date.getDate() - day + 3);
  const firstThursday = new Date(date.getFullYear(), 0, 4);
  const diff = (date - firstThursday) / DAY_MS;
  const week = 1 + Math.round((diff - ((firstThursday.getDay() + 6) % 7)) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

// 0-100 keyif puanını beş kategoriden birine indirger; her biri panelde bir nokta rengi.
const MOOD_BUCKETS = [
  { max: 34, cls: 'c1', label: 'zor bir gündü' },
  { max: 49, cls: 'c2', label: 'sıkıntılı bir gündü' },
  { max: 64, cls: 'c3', label: 'idare eden bir gündü' },
  { max: 79, cls: 'c4', label: 'iyi bir gündü' },
  { max: 101, cls: 'c5', label: 'keyifli bir gündü' }
];
function moodBucket(avg) {
  return MOOD_BUCKETS.find((b) => avg <= b.max) || MOOD_BUCKETS[MOOD_BUCKETS.length - 1];
}

class Journal {
  constructor({ moodStore, archiveStore, jarStore }) {
    this.moodStore = moodStore;   // { days: { 'YYYY-MM-DD': { sum, count } } }
    this.archiveStore = archiveStore; // { items: [{ id, text, doneAt }] }
    this.jarStore = jarStore;     // { items: [{ id, text, createdAt, shown }] }
    if (!this.moodStore.get().days) this.moodStore.set({ days: {} });
    if (!Array.isArray(this.archiveStore.get().items)) this.archiveStore.set({ items: [] });
    if (!Array.isArray(this.jarStore.get().items)) this.jarStore.set({ items: [] });
  }

  // --- Duygu günlüğü ---------------------------------------------------
  recordHappiness(value) {
    const data = this.moodStore.get();
    const key = dayKey();
    const day = data.days[key] || { sum: 0, count: 0 };
    day.sum += value;
    day.count += 1;
    data.days[key] = day;
    const keys = Object.keys(data.days).sort();
    while (keys.length > MOOD_KEEP_DAYS) delete data.days[keys.shift()];
    this.moodStore.set(data);
  }

  // Son 30 günü, en eskiden en yeniye, nokta listesi olarak döndürür.
  last30() {
    const data = this.moodStore.get();
    const out = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * DAY_MS);
      const key = dayKey(d);
      const day = data.days[key];
      const avg = day && day.count ? Math.round(day.sum / day.count) : null;
      const bucket = avg === null ? null : moodBucket(avg);
      out.push({ date: key, avg, cls: bucket ? bucket.cls : null, label: bucket ? bucket.label : null });
    }
    return out;
  }

  // --- Küçük başarı arşivi ---------------------------------------------
  archiveDone(text) {
    const clean = String(text || '').trim();
    if (!clean) return;
    const data = this.archiveStore.get();
    data.items.push({ id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, text: clean, doneAt: Date.now() });
    if (data.items.length > ARCHIVE_KEEP) data.items = data.items.slice(-ARCHIVE_KEEP);
    this.archiveStore.set(data);
  }

  // Bu ayın tamamlananları, en yeni en başta.
  thisMonth(limit = 12) {
    const now = new Date();
    const items = this.archiveStore.get().items
      .filter((i) => { const d = new Date(i.doneAt); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); })
      .sort((a, b) => b.doneAt - a.doneAt);
    return { total: items.length, recent: items.slice(0, limit) };
  }

  // Kötü bir günde hatırlatmak için rastgele geçmiş bir başarı (bu aydan değilse de olur).
  randomPast() {
    const items = this.archiveStore.get().items;
    if (!items.length) return null;
    return items[Math.floor(Math.random() * items.length)];
  }

  // --- Kavanoz -----------------------------------------------------------
  jarAdd(text) {
    const clean = String(text || '').trim().slice(0, 200);
    if (!clean) return null;
    const data = this.jarStore.get();
    const item = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, text: clean, createdAt: Date.now(), shown: false };
    data.items.push(item);
    if (data.items.length > JAR_KEEP) data.items = data.items.slice(-JAR_KEEP);
    this.jarStore.set(data);
    return item;
  }

  jarCount() { return this.jarStore.get().items.length; }

  // Henüz az gösterilmiş bir anıyı seçer; tamamı gösterildiyse sıfırlar.
  jarRandom() {
    const data = this.jarStore.get();
    if (!data.items.length) return null;
    let pool = data.items.filter((i) => !i.shown);
    if (!pool.length) { data.items.forEach((i) => { i.shown = false; }); pool = data.items; }
    const item = pool[Math.floor(Math.random() * pool.length)];
    item.shown = true;
    this.jarStore.set(data);
    return item;
  }

  // --- Haftalık mektup ---------------------------------------------------
  // week: stats.summary().week ile aynı şekil ([{day,weekday,focus,todos}, ...], 7 gün)
  writeLetter(week, totals) {
    const withFocus = week.filter((d) => d.focus > 0);
    const totalFocus = week.reduce((a, d) => a + d.focus, 0);
    const totalTodos = week.reduce((a, d) => a + d.todos, 0);
    const names = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const best = week.reduce((a, d) => (d.focus > (a?.focus || 0) ? d : a), null);
    const zero = week.filter((d) => d.focus === 0 && d.todos === 0);

    const h = Math.floor(totalFocus / 60);
    const m = totalFocus % 60;
    const timeText = h ? `${h} saat${m ? ` ${m} dakika` : ''}` : `${m} dakika`;

    let line2;
    if (!withFocus.length) {
      line2 = 'Bu hafta hiç odaklanmadık. Olsun, herkesin böyle haftaları olur.';
    } else if (best) {
      line2 = `${names[best.weekday]} günü bayağı odaklandın${zero.length ? `, ama ${names[zero[0].weekday]} günü tamamen bıraktın :)` : ''}.`;
    } else {
      line2 = '';
    }

    return {
      week: isoWeekKey(),
      text: `Bu hafta toplam ${timeText} birlikte çalıştık, ${totalTodos} iş bitirdin. ${line2}`.trim()
    };
  }
}

module.exports = { Journal, dayKey, isoWeekKey, moodBucket };
