import * as THREE from './vendor/three.module.min.js';

// ============================================================================
// Nero · Arıcılık — Köy yapıları (kodla çizilen 3D modeller)
// Her yapı bir altıgen kareye sığacak şekilde (yarıçap ~1) tasarlanır.
// buildOccupant(id) bir THREE.Group döndürür; hareketli parçalar için
// group.userData.animate(t) tanımlıdır. Işık alan pencereler M.glass'ı kullanır.
// ============================================================================

const matCache = new Map();
export function mat(color, opts = {}) {
  const key = `${color}|${JSON.stringify(opts)}`;
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, flatShading: true, ...opts }));
  return matCache.get(key);
}

// Gece yanan pencereler bu tek malzemeyi paylaşır (oyun gece emissive değerini ayarlar)
export const VM = {
  glass: new THREE.MeshStandardMaterial({ color: 0xBFE3EE, emissive: 0xFFB84A, emissiveIntensity: 0, roughness: 0.4, flatShading: true }),
  lamp: new THREE.MeshStandardMaterial({ color: 0xFFE3A0, emissive: 0xFFC05A, emissiveIntensity: 0.4, roughness: 0.5 })
};

const C = {
  ink: 0x4A3A22, wood: 0x8A5A34, woodDark: 0x6E4526, woodLight: 0xC9A06A, stone: 0xBDB6AA, stoneDark: 0x9A948A,
  brick: 0xB95A42, cream: 0xF3E4C4, white: 0xF6F1E7, roofRed: 0xD9743A, roofBlue: 0x4F7FB0, roofNavy: 0x3E5478,
  roofPink: 0xE893A8, roofGold: 0xE9B63E, roofGreen: 0x6FA35E, leaf: 0x5FA24E, leafLight: 0x7FBF62, trunk: 0x7A4E2C,
  honey: 0xF2B33D, iron: 0x3A3A3A, cloth1: 0xE0626A, cloth2: 0x6FA3D9, cloth3: 0xF5D76E
};

// ---------------------------------------------------------------------------
// Temel parçalar
// ---------------------------------------------------------------------------
function mesh(geo, m, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(geo, m);
  o.position.set(x, y, z);
  o.castShadow = true;
  o.receiveShadow = true;
  return o;
}
const box = (w, h, d, c, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), typeof c === 'number' ? mat(c) : c, x, y, z);
const cyl = (rt, rb, h, c, x, y, z, seg = 10) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), typeof c === 'number' ? mat(c) : c, x, y, z);
const sph = (r, c, x, y, z, seg = 8) => mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), typeof c === 'number' ? mat(c) : c, x, y, z);
const cone = (r, h, c, x, y, z, seg = 8) => mesh(new THREE.ConeGeometry(r, h, seg), typeof c === 'number' ? mat(c) : c, x, y, z);

// Üçgen kesitli beşik çatı (w: genişlik, d: derinlik, h: yükseklik)
function gableRoof(w, d, h, c, overhang = 0.08) {
  const s = new THREE.Shape();
  const hw = w / 2 + overhang;
  s.moveTo(-hw, 0); s.lineTo(hw, 0); s.lineTo(0, h); s.lineTo(-hw, 0);
  const geo = new THREE.ExtrudeGeometry(s, { depth: d + overhang * 2, bevelEnabled: false });
  geo.translate(0, 0, -(d + overhang * 2) / 2);
  return mesh(geo, typeof c === 'number' ? mat(c) : c);
}

// Tabela: tuval üzerine emoji/yazı çizilir
const signCache = new Map();
function signTexture(text, bg = '#FFF6E0', fg = '#4A3A22') {
  const k = `${text}|${bg}|${fg}`;
  if (signCache.has(k)) return signCache.get(k);
  const cv = document.createElement('canvas');
  cv.width = 128; cv.height = 128;
  const x = cv.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, 128, 128);
  x.strokeStyle = fg; x.lineWidth = 8; x.strokeRect(4, 4, 120, 120);
  x.font = '76px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = fg;
  x.fillText(text, 64, 70);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  signCache.set(k, tex);
  return tex;
}
function sign(text, size = 0.22, bg, fg) {
  const m = new THREE.MeshStandardMaterial({ map: signTexture(text, bg, fg), roughness: 0.7 });
  return mesh(new THREE.BoxGeometry(size, size, 0.03), [mat(C.wood), mat(C.wood), mat(C.wood), mat(C.wood), m, mat(C.wood)]);
}

// Çizgili tente dokusu
const stripeCache = new Map();
function stripeTexture(a, b) {
  const k = `${a}|${b}`;
  if (stripeCache.has(k)) return stripeCache.get(k);
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 8;
  const x = cv.getContext('2d');
  for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? b : a; x.fillRect(i * 8, 0, 8, 8); }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  stripeCache.set(k, tex);
  return tex;
}
function awning(w, a, b) {
  const m = new THREE.MeshStandardMaterial({ map: stripeTexture(a, b), roughness: 0.8, side: THREE.DoubleSide });
  const g = mesh(new THREE.PlaneGeometry(w, 0.26), m);
  g.rotation.x = -Math.PI / 3.2;
  return g;
}

// Temel ev gövdesi: duvarlar, kapı, pencereler, çatı
function house({ w = 0.8, d = 0.62, h = 0.52, wall = C.cream, roof = C.roofRed, roofH = 0.36, door = C.wood, windows = 2, roofType = 'gable', chimney = false, shutters = null }) {
  const g = new THREE.Group();
  g.add(box(w, h, d, wall, 0, h / 2, 0));
  g.add(box(0.16, 0.28, 0.03, door, 0, 0.14, d / 2 + 0.005));
  const wx = windows === 1 ? [w * 0.3] : [-w * 0.3, w * 0.3];
  for (const x of wx) {
    const win = box(0.14, 0.13, 0.03, VM.glass, x, h * 0.62, d / 2 + 0.006);
    g.add(win);
    if (shutters) {
      g.add(box(0.05, 0.14, 0.02, shutters, x - 0.1, h * 0.62, d / 2 + 0.012));
      g.add(box(0.05, 0.14, 0.02, shutters, x + 0.1, h * 0.62, d / 2 + 0.012));
    }
  }
  let r;
  if (roofType === 'gable') { r = gableRoof(w, d, roofH, roof); r.position.y = h; }
  else if (roofType === 'hip') { r = cone(Math.max(w, d) * 0.78, roofH, roof, 0, h + roofH / 2, 0, 4); r.rotation.y = Math.PI / 4; r.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d)); }
  else if (roofType === 'flat') { r = box(w + 0.08, 0.06, d + 0.08, roof, 0, h + 0.03, 0); }
  g.add(r);
  if (chimney) g.add(box(0.1, 0.26, 0.1, typeof chimney === 'number' ? chimney : C.brick, w * 0.25, h + roofH * 0.6, -d * 0.15));
  g.userData.top = h + (roofType === 'flat' ? 0.06 : roofH);
  g.userData.size = { w, d, h };
  return g;
}

function pot(x, z, flower = 0xE0626A) {
  const g = new THREE.Group();
  g.add(cyl(0.035, 0.028, 0.05, 0xB9774A, 0, 0.025, 0, 6));
  g.add(sph(0.035, flower, 0, 0.07, 0, 6));
  g.position.set(x, 0, z);
  return g;
}

function tree(scale = 1, x = 0, z = 0, leaf = C.leaf) {
  const g = new THREE.Group();
  g.add(cyl(0.05, 0.07, 0.4, C.trunk, 0, 0.2, 0, 6));
  g.add(mesh(new THREE.IcosahedronGeometry(0.34, 0), mat(leaf), 0, 0.62, 0));
  g.add(mesh(new THREE.IcosahedronGeometry(0.22, 0), mat(C.leafLight), 0.16, 0.52, 0.08));
  g.position.set(x, 0, z);
  g.scale.setScalar(scale);
  return g;
}

function cat(color = 0xE8A55A) {
  const g = new THREE.Group();
  const m = mat(color);
  const body = sph(0.045, m, 0, 0.04, 0, 8); body.scale.set(1.3, 0.9, 1);
  const head = sph(0.033, m, 0.055, 0.075, 0, 8);
  const e1 = cone(0.012, 0.025, m, 0.06, 0.105, 0.015, 4);
  const e2 = cone(0.012, 0.025, m, 0.06, 0.105, -0.015, 4);
  const tail = cyl(0.008, 0.008, 0.08, m, -0.07, 0.07, 0, 5); tail.rotation.z = 0.7;
  g.add(body, head, e1, e2, tail);
  return g;
}

// Tüten baca dumanı
function smoke(x, y, z) {
  const g = new THREE.Group();
  const puffs = [];
  for (let i = 0; i < 4; i++) {
    const p = sph(0.05, new THREE.MeshStandardMaterial({ color: 0xEDEDED, transparent: true, opacity: 0.7, roughness: 1 }), 0, 0, 0, 6);
    p.castShadow = false;
    puffs.push(p);
    g.add(p);
  }
  g.position.set(x, y, z);
  g.userData.animate = (t) => puffs.forEach((p, i) => {
    const k = ((t * 0.35) + i / puffs.length) % 1;
    p.position.set(Math.sin(k * 5 + i) * 0.04, k * 0.45, 0);
    p.scale.setScalar(0.6 + k * 1.2);
    p.material.opacity = 0.7 * (1 - k);
  });
  return g;
}

// ---------------------------------------------------------------------------
// Yapılar (şimdilik 8 örnek)
// ---------------------------------------------------------------------------
const BUILDERS = {
  // 1 · Ayşe Teyze: kiremit çatı, saksılı pencereler, bahçede çamaşır ipi
  ayse() {
    const g = new THREE.Group();
    const h = house({ roof: C.roofRed, wall: 0xF5E6CC, shutters: 0x6FA35E, chimney: true });
    h.position.set(-0.12, 0, -0.1);
    g.add(h);
    for (const x of [-0.36, -0.2, 0.12, 0.28]) g.add(pot(x, 0.26, [0xE0626A, 0xF5D76E, 0xE893A8, 0xFFFFFF][Math.abs(Math.round(x * 10)) % 4]));
    // çamaşır ipi
    const p1 = cyl(0.015, 0.015, 0.42, C.wood, 0.42, 0.21, -0.35, 5);
    const p2 = cyl(0.015, 0.015, 0.42, C.wood, 0.42, 0.21, 0.3, 5);
    const line = cyl(0.004, 0.004, 0.65, C.ink, 0.42, 0.4, -0.025, 4); line.rotation.x = Math.PI / 2;
    g.add(p1, p2, line);
    [[C.cloth1, -0.22], [C.cloth2, -0.02], [C.cloth3, 0.18]].forEach(([c, z]) => g.add(box(0.02, 0.14, 0.12, c, 0.42, 0.33, z)));
    return g;
  },

  // 8 · Balıkçı Kemal: mavi çatı, önünde ters kayık ve kuruyan ağ
  kemal() {
    const g = new THREE.Group();
    const h = house({ w: 0.7, d: 0.56, h: 0.46, roof: C.roofBlue, wall: C.white, windows: 1 });
    h.position.set(-0.15, 0, -0.15);
    g.add(h);
    // ters kayık
    const hull = cyl(0.14, 0.14, 0.62, 0xD9573F, 0.28, 0.07, 0.3, 10);
    hull.scale.set(1, 0.55, 1);
    hull.rotation.set(Math.PI / 2, 0, 0.1);
    g.add(hull);
    g.add(box(0.02, 0.02, 0.6, C.white, 0.28, 0.14, 0.3));
    // ağ: iki kazık arasında gerili
    const netMat = new THREE.MeshStandardMaterial({ color: 0x8C7A5B, transparent: true, opacity: 0.55, side: THREE.DoubleSide, wireframe: true });
    g.add(cyl(0.012, 0.012, 0.4, C.wood, -0.45, 0.2, 0.25, 5), cyl(0.012, 0.012, 0.4, C.wood, -0.1, 0.2, 0.38, 5));
    const net = mesh(new THREE.PlaneGeometry(0.38, 0.3, 6, 5), netMat, -0.27, 0.24, 0.32);
    net.rotation.y = -0.35;
    g.add(net);
    return g;
  },

  // 72 · Kerim Dede ve Kedileri: taş ev, çatıda/pencerede/kapıda kediler
  kerim() {
    const g = new THREE.Group();
    const h = house({ w: 0.74, d: 0.6, h: 0.5, wall: C.stone, roof: 0x8A6F5A, shutters: 0x9A6A4A, chimney: C.stoneDark });
    h.position.set(0, 0, -0.08);
    g.add(h);
    const colors = [0xE8A55A, 0x3A3A3A, 0xF2F2F2, 0xB0B0B0, 0xD98A3A, 0x5A4A3A, 0xEDE0C8];
    const spots = [[0.1, 0.7, -0.08, 0], [-0.2, 0.64, -0.02, 0.4], [0.2, 0, 0.33, -0.5], [-0.05, 0, 0.36, 1.4], [-0.32, 0, 0.32, 2.4], [0.36, 0, 0.12, 3], [-0.22, 0.33, 0.235, 0]];
    spots.forEach(([x, y, z, r], i) => { const c = cat(colors[i]); c.position.set(x, y, z); c.rotation.y = r; g.add(c); });
    g.add(cyl(0.06, 0.07, 0.03, 0xD9D2C0, 0.05, 0.015, 0.45, 8)); // mama kabı
    return g;
  },

  // 9 · Fırın: kırmızı tuğla, tüten baca, ekmek tabelası
  firin() {
    const g = new THREE.Group();
    const h = house({ w: 0.86, d: 0.64, h: 0.54, wall: C.brick, roof: 0x8E3B2A, chimney: C.stoneDark, windows: 2 });
    h.position.set(0, 0, -0.08);
    g.add(h);
    const s = sign('🍞', 0.24); s.position.set(0, 0.56, 0.26); g.add(s);
    g.add(smoke(0.22, 0.98, -0.2));
    // önünde ekmek sepeti tezgâhı
    g.add(box(0.36, 0.14, 0.14, C.woodLight, 0.18, 0.07, 0.36));
    for (let i = 0; i < 3; i++) { const b = sph(0.04, 0xD9A05A, 0.08 + i * 0.1, 0.16, 0.36, 7); b.scale.set(1.4, 0.8, 1); g.add(b); }
    return g;
  },

  // 12 · Pastane: pembe çatı, çizgili tente, pasta tabelası
  pastane() {
    const g = new THREE.Group();
    const h = house({ w: 0.82, d: 0.6, h: 0.52, wall: 0xFFF1F2, roof: C.roofPink, windows: 2, roofType: 'hip' });
    h.position.set(0, 0, -0.1);
    g.add(h);
    const a = awning(0.82, '#E0626A', '#FFFFFF'); a.position.set(0, 0.46, 0.3); g.add(a);
    const s = sign('🍰', 0.2, '#FFE3EA'); s.position.set(0, 0.78, 0.22); g.add(s);
    // önünde küçük masa ve şemsiye
    g.add(cyl(0.1, 0.1, 0.02, C.white, 0.32, 0.16, 0.38, 10), cyl(0.012, 0.012, 0.16, C.iron, 0.32, 0.08, 0.38, 5));
    g.add(cyl(0.01, 0.01, 0.3, C.iron, 0.32, 0.3, 0.38, 5), cone(0.17, 0.08, 0xF5B8C6, 0.32, 0.46, 0.38, 8));
    return g;
  },

  // 14 · Bal Dükkânı: altın sarısı çatı, petek tabela, vitrinde kavanozlar
  baldukkani() {
    const g = new THREE.Group();
    const h = house({ w: 0.84, d: 0.62, h: 0.52, wall: 0xFFF3D6, roof: C.roofGold, windows: 1 });
    h.position.set(0, 0, -0.1);
    g.add(h);
    const s = sign('🍯', 0.24, '#FFE08A'); s.position.set(0, 0.62, 0.22); g.add(s);
    // vitrin rafı ve kavanozlar
    g.add(box(0.5, 0.05, 0.14, C.wood, 0.02, 0.2, 0.34));
    for (let i = 0; i < 5; i++) {
      g.add(cyl(0.035, 0.035, 0.08, mat(C.honey, { transparent: true, opacity: 0.9, roughness: 0.3 }), -0.17 + i * 0.095, 0.265, 0.34, 8));
      g.add(cyl(0.037, 0.037, 0.02, C.woodLight, -0.17 + i * 0.095, 0.315, 0.34, 8));
    }
    // kapı yanında küçük arı figürü
    const bee = sph(0.05, C.honey, 0.34, 0.12, 0.34, 8); bee.scale.set(1.3, 1, 1);
    g.add(bee, box(0.02, 0.1, 0.1, C.ink, 0.34, 0.12, 0.34));
    return g;
  },

  // 13 · Çay Bahçesi: büyük ağacın altında masalar, dallarda fenerler
  caybahcesi() {
    const g = new THREE.Group();
    const t = tree(1.55, 0, -0.15);
    g.add(t);
    const lamps = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const l = sph(0.035, VM.lamp, Math.cos(a) * 0.62, 0.5, -0.1 + Math.sin(a) * 0.5, 6);
      l.castShadow = false;
      lamps.push(l);
      g.add(l);
      g.add(cyl(0.004, 0.004, 0.14, C.ink, l.position.x, 0.6, l.position.z, 3));
    }
    const tables = [[-0.35, 0.3], [0.1, 0.4], [0.42, 0.12]];
    tables.forEach(([x, z]) => {
      g.add(cyl(0.11, 0.11, 0.02, C.white, x, 0.18, z, 10), cyl(0.015, 0.015, 0.18, C.iron, x, 0.09, z, 5));
      g.add(box(0.07, 0.1, 0.07, C.woodLight, x + 0.15, 0.05, z), box(0.07, 0.1, 0.07, C.woodLight, x - 0.15, 0.05, z));
      g.add(cyl(0.018, 0.015, 0.03, 0xB95A42, x + 0.03, 0.205, z, 6)); // çay bardağı
    });
    return g;
  },

  // 47 · Değirmen: beyaz gövde, dönen kırmızı kanatlar
  degirmen() {
    const g = new THREE.Group();
    g.add(cyl(0.2, 0.3, 0.9, C.white, 0, 0.45, 0, 12));
    g.add(cone(0.24, 0.26, C.roofRed, 0, 1.03, 0, 12));
    g.add(box(0.12, 0.2, 0.03, C.wood, 0, 0.1, 0.28));
    g.add(box(0.08, 0.08, 0.03, VM.glass, 0, 0.55, 0.245));
    const hub = new THREE.Group();
    hub.position.set(0, 0.82, 0.27);
    hub.add(cyl(0.04, 0.04, 0.08, C.wood, 0, 0, 0, 8).rotateX(Math.PI / 2));
    for (let i = 0; i < 4; i++) {
      const arm = new THREE.Group();
      arm.rotation.z = (i / 4) * Math.PI * 2;
      arm.add(box(0.03, 0.5, 0.02, C.wood, 0, 0.27, 0.02));
      arm.add(box(0.11, 0.38, 0.01, 0xD9573F, 0.07, 0.31, 0.03));
      hub.add(arm);
    }
    g.add(hub);
    for (let i = 0; i < 3; i++) g.add(box(0.12, 0.1, 0.1, 0xE8DCC0, -0.3 + i * 0.05, 0.05 + (i === 1 ? 0.08 : 0), 0.28)); // un çuvalları
    g.userData.animate = (t) => { hub.rotation.z = t * 0.8; };
    return g;
  }
};


// ---------------------------------------------------------------------------
// Parça kütüphanesi: evin etrafına konan küçük detaylar
// Her biri (x, z) konumuna yerleşen bir grup döndürür.
// ---------------------------------------------------------------------------
const at = (g, x = 0, z = 0, ry = 0) => { g.position.x += x; g.position.z += z; g.rotation.y = ry; return g; };
const grp = (...kids) => { const g = new THREE.Group(); kids.forEach((k) => g.add(k)); return g; };
const X = {
  pots: (n = 3, colors = [0xE0626A, 0xF5D76E, 0xE893A8, 0xFFFFFF]) => grp(...Array.from({ length: n }, (_, i) => pot(i * 0.13, 0, colors[i % colors.length]))),
  bench: () => grp(box(0.3, 0.03, 0.1, C.wood, 0, 0.1, 0), box(0.3, 0.1, 0.02, C.wood, 0, 0.16, -0.05), box(0.02, 0.1, 0.08, C.iron, -0.13, 0.05, 0), box(0.02, 0.1, 0.08, C.iron, 0.13, 0.05, 0)),
  stool: (c = C.woodLight) => grp(cyl(0.05, 0.05, 0.02, c, 0, 0.1, 0, 8), cyl(0.008, 0.008, 0.1, c, 0.03, 0.05, 0, 4), cyl(0.008, 0.008, 0.1, c, -0.03, 0.05, 0, 4)),
  cat: (c) => cat(c),
  bike: (c = 0x3F7FBF) => { const w1 = mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 12), mat(C.iron), -0.08, 0.07, 0); const w2 = mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 12), mat(C.iron), 0.08, 0.07, 0); const fr = box(0.17, 0.015, 0.015, c, 0, 0.1, 0); fr.rotation.z = 0.2; return grp(w1, w2, fr, box(0.015, 0.08, 0.015, c, 0.07, 0.13, 0), box(0.05, 0.012, 0.03, C.ink, -0.04, 0.14, 0)); },
  toolbox: () => grp(box(0.16, 0.08, 0.09, 0xC94A3A, 0, 0.04, 0), box(0.08, 0.02, 0.02, C.iron, 0, 0.09, 0)),
  crates: (fruit = [0xE0626A, 0xF2A33D, 0x7FBF62]) => grp(...fruit.map((f, i) => grp(box(0.11, 0.06, 0.09, C.woodLight, i * 0.12, 0.03, 0), ...[0, 1, 2].map((k) => sph(0.022, f, i * 0.12 - 0.03 + k * 0.03, 0.07, 0, 6))))),
  swing: () => { const t = tree(0.8); const rope1 = cyl(0.003, 0.003, 0.28, C.ink, 0.13, 0.32, -0.03, 3); const rope2 = cyl(0.003, 0.003, 0.28, C.ink, 0.13, 0.32, 0.05, 3); return grp(t, rope1, rope2, box(0.03, 0.015, 0.11, C.wood, 0.13, 0.18, 0.01)); },
  tree: (sc = 0.7, leaf) => tree(sc, 0, 0, leaf),
  pine: (sc = 0.7) => grp(cyl(0.04, 0.05, 0.2, C.trunk, 0, 0.1, 0, 5), cone(0.26 * sc / 0.7, 0.5 * sc / 0.7, 0x3F8A57, 0, 0.42, 0, 6), cone(0.19 * sc / 0.7, 0.36 * sc / 0.7, 0x4F9A66, 0, 0.62, 0, 6)),
  fence: (len = 0.5) => grp(...Array.from({ length: Math.round(len / 0.1) + 1 }, (_, i) => box(0.02, 0.12, 0.02, C.white, -len / 2 + i * 0.1, 0.06, 0)), box(len, 0.018, 0.012, C.white, 0, 0.09, 0), box(len, 0.018, 0.012, C.white, 0, 0.04, 0)),
  bookshelf: () => grp(box(0.2, 0.22, 0.07, C.wood, 0, 0.11, 0), ...[0xC94A3A, 0x3F7FBF, 0x6FA35E, 0xE9B63E, 0x9C7BD6].map((c, i) => box(0.025, 0.07, 0.05, c, -0.07 + i * 0.035, 0.16, 0.01)), ...[0xE893A8, 0x4A3A22, 0xF5D76E].map((c, i) => box(0.03, 0.06, 0.05, c, -0.05 + i * 0.05, 0.07, 0.01))),
  table: (c = C.white) => grp(cyl(0.09, 0.09, 0.02, c, 0, 0.16, 0, 10), cyl(0.012, 0.012, 0.16, C.iron, 0, 0.08, 0, 5)),
  easel: () => { const l1 = box(0.015, 0.34, 0.015, C.wood, -0.05, 0.16, 0); l1.rotation.z = 0.15; const l2 = box(0.015, 0.34, 0.015, C.wood, 0.05, 0.16, 0); l2.rotation.z = -0.15; const cv = box(0.16, 0.13, 0.015, 0xF6F1E7, 0, 0.24, 0.02); return grp(l1, l2, cv, box(0.1, 0.05, 0.016, 0x7FBF62, 0, 0.21, 0.025), sph(0.02, 0xF2B33D, 0.04, 0.27, 0.03, 6)); },
  flagpole: (c = 0xE0262A) => grp(cyl(0.01, 0.01, 0.7, C.white, 0, 0.35, 0, 5), box(0.16, 0.1, 0.01, c, 0.08, 0.62, 0)),
  kazan: () => grp(cyl(0.09, 0.07, 0.1, 0x3A3A3A, 0, 0.1, 0, 10), sph(0.05, 0xE9822E, 0, 0.03, 0, 6), cyl(0.09, 0.09, 0.005, 0xC9763A, 0, 0.15, 0, 10)),
  telescope: () => { const tube = cyl(0.025, 0.035, 0.22, 0x3F4E78, 0, 0.13, 0, 8); tube.rotation.z = -0.8; return grp(tube, cyl(0.006, 0.006, 0.12, C.iron, 0, 0.06, 0, 4)); },
  vines: (w = 0.7, d = 0.5) => grp(...Array.from({ length: 9 }, (_, i) => sph(0.06, i % 2 ? C.leaf : C.leafLight, (Math.sin(i * 7) * w) / 2, 0, (Math.cos(i * 5) * d) / 2, 5))),
  kilims: () => grp(box(0.14, 0.2, 0.01, 0xC94A3A, -0.09, 0, 0), box(0.14, 0.2, 0.01, 0x3F7FBF, 0.08, 0, 0), box(0.14, 0.03, 0.012, 0xF5D76E, -0.09, -0.04, 0), box(0.14, 0.03, 0.012, 0xF6F1E7, 0.08, 0.04, 0)),
  tractor: () => grp(box(0.2, 0.1, 0.12, 0xC94A3A, 0, 0.1, 0), box(0.08, 0.1, 0.1, 0xC94A3A, -0.05, 0.19, 0), mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 12), mat(C.iron), -0.06, 0.07, 0.07).rotateX(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 12), mat(C.iron), -0.06, 0.07, -0.07).rotateX(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), mat(C.iron), 0.08, 0.04, 0.07).rotateX(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), mat(C.iron), 0.08, 0.04, -0.07).rotateX(Math.PI / 2)),
  hay: () => grp(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 10), mat(0xE8C86A), 0, 0.08, 0).rotateZ(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 10), mat(0xDDBB5A), 0.1, 0.08, 0.12).rotateZ(Math.PI / 2)),
  clock: (r = 0.1) => grp(mesh(new THREE.CylinderGeometry(r, r, 0.02, 16), VM.lamp).rotateX(Math.PI / 2), box(0.01, r * 0.8, 0.012, C.ink, 0, r * 0.3, 0.012), box(r * 0.6, 0.01, 0.012, C.ink, r * 0.25, 0, 0.012)),
  barberpole: () => grp(cyl(0.025, 0.025, 0.24, 0xF6F1E7, 0, 0.12, 0, 8), ...[0.05, 0.12, 0.19].map((y) => cyl(0.027, 0.027, 0.025, 0xE0262A, 0, y, 0, 8)), sph(0.03, C.honey, 0, 0.26, 0, 6)),
  logs: () => grp(...[[0, 0.04], [0.09, 0.04], [0.045, 0.1]].map(([x, y]) => mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.26, 7), mat(0x9A6A3A), x, y, 0).rotateX(Math.PI / 2)), cyl(0.07, 0.08, 0.1, 0x8A5A34, 0.26, 0.05, 0.05, 8), box(0.015, 0.14, 0.015, C.wood, 0.26, 0.15, 0.05), box(0.06, 0.04, 0.012, 0xB0B0B0, 0.28, 0.2, 0.05)),
  well: () => grp(cyl(0.12, 0.13, 0.14, C.stone, 0, 0.07, 0, 10), box(0.02, 0.26, 0.02, C.wood, -0.11, 0.2, 0), box(0.02, 0.26, 0.02, C.wood, 0.11, 0.2, 0), gableRoof(0.28, 0.2, 0.09, C.roofRed).translateY(0.32)),
  coop: () => grp(box(0.26, 0.16, 0.18, 0xC9A06A, 0, 0.1, 0), gableRoof(0.26, 0.18, 0.1, C.roofRed).translateY(0.18), ...[[0.22, 0.1], [0.3, -0.05], [0.18, -0.12]].map(([x, z]) => grp(sph(0.03, C.white, x, 0.04, z, 6), sph(0.018, C.white, x + 0.03, 0.07, z, 6), cone(0.008, 0.016, 0xF2A33D, x + 0.05, 0.07, z, 4).rotateZ(-Math.PI / 2)))),
  tent: (c = 0xE8DCC0) => grp(cyl(0.02, 0.26, 0.3, c, 0, 0.15, 0, 8), box(0.08, 0.12, 0.01, 0x8A5A34, 0, 0.06, 0.24), box(0.24, 0.02, 0.01, 0xC94A3A, 0, 0.12, 0.2)),
  caravan: () => grp(box(0.34, 0.16, 0.18, 0xEFE6D2, 0, 0.13, 0), box(0.34, 0.04, 0.185, 0x6FA3D9, 0, 0.12, 0), box(0.08, 0.05, 0.01, VM.glass, 0.08, 0.17, 0.095), mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), mat(C.iron), 0, 0.04, 0.09).rotateX(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), mat(C.iron), 0, 0.04, -0.09).rotateX(Math.PI / 2)),
  buckets: () => grp(cyl(0.035, 0.028, 0.07, 0x9AA0A6, 0, 0.035, 0, 8), cyl(0.035, 0.028, 0.07, 0xC94A3A, 0.08, 0.035, 0.02, 8), box(0.02, 0.12, 0.02, C.wood, 0.16, 0.06, 0), box(0.07, 0.015, 0.012, 0xB0B0B0, 0.16, 0.12, 0)),
  chalk: () => grp(X.bike(0xE893A8), at(X.bike(0x6FA3D9), 0, 0.12)),
  treehouse: () => { const t = tree(1.1); return grp(t, box(0.24, 0.16, 0.2, 0xC9A06A, 0.05, 0.62, 0.05), gableRoof(0.24, 0.2, 0.1, C.roofRed).translateY(0.7).translateX(0.05).translateZ(0.05), ...[0.15, 0.3, 0.45].map((y) => box(0.08, 0.012, 0.012, C.wood, 0.2, y, 0.15))); },
  simit: () => grp(box(0.2, 0.14, 0.12, 0xE0626A, 0, 0.07, 0), box(0.22, 0.02, 0.14, C.white, 0, 0.15, 0), ...[-0.06, 0, 0.06].map((x) => mesh(new THREE.TorusGeometry(0.025, 0.01, 5, 10), mat(0xC98A4A), x, 0.18, 0).rotateX(Math.PI / 2)), mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 10), mat(C.iron), -0.07, 0.035, 0.07).rotateX(Math.PI / 2), mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 10), mat(C.iron), 0.07, 0.035, 0.07).rotateX(Math.PI / 2)),
  stage: () => grp(box(0.36, 0.05, 0.24, C.woodLight, 0, 0.025, 0), box(0.02, 0.26, 0.02, C.wood, -0.17, 0.15, -0.11), box(0.02, 0.26, 0.02, C.wood, 0.17, 0.15, -0.11), box(0.36, 0.05, 0.02, 0xC94A3A, 0, 0.27, -0.11)),
  microscope: () => grp(X.table(0xEDE7DA), box(0.03, 0.02, 0.05, C.iron, 0.02, 0.18, 0), mesh(new THREE.CylinderGeometry(0.01, 0.012, 0.07, 6), mat(C.iron), 0.02, 0.22, 0).rotateZ(0.3), box(0.06, 0.005, 0.045, 0xF6F1E7, -0.04, 0.175, 0.01)),
  antenna: () => grp(cyl(0.006, 0.006, 0.26, C.iron, 0, 0.13, 0, 4), box(0.16, 0.008, 0.008, C.iron, 0, 0.2, 0), box(0.11, 0.008, 0.008, C.iron, 0, 0.24, 0)),
  papers: () => grp(box(0.12, 0.05, 0.09, 0xF1ECDF, 0, 0.025, 0), box(0.12, 0.04, 0.09, 0xE6E0D0, 0.02, 0.07, 0.01), box(0.1, 0.03, 0.08, 0xF6F1E7, 0.14, 0.015, 0.04)),
  anchor: () => grp(box(0.02, 0.2, 0.02, 0x4A4F57, 0, 0.1, 0), box(0.1, 0.02, 0.02, 0x4A4F57, 0, 0.17, 0), mesh(new THREE.TorusGeometry(0.06, 0.012, 5, 10, Math.PI), mat(0x4A4F57), 0, 0.04, 0).rotateZ(Math.PI)),
  pottery: () => grp(cyl(0.08, 0.09, 0.08, 0x8A5A34, 0, 0.04, 0, 10), cyl(0.04, 0.03, 0.05, 0xC98A5A, 0, 0.1, 0, 8), ...[0xC98A5A, 0x6FA3D9, 0xE0A06A, 0x9C7BD6].map((c, i) => cyl(0.03, 0.04, 0.09 + (i % 2) * 0.03, c, 0.14 + i * 0.07, 0.05, 0.02, 8))),
  milkcans: () => grp(...[0, 0.08, 0.04].map((x, i) => cyl(0.03, 0.035, 0.12, 0xC9CED6, x, 0.06, i === 2 ? 0.07 : 0, 8)), ...[0, 0.08].map((x) => cyl(0.018, 0.018, 0.02, 0xA9AEB6, x, 0.13, 0, 8))),
  pump: () => grp(cyl(0.02, 0.03, 0.2, 0x3F7FBF, 0, 0.1, 0, 8), box(0.1, 0.012, 0.012, C.iron, 0.04, 0.2, 0)),
  rod: () => { const r = cyl(0.005, 0.007, 0.4, C.wood, 0, 0.18, 0, 4); r.rotation.z = 0.5; return grp(r, cyl(0.002, 0.002, 0.2, 0xDDDDDD, 0.12, 0.2, 0, 3)); },
  jars: (cols = [0xE0626A, 0xF2A33D, 0x9C7BD6, 0x7FBF62]) => grp(...cols.map((c, i) => grp(cyl(0.03, 0.03, 0.06, mat(c, { transparent: true, opacity: 0.85 }), i * 0.07, 0.03, 0, 8), cyl(0.032, 0.032, 0.015, 0xF6F1E7, i * 0.07, 0.068, 0, 8)))),
  saz: () => { const b = sph(0.05, 0x9A6A3A, 0, 0, 0, 8); b.scale.set(1, 1.3, 0.4); const n = box(0.015, 0.2, 0.012, C.woodDark, 0, 0.14, 0); return grp(b, n); },
  typewriter: () => grp(X.table(), box(0.09, 0.03, 0.07, 0x3A3A3A, 0, 0.19, 0), box(0.06, 0.04, 0.005, 0xF6F1E7, 0, 0.22, -0.02), box(0.14, 0.05, 0.1, 0xC94A3A, 0.16, 0.025, 0.05), box(0.14, 0.04, 0.1, 0x3F7FBF, 0.16, 0.07, 0.05)),
  sundial: () => grp(cyl(0.08, 0.09, 0.08, C.stone, 0, 0.04, 0, 10), cyl(0.09, 0.09, 0.01, 0xE8E0CC, 0, 0.085, 0, 12), box(0.005, 0.05, 0.06, C.iron, 0, 0.11, 0)),
  bee: () => { const b = sph(0.05, C.honey, 0, 0.1, 0, 8); b.scale.set(1.3, 1, 1); return grp(b, box(0.02, 0.1, 0.1, C.ink, 0, 0.1, 0), sph(0.03, 0xFFFFFF, -0.02, 0.15, 0.04, 6), sph(0.03, 0xFFFFFF, -0.02, 0.15, -0.04, 6)); },
  hives: () => grp(...[0, 0.16].map((x) => grp(box(0.11, 0.1, 0.11, [0x9CC3E0, 0xE8C86A][x ? 1 : 0], x, 0.05, 0), box(0.13, 0.02, 0.13, C.white, x, 0.11, 0)))),
  garden: () => grp(box(0.34, 0.03, 0.2, 0x6B4428, 0, 0.015, 0), ...Array.from({ length: 6 }, (_, i) => sph(0.03, i % 2 ? 0x7FBF62 : 0x5FA24E, -0.12 + (i % 3) * 0.12, 0.05, i < 3 ? -0.05 : 0.05, 5))),
  greenhouse: (w = 0.3, d = 0.2) => grp(box(w, 0.16, d, mat(0xCFEBEF, { transparent: true, opacity: 0.55, roughness: 0.2 }), 0, 0.08, 0), gableRoof(w, d, 0.08, mat(0xCFEBEF, { transparent: true, opacity: 0.55, roughness: 0.2 })).translateY(0.16), ...Array.from({ length: 4 }, (_, i) => sph(0.035, C.leafLight, -w / 2 + 0.05 + i * (w - 0.1) / 3, 0.05, 0, 5))),
  sign: (t, bg, fg) => sign(t, 0.2, bg, fg),
  awning: (a, b, w = 0.7) => awning(w, a, b),
  smoke: () => smoke(0, 0, 0),
  lantern: () => grp(cyl(0.012, 0.015, 0.32, C.iron, 0, 0.16, 0, 5), box(0.06, 0.07, 0.06, VM.lamp, 0, 0.35, 0), cone(0.05, 0.04, C.iron, 0, 0.4, 0, 4)),
  scarecrow: () => grp(box(0.015, 0.34, 0.015, C.wood, 0, 0.17, 0), box(0.22, 0.015, 0.015, C.wood, 0, 0.26, 0), box(0.1, 0.12, 0.05, 0x3F7FBF, 0, 0.23, 0), sph(0.04, 0xE8C86A, 0, 0.34, 0, 6), cone(0.06, 0.04, 0x8A5A34, 0, 0.38, 0, 8)),
  dog: () => grp(box(0.12, 0.06, 0.05, 0xB98A5A, 0, 0.06, 0), sph(0.035, 0xB98A5A, 0.07, 0.1, 0, 6), box(0.02, 0.05, 0.02, 0xB98A5A, -0.05, 0.02, 0.015), box(0.02, 0.05, 0.02, 0xB98A5A, 0.04, 0.02, 0.015), grp(box(0.16, 0.12, 0.14, 0xC94A3A, -0.2, 0.06, 0), gableRoof(0.16, 0.14, 0.06, C.roofNavy).translateY(0.12).translateX(-0.2)))
};

// Ev + detaylar fabrikası: opts ev ayarları, extras [[parça, x, z, dönüş], ...]
function H(opts, extras = [], housePos = [-0.05, -0.12]) {
  return () => {
    const g = new THREE.Group();
    const h = house(opts);
    h.position.set(housePos[0], 0, housePos[1]);
    g.add(h);
    const top = h.userData.top;
    for (const [part, x = 0, z = 0, ry = 0, y = 0] of extras) {
      const p = typeof part === 'function' ? part({ top, h: opts.h || 0.52, w: opts.w || 0.8, d: opts.d || 0.62, hx: housePos[0], hz: housePos[1] }) : part;
      p.position.x += x; p.position.z += z; p.position.y += y; p.rotation.y += ry;
      g.add(p);
    }
    return g;
  };
}
// Evin ön cephesine / çatısına göre konumlar
const onRoof = (part) => ({ top, hx, hz }) => { const p = part(); p.position.set(hx, top - 0.04, hz); return p; };
const onFront = (part, dx = 0, y = 0.3) => ({ d, hx, hz }) => { const p = part(); p.position.set(hx + dx, y, hz + d / 2 + 0.02); return p; };
const shopSign = (emoji, bg) => onFront(() => sign(emoji, 0.2, bg), 0, 0.62);
const shopAwning = (a, b) => ({ d, hx, hz, w }) => { const p = awning(w + 0.04, a, b); p.position.set(hx, 0.46, hz + d / 2 + 0.07); return p; };

// ---------------------------------------------------------------------------
// Özel binalar
// ---------------------------------------------------------------------------
function tower({ r = 0.2, h = 1.1, body = C.stone, roof = C.roofRed, roofH = 0.3, seg = 8 }) {
  const g = new THREE.Group();
  g.add(cyl(r, r * 1.12, h, body, 0, h / 2, 0, seg), cone(r * 1.3, roofH, roof, 0, h + roofH / 2, 0, seg));
  g.add(box(0.1, 0.18, 0.03, C.wood, 0, 0.09, r * 1.1));
  return g;
}

Object.assign(BUILDERS, {
  // 2 · Mehmet Usta: lacivert düz çatı, alet sandığı, eski bisiklet
  2: H({ roof: C.roofNavy, roofType: 'flat', wall: 0xE8E2D2 }, [[X.toolbox(), 0.2, 0.34], [X.bike(0x8A7A5E), -0.3, 0.34, 0.3]]),
  // 3 · Küçük Elif: sarı çatı, ağaçta salıncak
  3: H({ roof: 0xF2C94C, wall: 0xFFF6E6, shutters: 0x6FA3D9, w: 0.7 }, [[X.swing(), 0.42, 0.22], [X.pots(2), -0.36, 0.3]], [-0.12, -0.14]),
  // 4 · Hacer Nine: yosunlu taş ev, tabure ve uyuklayan kedi
  4: H({ wall: C.stone, roof: 0x7A8A5A, w: 0.72, chimney: C.stoneDark }, [[X.stool(), 0.2, 0.32], [(() => { const c = cat(0x3A3A3A); c.scale.setScalar(1.1); return c; })(), 0.35, 0.3, 2], [X.vines(0.5, 0.3), -0.25, -0.35, 0, 0.1]]),
  // 5 · Muhtar Rıza: iki katlı büyük ev, balkon, tabela
  5: H({ h: 0.78, w: 0.86, wall: 0xF1E3C8, roof: C.roofRed, shutters: 0x8A5A34, chimney: true }, [[onFront(() => box(0.5, 0.03, 0.12, C.wood), 0, 0.5)], [onFront(() => box(0.5, 0.08, 0.01, C.white), 0, 0.56)], [onFront(() => sign('🏛️', 0.13), 0.28, 0.3)], [X.flagpole(), 0.45, 0.3]]),
  // 6 · Bakkal: yeşil çizgili tente, meyve kasaları
  6: H({ wall: 0xFFF6E0, roof: C.roofGreen }, [[shopAwning('#4F9A5A', '#FFFFFF')], [shopSign('🛒', '#E6F4E0')], [X.crates(), -0.17, 0.4]]),
  // 7 · Kasabalı Cem: modern beyaz, düz çatı, geniş cam
  7: H({ wall: 0xFAFAFA, roof: 0x5A6470, roofType: 'flat', windows: 0 }, [[onFront(() => box(0.48, 0.26, 0.02, VM.glass), 0.12, 0.3)], [X.pots(2, [0x7FBF62, 0x7FBF62]), -0.4, 0.28]]),
  // 10 · Öğretmen Selin: pastel yeşil, kitap rafı ve masa
  10: H({ wall: 0xDCEFD6, roof: C.roofRed, shutters: C.white }, [[X.bookshelf(), 0.28, 0.33], [X.table(), -0.25, 0.36]]),
  // 11 · Doktor Aslı: beyaz ev, yeşil panjur, doktor çantası
  11: H({ wall: C.white, roof: 0x9A6A4A, shutters: 0x4F9A5A }, [[grp(box(0.1, 0.07, 0.06, 0x3A2A1A, 0, 0.035, 0), box(0.04, 0.02, 0.01, C.honey, 0, 0.05, 0.031)), 0.12, 0.34], [X.pots(2, [0xFFFFFF, 0xE893A8]), -0.35, 0.3]]),
  // 15 · Postane: kırmızı çatı, sarı posta kutusu
  15: H({ wall: 0xF6EEDC, roof: 0xC94A3A, w: 0.86 }, [[grp(cyl(0.012, 0.012, 0.16, C.iron, 0, 0.08, 0, 5), box(0.1, 0.1, 0.08, 0xF2C94C, 0, 0.2, 0), box(0.06, 0.012, 0.01, C.ink, 0, 0.21, 0.041)), 0.34, 0.34], [shopSign('✉️', '#FFF1C7')], [X.flagpole(0xE0262A), -0.45, 0.2]]),
  // 16 · Arıcı Hasan: ahşap kulübe, eski kovanlar
  16: H({ wall: C.woodLight, roof: C.woodDark, w: 0.68, windows: 1 }, [[X.hives(), 0.12, 0.34], [X.bee(), -0.3, 0.34]]),
  // 17 · Ressam Deniz: mor kapı, şövale
  17: H({ wall: 0xF6F1E7, roof: 0x7A6FB0, door: 0x9C7BD6 }, [[X.easel(), 0.3, 0.32, -0.4], [X.pots(2, [0x9C7BD6, 0xE893A8]), -0.35, 0.3]]),
  // 18 · Muhtarlık: taş bina, saat, duyuru panosu
  18: H({ wall: C.stone, roof: 0x8A6F5A, w: 0.9, h: 0.6 }, [[onFront(() => X.clock(0.09), 0, 0.5)], [grp(box(0.2, 0.14, 0.02, C.woodLight, 0, 0.2, 0), box(0.02, 0.2, 0.02, C.wood, -0.09, 0.1, 0), box(0.02, 0.2, 0.02, C.wood, 0.09, 0.1, 0), box(0.06, 0.05, 0.005, 0xF6F1E7, -0.04, 0.22, 0.012), box(0.05, 0.06, 0.005, 0xF5D76E, 0.05, 0.19, 0.012)), 0.3, 0.38], [X.flagpole(), -0.45, 0.25]]),
  // 19 · Kahveci: kahverengi tente, bank, fincan tabelası
  19: H({ wall: 0xF3E4C4, roof: 0x6E4526 }, [[shopAwning('#8A5A34', '#F3E4C4')], [shopSign('☕', '#F3E4C4')], [X.bench(), -0.2, 0.42]]),
  // 20 · Değirmenci Osman: kiremit çatı, un çuvalları
  20: H({ wall: 0xEFE6D2, roof: C.roofRed, chimney: true }, [[grp(...[0, 0.1, 0.05].map((x, i) => box(0.09, 0.1, 0.08, 0xE8DCC0, x, 0.05 + (i === 2 ? 0.08 : 0), 0))), 0.2, 0.36]]),
  // 21 · Çoban Yusuf: küçük ahır ve çitli ağıl
  21: H({ wall: 0xB95A42, roof: 0x8A6F5A, w: 0.6, windows: 1 }, [[X.fence(0.5), 0.1, 0.42], [grp(box(0.1, 0.06, 0.06, 0xF2F2F2, 0, 0.06, 0), sph(0.03, 0x3A3A3A, 0.06, 0.08, 0, 6)), 0.25, 0.28]], [-0.15, -0.15]),
  // 22 · Okul: sarı bina, çan kulesi, bayrak direği
  22: H({ wall: 0xF5D76E, roof: C.roofRed, w: 0.92, h: 0.56 }, [[onRoof(() => grp(box(0.12, 0.14, 0.12, C.white, 0, 0.07, 0), cone(0.1, 0.12, C.roofRed, 0, 0.2, 0, 4), sph(0.03, C.honey, 0, 0.07, 0.061, 6)))], [X.flagpole(), 0.45, 0.3]]),
  // 23 · Terzi Gülsüm: pembe panjur, vitrinde kumaş topları
  23: H({ wall: 0xFFF6F2, roof: 0xB95A42, shutters: 0xE893A8 }, [[grp(...[0xC94A3A, 0x6FA3D9, 0xF5D76E, 0x9C7BD6].map((c, i) => mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 8), mat(c), i * 0.07, 0.03, 0).rotateZ(Math.PI / 2))), -0.1, 0.36]]),
  // 24 · Postacı Murat: turuncu çatı, posta bisikleti
  24: H({ wall: 0xF6F1E7, roof: 0xE9822E }, [[grp(X.bike(0xF2C94C), box(0.08, 0.06, 0.06, 0x8A5A34, 0.1, 0.16, 0)), 0.25, 0.36, -0.3]]),
  // 25 · Çiçekçi: saksı rafları, çiçekli tabela
  25: H({ wall: 0xFFF6F2, roof: 0x6FA35E }, [[shopSign('💐', '#FDE8EE')], [grp(box(0.5, 0.03, 0.12, C.wood, 0, 0.12, 0), box(0.5, 0.03, 0.12, C.wood, 0, 0.02, 0.06)), 0, 0.38], [X.pots(4), -0.2, 0.38, 0, 0.12], [X.pots(4, [0xF5D76E, 0x9C7BD6, 0xFFFFFF, 0xE0626A]), -0.2, 0.44]]),
  // 26 · Marangoz İsmail: kütük yığını, testere tezgâhı
  26: H({ wall: C.woodLight, roof: 0x6E4526 }, [[X.logs(), -0.3, 0.34], [grp(box(0.2, 0.1, 0.1, C.wood, 0, 0.05, 0), mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.005, 12), mat(0xB0B0B0), 0, 0.11, 0)), 0.25, 0.36]]),
  // 27 · Bahçıvan Zehra: evin yanında cam sera
  27: H({ wall: 0xFFF6E6, roof: 0x7A8A5A, w: 0.62, windows: 1 }, [[X.greenhouse(0.3, 0.26), 0.36, 0.05, Math.PI / 2], [X.garden(), -0.15, 0.36]], [-0.2, -0.12]),
  // 28 · Kütüphane: kubbeli çatı, kolonlu giriş
  28: () => {
    const g = new THREE.Group();
    g.add(box(0.8, 0.5, 0.6, 0xEDE4D0, 0, 0.25, -0.1));
    const dome = sph(0.3, 0x6F9A8A, 0, 0.5, -0.1, 12); dome.scale.set(1, 0.7, 1); g.add(dome);
    for (let i = 0; i < 4; i++) g.add(cyl(0.03, 0.035, 0.44, C.white, -0.27 + i * 0.18, 0.22, 0.26, 8));
    g.add(box(0.72, 0.06, 0.14, C.white, 0, 0.47, 0.25), box(0.14, 0.26, 0.03, C.wood, 0, 0.13, 0.205), box(0.12, 0.1, 0.03, VM.glass, -0.25, 0.3, 0.205), box(0.12, 0.1, 0.03, VM.glass, 0.25, 0.3, 0.205));
    return g;
  },
  // 29 · Hemşire Canan: açık mavi ev, papatya saksısı
  29: H({ wall: 0xDDEBF5, roof: 0x6F8FB0, shutters: C.white }, [[onFront(() => X.pots(2, [0xFFFFFF, 0xFFFFFF]), -0.3, 0.26)], [X.bench(), 0.28, 0.38]]),
  // 30 · Mumcu: vitrinde yanan mumlar
  30: H({ wall: 0xF3E4C4, roof: 0x8E3B2A }, [[shopSign('🕯️', '#FFF1C7')], [grp(box(0.44, 0.04, 0.12, C.wood, 0, 0.14, 0), ...[-0.15, -0.05, 0.05, 0.15].map((x, i) => grp(cyl(0.022, 0.022, 0.08 + (i % 2) * 0.04, 0xF6F1E7, x, 0.2 + (i % 2) * 0.02, 0, 8), sph(0.015, VM.lamp, x, 0.26 + (i % 2) * 0.04, 0, 6)))), 0, 0.38]]),
  // 31 · Kaptan Rüstem: lacivert çatı, çapa, çatıda dürbün
  31: H({ wall: C.white, roof: C.roofNavy }, [[X.anchor(), 0.3, 0.36], [onRoof(() => X.telescope())], [X.rod(), -0.35, 0.34]]),
  // 32 · Müzisyen Efe: balkonda saz
  32: H({ h: 0.7, wall: 0xF6EEDC, roof: C.roofRed }, [[onFront(() => box(0.4, 0.03, 0.12, C.wood), 0, 0.45)], [onFront(() => X.saz(), 0.14, 0.58)], [X.stool(), -0.3, 0.34]]),
  // 33 · Meydan Çeşmesi: taş havuzlu, üç lüleli
  33: () => {
    const g = new THREE.Group();
    g.add(cyl(0.45, 0.48, 0.14, C.stone, 0, 0.07, 0, 12), cyl(0.4, 0.4, 0.02, mat(0x7FC8E0, { roughness: 0.2 }), 0, 0.14, 0, 12));
    g.add(cyl(0.08, 0.1, 0.4, C.stone, 0, 0.3, 0, 8), cyl(0.2, 0.12, 0.06, C.stone, 0, 0.52, 0, 10), cyl(0.05, 0.07, 0.14, C.stone, 0, 0.62, 0, 8), sph(0.06, C.stone, 0, 0.72, 0, 8));
    for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; g.add(cyl(0.012, 0.012, 0.1, C.iron, Math.cos(a) * 0.14, 0.5, Math.sin(a) * 0.14, 5).rotateZ(0.8)); }
    for (let i = 0; i < 4; i++) g.add(at(X.pots(1, [[0xE0626A, 0xF5D76E, 0xFFFFFF, 0xE893A8][i]]), Math.cos(i * 1.57 + 0.78) * 0.62, Math.sin(i * 1.57 + 0.78) * 0.62));
    return g;
  },
  // 34 · Veteriner Kliniği: yeşil haç tabelası, küçük bahçe
  34: H({ wall: C.white, roof: 0x6FA35E }, [[shopSign('🐾', '#E6F4E0')], [X.fence(0.4), 0.2, 0.42], [X.dog(), -0.25, 0.35, 0.3]]),
  // 35 · Aşçı Fatma: bahçede kazan ve odun ateşi
  35: H({ wall: 0xFFF1DA, roof: C.roofRed, chimney: true }, [[X.kazan(), 0.3, 0.35], [X.logs(), -0.35, 0.36]]),
  // 36 · Fotoğrafçı Can: mor çatı, pencerede fotoğraflar
  36: H({ wall: 0xF6F1E7, roof: 0x7A5FA8 }, [[onFront(() => grp(box(0.07, 0.09, 0.01, 0xF6F1E7, -0.05, 0, 0), box(0.07, 0.09, 0.01, 0xF6F1E7, 0.05, 0.02, 0), box(0.05, 0.05, 0.012, 0x6FA3D9, -0.05, 0.01, 0), box(0.05, 0.05, 0.012, 0xE9B63E, 0.05, 0.03, 0)), 0.26, 0.2)], [grp(box(0.06, 0.05, 0.05, 0x3A3A3A, 0, 0.3, 0), cyl(0.018, 0.018, 0.03, 0x3A3A3A, 0, 0.3, 0.035, 8).rotateX(Math.PI / 2), ...[-0.03, 0.03].map((x) => box(0.01, 0.28, 0.01, C.iron, x, 0.14, 0))), 0.34, 0.36]]),
  // 37 · Dondurmacı: açık mavi tente, dev külah maketi
  37: H({ wall: 0xFFF6F2, roof: 0x6FA3D9 }, [[shopAwning('#8FC8EC', '#FFFFFF')], [shopSign('🍦', '#E6F2FB')], [grp(cone(0.06, 0.18, 0xE0A65A, 0, 0.09, 0, 8).rotateX(Math.PI), sph(0.07, 0xF5B8C6, 0, 0.2, 0, 8), sph(0.05, 0xFFF1D6, 0, 0.28, 0, 8)), -0.35, 0.36]]),
  // 38 · Yazar Melike: daktilo, kitap yığını
  38: H({ wall: 0xF3EBD8, roof: 0x5A6470, shutters: 0x8A5A34 }, [[X.typewriter(), 0.22, 0.36]]),
  // 39 · Bisikletçi Tolga: duvara asılı bisikletler, pompa
  39: H({ wall: 0xEDE7DA, roof: 0x3F7FBF, roofType: 'flat' }, [[X.bike(0xE0626A), 0.1, 0.36], [X.bike(0x7FBF62), 0.35, 0.3, 0.4], [X.pump(), -0.3, 0.36]]),
  // 40 · Pazar Yeri: renkli tenteli tezgâhlar
  40: () => {
    const g = new THREE.Group();
    const stall = (c1, c2, x, z, fruit) => { const s = grp(box(0.3, 0.14, 0.18, C.woodLight, 0, 0.07, 0), ...[-0.13, 0.13].map((dx) => box(0.02, 0.36, 0.02, C.wood, dx, 0.18, -0.08)), at(awning(0.34, c1, c2), 0, 0.02), X.crates(fruit)); s.children[s.children.length - 1].position.set(-0.12, 0.14, 0); s.children[s.children.length - 2].position.set(0, 0.34, 0.02); s.position.set(x, 0, z); return s; };
    g.add(stall('#E0626A', '#FFFFFF', -0.3, -0.25, [0xE0626A, 0xF2A33D, 0x7FBF62]), stall('#4F9A5A', '#FFFFFF', 0.3, -0.25, [0x7FBF62, 0x9C7BD6, 0xF5D76E]), stall('#E9B63E', '#FFFFFF', 0, 0.28, [0xF2A33D, 0xE0626A, 0xF5D76E]));
    return g;
  },
  // 41 · Seramikçi Nazlı: çömlek çarkı, vazolar
  41: H({ wall: 0xF6E6D8, roof: 0xC9763A }, [[X.pottery(), -0.3, 0.36]]),
  // 42 · Genç Balıkçı Kerem: küçük mavi kulübe, olta
  42: H({ w: 0.6, d: 0.5, h: 0.42, wall: 0xDDEBF5, roof: C.roofBlue, windows: 1 }, [[X.rod(), 0.3, 0.3], [X.buckets(), -0.3, 0.3]], [-0.1, -0.15]),
  // 43 · Eczacı Burak: yeşil panjur, şifalı bitki kavanozları
  43: H({ wall: 0xF6F1E7, roof: 0x7A6F5A, shutters: 0x4F9A5A }, [[onFront(() => X.jars([0x7FBF62, 0xC9A06A, 0x9C7BD6]), -0.34, 0.27)], [X.garden(), 0.2, 0.38]]),
  // 44 · Eczane: beyaz cephe, yeşil ışıklı tabela
  44: H({ wall: 0xFAFAFA, roof: 0x5A6470, roofType: 'hip' }, [[onFront(() => grp(box(0.18, 0.18, 0.03, VM.lamp, 0, 0, 0), box(0.12, 0.04, 0.035, 0x3FA05A, 0, 0, 0), box(0.04, 0.12, 0.035, 0x3FA05A, 0, 0, 0)), 0, 0.64)], [X.bench(), -0.2, 0.42]]),
  // 45 · Sütçü Hatice: süt güğümleri
  45: H({ wall: 0xFFF6E6, roof: C.roofRed }, [[X.milkcans(), 0.25, 0.36], [(() => { const c = cat(0xF2F2F2); return c; })(), -0.3, 0.36, 1]]),
  // 46 · Dokumacı Sevim: balkondan sarkan kilimler
  46: H({ h: 0.72, wall: 0xF1E3C8, roof: 0x9A4A3A }, [[onFront(() => box(0.5, 0.03, 0.12, C.wood), 0, 0.45)], [onFront(() => X.kilims(), 0, 0.34)]]),
  // 48 · Çiftçi Recep: traktör ve saman balyaları
  48: H({ wall: 0xEFE6D2, roof: 0xB95A42 }, [[X.tractor(), 0.28, 0.36, -0.3], [X.hay(), -0.35, 0.3], [X.scarecrow(), -0.45, 0.05]]),
  // 49 · Saatçi Nihat: cephede büyük saat
  49: H({ wall: 0xF3EBD8, roof: 0x5A4A3A }, [[onFront(() => X.clock(0.1), 0, 0.72)], [onFront(() => sign('⌚', 0.12), 0.28, 0.32)]]),
  // 50 · Reçelci: kavanozlar, kırmızı kareli perde
  50: H({ wall: 0xFFF1E6, roof: 0xC94A3A, shutters: 0xE0626A }, [[shopSign('🍓', '#FDE8EE')], [grp(box(0.36, 0.04, 0.12, C.wood, 0, 0.14, 0), at(X.jars([0xC94A3A, 0x9C4AA0, 0xF2A33D, 0xE0626A]), -0.1, 0)), 0, 0.38]]),
  // 51 · Kuaför Şule: pembe tabela, döner direk
  51: H({ wall: 0xFFF1F2, roof: 0x9C7BD6 }, [[shopSign('✂️', '#FDE8EE')], [X.barberpole(), 0.34, 0.34]]),
  // 52 · Oduncu Bayram: yığılı odunlar, kütüğe saplı balta
  52: H({ wall: C.woodLight, roof: 0x5A3A22, w: 0.66 }, [[X.logs(), 0.1, 0.34], [X.pine(0.6), -0.4, 0.3]], [-0.1, -0.14]),
  // 53 · Arıcılar Derneği: petek pencereler, arı figürü
  53: () => {
    const g = new THREE.Group();
    g.add(cyl(0.44, 0.44, 0.5, 0xF3E4C4, 0, 0.25, -0.08, 6), cone(0.52, 0.28, C.roofGold, 0, 0.64, -0.08, 6));
    for (let i = 0; i < 3; i++) g.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 6), VM.glass, -0.14 + i * 0.14, 0.34, 0.32).rotateX(Math.PI / 2));
    g.add(box(0.14, 0.24, 0.03, C.wood, 0, 0.12, 0.33), at(X.bee(), 0.34, 0.34), at(X.hives(), -0.4, 0.3));
    return g;
  },
  // 54 · Botanikçi Defne: sarmaşıkla kaplı çatı
  54: H({ wall: 0xF1EADB, roof: 0x5F7A4A }, [[onRoof(() => X.vines(0.7, 0.5))], [X.garden(), 0.18, 0.38]]),
  // 55 · Kavalcı Mahmut Dede: taş ev, hasır sandalye
  55: H({ wall: C.stone, roof: 0x8A5A34 }, [[grp(box(0.1, 0.02, 0.1, 0xD9C08A, 0, 0.1, 0), box(0.1, 0.12, 0.015, 0xD9C08A, 0, 0.16, -0.05), ...[[-0.04, -0.04], [0.04, -0.04], [-0.04, 0.04], [0.04, 0.04]].map(([x, z]) => box(0.012, 0.1, 0.012, C.wood, x, 0.05, z))), 0.25, 0.36], [X.pots(2), -0.35, 0.32]]),
  // 56 · Kümesçi Emine: kümes ve tavuklar
  56: H({ wall: 0xFFF6E6, roof: C.roofRed, w: 0.66 }, [[X.coop(), 0.22, 0.3, -0.3]], [-0.2, -0.14]),
  // 57 · Marangoz Atölyesi: büyük ahşap kapı, yarım bank
  57: H({ wall: C.woodLight, roof: 0x6E4526, w: 0.9, windows: 1 }, [[onFront(() => box(0.3, 0.34, 0.02, C.woodDark), -0.12, 0.17)], [shopSign('🪚', '#F3E4C4')], [X.bench(), 0.3, 0.42]]),
  // 58 · Gökbilimci Arda: çatıda teleskop
  58: H({ wall: 0xE8EAF2, roof: 0x3E4E78, roofType: 'flat' }, [[onRoof(() => grp(cyl(0.12, 0.12, 0.04, C.white, 0, 0.02, 0, 12), at(X.telescope(), 0, 0)))], [X.bench(), 0.2, 0.42]]),
  // 59 · Ebru Sanatçısı Pelin: rengârenk desenli kapı
  59: H({ wall: 0xF6F1E7, roof: 0x3F7FBF, door: 0xE0626A }, [[onFront(() => grp(sph(0.03, 0x3F7FBF, -0.03, 0, 0, 6), sph(0.025, 0xF2C94C, 0.03, 0.05, 0, 6), sph(0.02, 0x7FBF62, 0.02, -0.05, 0, 6)), 0, 0.15)], [X.easel(), 0.32, 0.34, -0.5]]),
  // 60 · Su Kulesi: ahşap ayaklı depo
  60: () => {
    const g = new THREE.Group();
    for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) g.add(box(0.04, 0.8, 0.04, C.wood, x, 0.4, z));
    g.add(box(0.44, 0.03, 0.03, C.wood, 0, 0.4, 0.2), box(0.44, 0.03, 0.03, C.wood, 0, 0.4, -0.2));
    g.add(cyl(0.3, 0.3, 0.36, 0x9A6A3A, 0, 0.98, 0, 12), cone(0.34, 0.2, C.roofRed, 0, 1.26, 0, 12));
    const lbl = box(0.26, 0.08, 0.02, mat(0xF6F1E7), 0, 0.98, 0.3); g.add(lbl);
    return g;
  },
  // 61 · Gezgin Umut: karavan
  61: H({ wall: 0xF6EEDC, roof: 0x7A8A5A, w: 0.62, windows: 1 }, [[X.caravan(), 0.3, 0.3, -0.4]], [-0.2, -0.15]),
  // 62 · Hırdavatçı Erol: kovalar ve el aletleri
  62: H({ wall: 0xEDE7DA, roof: 0x5A6470 }, [[X.buckets(), 0.2, 0.36], [X.toolbox(), -0.3, 0.36]]),
  // 63 · İkizler Ada ve Ela: iki küçük bisiklet, tebeşir resimleri
  63: H({ wall: 0xFFF6E6, roof: 0xF2C94C, shutters: 0xE893A8 }, [[X.chalk(), 0.25, 0.3, -0.3], [grp(...[0xE0626A, 0x6FA3D9, 0xF2C94C].map((c, i) => box(0.06, 0.004, 0.06, c, i * 0.08, 0.005, (i % 2) * 0.05))), -0.35, 0.36]]),
  // 64 · Saat Kulesi: dört yönde saat, gece ışıklı
  64: () => {
    const g = new THREE.Group();
    g.add(box(0.34, 1.3, 0.34, C.stone, 0, 0.65, 0), box(0.4, 0.06, 0.4, C.stoneDark, 0, 1.3, 0), cone(0.3, 0.36, C.roofNavy, 0, 1.51, 0, 4).rotateY(Math.PI / 4));
    for (let i = 0; i < 4; i++) { const c = X.clock(0.11); c.rotation.y = (i / 4) * Math.PI * 2; const a = (i / 4) * Math.PI * 2; c.position.set(Math.sin(a) * 0.18, 1.08, Math.cos(a) * 0.18); g.add(c); }
    g.add(box(0.12, 0.24, 0.03, C.wood, 0, 0.12, 0.175));
    return g;
  },
  // 65 · Minik Bora: ağaç ev, ip merdiven
  65: H({ wall: 0xFFF6E6, roof: C.roofRed, w: 0.62, windows: 1 }, [[X.treehouse(), 0.3, 0.1]], [-0.25, -0.1]),
  // 66 · Simitçi Hamdi: simit tezgâhı
  66: H({ wall: 0xF6EEDC, roof: 0xB95A42 }, [[X.simit(), 0.25, 0.38]]),
  // 67 · Lokumcu: bordo tente, lokum kutuları
  67: H({ wall: 0xFFF1E6, roof: 0x7A2E3A }, [[shopAwning('#7A2E3A', '#F6D5DC')], [shopSign('🍬', '#FDE8EE')], [grp(...[0xF5B8C6, 0xF6F1E7, 0xF5D76E].map((c, i) => box(0.1, 0.05, 0.08, c, i * 0.12, 0.025, 0))), -0.15, 0.42]]),
  // 68 · Profesör Nevzat: kitaplı pencereler, güneş saati
  68: H({ wall: 0xEDE4D0, roof: 0x5A4A3A, shutters: 0x5A4A3A }, [[X.sundial(), 0.3, 0.38], [X.bookshelf(), -0.32, 0.34]]),
  // 69 · Dans Hocası Irmak: önünde ahşap sahne
  69: H({ wall: 0xFFF1F2, roof: 0xE0626A }, [[X.stage(), 0.18, 0.36]]),
  // 70 · Çalgı Köşkü: altıgen çatılı, fenerli
  70: () => {
    const g = new THREE.Group();
    g.add(cyl(0.44, 0.46, 0.06, C.white, 0, 0.03, 0, 6));
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; g.add(cyl(0.02, 0.02, 0.5, C.white, Math.cos(a) * 0.38, 0.3, Math.sin(a) * 0.38, 6)); g.add(sph(0.03, VM.lamp, Math.cos(a) * 0.38, 0.48, Math.sin(a) * 0.38, 6)); }
    g.add(cone(0.52, 0.28, 0x3F7FBF, 0, 0.69, 0, 6), sph(0.04, C.honey, 0, 0.85, 0, 6));
    g.add(at(X.stool(), 0, 0), at(X.saz(), 0.1, 0.05));
    return g;
  },
  // 71 · Biyolog Sinem: mikroskop masası, not defterleri
  71: H({ wall: 0xF6F1E7, roof: 0x4F9A8A }, [[X.microscope(), 0.25, 0.38], [X.papers(), -0.32, 0.36]]),
  // 73 · Köy Serası: uzun cam sera
  73: () => { const g = new THREE.Group(); g.add(X.greenhouse(0.9, 0.5)); g.children[0].scale.set(1, 1.6, 1); g.add(at(X.pots(4), -0.2, 0.38)); return g; },
  // 74 · Mimar Kaan: asimetrik cam-ahşap modern ev
  74: () => {
    const g = new THREE.Group();
    g.add(box(0.5, 0.5, 0.5, C.woodLight, -0.15, 0.25, -0.1), box(0.4, 0.34, 0.44, 0xFAFAFA, 0.25, 0.17, -0.05));
    g.add(box(0.36, 0.24, 0.02, VM.glass, 0.25, 0.18, 0.18), box(0.2, 0.3, 0.02, VM.glass, -0.2, 0.3, 0.16), box(0.56, 0.05, 0.56, 0x3A3A3A, -0.15, 0.525, -0.1), box(0.44, 0.04, 0.48, 0x3A3A3A, 0.25, 0.36, -0.05));
    g.add(at(X.pots(2, [0x7FBF62, 0x7FBF62]), 0.1, 0.4));
    return g;
  },
  // 75 · Yörük Gülizar: keçe çadır
  75: H({ w: 0.6, wall: 0xEFE6D2, roof: 0x9A4A3A, windows: 1 }, [[X.tent(), 0.3, 0.15], [X.kilims(), -0.35, 0.36, 0, 0.12]], [-0.22, -0.12]),
  // 76 · Fener Kulesi: kırmızı-beyaz çizgili, gece dönen ışık
  76: () => {
    const g = new THREE.Group();
    for (let i = 0; i < 5; i++) g.add(cyl(0.2 - i * 0.015, 0.21 - i * 0.015, 0.24, i % 2 ? C.white : 0xD9573F, 0, 0.12 + i * 0.24, 0, 10));
    g.add(cyl(0.16, 0.16, 0.18, VM.lamp, 0, 1.3, 0, 10), cone(0.2, 0.18, 0xD9573F, 0, 1.48, 0, 10));
    const beam = new THREE.Group();
    const bm = new THREE.MeshBasicMaterial({ color: 0xFFE9A8, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false });
    const b = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.8, 8, 1, true), bm); b.rotation.z = Math.PI / 2; b.position.x = 0.4; beam.add(b);
    beam.position.y = 1.3; g.add(beam);
    g.userData.animate = (t) => { beam.rotation.y = t * 0.9; bm.opacity = 0.05 + VM.glass.emissiveIntensity * 0.2; };
    return g;
  },
  // 77 · Muhabir Bige: gazete yığınları, çatıda anten
  77: H({ wall: 0xF3EBD8, roof: 0x5A6470 }, [[X.papers(), 0.26, 0.38], [onRoof(() => X.antenna())]]),
  // 78 · Bal Müzesi: petek kubbeli bina, dev arı heykeli
  78: () => {
    const g = new THREE.Group();
    g.add(cyl(0.5, 0.52, 0.46, 0xFFF3D6, 0, 0.23, -0.05, 6));
    const dome = sph(0.46, C.roofGold, 0, 0.46, -0.05, 6); dome.scale.set(1, 0.75, 1); g.add(dome);
    g.add(sph(0.06, C.honey, 0, 0.82, -0.05, 6));
    for (let i = 0; i < 4; i++) g.add(cyl(0.03, 0.035, 0.42, C.white, -0.24 + i * 0.16, 0.21, 0.42, 8));
    g.add(box(0.6, 0.05, 0.12, C.white, 0, 0.44, 0.42), box(0.16, 0.28, 0.03, C.wood, 0, 0.14, 0.38));
    const statue = X.bee(); statue.scale.setScalar(2); statue.position.set(0.52, 0.1, 0.3); g.add(statue, cyl(0.08, 0.1, 0.1, C.stone, 0.52, 0.05, 0.3, 8));
    return g;
  }
});

const SAMPLE_MAP = { 1: 'ayse', 8: 'kemal', 72: 'kerim', 9: 'firin', 12: 'pastane', 14: 'baldukkani', 13: 'caybahcesi', 47: 'degirmen' };
for (const [n, k] of Object.entries(SAMPLE_MAP)) BUILDERS[n] = BUILDERS[k];
export const SAMPLE_IDS = Object.values(SAMPLE_MAP);

// Gezgin satıcının tenteli at arabası
export function buildMerchantCart() {
  const g = new THREE.Group();
  g.add(box(0.62, 0.22, 0.4, C.wood, 0, 0.26, 0), box(0.66, 0.04, 0.44, C.woodDark, 0, 0.16, 0));
  for (const [x, z] of [[-0.2, 0.23], [0.2, 0.23], [-0.2, -0.23], [0.2, -0.23]]) {
    g.add(mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 14), mat(C.woodDark), x, 0.11, z));
  }
  const canopy = mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.64, 12, 1, true, 0, Math.PI), new THREE.MeshStandardMaterial({ map: stripeTexture('#7A2E3A', '#F6E6C8'), roughness: 0.8, side: THREE.DoubleSide }), 0, 0.37, 0);
  canopy.rotation.z = Math.PI / 2;
  g.add(canopy);
  for (let i = 0; i < 4; i++) g.add(box(0.1, 0.08, 0.08, [0xE0626A, C.honey, 0x7FBF62, 0x9C7BD6][i], -0.2 + i * 0.13, 0.41, 0.05));
  const s = sign('🛒', 0.18, '#FFF1C7'); s.position.set(0, 0.3, 0.215); g.add(s);
  // at
  const horse = new THREE.Group();
  const body = box(0.3, 0.14, 0.12, 0x8A5A3A, 0, 0.26, 0);
  const neck = box(0.08, 0.16, 0.08, 0x8A5A3A, 0.16, 0.36, 0); neck.rotation.z = -0.5;
  const head = box(0.14, 0.07, 0.07, 0x8A5A3A, 0.24, 0.43, 0);
  horse.add(body, neck, head, box(0.03, 0.06, 0.1, 0x3A2A1A, 0.1, 0.38, 0));
  for (const [x, z] of [[-0.1, 0.04], [0.1, 0.04], [-0.1, -0.04], [0.1, -0.04]]) horse.add(box(0.03, 0.2, 0.03, 0x6E4526, x, 0.1, z));
  horse.position.set(0.52, 0, 0);
  g.add(horse);
  // satıcı
  const man = new THREE.Group();
  man.add(cyl(0.07, 0.08, 0.2, 0x3F7FBF, 0, 0.1, 0, 8), sph(0.06, 0xF2C9A0, 0, 0.25, 0, 8), cyl(0.1, 0.1, 0.015, 0x5A3A22, 0, 0.3, 0, 10), cyl(0.05, 0.06, 0.06, 0x5A3A22, 0, 0.33, 0, 8));
  man.position.set(-0.1, 0, 0.36);
  g.add(man);
  g.userData.animate = (t) => { horse.rotation.z = Math.sin(t * 2) * 0.02; man.position.y = Math.abs(Math.sin(t * 1.5)) * 0.01; };
  return g;
}

export function buildOccupant(id) {
  // 5.5.2: 7 numara artık Çiçekçi Ezgi, 25 numara Kasabalı Cem.
  const visualId = id === 7 ? 25 : id === 25 ? 7 : id;
  const b = BUILDERS[visualId];
  if (!b) return null;
  const g = b();
  // Tüm alt grupların animate fonksiyonlarını tek bir çağrıda topla
  const anims = [];
  g.traverse((o) => { if (o.userData && typeof o.userData.animate === 'function' && o !== g) anims.push(o.userData.animate); });
  const own = g.userData.animate;
  g.userData.animate = (t) => { if (own) own(t); anims.forEach((f) => f(t)); };
  return g;
}

// Köy halkası zemini: taşlı yol dokusu
export function villageGround(radius) {
  const g = new THREE.Group();
  const top = mesh(new THREE.CylinderGeometry(radius * 0.965, radius * 0.965, 0.55, 6), [mat(C.wood), mat(0xD9C9A3), mat(C.wood)]);
  top.position.y = -0.275 + 0.06;
  g.add(top);
  for (let i = 0; i < 7; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * radius * 0.7;
    const st = cyl(0.07 + Math.random() * 0.05, 0.08, 0.02, 0xBFAE88, Math.cos(a) * r, 0.065, Math.sin(a) * r, 6);
    st.receiveShadow = true;
    g.add(st);
  }
  return g;
}
