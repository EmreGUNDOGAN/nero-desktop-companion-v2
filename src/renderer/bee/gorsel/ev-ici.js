// Arıcının Evi · iç mekân dioraması (v6.8.0)
// Dış haritadaki köy evleriyle aynı parça kiti (evler/kit.js), aynı düz gölgeli düşük poligon dil,
// aynı izometrik ortografik kamera. Çatısı kaldırılmış tek odalı kesit ev.
// Kullanım: const room = createHouseInterior(container, { onPick(tab) }); room.update(data); room.open(); room.close();
import * as THREE from '../vendor/three.module.min.js';
import { box, cyl, sph, cone, grp, at, mat, C, pot } from '../evler/kit.js';
import { VM } from '../village.js';
import { buildNero } from '../figures.js';

const W = 3.4;           // oda kenarı
const H = 1.75;          // duvar yüksekliği
const HW = W / 2;
const FLOOR = 0xE9D3A5, FLOOR2 = 0xDFC594, WALL = 0xF3E4C4, WALL2 = 0xE8D5AB, EDGE = 0x8A5A34, EDGE_D = 0x6E4526, SAGE = 0xA9C29B;

function canvasTex(w, h, draw) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const flatMat = (tex) => new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 });
function card(w, h, tex) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), flatMat(tex)); m.castShadow = true; m.receiveShadow = true; return m; }

function wrapText(ctx, text, x, y, maxW, lh, maxLines = 2) {
  const words = String(text || '').split(' '); let line = ''; let n = 0;
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y + n * lh); n++; line = w; if (n >= maxLines) return; } else line = t;
  }
  if (line && n < maxLines) ctx.fillText(line, x, y + n * lh);
}

const TOOLTIP = { cups: 'Kupalar', honey: 'Bal Rafı', letters: 'Mektuplar', records: 'Arıcının Defteri' };

export function createHouseInterior(container, { onPick } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'house-canvas';
  container.prepend(canvas);
  const tip = document.createElement('div'); tip.className = 'house-tip'; tip.hidden = true; container.appendChild(tip);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 60);
  camera.position.set(7.2, 6.6, 7.2); camera.lookAt(0, 0.75, 0);

  scene.add(new THREE.HemisphereLight(0xFFF6E0, 0xC9A06A, 1.25));
  const sun = new THREE.DirectionalLight(0xFFF1D6, 1.55);
  sun.position.set(4, 9, 5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 }); sun.shadow.bias = -0.0006;
  scene.add(sun);
  const lampLight = new THREE.PointLight(0xFFC266, 0.0, 6, 1.5); lampLight.position.set(0, 1.4, 0); scene.add(lampLight);

  const root = new THREE.Group(); scene.add(root);
  const dyn = new THREE.Group(); root.add(dyn);      // veriye bağlı, her güncellemede yeniden kurulur
  const hot = [];                                    // { tab, group }
  let nero = null, neroBob = 0, hovered = null, running = false, raf = 0, built = false, lastData = null;
  const animated = [];

  // ---------------------------------------------------------------- sabit oda
  function buildStatic() {
    // taban: ahşap kenarlı döşeme (haritadaki altıgen karelerin kenar diliyle aynı)
    root.add(box(W + 0.24, 0.3, W + 0.24, EDGE_D, 0, -0.15, 0));
    root.add(box(W + 0.24, 0.07, W + 0.24, EDGE, 0, -0.035, 0));
    for (let i = 0; i < 8; i++) root.add(box(W, 0.012, W / 8 - 0.02, i % 2 ? FLOOR2 : FLOOR, 0, 0.006, -HW + (i + 0.5) * (W / 8)));
    // duvarlar (arka z-, sol x-)
    root.add(box(W + 0.24, H, 0.12, WALL, 0, H / 2, -HW - 0.06));
    root.add(box(0.12, H, W, WALL2, -HW - 0.06, H / 2, 0));
    root.add(box(W + 0.28, 0.07, 0.17, EDGE, 0, H + 0.035, -HW - 0.06));   // duvar üst kirişi
    root.add(box(0.17, 0.07, W + 0.12, EDGE, -HW - 0.06, H + 0.035, 0));
    root.add(box(W, 0.1, 0.03, EDGE_D, 0, 0.05, -HW + 0.015));              // süpürgelik
    root.add(box(0.03, 0.1, W, EDGE_D, -HW + 0.015, 0.05, 0));
    for (const x of [-HW + 0.02, HW - 0.02]) root.add(box(0.08, H, 0.08, EDGE, x, H / 2, -HW - 0.02)); // köşe direkleri
    root.add(box(0.08, H, 0.08, EDGE, -HW - 0.02, H / 2, HW - 0.02));
    // altıgen halı: oyunun altıgen diline selam
    const rug = cyl(1.05, 1.05, 0.02, SAGE, 0.05, 0.02, 0.1, 6); rug.rotation.y = Math.PI / 6; root.add(rug);
    const rug2 = cyl(0.88, 0.88, 0.024, 0xF2D68A, 0.05, 0.022, 0.1, 6); rug2.rotation.y = Math.PI / 6; root.add(rug2);
    const rug3 = cyl(0.74, 0.74, 0.028, SAGE, 0.05, 0.024, 0.1, 6); rug3.rotation.y = Math.PI / 6; root.add(rug3);

    // pencere (arka duvar, solda) — gece de yanan oyun camı
    const win = grp(box(0.9, 0.78, 0.06, EDGE, 0, 0, 0), box(0.78, 0.66, 0.05, VM.glass, 0, 0, 0.01), box(0.03, 0.66, 0.06, EDGE, 0, 0, 0.02), box(0.78, 0.03, 0.06, EDGE, 0, 0, 0.02), box(1.0, 0.045, 0.1, C.woodL, 0, -0.42, 0.04));
    // gökyüzü + tepeler (düz renkli)
    win.add(box(0.76, 0.3, 0.01, 0xD6ECF2, 0, 0.17, -0.005), box(0.76, 0.2, 0.012, 0x86CC55, 0, -0.21, 0), sph(0.12, C.orange, -0.2, -0.05, 0.02, 6), sph(0.09, C.orange, 0.2, 0.0, 0.02, 6));
    win.add(at(pot(C.red), -0.28, -0.4, 0.05), at(pot(C.yellow), 0.3, -0.4, 0.05));
    at(win, -1.1, 1.0, -HW + 0.02); root.add(win);
    // perde
    root.add(box(0.14, 0.7, 0.03, C.red, -1.62, 0.98, -HW + 0.05), box(0.14, 0.7, 0.03, C.red, -0.58, 0.98, -HW + 0.05));

    // sol duvar: kapı
    const door = grp(box(0.06, 1.15, 0.62, EDGE, 0, 0, 0), box(0.04, 1.05, 0.52, C.wood, 0.02, 0, 0), sph(0.035, C.honey, 0.06, -0.05, 0.18, 6));
    at(door, -HW + 0.02, 0.58, 0.55); root.add(door);
    root.add(box(0.5, 0.025, 0.4, C.red, -HW + 0.34, 0.015, 0.55)); // paspas
  }

  // ---------------------------------------------------------------- mobilya
  function buildFurniture(stage) {
    // masa
    const table = grp(box(1.15, 0.07, 0.75, C.woodL, 0, 0.62, 0));
    for (const [x, z] of [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]]) table.add(box(0.07, 0.6, 0.07, C.woodD, x, 0.3, z));
    at(table, 0.05, 0, 0.1); root.add(table);
    // sandalye
    const chair = grp(box(0.38, 0.05, 0.38, C.wood, 0, 0.38, 0), box(0.38, 0.5, 0.05, C.wood, 0, 0.62, 0.17), ...[[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].map(([x, z]) => box(0.04, 0.38, 0.04, C.woodD, x, 0.19, z)));
    at(chair, 0.05, 0, 0.78, Math.PI); root.add(chair);
    // sehpa üzerinde kupa
    const mug = grp(cyl(0.06, 0.055, 0.1, C.blue, 0, 0.05, 0, 8), box(0.02, 0.06, 0.02, C.blue, 0.075, 0.05, 0)); at(mug, 0.5, 0.655, 0.0); root.add(mug);
    // saksı
    const vase = at(pot(C.pink), -0.15, 0.655, 0.28); vase.scale.setScalar(1.2); root.add(vase);
    // dışarıdaki ev gibi: kovan maketi ve fener (aşama ile gelişir)
    const lamp = grp(cyl(0.012, 0.012, 0.18, C.iron, 0, 0.09, 0, 5), sph(0.055, VM.lamp, 0, 0.21, 0, 8)); at(lamp, -0.38, 0.655, -0.15); root.add(lamp);

    // kovan maketi (arka duvar dibi, bal rafının altında): oyunun kovan renkleriyle
    const hive = grp(box(0.5, 0.2, 0.4, C.honey, 0, 0.1, 0), box(0.5, 0.2, 0.4, C.yellow, 0, 0.3, 0), box(0.56, 0.06, 0.46, C.woodD, 0, 0.43, 0), box(0.14, 0.04, 0.02, C.ink, 0, 0.1, 0.205));
    for (let i = 0; i < 3; i++) hive.add(sph(0.018, C.ink, -0.1 + i * 0.1, 0.32, 0.206, 5));
    at(hive, 1.3, 0, -HW + 0.35); root.add(hive);

    // yatak/sepet: sol köşede kedi sepeti
    const basket = grp(cyl(0.2, 0.17, 0.12, C.woodL, 0, 0.06, 0, 8), cyl(0.15, 0.15, 0.03, C.red, 0, 0.12, 0, 8));
    at(basket, -1.15, 0, -0.95); root.add(basket);
    const tabby = at(grp(sph(0.07, C.orange, 0, 0.17, 0, 7), sph(0.045, C.orange, 0.07, 0.2, 0, 6), cone(0.016, 0.03, C.orange, 0.075, 0.24, 0.02, 4), cone(0.016, 0.03, C.orange, 0.075, 0.24, -0.02, 4)), -1.15, 0, -0.95); root.add(tabby);

    // Nero: odanın sakini
    nero = buildNero(); nero.scale.setScalar(1.7); at(nero, 1.15, 0, 1.0, 0.75); root.add(nero);

    if (stage >= 1) { // ikinci küçük pencere + çiçek saksıları
      const w2 = grp(box(0.5, 0.5, 0.05, EDGE, 0, 0, 0), box(0.4, 0.4, 0.05, VM.glass, 0, 0, 0.01), box(0.02, 0.4, 0.06, EDGE, 0, 0, 0.02));
      at(w2, -HW + 0.02, 1.0, -1.25, Math.PI / 2); root.add(w2);
      root.add(at(pot(C.lilac), 1.4, 0, 1.35), at(pot(C.red), 1.28, 0, 1.45));
    }
    if (stage >= 2) { // sandık ve kasa (bal evi)
      for (let i = 0; i < 3; i++) root.add(box(0.28, 0.2, 0.22, C.woodL, 1.4 - (i % 2) * 0.3, 0.1 + Math.floor(i / 2) * 0.2, -0.45 + (i % 2) * 0.05));
      root.add(sph(0.05, C.honey, 1.4, 0.46, -0.45, 6));
    }
    if (stage >= 3) { // tavandan sakan fener (oda aydınlanır)
      root.add(cyl(0.01, 0.01, 0.35, C.iron, 0.05, H - 0.17, 0.1, 4), sph(0.1, VM.lamp, 0.05, H - 0.4, 0.1, 10));
      lampLight.intensity = 0.5;
    } else lampLight.intensity = 0;
  }

  // ---------------------------------------------------------------- veriye bağlı parçalar
  function mark(group, tab) { group.userData.tab = tab; group.traverse((o) => { o.userData.tab = tab; }); hot.push({ tab, group, baseY: group.position.y, baseS: group.scale.x }); dyn.add(group); }

  function buildDynamic(d) {
    dyn.traverse((o) => { if (o.material?.map) { o.material.map.dispose(); o.material.dispose(); } });
    dyn.clear(); hot.length = 0; animated.length = 0;

    // 1) Bal rafı (arka duvar, sağda)
    const shelf = grp(box(1.05, 0.05, 0.22, C.woodL, 0, 0, 0), box(0.04, 0.14, 0.2, C.woodD, -0.48, -0.08, 0), box(0.04, 0.14, 0.2, C.woodD, 0.48, -0.08, 0));
    if (d.stage >= 2) shelf.add(box(1.05, 0.05, 0.22, C.woodL, 0, -0.5, 0), box(0.04, 0.5, 0.2, C.woodD, -0.48, -0.25, 0), box(0.04, 0.5, 0.2, C.woodD, 0.48, -0.25, 0));
    const jars = d.jars.slice(0, d.stage >= 2 ? 12 : 6);
    jars.forEach((color, i) => {
      const row = Math.floor(i / 6), col = i % 6;
      const jm = mat(new THREE.Color(color).getHex(), { transparent: true, opacity: 0.95, roughness: 0.35 });
      shelf.add(cyl(0.065, 0.065, 0.14, jm, -0.4 + col * 0.16, 0.1 - row * 0.5, 0, 8), cyl(0.07, 0.07, 0.03, C.woodD, -0.4 + col * 0.16, 0.185 - row * 0.5, 0, 8));
    });
    if (!jars.length) shelf.add(cyl(0.065, 0.065, 0.14, mat(0xE9DFC6, { transparent: true, opacity: 0.55 }), -0.4, 0.1, 0, 8));
    at(shelf, 0.62, 0.95, -HW + 0.14); mark(shelf, 'honey');

    // 2) Kupa rafı (sol duvar)
    const cupShelf = grp(box(0.22, 0.05, 1.3, C.woodL, 0, 0, 0), box(0.2, 0.2, 0.04, C.woodD, 0, -0.1, 0.62), box(0.2, 0.2, 0.04, C.woodD, 0, -0.1, -0.62));
    const medals = { altın: 0xF2B33D, gümüş: 0xC8CDD3, bronz: 0xC77B3E };
    const cups = d.cups.slice(-5);
    cups.forEach((c, i) => {
      const col = medals[c] || medals.bronz; const z = -0.5 + i * 0.25;
      cupShelf.add(cyl(0.07, 0.04, 0.12, col, 0, 0.12, z, 8), cyl(0.02, 0.02, 0.06, col, 0, 0.05, z, 6), cyl(0.06, 0.06, 0.02, col, 0, 0.03, z, 8), box(0.01, 0.07, 0.01, col, 0, 0.16, z + 0.075));
    });
    if (!cups.length) cupShelf.add(cyl(0.06, 0.04, 0.1, mat(0xE9DFC6, { transparent: true, opacity: 0.5 }), 0, 0.1, 0, 8));
    at(cupShelf, -HW + 0.14, 1.05, -0.4); mark(cupShelf, 'cups');

    // 3) Mektup kutusu (saą-ön köşede küçük komodin üstünde)
    const post = grp(box(0.55, 0.5, 0.35, C.wood, 0, 0.25, 0), box(0.5, 0.04, 0.3, C.woodL, 0, 0.52, 0));
    const n = Math.min(5, d.letters);
    for (let i = 0; i < Math.max(1, n); i++) {
      const env = box(0.26, 0.012, 0.18, i === 0 && d.unread ? C.yellow : C.white, 0.0, 0.545 + i * 0.014, 0); env.rotation.y = (i - 2) * 0.15; post.add(env);
    }
    post.add(box(0.5, 0.08, 0.04, C.red, 0, 0.58, 0.14));
    if (d.unread) { const dot = sph(0.07, C.red, 0.24, 0.72, 0.1, 8); dot.userData.pulse = true; post.add(dot); animated.push((t) => { dot.scale.setScalar(1 + Math.sin(t * 4) * 0.18); }); }
    at(post, -HW + 0.4, 0, 1.45); mark(post, 'letters');

    // 4) Defter (masanın üstünde, a çık)
    const book = grp(box(0.34, 0.035, 0.24, C.brick, 0, 0, 0), box(0.15, 0.02, 0.21, C.white, -0.08, 0.025, 0), box(0.15, 0.02, 0.21, C.white, 0.08, 0.025, 0), box(0.012, 0.025, 0.21, C.brick, 0, 0.03, 0));
    for (let i = 0; i < 3; i++) book.add(box(0.1, 0.002, 0.008, C.ink, -0.08, 0.037, -0.06 + i * 0.05), box(0.1, 0.002, 0.008, C.ink, 0.08, 0.037, -0.06 + i * 0.05));
    const pen = box(0.012, 0.012, 0.16, C.honey, 0.22, 0.02, 0.0); pen.rotation.y = 0.5; book.add(pen);
    at(book, -0.18, 0.67, 0.05, 0.25); mark(book, 'records');

    // 5) Hatıra panosu (arka duvar, ortada-solda) — oyundaki gerçek kayıtlardan 3 kart
    const board = grp(box(1.05, 0.7, 0.05, EDGE, 0, 0, 0), box(0.95, 0.6, 0.04, 0xD9B77C, 0, 0, 0.012));
    d.cards.slice(0, 3).forEach((m, i) => {
      const tex = canvasTex(160, 200, (x, w, h) => {
        x.fillStyle = '#FFF8E9'; x.fillRect(0, 0, w, h); x.strokeStyle = '#CAB998'; x.lineWidth = 4; x.strokeRect(2, 2, w - 4, h - 4);
        const tone = { honey: ['#F5D76E', '#F2B33D'], cup: ['#6FA3D9', '#F2B33D'], village: ['#7FBF62', '#E8D29B'], milestone: ['#E893A8', '#F5D76E'], locked: ['#D9D0BB', '#D9D0BB'] }[m.tone] || ['#B9D9D0', '#F4D48A'];
        const g = x.createLinearGradient(0, 0, w, 110); g.addColorStop(0, tone[0]); g.addColorStop(1, tone[1]); x.fillStyle = g; x.fillRect(14, 14, w - 28, 104);
        x.font = '58px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(m.icon, w / 2, 68);
        x.fillStyle = '#4A3A22'; x.font = '800 17px Fraunces,Georgia,serif'; x.textBaseline = 'alphabetic'; wrapText(x, m.title, w / 2, 144, w - 24, 19, 2);
        x.fillStyle = '#8A7A5E'; x.font = '600 12px sans-serif'; wrapText(x, m.date, w / 2, 186, w - 20, 14, 1);
      });
      const c = card(0.26, 0.325, tex); c.position.set(-0.3 + i * 0.3, 0.02 + (i % 2 ? -0.02 : 0.02), 0.045); c.rotation.z = [-0.06, 0.05, -0.03][i];
      board.add(c, sph(0.018, [C.red, C.blue, C.honey][i], -0.3 + i * 0.3 + (i === 1 ? 0.01 : 0), 0.17 + (i % 2 ? -0.02 : 0.02), 0.06, 5));
    });
    at(board, -0.1, 1.4, -HW + 0.045); dyn.add(board);

    // 6) Takvim (arka duvar, sağda üstte) — oyun günü
    const cal = canvasTex(128, 160, (x, w, h) => {
      x.fillStyle = '#FFF1D2'; x.fillRect(0, 0, w, h); x.fillStyle = '#C45F35'; x.fillRect(0, 0, w, 36);
      x.fillStyle = '#FFF6E3'; x.font = '800 18px sans-serif'; x.textAlign = 'center'; x.fillText('TAKVİM', w / 2, 25);
      x.fillStyle = '#4A3A22'; x.font = '800 40px Fraunces,Georgia,serif'; x.fillText(String(d.day), w / 2, 90);
      x.font = '600 14px sans-serif'; x.fillStyle = '#6E4526'; x.fillText(d.dateLine, w / 2, 125); x.fillText(d.seasonLine, w / 2, 145);
    });
    const calM = card(0.4, 0.5, cal); calM.position.set(1.4, 1.38, -HW + 0.03); dyn.add(calM);

    // toplam hasat tabelası (defterin yanında küçük not kâğıdı değil — masaya konan not)
    // (metin DOM'da; sahnede etiket yok)
  }

  // ---------------------------------------------------------------- boyut / çizim / etkileşim
  function resize() {
    const r = container.getBoundingClientRect();
    const w = Math.max(280, r.width), h = Math.max(240, r.height);
    renderer.setSize(w, h, false);
    const aspect = w / h, size = aspect > 1.3 ? 2.45 : 2.45 * (1.3 / aspect);
    camera.left = -size * aspect; camera.right = size * aspect; camera.top = size + 0.2; camera.bottom = -size + 0.2;
    camera.updateProjectionMatrix();
  }

  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  function pick(ev) {
    const r = canvas.getBoundingClientRect();
    ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -(((ev.clientY - r.top) / r.height) * 2 - 1));
    ray.setFromCamera(ptr, camera);
    const hits = ray.intersectObjects(dyn.children, true);
    for (const h of hits) { let o = h.object; while (o) { if (o.userData.tab) return o.userData.tab; o = o.parent; } }
    return null;
  }
  function setHover(tab, ev) {
    if (tab !== hovered) { hovered = tab; canvas.style.cursor = tab ? 'pointer' : 'default'; container.dispatchEvent(new CustomEvent('house-hover', { detail: tab })); }
    if (tab && ev) { const r = container.getBoundingClientRect(); tip.textContent = TOOLTIP[tab]; tip.hidden = false; tip.style.left = `${ev.clientX - r.left}px`; tip.style.top = `${ev.clientY - r.top - 14}px`; }
    else tip.hidden = true;
  }
  canvas.addEventListener('pointermove', (e) => setHover(pick(e), e));
  canvas.addEventListener('pointerleave', () => setHover(null));
  canvas.addEventListener('click', (e) => { const t = pick(e); if (t && onPick) onPick(t); });

  function frame(now) {
    if (!running) return;
    const t = now / 1000;
    for (const h of hot) {
      const on = h.tab === hovered; const g = h.group;
      g.position.y += ((h.baseY + (on ? 0.05 : 0)) - g.position.y) * 0.25;
      const s = h.baseS * (on ? 1.05 : 1); g.scale.setScalar(g.scale.x + (s - g.scale.x) * 0.25);
    }
    animated.forEach((f) => f(t));
    if (nero) { nero.position.y = Math.abs(Math.sin(t * 1.6)) * 0.012; nero.rotation.y = 0.75 + Math.sin(t * 0.5) * 0.12; }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function ensureBuilt(stage) {
    if (built === stage) return;
    // sabit parçaları yeniden kur (aşama değişince mobilya değişir)
    for (const c of [...root.children]) if (c !== dyn) { root.remove(c); }
    buildStatic(); buildFurniture(stage); built = stage;
  }

  return {
    update(d) {
      lastData = d;
      ensureBuilt(d.stage);
      buildDynamic(d);
    },
    open() { if (running) return; running = true; resize(); raf = requestAnimationFrame(frame); },
    close() { running = false; cancelAnimationFrame(raf); setHover(null); },
    resize,
    get hovered() { return hovered; },
    hover(tab) { setHover(tab); }
  };
}
