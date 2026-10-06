// Çiçekçi Ezgi · dükkân içi dioraması (v6.8.1)
// Dışarıdaki Ezgi binasıyla aynı palet (pudra pembesi duvar, nane yeşili, adaçayı çatı kirişi) ve
// aynı 3D parça kiti (evler/kit.js). Çatısı kaldırılmış izometrik kesit; tezgâhta 3 ürün satılır.
// createFloristInterior(container, { onPick(tab) }) -> { update(data), open(), close(), resize(), hover(tab) }
// tab: ürün kimliği (driedLavender | thymeBundle | flowerMix) · 'seeds' · 'gift'
import * as THREE from '../vendor/three.module.min.js';
import { box, cyl, sph, cone, grp, at, mat, C, pot } from '../evler/kit.js';
import { VM } from '../village.js';
import { buildVillager } from '../figures.js';

const W = 3.4, H = 1.75, HW = W / 2;
const WALL_B = 0xF8D3DF, WALL_L = 0xEFC3D1, MINT = 0xA9DCC9, SAGE = 0x7FA88A, EDGE = 0x8A5A34, EDGE_D = 0x6E4526;
const FLOOR_A = 0xF3E4D0, FLOOR_B = 0xEBD6BE;

function canvasTex(w, h, draw) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const plane = (w, h, tex) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide })); m.castShadow = true; m.receiveShadow = true; return m; };
const EMOJI = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';

export function createFloristInterior(container, { onPick } = {}) {
  const canvas = document.createElement('canvas'); canvas.className = 'house-canvas'; container.prepend(canvas);
  const tip = document.createElement('div'); tip.className = 'house-tip'; tip.hidden = true; container.appendChild(tip);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 60);
  camera.position.set(7.2, 6.6, 7.2); camera.lookAt(0, 0.75, 0);
  scene.add(new THREE.HemisphereLight(0xFFF6E8, 0xE8C0CC, 1.3));
  const sun = new THREE.DirectionalLight(0xFFF1D6, 1.5); sun.position.set(4, 9, 5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 }); sun.shadow.bias = -0.0006; scene.add(sun);

  const root = new THREE.Group(); scene.add(root);
  const dyn = new THREE.Group(); root.add(dyn);
  const hot = []; const animated = []; let animDyn = []; const tips = {};
  let ezgi = null, hovered = null, running = false, raf = 0;

  // ------------------------------------------------------------- sabit oda
  function buildStatic() {
    root.add(box(W + 0.24, 0.3, W + 0.24, EDGE_D, 0, -0.15, 0), box(W + 0.24, 0.07, W + 0.24, EDGE, 0, -0.035, 0));
    for (let i = 0; i < 8; i++) root.add(box(W, 0.012, W / 8 - 0.02, i % 2 ? FLOOR_B : FLOOR_A, 0, 0.006, -HW + (i + 0.5) * (W / 8)));
    // duvarlar: pudra pembesi + nane lambri (dış cephe renkleri)
    root.add(box(W + 0.24, H, 0.12, WALL_B, 0, H / 2, -HW - 0.06), box(0.12, H, W, WALL_L, -HW - 0.06, H / 2, 0));
    root.add(box(W, 0.5, 0.04, MINT, 0, 0.25, -HW + 0.02), box(0.04, 0.5, W, MINT, -HW + 0.02, 0.25, 0));
    root.add(box(W, 0.04, 0.06, C.white, 0, 0.5, -HW + 0.03), box(0.06, 0.04, W, C.white, -HW + 0.03, 0.5, 0));
    root.add(box(W + 0.28, 0.08, 0.17, SAGE, 0, H + 0.04, -HW - 0.06), box(0.17, 0.08, W + 0.12, SAGE, -HW - 0.06, H + 0.04, 0));
    for (const [x, z] of [[-HW + 0.02, -HW - 0.02], [HW - 0.02, -HW - 0.02], [-HW - 0.02, HW - 0.02]]) root.add(box(0.08, H, 0.08, EDGE, x, H / 2, z));
    // altıgen halı
    for (const [r, c, y] of [[1.05, 0xF4BFD0, 0.02], [0.9, 0xFFFFFF, 0.022], [0.78, 0xA9DCC9, 0.024]]) { const m = cyl(r, r, 0.02, c, 0.2, y, 0.55, 6); m.rotation.y = Math.PI / 6; root.add(m); }

    // pencere + çizgili tente (arka duvar)
    const win = grp(box(1.0, 0.8, 0.06, EDGE, 0, 0, 0), box(0.88, 0.68, 0.05, VM.glass, 0, 0, 0.01), box(0.03, 0.68, 0.06, EDGE, 0, 0, 0.02), box(0.88, 0.03, 0.06, EDGE, 0, 0, 0.02), box(1.1, 0.045, 0.12, C.woodL, 0, -0.43, 0.05));
    win.add(box(0.86, 0.32, 0.01, 0xD6ECF2, 0, 0.17, -0.005), box(0.86, 0.2, 0.012, 0x86CC55, 0, -0.23, 0), sph(0.1, C.pink, -0.22, -0.08, 0.02, 6), sph(0.08, C.yellow, 0.2, -0.04, 0.02, 6));
    for (const [x, c] of [[-0.3, C.red], [0, C.yellow], [0.3, C.lilac]]) win.add(at(pot(c), x, -0.4, 0.07));
    at(win, -0.85, 1.05, -HW + 0.02); root.add(win);
    for (let i = 0; i < 8; i++) { const s = box(0.16, 0.025, 0.34, i % 2 ? 0xFFFFFF : 0x9FD3C0, -1.37 + i * 0.16, 1.63, -HW + 0.2); s.rotation.x = 0.35; root.add(s); }
    // tabela
    const sg = canvasTex(256, 128, (x, w, h) => {
      x.fillStyle = '#FDE8EE'; x.fillRect(0, 0, w, h); x.strokeStyle = '#8A5A34'; x.lineWidth = 8; x.strokeRect(4, 4, w - 8, h - 8);
      x.font = `64px ${EMOJI}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('💐', 62, 68);
      x.fillStyle = '#4A3A22'; x.font = '800 36px Fraunces,Georgia,serif'; x.fillText('Ezgi', 168, 52); x.font = '700 20px sans-serif'; x.fillStyle = '#8A7A5E'; x.fillText('Çiçekçi', 168, 90);
    });
    const sign = plane(0.62, 0.31, sg); sign.position.set(0.3, 1.5, -HW + 0.05); root.add(sign);
    // sarkan sarmaşık saksıları
    for (const x of [-0.1, 0.75]) {
      root.add(box(0.012, 0.3, 0.012, C.iron, x, H - 0.15, -HW + 0.25), cyl(0.07, 0.05, 0.07, 0xB9774A, x, H - 0.34, -HW + 0.25, 7));
      for (let i = 0; i < 6; i++) root.add(sph(0.035, i % 2 ? C.leaf : C.leafL, x + Math.sin(i * 2) * 0.06, H - 0.42 - i * 0.045, -HW + 0.25 + Math.cos(i * 2) * 0.05, 5));
    }
    // arka duvar rafı: saksı çiçekleri (dekor)
    const shelf = grp(box(1.0, 0.05, 0.24, C.woodL, 0, 0, 0), box(0.04, 0.15, 0.22, C.woodD, -0.44, -0.09, 0), box(0.04, 0.15, 0.22, C.woodD, 0.44, -0.09, 0));
    [C.red, C.white, C.yellow, C.lilac].forEach((c, i) => shelf.add(at(pot(c), -0.36 + i * 0.24, 0.025, 0)));
    at(shelf, 1.15, 0.85, -HW + 0.15); root.add(shelf);

    // sol duvar: kapı (cam pencereli) ve paspas
    const door = grp(box(0.06, 1.15, 0.62, EDGE, 0, 0, 0), box(0.04, 1.05, 0.52, 0xA58BD6, 0.02, 0, 0), box(0.045, 0.3, 0.3, VM.glass, 0.03, 0.25, 0), sph(0.035, C.honey, 0.06, -0.12, 0.18, 6));
    at(door, -HW + 0.02, 0.58, 1.15); root.add(door); root.add(box(0.5, 0.025, 0.4, C.pink, -HW + 0.34, 0.015, 1.15));

    // zemin: çiçek kovaları ve saksılar
    const bucket = (x, z, cols) => { const g = grp(cyl(0.12, 0.09, 0.2, 0xA9B4BE, 0, 0.1, 0, 8)); cols.forEach((c, i) => { g.add(cyl(0.006, 0.006, 0.28, C.leaf, -0.06 + i * 0.04, 0.32, Math.sin(i * 3) * 0.04, 3), sph(0.04, c, -0.06 + i * 0.04, 0.47, Math.sin(i * 3) * 0.04, 6)); }); return at(g, x, 0, z); };
    root.add(bucket(-1.3, -0.3, [C.red, C.yellow, C.white]), bucket(-1.3, 0.1, [C.pink, C.lilac, C.white, C.red]), bucket(-0.95, -1.2, [C.yellow, C.orange, C.red]));
    const big = grp(cyl(0.2, 0.15, 0.3, 0xB9774A, 0, 0.15, 0, 8), cyl(0.02, 0.03, 0.4, C.trunk, 0, 0.5, 0, 5)); for (let i = 0; i < 6; i++) big.add(sph(0.15 - (i % 2) * 0.03, i % 2 ? C.leaf : C.leafL, Math.sin(i * 1.1) * 0.12, 0.7 + (i % 3) * 0.1, Math.cos(i * 1.1) * 0.12, 6));
    at(big, 1.45, 0, -1.1); root.add(big);
    // taze çiçek arabası (ön sağ) — dış binadaki arabanın küçük kardeşi
    const cart = grp(box(0.5, 0.06, 0.3, C.woodL, 0, 0.16, 0), box(0.5, 0.1, 0.02, C.wood, 0, 0.24, 0.15), box(0.5, 0.1, 0.02, C.wood, 0, 0.24, -0.15), box(0.2, 0.1, 0.3, C.wood, 0.25, 0.24, 0), box(0.02, 0.12, 0.3, C.wood, -0.25, 0.24, 0));
    for (const z of [0.17, -0.17]) { const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.016, 5, 12), mat(C.woodD)); wheel.position.set(-0.1, 0.08, z); wheel.castShadow = true; cart.add(wheel); }
    [C.red, C.yellow, C.lilac, C.white, C.pink, C.orange, C.red, C.yellow].forEach((c, i) => cart.add(sph(0.045, c, -0.18 + (i % 4) * 0.12, 0.3, -0.06 + Math.floor(i / 4) * 0.12, 6)));
    at(cart, 1.2, 0, 1.25, -0.4); root.add(cart);

    // tezgâh (nane panel + ahşap üst)
    const counter = grp(box(1.9, 0.62, 0.52, MINT, 0, 0.31, 0), box(2.0, 0.05, 0.62, C.woodL, 0, 0.645, 0), box(1.9, 0.03, 0.02, C.white, 0, 0.45, 0.265));
    for (let i = 0; i < 5; i++) counter.add(box(0.015, 0.4, 0.02, 0x8FCBB5, -0.76 + i * 0.38, 0.28, 0.262));
    at(counter, 0.4, 0, 0.5); root.add(counter);
    // kasa
    root.add(at(grp(box(0.26, 0.1, 0.2, C.iron, 0, 0.05, 0), box(0.2, 0.05, 0.06, C.white, 0, 0.12, -0.04), sph(0.012, C.honey, 0.07, 0.11, 0.06, 5)), 1.1, 0.67, 0.45, -0.3));

    // Ezgi: tezgâhın arkasında
    ezgi = buildVillager({ role: 'koylu', skin: 15250570, shirt: 14705258, hair: 0x7A4E2C, apron: 0xFFFFFF, pants: 0x6E4526 });
    ezgi.scale.setScalar(2.4); at(ezgi, 0.4, 0, -0.3, 0.5); root.add(ezgi);
    const bf = new THREE.Group(); const fl = [C.pink, C.yellow].map((c) => { const f = grp(box(0.03, 0.002, 0.02, c, -0.016, 0, 0), box(0.03, 0.002, 0.02, c, 0.016, 0, 0)); bf.add(f); return f; });
    animated.push((t) => fl.forEach((f, i) => { f.position.set(-0.4 + Math.sin(t * 0.7 + i * 2) * 0.35, 1.0 + Math.sin(t * 2 + i) * 0.06, 0.2 + Math.cos(t * 0.6 + i) * 0.25); f.children[0].rotation.z = Math.sin(t * 18) * 0.8; f.children[1].rotation.z = -Math.sin(t * 18) * 0.8; }));
    root.add(bf);
  }

  // ------------------------------------------------------------- veriye bağlı parçalar
  function mark(g, tab) { g.traverse((o) => { o.userData.tab = tab; }); hot.push({ tab, group: g, baseY: g.position.y, baseS: g.scale.x }); dyn.add(g); }

  function lavender() {
    const g = grp(cyl(0.075, 0.065, 0.16, mat(0xDDEFF2, { transparent: true, opacity: 0.55, roughness: 0.2 }), 0, 0.08, 0, 8), cyl(0.07, 0.07, 0.02, C.woodD, 0, 0.17, 0, 8));
    for (let i = 0; i < 9; i++) { const a = i * 0.7, r = 0.015 + (i % 3) * 0.012; g.add(cyl(0.004, 0.004, 0.3, C.leaf, Math.cos(a) * r, 0.3, Math.sin(a) * r, 3), cyl(0.012, 0.007, 0.1, i % 2 ? 0x9C7BD6 : 0xB79BE6, Math.cos(a) * r, 0.5 + (i % 3) * 0.015, Math.sin(a) * r, 5)); }
    g.add(cyl(0.03, 0.03, 0.012, C.red, 0, 0.2, 0, 8)); return g;
  }
  function thyme() {
    const g = grp(box(0.34, 0.025, 0.2, C.woodL, 0, 0.0125, 0));
    for (let i = 0; i < 10; i++) { const s = grp(cyl(0.004, 0.004, 0.3, 0x5F7F45, 0, 0, 0, 3)); s.rotation.z = Math.PI / 2 + (i - 5) * 0.05; s.rotation.y = (i - 5) * 0.07; s.position.set(0, 0.04 + (i % 3) * 0.018, (i - 5) * 0.012);
      for (let k = 0; k < 6; k++) s.add(sph(0.014, k % 2 ? C.leaf : 0x6E9A56, 0, -0.13 + k * 0.05, (k % 2 ? 1 : -1) * 0.012, 4)); g.add(s); }
    g.add(cyl(0.028, 0.028, 0.02, C.woodD, 0, 0.07, 0, 8), box(0.07, 0.05, 0.004, 0xFFFFFF, 0.04, 0.09, 0.03));
    return g;
  }
  function mix() {
    const g = grp(cyl(0.13, 0.1, 0.17, 0xA9B4BE, 0, 0.085, 0, 8));
    const wrap = cone(0.15, 0.3, 0xF6EBD0, 0, 0.3, 0, 6); wrap.rotation.x = Math.PI; g.add(wrap);
    [C.red, C.yellow, C.pink, C.lilac, C.white, C.orange, C.red, C.pink].forEach((c, i) => g.add(sph(0.05, c, Math.sin(i * 0.8) * 0.1, 0.5 + (i % 3) * 0.03, Math.cos(i * 0.8) * 0.08, 6), cyl(0.004, 0.004, 0.18, C.leaf, Math.sin(i * 0.8) * 0.08, 0.38, Math.cos(i * 0.8) * 0.06, 3)));
    g.add(box(0.14, 0.02, 0.14, C.pink, 0, 0.42, 0)); return g;
  }
  const BUILD = { driedLavender: lavender, thymeBundle: thyme, flowerMix: mix };

  function priceTag(p) {
    const out = p.stock < 1;
    const tex = canvasTex(160, 96, (x, w, h) => {
      x.fillStyle = out ? '#E9DFC6' : '#FFF8E9'; x.fillRect(0, 0, w, h); x.strokeStyle = out ? '#B9A98A' : '#8A5A34'; x.lineWidth = 6; x.strokeRect(3, 3, w - 6, h - 6);
      x.textAlign = 'center'; x.fillStyle = '#4A3A22';
      if (out) { x.font = '800 26px sans-serif'; x.fillStyle = '#C9574C'; x.fillText('TÜKENDİ', w / 2, 58); }
      else { x.font = '800 38px Fraunces,Georgia,serif'; x.fillText(`${p.price}`, w / 2 - 14, 52); x.font = `30px ${EMOJI}`; x.fillText('🪙', w / 2 + 38, 50); x.font = '700 16px sans-serif'; x.fillStyle = '#8A7A5E'; x.fillText(`stok ${p.stock}`, w / 2, 82); }
    });
    return plane(0.3, 0.18, tex);
  }

  function buildDynamic(d) {
    dyn.traverse((o) => { if (o.material?.map) { o.material.map.dispose(); o.material.dispose(); } });
    dyn.clear(); hot.length = 0; animDyn = []; for (const k of Object.keys(tips)) delete tips[k];

    // 3 ürün tezgâhta
    d.products.slice(0, 3).forEach((p, i) => {
      const x = -0.15 + i * 0.55, z = 0.5;
      const item = (BUILD[p.id] || mix)();
      if (p.stock < 1) item.traverse((o) => { if (o.material) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.45; } });
      at(item, x, 0.67, z, i * 0.4); item.scale.setScalar(1.45); mark(item, p.id);
      const tag = priceTag(p); tag.position.set(x, 0.5, 0.775); tag.rotation.x = -0.12; dyn.add(tag);
      tips[p.id] = p.stock < 1 ? `${p.name} · tükendi` : `${p.name} · ${p.price} 🪙 · stok ${p.stock}${p.owned ? ` · sende ${p.owned}` : ''} — satın al`;
    });

    // tohum rafı (sol duvar): oyundaki çiçek renkleriyle küçük paketler
    const rack = grp(box(0.06, 0.8, 1.15, EDGE, 0, 0, 0), box(0.05, 0.72, 1.07, 0xE6C48B, 0.02, 0, 0));
    for (let r = 0; r < 3; r++) rack.add(box(0.1, 0.03, 1.07, C.woodL, 0.06, -0.24 + r * 0.24, 0));
    const cols = d.seedColors.length ? d.seedColors : [C.pink, C.yellow, C.lilac, C.red, C.white];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const col = new THREE.Color(cols[(r * 6 + c) % cols.length]).getHex(); rack.add(box(0.025, 0.14, 0.12, col, 0.07, -0.15 + r * 0.24, -0.42 + c * 0.168), box(0.027, 0.04, 0.12, 0xFFFFFF, 0.072, -0.12 + r * 0.24, -0.42 + c * 0.168)); }
    at(rack, -HW + 0.06, 1.05, -0.55); mark(rack, 'seeds'); tips.seeds = d.seedLine;

    // hoş geldin hediyesi
    if (d.welcome) {
      const gift = grp(box(0.32, 0.24, 0.32, C.pink, 0, 0.12, 0), box(0.34, 0.05, 0.34, 0xFFFFFF, 0, 0.26, 0), box(0.06, 0.25, 0.34, C.yellow, 0, 0.125, 0), box(0.34, 0.25, 0.06, C.yellow, 0, 0.125, 0), sph(0.06, C.yellow, 0, 0.32, 0, 6));
      at(gift, -1.15, 0, 0.65, 0.4); mark(gift, 'gift'); tips.gift = 'Ezgi’nin Hoş Geldin Hediyesi — al';
      const base = gift.position.y; animDyn.push((t) => { if (hovered !== 'gift') gift.position.y = base + Math.abs(Math.sin(t * 2)) * 0.04; });
    }
  }

  // ------------------------------------------------------------- boyut / etkileşim / çizim
  function resize() {
    const r = container.getBoundingClientRect(); const w = Math.max(280, r.width), h = Math.max(240, r.height);
    renderer.setSize(w, h, false); const aspect = w / h, size = aspect > 1.3 ? 2.45 : 2.45 * (1.3 / aspect);
    camera.left = -size * aspect; camera.right = size * aspect; camera.top = size + 0.2; camera.bottom = -size + 0.2; camera.updateProjectionMatrix();
  }
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  function pick(ev) {
    const r = canvas.getBoundingClientRect(); ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -(((ev.clientY - r.top) / r.height) * 2 - 1)); ray.setFromCamera(ptr, camera);
    for (const h of ray.intersectObjects(dyn.children, true)) { let o = h.object; while (o) { if (o.userData.tab) return o.userData.tab; o = o.parent; } }
    return null;
  }
  function setHover(tab, ev) {
    if (tab !== hovered) { hovered = tab; canvas.style.cursor = tab ? 'pointer' : 'default'; container.dispatchEvent(new CustomEvent('florist-hover', { detail: tab })); }
    if (tab && ev && tips[tab]) { const r = container.getBoundingClientRect(); tip.textContent = tips[tab]; tip.hidden = false; tip.style.left = `${ev.clientX - r.left}px`; tip.style.top = `${ev.clientY - r.top - 14}px`; } else tip.hidden = true;
  }
  canvas.addEventListener('pointermove', (e) => setHover(pick(e), e));
  canvas.addEventListener('pointerleave', () => setHover(null));
  canvas.addEventListener('click', (e) => { const t = pick(e); if (t && onPick) onPick(t); });

  function frame(now) {
    if (!running) return; const t = now / 1000;
    for (const h of hot) { if (h.tab === 'gift') continue; const on = h.tab === hovered; const g = h.group; g.position.y += ((h.baseY + (on ? 0.05 : 0)) - g.position.y) * 0.25; const s = h.baseS * (on ? 1.06 : 1); g.scale.setScalar(g.scale.x + (s - g.scale.x) * 0.25); }
    animated.forEach((f) => f(t)); animDyn.forEach((f) => f(t));
    if (ezgi) { ezgi.userData.idle(t); ezgi.position.y = Math.abs(Math.sin(t * 1.4)) * 0.006; }
    renderer.render(scene, camera); raf = requestAnimationFrame(frame);
  }

  buildStatic();
  return {
    update(d) { buildDynamic(d); },
    open() { if (running) return; running = true; resize(); raf = requestAnimationFrame(frame); },
    close() { running = false; cancelAnimationFrame(raf); setHover(null); },
    resize, hover(tab) { setHover(tab); }, get hovered() { return hovered; }
  };
}
