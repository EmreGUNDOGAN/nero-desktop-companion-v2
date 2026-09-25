// Replik seçici. Kategoriye göre rastgele bir satır seçer, yakın zamanda
// söyleneni tekrar etmemeye çalışır ve yer tutucuları doldurur.

const base = require('../data/dialogue.tr.json');

// Satırda ifade belirtilmemişse kategoriye göre varsayılan ifade.
const CATEGORY_DEFAULTS = {
  greet_morning: { e: 'normal' },
  greet_afternoon: { e: 'normal' },
  greet_evening: { e: 'normal' },
  greet_night: { e: 'sleepy' },
  return_short: { e: 'normal' },
  return_long: { e: 'sulky' },
  return_days: { e: 'sad' },
  idle: { e: 'normal' },
  remark: { e: 'normal' },
  happy: { e: 'smile' },
  bored: { e: 'bored' },
  sulky: { e: 'sulky' },
  lonely: { e: 'sad' },
  returned: { e: 'sulky' },
  click: { e: 'normal' },
  poke_spam: { e: 'angry', fx: 'angry' },
  drag_start: { e: 'surprised' },
  drag_end: { e: 'normal' },
  todo_add: { e: 'normal' },
  todo_done: { e: 'smile' },
  todo_all_done: { e: 'happy', fx: 'heart' },
  note_add: { e: 'normal' },
  timer_start: { e: 'normal' },
  timer_done: { e: 'happy' },
  timer_cancel_early: { e: 'sulky' },
  timer_cancel_mid: { e: 'sulky' },
  timer_cancel_late: { e: 'sad' },
  timer_pause: { e: 'curious' },
  timer_resume: { e: 'normal' },
  late_night: { e: 'sleepy' },
  fall_asleep: { e: 'sleepy' },
  wake: { e: 'surprised' },
  theme_change: { e: 'curious' },
  mute_on: { e: 'sulky' },
  mute_off: { e: 'smile' },
  quit: { e: 'sad' },
  panel_open: { e: 'normal' },
  pet: { e: 'smile', fx: 'blush' },
  pet_too_much: { e: 'angry', fx: 'angry' },
  shake: { e: 'angry', fx: 'shock' },
  dizzy: { e: 'dizzy', fx: 'sweat' },
  desktop_return: { e: 'surprised' },
  quote_say: { e: 'content' },
  know_you: { e: 'content' },
  peek_center: { e: 'surprised' },
  peek_edge: { e: 'curious' },
  peek_caught: { e: 'surprised' },
  nap_start: { e: 'sleepy' },
  snore: { e: 'asleep' },
  nap_woken: { e: 'sulky' },
  nap_woken_drag: { e: 'angry' },
  nap_woken_pet: { e: 'sleepy' },
  nap_woken_timer: { e: 'surprised' },
  nap_wake_self: { e: 'sleepy' },
  groggy: { e: 'sleepy' },
  pajama_on: { e: 'content' },
  pajama_off: { e: 'normal' },
  achievement: { e: 'surprised' },
  bee_hive_full: { e: 'curious' },
  bee_order_due: { e: 'surprised' },
  bee_winter: { e: 'sad' },
  bee_overtaken: { e: 'angry' },
  bee_sick: { e: 'sad' },
  bee_merchant: { e: 'surprised' },
  bee_letter: { e: 'curious' },
  reminder: { e: 'curious' },
  remind_water: { e: 'normal' },
  remind_break: { e: 'curious' },
  day_summary_good: { e: 'smile' },
  day_summary_ok: { e: 'content' },
  day_summary_none: { e: 'sulky' },
  birthday: { e: 'happy' },
  anniversary: { e: 'smile' },
  new_year: { e: 'happy' },
  outfit_party: { e: 'happy' },
  outfit_winter: { e: 'content' },
  update_ready: { e: 'curious' },
  ritual_ask: { e: 'curious' },
  ritual_sakin: { e: 'smile' },
  ritual_uretken: { e: 'happy' },
  ritual_kendime: { e: 'smile' },
  mode_sakin: { e: 'content' },
  mode_uretken: { e: 'curious' },
  mode_kendime: { e: 'smile' },
  uretken_odak: { e: 'curious' },
  rest_start: { e: 'happy' },
  rest_goodnight: { e: 'sleepy' },
  rest_more: { e: 'sulky' },
  archive_recall: { e: 'content' },
  jar_add: { e: 'smile' },
  jar_recall: { e: 'smile' },
  weekly_letter_line: { e: 'content' },
  desk_unlock: { e: 'happy' },
  self_mood_sleepy: { e: 'sleepy' },
  self_mood_meh: { e: 'sulky' },
  self_mood_energetic: { e: 'happy' },
  rare_event: { e: 'curious' },
  idle_yagmur: { e: 'content' },
  idle_kar: { e: 'content' },
  idle_mum: { e: 'content' },
  idle_cilek: { e: 'curious' },
  idle_ege: { e: 'content' }
};

class Dialogue {
  constructor({ historyStore = null } = {}) {
    this.pools = { ...base };
    this.historyStore = historyStore;
    const saved = historyStore?.get()?.recent;
    this.recent = new Map(
      saved && typeof saved === 'object'
        ? Object.entries(saved).map(([category, rows]) => [
            category,
            Array.isArray(rows) ? rows.filter((x) => typeof x === 'string').slice(-20) : []
          ])
        : []
    );
  }

  _key(item) {
    return String(typeof item === 'string' ? item : item?.t || '');
  }

  _saveRecent() {
    if (!this.historyStore) return;
    this.historyStore.patch({ recent: Object.fromEntries(this.recent) });
  }

  // Temanın dialogue.json dosyası varsa, içindeki kategoriler varsayılanın yerine geçer.
  // Geçmiş temizlenmez: son kullanılan replikler tema değişse veya uygulama yeniden açılsa da korunur.
  applyThemeOverrides(overrides) {
    this.pools = { ...base };
    if (overrides && typeof overrides === 'object') {
      for (const [key, lines] of Object.entries(overrides)) {
        if (Array.isArray(lines) && lines.length) this.pools[key] = lines;
      }
    }
  }

  has(category) {
    return Array.isArray(this.pools[category]) && this.pools[category].length > 0;
  }

  pick(category, vars = {}) {
    const pool = this.pools[category];
    if (!Array.isArray(pool) || !pool.length) return null;

    const recent = this.recent.get(category) || [];
    const keyed = pool.map((item, index) => ({ index, key: this._key(item) }));
    const fresh = keyed.filter(({ key }) => !recent.includes(key));
    const candidates = fresh.length ? fresh : keyed;
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    const index = selected.index;

    // Büyük havuzlarda son 20 replik yeniden seçilemez.
    // Küçük havuzlarda en az bir aday açık kalacak şekilde güvenli biçimde kısılır.
    const memory = Math.max(0, Math.min(20, pool.length - 1));
    const nextRecent = [...recent.filter((key) => key !== selected.key), selected.key].slice(-memory || undefined);
    this.recent.set(category, memory ? nextRecent : []);
    this._saveRecent();

    const item = pool[index];
    const line = typeof item === 'string' ? { t: item } : item;
    const defaults = CATEGORY_DEFAULTS[category] || { e: 'normal' };
    let text = String(line.t || '');
    if (!vars.name) {
      // İsim girilmemişse "{name}, ..." kalıplarını temizce çıkar.
      text = text.replace(/\{name\}\?/g, 'Hey?').replace(/\{name\},\s*/g, '').replace(/,\s*\{name\}/g, '').replace(/\{name\}\s*/g, '');
      text = text.charAt(0).toLocaleUpperCase('tr-TR') + text.slice(1);
    }
    text = text.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));

    return {
      text,
      expr: line.e || defaults.e || 'normal',
      effect: line.fx !== undefined ? line.fx : defaults.fx || null,
      category
    };
  }
}

module.exports = { Dialogue };
