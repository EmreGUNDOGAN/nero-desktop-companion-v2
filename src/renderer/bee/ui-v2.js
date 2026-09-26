// ===========================================================================
// Nero Arıcılık · Arayüz v2
// Mevcut düğmeleri ve kimliklerini korur; yerlerini ve görünüşlerini değiştirir.
// bee.js'den çağrılır: const ui = initUiV2({ $, esc });  ui.onView(view)  ui.renderStats(view, force)
// Kovan halkaları için: ui.ringInit(el)  ui.ringUpdate(el, hive, pct)
// ===========================================================================
import { ICONS, icon } from './ui-icons.js';

export function initUiV2({ $, esc }) {
  document.body.classList.add('ui2');

  // --- Arka plan: bulutlar ve kenar gölgesi -------------------------------
  const clouds = document.createElement('div');
  clouds.id = 'ui2-clouds';
  [[6, 18, 220, 46, 60], [72, 12, 260, 52, 80], [84, 60, 200, 40, 70], [2, 68, 240, 50, 90], [40, 86, 300, 56, 75], [58, 30, 150, 32, 65], [22, 40, 170, 34, 85]]
    .forEach(([x, y, w, h, sec], i) => {
      const c = document.createElement('i');
      Object.assign(c.style, { left: `${x}%`, top: `${y}%`, width: `${w}px`, height: `${h}px`, animationDuration: `${sec}s`, animationDirection: i % 2 ? 'alternate-reverse' : 'alternate' });
      c.style.boxShadow = `${w * 0.18}px ${-h * 0.45}px 0 ${h * 0.1}px #fff, ${w * 0.45}px ${-h * 0.6}px 0 ${h * 0.25}px #fff`;
      clouds.appendChild(c);
    });
  document.body.prepend(clouds);
  const vig = document.createElement('div');
  vig.id = 'ui2-vignette';
  document.body.appendChild(vig);

  // --- Simgeler ---------------------------------------------------------------
  const setIco = (id, name, tip) => {
    const el = $(id);
    if (!el) return;
    el.innerHTML = icon(name);
    if (tip) { el.dataset.tip = tip; el.removeAttribute('title'); }
  };
  // Sol üst: jeton + depo tek kart, depoda doluluk çubuğu
  const coinChip = $('coins') && $('coins').parentElement;
  if (coinChip) coinChip.querySelector('.ico').outerHTML = icon('coin');
  const storage = $('storage-chip');
  if (storage) {
    storage.querySelector('.ico').outerHTML = icon('jar');
    const bar = document.createElement('span');
    bar.className = 'ui2-jar';
    bar.innerHTML = '<i></i>';
    storage.appendChild(bar);
    const div = document.createElement('span');
    div.className = 'ui2-div';
    storage.before(div);
  }
  // Hız: duraklat simgesi
  const pauseBtn = document.querySelector('.speeds [data-speed="0"]');
  if (pauseBtn) pauseBtn.innerHTML = icon('pause');

  // Sağ üst: Bal Defteri, Kovanlar, Liderlik, İstatistikler görünür; fotoğraf ve ayarlar ☰ menüde
  setIco('open-ledger', 'book', 'Bal Defteri · D');
  setIco('open-hives', 'hive', 'Kovanlar · K');
  setIco('open-board', 'trophy', 'Liderlik');
  const boardTitle = document.querySelector('#board-modal .modal-head h2');
  if (boardTitle) boardTitle.innerHTML = `${icon('trophy')} Liderlik`;
  setIco('open-stats', 'stats', 'İstatistikler');
  const right = document.querySelector('.hud-right');
  // Sıra: Bal Defteri · Kovanlar · Liderlik · İstatistikler · ☰ Menü
  ['open-ledger', 'open-hives', 'open-board', 'open-stats'].forEach((id) => { const el = $(id); if (el) right.appendChild(el); });
  const menuWrap = document.createElement('div');
  menuWrap.style.position = 'relative';
  menuWrap.innerHTML = `<button class="round" id="ui2-menu-btn" type="button" aria-label="Menü" data-tip="Menü">${icon('menu')}</button>
    <div class="ui2-menu ui2-card" id="ui2-menu" hidden></div>`;
  right.appendChild(menuWrap);
  const menu = menuWrap.querySelector('#ui2-menu');
  const menuItem = (id, name, label, key) => {
    const el = $(id);
    if (!el) return;
    el.className = '';
    el.innerHTML = `${icon(name)}<span>${label}</span>${key ? `<kbd>${key}</kbd>` : ''}`;
    el.removeAttribute('title');
    menu.appendChild(el);
    el.addEventListener('click', () => { menu.hidden = true; });
  };
  menuItem('photo-btn', 'camera', 'Fotoğraf çek', 'F');
  menuItem('open-settings', 'gear', 'Ayarlar');
  $('ui2-menu-btn').addEventListener('click', (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; });
  document.addEventListener('click', (e) => { if (!menuWrap.contains(e.target)) menu.hidden = true; });

  // Sağ alt: yalnız yakınlaştırma; 5.5.4'teki Adaya dön sol altta kalır.
  const zoom = document.createElement('div');
  zoom.className = 'zoom-group';
  document.body.appendChild(zoom);
  [['zoom-in', 'plus', 'Yakınlaştır'], ['zoom-out', 'minus', 'Uzaklaştır']].forEach(([id, name, tip]) => {
    const el = $(id);
    if (!el) return;
    el.className = '';
    el.innerHTML = icon(name);
    el.title = tip;
    zoom.appendChild(el);
  });
  const recenter = $('recenter');
  if (recenter) { recenter.innerHTML = icon('target'); recenter.title = 'Adaya dön (R)'; }

  // Alt menü simgeleri
  const hexIco = (id, name) => { const el = $(id); if (el) { const s = el.querySelector('span'); if (s) s.outerHTML = icon(name); } };
  hexIco('open-shop', 'shop');
  hexIco('open-market', 'market');
  hexIco('harvest-all', 'basket');
  hexIco('open-orders', 'scroll');
  hexIco('open-guide', 'guide');
  const harvestBadge = document.createElement('em');
  harvestBadge.className = 'badge-n ok';
  harvestBadge.hidden = true;
  $('harvest-all').appendChild(harvestBadge);

  // Sol alt: zil + görevler düğmesi (görev kartı düğmeye tıklayınca açılır)
  const bell = $('bell');
  if (bell) { const badge = $('bell-badge'); bell.innerHTML = icon('bell'); if (badge) bell.appendChild(badge); }
  // Görevler: mevcut 📋 düğmesi (#quests-icon) yeni tarza giydirilir; açma/kapama oyunun kendi kodunda kalır
  const tasks = $('quests-icon');
  if (tasks) {
    tasks.classList.add('tasks-btn');
    tasks.innerHTML = `${icon('tasks')}<em class="badge-n" hidden></em>`;
    tasks.dataset.tip = 'Bugünün görevleri';
    tasks.removeAttribute('title');
  }

  // --- Durum güncellemeleri ------------------------------------------------------
  let last = null;
  const SEASON_ICO = { ilkbahar: 'flower', yaz: 'sun', sonbahar: 'leaf', kis: 'snow' };
  function floatText(anchor, text, up) {
    const r = anchor.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = `ui2-float ${up ? 'up' : 'down'}`;
    f.textContent = text;
    f.style.left = `${r.left + r.width / 2 - 10}px`;
    f.style.top = `${r.top - 6}px`;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1700);
  }
  function onView(v) {
    // Mevsim simgesi
    const si = $('season-ico');
    // Oyun mevsim değişince bu kutuya emoji yazabilir; simge yoksa ya da mevsim değiştiyse yeniden koy
    if (si) { const want = SEASON_ICO[v.calendar.season]; if (si.dataset.ico !== want || !si.querySelector('svg')) { si.dataset.ico = want; si.innerHTML = icon(want); } }
    // Depo çubuğu
    const bar = storage && storage.querySelector('.ui2-jar');
    if (bar) { const pct = Math.min(100, (v.storageKg / v.storageCap) * 100); bar.querySelector('i').style.width = `${pct}%`; bar.classList.toggle('full', pct >= 90); }
    // Süzülen +/− yazıları
    if (last) {
      const dc = Math.round(v.coins - last.coins);
      if (dc && coinChip) floatText(coinChip, `${dc > 0 ? '+' : ''}${dc.toLocaleString('tr-TR')}`, dc > 0);
      const dk = Math.round((v.storageKg - last.storageKg) * 10) / 10;
      if (Math.abs(dk) >= 0.1 && storage) floatText(storage, `${dk > 0 ? '+' : ''}${dk.toLocaleString('tr-TR')} kg`, dk > 0);
    }
    last = { coins: v.coins, storageKg: v.storageKg };
    // Hasada hazır kovan sayısı
    const ready = Object.values(v.hives).filter((h) => h.total >= h.capKg - 0.05).length;
    harvestBadge.hidden = !ready;
    harvestBadge.textContent = String(ready);
    $('harvest-all').classList.toggle('idle', !Object.values(v.hives).some((h) => h.total >= 0.5));
    // Görevler rozeti
    const tb = tasks && tasks.querySelector('em');
    if (!tb) return;
    const left = (v.quests || []).filter((q) => !q.claimed).length;
    const claimable = (v.quests || []).some((q) => !q.claimed && q.progress >= q.target);
    tb.hidden = false;
    tb.className = `badge-n${left ? '' : ' ok'}`;
    tb.textContent = left ? (claimable ? '!' : String(left)) : '✓';
  }

  // --- Kovan doluluk halkası -----------------------------------------------------
  const RR = 19;
  const CIRC = 2 * Math.PI * RR;
  function ringInit(el) {
    el.innerHTML = `<span class="ring-bg"></span><svg class="ring" viewBox="0 0 46 46"><circle cx="23" cy="23" r="${RR}" fill="none" stroke="#EFE3C6" stroke-width="5"/>
      <circle class="arc" cx="23" cy="23" r="${RR}" fill="none" stroke="#F2B33D" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 ${CIRC}" transform="rotate(-90 23 23)"/></svg>
      ${icon('hive', 'ring-ico')}<span class="ring-warn" hidden></span>`;
  }
  function ringUpdate(el, h, pct) {
    const p = Math.max(0, Math.min(1, pct / 100));
    const arc = el.querySelector('.arc');
    arc.setAttribute('stroke-dasharray', `${CIRC * p} ${CIRC}`);
    arc.setAttribute('stroke', p >= 1 ? '#E9822E' : '#F2B33D');
    el.classList.toggle('full', p >= 1);
    const warn = el.querySelector('.ring-warn');
    const w = h.sick ? '🤒' : (h.syrup < 1 && document.body.classList.contains('season-kis')) ? '💧' : '';
    warn.hidden = !w;
    warn.textContent = w;
    el.title = `${h.name} · ${h.total.toFixed(1)} / ${h.capKg} kg`;
  }

  // --- İstatistikler -----------------------------------------------------------------
  let range = 14;
  let statsSig = '';
  const fmt = (n, d = 0) => Number(n).toLocaleString('tr-TR', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  const kgOrTon = (kg) => (kg >= 1000 ? `${fmt(kg / 1000, 2)} ton` : `${fmt(kg, 1)} kg`);
  const SEASONS = ['İlkbahar', 'Yaz', 'Sonbahar', 'Kış'];
  const dayLabel = (d) => ({ short: `G${(d % 15) + 1}`, long: `${SEASONS[Math.floor(d / 15) % 4]} ${(d % 15) + 1}. gün · Yıl ${Math.floor(d / 60) + 1}` });
  const change = (now, prev, suffix) => {
    if (!prev) return `<em>${suffix || 'dün veri yok'}</em>`;
    const pct = Math.round(((now - prev) / prev) * 100);
    return `<em class="${pct >= 0 ? 'up' : 'dn'}">${pct >= 0 ? '▲' : '▼'} %${Math.abs(pct)} ${suffix || 'düne göre'}</em>`;
  };

  function renderStats(v, force = false) {
    const body = $('stats-body');
    if (!body) return;
    const all = v.history || [];
    const hist = range ? all.slice(-range) : all;
    const me = v.leaderboard.find((r) => r.me) || { nw: 0, history: [] };
    const nwHist = (range ? (me.history || []).slice(-range) : me.history || []);
    const sig = JSON.stringify([range, all.length, v.today, v.soldTotalKg, me.nw]);
    if (!force && sig === statsSig) return;
    statsSig = sig;
    const y = all[all.length - 1];
    const nwChange = nwHist.length > 1 ? me.nw - nwHist[0] : 0;
    // Ne sattın? (seçilen dönem + bugün)
    const sold = {};
    for (const d of hist) for (const [f, kg] of Object.entries(d.sold || {})) sold[f] = (sold[f] || 0) + kg;
    for (const [f, kg] of Object.entries(v.today.sold || {})) sold[f] = (sold[f] || 0) + kg;
    const soldList = Object.entries(sold).sort((a, b) => b[1] - a[1]);
    const soldMax = soldList.length ? soldList[0][1] : 1;
    // Kayıtlar
    const best = all.reduce((b, d) => (d.earned > (b ? b.earned : 0) ? d : b), null);
    const topHoney = Object.entries(v.ledger.honey || {}).sort((a, b) => (b[1].earned || 0) - (a[1].earned || 0))[0];
    const totalHarvest = Object.values(v.ledger.honey || {}).reduce((a, x) => a + (x.kg || 0), 0);

    body.innerHTML = `
      <div class="st2-tabs">${[[7, '7 gün'], [14, '14 gün'], [0, 'Tümü']].map(([n, l]) => `<button type="button" data-range="${n}" class="${range === n ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div class="st2-kpis">
        <div class="st2-k hero"><small>Toplam satılan bal</small><b>${kgOrTon(v.soldTotalKg)}</b><em>oyun boyunca · pazar + sipariş</em>${icon('jar')}</div>
        <div class="st2-k"><small>Bugün üretilen</small><b>${fmt(v.today.produced, 1)} kg</b>${change(v.today.produced, y && y.produced)}</div>
        <div class="st2-k"><small>Bugün kazanılan</small><b>${fmt(v.today.earned)} 🪙</b>${y ? `<em>dün ${fmt(y.earned)} 🪙</em>` : '<em>dün veri yok</em>'}</div>
        <div class="st2-k"><small>Net değer</small><b>${fmt(me.nw)}</b>${nwHist.length > 1 ? change(me.nw, nwHist[0], `· ${range || 'tüm'} ${range ? 'günde' : 'zamanda'}`) : '<em>—</em>'}</div>
      </div>
      <div class="st2-card"><div class="st2-ct"><b>Üretim ve kazanç</b><div class="st2-lg"><span><i style="background:#F2B33D"></i>Bal (kg)</span><span><i style="background:#3E8F52;height:3px;border-radius:2px"></i>Kazanç (🪙)</span></div></div>
        ${hist.length ? `<svg id="st2-main" viewBox="0 0 712 190" height="190"></svg>` : '<div class="st2-empty">Henüz veri yok. Birkaç oyun günü sonra burada grafik belirecek.</div>'}</div>
      <div class="st2-row">
        <div class="st2-card"><div class="st2-ct"><b>Net değer</b>${nwHist.length > 1 ? `<em style="font-style:normal;font-weight:800;font-size:12px" class="${nwChange >= 0 ? 'up' : 'dn'}">${nwChange >= 0 ? '▲' : '▼'} ${fmt(Math.abs(nwChange))} 🪙</em>` : ''}</div>
          ${nwHist.length > 1 ? '<svg id="st2-nw" viewBox="0 0 380 150" height="150"></svg>' : '<div class="st2-empty">Veri birikiyor…</div>'}</div>
        <div class="st2-card"><div class="st2-ct"><b>Ne sattın?</b><small style="font-weight:800;color:#9A8466;font-size:11.5px">${range ? `${range} günde` : 'tüm zamanda'}</small></div>
          ${soldList.length ? soldList.slice(0, 7).map(([f, kg]) => `<div class="st2-bar"><span>${esc(v.flowers[f].name)}</span><span class="tr"><i style="width:${(kg / soldMax) * 100}%;background:${v.flowers[f].color}"></i></span><span class="v">${fmt(kg, 1)} kg</span></div>`).join('') : '<div class="st2-empty">Bu dönemde satış yok.</div>'}</div>
      </div>
      <div class="st2-card"><div class="st2-ct"><b>Kayıtlar</b></div><div class="st2-rec">
        <div class="st2-rc"><small>En iyi gün</small><b>${best ? `${dayLabel(best.day).short} · ${fmt(best.earned)} 🪙` : '—'}</b></div>
        <div class="st2-rc"><small>En çok kazandıran bal</small><b>${topHoney && topHoney[1].earned ? esc(v.flowers[topHoney[0]].name) : '—'}</b></div>
        <div class="st2-rc"><small>Toplam hasat</small><b>${fmt(totalHarvest, 1)} kg · ${fmt(v.ledger.harvests || 0)} kez</b></div>
        <div class="st2-rc"><small>Teslim edilen sipariş</small><b>${fmt(v.ledger.ordersDone || 0)}</b></div>
      </div></div>`;
    body.querySelectorAll('[data-range]').forEach((b) => b.addEventListener('click', () => { range = Number(b.dataset.range); renderStats(v, true); }));
    if (hist.length) drawMain(body, hist);
    if (nwHist.length > 1) drawNw(body, nwHist);
  }

  function niceMax(v) { if (v <= 0) return 1; const p = 10 ** Math.floor(Math.log10(v)); return Math.ceil(v / p) * p; }

  function drawMain(body, hist) {
    const s = body.querySelector('#st2-main');
    const W = 712, H = 190, L = 34, R = 44, T = 10, B = 24;
    const cw = (W - L - R) / hist.length;
    const pm = niceMax(Math.max(...hist.map((d) => d.produced), 0.1));
    const em = niceMax(Math.max(...hist.map((d) => d.earned), 1));
    let o = '';
    for (let g = 0; g <= 3; g++) {
      const yy = T + (H - T - B) * (1 - g / 3);
      o += `<line x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}" stroke="#F1E7D2"/><text x="${L - 6}" y="${yy + 3}" text-anchor="end">${fmt((pm * g) / 3, pm < 3 ? 1 : 0)}</text><text x="${W - R + 6}" y="${yy + 3}" style="fill:#6FA37A">${fmt((em * g) / 3)}</text>`;
    }
    const every = Math.ceil(hist.length / 14);
    hist.forEach((d, i) => {
      const h = ((H - T - B) * d.produced) / pm;
      const x = L + i * cw + cw * 0.2;
      o += `<rect x="${x}" y="${H - B - h}" width="${cw * 0.6}" height="${Math.max(0, h)}" rx="${Math.min(5, cw * 0.2)}" fill="#F2B33D"/>`;
      if (i % every === 0) o += `<text x="${x + cw * 0.3}" y="${H - 7}" text-anchor="middle">${dayLabel(d.day).short}</text>`;
    });
    const pts = hist.map((d, i) => [L + i * cw + cw / 2, T + (H - T - B) * (1 - d.earned / em)]);
    o += `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#3E8F52" stroke-width="2.5" stroke-linejoin="round"/>`;
    pts.forEach(([x, yy], i) => { if (hist[i].earned) o += `<circle cx="${x}" cy="${yy}" r="4" fill="#fff" stroke="#3E8F52" stroke-width="2.5"/>`; });
    hist.forEach((d, i) => { o += `<rect class="hit" data-i="${i}" x="${L + i * cw}" y="${T}" width="${cw}" height="${H - T - B}"/>`; });
    s.innerHTML = o;
    const card = s.parentElement;
    let tip = null;
    s.addEventListener('mousemove', (e) => {
      const r = e.target.closest('.hit');
      if (!r) return;
      const d = hist[Number(r.dataset.i)];
      if (!tip) { tip = document.createElement('div'); tip.className = 'st2-tip'; card.appendChild(tip); }
      tip.innerHTML = `${dayLabel(d.day).long}<br>🍯 ${fmt(d.produced, 1)} kg · 🪙 ${fmt(d.earned)}`;
      const cr = card.getBoundingClientRect();
      tip.style.left = `${Math.min(cr.width - 170, e.clientX - cr.left + 12)}px`;
      tip.style.top = `${e.clientY - cr.top - 40}px`;
    });
    s.addEventListener('mouseleave', () => { if (tip) { tip.remove(); tip = null; } });
  }

  function drawNw(body, d) {
    const s = body.querySelector('#st2-nw');
    const W = 380, H = 150, L = 44, T = 12, B = 22;
    let mn = Math.min(...d), mx = Math.max(...d);
    if (mx - mn < 10) { mn -= 10; mx += 10; }
    const pad = (mx - mn) * 0.1; mn -= pad; mx += pad;
    const X = (i) => L + (i * (W - L - 8)) / (d.length - 1);
    const Y = (v) => T + (H - T - B) * (1 - (v - mn) / (mx - mn));
    const pts = d.map((v, i) => [X(i), Y(v)]);
    let o = '';
    [mn + pad, (mn + mx) / 2, mx - pad].forEach((v) => { o += `<line x1="${L}" x2="${W - 8}" y1="${Y(v)}" y2="${Y(v)}" stroke="#F1E7D2"/><text x="${L - 6}" y="${Y(v) + 3}" text-anchor="end">${fmt(v)}</text>`; });
    o += '<defs><linearGradient id="st2g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9C7BD6" stop-opacity=".35"/><stop offset="1" stop-color="#9C7BD6" stop-opacity="0"/></linearGradient></defs>';
    o += `<path d="M${pts.map((p) => p.join(',')).join(' L')} L${pts[pts.length - 1][0]},${H - B} L${L},${H - B}Z" fill="url(#st2g)"/><polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#8A63D2" stroke-width="2.5" stroke-linejoin="round"/>`;
    const [lx, ly] = pts[pts.length - 1];
    o += `<circle cx="${lx}" cy="${ly}" r="5" fill="#fff" stroke="#8A63D2" stroke-width="2.5"/>`;
    o += `<text x="${L}" y="${H - 6}" text-anchor="start">${d.length} gün önce</text><text x="${W - 8}" y="${H - 6}" text-anchor="end">bugün</text>`;
    s.innerHTML = o;
  }

  // İstatistik başlığındaki emojiyi simgeyle değiştir
  const sh = document.querySelector('#stats-modal .modal-head h2');
  if (sh) sh.innerHTML = `${icon('stats')} İstatistikler`;

  // --- Kovanlar paneli ---------------------------------------------------------------
  // Durum önceliği: hasta > erzak yok (kış/sonbahar sonu) > hasada hazır > normal. Sorunlular üstte.
  function hiveStatus(h, v) {
    const pct = h.total / h.capKg;
    const season = v.calendar.season;
    const lateAutumn = season === 'sonbahar' && v.calendar.day >= 10;
    const needFeed = (season === 'kis' || lateAutumn) && h.feedDays < 3;
    if (h.sick) return { key: 'sick', rank: 0, color: '#D9573F', label: 'Hasta' };
    if (needFeed) return { key: 'feed', rank: 1, color: '#D9573F', label: h.feedDays ? `Erzak az · ${h.feedDays} gün` : 'Erzak yok' };
    if (pct >= 0.999) return { key: 'full', rank: 2, color: '#E9822E', label: 'Hasada hazır' };
    if (pct >= 0.6) return { key: 'soon', rank: 3, color: '#F2B33D', label: 'Dolmak üzere' };
    return { key: 'ok', rank: 4, color: '#6FAF7F', label: 'Her şey yolunda' };
  }

  function renderHives(v) {
    const list = $('hives-list');
    if (!list) return;
    const hives = Object.values(v.hives).map((h) => ({ h, st: hiveStatus(h, v) })).sort((a, b) => a.st.rank - b.st.rank || b.h.total / b.h.capKg - a.h.total / a.h.capKg);
    const season = v.calendar.season;
    const feedSeason = season === 'kis' || (season === 'sonbahar' && v.calendar.day >= 10);
    const totalRate = hives.reduce((a, x) => a + x.h.ratePerHour, 0);
    const totalBees = hives.reduce((a, x) => a + x.h.bees, 0);
    const ready = hives.filter((x) => x.h.total >= x.h.capKg - 0.05).length;
    const trouble = hives.filter((x) => x.st.rank <= 1).length;
    const sum = $('hives-summary');
    if (sum) sum.innerHTML = `<b>${hives.length}</b> kovan · <b>${fmt(totalRate, 1)}</b> kg/sa · <b>${totalBees}</b> arı${ready ? ` · <span class="hs-ready">${ready} kovan hasada hazır</span>` : ''}${trouble ? ` · <span class="hs-bad">${trouble} kovan ilgi bekliyor</span>` : ''}`;
    list.innerHTML = hives.map(({ h, st }) => {
      const pct = Math.min(100, (h.total / h.capKg) * 100);
      const dots = (h.near || []).slice(0, 6).map((f) => `<i style="background:${(v.flowers[f] || {}).color || '#ccc'}" title="${esc((v.flowers[f] || {}).name || f)}"></i>`).join('')
        + Array.from({ length: Math.max(0, 6 - (h.near || []).length) }, () => '<i class="empty" title="Boş kare"></i>').join('');
      const tags = [];
      if (h.immuneDays > 0 && !h.sick) tags.push(`<span class="ht ok">Bağışık · ${h.immuneDays} gün</span>`);
      if (feedSeason || h.feedDays > 0) tags.push(`<span class="ht ${h.feedDays >= 5 ? 'ok' : h.feedDays > 0 ? 'warn' : 'bad'}">${h.feedDays > 0 ? `Erzak · ${h.feedDays} gün` : 'Erzak yok'}</span>`);
      if (h.boostDays > 0) tags.push(`<span class="ht gold">+%50 · ${h.boostDays} gün</span>`);
      if (h.queued) tags.push('<span class="ht">Arıcı yolda</span>');
      const acts = [];
      if (h.total >= 0.5 && !h.queued) acts.push(`<button type="button" class="ha primary" data-hact="harvest" data-id="${h.id}">${icon('basket')}Hasat</button>`);
      if (h.sick) acts.push(`<button type="button" class="ha danger" data-hact="medicine" data-id="${h.id}" ${v.coins < v.medicineCost ? 'disabled' : ''}>İlaç · ${v.medicineCost}</button>`);
      if (feedSeason && h.feedDays < 5) acts.push(`<button type="button" class="ha" data-hact="syrup" data-id="${h.id}" ${v.coins < v.syrupCost ? 'disabled' : ''}>Şurup · ${v.syrupCost}</button>`);
      if (h.next && h.next.type === 'queen' && v.coins >= h.next.cost) acts.push(`<button type="button" class="ha up" data-hact="upgrade" data-id="${h.id}" title="${esc(h.nextQueenName || 'Kraliçe')} · ${h.next.cost} 🪙">↑ Kraliçe</button>`);
      return `<li class="hrow2 st-${st.key}" data-hive="${h.id}">
        <span class="hs" style="background:${st.color}"></span>
        <span class="hn"><b>${esc(h.name)}</b><small>${esc(st.label)} · 👑 ${esc(h.queenName)}</small><span class="dots">${dots}</span></span>
        <span class="hf"><div class="bar"><i style="width:${pct}%;background:${pct >= 100 ? '#E9822E' : '#F2B33D'}"></i></div><small>${h.total.toFixed(1)} / ${h.capKg} kg · ${h.ratePerHour.toFixed(1)} kg/sa</small></span>
        <span class="hb">${icon('hive')}<b>${h.bees}/${h.capBees}</b></span>
        <span class="htags">${tags.join('')}</span>
        <span class="hacts">${acts.join('')}<span class="hopen">aç ›</span></span>
      </li>`;
    }).join('');
    const sa = $('syrup-all');
    if (sa) {
      sa.innerHTML = `${icon('jar')} Tüm kovanlara şurup · ${v.syrupAllCost} 🪙`;
      sa.disabled = v.coins < v.syrupAllCost;
      sa.classList.toggle('subtle', !feedSeason);   // ilkbahar/yaz: küçük ve sade
      sa.classList.toggle('primary', feedSeason);   // sonbahar sonu ve kış: belirgin
    }
    const ha = $('hives-harvest-all');
    if (ha && !ha.querySelector('svg')) ha.innerHTML = `${icon('basket')} Hepsini hasat et`;
    if (ha) ha.disabled = !hives.some((x) => x.h.total >= 0.5);
    const hh = document.querySelector('#hives-modal .modal-head h2');
    if (hh && !hh.querySelector('svg')) hh.innerHTML = `${icon('hive')} Kovanlar`;
  }

  return { onView, ringInit, ringUpdate, renderStats, renderHives, icons: ICONS };
}
