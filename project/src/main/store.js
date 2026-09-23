// Basit JSON dosya deposu. Her dosya %APPDATA%\Nero altında tutulur.
// Yazma işlemleri kısa bir gecikmeyle toplanır ve önce geçici dosyaya yazılıp
// sonra yeniden adlandırılır; böylece elektrik kesilse bile dosya bozulmaz.

const fs = require('fs');
const path = require('path');

class JsonStore {
  constructor(dir, name, defaults) {
    this.file = path.join(dir, `${name}.json`);
    this.defaults = defaults;
    this.timer = null;
    this.data = this._load();
  }

  _load() {
    const fallback = structuredClone(this.defaults);
    try {
      if (!fs.existsSync(this.file)) return fallback;
      const parsed = JSON.parse(fs.readFileSync(this.file, 'utf8'));
      if (Array.isArray(fallback)) return Array.isArray(parsed) ? parsed : fallback;
      return { ...fallback, ...parsed };
    } catch (err) {
      // Bozuk dosyayı yedekleyip varsayılanla devam et.
      try { fs.renameSync(this.file, `${this.file}.bozuk-${Date.now()}`); } catch (_) { /* yoksay */ }
      console.error(`[store] ${this.file} okunamadı:`, err.message);
      return fallback;
    }
  }

  get() {
    return this.data;
  }

  set(next) {
    this.data = next;
    this.save();
    return this.data;
  }

  patch(partial) {
    this.data = { ...this.data, ...partial };
    this.save();
    return this.data;
  }

  save() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 300);
  }

  flush() {
    clearTimeout(this.timer);
    this.timer = null;
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const tmp = `${this.file}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tmp, this.file);
    } catch (err) {
      console.error(`[store] ${this.file} yazılamadı:`, err.message);
    }
  }
}

module.exports = { JsonStore };
