// Tema sistemi.
// Temalar iki yerden okunur:
//   1) Uygulamayla gelen temalar  (kurulum klasörü\resources\themes)
//   2) Kullanıcının eklediği temalar (%APPDATA%\Nero\themes)
// Aynı kimliğe sahip bir kullanıcı teması, uygulamayla geleni geçersiz kılar.
// Her tema klasöründe bir theme.json ve görseller bulunur (bkz. docs/TEMA-REHBERI.md).

const fs = require('fs');
const path = require('path');

const LAYER_ORDER = ['body', 'outfit', 'eyes', 'pupils', 'lids', 'brows', 'mouth', 'front', 'effects'];
const SCHEME = 'nero-theme';

function sanitizeId(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'tema';
}

class ThemeManager {
  constructor({ builtinDir, userDir }) {
    this.builtinDir = builtinDir;
    this.userDir = userDir;
    this.themes = new Map(); // id -> { id, dir, manifest, dialogue, errors }
  }

  scan() {
    this.themes.clear();
    for (const [root, source] of [[this.builtinDir, 'builtin'], [this.userDir, 'user']]) {
      if (!root || !fs.existsSync(root)) continue;
      for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const dir = path.join(root, entry.name);
        const theme = this._loadTheme(dir, entry.name, source);
        if (theme) this.themes.set(theme.id, theme);
      }
    }
    return this.list();
  }

  _loadTheme(dir, folderName, source) {
    const manifestPath = path.join(dir, 'theme.json');
    if (!fs.existsSync(manifestPath)) return null;
    let raw;
    try {
      raw = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (err) {
      console.error(`[tema] ${manifestPath} okunamadı: ${err.message}`);
      return {
        id: sanitizeId(folderName), dir, source, broken: true,
        name: `${folderName} (bozuk theme.json)`, errors: [err.message]
      };
    }

    const id = sanitizeId(raw.id || folderName);
    const errors = [];
    const manifest = this._normalize(raw, id, dir, errors);

    let dialogue = null;
    const dialoguePath = path.join(dir, 'dialogue.json');
    if (fs.existsSync(dialoguePath)) {
      try { dialogue = JSON.parse(fs.readFileSync(dialoguePath, 'utf8')); } catch (err) {
        errors.push(`dialogue.json okunamadı: ${err.message}`);
      }
    }

    if (errors.length) console.warn(`[tema] ${id}:`, errors.join(' | '));
    return { id, dir, source, name: manifest.name, manifest, dialogue, errors, broken: false };
  }

  _normalize(raw, id, dir, errors) {
    const canvas = {
      width: Number(raw.canvas?.width) || 220,
      height: Number(raw.canvas?.height) || 260
    };
    const toUrl = (rel) => `${SCHEME}://${id}/${String(rel).replace(/\\/g, '/').split('/').map(encodeURIComponent).join('/')}`;

    const layers = {};
    for (const layerName of LAYER_ORDER) {
      const variants = raw.layers?.[layerName] || {};
      layers[layerName] = {};
      for (const [variant, def] of Object.entries(variants)) {
        const spec = typeof def === 'string' ? { src: def } : (def || {});
        if (!spec.src) { errors.push(`${layerName}.${variant}: src yok`); continue; }
        const abs = path.join(dir, spec.src);
        if (!fs.existsSync(abs)) errors.push(`${layerName}.${variant}: dosya bulunamadı (${spec.src})`);
        layers[layerName][variant] = {
          url: toUrl(spec.src),
          x: Number(spec.x) || 0,
          y: Number(spec.y) || 0,
          w: Number(spec.width) || canvas.width,
          h: Number(spec.height) || canvas.height
        };
      }
    }
    if (!Object.keys(layers.body).length) errors.push('body katmanında en az bir görsel olmalı');

    const expressions = raw.expressions && typeof raw.expressions === 'object' ? raw.expressions : {};
    if (!expressions.normal) expressions.normal = {};

    return {
      id,
      name: raw.name || id,
      author: raw.author || '',
      canvas,
      defaultScale: Number(raw.defaultScale) || 1,
      bubbleAnchor: {
        x: Number(raw.bubbleAnchor?.x ?? canvas.width / 2),
        y: Number(raw.bubbleAnchor?.y ?? 0)
      },
      eyeTracking: raw.eyeTracking
        ? {
          center: { x: Number(raw.eyeTracking.center?.x ?? canvas.width / 2), y: Number(raw.eyeTracking.center?.y ?? canvas.height / 3) },
          range: { x: Number(raw.eyeTracking.range?.x ?? 6), y: Number(raw.eyeTracking.range?.y ?? 5) }
        }
        : null,
      layers,
      layerOrder: LAYER_ORDER,
      blink: { lid: raw.blink?.lid || 'closed' },
      talkMouths: Array.isArray(raw.talkMouths) ? raw.talkMouths : ['talk1', 'talk2'],
      expressions,
      ui: raw.ui || {}
    };
  }

  list() {
    return [...this.themes.values()]
      .map((t) => ({ id: t.id, name: t.name, source: t.source, broken: !!t.broken, errors: t.errors || [] }))
      .sort((a, b) => (a.id === 'default' ? -1 : b.id === 'default' ? 1 : a.name.localeCompare(b.name, 'tr')));
  }

  get(id) {
    const t = this.themes.get(id);
    if (t && !t.broken) return t;
    return this.themes.get('default') || [...this.themes.values()].find((x) => !x.broken) || null;
  }

  // nero-theme://<id>/<yol> isteğini diskteki dosyaya çevirir. Tema klasörünün dışına çıkılamaz.
  resolveAsset(id, relPath) {
    const theme = this.themes.get(sanitizeId(id));
    if (!theme) return null;
    const decoded = relPath.split('/').map((p) => decodeURIComponent(p)).join(path.sep);
    const abs = path.resolve(theme.dir, decoded);
    const root = path.resolve(theme.dir) + path.sep;
    if (!abs.startsWith(root)) return null;
    return fs.existsSync(abs) ? abs : null;
  }
}

module.exports = { ThemeManager, SCHEME, sanitizeId };
