// Nero karakter penceresi.
// Temadaki katmanları üst üste dizer; ifade, göz takibi, göz kırpma, konuşma,
// efektler, sürükleme ve tıklama burada yönetilir.

(() => {
  const api = window.nero;

  const stage = document.getElementById('stage');
  const charEl = document.getElementById('char');
  const inner = document.getElementById('char-inner');
  const bubble = document.getElementById('bubble');
  const bubbleText = bubble.querySelector('.bubble-text');
  const badge = document.getElementById('badge');

  let manifest = null;
  let layout = null;
  let settings = {};

  // katman adı -> { varyant adı -> img }
  let layerImgs = {};
  let pupilsWrap = null;
  let facePlacement = { eyeDx: 0, eyeDy: 0 };
  const cleanOutfitCache = new Map();
  const FACE_BASE = Object.freeze({ eyeX: 110, eyeY: 108 });
  const WARDROBE_SHAPE_SCALE = 1.24;
  const WARDROBE_SHAPE_FLAT_UNTIL = 145;
  const WARDROBE_SHAPE_RETURN_AT = 230;

  const state = {
    baseline: 'normal',
    asleep: false,
    expr: 'normal',        // şu an görünen ifade
    tempExpr: null,        // konuşma/tepki süresince geçici ifade
    effect: null,
    outfit: null,
    talking: false,
    blinking: false,
    talkMouthIndex: 0
  };

  // ---------------------------------------------------------------------------
  // Tema kurulumu
  // ---------------------------------------------------------------------------
  function applyTheme(payload) {
    manifest = payload.manifest;
    layout = payload.layout;
    const s = layout.scale;

    const ui = manifest.ui || {};
    const root = document.documentElement.style;
    if (ui.bubbleBg) root.setProperty('--bubble-bg', ui.bubbleBg);
    if (ui.bubbleInk) root.setProperty('--bubble-ink', ui.bubbleInk);
    if (ui.bubbleLine) root.setProperty('--bubble-line', ui.bubbleLine);
    if (ui.accent) root.setProperty('--accent', ui.accent);
    document.documentElement.dataset.skin = ui.skin || 'cozy';
    updateAmbient();

    Object.assign(charEl.style, {
      left: `${layout.charX}px`,
      top: `${layout.charY}px`,
      width: `${layout.charW}px`,
      height: `${layout.charH}px`
    });

    inner.innerHTML = '';
    layerImgs = {};
    pupilsWrap = null;
    facePlacement = { eyeDx: 0, eyeDy: 0 };

    for (const layerName of manifest.layerOrder) {
      const variants = manifest.layers[layerName] || {};
      layerImgs[layerName] = {};
      let parent = inner;
      if (layerName === 'pupils') {
        pupilsWrap = document.createElement('div');
        pupilsWrap.className = 'pupils-wrap';
        inner.appendChild(pupilsWrap);
        parent = pupilsWrap;
      }
      for (const [variant, spec] of Object.entries(variants)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.draggable = false;
        img.alt = '';
        img.className = `layer layer-${layerName}${layerName === 'effects' ? ` fx fx-${variant}` : ''}`;
        img.dataset.variant = variant;
        if (layerName === 'outfit' && /\.png(?:$|\?)/i.test(spec.url)) {
          img.dataset.illustrated = '1';
          img.dataset.originalSrc = spec.url;
        }
        Object.assign(img.style, {
          left: `${spec.x * s}px`,
          top: `${spec.y * s}px`,
          width: `${spec.w * s}px`,
          height: `${spec.h * s}px`
        });
        img.src = spec.url;
        img.addEventListener('load', scheduleHitmap);
        parent.appendChild(img);
        layerImgs[layerName][variant] = img;
      }
    }

    placeBadge();
    render();
  }

  // Varyant bulunamazsa sırayla bu adları dener.
  function resolveVariant(layerName, wanted, fallbacks) {
    const variants = layerImgs[layerName] || {};
    for (const name of [wanted, ...fallbacks]) {
      if (name && variants[name]) return name;
    }
    const first = Object.keys(variants)[0];
    return first || null;
  }

  function show(layerName, variant) {
    const imgs = layerImgs[layerName] || {};
    for (const [name, img] of Object.entries(imgs)) img.classList.toggle('on', name === variant);
  }

  function setLayerOffset(layerName, dx, dy) {
    const value = (dx || dy) ? `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)` : '';
    for (const img of Object.values(layerImgs[layerName] || {})) img.style.transform = value;
  }

  function applyFaceMetrics(metrics) {
    const s = layout?.scale || 1;
    if (!metrics) {
      facePlacement = { eyeDx: 0, eyeDy: 0 };
      for (const layerName of ['eyes', 'lids', 'brows', 'mouth']) setLayerOffset(layerName, 0, 0);
      return;
    }
    const eyeDx = (metrics.eyeX - FACE_BASE.eyeX) * s;
    const eyeDy = (metrics.eyeY - FACE_BASE.eyeY) * s;
    facePlacement = { eyeDx, eyeDy };
    for (const layerName of ['eyes', 'lids', 'brows', 'mouth']) setLayerOffset(layerName, eyeDx, eyeDy);
  }

  function collectComponents(mask, width, height) {
    const seen = new Uint8Array(mask.length);
    const components = [];
    const stack = [];
    for (let start = 0; start < mask.length; start += 1) {
      if (!mask[start] || seen[start]) continue;
      let area = 0, minX = width, maxX = -1, minY = height, maxY = -1, sumX = 0, sumY = 0;
      const pixels = [];
      stack.push(start);
      seen[start] = 1;
      while (stack.length) {
        const i = stack.pop();
        const x = i % width;
        const y = Math.floor(i / width);
        pixels.push(i);
        area += 1; sumX += x; sumY += y;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
        if (x > 0) { const q = i - 1; if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q); } }
        if (x + 1 < width) { const q = i + 1; if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q); } }
        if (y > 0) { const q = i - width; if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q); } }
        if (y + 1 < height) { const q = i + width; if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q); } }
      }
      components.push({
        area, pixels, minX, maxX, minY, maxY,
        width: maxX - minX + 1, height: maxY - minY + 1,
        cx: sumX / area, cy: sumY / area
      });
    }
    return components;
  }

  function cleanIllustratedFace(img) {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    if (!width || !height) return null;

    const source = document.createElement('canvas');
    source.width = width;
    source.height = height;
    const sourceCtx = source.getContext('2d', { willReadFrequently: true });
    sourceCtx.drawImage(img, 0, 0);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    for (let y = 0; y < height; y += 1) {
      let scale = WARDROBE_SHAPE_SCALE;
      if (y >= WARDROBE_SHAPE_RETURN_AT) {
        scale = 1;
      } else if (y > WARDROBE_SHAPE_FLAT_UNTIL) {
        const t = (y - WARDROBE_SHAPE_FLAT_UNTIL) /
          (WARDROBE_SHAPE_RETURN_AT - WARDROBE_SHAPE_FLAT_UNTIL);
        scale = WARDROBE_SHAPE_SCALE + (1 - WARDROBE_SHAPE_SCALE) * t;
      }
      const dw = width * scale;
      const dx = (width - dw) / 2;
      ctx.drawImage(source, 0, y, width, 1, dx, y, dw, 1);
    }

    const frame = ctx.getImageData(0, 0, width, height);
    const data = frame.data;
    const count = width * height;

    const whiteMask = new Uint8Array(count);
    for (let y = 45; y < Math.min(height, 180); y += 1) {
      for (let x = 50; x < Math.min(width, 170); x += 1) {
        const p = y * width + x;
        const o = p * 4;
        const r = data[o], g = data[o + 1], b = data[o + 2], a = data[o + 3];
        if (a > 150 && r > 220 && g > 220 && b > 215) whiteMask[p] = 1;
      }
    }
    const whiteComponents = collectComponents(whiteMask, width, height)
      .filter((c) => c.area > 60 && c.area < 1200 &&
        c.width >= 12 && c.width <= 55 && c.height >= 10 && c.height <= 50 &&
        c.cy >= 65 && c.cy <= 150);
    let leftEye = null;
    let rightEye = null;
    let eyePairCost = Infinity;
    for (const left of whiteComponents.filter((c) => c.cx >= 58 && c.cx <= 110)) {
      for (const right of whiteComponents.filter((c) => c.cx >= 110 && c.cx <= 162)) {
        const separation = right.cx - left.cx;
        if (separation < 28 || separation > 65) continue;
        const meanY = (left.cy + right.cy) / 2;
        const cost =
          (left.cx - 86) ** 2 +
          (right.cx - 134) ** 2 +
          3 * (left.cy - right.cy) ** 2 +
          0.5 * (meanY - 108) ** 2;
        if (cost < eyePairCost) {
          eyePairCost = cost;
          leftEye = left;
          rightEye = right;
        }
      }
    }

    const greenMask = new Uint8Array(count);
    for (let p = 0; p < count; p += 1) {
      const o = p * 4;
      const r = data[o], g = data[o + 1], b = data[o + 2], a = data[o + 3];
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      if (a > 100 && r > 135 && g > 150 && b > 125 && g >= r - 3 && g >= b - 3 && spread < 80) greenMask[p] = 1;
    }
    const head = collectComponents(greenMask, width, height)
      .filter((c) => c.area > 1000 && Math.abs(c.cx - width / 2) < 35 && c.minY < height * 0.55)
      .sort((a, b) => b.area - a.area)[0];
    if (!head) return null;

    const headMask = new Uint8Array(count);
    for (const p of head.pixels) headMask[p] = 1;

    const outside = new Uint8Array(count);
    const stack = [];
    const pushOutside = (p) => {
      if (!headMask[p] && !outside[p]) { outside[p] = 1; stack.push(p); }
    };
    for (let x = 0; x < width; x += 1) { pushOutside(x); pushOutside((height - 1) * width + x); }
    for (let y = 0; y < height; y += 1) { pushOutside(y * width); pushOutside(y * width + width - 1); }
    while (stack.length) {
      const i = stack.pop();
      const x = i % width;
      const y = Math.floor(i / width);
      if (x > 0) pushOutside(i - 1);
      if (x + 1 < width) pushOutside(i + 1);
      if (y > 0) pushOutside(i - width);
      if (y + 1 < height) pushOutside(i + width);
    }

    const holes = new Uint8Array(count);
    const cleanMask = new Uint8Array(count);
    for (let y = head.minY; y <= head.maxY; y += 1) {
      for (let x = head.minX; x <= head.maxX; x += 1) {
        const p = y * width + x;
        if (headMask[p] || outside[p]) continue;
        holes[p] = 1;
        if (x < head.minX + 6 || x > head.maxX - 6 || y < head.minY + 8 || y > head.maxY - 4) continue;
        const o = p * 4;
        const bright = data[o] > 220 && data[o + 1] > 220 && data[o + 2] > 210;
        if (bright && y < 60) continue;
        cleanMask[p] = 1;
      }
    }

    const expanded = new Uint8Array(cleanMask);
    for (let p = 0; p < count; p += 1) {
      if (!cleanMask[p]) continue;
      const x = p % width;
      const y = Math.floor(p / width);
      for (let oy = -1; oy <= 1; oy += 1) {
        for (let ox = -1; ox <= 1; ox += 1) {
          const nx = x + ox, ny = y + oy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const q = ny * width + nx;
          if (headMask[q] || holes[q]) expanded[q] = 1;
        }
      }
    }

    let n = 0, sumY = 0, sumYY = 0;
    const sumC = [0, 0, 0], sumYC = [0, 0, 0];
    for (const p of head.pixels) {
      const y = Math.floor(p / width);
      const o = p * 4;
      n += 1; sumY += y; sumYY += y * y;
      for (let c = 0; c < 3; c += 1) {
        sumC[c] += data[o + c];
        sumYC[c] += y * data[o + c];
      }
    }
    const denom = n * sumYY - sumY * sumY;
    const slope = [0, 0, 0], intercept = [196, 216, 190];
    if (Math.abs(denom) > 1e-6) {
      for (let c = 0; c < 3; c += 1) {
        slope[c] = (n * sumYC[c] - sumY * sumC[c]) / denom;
        intercept[c] = (sumC[c] - slope[c] * sumY) / n;
      }
    }
    for (let p = 0; p < count; p += 1) {
      if (!expanded[p]) continue;
      const y = Math.floor(p / width);
      const o = p * 4;
      for (let c = 0; c < 3; c += 1) data[o + c] = Math.max(0, Math.min(255, Math.round(slope[c] * y + intercept[c])));
    }
    ctx.putImageData(frame, 0, 0);

    const eyeX = leftEye && rightEye ? (leftEye.cx + rightEye.cx) / 2 : width / 2;
    const eyeY = leftEye && rightEye ? (leftEye.cy + rightEye.cy) / 2 : Math.max(99, head.minY + 38);
    return {
      src: canvas.toDataURL('image/png'),
      metrics: { eyeX, eyeY }
    };
  }

  function prepareIllustratedOutfit(outfit) {
    const img = layerImgs.outfit?.[outfit];
    if (!img || img.dataset.illustrated !== '1') return;

    const activate = (metrics) => {
      if (!img.classList.contains('on')) return;
      applyFaceMetrics(metrics);
      charEl.classList.remove('illustrated-preparing');
      scheduleHitmap();
    };

    const cached = cleanOutfitCache.get(outfit);
    if (cached) {
      charEl.classList.add('illustrated-preparing');
      if (img.src !== cached.src) {
        img.addEventListener('load', () => activate(cached.metrics), { once: true });
        img.src = cached.src;
      } else {
        activate(cached.metrics);
      }
      return;
    }
    if (img.dataset.cleaning === '1') return;

    const run = () => {
      if (img.dataset.faceCleaned === '1') return;
      img.dataset.cleaning = '1';
      const result = cleanIllustratedFace(img);
      img.dataset.cleaning = '';
      if (!result) {
        charEl.classList.remove('illustrated-preparing');
        return;
      }
      cleanOutfitCache.set(outfit, result);
      img.dataset.faceCleaned = '1';
      img.addEventListener('load', () => activate(result.metrics), { once: true });
      img.src = result.src;
    };

    charEl.classList.add('illustrated-preparing');
    if (img.complete && img.naturalWidth) run();
    else img.addEventListener('load', run, { once: true });
  }

  // ---------------------------------------------------------------------------
  // Çizim: ifadeyi katmanlara dök
  // ---------------------------------------------------------------------------
  function render() {
    if (!manifest) return;
    const exprName = state.tempExpr || state.baseline;
    const expr = manifest.expressions[exprName] || manifest.expressions.normal || {};
    state.expr = exprName;

    const outfit = expr.outfit !== undefined ? expr.outfit : state.outfit;
    const outfitImg = outfit ? layerImgs.outfit?.[outfit] : null;
    const illustrated = !!(outfitImg && outfitImg.dataset.illustrated === '1');
    const prevBody = currentBody;
    currentBody = resolveVariant('body', expr.body, [expr.body, 'default']);
    show('body', illustrated ? null : currentBody);
    show('outfit', outfitImg ? outfit : null);
    charEl.classList.toggle('illustrated-outfit', illustrated);
    if (illustrated) {
      applyFaceMetrics(null);
      prepareIllustratedOutfit(outfit);
    } else {
      charEl.classList.remove('illustrated-preparing');
      applyFaceMetrics(null);
    }
    show('eyes', resolveVariant('eyes', expr.eyes, ['default']));
    show('pupils', resolveVariant('pupils', expr.pupils, ['default']));
    const front = Object.keys(layerImgs.front || {}).length ? resolveVariant('front', expr.front, ['default']) : null;
    show('front', illustrated || expr.front === null ? null : front);

    // Göz kapakları: kırpma > ifade
    let lids = expr.lids || null;
    if (state.blinking) lids = manifest.blink.lid;
    show('lids', lids && layerImgs.lids?.[lids] ? lids : null);

    show('brows', resolveVariant('brows', expr.brows, ['normal', 'default']));

    // Ağız: konuşurken sırayla konuşma ağızları
    let mouth;
    if (state.talking) {
      const talk = manifest.talkMouths.filter((m) => layerImgs.mouth?.[m]);
      mouth = talk.length ? talk[state.talkMouthIndex % talk.length] : resolveVariant('mouth', expr.mouth, ['neutral']);
    } else {
      mouth = resolveVariant('mouth', expr.mouth, ['neutral', 'default']);
    }
    show('mouth', mouth);

    // Efekt: konuşma efekti > ifadenin efekti > uykudaysa zzz
    let effect = state.effect || expr.effect || null;
    if (!effect && state.asleep && !state.tempExpr) effect = 'zzz';
    show('effects', effect && layerImgs.effects?.[effect] ? effect : null);

    charEl.classList.toggle('asleep', state.asleep && !state.tempExpr);
    charEl.classList.toggle('talking', state.talking);
    charEl.classList.toggle('dizzy', exprName === 'dizzy');

    if (prevBody !== currentBody) scheduleHitmap();
  }
  let currentBody = null;

  // ---------------------------------------------------------------------------
  // Göz takibi
  // ---------------------------------------------------------------------------
  const eye = { x: 0, y: 0, tx: 0, ty: 0 };
  let lastCursorMove = Date.now();
  let wanderUntil = 0;
  let lastCursor = null;

  function onCursor(p) {
    lastCursor = p;
    lastCursorMove = Date.now();
    aimAtCursor();
  }

  function aimAtCursor() {
    if (!manifest?.eyeTracking || !lastCursor || !layout) return;
    const s = layout.scale;
    const c = manifest.eyeTracking.center;
    const r = manifest.eyeTracking.range;
    const ex = lastCursor.wx + layout.charX + c.x * s;
    const ey = lastCursor.wy + layout.charY + c.y * s;
    const dx = lastCursor.x - ex;
    const dy = lastCursor.y - ey;
    const dist = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, dist / 260);
    eye.tx = (dx / dist) * reach * r.x * s;
    eye.ty = (dy / dist) * reach * r.y * s;
  }

  function wander() {
    if (!manifest?.eyeTracking) return;
    const r = manifest.eyeTracking.range;
    const s = layout.scale;
    const a = Math.random() * Math.PI * 2;
    const k = 0.3 + Math.random() * 0.7;
    eye.tx = Math.cos(a) * r.x * s * k;
    eye.ty = Math.sin(a) * r.y * s * k;
  }

  function frame() {
    const now = Date.now();
    if (state.asleep && !state.tempExpr) {
      eye.tx = 0; eye.ty = 0;
    } else if (now - lastCursorMove > 25000 && now > wanderUntil) {
      // Fare uzun süre kıpırdamazsa etrafa bakınır.
      wanderUntil = now + 2500 + Math.random() * 4000;
      Math.random() < 0.35 ? aimAtCursor() : wander();
    }
    eye.x += (eye.tx - eye.x) * 0.22;
    eye.y += (eye.ty - eye.y) * 0.22;
    if (pupilsWrap) {
      const px = facePlacement.eyeDx + eye.x;
      const py = facePlacement.eyeDy + eye.y;
      pupilsWrap.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`;
    }
    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------------------
  // Göz kırpma
  // ---------------------------------------------------------------------------
  function scheduleBlink() {
    setTimeout(() => {
      const closedByExpr = (manifest?.expressions[state.expr] || {}).lids === manifest?.blink.lid;
      if (!closedByExpr && !(state.asleep && !state.tempExpr)) {
        blink();
        if (Math.random() < 0.18) setTimeout(blink, 260); // bazen çift kırpar
      }
      scheduleBlink();
    }, 2400 + Math.random() * 4200);
  }

  function blink() {
    state.blinking = true;
    render();
    setTimeout(() => { state.blinking = false; render(); }, 120);
  }

  // ---------------------------------------------------------------------------
  // Konuşma
  // ---------------------------------------------------------------------------
  let speech = null; // { id, typeTimer, mouthTimer, hideTimer }

  function stopSpeech() {
    if (!speech) return;
    clearInterval(speech.typeTimer);
    clearInterval(speech.mouthTimer);
    clearTimeout(speech.hideTimer);
    clearTimeout(speech.exprTimer);
    speech = null;
  }

  function say(line) {
    stopSpeech();
    state.tempExpr = line.expr || null;
    state.effect = line.effect || null;
    state.talking = false;

    if (line.silent || !line.text) {
      // Sessiz mod: sadece yüz ifadesi, balon yok.
      hideBubble();
      render();
      speech = { exprTimer: setTimeout(endSpeech, 2600) };
      return;
    }

    charEl.classList.remove('startled');
    if (line.effect === 'shock' || line.expr === 'surprised') {
      void charEl.offsetWidth;
      charEl.classList.add('startled');
    }

    // Balonu tam metinle ölçüp yerleştir, sonra harfleri görünür yap.
    const chars = [...line.text];
    bubbleText.textContent = '';
    const spans = chars.map((ch) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.className = 'ghost';
      bubbleText.appendChild(span);
      return span;
    });
    bubble.style.maxWidth = peekView ? `${Math.max(140, peekView.max - peekView.min - 16)}px` : '';
    placeBubble();
    bubble.classList.add('show');
    bubble.style.pointerEvents = 'auto';

    state.talking = true;
    render();

    const current = { id: line.id };
    speech = current;
    let i = 0;
    current.typeTimer = setInterval(() => {
      // Noktalama işaretlerinde kısa bir duraklama hissi için 2 harf birden açılmaz.
      const step = /[.,!?…]/.test(chars[i] || '') ? 1 : 2;
      for (let k = 0; k < step && i < spans.length; k++, i++) spans[i].classList.remove('ghost');
      if (i >= spans.length) {
        clearInterval(current.typeTimer);
        clearInterval(current.mouthTimer);
        state.talking = false;
        render();
        const readMs = 2 * Math.max(2400, Math.min(9000, chars.length * 55));
        current.hideTimer = setTimeout(endSpeech, readMs);
      }
    }, 38);
    current.mouthTimer = setInterval(() => {
      state.talkMouthIndex++;
      render();
    }, 115);
  }

  function endSpeech() {
    stopSpeech();
    hideBubble();
    state.talking = false;
    state.tempExpr = null;
    state.effect = null;
    render();
    api.send('char:bubbleDone');
  }

  function hideBubble() {
    bubble.classList.remove('show');
    bubble.style.pointerEvents = 'none';
  }

  function placeBubble() {
    if (!layout || !manifest) return;
    const s = layout.scale;
    const anchorX = layout.charX + manifest.bubbleAnchor.x * s;
    const anchorY = layout.charY + manifest.bubbleAnchor.y * s;
    const width = bubble.offsetWidth;
    const height = bubble.offsetHeight;
    const pad = 8;
    // Sürpriz ziyarette pencerenin bir kısmı ekran dışında kalır; balonu görünen alana sığdır.
    const minX = (peekView?.min ?? 0) + pad;
    const maxX = (peekView?.max ?? stage.clientWidth) - width - pad;
    const left = Math.max(minX, Math.min(anchorX - width / 2, maxX));
    const top = Math.max(4, anchorY - height - 14);
    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
    const tailX = Math.max(18, Math.min(width - 18, anchorX - left));
    bubble.style.setProperty('--tail-x', `${tailX}px`);
  }

  // ---------------------------------------------------------------------------
  // Zamanlayıcı rozeti
  // ---------------------------------------------------------------------------
  let lastTimer = { status: 'idle' };

  function placeBadge() {
    if (!layout) return;
    badge.style.top = `${layout.charY + layout.charH + 4}px`;
    badge.style.left = '50%';
    badge.style.transform = 'translateX(-50%)';
  }

  function onTimer(t) {
    lastTimer = t;
    const visible = settings.showTimerBadge !== false && t.status !== 'idle';
    badge.classList.toggle('show', visible);
    badge.classList.toggle('idle', t.status === 'idle');
    if (!visible) return;
    const skinName = document.documentElement.dataset.skin;
    const pz = skinName === 'pazartesi';
    const TAILS = { pazartesi: [' hadi başla', ' kaldı. dayan.', ' mola mı?'], kasaba: [' ocak hazır', ' demleniyor', ' mola'] };
    const tails = TAILS[skinName];
    if (t.status === 'idle') {
      badge.textContent = `▶ ${settings.lastTimerMinutes || 25} dk`;
      badge.title = 'Tıkla: sayacı başlat';
      if (tails) {
        const tail = document.createElement('span');
        tail.className = 'badge-tail';
        tail.textContent = tails[0];
        badge.appendChild(tail);
      }
      badge.classList.remove('paused', 'last-minute');
      return;
    }
    badge.title = t.status === 'running' ? 'Tıkla: duraklat' : 'Tıkla: devam et';
    const total = Math.ceil(t.remainingMs / 1000);
    const m = Math.floor(total / 60);
    const sec = total % 60;
    badge.textContent = `${t.status === 'paused' ? '❚❚ ' : ''}${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    if (tails) {
      const tail = document.createElement('span');
      tail.className = 'badge-tail';
      tail.textContent = t.status === 'paused' ? tails[2] : tails[1];
      badge.appendChild(tail);
    }
    badge.classList.toggle('paused', t.status === 'paused');
    badge.classList.toggle('last-minute', t.status === 'running' && total <= 60);
  }

  // ---------------------------------------------------------------------------
  // Ses
  // ---------------------------------------------------------------------------
  let audioCtx = null;
  // ---------------------------------------------------------------------------
  // Ortam sesi: dosya kullanmadan, Web Audio ile üretilen çok kısık döngüler.
  // Sadece uygun temadayken ve Ayarlar'dan açıkken çalışır.
  // ---------------------------------------------------------------------------
  let ambient = null; // { skin, stop() }

  function whiteNoiseBuffer(ctx, seconds = 2) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function startRainAmbient(ctx, out) {
    const src = ctx.createBufferSource();
    src.buffer = whiteNoiseBuffer(ctx, 3);
    src.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass'; band.frequency.value = 2600; band.Q.value = 0.7;
    const gain = ctx.createGain(); gain.gain.value = 0.05;
    src.connect(band).connect(gain).connect(out);
    src.start();
    return () => { try { src.stop(); } catch (_) { /* yoksay */ } };
  }

  function startWindAmbient(ctx, out) {
    const src = ctx.createBufferSource();
    src.buffer = whiteNoiseBuffer(ctx, 4);
    src.loop = true;
    const low = ctx.createBiquadFilter();
    low.type = 'lowpass'; low.frequency.value = 500;
    const gain = ctx.createGain(); gain.gain.value = 0.06;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
    src.connect(low).connect(gain).connect(out);
    src.start();
    return () => { try { src.stop(); lfo.stop(); } catch (_) { /* yoksay */ } };
  }

  function startFireAmbient(ctx, out) {
    let alive = true;
    const gain = ctx.createGain(); gain.gain.value = 0.045;
    gain.connect(out);
    const bed = ctx.createBufferSource();
    bed.buffer = whiteNoiseBuffer(ctx, 3); bed.loop = true;
    const low = ctx.createBiquadFilter(); low.type = 'lowpass'; low.frequency.value = 300;
    bed.connect(low).connect(gain);
    bed.start();
    const crackle = () => {
      if (!alive) return;
      const src = ctx.createBufferSource();
      src.buffer = whiteNoiseBuffer(ctx, 0.06);
      const g = ctx.createGain();
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
      src.connect(hp).connect(g).connect(gain);
      src.start();
      setTimeout(crackle, 400 + Math.random() * 1400);
    };
    crackle();
    return () => { alive = false; try { bed.stop(); } catch (_) { /* yoksay */ } };
  }

  function startBreezeAmbient(ctx, out) {
    let alive = true;
    const gain = ctx.createGain(); gain.gain.value = 0.035;
    gain.connect(out);
    const chime = () => {
      if (!alive) return;
      const freq = [523, 587, 659, 784, 880][Math.floor(Math.random() * 5)];
      const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
      const g = ctx.createGain();
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.16, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      osc.connect(g).connect(gain);
      osc.start(now); osc.stop(now + 1.5);
      setTimeout(chime, 3500 + Math.random() * 5000);
    };
    setTimeout(chime, 1500);
    return () => { alive = false; };
  }

  const AMBIENT_BY_SKIN = { yagmur: startRainAmbient, kar: startWindAmbient, mum: startFireAmbient, cilek: startBreezeAmbient };

  function updateAmbient() {
    const skin = document.documentElement.dataset.skin;
    const wanted = settings.ambientSound && settings.sound !== false && !settings.muted ? AMBIENT_BY_SKIN[skin] : null;
    if (ambient && (!wanted || ambient.skin !== skin)) { ambient.stop(); ambient = null; }
    if (wanted && !ambient) {
      try {
        audioCtx = audioCtx || new AudioContext();
        const master = audioCtx.createGain(); master.gain.value = 1;
        master.connect(audioCtx.destination);
        const stop = wanted(audioCtx, master);
        ambient = { skin, stop: () => { stop(); master.disconnect(); } };
      } catch (_) { /* ses altyapısı yoksa sessiz geç */ }
    }
  }

  // Görev bitince kısa, tok bir "pop"
  function pop() {
    try {
      audioCtx = audioCtx || new AudioContext();
      const now = audioCtx.currentTime;
      [[523.25, 0], [783.99, 0.07]].forEach(([freq, at]) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + at);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + at + 0.08);
        gain.gain.setValueAtTime(0.0001, now + at);
        gain.gain.exponentialRampToValueAtTime(0.22, now + at + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.18);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now + at);
        osc.stop(now + at + 0.2);
      });
    } catch (_) { /* ses yoksa sessiz geç */ }
  }

  function chime() {
    try {
      audioCtx = audioCtx || new AudioContext();
      const now = audioCtx.currentTime;
      [[659.25, 0], [880, 0.16], [1046.5, 0.32]].forEach(([freq, at]) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + at);
        gain.gain.exponentialRampToValueAtTime(0.18, now + at + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.6);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now + at);
        osc.stop(now + at + 0.65);
      });
    } catch (_) { /* ses yoksa sessiz geç */ }
  }

  // ---------------------------------------------------------------------------
  // İsabet testi: şeffaf alanlar tıklamayı alttaki pencereye geçirir
  // ---------------------------------------------------------------------------
  const hitCanvas = document.createElement('canvas');
  const hitCtx = hitCanvas.getContext('2d', { willReadFrequently: true });
  let hitData = null;
  let hitTimer = null;

  function scheduleHitmap() {
    clearTimeout(hitTimer);
    hitTimer = setTimeout(buildHitmap, 60);
  }

  function buildHitmap() {
    if (!layout) return;
    hitCanvas.width = layout.charW;
    hitCanvas.height = layout.charH;
    hitCtx.clearRect(0, 0, hitCanvas.width, hitCanvas.height);
    try {
      for (const layerName of ['body', 'outfit', 'eyes', 'front']) {
        for (const img of Object.values(layerImgs[layerName] || {})) {
          if (!img.classList.contains('on') || !img.complete || !img.naturalWidth) continue;
          hitCtx.drawImage(img, parseFloat(img.style.left), parseFloat(img.style.top), parseFloat(img.style.width), parseFloat(img.style.height));
        }
      }
      hitData = hitCtx.getImageData(0, 0, hitCanvas.width, hitCanvas.height).data;
    } catch (err) {
      hitData = null; // okunamazsa dikdörtgen isabet alanına düş
    }
  }

  function overCharacter(clientX, clientY) {
    if (!layout) return false;
    const x = Math.floor(clientX - layout.charX);
    const y = Math.floor(clientY - layout.charY);
    if (x < 0 || y < 0 || x >= layout.charW || y >= layout.charH) return false;
    if (!hitData) return true;
    // Küçük bir tolerans: çevredeki birkaç pikselden biri doluysa sayılır.
    for (const [ox, oy] of [[0, 0], [3, 0], [-3, 0], [0, 3], [0, -3]]) {
      const px = x + ox;
      const py = y + oy;
      if (px < 0 || py < 0 || px >= layout.charW || py >= layout.charH) continue;
      if (hitData[(py * layout.charW + px) * 4 + 3] > 24) return true;
    }
    return false;
  }

  function inRect(el, x, y) {
    if (!el.classList.contains('show')) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function hitWhat(x, y) {
    if (inRect(bubble, x, y)) return 'bubble';
    if (inRect(badge, x, y)) return 'badge';
    if (overCharacter(x, y)) return 'char';
    return null;
  }

  // ---------------------------------------------------------------------------
  // Fare: tıklama, sürükleme, sağ tık, üstüne gelme
  // ---------------------------------------------------------------------------
  let ignoring = true;
  let press = null;       // { x, y, target }
  let dragging = false;
  let hovering = false;

  function setIgnore(value) {
    if (value === ignoring) return;
    ignoring = value;
    api.send('char:ignoreMouse', value);
  }

  function cancelPointerGesture() {
    if (dragging) api.send('char:dragEnd');
    dragging = false;
    press = null;
    charEl.classList.remove('dragging');
  }

  // Electron setIgnoreMouseEvents(..., { forward:true }) Windows'ta hareketi
  // mousemove olarak forward eder. Bu nedenle karakterin click-through modundan
  // kendi kendine çıkabilmesi için hareket/hit-test yolu mousemove dinler.
  window.addEventListener('mousemove', (e) => {
    // Pointerup pencerenin dışında kaybolmuşsa sol tuşun artık basılı olmadığını
    // ilk harekette görüp eski gesture'ı kapat.
    if (press && (e.buttons & 1) === 0) {
      cancelPointerGesture();
      setIgnore(!hitWhat(e.clientX, e.clientY));
      return;
    }
    if (press) {
      if (!dragging && press.target === 'char' && !settings.lockPosition && Math.hypot(e.screenX - press.x, e.screenY - press.y) > 5) {
        dragging = true;
        charEl.classList.add('dragging');
        api.send('char:dragStart');
      }
      return;
    }
    const target = hitWhat(e.clientX, e.clientY);
    setIgnore(!target);
    const nowHover = target === 'char';
    if (nowHover && !hovering) { api.send('char:hoverStart'); onHoverStart(); }
    if (!nowHover && hovering) api.send('char:hoverEnd');
    hovering = nowHover;
    if (nowHover) trackPet(e.clientX);
    else petTrack.dir = 0;
  });

  document.addEventListener('mouseleave', () => {
    if (!press) { if (hovering) api.send('char:hoverEnd'); setIgnore(true); hovering = false; }
  });

  window.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    // Önceki gesture yarım kaldıysa yeni sürüklemeyi engellemesin.
    if (press || dragging) cancelPointerGesture();
    const target = hitWhat(e.clientX, e.clientY);
    if (!target) return;
    press = { x: e.screenX, y: e.screenY, target };
    try { document.body.setPointerCapture(e.pointerId); } catch (_) { /* yoksay */ }
  });

  window.addEventListener('pointerup', (e) => {
    if (e.button !== 0 || !press) return;
    const p = press;
    press = null;
    try { document.body.releasePointerCapture(e.pointerId); } catch (_) { /* yoksay */ }
    if (dragging) {
      dragging = false;
      charEl.classList.remove('dragging');
      api.send('char:dragEnd');
      scheduleHitmap();
      return;
    }
    if (p.target === 'bubble') endSpeech();
    else if (p.target === 'badge') api.invoke('timer:badge');
    else if (p.target === 'char') api.send('char:click', { x: e.clientX, y: e.clientY });
    setIgnore(!hitWhat(e.clientX, e.clientY));
  });

  window.addEventListener('pointercancel', cancelPointerGesture);
  window.addEventListener('blur', cancelPointerGesture);
  document.body.addEventListener('lostpointercapture', () => {
    // Normal pointerup önce press'i null yaptığı için burada yalnız gerçekten
    // beklenmedik capture kaybını temizleriz.
    if (press) cancelPointerGesture();
  });

  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (hitWhat(e.clientX, e.clientY)) api.send('char:contextMenu');
  });

  // Sevme: fareyi karakterin üstünde sağa sola gezdirmek (okşamak).
  const petTrack = { lastX: 0, dir: 0, anchorX: 0, reversals: [], cooldownUntil: 0 };
  function trackPet(x) {
    const now = Date.now();
    const dx = x - petTrack.lastX;
    petTrack.lastX = x;
    if (Math.abs(dx) < 2 || now < petTrack.cooldownUntil) return;
    const dir = Math.sign(dx);
    if (petTrack.dir && dir !== petTrack.dir && Math.abs(x - petTrack.anchorX) > 14) {
      petTrack.reversals = [...petTrack.reversals.filter((t) => now - t < 1600), now];
      petTrack.anchorX = x;
      if (petTrack.reversals.length >= 4) {
        petTrack.reversals = [];
        petTrack.cooldownUntil = now + 2500;
        api.send('char:pet');
      }
    }
    if (!petTrack.dir || dir !== petTrack.dir) petTrack.anchorX = petTrack.anchorX || x;
    petTrack.dir = dir;
  }

  function onHoverStart() {
    // Arada bir, üstüne gelince kaşını kaldırır.
    if (speech || state.asleep || Math.random() > 0.12) return;
    if (!manifest.expressions.curious) return;
    state.tempExpr = 'curious';
    render();
    speech = { exprTimer: setTimeout(() => { speech = null; state.tempExpr = null; render(); }, 1300) };
  }

  // ---------------------------------------------------------------------------
  // Ana süreçten gelenler
  // ---------------------------------------------------------------------------
  api.on('theme', applyTheme);
  api.on('cursor', onCursor);
  api.on('say', say);
  api.on('baseline', ({ expr, asleep, outfit }) => {
    state.baseline = expr;
    state.asleep = !!asleep;
    state.outfit = outfit || null;
    scheduleHitmap();
    render();
  });
  api.on('settings', (s) => {
    settings = s || {};
    onTimer(lastTimer);
    updateAmbient();
  });
  api.on('timer', onTimer);
  api.on('sound', (kind) => { if (kind === 'chime') chime(); else if (kind === 'pop') pop(); });
  let peekView = null;
  api.on('peek', (p) => {
    peekView = p ? p.visible : null;
    charEl.classList.remove('peek-left', 'peek-right', 'peek-center');
    if (p) charEl.classList.add(p.mode === 'center' ? 'peek-center' : `peek-${p.side}`);
  });
  api.on('dragging', (on) => {
    if (!on) {
      dragging = false;
      press = null;
      charEl.classList.remove('dragging');
    }
  });
  api.on('interaction:reset', () => {
    dragging = false;
    press = null;
    charEl.classList.remove('dragging');
    // Taskbar restore sonrası Windows'ta ignoreMouseEvents forward state'i takılı
    // kalabildiği için renderer ve main-process state'ini tekrar eşle.
    ignoring = false;
    api.send('char:ignoreMouse', false);
  });

  requestAnimationFrame(frame);
  scheduleBlink();
  api.send('char:ready');
})();
