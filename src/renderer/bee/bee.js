import * as THREE from './vendor/three.module.min.js';
import { buildOccupant, villageGround, VM, buildMerchantCart } from './village.js';
import { pickBeeDialogue } from './bee-dialogues.js';
import { RELEASE_NOTES } from './release-notes.js';

// ============================================================================
// Nero · Arıcılık — 3D ada ve arayüz
// Oyun mantığı Nero'nun ana sürecinde; bu dosya sadece çizer ve eylem gönderir.
// ============================================================================

const $ = (id) => document.getElementById(id);
const R = 1;                       // altıgen yarıçapı
const SQ3 = Math.sqrt(3);
const TILE_H = 0.55;

// Eksenel koordinat -> dünya konumu (sivri tepeli altıgen)
function hexToWorld(q, r) {
  return new THREE.Vector3(R * SQ3 * (q + r / 2), 0, R * 1.5 * r);
}

let view = null;
let itemsSig = '';

// ---------------------------------------------------------------------------
// Sahne
// ---------------------------------------------------------------------------
const canvas = $('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (err) {
  document.body.insertAdjacentHTML('beforeend',
    '<div class="notice" style="top:45%">3D çizim başlatılamadı. Ekran kartı sürücünü güncellemeyi dene.</div>');
  throw err;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();

let zoom = 1.3;
const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 200);
const camTarget = new THREE.Vector3(0, 0, 0);
const camOffset = new THREE.Vector3(18, 20, 18);
function placeCamera() {
  camera.position.copy(camTarget).add(camOffset);
  camera.lookAt(camTarget);
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  const aspect = w / h;
  const size = 8.5 / zoom;
  camera.left = -size * aspect;
  camera.right = size * aspect;
  camera.top = size;
  camera.bottom = -size;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

// Işıklar: yumuşak gökyüzü + gölgeli güneş
const hemi = new THREE.HemisphereLight(0xFFF6E0, 0x7FA36B, 1.15);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xFFF1D6, 1.6);
sun.position.set(-10, 22, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 70 });
sun.shadow.bias = -0.0006;
scene.add(sun);

// ---------------------------------------------------------------------------
// Malzemeler
// ---------------------------------------------------------------------------
const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, flatShading: true, ...opts });
const M = {
  grassOwned: mat(0x86CC55),
  grassWild: mat(0x9AAE6B),
  grassBuy: mat(0xAFC47C),
  dirt: mat(0x8A5A34),
  dirtDark: mat(0x6E4526),
  water: mat(0x6FC3D9, { roughness: 0.3 }),
  soil: mat(0x6B4428),
  wall: mat(0xF3E4C4),
  roof: mat(0xD9743A),
  wood: mat(0x8A5A34),
  window: mat(0xBFE3EE),
  lamp: mat(0xFFD27A, { emissive: 0xFFB84A, emissiveIntensity: 0.6 }),
  hive: mat(0xEBC983),
  hiveLight: mat(0xF4DCA6),
  hiveDark: mat(0xC99A55),
  leaf: mat(0x5FA24E),
  leafLight: mat(0x77B85E),
  pine: mat(0x3F8A57),
  trunk: mat(0x7A4E2C),
  stem: mat(0x4F8F3F),
  center: mat(0xF3C23B),
  bee: mat(0xF4C441),
  beeStripe: mat(0x3A2E20),
  wing: new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, roughness: 0.2 }),
  hover: new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.95 })
};

// ---------------------------------------------------------------------------
// Karolar
// ---------------------------------------------------------------------------
const tileGroup = new THREE.Group();
const itemGroup = new THREE.Group();
const beeGroup = new THREE.Group();
const villageGroup = new THREE.Group();
scene.add(tileGroup, itemGroup, beeGroup, villageGroup);

const hexGeo = new THREE.CylinderGeometry(R * 0.965, R * 0.965, TILE_H, 6);
const tileMeshes = new Map(); // key -> mesh

function tileMaterials(t) {
  if (t.kind === 'water') return [M.dirtDark, M.water, M.dirtDark];
  if (t.owned) return [M.dirt, M.grassOwned, M.dirt];
  return [M.dirt, view && isBuyable(t) ? M.grassBuy : M.grassWild, M.dirt];
}

function isBuyable(t) {
  if (t.owned || t.kind === 'water') return false;
  const dirs = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  return dirs.some(([dq, dr]) => {
    const n = view.tiles[`${t.q + dq},${t.r + dr}`];
    return n && n.owned;
  });
}

function buildTiles() {
  for (const [k, t] of Object.entries(view.tiles)) {
    let mesh = tileMeshes.get(k);
    if (!mesh) {
      mesh = new THREE.Mesh(hexGeo, tileMaterials(t));
      const p = hexToWorld(t.q, t.r);
      mesh.position.set(p.x, 0, p.z);
      mesh.receiveShadow = true;
      mesh.castShadow = false;
      mesh.userData.key = k;
      tileGroup.add(mesh);
      tileMeshes.set(k, mesh);
    }
    mesh.material = tileMaterials(t);
    // sahip olunan kareler biraz daha yüksek, göl biraz alçak
    const y = t.kind === 'water' ? -TILE_H / 2 - 0.12 : t.owned ? -TILE_H / 2 + 0.06 : -TILE_H / 2;
    mesh.position.y = y;
  }
}

function topY(t) {
  return t.kind === 'water' ? -0.12 : t.owned ? 0.06 : 0;
}

// ---------------------------------------------------------------------------
// Nesneler: ev, kovan, çiçek tarhı, ağaç
// ---------------------------------------------------------------------------
function shadowAll(obj) {
  obj.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return obj;
}

function makeHouse() {
  const g = new THREE.Group();
  const walls = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.85), M.wall);
  walls.position.y = 0.35;
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.88, 0.62, 4), M.roof);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(1, 1, 0.9);
  roof.position.y = 1.0;
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.38, 0.04), M.wood);
  door.position.set(0, 0.19, 0.44);
  const win1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.04), M.window);
  win1.position.set(-0.3, 0.45, 0.44);
  const win2 = win1.clone();
  win2.position.x = 0.3;
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.34, 0.14), M.wood);
  chimney.position.set(0.25, 1.05, -0.12);
  g.add(walls, roof, door, win1, win2, chimney);
  return shadowAll(g);
}

function makeHive() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.08, 0.78), M.wood);
  base.position.y = 0.04;
  const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.26, 0.66), M.hive);
  b1.position.y = 0.22;
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.22, 0.66), M.hiveLight);
  b2.position.y = 0.46;
  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.08, 0.76), M.hiveDark);
  lid.position.y = 0.61;
  const entrance = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.05, 0.03), M.beeStripe);
  entrance.position.set(0, 0.13, 0.335);
  g.add(base, b1, b2, lid, entrance);
  return shadowAll(g);
}

const flowerGeo = {
  plot: new THREE.CylinderGeometry(R * 0.8, R * 0.84, 0.08, 6),
  stem: new THREE.CylinderGeometry(0.018, 0.018, 0.18, 4),
  petal: new THREE.SphereGeometry(0.075, 6, 5),
  center: new THREE.SphereGeometry(0.04, 6, 5)
};
const petalMats = new Map();
function petalMat(hex) {
  if (!petalMats.has(hex)) petalMats.set(hex, mat(new THREE.Color(hex)));
  return petalMats.get(hex);
}

// Tohum her karede aynı dizilsin diye basit sahte-rastgele
function seeded(seed) {
  let x = seed * 9301 + 49297;
  return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
}

function makeFlowerPlot(flowerDef, seed, wilted = false) {
  const g = new THREE.Group();
  const plot = new THREE.Mesh(flowerGeo.plot, M.soil);
  plot.position.y = 0.04;
  plot.receiveShadow = true;
  g.add(plot);
  const rnd = seeded(seed);
  const pm = petalMat(wilted ? '#9C8A6A' : flowerDef.petal);
  for (let i = 0; i < 13; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * 0.62;
    const x = Math.cos(a) * d;
    const z = Math.sin(a) * d;
    const stem = new THREE.Mesh(flowerGeo.stem, M.stem);
    stem.position.set(x, 0.17, z);
    const bloom = new THREE.Group();
    for (let k = 0; k < 5; k++) {
      const p = new THREE.Mesh(flowerGeo.petal, pm);
      const pa = (k / 5) * Math.PI * 2;
      p.position.set(Math.cos(pa) * 0.065, 0, Math.sin(pa) * 0.065);
      p.scale.set(1, 0.45, 1);
      bloom.add(p);
    }
    const c = new THREE.Mesh(flowerGeo.center, M.center);
    c.position.y = 0.02;
    bloom.add(c);
    bloom.position.set(x, 0.28, z);
    const s = (0.8 + rnd() * 0.45) * (wilted ? 0.6 : 1);
    bloom.scale.setScalar(s);
    if (wilted) { bloom.position.y = 0.16; bloom.rotation.z = 0.9; }
    g.add(stem, bloom);
  }
  return shadowAll(g);
}

function makeTree(seed) {
  const g = new THREE.Group();
  const rnd = seeded(seed);
  if (rnd() < 0.45) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.35, 5), M.trunk);
    trunk.position.y = 0.17;
    const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.75, 6), M.pine);
    c1.position.y = 0.62;
    const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.55, 6), M.pine);
    c2.position.y = 0.95;
    g.add(trunk, c1, c2);
  } else {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.4, 5), M.trunk);
    trunk.position.y = 0.2;
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), M.leaf);
    crown.position.y = 0.7;
    const crown2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 0), M.leafLight);
    crown2.position.set(0.22, 0.58, 0.1);
    g.add(trunk, crown, crown2);
  }
  g.position.set((rnd() - 0.5) * 0.4, 0, (rnd() - 0.5) * 0.4);
  g.rotation.y = rnd() * Math.PI;
  return shadowAll(g);
}

function makeDecor(id) {
  const g = new THREE.Group();
  const white = mat(0xF4EEE2);
  const iron = mat(0x3A3A3A);
  const stone = mat(0xBDB6AA);
  const water = mat(0x7FC8E0, { roughness: 0.2 });
  const glow = M.lamp;
  if (id === 'cit') {
    for (let i = 0; i < 4; i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.05), white);
      p.position.set(-0.24 + i * 0.16, 0.11, 0);
      g.add(p);
    }
    const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.035, 0.03), white); r1.position.y = 0.16;
    const r2 = r1.clone(); r2.position.y = 0.07;
    g.add(r1, r2);
  } else if (id === 'bank') {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.14), M.wood); seat.position.y = 0.12;
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.03), M.wood); back.position.set(0, 0.2, -0.06);
    for (const x of [-0.18, 0.18]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.12), iron); l.position.set(x, 0.06, 0); g.add(l); }
    g.add(seat, back);
  } else if (id === 'fener') {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.55, 6), iron); pole.position.y = 0.27;
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), glow); lamp.position.y = 0.6;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.07, 4), iron); cap.position.y = 0.69; cap.rotation.y = Math.PI / 4;
    g.add(pole, lamp, cap);
  } else if (id === 'kemer') {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 6, 14, Math.PI), white); arch.position.y = 0.3;
    for (const x of [-0.26, 0.26]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 6), white); l.position.set(x, 0.15, 0); g.add(l); }
    for (let i = 0; i < 7; i++) {
      const a = (i / 6) * Math.PI;
      const f = new THREE.Mesh(flowerGeo.petal, petalMat(i % 2 ? '#F28CA8' : '#FFFFFF'));
      f.position.set(Math.cos(a) * 0.26, 0.3 + Math.sin(a) * 0.26, 0.03);
      g.add(f);
    }
    g.add(arch);
  } else if (id === 'cesme') {
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.12, 10), stone); basin.position.y = 0.06;
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.02, 10), water); pool.position.y = 0.125;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.28, 8), stone); col.position.y = 0.26;
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.05, 10), stone); top.position.y = 0.41;
    g.add(basin, pool, col, top);
  }
  return shadowAll(g);
}

function makeCup(kind) {
  const color = { 'altın': 0xE9B93A, 'gümüş': 0xC9CED6, 'bronz': 0xC98A4E }[kind] || 0xE9B93A;
  const m = mat(color, { metalness: 0.5, roughness: 0.35 });
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.05, 0.14), M.wood); base.position.y = 0.025;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.08, 6), m); stem.position.y = 0.09;
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.04, 0.1, 10), m); bowl.position.y = 0.18;
  g.add(base, stem, bowl);
  return shadowAll(g);
}

const hiveObjects = new Map(); // hiveId -> { group, pos }

function buildItems() {
  setTimeout(buildNightLights, 0);
  itemGroup.clear();
  hiveObjects.clear();
  for (const [k, t] of Object.entries(view.tiles)) {
    const p = hexToWorld(t.q, t.r);
    const y = topY(t);
    let obj = null;
    const seed = (t.q + 7) * 131 + (t.r + 7) * 17;
    if (t.item && t.item.type === 'house') obj = makeHouse();
    else if (t.item && t.item.type === 'hive') {
      obj = makeHive();
      obj.scale.setScalar(1.22);
      hiveObjects.set(t.item.id, { group: obj, pos: new THREE.Vector3(p.x, y, p.z), key: k });
    } else if (t.item && t.item.type === 'flower') obj = makeFlowerPlot(view.flowers[t.item.flower], seed, t.item.wilted);
    else if (t.tree) obj = makeTree(seed);
    if (obj) {
      obj.position.x += p.x;
      obj.position.z += p.z;
      obj.position.y = y;
      obj.userData.key = k;
      itemGroup.add(obj);
    }
    // Dekor: karenin ön-sağ kenarına
    if (t.decor && t.decor !== 'kupa') {
      const d = makeDecor(t.decor);
      d.position.set(p.x + 0.52, y, p.z + 0.42);
      d.rotation.y = -Math.PI / 4;
      d.userData.key = k;
      itemGroup.add(d);
    }
    // Festival kupaları evin yanında sergilenir
    if (t.item && t.item.type === 'house') {
      (view.festival.cups || []).slice(-3).forEach((c, i) => {
        const cup = makeCup(c.cup);
        cup.position.set(p.x - 0.55 + i * 0.2, y, p.z + 0.55);
        cup.userData.key = k;
        itemGroup.add(cup);
      });
    }
  }
  buildBees();
}

// ---------------------------------------------------------------------------
// Arıcı: hasır şapkalı, beyaz tulumlu; evden kovana yürür, kovanda çalışır
// ---------------------------------------------------------------------------
const keeper = (() => {
  const g = new THREE.Group();
  const suit = mat(0xF7F2E6);
  const skin = mat(0xF2C9A0);
  const straw = mat(0xE8C98A);
  const band = mat(0xD9573F);
  const boots = mat(0x7A4E2C);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.42, 8), suit);
  body.position.y = 0.36;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), skin);
  head.position.y = 0.68;
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 16), straw);
  brim.position.y = 0.78;
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.13, 12), straw);
  crown.position.y = 0.85;
  const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.151, 0.151, 0.035, 12), band);
  ribbon.position.y = 0.8;
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 6), boots);
  legL.position.set(-0.07, 0.09, 0);
  const legR = legL.clone();
  legR.position.x = 0.07;
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.3, 6), suit);
  armL.position.set(-0.21, 0.38, 0);
  armL.rotation.z = 0.25;
  const armR = armL.clone();
  armR.position.x = 0.21;
  armR.rotation.z = -0.25;
  g.add(body, head, brim, crown, ribbon, legL, legR, armL, armR);
  g.userData = { legL, legR, armL, armR };
  shadowAll(g);
  g.scale.setScalar(1.25);
  scene.add(g);
  return g;
})();

function tileTop(key) {
  const t = view && view.tiles[key];
  if (!t) return new THREE.Vector3();
  const p = hexToWorld(t.q, t.r);
  return new THREE.Vector3(p.x, topY(t), p.z);
}

// Kovanın ya da evin tam üstüne değil, önündeki boşluğa dursun
function standSpot(key, towardKey) {
  const a = tileTop(key);
  const b = tileTop(towardKey || key);
  const dir = b.clone().sub(a);
  if (dir.lengthSq() < 0.001) dir.set(0, 0, 1);
  dir.normalize();
  return a.clone().addScaledVector(dir, 0.9);
}

function animateKeeper(t) {
  if (!view) return;
  const job = view.keeper && view.keeper.job;
  const now = Date.now() + clockSkew;
  const u = keeper.userData;
  let pos;
  let moving = false;
  let working = false;
  if (!job) {
    pos = standSpot(view.houseKey, view.houseKey === '0,0' ? '0,1' : '0,0');
    keeper.rotation.y = Math.PI * 0.25;
  } else {
    const from = standSpot(job.from, job.to);
    const to = standSpot(job.to, job.from);
    const k = Math.min(1, Math.max(0, (now - job.startAt) / Math.max(1, job.arriveAt - job.startAt)));
    pos = from.clone().lerp(to, k);
    moving = k < 1;
    working = !moving && job.kind === 'harvest';
    const d = to.clone().sub(from);
    if (d.lengthSq() > 0.001) keeper.rotation.y = Math.atan2(d.x, d.z);
    if (working) keeper.rotation.y = Math.atan2(-d.x, -d.z);
  }
  keeper.position.copy(pos);
  const swing = moving ? Math.sin(t * 12) * 0.5 : 0;
  u.legL.rotation.x = swing;
  u.legR.rotation.x = -swing;
  u.armL.rotation.x = working ? -1.2 + Math.sin(t * 9) * 0.35 : -swing;
  u.armR.rotation.x = working ? -1.2 - Math.sin(t * 9) * 0.35 : swing;
  keeper.position.y += moving ? Math.abs(Math.sin(t * 12)) * 0.04 : 0;
}

// ---------------------------------------------------------------------------
// Arılar: her kovanın etrafında, komşu çiçeklere gidip gelen küçük arılar
// ---------------------------------------------------------------------------
const beeGeo = { body: new THREE.SphereGeometry(0.07, 8, 6), wing: new THREE.SphereGeometry(0.05, 6, 4) };
const bees = [];

function makeBee() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(beeGeo.body, M.bee);
  body.scale.set(1.3, 1, 1);
  const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.012, 4, 10), M.beeStripe);
  stripe.rotation.y = Math.PI / 2;
  const w1 = new THREE.Mesh(beeGeo.wing, M.wing);
  w1.scale.set(0.6, 0.2, 1);
  w1.position.set(0, 0.06, 0.05);
  const w2 = w1.clone();
  w2.position.z = -0.05;
  g.add(body, stripe, w1, w2);
  g.userData.wings = [w1, w2];
  return g;
}

function buildBees() {
  beeGroup.clear();
  bees.length = 0;
  for (const [id, h] of Object.entries(view.hives)) {
    const obj = hiveObjects.get(id);
    if (!obj) continue;
    const [q, r] = obj.key.split(',').map(Number);
    const targets = [];
    for (const [dq, dr] of [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]) {
      const n = view.tiles[`${q + dq},${r + dr}`];
      if (n && n.item && n.item.type === 'flower' && !n.item.wilted) {
        const p = hexToWorld(n.q, n.r);
        targets.push(new THREE.Vector3(p.x, topY(n) + 0.45, p.z));
      }
    }
    const count = Math.min(h.bees, GFX[gfx].bees);
    for (let i = 0; i < count; i++) {
      const b = makeBee();
      b.scale.setScalar(1.7);
      b.userData = {
        ...b.userData,
        home: obj.pos.clone().add(new THREE.Vector3(0, 0.75, 0)),
        targets,
        phase: Math.random() * 10,
        speed: 0.18 + Math.random() * 0.12,
        target: targets.length ? targets[i % targets.length] : null
      };
      beeGroup.add(b);
      bees.push(b);
    }
  }
}

function animateBees(t) {
  for (const b of bees) {
    const u = b.userData;
    const flap = Math.sin(t * 60 + u.phase) * 0.6;
    u.wings[0].rotation.x = flap;
    u.wings[1].rotation.x = -flap;
    if (!u.target) {
      // çiçek yoksa kovanın etrafında dolaşır
      const a = t * 1.4 + u.phase;
      b.position.set(u.home.x + Math.cos(a) * 0.5, u.home.y + Math.sin(a * 2) * 0.08, u.home.z + Math.sin(a) * 0.5);
      b.rotation.y = -a;
      continue;
    }
    // kovan <-> çiçek arasında gidip gelme (sinüs döngüsü)
    const cycle = (t * u.speed + u.phase) % 2;
    const k = cycle < 1 ? cycle : 2 - cycle;
    const e = k * k * (3 - 2 * k);
    const from = u.home;
    const to = u.target;
    const wobble = Math.sin(t * 5 + u.phase) * 0.12;
    b.position.set(
      from.x + (to.x - from.x) * e + wobble,
      from.y + (to.y - from.y) * e + Math.sin(e * Math.PI) * 0.5,
      from.z + (to.z - from.z) * e - wobble
    );
    const dir = cycle < 1 ? 1 : -1;
    b.rotation.y = Math.atan2((to.x - from.x) * dir, (to.z - from.z) * dir) - Math.PI / 2;
    if (u.targets.length > 1 && cycle > 1.98) u.target = u.targets[Math.floor(Math.random() * u.targets.length)];
  }
}

// ---------------------------------------------------------------------------
// Fare: üzerine gelme, tıklama, sürükleyerek kaydırma, tekerlekle yakınlaştırma
// ---------------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoverKey = null;

const hoverRing = (() => {
  const pts = [];
  for (let i = 0; i <= 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    pts.push(new THREE.Vector3(Math.sin(a) * R * 0.94, 0, Math.cos(a) * R * 0.94));
  }
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), M.hover);
  line.visible = false;
  scene.add(line);
  return line;
})();

function pickTile(clientX, clientY) {
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects([...itemGroup.children, ...villageGroup.children, ...tileGroup.children], true);
  for (const h of hits) {
    let o = h.object;
    while (o && !o.userData.key) o = o.parent;
    if (o && o.userData.key) return o.userData.key;
  }
  return null;
}

let drag = null;
canvas.addEventListener('pointerdown', (e) => {
  drag = { x: e.clientX, y: e.clientY, moved: false, target: camTarget.clone() };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (drag) {
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    if (drag.moved) {
      // ekran hareketini dünya düzlemine çevir (izometrik)
      const scale = (camera.right - camera.left) / window.innerWidth;
      const right = new THREE.Vector3(1, 0, -1).normalize();
      const fwd = new THREE.Vector3(1, 0, 1).normalize();
      camTarget.copy(drag.target)
        .addScaledVector(right, -dx * scale)
        .addScaledVector(fwd, -dy * scale * 1.35);
      camTarget.x = Math.max(-14, Math.min(14, camTarget.x));
      camTarget.z = Math.max(-14, Math.min(14, camTarget.z));
      placeCamera();
      closePopup();
    }
    return;
  }
  hoverKey = pickTile(e.clientX, e.clientY);
  showHoverTip(hoverKey, e.clientX, e.clientY);
  updateHover();
});
canvas.addEventListener('pointerup', (e) => {
  const d = drag;
  drag = null;
  if (d && !d.moved) onTileClick(pickTile(e.clientX, e.clientY), e.clientX, e.clientY);
});
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  setZoom(zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1));
}, { passive: false });

function setZoom(z) {
  zoom = Math.max(0.5, Math.min(2.4, z));
  resize();
  closePopup();
}
$('zoom-in').addEventListener('click', () => setZoom(zoom * 1.2));
$('zoom-out').addEventListener('click', () => setZoom(zoom / 1.2));

function updateHover() {
  const t = hoverKey && view && view.tiles[hoverKey];
  const clickable = t && t.kind !== 'water' && (t.owned || isBuyable(t));
  hoverRing.visible = !!clickable;
  canvas.style.cursor = clickable || (hoverKey && (hoverKey.startsWith('v:') || hoverKey === 'm:cart')) ? 'pointer' : 'grab';
  if (clickable) {
    const p = hexToWorld(t.q, t.r);
    hoverRing.position.set(p.x, topY(t) + 0.02, p.z);
  }
}

// ---------------------------------------------------------------------------
// Açılır menüler
// ---------------------------------------------------------------------------
const popup = $('popup');
let popupKey = null;

function closePopup() { popup.hidden = true; popupKey = null; }

function openPopupAt(x, y, html) {
  popup.innerHTML = html;
  popup.hidden = false;
  const w = popup.offsetWidth;
  const h = popup.offsetHeight;
  popup.style.left = `${Math.min(window.innerWidth - w - 12, Math.max(12, x + 14))}px`;
  popup.style.top = `${Math.min(window.innerHeight - h - 12, Math.max(80, y - h / 2))}px`;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const kg = (v) => `${(v || 0).toFixed(1)} kg`;
const seasonsTr = { ilkbahar: 'İlkbahar', yaz: 'Yaz', sonbahar: 'Sonbahar', kis: 'Kış' };

function onTileClick(k, x, y) {
  if (k === 'm:cart') { closePopup(); if (!placing) openMerchant(); return; }
  if (k && k.startsWith('v:')) { closePopup(); if (!placing) openVillagerPopup(k.slice(2), x, y); return; }
  closePopup();
  if (!k || !view) return;
  const t = view.tiles[k];
  if (!t || t.kind === 'water') return;
  if (placing) { placeAt(k, t); return; }
  popupKey = k;

  if (!t.owned) {
    if (!isBuyable(t)) return;
    const price = view.tilePrice;
    openPopupAt(x, y, `
      <h3>Boş arazi</h3>
      <p class="sub">Adanı büyüt: bu kareyi satın alırsan kovan ya da çiçek koyabilirsin.</p>
      <button class="act primary" data-act="buyTile" ${view.coins < price ? 'disabled' : ''}>Satın al <small>${price} 🪙</small></button>`);
    return;
  }

  if (!t.item) {
    openPopupAt(x, y, `
      <h3>Bu kareye ne koyalım?</h3>
      <p class="sub">Bir karede ya kovan ya da çiçek olabilir.</p>
      <button class="act primary" data-act="placeHive" ${view.coins < view.hiveCost ? 'disabled' : ''}>🐝 Kovan yerleştir <small>${view.hiveCost} 🪙</small></button>
      <button class="act" data-act="openSeeds">🌱 Tohum ek <small>›</small></button>
      ${t.decor ? `<button class="act danger" data-act="removeDecor">${esc(view.decor[t.decor].name)} kaldır <small>+${Math.floor(view.decor[t.decor].cost / 2)} 🪙</small></button>` : ''}`);
    return;
  }

  if (t.item.type === 'house') {
    openPopupAt(x, y, `<h3>Arıcının evi</h3><p class="sub">Burası senin çiftliğin. Arıcı hasat için buradan yola çıkar.</p>`);
    return;
  }

  if (t.item.type === 'flower') {
    const f = view.flowers[t.item.flower];
    const season = view.calendar.season;
    const inSeason = season !== 'kis' && f.seasons.includes(season);
    const age = view.dayIndex - (t.item.plantedDay || 0);
    const left = Math.max(0, view.flowerLife - age);
    if (t.item.wilted) {
      openPopupAt(x, y, `
        <h3>🥀 ${esc(f.name)} tarhı soldu</h3>
        <p class="sub">Solmuş tarh bal vermez. Tohum fiyatının %${Math.round(view.reviveRate * 100)}'una canlandırırsan ${view.flowerLife} gün daha yaşar.</p>
        <button class="act primary" data-act="replant" ${view.coins < Math.max(1, Math.round(f.seed * view.reviveRate)) ? 'disabled' : ''}>🌱 Canlandır <small>${Math.max(1, Math.round(f.seed * view.reviveRate))} 🪙</small></button>
        <button class="act danger" data-act="removeFlower">Tarhı temizle</button>`);
      return;
    }
    openPopupAt(x, y, `
      <h3>${esc(f.name)} tarhı</h3>
      <div class="row"><span>Kalan ömür</span><b>${left} gün</b></div>
      <p class="sub">${f.seasons.map((s) => seasonsTr[s]).join(' · ')} · ${inSeason ? 'şu an mevsiminde' : 'şu an mevsimi dışında'}</p>
      <div class="row"><span>Bal üretimine etkisi</span><b>+%${Math.round(f.buff * 100)}</b></div>
      <div class="row"><span>Balın taban fiyatı</span><b>${f.price} 🪙/kg</b></div>
      ${view.clusterTiles[popupKey]
        ? `<div class="row"><span>🌼 Yan yana bonusu</span><b>+%${Math.round(view.clusterBonus * 100)}</b></div>`
        : `<p class="sub">İpucu: aynı çiçekten 3 tarhı yan yana ekersen +%${Math.round(view.clusterBonus * 100)} üretir.</p>`}
      <button class="act danger" data-act="removeFlower">Tarhı temizle</button>
      ${t.decor ? `<button class="act danger" data-act="removeDecor">${esc(view.decor[t.decor].name)} kaldır <small>+${Math.floor(view.decor[t.decor].cost / 2)} 🪙</small></button>` : ''}`);
    return;
  }

  if (t.item.type === 'hive') {
    closePopup();
    openHive(t.item.id);
  }
}

popup.addEventListener('click', async (e) => {
  const welcome = e.target.closest('[data-ezgi-welcome]');
  if (welcome) { await doAct('claimEzgiWelcome'); closePopup(); return; }
  const ezgiShop = e.target.closest('[data-ezgi-shop]');
  if (ezgiShop) {
    closePopup();
    shopTab = 'seeds';
    for (const x of document.querySelectorAll('.shop-tabs button')) x.classList.toggle('on', x.dataset.tab === 'seeds');
    openShop();
    return;
  }
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const act = b.dataset.act;
  if (act === 'openSeeds') { openSeeds(popupKey); return; }
  await doAct(act, popupKey);
  closePopup();
});

// ---------------------------------------------------------------------------
// Tohum seçici
// ---------------------------------------------------------------------------
let seedKey = null;
function openSeeds(k) {
  seedKey = k;
  closePopup();
  const season = view.calendar.season;
  const list = $('seed-list');
  list.innerHTML = Object.entries(view.flowers).map(([id, f]) => {
    const inSeason = season !== 'kis' && f.seasons.includes(season);
    const buff = Math.round(f.buff * 100);
    return `<li class="seed">
      <span class="dot" style="background:${f.color}"></span>
      <span class="info"><b>${esc(f.name)}</b>
        <small>${f.seasons.map((s) => seasonsTr[s]).join(' · ')} · bal ${f.price} 🪙/kg</small>
        <span class="${inSeason ? 'insz' : 'outsz'}">${inSeason ? 'şu an mevsiminde' : 'mevsimi dışında, az üretir'}</span>
      </span>
      <span class="buff ${buff === 0 ? 'zero' : ''}">🐝 +%${buff} bal üretimi</span>
      <button class="buy" type="button" data-seed="${id}" ${view.coins < f.seed && !(view.vouchers[id] > 0) ? 'disabled' : ''}>${view.vouchers[id] > 0 ? `🌱 Envanter ×${view.vouchers[id]}` : `${f.seed} 🪙`}</button>
    </li>`;
  }).join('');
  $('seed-modal').hidden = false;
}
$('seed-close').addEventListener('click', () => { $('seed-modal').hidden = true; });
$('seed-modal').addEventListener('click', (e) => { if (e.target === $('seed-modal')) $('seed-modal').hidden = true; });
$('seed-list').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-seed]');
  if (!b || b.disabled) return;
  await doAct('plantSeed', seedKey, b.dataset.seed);
  $('seed-modal').hidden = true;
});

// ---------------------------------------------------------------------------
// Eylemler ve bildirimler
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Bildirimler: sol alttaki zil, son 20 bildirim
// ---------------------------------------------------------------------------
let notifOpen = false;
let lastUnread = 0;
function renderNotifs() {
  if (!view) return;
  const unread = view.notifsUnread || 0;
  const badge = $('bell-badge');
  badge.hidden = !unread || notifOpen;
  badge.textContent = String(unread);
  if (unread > lastUnread && !notifOpen) { $('bell').classList.remove('ring'); void $('bell').offsetWidth; $('bell').classList.add('ring'); }
  lastUnread = unread;
  if (!notifOpen) return;
  const list = view.notifs || [];
  const fmt = (t) => new Date(t).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  $('notif-list').innerHTML = list.length
    ? list.map((n, i) => `<li class="${n.err ? 'err' : ''}${i < openUnread ? ' new' : ''}${n.go ? ' go' : ''}" data-ni="${i}" title="${n.go ? 'Tıkla, ilgili yere git' : ''}"><time>${fmt(n.t)}</time><span>${esc(n.msg)}</span></li>`).join('')
    : '<li class="empty">Henüz bildirim yok.</li>';
}
let openUnread = 0;
function openNotifs() {
  notifOpen = true;
  openUnread = view ? view.notifsUnread || 0 : 0;
  $('notif-panel').hidden = false;
  renderNotifs();
  if (openUnread) window.bee.act('readNotifs');
}
function closeNotifs() { notifOpen = false; $('notif-panel').hidden = true; renderNotifs(); }
$('bell').addEventListener('click', () => (notifOpen ? closeNotifs() : openNotifs()));
$('notif-close').addEventListener('click', closeNotifs);

function toast(msg, err = false) {
  const el = document.createElement('div');
  el.className = `toast${err ? ' err' : ''}`;
  el.textContent = msg;
  $('toasts').appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

async function doAct(action, a, b) {
  const cost = costOf(action, a, b);
  if (cost >= 500 && !window.confirm(`Bu işlem ${cost.toLocaleString('tr-TR')} 🪙 tutuyor. Emin misin?`)) return null;
  const { res, view: v, events } = await window.bee.act(action, a, b);
  if (res && res.msg) toast(res.msg, !res.ok);
  if (res) react(action, res, a, b);
  (events || []).forEach((e) => { if (e.msg) { toast(e.msg, e.err); reactEvent(e); } });
  applyView(v);
  return res;
}

$('harvest-all').addEventListener('click', () => doAct('harvestAll'));
for (const b of document.querySelectorAll('.speeds button')) {
  b.addEventListener('click', () => doAct('speed', Number(b.dataset.speed)));
}
for (const b of document.querySelectorAll('[data-soon]')) {
  b.addEventListener('click', () => toast(`${b.dataset.soon} bir sonraki aşamada geliyor.`));
}
let lastSpeed = 1;
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePopup(); $('seed-modal').hidden = true; closeHive(); closeMarket(); closeOrders(); closeBoard(); closeShop();
    $('guide-modal').hidden = true; closeWhatsNew(); cancelPlacing(); closeLedger(); closeStats(); closeNotifs(); closeMerchant();
    $('settings-modal').hidden = true; $('hives-modal').hidden = true; $('keys-modal').hidden = true;
    return;
  }
  // Yazı yazarken ya da tanıtım açıkken kısayollar çalışmasın
  if (e.target.closest('input, textarea, select') || !$('tour').hidden || e.ctrlKey || e.altKey || e.metaKey) return;
  const k = e.code;
  if (k === 'KeyH') { e.preventDefault(); doAct('harvestAll'); }
  else if (k === 'KeyP') { e.preventDefault(); openMarket(); }
  else if (k === 'KeyS') { e.preventDefault(); openOrders(); }
  else if (k === 'KeyD') { e.preventDefault(); openLedger(); }
  else if (k === 'KeyF') { e.preventDefault(); takePhoto(); }
  else if (k === 'KeyK') { e.preventDefault(); openHives(); }
  else if (k === 'KeyR') { e.preventDefault(); recenter(); }
  else if (e.key === '?') { e.preventDefault(); $('keys-modal').hidden = false; }
  else if ((k === 'ArrowLeft' || k === 'ArrowRight') && openHiveId) { e.preventDefault(); cycleHive(k === 'ArrowRight' ? 1 : -1); }
  else if (k === 'Space') {
    e.preventDefault();
    if (!view) return;
    if (view.speed) { lastSpeed = view.speed; doAct('speed', 0); } else doAct('speed', lastSpeed || 1);
  }
});

// ---------------------------------------------------------------------------
// Günlük görevler
// ---------------------------------------------------------------------------
let questsSig = '';
let questsOpen = false;
function setQuestsOpen(open) {
  questsOpen = !!open;
  $('quests').hidden = !questsOpen;
}
$('quests-icon').addEventListener('click', () => setQuestsOpen(!questsOpen));
$('quests-toggle').addEventListener('click', () => setQuestsOpen(false));
function renderQuests() {
  const list = view.quests || [];
  const R = view.questRefresh || { free: 0, paidUsed: true, paidCost: 100 };
  const sig = JSON.stringify([list.map((q) => [q.id, q.target, Math.floor(q.progress * 10), q.claimed]), R, Math.floor(view.coins)]);
  const completed = list.filter((q) => q.progress >= q.target).length;
  const allCompleted = list.length > 0 && completed === list.length;
  $('quests-count').textContent = `${completed} / ${list.length} tamamlandı`;
  $('quests-progress-fill').style.width = `${list.length ? Math.round((completed / list.length) * 100) : 0}%`;
  $('quests-icon').classList.toggle('done', allCompleted);
  $('quests-icon').title = allCompleted ? 'Bugünün görevleri tamamlandı' : 'Bugünün görevleri';
  if (sig === questsSig) return;
  questsSig = sig;
  const refreshLabel = R.free > 0 ? `🔄 Değiştir · Ücretsiz (${R.free}/2)` : !R.paidUsed ? `🔄 Değiştir · ${R.paidCost} 🪙` : '🔒 Değiştirme hakkı bitti';
  $('quest-list').innerHTML = list.map((q) => {
    const done = q.progress >= q.target;
    const claimed = !!q.claimed;
    const prog = q.target > 1 ? `${(Math.floor(q.progress * 10) / 10).toLocaleString('tr-TR')} / ${q.target}` : '';
    const reward = `+ ${q.reward} 🪙${q.voucher ? ` · 🎁 ${esc(view.flowers[q.voucher].name)}` : ''}`;
    const canRefresh = !claimed && !done && (R.free > 0 || !R.paidUsed);
    const check = claimed
      ? '<span class="qcheck done" aria-hidden="true">✓</span>'
      : done
        ? `<button type="button" class="qcheck done claim-ready" data-claim="${q.id}" aria-label="${esc(q.text)} ödülünü al">✓</button>`
        : '<span class="qcheck" aria-hidden="true"></span>';
    const right = claimed
      ? '<span class="qclaimed">✓ alındı</span>'
      : done
        ? `<button type="button" class="qreward claim-ready" data-claim="${q.id}" title="Ödülü al">${reward}</button>`
        : `<span class="qreward">${reward}</span>`;
    return `<li class="quest-row${done ? ' done' : ''}${claimed ? ' claimed' : ''}">
      ${check}
      <div class="qbody">
        <span class="qtitle">${esc(q.text)}</span>
        ${!done && prog ? `<small class="qprogress">${prog}</small>` : ''}
        ${!claimed && !done ? `<button type="button" class="qrefresh" data-refresh="${q.id}" ${canRefresh && (R.free > 0 || view.coins >= R.paidCost) ? '' : 'disabled'}>${esc(refreshLabel)}</button>` : ''}
      </div>
      <div class="qright">${right}</div>
    </li>`;
  }).join('');
}
$('quest-list').addEventListener('click', (e) => {
  const claim = e.target.closest('[data-claim]');
  if (claim) { doAct('claimQuest', claim.dataset.claim); return; }
  const refresh = e.target.closest('[data-refresh]');
  if (refresh && !refresh.disabled) doAct('refreshQuest', refresh.dataset.refresh);
});

// ---------------------------------------------------------------------------
// İsim düzenleme (kovan ve çiftlik)
// ---------------------------------------------------------------------------
// İsim düzenleme (kovan ve çiftlik)
// ---------------------------------------------------------------------------
function inlineRename(labelEl, inputEl, current, onSave) {
  inputEl.value = current;
  labelEl.hidden = true;
  inputEl.hidden = false;
  inputEl.focus();
  inputEl.select();
  const finish = (save) => {
    inputEl.onkeydown = null;
    inputEl.onblur = null;
    inputEl.hidden = true;
    labelEl.hidden = false;
    const v = inputEl.value.trim();
    if (save && v && v !== current) onSave(v);
  };
  inputEl.onkeydown = (e) => { if (e.key === 'Enter') finish(true); if (e.key === 'Escape') { e.stopPropagation(); finish(false); } };
  inputEl.onblur = () => finish(true);
}
$('h-name').addEventListener('click', () => {
  const h = view.hives[openHiveId];
  if (h) inlineRename($('h-name'), $('h-name-input'), h.name, (n) => doAct('renameHive', openHiveId, n));
});
$('farm-name').addEventListener('click', () => inlineRename($('farm-name'), $('farm-name-input'), view.farmName, (n) => doAct('setFarmName', n)));

// ---------------------------------------------------------------------------
// Bal Defteri
// ---------------------------------------------------------------------------
let ledgerOpen = false;
let ledgerTab = 'honey';
let ledgerSig = '';
function openLedger() { ledgerOpen = true; $('ledger-modal').hidden = false; renderLedger(true); }
function closeLedger() { ledgerOpen = false; $('ledger-modal').hidden = true; }
$('open-ledger').addEventListener('click', openLedger);
$('ledger-close').addEventListener('click', closeLedger);
$('ledger-modal').addEventListener('click', (e) => { if (e.target === $('ledger-modal')) closeLedger(); });
for (const b of document.querySelectorAll('[data-ltab]')) {
  b.addEventListener('click', () => {
    ledgerTab = b.dataset.ltab;
    for (const x of document.querySelectorAll('[data-ltab]')) x.classList.toggle('on', x === b);
    renderLedger(true);
  });
}
const LABEL_COLORS = ['#E0626A', '#3F7FBF', '#6FAF7F', '#9C7BD6', '#D9793B', '#4A3A22'];
let labelDraft = null;

function renderLedger(force = false) {
  if (!ledgerOpen || !view) return;
  const sig = JSON.stringify([ledgerTab, view.ledger, view.farmName, view.label, view.questsDone, view.festival.cups, labelDraft, view.stories, view.effects, view.village.residents.length, view.letters]);
  if (!force && sig === ledgerSig) return;
  ledgerSig = sig;
  $('farm-name').textContent = `🏡 ${view.farmName}`;
  const L = view.ledger;
  const n = (v, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toLocaleString('tr-TR');
  let html = '';
  if (ledgerTab === 'letters') {
    const L = view.letters || [];
    html = L.length ? L.map((l) => `<div class="letter-card${l.read ? '' : ' unread'}"><b>✉️ ${esc(l.from)}</b> <small>· ${esc(l.role)}</small>
        <p>“${esc(l.text)}”</p>
        ${l.gift ? `<small>${l.claimed ? '🎁 Hediye alındı' : '🎁 İçinde küçük bir hediye var'}</small>` : ''}
        ${!l.read ? `<div><button type="button" class="act primary small-act" data-read="${l.id}">${l.gift ? 'Oku ve hediyeyi al' : 'Okundu'}</button></div>` : ''}</div>`).join('')
      : '<div class="page locked"><b>Henüz mektup yok</b><small>Köylüler birkaç günde bir sana mektup yazar.</small></div>';
  } else if (ledgerTab === 'effects') {
    const E = view.effects || { focus: { active: false, icon: 'focus', title: 'Odak Bonusu', text: '+%25 bal üretimi', leftMs: 0, earnedTodayMs: 0, dailyLimitMs: 14400000 }, list: [] };
    const allowed = new Set(['focus', 'story', 'building', 'syrup', 'milk', 'season', 'immunity', 'storage']);
    const icon = (id) => `./assets/effects/${allowed.has(id) ? id : 'story'}.svg`;
    const hm = (ms) => {
      const min = Math.max(0, Math.round((ms || 0) / 60000));
      const h = Math.floor(min / 60), m = min % 60;
      return h ? `${h} sa${m ? ` ${m} dk` : ''}` : `${m} dk`;
    };
    const leftClock = (ms) => {
      const total = Math.max(0, Math.ceil((ms || 0) / 60000));
      return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    };
    const rows = (E.list || []).map((x) => {
      const duration = x.permanent ? 'Kullanılana kadar aktif' : x.daysLeft ? `${x.daysLeft} oyun günü kaldı` : '';
      return `<div class="effect-card"><img class="effect-icon" src="${icon(x.icon)}" alt=""><div><b>${esc(x.title)}</b><small>${esc(x.source)}</small>${duration ? `<span>${esc(duration)}</span>` : ''}</div></div>`;
    }).join('');
    const earned = hm(E.focus.earnedTodayMs);
    const limit = hm(E.focus.dailyLimitMs);
    html = `<div class="effects-wrap">
      <div class="effect-focus${E.focus.active ? ' active' : ''}"><img class="effect-icon big" src="${icon('focus')}" alt=""><div>
        <b>🔥 Odak Bonusu · +%25 üretim</b>
        <small>Kalan: <strong>${leftClock(E.focus.leftMs)}</strong></small>
        <span>Bugün kazanılan: ${esc(earned)} / ${esc(limit)}</span>
        <span>Günlük limit: 4 saat</span>
      </div></div>
      <h3 class="effects-title">Diğer etkiler</h3>
      <div class="effects-grid">${rows || '<div class="page locked"><b>Henüz başka etkin yok</b><small>Hikâyeler, köy binaları ve Seyyah Yakup ilerledikçe burada görünür.</small></div>'}</div>
    </div>`;
  } else if (ledgerTab === 'village') {
    const V = view.village;
    const pct = V.nextKg ? Math.min(100, (V.deliveredKg / V.nextKg) * 100) : 100;
    const icon = { koylu: '🏠', dukkan: '🏪', bina: '🏛️' };
    const unlockedStories = view.stories.filter((s) => s.unlocked);
    const storyBlock = `<h3 style="margin:4px 0 6px;font-size:14px">📖 Hikâyeler (${view.stories.filter((s) => s.done).length} / ${view.stories.length} tamam)</h3>
      <div class="stories-grid">${view.stories.map((s) => storyHtml(s.who, null, true)).join('')}</div>`;
    html = storyBlock + `<div class="rec" style="margin-bottom:10px"><small>Köy · ${V.residents.length} / ${V.total} yerleşimci · teslim edilen toplam bal</small>
        <b>${n(V.deliveredKg)} kg</b>${V.nextKg ? ` <small>sıradaki yerleşimci ${n(V.nextKg, 0)} kg'da</small>` : ' <small>köy tamamlandı 🎉</small>'}
        <div class="qbar" style="height:7px;background:#EFE3C6;border-radius:4px;margin-top:6px;overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:#F2B33D"></i></div></div>
      <div class="ledger-grid">${V.residents.map((r) => `<div class="page"><b>${icon[r.type]} ${esc(r.name)}</b>
        <small>${esc(r.role)}</small>
        <small>${r.type === 'koylu' ? `❤️ Sevdiği bal: ${esc(view.flowers[r.fav].name)}` : `✨ ${esc(r.effectText)}`}</small>
        ${(r.type === 'koylu' || r.owner) ? `<small>🤝 İlişki %${view.relations[r.type === 'koylu' ? r.name : r.owner] || 0}${r.hearts ? ` <span class="hearts">${'♥'.repeat(r.hearts)}${'♡'.repeat(view.heartMax - r.hearts)}</span>` : ''}</small>` : ''}</div>`).join('')}
        ${V.residents.length < V.total ? `<div class="page locked"><b>??? · ${V.total - V.residents.length} yerleşimci daha</b><small>Siparişleri teslim ettikçe köye yeni komşular, dükkânlar ve binalar gelir.</small></div>` : ''}</div>`;
  } else if (ledgerTab === 'honey') {
    html = `<div class="ledger-grid">${Object.entries(view.flowers).map(([f, def]) => {
      const h = L.honey[f];
      if (!h || !h.first) {
        return `<div class="page locked"><div class="jar"></div><b>??? Balı</b>
          <small>Henüz üretmedin. ${esc(def.name)} tohumu ekip kovanın yanına koyarsan bu sayfa açılır.</small></div>`;
      }
      return `<div class="page"><div class="jar" style="background:${def.color}"></div><b>${esc(def.name)} Balı</b>
        <small>İlk kavanoz: ${h.first.year}. yıl, ${esc(h.first.season)}, ${h.first.day}. gün</small>
        <small>Toplam hasat: ${n(h.kg)} kg · Satılan: ${n(h.soldKg)} kg</small>
        <small>Kazanç: ${n(h.earned, 0)} 🪙 · En iyi fiyat: ${h.bestPrice ? `${n(h.bestPrice)} 🪙/kg` : '—'}</small></div>`;
    }).join('')}</div>`;
  } else if (ledgerTab === 'records') {
    const totalKg = Object.values(L.honey).reduce((a, x) => a + x.kg, 0);
    const found = Object.values(L.honey).filter((x) => x.first).length;
    const maxBees = Math.max(0, ...Object.values(view.hives).map((h) => h.bees));
    const best = L.bestSale ? `${n(L.bestSale.coins, 0)} 🪙 (${n(L.bestSale.kg)} kg ${esc(view.flowers[L.bestSale.flower].name)})` : '—';
    const cups = (view.festival.cups || []).map((c) => `${c.cup === 'altın' ? '🥇' : c.cup === 'gümüş' ? '🥈' : '🥉'} ${c.year}. yıl`).join(' · ');
    const rec = (label, val) => `<div class="rec"><small>${label}</small><b>${val}</b></div>`;
    html = `<div class="records">
      ${rec('Toplam hasat', `${n(totalKg)} kg`)}${rec('Bal türleri', `${found} / ${Object.keys(view.flowers).length}`)}
      ${rec('Hasat sayısı', n(L.harvests, 0))}${rec('Teslim edilen sipariş', n(L.ordersDone, 0))}
      ${rec('Yapılan mum', n(L.candlesMade, 0))}${rec('Tamamlanan görev', n(view.questsDone, 0))}
      ${rec('En kalabalık kovan', `${maxBees} arı`)}${rec('En büyük satış', best)}
    </div><p class="cups-line">🏆 Kupalar: ${cups || 'henüz yok, Bal Festivali seni bekliyor!'}</p>`;
  } else {
    const cur = labelDraft || view.label || { design: 'klasik', color: LABEL_COLORS[0] };
    labelDraft = cur;
    html = `<div class="label-wrap">
      <div class="big-jar"><div class="lbl ${cur.design}" style="background-color:${cur.color}">${esc(view.farmName)}<br><small>saf bal</small></div></div>
      <div class="label-opts">
        <b>Desen</b>
        <div class="row2">${Object.entries(view.labelDesigns).map(([id, nm]) => `<button type="button" data-design="${id}" class="${cur.design === id ? 'on' : ''}">${esc(nm)}</button>`).join('')}</div>
        <b>Renk</b>
        <div class="row2">${LABEL_COLORS.map((c) => `<button type="button" class="swatch${cur.color === c ? ' on' : ''}" data-color="${c}" style="background:${c}" aria-label="Renk ${c}"></button>`).join('')}</div>
        <p class="modal-sub" style="margin:0">Etiketin olduğunda müdavim köylülerin (en az 1 kalp) siparişlerinde %${Math.round(view.labelBonus * 100)} bahşiş verir.</p>
        <button type="button" class="act primary" id="label-save">${view.label ? 'Etiketi güncelle' : 'Etiketi kaydet'}</button>
      </div></div>`;
  }
  $('ledger-body').innerHTML = html;
}
$('ledger-body').addEventListener('click', async (e) => {
  const d = e.target.closest('[data-design]');
  const c = e.target.closest('[data-color]');
  if (d) { labelDraft = { ...labelDraft, design: d.dataset.design }; renderLedger(true); }
  else if (c) { labelDraft = { ...labelDraft, color: c.dataset.color }; renderLedger(true); }
  else if (e.target.id === 'label-save') await doAct('setLabel', labelDraft.design, labelDraft.color);
});

// ---------------------------------------------------------------------------
// İstatistikler
// ---------------------------------------------------------------------------
let statsOpen = false;
let statsSig = '';
function openStats() { statsOpen = true; $('stats-modal').hidden = false; renderStats(true); }
function closeStats() { statsOpen = false; $('stats-modal').hidden = true; }
$('open-stats').addEventListener('click', openStats);
$('stats-close').addEventListener('click', closeStats);
$('stats-modal').addEventListener('click', (e) => { if (e.target === $('stats-modal')) closeStats(); });

function barChart(values, color, unit) {
  if (!values.length || values.every((v) => !v)) return '<div class="empty">Henüz veri yok. Birkaç oyun günü sonra burada grafik belirecek.</div>';
  const max = Math.max(...values, 1);
  const w = 600 / values.length;
  const bars = values.map((v, i) => {
    const h = (v / max) * 92;
    return `<rect x="${i * w + w * 0.15}" y="${100 - h}" width="${w * 0.7}" height="${h}" rx="4" fill="${color}"><title>${v.toLocaleString('tr-TR')} ${unit}</title></rect>`;
  }).join('');
  return `<svg viewBox="0 0 600 104" preserveAspectRatio="none" aria-hidden="true">${bars}<line x1="0" y1="100.5" x2="600" y2="100.5" stroke="#E3D3A9"/></svg>`;
}

function renderStats(force = false) {
  if (!statsOpen || !view) return;
  const sig = JSON.stringify([view.history, view.today, view.soldTotalKg]);
  if (!force && sig === statsSig) return;
  statsSig = sig;
  const hist = (view.history || []).slice(-14);
  const nw = (view.leaderboard.find((r) => r.me) || {}).nw || 0;
  const rec = (label, val) => `<div class="rec"><small>${label}</small><b>${val}</b></div>`;
  $('stats-body').innerHTML = `
    <div class="sold-total"><small>🍯 Oyun boyunca satılan toplam bal (pazar + siparişler)</small>
      <b>${(view.soldTotalKg / 1000).toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ton</b><span>${view.soldTotalKg.toLocaleString('tr-TR')} kg</span></div>
    <div class="stat-today">
      ${rec('Bugün üretilen', `${view.today.produced.toLocaleString('tr-TR')} kg`)}
      ${rec('Bugün kazanılan', `${view.today.earned.toLocaleString('tr-TR')} 🪙`)}
      ${rec('Net değer', `${nw.toLocaleString('tr-TR')} 🪙`)}
    </div>
    <div class="chart"><h3>🍯 Günlük bal üretimi (son ${hist.length || 0} oyun günü)</h3>${barChart(hist.map((d) => d.produced), '#F2B33D', 'kg')}</div>
    <div class="chart"><h3>🪙 Günlük kazanç</h3>${barChart(hist.map((d) => d.earned), '#6FAF7F', 'jeton')}</div>
    <div class="chart"><h3>🏆 Net değer (son 14 gün)</h3>${barChart((view.leaderboard.find((r) => r.me) || {}).history || [], '#9C7BD6', 'jeton')}</div>`;
}

// ---------------------------------------------------------------------------
// Fotoğraf modu
// ---------------------------------------------------------------------------
async function takePhoto() {
  document.body.classList.add('photo');
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise((r) => setTimeout(r, 120));
  let res = null;
  try { res = await window.bee.photo(); } finally { document.body.classList.remove('photo'); }
  if (res && res.ok) {
    SFX.coin();
    toast('📷 Fotoğraf Resimler\\Nero Arıcılık klasörüne kaydedildi. (klasörü açmak için tıkla)');
    const last = $('toasts').lastElementChild;
    if (last) { last.style.cursor = 'pointer'; last.addEventListener('click', () => window.bee.openPhotos()); }
  }
}
$('photo-btn').addEventListener('click', takePhoto);

// ---------------------------------------------------------------------------
// Yerleştirme modu (Mağaza'dan satın alınca bir kare seçilir)
// ---------------------------------------------------------------------------
let placing = null; // { type: 'hive' | 'seed' | 'land', flower }
function startPlacing(p, text) {
  placing = p;
  $('place-text').textContent = text;
  $('place-bar').hidden = false;
  closeShop();
}
function cancelPlacing() { placing = null; $('place-bar').hidden = true; }
$('place-cancel').addEventListener('click', cancelPlacing);

async function placeAt(k, t) {
  const p = placing;
  if (p.type === 'decor') {
    if (!t.owned) { toast('Dekor sadece adandaki karelere konur.', true); return; }
    await doAct('placeDecor', k, p.decor);
    cancelPlacing();
    return;
  }
  if (p.type === 'land') {
    if (t.owned || !isBuyable(t)) { toast('Adanın kenarındaki, soluk yeşil bir kare seç.', true); return; }
    await doAct('buyTile', k);
  } else {
    if (!t.owned || t.item) { toast('Adandaki boş bir kare seç.', true); return; }
    await doAct(p.type === 'hive' ? 'placeHive' : 'plantSeed', k, p.flower);
  }
  cancelPlacing();
}

// ---------------------------------------------------------------------------
// Mağaza
// ---------------------------------------------------------------------------
let shopOpen = false;
let shopTab = 'seeds';
let shopSig = '';
function openShop() { shopOpen = true; $('shop-modal').hidden = false; renderShop(true); }
function closeShop() { shopOpen = false; $('shop-modal').hidden = true; }
$('open-shop').addEventListener('click', openShop);
$('shop-close').addEventListener('click', closeShop);
$('shop-modal').addEventListener('click', (e) => { if (e.target === $('shop-modal')) closeShop(); });
for (const b of document.querySelectorAll('.shop-tabs button')) {
  b.addEventListener('click', () => {
    shopTab = b.dataset.tab;
    for (const x of document.querySelectorAll('.shop-tabs button')) x.classList.toggle('on', x === b);
    renderShop(true);
  });
}

function renderShop(force = false) {
  if (!shopOpen || !view) return;
  const sig = JSON.stringify([shopTab, Math.floor(view.coins), view.tilePrice, view.calendar.season, view.ezgi, view.vouchers]);
  if (!force && sig === shopSig) return;
  shopSig = sig;
  const c = view.coins;
  let html = '';
  if (shopTab === 'seeds') {
    const season = view.calendar.season;
    html = Object.entries(view.flowers).map(([id, f]) => {
      const inS = season !== 'kis' && f.seasons.includes(season);
      const ezgiPick = !!(view.ezgi && view.ezgi.unlocked && view.ezgi.choice === id);
      return `<div class="shop-item${ezgiPick ? ' ezgi-choice' : ''}"><span class="big" style="color:${f.color}">✿</span>
        <span class="info"><b>${esc(f.name)} tohumu · +%${Math.round(f.buff * 100)} bal üretimi</b>
        <small>${f.seasons.map((s) => seasonsTr[s]).join(' · ')} · ${inS ? 'şu an mevsiminde' : 'şu an mevsimi dışında'}</small>
        <small>🌱 Envanter: ×${view.vouchers[id] || 0}</small>
        ${ezgiPick ? '<small class="choice-note">🌷 Ezgi’nin Seçimi · bugün ek %15 indirimli</small>' : ''}</span>
        <button type="button" data-buy="seed" data-flower="${id}" ${c < f.seed ? 'disabled' : ''}>Satın al · ${f.seed} 🪙</button></div>`;
    }).join('');
  } else if (shopTab === 'hive') {
    html = `<div class="shop-item"><span class="big">🐝</span>
      <span class="info"><b>Yeni kovan</b><small>10 arı kapasitesi, 20 kg bal. İçinde 4 arıyla gelir. Yanına çiçek ekmeyi unutma.</small></span>
      <button type="button" data-buy="hive" ${c < view.hiveCost ? 'disabled' : ''}>${view.hiveCost} 🪙</button></div>`;
  } else if (shopTab === 'decor') {
    const icons = { cit: '🪵', bank: '🪑', fener: '🏮', kemer: '🌸', cesme: '⛲' };
    html = Object.entries(view.decor).filter(([, d]) => !d.prize).map(([id, d]) => `<div class="shop-item"><span class="big">${icons[id] || '✨'}</span>
      <span class="info"><b>${esc(d.name)}</b><small>${esc(d.desc)} Karenin kenarına konur, kovan ya da çiçekle birlikte durabilir.</small></span>
      <button type="button" data-buy="decor" data-decor="${id}" ${c < d.cost ? 'disabled' : ''}>${d.cost} 🪙</button></div>`).join('');
  } else {
    html = `<div class="shop-item"><span class="big">🌾</span>
      <span class="info"><b>Yeni arazi karesi</b><small>Adanı büyütür. Her yeni kare bir öncekinden pahalıdır.</small></span>
      <button type="button" data-buy="land" ${c < view.tilePrice ? 'disabled' : ''}>${view.tilePrice} 🪙</button></div>`;
  }
  $('shop-body').innerHTML = html;
}
$('shop-body').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-buy]');
  if (!b || b.disabled) return;
  const kind = b.dataset.buy;
  if (kind === 'seed') {
    await doAct('buySeed', b.dataset.flower);
    renderShop(true);
  }
  else if (kind === 'hive') startPlacing({ type: 'hive' }, 'Kovanı koymak için boş bir kare seç');
  else if (kind === 'decor') startPlacing({ type: 'decor', decor: b.dataset.decor }, `${view.decor[b.dataset.decor].name} için adandan bir kare seç`);
  else startPlacing({ type: 'land' }, 'Satın almak için adanın kenarından bir kare seç');
});

$('open-guide').addEventListener('click', () => { $('guide-modal').hidden = false; });
$('guide-close').addEventListener('click', () => { $('guide-modal').hidden = true; });
$('guide-modal').addEventListener('click', (e) => { if (e.target === $('guide-modal')) $('guide-modal').hidden = true; });

const RELEASE_SEEN_KEY = 'neroBeeLastReleaseSeen';
function showWhatsNew(markSeen = true) {
  $('whats-new-version').textContent = RELEASE_NOTES.eyebrow;
  $('whats-new-title').textContent = RELEASE_NOTES.title;
  $('whats-new-intro').textContent = RELEASE_NOTES.intro;
  $('whats-new-list').innerHTML = RELEASE_NOTES.items.map((item) =>
    `<article class="whats-new-item"><span class="ico">${esc(item.icon)}</span><div><b>${esc(item.title)}</b><p>${esc(item.text)}</p></div></article>`
  ).join('');
  $('whats-new-modal').hidden = false;
  if (markSeen) {
    try { localStorage.setItem(RELEASE_SEEN_KEY, RELEASE_NOTES.version); } catch (_) { /* depolama kapalıysa sessiz geç */ }
  }
}
function closeWhatsNew() { $('whats-new-modal').hidden = true; }
function maybeShowWhatsNew() {
  if (!view || !view.tutorialDone || !$('whats-new-modal').hidden) return;
  let seen = null;
  try { seen = localStorage.getItem(RELEASE_SEEN_KEY); } catch (_) { /* sessiz geç */ }
  if (seen !== RELEASE_NOTES.version) showWhatsNew(true);
}
$('whats-new-close').addEventListener('click', closeWhatsNew);
$('whats-new-modal').addEventListener('click', (e) => { if (e.target === $('whats-new-modal')) closeWhatsNew(); });
$('open-whats-new').addEventListener('click', () => { $('guide-modal').hidden = true; showWhatsNew(false); });

// ---------------------------------------------------------------------------
// Sesler: gerçek OGG kayıtları + sentez fallback
// ---------------------------------------------------------------------------
let soundOn = true;
let notificationSoundOn = true;
let audioPrefs = {};
let actx = null;

function gameWindowAudible() { return document.visibilityState === 'visible'; }
function sfxAllowed(key) { return soundOn && gameWindowAudible() && audioPrefs[key] !== false; }
function notificationAllowed(group) {
  const key = { orders: 'notifyOrders', hive: 'notifyHive', merchant: 'notifyMerchant', special: 'notifySpecial' }[group] || 'notifySpecial';
  return notificationSoundOn && gameWindowAudible() && audioPrefs[key] !== false;
}

function ensureAudioContext() {
  try {
    actx = actx || new AudioContext();
    if (actx.state === 'suspended') actx.resume().catch(() => {});
    return actx;
  } catch (_) { return null; }
}

function tone(freq, dur, type = 'sine', gain = 0.08, delay = 0, glide = null, force = false) {
  if ((!soundOn && !force) || !gameWindowAudible()) return;
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.03);
  } catch (_) { /* ses yoksa sessiz geç */ }
}

const SAMPLES = {};
let samplesReady = false;
async function loadSamples() {
  try {
    if (!window.bee || typeof window.bee.sounds !== 'function') return;
    const files = await window.bee.sounds();
    const ctx = ensureAudioContext();
    if (!ctx) return;
    await Promise.all(Object.entries(files || {}).map(async ([name, data]) => {
      const u8 = data instanceof Uint8Array ? data : new Uint8Array(data);
      const copy = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
      SAMPLES[name] = await ctx.decodeAudioData(copy);
    }));
    samplesReady = Object.keys(SAMPLES).length > 0;
  } catch (_) { samplesReady = false; }
}
loadSamples();

function sampleNames(base) { return Object.keys(SAMPLES).filter((n) => n === base || n.startsWith(`${base}_`)); }

function play(base, { gain = 0.5, pan = 0, rate = 1, jitter = 0.05, delay = 0, force = false } = {}) {
  if ((!soundOn && !force) || !gameWindowAudible() || !samplesReady) return false;
  const names = sampleNames(base);
  if (!names.length) return false;
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return false;
    const src = ctx.createBufferSource();
    src.buffer = SAMPLES[names[Math.floor(Math.random() * names.length)]];
    src.playbackRate.value = rate * (1 + (Math.random() * 2 - 1) * jitter);
    const g = ctx.createGain();
    g.gain.value = gain * (1 + (Math.random() * 2 - 1) * 0.1);
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    src.connect(g).connect(p).connect(ctx.destination);
    src.start(ctx.currentTime + delay);
    return true;
  } catch (_) { return false; }
}

function playSlice(name, gain, dur) {
  try {
    if (!soundOn || !gameWindowAudible() || !SAMPLES[name]) return false;
    const ctx = ensureAudioContext();
    if (!ctx) return false;
    const src = ctx.createBufferSource();
    src.buffer = SAMPLES[name];
    const g = ctx.createGain();
    const t = ctx.currentTime;
    const actualDur = Math.min(dur, Math.max(0.1, src.buffer.duration - 0.05));
    const maxOffset = Math.max(0, src.buffer.duration - actualDur - 0.05);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + actualDur);
    src.connect(g).connect(ctx.destination);
    src.start(t, Math.random() * maxOffset, actualDur);
    return true;
  } catch (_) { return false; }
}

const SFX = {
  coin: () => sfxAllowed('coin') && (play('coin', { gain: 0.45 }) || (tone(880, 0.09, 'triangle', 0.08), tone(1320, 0.12, 'triangle', 0.07, 0.07), true)),
  harvest: () => sfxAllowed('harvest') && (play('harvest', { gain: 0.5 }) || (tone(520, 0.1, 'triangle', 0.09, 0, 780), tone(780, 0.14, 'sine', 0.07, 0.09), true)),
  bell: () => sfxAllowed('success') && (play('bell', { gain: 0.4, jitter: 0.02 }) || (tone(988, 0.35, 'sine', 0.06), tone(1480, 0.3, 'sine', 0.04, 0.05), true)),
  buzz: () => sfxAllowed('place') && (SAMPLES.loop_bees ? playSlice('loop_bees', 0.25, 0.6) : (tone(220, 0.25, 'sawtooth', 0.025, 0, 260), true)),
  place: () => sfxAllowed('place') && (play('place', { gain: 0.5 }) || (tone(330, 0.08, 'square', 0.04), tone(495, 0.1, 'triangle', 0.05, 0.06), true)),
  plant: () => sfxAllowed('plant') && (play('plant', { gain: 0.45, jitter: 0.08 }) || (tone(430, 0.08, 'triangle', 0.045), true)),
  paper: () => sfxAllowed('paper') && (play('paper', { gain: 0.55 }) || (tone(360, 0.08, 'triangle', 0.04), true)),
  success: () => sfxAllowed('success') && (play('success', { gain: 0.45, jitter: 0.02 }) || (tone(784, 0.12, 'sine', 0.05), tone(1175, 0.16, 'sine', 0.04, 0.08), true)),
  err: () => sfxAllowed('error') && (play('error', { gain: 0.4, jitter: 0.02 }) || (tone(200, 0.18, 'sine', 0.06, 0, 140), true))
};

function playNotification(group = 'special') {
  if (!notificationAllowed(group)) return false;
  return play('bell', { gain: 0.4, jitter: 0.02, force: true }) ||
    (tone(988, 0.35, 'sine', 0.06, 0, null, true), tone(1480, 0.3, 'sine', 0.04, 0.05, null, true), true);
}

function updateSoundBtn() { $('sound-btn').textContent = soundOn ? '🔊' : '🔇'; }
$('sound-btn').addEventListener('click', () => { ensureAudioContext(); doAct('setting', 'sfx', !soundOn); });
window.addEventListener('pointerdown', ensureAudioContext, { once: true, capture: true });
window.addEventListener('keydown', ensureAudioContext, { once: true, capture: true });
updateSoundBtn();

// ---------------------------------------------------------------------------
// Nero: köşeden laf atar
// ---------------------------------------------------------------------------
// Nero: köşeden laf atar
// ---------------------------------------------------------------------------
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const NERO = {
  hello: ['Arılar çalışıyor, sen de çalış bari.', 'Hoş geldin arıcı. Bal kendiliğinden toplanmıyor.', 'Kovanlara bir bak, bence doldular.'],
  idle: ['Bu arılar benden çalışkan. Bunu kimseye söyleme.', 'Kış gelmeden bal biriktir. Tavsiye veriyorum, bedava.', 'Çiçek ekmeyen arıcı, bal bulamaz. Atasözü değil, benim sözüm.',
    'Riskçi Kaya yine bir şeyler çeviriyor gibi.', 'Siparişlere baktın mı? Köylüler bekliyor.', 'Biraz daha arı alsan fena olmaz.'],
  harvest: ['Bal geldi! Kokusu buraya kadar geliyor.', 'Güzel hasat. Bir kaşık da bana ayır.', 'Arıcı iyi iş çıkardı. Sen de fena değilsin.'],
  sell: ['Para kazandık! Harcamadan önce bana danış.', 'Ticaret erbabısın.', 'Jetonlar şıngırdıyor, hoşuma gitti.'],
  order: ['Birisi bal istiyor, kapıda bekliyor!', 'Yeni sipariş var. İyi para veriyorlar.'],
  delivered: ['Müşteri mutlu, ben mutlu.', 'Teslimat tamam! Ünün yayılıyor.'],
  penalty: ['Yetiştiremedik… Bir dahakine kabul etmeden önce depoya bak.', 'Ceza yedik. Moral bozmak yok.'],
  born: ['Yeni bir arı doğdu! Adını ben koyayım: Vızvız.', 'Aileye yeni bir arı katıldı.'],
  winter: ['Arılar üşüyor, şurup ver!', 'Kışın aç arı olmaz. Şurup lazım.'],
  upgrade: ['Kovan büyüdü, arılar mutlu.', 'Yeni kraliçe geldi. Tebrik ederim, majesteleri.'],
  place: ['Güzel seçim.', 'Tam yerine koydun.'],
  rival: ['Rakipler boş durmuyor.', 'Liderlik tablosuna bir bak istersen.'],
  click: ['Beni dürtme, arılara bak.', 'Buradayım, izliyorum.', 'Vız vız. Arı taklidi yaptım, beğendin mi?', 'Bir kavanoz bal kaç jeton? Soruyorum sadece.']
};
let bubbleTimer = null;
function say(text) {
  const b = $('nero-bubble');
  b.textContent = text;
  b.hidden = false;
  $('nero').classList.remove('talk');
  void $('nero').offsetWidth;
  $('nero').classList.add('talk');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => { b.hidden = true; }, 4800);
}

let lastDialogueTopic = null;
function sayTopic(topic, vars = {}) {
  const line = pickBeeDialogue(topic, vars);
  if (!line) return false;
  lastDialogueTopic = topic;
  say(line);
  return true;
}
function hiveVar(id) {
  return (id && view && view.hives && view.hives[id] && view.hives[id].name) || 'Kovan';
}
function hiveFromMessage(msg) {
  if (!view || !view.hives) return 'Kovan';
  const h = Object.values(view.hives).find((x) => msg.includes(x.name));
  return h ? h.name : 'Kovan';
}

$('nero').addEventListener('click', () => { const h = view && view.hints && view.hints[0]; say(h && Math.random() < 0.6 ? h.text : pick(NERO.click)); });
setInterval(() => { if ($('nero-bubble').hidden && Math.random() < 0.5) say(pick(NERO.idle)); }, 70000);

// Göz takibi ve göz kırpma
document.addEventListener('mousemove', (e) => {
  const r = $('nero').getBoundingClientRect();
  const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 300));
  const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.4)) / 300));
  document.querySelectorAll('#nero .pupil').forEach((p, i) => {
    p.setAttribute('cx', (i ? 132 : 84) + dx * 6);
    p.setAttribute('cy', 112 + dy * 7);
  });
});

function react(action, res, a, b) {
  if (!res.ok) { SFX.err(); return; }
  const vars = { hive: hiveVar(a) };
  const topicByAction = {
    sellHoney: 'honey_market_sold',
    deliverOrder: 'order_delivered',
    upgrade: 'hive_upgraded',
    upgradeStorage: 'storage_upgraded',
    placeHive: 'hive_placed',
    buyTile: 'plot_placed',
    plantSeed: 'seed_planted',
    buyBee: 'bee_bought',
    sellBee: 'bee_sold',
    syrup: 'bee_syrup_used',
    makeCandle: 'candle_made',
    sellCandles: 'candle_sold',
    claimQuest: 'daily_task_reward_claimed',
    merchantBuy: 'traveler_yakup_bought',
    merchantSell: 'traveler_yakup_honey_sold',
    enterFestival: 'honey_festival_entry_submitted',
    medicine: 'bee_disease_recovered_medicine'
  };
  const topic = topicByAction[action];

  if (['sellHoney', 'deliverOrder', 'sellCandles', 'merchantSell', 'claimQuest', 'buySeed'].includes(action)) SFX.coin();
  else if (['upgrade', 'upgradeStorage', 'enterFestival'].includes(action)) SFX.success();
  else if (['plantSeed', 'replant'].includes(action)) SFX.plant();
  else if (action === 'readLetter') SFX.paper();
  else if (['placeHive', 'buyTile', 'placeDecor', 'buyBee', 'syrup', 'syrupAll', 'acceptOrder', 'swapOrder', 'merchantBuy', 'medicine', 'changeBreed', 'makeCandle'].includes(action)) SFX.place();

  if (topic) {
    if (action === 'medicine' && Math.random() < 0.25) sayTopic('bee_immunity_started', vars);
    else sayTopic(topic, vars);
  }
  if (action === 'readLetter' && res.msg && res.msg.includes('hediyesi')) sayTopic('villager_letter_gift_claimed');
  if (action === 'rejectOrder') sayTopic('villager_relationship_down');
}

function reactEvent(e) {
  const m = e.msg || '';
  const hive = hiveFromMessage(m);
  let topic = e.topic || null;
  let vars = e.vars || {};

  if (!topic && m.startsWith('🤒') && m.includes('hastalandı')) { topic = 'bee_disease_started'; vars = { hive }; }
  else if (!topic && m.includes('hasta kovanda bir arı öldü')) { topic = 'bee_disease_loss'; vars = { hive }; }
  else if (!topic && m.startsWith('🛡️') && m.includes('hastalığı atlattı')) { topic = Math.random() < 0.7 ? 'bee_disease_recovered_natural' : 'bee_immunity_started'; vars = { hive }; }
  else if (!topic && m.includes('kışın aç kalan bir arı öldü')) { topic = 'bee_winter_loss'; vars = { hive }; }
  else if (!topic && m.includes('yeni bir arı doğdu')) { topic = 'bee_born'; vars = { hive }; }
  else if (!topic && m.includes('depoya eklendi')) { topic = 'honey_harvest'; vars = { hive }; }
  else if (!topic && m.startsWith('📖 Bal Defteri')) topic = 'honey_journal_unlocked';
  else if (!topic && m.startsWith('✅ Günlük görev tamamlandı')) topic = 'daily_task_completed';
  else if (!topic && m.startsWith('📜 Yeni sipariş')) { topic = 'order_arrived'; }
  else if (!topic && m.includes('Sipariş yetişmedi')) { topic = 'order_failed'; }
  else if (!topic && m.startsWith('🏘️ Köye yeni biri taşındı:')) topic = 'villager_arrived';
  else if (!topic && (/^(🏪|🏛️) Köyde/u.test(m) || m.startsWith('🌷 Kasabaya yeni biri yerleşti!'))) topic = 'village_building_unlocked';
  else if (!topic && m.includes('Köyün ilk halkası doldu')) topic = 'village_ring_completed';
  else if (!topic && m.startsWith('💛')) topic = 'villager_relationship_up';
  else if (!topic && m.startsWith('✉️') && m.includes('hediye')) topic = 'villager_gift_letter_arrived';
  else if (!topic && m.startsWith('✉️')) topic = 'villager_letter_arrived';
  else if (!topic && m.startsWith('📖') && m.includes('sana bir hikâye anlatmak istiyor')) {
    topic = 'villager_story_unlocked';
    vars = { villager: m.slice(2).split(' sana')[0].trim() };
  } else if (!topic && m.startsWith('📖') && m.includes('Sıradaki:')) {
    topic = 'villager_story_step1_completed';
    vars = { villager: m.slice(2).split(':')[0].trim() };
  } else if (!topic && m.startsWith('📖') && m.includes('Son adım:')) {
    topic = 'villager_story_step2_completed';
    vars = { villager: m.slice(2).split(':')[0].trim() };
  } else if (!topic && m.startsWith('🌟') && m.includes('hikâyesi tamamlandı')) {
    topic = 'villager_story_completed';
    const who = (view.stories || []).find((x) => m.includes(x.title));
    vars = { villager: who ? who.who : 'Köylü' };
  } else if (!topic && m.startsWith('🛒 Gezgin satıcı Seyyah Yakup köye geldi')) topic = 'traveler_yakup_arrived';
  else if (!topic && m.startsWith('🛒 Seyyah Yakup köyden ayrıldı')) topic = 'traveler_yakup_left';
  else if (!topic && m.startsWith('🎉 Festival!')) topic = 'market_price_festival_started';
  else if (!topic && (m.startsWith('🏆 Bal festivalinde') || m.startsWith('🎪 Bal festivalinde'))) topic = 'honey_festival_result';
  else if (!topic && /Temkinli Ali|Riskçi Kaya|Dengeli Nur/.test(m)) topic = 'rival_event';
  else if (!topic && m.includes("Nero'da bir iş bitirdin")) topic = 'nero_todo_coin_reward';

  if (m.includes('depoya eklendi')) SFX.harvest();
  else if (m.includes('yeni bir arı doğdu')) SFX.buzz();
  else if (m.startsWith('📜 Yeni sipariş') || m.includes('Sipariş yetişmedi')) playNotification('orders');
  else if (m.startsWith('🤒') || m.includes('öldü') || m.includes('Şurup ver')) playNotification('hive');
  else if (m.startsWith('🛒 Gezgin')) playNotification('merchant');
  else if (m.startsWith('✉️') || m.startsWith('🎉 Festival!') || m.startsWith('🌷 Kasabaya') || m.startsWith('🏆') || m.startsWith('🏪') || m.startsWith('🏛️')) playNotification('special');
  else if (m.startsWith('🌟') || m.startsWith('🏘️')) SFX.success();

  if (topic) sayTopic(topic, vars);
}

// ---------------------------------------------------------------------------
// Mevsime göre görünüm: çim, yapraklar, gökyüzü, kışın kar
// ---------------------------------------------------------------------------
const SEASON_COLORS = {
  ilkbahar: { owned: 0x86CC55, wild: 0x9AAE6B, buy: 0xAFC47C, leaf: 0x5FA24E, leaf2: 0x77B85E, pine: 0x3F8A57 },
  yaz:      { owned: 0x9AD14E, wild: 0xB3B866, buy: 0xC4CC7A, leaf: 0x4F9A3E, leaf2: 0x6CB04C, pine: 0x357A49 },
  sonbahar: { owned: 0xB9B45A, wild: 0xC0A162, buy: 0xCDB478, leaf: 0xD9803A, leaf2: 0xE6A33E, pine: 0x4F7A4A },
  kis:      { owned: 0xE9EEF2, wild: 0xD6DEE4, buy: 0xDDE6EC, leaf: 0xB9C8C2, leaf2: 0xD5DEDA, pine: 0x5E8A72 }
};
let currentSeason = null;
function applySeason(season) {
  if (season === currentSeason) return;
  const first = currentSeason === null;
  currentSeason = season;
  const c = SEASON_COLORS[season];
  M.grassOwned.color.setHex(c.owned);
  M.grassWild.color.setHex(c.wild);
  M.grassBuy.color.setHex(c.buy);
  M.leaf.color.setHex(c.leaf);
  M.leafLight.color.setHex(c.leaf2);
  M.pine.color.setHex(c.pine);
  document.body.className = `season-${season}`;
  weatherFx();
  if (!first) {
    sayTopic('season_changed');
    SFX.bell();
  }
}

let precip = null; // 'snow' | 'rain' | null
function weatherFx() {
  if (!view) return;
  precip = !GFX[gfx].precip ? null : view.weather.id === 'karli' ? 'snow' : view.weather.id === 'yagmurlu' ? 'rain' : null;
  $('snow').hidden = !precip;
}
const snowCanvas = $('snow');
const sctx = snowCanvas.getContext('2d');
const flakes = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.4, s: 0.02 + Math.random() * 0.04, w: Math.random() * 6 }));
function drawSnow(t) {
  if (snowCanvas.hidden) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (snowCanvas.width !== w || snowCanvas.height !== h) { snowCanvas.width = w; snowCanvas.height = h; }
  sctx.clearRect(0, 0, w, h);
  if (precip === 'rain') {
    sctx.strokeStyle = 'rgba(120,150,190,.45)';
    sctx.lineWidth = 1.4;
    for (const f of activeFlakes()) {
      f.y += f.s * 6 / 60;
      if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); }
      const x = f.x * w;
      const y = f.y * h;
      sctx.beginPath(); sctx.moveTo(x, y); sctx.lineTo(x - 3, y + 14); sctx.stroke();
    }
    return;
  }
  sctx.fillStyle = 'rgba(255,255,255,.9)';
  for (const f of activeFlakes()) {
    f.y += f.s / 60;
    if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); }
    const x = (f.x + Math.sin(t * 0.8 + f.w) * 0.01) * w;
    sctx.beginPath();
    sctx.arc(x, f.y * h, f.r, 0, Math.PI * 2);
    sctx.fill();
  }
}

// ---------------------------------------------------------------------------
// Sen yokken özeti
// ---------------------------------------------------------------------------
function showAway(s) {
  const t = s.minutes >= 60 ? `${Math.floor(s.minutes / 60)} saat ${s.minutes % 60} dakika` : `${s.minutes} dakika`;
  $('away-time').textContent = `${t} yoktun. Bu arada olanlar:`;
  const items = [];
  items.push([`🍯 ${s.produced.toFixed(1)} kg bal üretildi`, false]);
  if (s.born) items.push([`🐝 ${s.born} yeni arı doğdu`, false]);
  if (s.died) items.push([`😢 ${s.died} arı öldü`, true]);
  if (s.ordersIn) items.push([`📜 ${s.ordersIn} yeni sipariş geldi`, false]);
  if (s.full) items.push([`🧺 ${s.full} kovan dolu, hasat bekliyor`, true]);
  if (s.sick) items.push([`🤒 ${s.sick} kovan hasta`, true]);
  if (s.passedBy) items.push([`🏆 ${s.passedBy} seni geçti (şu an ${s.rank}. sıradasın)`, true]);
  else if (s.rank < s.oldRank) items.push([`🏆 Sıralamada yükseldin: ${s.rank}. sıradasın`, false]);
  $('away-list').innerHTML = items.map(([txt, bad]) => `<li class="${bad ? 'bad' : ''}">${esc(txt)}</li>`).join('');
  $('away-modal').hidden = false;
  if (s.minutes >= 120) {
    sayTopic('farm_production_paused_inactivity');
    setTimeout(() => sayTopic('farm_production_resumed'), 5200);
  } else sayTopic('return_after_absence');
}
$('away-ok').addEventListener('click', () => { $('away-modal').hidden = true; });

// ---------------------------------------------------------------------------
// İlk açılış tanıtımı
// ---------------------------------------------------------------------------
const TOUR = [
  'Selam arıcı! Ben Nero. Burası senin adan. Sürükleyerek gezebilir, tekerlekle yakınlaşabilirsin.',
  'Evin yanındaki kutu senin ilk kovanın. Arılar sadece kovanın yanındaki 6 karede ekili çiçeklerden bal yapar.',
  'Boş bir kareye tıkla: kovan koyabilir ya da tohum ekebilirsin. Aynı çiçekten 3 tarhı yan yana ekersen daha çok üretir.',
  'Kovan dolunca üstünde "Dolu!" yazar. Kovana tıklayıp Hasat Et de, arıcı balı depoya taşısın.',
  'Balı Pazar\'da satabilir ya da köylülerin siparişlerini teslim edebilirsin. Siparişler daha iyi öder.',
  'Takıldığın bir şey olursa Rehber\'e bak. Rakiplerin de var, liderlik tablosundan takip et. Kolay gelsin!'
];
let tourIdx = 0;
function startTour() { tourIdx = 0; $('tour').hidden = false; showTourStep(); }
function showTourStep() {
  $('tour-step').textContent = `${tourIdx + 1} / ${TOUR.length}`;
  $('tour-text').textContent = TOUR[tourIdx];
  $('tour-next').textContent = tourIdx === TOUR.length - 1 ? 'Başlayalım' : 'İleri';
  $('nero').classList.remove('talk'); void $('nero').offsetWidth; $('nero').classList.add('talk');
}
function endTour() { $('tour').hidden = true; window.bee.act('finishTutorial'); say('Hadi bakalım, bal zamanı!'); }
$('tour-next').addEventListener('click', () => { if (tourIdx >= TOUR.length - 1) endTour(); else { tourIdx += 1; showTourStep(); } });
$('tour-skip').addEventListener('click', endTour);

// ---------------------------------------------------------------------------
// Liderlik
// ---------------------------------------------------------------------------
let boardOpen = false;
let boardSig = '';
const BOARD_AV = { me: '🧑‍🌾', ali: '🧓', kaya: '🤠', nur: '👩‍🌾' };
function openBoard() { boardOpen = true; $('board-modal').hidden = false; renderBoard(true); }
function closeBoard() { boardOpen = false; $('board-modal').hidden = true; }
$('open-board').addEventListener('click', openBoard);
$('board-close').addEventListener('click', closeBoard);
$('board-modal').addEventListener('click', (e) => { if (e.target === $('board-modal')) closeBoard(); });

function renderBoard(force = false) {
  if (!boardOpen || !view) return;
  const rows = view.leaderboard;
  const sig = JSON.stringify(rows.map((r) => [r.id, r.nw, r.rank]));
  if (!force && sig === boardSig) return;
  boardSig = sig;
  $('board-list').innerHTML = rows.map((r) => {
    const pct = Math.round(r.last * 1000) / 10;
    const cls = pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat';
    const txt = pct > 0 ? `+%${pct}` : pct < 0 ? `-%${Math.abs(pct)}` : '%0';
    return `<li class="brow${r.me ? ' me' : ''}">
      <span class="rk">${r.rank}</span>
      <span class="av">${BOARD_AV[r.id] || '🙂'}</span>
      <span class="nm"><b>${esc(r.name)}</b><small>${esc(r.style)}</small></span>
      ${sparkline(r.history)}
      <span class="nw"><b>${r.nw.toLocaleString('tr-TR')} 🪙</b><small class="${cls}">${txt} dün</small></span>
    </li>`;
  }).join('');
}

// ---------------------------------------------------------------------------
// Siparişler
// ---------------------------------------------------------------------------
let ordersOpen = false;
let ordersSig = '';
const AVATARS = {
  'Ayşe Teyze': '👵', 'Mehmet Usta': '👨‍🔧', 'Küçük Elif': '👧', 'Fırıncı Leyla': '👩‍🍳', 'Kasabalı Cem': '🧑‍🌾',
  'Hacer Nine': '👵', 'Muhtar Rıza': '👴', 'Pastacı Nur': '👩‍🍳', 'Öğretmen Selin': '👩‍🏫', 'Balıkçı Kemal': '🎣',
  'Doktor Aslı': '👩‍⚕️', 'Bakkal Hüseyin': '🧔'
};
function openOrders() { ordersOpen = true; $('orders-modal').hidden = false; renderOrders(true); }
function closeOrders() { ordersOpen = false; $('orders-modal').hidden = true; }
$('open-orders').addEventListener('click', openOrders);
$('orders-close').addEventListener('click', closeOrders);
$('orders-modal').addEventListener('click', (e) => { if (e.target === $('orders-modal')) closeOrders(); });

// Oyun zamanını "2 gün 5 sa" gibi yaz
function gameLeft(ms, dayMs) {
  const days = ms / dayMs;
  const d = Math.floor(days);
  const h = Math.floor((days - d) * 24);
  return d ? `${d} gün ${h} sa` : `${h} sa`;
}
function realLeft(ms, speed) {
  if (!speed) return 'duraklatıldı';
  const s = Math.ceil(ms / speed / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function hearts(who) {
  const h = (view.customers[who] || {}).hearts || 0;
  return h ? ` <span class="hearts">${'♥'.repeat(h)}${'♡'.repeat(view.heartMax - h)}</span>` : '';
}

function renderVillagers() {
  const list = Object.entries(view.customers).filter(([, c]) => c.delivered > 0).sort((a, b) => b[1].delivered - a[1].delivered);
  $('villagers').innerHTML = list.length
    ? `<h3>💛 Köylüler</h3><ul>${list.map(([n, c]) => `<li>${AVATARS[n] || '🙂'} ${esc(n)} <span class="hearts">${'♥'.repeat(c.hearts)}${'♡'.repeat(view.heartMax - c.hearts)}</span></li>`).join('')}</ul>
       <p class="note" style="margin:6px 0 0">Aynı köylüye teslim ettikçe kalp kazanırsın; her kalp siparişlerini %6 daha iyi ödetir, bazıları hediye gönderir.</p>`
    : '';
}

function renderOrders(force = false) {
  if (!view) return;
  const o = view.orders;
  const openCount = o.list.filter((x) => x.status === 'open').length;
  const badge = $('orders-badge');
  badge.hidden = !o.list.length;
  badge.textContent = String(o.list.length);
  if (!ordersOpen) return;

  const meta = `${o.list.length} / ${o.max} sipariş · ` + (o.nextInMs === null ? 'liste dolu' : `yeni sipariş: ${view.speed ? realLeft(o.nextInMs, 1) : 'duraklatıldı'}`);
  $('orders-meta').innerHTML = `<span>${meta}</span><span>${openCount} yeni</span>`;
  // Kalan süreler her saniye değişir; listeyi sadece yapı değişince yeniden kur
  const sig = JSON.stringify([o.list.map((x) => [x.id, x.status, x.have >= x.kg, Math.floor(view.coins / 10)]), view.customers, $('order-sort').value]);
  if (!force && sig === ordersSig) {
    for (const x of o.list) {
      const el = document.querySelector(`[data-left="${x.id}"]`);
      if (el && x.leftMs !== null) el.textContent = `⏳ ${gameLeft(x.leftMs, view.dayMs)} kaldı`;
    }
    return;
  }
  ordersSig = sig;
  renderVillagers();
  if (!o.list.length) {
    $('order-list').innerHTML = `<li class="order-empty">${o.planted ? 'Şu an sipariş yok. Yakında biri kapını çalar.' : 'Hiç çiçek ekmedin. Sipariş gelmesi için önce tohum ek.'}</li>`;
    return;
  }
  const sortBy = $('order-sort').value;
  const sorted = o.list.slice().sort((p, q) => {
    if (sortBy === 'reward') return q.reward - p.reward;
    if (sortBy === 'ready') return (q.have >= q.kg) - (p.have >= p.kg) || (p.leftMs ?? 1e15) - (q.leftMs ?? 1e15);
    return (p.leftMs ?? 1e15) - (q.leftMs ?? 1e15);
  });
  $('deliver-ready').disabled = !o.list.some((x) => x.status === 'accepted' && x.have + 1e-6 >= x.kg);
  $('order-list').innerHTML = sorted.map((x, i) => {
    const f = view.flowers[x.flower];
    const enough = x.have + 1e-6 >= x.kg;
    const accepted = x.status === 'accepted';
    const avatar = AVATARS[x.who] || '🙂';
    const timeTag = accepted
      ? `<span class="${x.leftMs < view.dayMs ? 'warn' : ''}" data-left="${x.id}">⏳ ${gameLeft(x.leftMs, view.dayMs)} kaldı</span>`
      : `<span>⏳ ${x.days} gün süre</span>`;
    const btns = accepted
      ? `<button class="primary" data-order="deliverOrder" data-id="${x.id}" ${enough ? '' : 'disabled'}>Teslim et</button>
         <button class="danger" data-order="rejectOrder" data-id="${x.id}">Vazgeç (-${x.penalty} 🪙)</button>`
      : `<button class="primary" data-order="acceptOrder" data-id="${x.id}">Kabul et</button>
         <button data-order="swapOrder" data-id="${x.id}" ${view.coins < o.swapCost ? 'disabled' : ''}>Değiştir (${o.swapCost} 🪙)</button>
         <button class="danger" data-order="rejectOrder" data-id="${x.id}">Reddet</button>`;
    return `<li class="order${accepted ? ' accepted' : ''}">
      <div class="order-top">
        <span class="avatar" style="background:${f.color}">${avatar}</span>
        <span class="who"><b>${esc(x.who)}${hearts(x.who)}</b><span>${x.kg} kg ${esc(f.name)} Balı istiyor${x.fav ? ' · ❤️ en sevdiği bal' : ''}${x.special ? ' · 📅 düzenli sipariş' : ''}</span></span>
        <span class="reward">+${x.reward} 🪙</span>
      </div>
      <div class="tags">
        ${enough ? '<span class="ready-tag">✓ hazır</span>' : ''}<span class="${enough ? 'ok' : ''}">Depoda ${x.have.toFixed(1)} / ${x.kg} kg</span>
        ${timeTag}
      </div>
      <p class="note">${accepted ? 'Süresinde teslim edemezsen' : 'Kabul edip süresinde teslim edemezsen'} ödemenin %20'si (${x.penalty} 🪙) kesilir.</p>
      <div class="btns">${btns}</div>
    </li>`;
  }).join('');
}

$('order-list').addEventListener('click', (e) => {
  const b = e.target.closest('[data-order]');
  if (!b || b.disabled) return;
  doAct(b.dataset.order, b.dataset.id);
});

// ---------------------------------------------------------------------------
// Pazar ve Depo
// ---------------------------------------------------------------------------
let marketOpen = false;
function openMarket() { marketOpen = true; $('market-modal').hidden = false; renderMarket(true); }
function closeMarket() { marketOpen = false; $('market-modal').hidden = true; }
$('open-market').addEventListener('click', openMarket);
$('storage-chip').addEventListener('click', openMarket);
$('market-close').addEventListener('click', closeMarket);
$('market-modal').addEventListener('click', (e) => { if (e.target === $('market-modal')) closeMarket(); });

function sparkline(values) {
  if (!values || values.length < 2) return '<svg viewBox="0 0 70 28"></svg>';
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 66 + 2},${24 - ((v - lo) / span) * 20}`).join(' ');
  const up = values[values.length - 1] >= values[0];
  return `<svg viewBox="0 0 70 28" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${up ? '#3E8F52' : '#C9574C'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

let marketSig = '';
function renderMarket(force = false) {
  if (!marketOpen || !view) return;
  const sig = JSON.stringify([view.market, view.marketForecast, view.storage, Math.floor(view.coins), view.storageCap, view.marketEvent, view.calendar.season, view.wax, view.candles, view.festival]);
  if (!force && sig === marketSig) return;
  marketSig = sig;
  const season = view.calendar.season;
  const sp = view.seasonPrice;
  $('m-season').textContent = sp > 1 ? `${view.calendar.seasonName}: bal %${Math.round((sp - 1) * 100)} daha değerli`
    : sp < 1 ? `${view.calendar.seasonName}: bal %${Math.round((1 - sp) * 100)} daha ucuz` : `${view.calendar.seasonName}: normal fiyatlar`;
  const ev = view.marketEvent;
  $('m-festival').hidden = !ev;
  if (ev) $('m-festival').textContent = `🎉 Festival: ${view.flowers[ev.flower].name} balı %${ev.pct} daha değerli!`;

  const fc = view.marketForecast;
  $('m-forecast').hidden = !fc;
  if (fc) {
    $('m-forecast').textContent = '🔮 Yarın: ' + fc.rows.map((x) => `${view.flowers[x.flower].name} ${x.direction === 'up' ? '↑ yükselebilir' : '↓ düşebilir'}`).join(' · ');
  }

  let entries = Object.entries(view.flowers);
  if ($('market-mine').checked) entries = entries.filter(([f]) => (view.storage[f] || 0) >= 0.05);
  const ms = $('market-sort').value;
  if (ms === 'price') entries.sort((p, q) => view.market[q[0]].price - view.market[p[0]].price);
  if (ms === 'stock') entries.sort((p, q) => (view.storage[q[0]] || 0) - (view.storage[p[0]] || 0));
  if (!entries.length) { $('market-list').innerHTML = '<li class="order-empty">Depoda satılacak bal yok.</li>'; }
  else $('market-list').innerHTML = entries.map(([f, def]) => {
    const m = view.market[f];
    const have = view.storage[f] || 0;
    const cls = m.change > 0 ? 'up' : m.change < 0 ? 'down' : 'flat';
    const sign = m.change > 0 ? '+' : m.change < 0 ? '-' : '';
    const dis = (kgNeed) => (have < Math.min(kgNeed, 0.05) || have < 0.05 ? 'disabled' : '');
    return `<li class="mrow${m.festival ? ' fest' : ''}">
      <span class="dot" style="background:${def.color}"></span>
      <span class="nm"><b>${esc(def.name)} Balı</b><small>Depoda ${have.toFixed(1)} kg</small></span>
      <span class="pr"><b>${m.price.toFixed(1)} 🪙</b><small class="${cls}">${sign}%${Math.abs(m.change)} · kg</small></span>
      ${sparkline(m.history)}
      <span class="sell">
        <button type="button" data-sell="${f}" data-kg="1" ${have < 1 ? 'disabled' : ''}>1 kg</button>
        <button type="button" data-sell="${f}" data-kg="5" ${have < 5 ? 'disabled' : ''}>5 kg</button>
        <button type="button" class="all" data-sell="${f}" data-kg="all" ${dis(0)}>Hepsi</button>
      </span>
    </li>`;
  }).join('');

  $('d-kg').textContent = `${view.storageKg.toFixed(1)} / ${view.storageCap} kg`;
  $('d-bar').style.width = `${Math.min(100, (view.storageKg / view.storageCap) * 100)}%`;
  const rows = Object.entries(view.storage).filter(([, v]) => v >= 0.05);
  $('depot-list').innerHTML = rows.length
    ? rows.map(([f, v]) => `<li><i style="background:${view.flowers[f].color}"></i><span>${esc(view.flowers[f].name)} Balı</span><b>${v.toFixed(1)} kg</b></li>`).join('')
    : '<li class="empty">Depo boş. Kovanlarını hasat et.</li>';
  $('wax-info').textContent = `${Math.round(view.wax * 1000)} g balmumu · ${view.candles} mum · mum ${view.candlePrice} 🪙`;
  const mc = $('make-candle');
  mc.innerHTML = `Mum yap <small>${view.candleWax * 1000} g balmumu</small>`;
  mc.disabled = view.wax + 1e-6 < view.candleWax;
  const sc = $('sell-candles');
  sc.innerHTML = `Mumları sat <small>+${view.candles * view.candlePrice} 🪙</small>`;
  sc.disabled = view.candles < 1;

  const fest = view.festival;
  const fb = $('fest-box');
  const cups = (fest.cups || []).map((c) => `${c.cup === 'altın' ? '🥇' : c.cup === 'gümüş' ? '🥈' : '🥉'} ${c.year}. yıl`).join(' · ');
  if (fest.open && !fest.entry) {
    const opts = Object.entries(view.storage).filter(([, v]) => v >= 1)
      .sort((a, b) => view.flowers[b[0]].price - view.flowers[a[0]].price)
      .map(([f, v]) => `<option value="${f}">${esc(view.flowers[f].name)} (${v.toFixed(1)} kg)</option>`).join('');
    fb.hidden = false;
    fb.innerHTML = `<b>🎪 Yıllık Bal Festivali başvuruları açık!</b><br>En değerli balını gönder (en fazla ${fest.maxKg} kg). Sonuçlar yeni yılda açıklanır; ilk üçe ödül ve kupa var.
      <div class="fest-row">${opts ? `<select id="fest-flower">${opts}</select><input id="fest-kg" type="number" min="1" max="${fest.maxKg}" step="0.5" value="${fest.maxKg}"><button type="button" id="fest-send">Gönder</button>` : 'Depoda en az 1 kg bal olmalı.'}</div>
      ${cups ? `<p>Kupaların: ${cups}</p>` : ''}`;
  } else if (fest.entry) {
    fb.hidden = false;
    fb.innerHTML = `<b>🎪 Festivale katıldın</b><br>${fest.entry.kg.toFixed(1)} kg ${esc(view.flowers[fest.entry.flower].name)} balı gönderdin. Sonuç yeni yılın ilk günü!${cups ? `<p>Kupaların: ${cups}</p>` : ''}`;
  } else {
    fb.hidden = !cups;
    fb.innerHTML = cups ? `<b>🏆 Kupaların</b><br>${cups}<br>Bir sonraki festival kışın son 3 gününde.` : '';
  }

  const nx = view.nextStorage;
  const up = $('d-upgrade');
  up.innerHTML = nx ? `📦 Depoyu büyüt · ${nx.cap} kg <small>${nx.cost} 🪙</small>` : 'Depo en büyük boyutta';
  up.disabled = !nx || view.coins < nx.cost;
}

$('market-list').addEventListener('click', (e) => {
  const b = e.target.closest('[data-sell]');
  if (!b || b.disabled) return;
  doAct('sellHoney', b.dataset.sell, b.dataset.kg);
});
$('d-upgrade').addEventListener('click', () => doAct('upgradeStorage'));
$('make-candle').addEventListener('click', () => doAct('makeCandle'));
$('sell-candles').addEventListener('click', () => doAct('sellCandles'));
$('fest-box').addEventListener('click', (e) => {
  if (e.target.id !== 'fest-send') return;
  doAct('enterFestival', $('fest-flower').value, Number($('fest-kg').value));
});

// ---------------------------------------------------------------------------
// Kovanın içi: solda petek, sağda bilgi ve eylemler
// ---------------------------------------------------------------------------
let openHiveId = null;
let clockSkew = 0;
const combCanvas = $('comb');
const cctx = combCanvas.getContext('2d');
let combCells = null;   // petek hücreleri (sabit düzen)
let combBees = [];

function openHive(id) {
  openHiveId = id;
  combCells = null;
  $('hive-modal').hidden = false;
  sizeComb();
  renderHive();
}
function closeHive() { openHiveId = null; $('hive-modal').hidden = true; }
$('hive-close').addEventListener('click', closeHive);
$('hive-modal').addEventListener('click', (e) => { if (e.target === $('hive-modal')) closeHive(); });

function sizeComb() {
  const r = combCanvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  combCanvas.width = Math.round(r.width * dpr);
  combCanvas.height = Math.round(r.height * dpr);
  cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  combCells = null;
}
window.addEventListener('resize', () => { if (openHiveId) sizeComb(); });

function buildComb(w, h) {
  const s = 17;                          // hücre yarıçapı
  const cw = s * SQ3;
  const cells = [];
  const cx = w / 2;
  const cy = h / 2 + 10;
  for (let row = -2; row * s * 1.5 < h + s * 2; row++) {
    for (let col = -1; col * cw < w + cw; col++) {
      const x = col * cw + (row % 2 ? cw / 2 : 0);
      const y = row * s * 1.5;
      const dx = (x - cx) / (w * 0.5);
      const dy = (y - cy) / (h * 0.62);
      if (x < -s || y < -s || x > w + s || y > h + s) continue; // sadece görünen hücreler
      cells.push({ x, y, d: Math.sqrt(dx * dx + dy * dy) + Math.random() * 0.06 });
    }
  }
  cells.sort((a, b) => a.d - b.d);
  return { s, cells };
}

function hexPath(ctx, x, y, s) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i - 30);
    const px = x + s * Math.cos(a);
    const py = y + s * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawComb(t) {
  if (!openHiveId || !view) return;
  const h = view.hives[openHiveId];
  if (!h) return;
  const w = combCanvas.clientWidth;
  const hh = combCanvas.clientHeight;
  if (!combCells) {
    combCells = buildComb(w, hh);
    combBees = Array.from({ length: 12 }, (_, i) => ({ a: Math.random() * 6.28, r: 30 + Math.random() * 120, sp: 0.2 + Math.random() * 0.4, ph: i }));
  }
  const { s, cells } = combCells;
  cctx.fillStyle = '#A77A45';
  cctx.fillRect(0, 0, w, hh);

  // Merkezde yavru (arı sayısına göre), çevresinde polen (çiçek renkleri), dışta bal
  const brood = Math.round(h.bees * 6);
  const pollenColors = (h.near.length ? h.near : ['yonca']).map((f) => view.flowers[f].petal === '#FFFFFF' ? view.flowers[f].color : view.flowers[f].petal);
  const pollen = Math.round(18 + h.near.length * 8);
  const honeyCells = Math.round((cells.length - brood - pollen) * Math.min(1, h.total / h.capKg));
  cells.forEach((c, i) => {
    let fill = '#C8995C';
    let glow = null;
    if (i < brood) fill = i % 3 === 0 ? '#F6EEDD' : '#D9AE6E';
    else if (i < brood + pollen) fill = pollenColors[i % pollenColors.length];
    else if (i < brood + pollen + honeyCells) { fill = '#F3BD3A'; glow = '#FFE08A'; }
    hexPath(cctx, c.x, c.y, s - 1.2);
    cctx.fillStyle = fill;
    cctx.fill();
    cctx.lineWidth = 2.4;
    cctx.strokeStyle = '#7E5530';
    cctx.stroke();
    if (glow) {
      cctx.beginPath();
      cctx.ellipse(c.x - s * 0.25, c.y - s * 0.3, s * 0.28, s * 0.16, -0.5, 0, Math.PI * 2);
      cctx.fillStyle = glow;
      cctx.globalAlpha = 0.7;
      cctx.fill();
      cctx.globalAlpha = 1;
    }
    if (i < brood && i % 3 === 0) {
      cctx.beginPath();
      cctx.arc(c.x, c.y, s * 0.32, 0.4, Math.PI * 1.7);
      cctx.strokeStyle = '#E0CFAE';
      cctx.lineWidth = 2.2;
      cctx.stroke();
    }
  });

  // Petekte gezinen arılar
  const n = Math.min(combBees.length, Math.max(2, Math.round(h.bees * 0.8)));
  for (let i = 0; i < n; i++) {
    const b = combBees[i];
    const a = b.a + t * b.sp;
    const x = w / 2 + Math.cos(a + b.ph) * b.r;
    const y = hh / 2 + 10 + Math.sin(a * 1.3) * b.r * 0.7;
    cctx.save();
    cctx.translate(x, y);
    cctx.rotate(a + Math.PI / 2);
    cctx.fillStyle = 'rgba(255,255,255,.75)';
    cctx.beginPath(); cctx.ellipse(-5, -4, 5, 3, -0.6, 0, Math.PI * 2); cctx.fill();
    cctx.beginPath(); cctx.ellipse(5, -4, 5, 3, 0.6, 0, Math.PI * 2); cctx.fill();
    cctx.fillStyle = '#F4C441';
    cctx.beginPath(); cctx.ellipse(0, 0, 5, 8, 0, 0, Math.PI * 2); cctx.fill();
    cctx.fillStyle = '#3A2E20';
    cctx.fillRect(-5, -2, 10, 2.2);
    cctx.fillRect(-4.5, 2.5, 9, 2);
    cctx.restore();
  }
}

function renderHive() {
  const h = view.hives[openHiveId];
  if (!h) return;
  const names = view.flowers;
  $('h-name').textContent = h.name;
  const feedClass = h.feedDays >= 15 ? 'feed-ok' : h.feedDays >= 7 ? 'feed-warn' : 'feed-low';
  $('h-sub').innerHTML = `Seviye ${h.level + 1} · 👑 ${esc(h.queenName)} · <span class="${feedClass}">🌾 Erzak: ${h.feedDays} gün</span>${h.boostDays > 0 ? ` · 🍯 +%50 üretim · ${h.boostDays} gün` : ''}${h.immuneDays > 0 && !h.sick ? ` · 🛡️ ${h.immuneDays} gün bağışık` : ''}`;
  $('h-bees').textContent = `${h.bees} / ${h.capBees}`;
  $('h-rate').textContent = `${h.ratePerHour.toFixed(1)} kg/sa`;
  $('h-honey').textContent = `${h.total.toFixed(1)} kg / ${h.capKg} kg`;
  $('h-bar').style.width = `${Math.min(100, (h.total / h.capKg) * 100)}%`;
  $('h-chips').innerHTML = Object.entries(h.honey).filter(([, v]) => v >= 0.05)
    .map(([f, v]) => `<span>${esc(names[f].name)} Balı ${v.toFixed(1)} kg</span>`).join('') || '<span>Henüz bal yok</span>';
  const counts = {};
  h.near.forEach((f) => { counts[f] = (counts[f] || 0) + 1; });
  $('h-near').innerHTML = Object.entries(counts).map(([f, n]) => `<span>${esc(names[f].name)} ×${n}</span>`).join('')
    || '<span>Yakında çiçek yok, bal üretilmiyor!</span>';

  const br = view.breeds[h.breed] || view.breeds.anadolu;
  $('h-breed').textContent = br.name;
  $('h-breed-desc').textContent = br.desc;
  $('h-breeds').innerHTML = Object.entries(view.breeds).map(([id, b]) => id === h.breed
    ? `<button type="button" class="on" disabled>${esc(b.name)}</button>`
    : `<button type="button" data-breed="${id}" ${view.coins < view.breedChangeCost ? 'disabled' : ''}>${esc(b.name)} · ${view.breedChangeCost} 🪙</button>`).join('');
  $('h-sick').hidden = !h.sick;
  if (h.sick) {
    $('h-sick-text').textContent = `🤒 Bu kovan hasta: üretim %30 düştü. Bu vakada ${h.sickDeaths}/${h.sickDeathLimit} arı kaybedildi; 4 arıya düşerse hastalık biter.`;
    const mb = $('h-medicine');
    mb.textContent = `💊 İlaç ver · ${view.medicineCost} 🪙`;
    mb.disabled = view.coins < view.medicineCost;
  }
  const hb = $('h-harvest');
  if (h.queued) { hb.textContent = '🧺 Arıcı yolda…'; hb.disabled = true; }
  else { hb.textContent = `🧺 Hasat Et · ${h.total.toFixed(1)} kg`; hb.disabled = h.total < 0.05; }

  const coins = view.coins;
  const setBtn = (id, title, sub, disabled) => {
    const b = $(id);
    b.innerHTML = `${title}<small>${sub}</small>`;
    b.disabled = !!disabled;
  };
  setBtn('h-buy', '🐝 Arı Al', h.bees >= h.capBees ? 'kovan dolu' : `${h.beePrice} 🪙`, h.bees >= h.capBees || coins < h.beePrice);
  setBtn('h-sell', '🐝 Arı Sat', `+${h.beeSellPrice} 🪙`, h.bees <= 1);
  const nx = h.next;
  if (!nx) {
    setBtn('h-queen', '👑 Kraliçe', 'en üst seviye', true);
    setBtn('h-grow', '📦 Kovanı Büyüt', 'en üst seviye', true);
  } else if (nx.type === 'queen') {
    setBtn('h-queen', '👑 Kraliçe', `${h.nextQueenName} · ${nx.capBees} arı · ${nx.cost} 🪙`, coins < nx.cost);
    setBtn('h-grow', '📦 Kovanı Büyüt', 'önce kraliçeyi yükselt', true);
  } else {
    setBtn('h-queen', '👑 Kraliçe', 'önce kovanı büyüt', true);
    setBtn('h-grow', '📦 Kovanı Büyüt', `${nx.capKg} kg · ${nx.cost} 🪙`, coins < nx.cost);
  }
  setBtn('h-syrup', '💧 Şurup Ver', `+${view.syrupKg} kg kış erzakı · ${view.syrupCost} 🪙`, coins < view.syrupCost);
  setBtn('h-sellhive', '💰 Kovanı Sat', `+${h.sellValue} 🪙`, Object.keys(view.hives).length <= 1);
}

const hiveAct = (action) => () => doAct(action, openHiveId);
$('h-harvest').addEventListener('click', hiveAct('harvest'));
$('h-medicine').addEventListener('click', hiveAct('medicine'));
$('h-breeds').addEventListener('click', (e) => {
  const b = e.target.closest('[data-breed]');
  if (b && !b.disabled) doAct('changeBreed', openHiveId, b.dataset.breed);
});
$('h-buy').addEventListener('click', hiveAct('buyBee'));
$('h-sell').addEventListener('click', hiveAct('sellBee'));
$('h-queen').addEventListener('click', hiveAct('upgrade'));
$('h-grow').addEventListener('click', hiveAct('upgrade'));
$('h-syrup').addEventListener('click', hiveAct('syrup'));
$('h-sellhive').addEventListener('click', () => {
  const h = view.hives[openHiveId];
  if (h && window.confirm(`${h.name} satılsın mı? İçindeki arılar ve bal da gider (+${h.sellValue} 🪙).`)) doAct('sellHive', openHiveId);
});

// ---------------------------------------------------------------------------
// Durum -> ekran
// ---------------------------------------------------------------------------
const SEASON_ICON = { ilkbahar: '🌸', yaz: '☀️', sonbahar: '🍂', kis: '❄️' };
let noticeShown = false;

function applyView(v) {
  const prev = view;
  setTimeout(() => {
    if (!view) return;
    syncSettings();
    const lb = $('letters-badge'); lb.hidden = !view.lettersUnread; lb.textContent = String(view.lettersUnread || 0);
    if (!$('hives-modal').hidden) renderHives();
    checkHints();
  }, 0);
  setTimeout(() => { if (view && view.merchant) renderMerchant(); }, 0);
  setTimeout(renderNotifs, 0);
  setTimeout(() => { if (view && view.village) buildVillage(); }, 0);
  setTimeout(() => { renderQuests(); renderLedger(); renderStats(); }, 0);
  const first = !view;
  const prevWeather = prev && prev.weather ? prev.weather.id : null;
  const prevFestivalOpen = !!(prev && prev.festival && prev.festival.open);
  const prevFocus = prev && prev.effects ? prev.effects.focus : null;
  const prevUnattended = !!(prev && prev.unattended);
  view = v;

  if (!first && prevWeather !== v.weather.id) {
    if (v.weather.id === 'yagmurlu') sayTopic('rainy_day');
    else if (v.weather.id === 'karli') sayTopic('snowy_day');
  }
  if (!first && !prevFestivalOpen && v.festival.open) sayTopic('honey_festival_application_opened');
  if (prevFocus && v.effects && v.effects.focus) {
    const cur = v.effects.focus;
    if (!prevFocus.active && cur.active) sayTopic('focus_bonus_started');
    else if (prevFocus.active && cur.active && cur.leftMs > prevFocus.leftMs + 30000) sayTopic('focus_bonus_extended');
    if ((prevFocus.earnedTodayMs || 0) < (prevFocus.dailyLimitMs || Infinity) && (cur.earnedTodayMs || 0) >= (cur.dailyLimitMs || Infinity)) sayTopic('focus_bonus_maxed');
    if (prevFocus.active && !cur.active) sayTopic('focus_bonus_ended');
  }
  if (!first && !prevUnattended && v.unattended) sayTopic('farm_production_paused_inactivity');
  else if (!first && prevUnattended && !v.unattended) sayTopic('farm_production_resumed');
  $('coins').textContent = Math.floor(v.coins).toLocaleString('tr-TR');
  $('storage').textContent = kg(v.storageKg);
  $('storage-cap').textContent = `/ ${v.storageCap} kg`;
  $('boost-chip').hidden = !v.focusBoostLeftMs;
  if (v.focusBoostLeftMs) $('boost-text').textContent = `Odak bonusu +%${Math.round(v.focusBoost * 100)} · ${Math.ceil(v.focusBoostLeftMs / 60000)} dk`;
  const c = v.calendar;
  $('season-name').textContent = c.seasonName;
  $('season-day').innerHTML = `Gün ${c.day} · Yıl ${c.year} · <b>${v.weather.icon} ${v.weather.name}</b>`;
  $('season-ico').textContent = SEASON_ICON[c.season];
  $('day-fill').style.width = `${Math.round(c.dayProgress * 100)}%`;
  for (const b of document.querySelectorAll('.speeds button')) b.classList.toggle('on', Number(b.dataset.speed) === v.speed);

  if (v.unattended && !noticeShown) { $('notice').hidden = false; noticeShown = true; setTimeout(() => { $('notice').hidden = true; }, 5000); }

  // Karo ve nesneler sadece yerleşim değişince yeniden kurulur
  const sig = JSON.stringify(Object.values(v.tiles).map((t) => [t.owned, t.item, t.tree, t.decor])) + Object.values(v.hives).map((h) => h.bees).join(',') + (v.festival.cups || []).length;
  if (sig !== itemsSig) {
    itemsSig = sig;
    buildTiles();
    buildItems();
  }
  applySeason(v.calendar.season);
  weatherFx();
  if (shopOpen) renderShop();
  if (marketOpen) renderMarket();
  renderOrders();
  renderBoard();
  // Açık kovan ekranı canlı güncellensin
  if (openHiveId) {
    if (v.hives[openHiveId]) renderHive();
    else closeHive();
  }
  clockSkew = 0;
  maybeShowWhatsNew();
  if (first) updateHover();
}

// Kovanların üstündeki doluluk etiketleri
const labelsEl = $('labels');
const tagEls = new Map();
function updateLabels() {
  if (!view) return;
  const seen = new Set();
  for (const [id, obj] of hiveObjects) {
    const h = view.hives[id];
    if (!h) continue;
    seen.add(id);
    let el = tagEls.get(id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'hive-tag';
      el.innerHTML = '<span></span><i><b></b></i>';
      labelsEl.appendChild(el);
      tagEls.set(id, el);
    }
    const pct = Math.min(100, Math.round((h.total / h.capKg) * 100));
    el.querySelector('span').textContent = `${h.sick ? '🤒 ' : ''}${pct >= 100 ? 'Dolu!' : `%${pct}`}`;
    el.querySelector('b').style.width = `${pct}%`;
    el.classList.toggle('full', pct >= 100);
    el.classList.toggle('sick', !!h.sick);
    const p = obj.pos.clone().add(new THREE.Vector3(0, 1.0, 0)).project(camera);
    el.style.left = `${(p.x + 1) / 2 * window.innerWidth}px`;
    el.style.top = `${(1 - p.y) / 2 * window.innerHeight}px`;
  }
  for (const [id, el] of tagEls) if (!seen.has(id)) { el.remove(); tagEls.delete(id); }
}

// ---------------------------------------------------------------------------
// Döngü
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Gece modu: gerçek saatle 19:00–07:00 (sadece görünüş, üretim etkilenmez)
// ---------------------------------------------------------------------------
const DAY_LIGHT = { hemi: 1.15, sun: 1.6, hemiColor: new THREE.Color(0xFFF6E0), sunColor: new THREE.Color(0xFFF1D6) };
const NIGHT_LIGHT = { hemi: 0.62, sun: 0.45, hemiColor: new THREE.Color(0x7F8FC8), sunColor: new THREE.Color(0x9FB0E0) };
let night = 0;
let lampLights = [];
let houseLight = null;
let fireflies = null;

// 0 = gündüz, 1 = gece. Akşam 18:30–19:15 ve sabah 06:45–07:30 arasında yumuşak geçiş.
function nightLevel(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  const ramp = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
  if (h >= 12) return ramp(h, 18.5, 19.25);
  return 1 - ramp(h, 6.75, 7.5);
}

function buildNightLights() {
  if (!view) return;
  for (const l of lampLights) scene.remove(l);
  lampLights = [];
  for (const t of Object.values(view.tiles)) {
    if (t.decor !== 'fener' || lampLights.length >= 8) continue;
    const p = hexToWorld(t.q, t.r);
    const l = new THREE.PointLight(0xFFB84A, 0, 4, 1.4);
    l.position.set(p.x + 0.52, topY(t) + 0.75, p.z + 0.42);
    scene.add(l);
    lampLights.push(l);
  }
  if (!houseLight) { houseLight = new THREE.PointLight(0xFFC266, 0, 3, 1.5); scene.add(houseLight); }
  const hk = view.houseKey && view.tiles[view.houseKey];
  if (hk) { const p = hexToWorld(hk.q, hk.r); houseLight.position.set(p.x, topY(hk) + 0.6, p.z + 0.7); }
  // Ateş böcekleri: her kovanın çevresinde küçük parlayan noktalar
  if (fireflies) scene.remove(fireflies);
  const pts = [];
  for (const { pos } of hiveObjects.values()) {
    for (let i = 0; i < 9; i++) pts.push({ c: pos.clone(), a: Math.random() * 6.28, r: 0.5 + Math.random() * 0.9, h: 0.4 + Math.random() * 0.8, s: 0.3 + Math.random() * 0.5 });
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(Math.max(1, pts.length) * 3), 3));
  fireflies = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xFFF3A0, size: 0.14, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  fireflies.userData.pts = pts;
  scene.add(fireflies);
}

function applyNight() {
  night = view && view.gameSettings && !view.gameSettings.night ? 0 : nightLevel();
  hemi.intensity = DAY_LIGHT.hemi + (NIGHT_LIGHT.hemi - DAY_LIGHT.hemi) * night;
  sun.intensity = DAY_LIGHT.sun + (NIGHT_LIGHT.sun - DAY_LIGHT.sun) * night;
  hemi.color.copy(DAY_LIGHT.hemiColor).lerp(NIGHT_LIGHT.hemiColor, night);
  sun.color.copy(DAY_LIGHT.sunColor).lerp(NIGHT_LIGHT.sunColor, night);
  M.window.emissive.setHex(0xFFB84A);
  M.window.emissiveIntensity = night * 1.6;
  M.lamp.emissiveIntensity = 0.3 + night * 1.2;
  VM.glass.emissiveIntensity = night * 1.6;
  VM.lamp.emissiveIntensity = 0.4 + night * 1.3;
  for (const l of lampLights) l.intensity = night * 3;
  if (houseLight) houseLight.intensity = night * 2;
  // Gökyüzü: şafak/gün batımı tonu geçişin ortasında en belirgin
  $('sky-night').style.opacity = String(night * 0.92);
  $('sky-dusk').style.opacity = String(Math.min(1, 4 * night * (1 - night)) * 0.85);
  document.body.classList.toggle('night', night > 0.5);
}
setInterval(applyNight, 30 * 1000);

function animateFireflies(t) {
  if (!fireflies) return;
  const m = fireflies.material;
  m.opacity = GFX[gfx].fire ? Math.max(0, night - 0.3) / 0.7 * (0.75 + Math.sin(t * 3) * 0.2) : 0;
  if (m.opacity <= 0.01) return;
  const arr = fireflies.geometry.attributes.position.array;
  fireflies.userData.pts.forEach((p, i) => {
    const a = p.a + t * p.s;
    arr[i * 3] = p.c.x + Math.cos(a) * p.r;
    arr[i * 3 + 1] = p.c.y + p.h + Math.sin(t * 1.3 + p.a) * 0.15;
    arr[i * 3 + 2] = p.c.z + Math.sin(a * 1.2) * p.r;
  });
  fireflies.geometry.attributes.position.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Ortam sesleri: gerçek kayıtlar; kayıtlar yoksa mevcut sentez fallback
// ---------------------------------------------------------------------------
let ambientOn = true;
const amb = { started: false, buzz: null, rain: null };

function updateAmbientBtn() { $('ambient-btn').style.opacity = ambientOn ? '1' : '.45'; }
$('ambient-btn').addEventListener('click', () => { ensureAudioContext(); doAct('setting', 'ambient', !ambientOn); });
updateAmbientBtn();

function ambientStart() {
  if (amb.started) return;
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const buzz = ctx.createOscillator(); buzz.type = 'sawtooth'; buzz.frequency.value = 176;
    const bf = ctx.createBiquadFilter(); bf.type = 'lowpass'; bf.frequency.value = 420;
    const bg = ctx.createGain(); bg.gain.value = 0;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.35;
    const lg = ctx.createGain(); lg.gain.value = 6;
    lfo.connect(lg).connect(buzz.frequency);
    buzz.connect(bf).connect(bg).connect(ctx.destination);
    buzz.start(); lfo.start();

    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 1800; nf.Q.value = 0.6;
    const ng = ctx.createGain(); ng.gain.value = 0;
    noise.connect(nf).connect(ng).connect(ctx.destination);
    noise.start();
    amb.buzz = bg; amb.rain = ng; amb.started = true;
  } catch (_) { /* yoksay */ }
}

const loops = {};
function startLoop(name) {
  if (loops[name] || !SAMPLES[`loop_${name}`]) return loops[name];
  try {
    const ctx = ensureAudioContext();
    if (!ctx) return null;
    const src = ctx.createBufferSource();
    src.buffer = SAMPLES[`loop_${name}`];
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 12000;
    const g = ctx.createGain();
    g.gain.value = 0;
    const p = ctx.createStereoPanner();
    src.connect(filter).connect(g).connect(p).connect(ctx.destination);
    src.start(0, Math.random() * src.buffer.duration);
    loops[name] = { src, g, p, filter };
    return loops[name];
  } catch (_) { return null; }
}

function setLoop(name, gain, pan = 0, cutoff = 12000) {
  const l = startLoop(name);
  if (!l || !actx) return;
  const t = actx.currentTime;
  l.g.gain.setTargetAtTime(gain, t, 1.2);
  l.p.pan.setTargetAtTime(pan, t, 0.6);
  l.filter.frequency.setTargetAtTime(cutoff, t, 0.6);
}

function hiveListening() {
  let x = 0; let n = 0;
  for (const { pos } of hiveObjects.values()) {
    const p = pos.clone().project(camera);
    if (Math.abs(p.x) < 1.4 && Math.abs(p.y) < 1.4) { x += p.x; n += 1; }
  }
  return { pan: n ? Math.max(-0.8, Math.min(0.8, x / n)) : 0, visible: n };
}

const rnd = (a, b) => a + Math.random() * (b - a);
const AMB_S = {
  birds: { on: false, until: Date.now() + rnd(20, 60) * 1000, node: null },
  bees: { on: false, until: Date.now() + rnd(30, 90) * 1000 },
  crickets: { on: false, until: Date.now() + rnd(20, 60) * 1000 }
};
const BIRD_GAIN = 0.07;

function playSession(name, gain, dur) {
  const buf = SAMPLES[name];
  if (!buf || !actx) return null;
  try {
    const src = actx.createBufferSource();
    src.buffer = buf;
    src.loop = buf.duration < dur + 1;
    const g = actx.createGain();
    const p = actx.createStereoPanner();
    p.pan.value = rnd(-0.35, 0.35);
    const t = actx.currentTime;
    const actual = Math.max(8, Math.min(dur, src.loop ? dur : buf.duration - 0.2));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + Math.min(6, actual * 0.25));
    if (actual > 14) g.gain.setValueAtTime(gain, t + actual - 8);
    g.gain.linearRampToValueAtTime(0.0001, t + actual);
    src.connect(g).connect(p).connect(actx.destination);
    const maxOffset = Math.max(0, buf.duration - actual - 0.1);
    src.start(t, src.loop ? 0 : rnd(0, maxOffset));
    src.stop(t + actual + 0.2);
    return { src, g };
  } catch (_) { return null; }
}

function stopSession(node) {
  if (!node || !actx) return;
  try {
    const t = actx.currentTime;
    node.g.gain.cancelScheduledValues(t);
    node.g.gain.setTargetAtTime(0.0001, t, 1.2);
    node.src.stop(t + 5);
  } catch (_) { /* yoksay */ }
}

function cycle(st, allowed, onRange, offRange) {
  const now = Date.now();
  if (!allowed) {
    if (st.on) { st.on = false; st.until = now + rnd(...offRange) * 1000; }
    return false;
  }
  if (now >= st.until) {
    st.on = !st.on;
    st.until = now + rnd(...(st.on ? onRange : offRange)) * 1000;
  }
  return st.on;
}

function ambientTickSamples(on) {
  if (!view) return;
  const w = view.weather.id;
  const season = view.calendar.season;
  const dayLight = 1 - night;
  const raining = w === 'yagmurlu';
  const snowy = w === 'karli';
  const winter = season === 'kis';
  const insideHive = typeof openHiveId !== 'undefined' && openHiveId && view.hives[openHiveId];

  const birdsNow = cycle(AMB_S.birds, on && audioPrefs.birds !== false && dayLight > 0.5 && !raining && !insideHive, [90, 180], winter ? [450, 1200] : [180, 480]);
  if (birdsNow && !AMB_S.birds.node) {
    const names = sampleNames('birds');
    if (names.length) {
      const dur = Math.max(8, (AMB_S.birds.until - Date.now()) / 1000);
      AMB_S.birds.node = playSession(names[Math.floor(Math.random() * names.length)], BIRD_GAIN * (winter ? 0.6 : 1), dur);
    }
  } else if (!birdsNow && AMB_S.birds.node) {
    stopSession(AMB_S.birds.node);
    AMB_S.birds.node = null;
  }
  if (AMB_S.birds.node && Date.now() >= AMB_S.birds.until) AMB_S.birds.node = null;

  if (insideHive) {
    const fullness = Math.min(1, 0.35 + insideHive.bees / 20);
    setLoop('bees', on && audioPrefs.bees !== false ? 0.28 * fullness * (winter ? 0.5 : 1) : 0, 0, 1800);
  } else {
    const beesNow = cycle(AMB_S.bees, on && audioPrefs.bees !== false && dayLight > 0.5 && !raining && !winter, [60, 150], [150, 360]);
    const bees = Object.values(view.hives).reduce((a, h) => a + h.bees, 0);
    const { pan, visible } = hiveListening();
    const closeness = Math.max(0, Math.min(1, (zoom - 0.6) / 1.6));
    const activity = Math.min(1, 0.25 + bees / 40) * (visible ? 1 : 0.35);
    setLoop('bees', beesNow ? 0.08 * activity * (0.45 + closeness * 0.8) : 0, pan, 1200 + closeness * 9000);
  }

  setLoop('rain', on && audioPrefs.rain !== false && raining ? 0.18 * (insideHive ? 0.4 : 1) : 0);
  setLoop('wind', on && audioPrefs.wind !== false ? (snowy ? 0.18 : winter ? 0.11 : season === 'sonbahar' ? 0.07 : 0) * (insideHive ? 0.4 : 1) : 0);

  const cricketsNow = cycle(AMB_S.crickets, on && audioPrefs.crickets !== false && night >= 0.5 && !raining && !winter, [60, 150], [120, 300]);
  if (cricketsNow && Math.random() < 0.6) {
    for (let i = 0; i < 3; i++) tone(4300, 0.035, 'triangle', 0.004, i * 0.06, null, true);
  }
}

function ambientTick() {
  const onAmbient = ambientOn && view && document.visibilityState === 'visible';
  if (samplesReady && view) {
    ensureAudioContext();
    ambientTickSamples(onAmbient);
    return;
  }

  const on = ambientOn && view && document.visibilityState === 'visible';
  if (on) ambientStart();
  if (!amb.started || !actx) return;
  const now = actx.currentTime;
  const raining = view && view.weather.id === 'yagmurlu';
  amb.buzz.gain.setTargetAtTime(on && audioPrefs.bees !== false && night < 0.5 && !raining ? 0.006 : 0, now, 0.8);
  amb.rain.gain.setTargetAtTime(on && audioPrefs.rain !== false && raining ? 0.035 : 0, now, 0.8);
  if (!on) return;
  if (audioPrefs.birds !== false && night < 0.5 && !raining && Math.random() < 0.35) {
    const base = 2200 + Math.random() * 1400;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) tone(base + Math.random() * 500, 0.07, 'sine', 0.012, i * 0.09, base * 1.25, true);
  } else if (audioPrefs.crickets !== false && night >= 0.5 && Math.random() < 0.7) {
    for (let i = 0; i < 3; i++) tone(4300, 0.035, 'triangle', 0.006, i * 0.06, null, true);
  }
}
setInterval(ambientTick, 1100);

// ---------------------------------------------------------------------------
// Köy:
// ---------------------------------------------------------------------------
// Köy: adayı çevreleyen iki halka (yalnızca köylüler yerleşir)
// ---------------------------------------------------------------------------
let villageSig = '';
let villageAnims = [];
function buildVillage() {
  const V = view.village;
  const sig = V.residents.map((r) => `${r.n}@${r.slot}`).join(',') + '|' + V.rings + '|' + (view.merchant.active ? view.merchant.slot : '');
  if (sig === villageSig) return;
  villageSig = sig;
  villageGroup.clear();
  villageAnims = [];
  const keys = [...V.ring1, ...V.ring2];
  const bySlot = new Map(V.residents.map((r) => [r.slot, r]));
  keys.forEach((k, i) => {
    const [q, r] = k.split(',').map(Number);
    const p = hexToWorld(q, r);
    const g = villageGround(R);
    g.position.set(p.x, 0, p.z);
    g.userData.key = bySlot.has(k) ? `v:${bySlot.get(k).n}` : null;
    villageGroup.add(g);
    const res = bySlot.get(k);
    if (view.merchant.active && view.merchant.slot === k) {
      const cart = buildMerchantCart();
      cart.position.set(p.x, 0.065, p.z);
      cart.rotation.y = Math.atan2(-p.x, -p.z) + Math.PI / 2;
      cart.userData.key = 'm:cart';
      g.userData.key = 'm:cart';
      villageGroup.add(cart);
      if (cart.userData.animate) villageAnims.push(cart.userData.animate);
    } else if (res) {
      const o = buildOccupant(res.n);
      if (o) {
        o.position.set(p.x, 0.065, p.z);
        // Yapılar adaya (merkeze) baksın
        o.rotation.y = Math.atan2(-p.x, -p.z);
        o.userData.key = `v:${res.n}`;
        villageGroup.add(o);
        if (o.userData.animate) villageAnims.push(o.userData.animate);
      }
    } else if (i % 5 === 2) {
      // boş köy karelerinde ara sıra bir ağaç
      const t = makeTree((q + 20) * 31 + (r + 20) * 7);
      t.position.x += p.x; t.position.z += p.z; t.position.y = 0.06;
      villageGroup.add(t);
    }
  });
}

function openVillagerPopup(n, x, y) {
  const r = view.village.residents.find((e) => String(e.n) === String(n));
  if (!r) return;
  const hearts = r.hearts ? ` <span class="hearts">${'♥'.repeat(r.hearts)}${'♡'.repeat(view.heartMax - r.hearts)}</span>` : '';
  const kind = { koylu: 'Köylü', dukkan: 'Dükkân', bina: 'Köy binası' }[r.type];
  const relName = r.type === 'koylu' ? r.name : r.owner;
  const rel = relName ? (view.relations[relName] || 0) : null;
  const isEzgi = Number(r.n) === 7;
  const choice = isEzgi && view.ezgi && view.ezgi.choice ? view.ezgi.choice : null;
  const choiceInfo = choice && view.flowers[choice]
    ? `<div class="ezgi-welcome"><b>🌷 Ezgi’nin Seçimi</b><span>${esc(view.flowers[choice].name)} tohumu · bugün ek %15 indirimli · ${view.flowers[choice].seed} 🪙</span><div><button type="button" class="act primary small-act" data-ezgi-shop>Tohumları gör</button></div></div>`
    : '';
  const welcome = isEzgi && view.ezgi && view.ezgi.welcomePending
    ? `<div class="ezgi-welcome"><b>🌷 Çiçekçi Ezgi</b><p class="sub">Merhaba! Buradaki arıları uzaktan beri izliyordum. Bu kadar çok bal üretildiğini görünce dükkânımı burada açmaya karar verdim. Sanırım bundan sonra çiçeklerle biraz daha fazla ilgileneceğiz.</p><b>🎁 Hoş Geldin Hediyesi</b><small>1 ücretsiz mevsimlik tohum paketi</small><div><button type="button" class="act primary small-act" data-ezgi-welcome>Hediyeyi Al</button></div></div>`
    : '';
  openPopupAt(x, y, `
    <h3>${esc(r.name)}${hearts}</h3>
    <p class="sub">${kind} · ${esc(r.role)}</p>
    ${rel !== null ? `<div class="row"><span>🤝 İlişkiniz</span><b>%${rel}</b></div>` : ''}
    ${r.type === 'koylu'
      ? `<div class="row"><span>❤️ Sevdiği bal</span><b>${esc(view.flowers[r.fav].name)}</b></div><p class="sub">Bu bal ekiliyse siparişlerinde sık sık onu ister ve %15 daha iyi öder.</p>`
      : `<p class="sub">✨ ${esc(r.effectText)}</p>`}
    ${welcome}
    ${isEzgi && !welcome ? choiceInfo : ''}
    ${storyHtml(r.type === 'koylu' ? r.name : null, rel)}`);
}

// ---------------------------------------------------------------------------
// Köylü hikâyeleri
// ---------------------------------------------------------------------------
function storyHtml(who, rel, compact = false) {
  const s = view && who ? view.stories.find((x) => x.who === who) : null;
  if (!s) return '';
  if (!s.unlocked) {
    return compact
      ? `<div class="story"><b>🔒 ${esc(s.who)}</b><small>"${esc(s.title)}" · ilişkiniz %50 olunca açılır${view.village.residents.some((r) => r.name === s.who) ? '' : ' (henüz köye gelmedi)'}</small></div>`
      : `<div class="story"><b>📖 Bir hikâyesi var</b><small>İlişkiniz %50 olunca "${esc(s.title)}" hikâyesini anlatacak${rel !== null ? ` (şu an %${rel})` : ''}.</small></div>`;
  }
  const steps = s.steps.map((st, i) => {
    const cls = s.done || i < s.step ? 'done' : i === s.step ? 'now' : 'todo';
    const prog = cls === 'now' && st.n > 1 ? ` (${Math.floor(s.progress * 10) / 10} / ${st.n})` : '';
    return `<li class="${cls}">${esc(st.text)}${prog}</li>`;
  }).join('');
  return `<div class="story"><b>${s.done ? '🌟' : '📖'} ${compact ? `${esc(s.who)} · ` : ''}${esc(s.title)}</b>
    <ol>${steps}</ol><small>${s.done ? 'Kazanıldı' : 'Son ödül'}: ${esc(s.bonusText)}</small></div>`;
}

// ---------------------------------------------------------------------------
// Gezgin satıcı: Seyyah Yakup
// ---------------------------------------------------------------------------
let merchantOpen = false;
let merchantSig = '';
function openMerchant() { if (!view.merchant.active) return; merchantOpen = true; $('merchant-modal').hidden = false; renderMerchant(true); }
function closeMerchant() { merchantOpen = false; $('merchant-modal').hidden = true; }
$('merchant-chip').addEventListener('click', openMerchant);
$('merchant-close').addEventListener('click', closeMerchant);
$('merchant-modal').addEventListener('click', (e) => { if (e.target === $('merchant-modal')) closeMerchant(); });

function targetOptions(kind, itemId = null) {
  const hives = Object.values(view.hives);
  const hiveOpt = (h) => `<option value="${h.id}">${esc(h.name)} · ${h.bees}/${h.capBees} arı${h.sick ? ' · hasta' : ''}</option>`;
  if (kind === 'flower' || kind === 'flowerWilted') {
    const wilted = kind === 'flowerWilted';
    const opts = Object.entries(view.tiles).filter(([, t]) => t.owned && t.item && t.item.type === 'flower' && !!t.item.wilted === wilted)
      .map(([k, t]) => `<option value="${k}">${esc(view.flowers[t.item.flower].name)} tarhı (${k})</option>`);
    return opts.length ? opts.join('') : null;
  }
  if (kind === 'honey') return Object.entries(view.flowers).map(([k, f]) => `<option value="${k}">${esc(f.name)} balı</option>`).join('');
  if (kind === 'acceptedOrder' || kind === 'order') {
    const list = (view.orders.list || []).filter((o) => kind === 'order' || o.status === 'accepted');
    return list.length ? list.map((o) => `<option value="${o.id}">${esc(o.who)} · ${o.kg} kg ${esc(view.flowers[o.flower].name)}</option>`).join('') : null;
  }
  if (kind === 'merchantStock') {
    const list = (view.merchant.stock || []).filter((x) => !x.sold && x.id !== itemId && x.id !== 'stokDegisim');
    return list.length ? list.map((x) => `<option value="${x.id}">${x.icon} ${esc(x.name)}</option>`).join('') : null;
  }
  if (kind === 'hiveBreed') {
    const opts = [];
    for (const h of hives) for (const [breed, def] of Object.entries(view.breeds || {})) {
      if (h.breed !== breed) opts.push(`<option value="${h.id}|${breed}">${esc(h.name)} → ${esc(def.name)}</option>`);
    }
    return opts.length ? opts.join('') : null;
  }
  if (kind === 'hiveTransfer') {
    const pairs = [];
    for (const from of hives) for (const to of hives) if (from.id !== to.id && from.bees > 1 && to.bees < to.capBees) pairs.push(`<option value="${from.id}|${to.id}">${esc(from.name)} → ${esc(to.name)} · en fazla 3 arı</option>`);
    return pairs.length ? pairs.join('') : null;
  }
  const ok = (h) => kind === 'hiveQueen' ? h.next && h.next.type === 'queen' : kind === 'hiveRoom3' ? h.capBees - h.bees >= 3 : kind === 'hiveSick' ? h.sick : true;
  const opts = hives.filter(ok).map(hiveOpt);
  return opts.length ? opts.join('') : null;
}

async function refreshMerchantQuote(id) {
  const button = document.querySelector(`[data-mbuy="${id}"]`);
  if (!button || button.dataset.locked === '1') return;
  const sel = document.querySelector(`[data-target-for="${id}"]`);
  try {
    const pack = await window.bee.act('merchantQuote', id, sel ? sel.value : null);
    const price = pack && pack.res && pack.res.ok ? pack.res.price : null;
    if (price == null) {
      button.textContent = 'Uygun hedef yok';
      button.disabled = true;
      return;
    }
    button.textContent = `Satın al · ${price} 🪙`;
    button.disabled = view.coins < price;
  } catch (_) {
    button.textContent = 'Fiyat alınamadı';
    button.disabled = true;
  }
}

function refreshMerchantQuotes() {
  document.querySelectorAll('[data-mbuy]').forEach((b) => {
    if (b.dataset.locked !== '1') refreshMerchantQuote(b.dataset.mbuy);
  });
}

function renderMerchant(force = false) {
  const M = view && view.merchant;
  $('merchant-chip').hidden = !M || !M.active;
  if (M && M.active) $('merchant-left').textContent = `· ${gameLeft(M.leftMs, view.dayMs)} kaldı`;
  if (!merchantOpen) return;
  if (!M.active) { closeMerchant(); return; }
  const sig = JSON.stringify([M.stock, M.bought, Math.floor(view.coins), M.wantsLeft, view.storage[M.wants], Object.values(view.hives).map((h) => [h.bees, h.sick, h.level])]);
  $('merchant-sub').textContent = `${gameLeft(M.leftMs, view.dayMs)} sonra gidiyor · Bu ziyarette ${M.bought} / ${M.maxBuy} ürün aldın (her üründen 1 tane).`;
  if (!force && sig === merchantSig) return;
  merchantSig = sig;
  const full = M.bought >= M.maxBuy;
  $('merchant-list').innerHTML = M.stock.map((it) => {
    const opts = it.target ? targetOptions(it.target, it.id) : '';
    const noTarget = it.target && !opts;
    const locked = it.sold || full || noTarget;
    const priceText = it.basePrice != null ? `Satın al · ${it.basePrice} 🪙` : 'Satın al · …';
    const buttonText = it.sold ? 'Alındı' : full ? 'Limit doldu' : noTarget ? 'Uygun hedef yok' : priceText;
    return `<li class="mitem${it.sold ? ' sold' : ''}">
      <span class="ic">${it.icon}</span>
      <span class="info"><b>${esc(it.name)}</b><small>${esc(it.desc)}</small>
        ${it.contents && it.contents.length ? `<small>İçerik: ${it.contents.map(esc).join(' · ')}</small>` : ''}${it.target && !it.sold && opts ? `<select data-target-for="${it.id}">${opts}</select>` : ''}
        ${noTarget && !it.sold ? '<small>Şu an uygun bir hedef yok.</small>' : ''}</span>
      <button type="button" data-mbuy="${it.id}" data-locked="${locked ? '1' : '0'}" ${locked ? 'disabled' : ''}>${buttonText}</button>
    </li>`;
  }).join('');
  queueMicrotask(refreshMerchantQuotes);
  const have = view.storage[M.wants] || 0;
  const f = view.flowers[M.wants];
  const ticket = M.salesTicketKg > 0 ? ` · 💎 Satış Fişi aktif: kalan ${M.salesTicketKg.toFixed(1)} kg’a +%10` : '';
  $('merchant-buy').innerHTML = `🍯 Seyyah Yakup <b>${esc(f.name)} balı</b> arıyor: kilosuna <b>${M.wantsPrice} 🪙</b> (pazarın %40 üstü). Kalan: ${M.wantsLeft} kg · Depoda: ${have.toFixed(1)} kg${ticket}
    <div class="fest-row"><button type="button" data-msell="1" ${have < 1 || M.wantsLeft < 1 ? 'disabled' : ''}>1 kg sat</button><button type="button" data-msell="all" ${have < 0.05 || M.wantsLeft < 0.05 ? 'disabled' : ''}>Hepsini sat</button></div>`;
}
$('merchant-list').addEventListener('change', (e) => {
  const sel = e.target.closest('[data-target-for]');
  if (sel) refreshMerchantQuote(sel.dataset.targetFor);
});
$('merchant-list').addEventListener('click', (e) => {
  const b = e.target.closest('[data-mbuy]');
  if (!b || b.disabled) return;
  const sel = document.querySelector(`[data-target-for="${b.dataset.mbuy}"]`);
  doAct('merchantBuy', b.dataset.mbuy, sel ? sel.value : null);
});
$('merchant-buy').addEventListener('click', (e) => {
  const b = e.target.closest('[data-msell]');
  if (b && !b.disabled) doAct('merchantSell', b.dataset.msell);
});

// ---------------------------------------------------------------------------
// Grafik kalitesi (arı sayısı sadece görüntü; üretim etkilenmez)
// ---------------------------------------------------------------------------
const GFX = {
  yuksek: { bees: 8, shadows: true, shadowMap: 2048, pr: 2, precip: 1, fire: true, anim: true },
  dengeli: { bees: 4, shadows: true, shadowMap: 1024, pr: 1.25, precip: 0.5, fire: true, anim: true },
  hafif: { bees: 2, shadows: false, shadowMap: 512, pr: 1, precip: 0, fire: false, anim: false }
};
let gfx = 'dengeli';
let gfxApplied = null;
function activeFlakes() { return flakes.slice(0, Math.round(flakes.length * (GFX[gfx].precip || 0))); }
function applyGraphics(level) {
  if (!GFX[level] || gfxApplied === level) return;
  const prevBees = gfxApplied ? GFX[gfxApplied].bees : null;
  gfx = level;
  gfxApplied = level;
  const g = GFX[level];
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, g.pr));
  renderer.shadowMap.enabled = g.shadows;
  sun.castShadow = g.shadows;
  sun.shadow.mapSize.set(g.shadowMap, g.shadowMap);
  if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
  scene.traverse((o) => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.needsUpdate = true; }); });
  resize();
  if (prevBees !== null && prevBees !== g.bees && view) buildBees();
  weatherFx();
}

// Ayarları durumdan uygula (ses, ortam, grafik, gece)
function syncSettings() {
  const s = view.gameSettings;
  if (!s) return;
  soundOn = s.sfx;
  ambientOn = s.ambient;
  notificationSoundOn = s.notificationSound !== false;
  audioPrefs = s.audio || {};
  updateSoundBtn();
  updateAmbientBtn();
  applyGraphics(s.graphics);
  applyNight();
}

// ---------------------------------------------------------------------------
// Oyun içi Ayarlar
// ---------------------------------------------------------------------------
const NOTIFY_LABELS = { full: 'Kovan doldu', due: 'Sipariş süresi azaldı', sick: 'Kovan hastalandı', winter: 'Kış ve erzak', rival: 'Rakip seni geçti', merchant: 'Satıcı geldi', letter: 'Mektup geldi' };
const AUDIO_GROUPS = [
  ['Oyun efektleri', [['coin', 'Jeton / satış'], ['harvest', 'Hasat'], ['place', 'Yerleştirme'], ['plant', 'Ekim'], ['paper', 'Mektup / kâğıt'], ['success', 'Başarı'], ['error', 'Hata']]],
  ['Ortam', [['birds', 'Kuşlar'], ['bees', 'Arılar'], ['rain', 'Yağmur'], ['wind', 'Rüzgâr'], ['crickets', 'Cırcır böcekleri']]],
  ['Bildirimler', [['notifyOrders', 'Siparişler'], ['notifyHive', 'Kovan uyarıları'], ['notifyMerchant', 'Seyyah Yakup'], ['notifySpecial', 'Festival ve özel olaylar']]]
];
function renderSettings() {
  const s = view.gameSettings;
  for (const b of document.querySelectorAll('#gs-graphics button')) b.classList.toggle('on', b.dataset.g === s.graphics);
  $('gs-night').checked = s.night;
  $('gs-sfx').checked = s.sfx;
  $('gs-ambient').checked = s.ambient;
  $('gs-notification-sound').checked = s.notificationSound !== false;
  $('gs-audio').innerHTML = AUDIO_GROUPS.map(([title, items]) => `<div class="gs-audio-group"><b>${title}</b><div class="gs-audio-grid">${items.map(([k, label]) => `<label><input type="checkbox" data-audio="${k}" ${!s.audio || s.audio[k] !== false ? 'checked' : ''}> ${label}</label>`).join('')}</div></div>`).join('');
  $('gs-notify').innerHTML = Object.entries(NOTIFY_LABELS).map(([k, label]) => `<label><input type="checkbox" data-notify="${k}" ${s.notify[k] ? 'checked' : ''}> ${label}</label>`).join('');
}
$('open-settings').addEventListener('click', () => { renderSettings(); $('settings-modal').hidden = false; });
$('settings-close').addEventListener('click', () => { $('settings-modal').hidden = true; });
$('settings-modal').addEventListener('click', (e) => { if (e.target === $('settings-modal')) $('settings-modal').hidden = true; });
const setSetting = async (k, v) => { await doAct('setting', k, v); renderSettings(); };
$('gs-graphics').addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (b) setSetting('graphics', b.dataset.g); });
$('gs-night').addEventListener('change', (e) => setSetting('night', e.target.checked));
$('gs-sfx').addEventListener('change', (e) => setSetting('sfx', e.target.checked));
$('gs-ambient').addEventListener('change', (e) => setSetting('ambient', e.target.checked));
$('gs-notification-sound').addEventListener('change', (e) => setSetting('notificationSound', e.target.checked));
$('gs-audio').addEventListener('change', (e) => { const k = e.target.dataset.audio; if (k) setSetting(`audio.${k}`, e.target.checked); });
$('gs-notify').addEventListener('change', (e) => { const k = e.target.dataset.notify; if (k) setSetting(`notify.${k}`, e.target.checked); });
$('gs-export').addEventListener('click', () => window.bee.exportSave());
$('gs-import').addEventListener('click', () => window.bee.importSave());
$('gs-photos').addEventListener('click', () => window.bee.openPhotos());
$('gs-reset').addEventListener('click', () => window.bee.resetGame());

// ---------------------------------------------------------------------------
// Pahalı işlem onayı (500 🪙 ve üstü)
// ---------------------------------------------------------------------------
function costOf(action, a, b) {
  if (!view) return 0;
  const h = a && view.hives[a];
  switch (action) {
    case 'upgrade': return h && h.next ? h.next.cost : 0;
    case 'placeHive': return view.hiveCost;
    case 'buyTile': return view.tilePrice;
    case 'buySeed': return (view.flowers[a] || {}).seed || 0;
    case 'plantSeed': return view.vouchers[b] > 0 ? 0 : (view.flowers[b] || {}).seed || 0;
    case 'upgradeStorage': return view.nextStorage ? view.nextStorage.cost : 0;
    case 'changeBreed': return view.breedChangeCost;
    case 'placeDecor': return (view.decor[b] || {}).cost || 0;
    case 'syrupAll': return view.syrupAllCost;
    case 'merchantBuy': { const it = view.merchant.stock && view.merchant.stock.find((x) => x.id === a); return it && it.basePrice ? it.basePrice : 0; }
    default: return 0;
  }
}

// ---------------------------------------------------------------------------
// Üzerine gelince bilgi (kovan: doluluk ve üretim, tarh: kalan ömür)
// ---------------------------------------------------------------------------
function showHoverTip(k, x, y) {
  const tip = $('hover-tip');
  const t = k && view && view.tiles[k];
  let html = '';
  if (t && t.item && t.item.type === 'hive') {
    const h = view.hives[t.item.id];
    if (h) html = `🐝 ${esc(h.name)}<small>${h.total.toFixed(1)} / ${h.capKg} kg · ${h.ratePerHour.toFixed(1)} kg/sa${h.sick ? ' · 🤒 hasta' : ''}</small>`;
  } else if (t && t.item && t.item.type === 'flower') {
    const f = view.flowers[t.item.flower];
    const left = Math.max(0, view.flowerLife - (view.dayIndex - (t.item.plantedDay || 0)));
    html = `🌼 ${esc(f.name)}<small>${t.item.wilted ? '🥀 soldu, canlandırılabilir' : `kalan ömür: ${left} gün`}</small>`;
  }
  if (!html || drag) { tip.hidden = true; return; }
  tip.innerHTML = html;
  tip.hidden = false;
  tip.style.left = `${Math.min(window.innerWidth - tip.offsetWidth - 8, x + 16)}px`;
  tip.style.top = `${Math.max(8, y - 44)}px`;
}
canvas.addEventListener('pointerleave', () => { $('hover-tip').hidden = true; });

// ---------------------------------------------------------------------------
// Adaya dön (R) ve bir kovana odaklan
// ---------------------------------------------------------------------------
function recenter() { camTarget.set(0, 0, 0); zoom = 1.3; placeCamera(); resize(); closePopup(); }
$('recenter').addEventListener('click', recenter);
function focusHive(id) {
  const o = hiveObjects.get(id);
  if (o) { camTarget.set(o.pos.x, 0, o.pos.z); zoom = Math.max(zoom, 1.4); placeCamera(); resize(); }
  $('hives-modal').hidden = true;
  openHive(id);
}
function cycleHive(dir) {
  const ids = Object.keys(view.hives);
  if (!ids.length || !openHiveId) return;
  const i = ids.indexOf(openHiveId);
  const next = ids[(i + dir + ids.length) % ids.length];
  const o = hiveObjects.get(next);
  if (o) { camTarget.set(o.pos.x, 0, o.pos.z); placeCamera(); }
  openHive(next);
}
$('hive-prev').addEventListener('click', () => cycleHive(-1));
$('hive-next').addEventListener('click', () => cycleHive(1));

// ---------------------------------------------------------------------------
// Kovanlar özeti ve toplu şurup
// ---------------------------------------------------------------------------
function openHives() { renderHives(); $('hives-modal').hidden = false; }
function renderHives() {
  const hives = Object.values(view.hives);
  $('hives-list').innerHTML = hives.map((h) => {
    const pct = Math.min(100, (h.total / h.capKg) * 100);
    const tags = [h.sick ? '🤒 hasta' : '', h.immuneDays > 0 && !h.sick ? `🛡️ ${h.immuneDays}g` : '', `🌾 ${h.feedDays} gün`, h.boostDays > 0 ? `🍯 +%50 · ${h.boostDays}g` : '', h.queued ? '🧺 yolda' : ''].filter(Boolean).join(' · ');
    return `<li class="hrow" data-hive="${h.id}"><span><b>${esc(h.name)}</b><br><small>${h.ratePerHour.toFixed(1)} kg/sa · 👑 ${esc(h.queenName)}</small></span>
      <span><div class="bar"><i style="width:${pct}%"></i></div><small>${h.total.toFixed(1)} / ${h.capKg} kg${pct >= 100 ? ' · Dolu!' : ''}</small></span>
      <span>🐝 ${h.bees}/${h.capBees}</span><span class="tags">${tags}</span></li>`;
  }).join('');
  const sa = $('syrup-all');
  sa.textContent = `💧 Tüm kovanlara şurup ver · ${view.syrupAllCost} 🪙`;
  sa.disabled = view.coins < view.syrupAllCost;
}
$('open-hives').addEventListener('click', openHives);
$('hives-close').addEventListener('click', () => { $('hives-modal').hidden = true; });
$('hives-modal').addEventListener('click', (e) => { if (e.target === $('hives-modal')) $('hives-modal').hidden = true; });
$('hives-list').addEventListener('click', (e) => { const r = e.target.closest('[data-hive]'); if (r) focusHive(r.dataset.hive); });
$('syrup-all').addEventListener('click', async () => {
  if (!window.confirm(`${Object.keys(view.hives).length} kovana şurup verilsin mi? Toplam ${view.syrupAllCost} 🪙`)) return;
  await doAct('syrupAll');
  renderHives();
});

// Kısayol listesi
$('keys-close').addEventListener('click', () => { $('keys-modal').hidden = true; });
$('keys-modal').addEventListener('click', (e) => { if (e.target === $('keys-modal')) $('keys-modal').hidden = true; });

// Siparişler ve pazar araçları
$('order-sort').addEventListener('change', () => renderOrders(true));
$('deliver-ready').addEventListener('click', () => doAct('deliverReady'));
$('market-mine').addEventListener('change', () => renderMarket(true));
$('market-sort').addEventListener('change', () => renderMarket(true));

// Mektuplar
function setLedgerTab(tab) {
  ledgerTab = tab;
  for (const x of document.querySelectorAll('[data-ltab]')) x.classList.toggle('on', x.dataset.ltab === tab);
  renderLedger(true);
}
$('ledger-body').addEventListener('click', (e) => { const b = e.target.closest('[data-read]'); if (b) doAct('readLetter', b.dataset.read); });

// Bildirime tıklayınca ilgili yere git
function navigate(go) {
  if (!go) return;
  closeNotifs();
  if (go.to === 'orders') openOrders();
  else if (go.to === 'merchant') openMerchant();
  else if (go.to === 'market') openMarket();
  else if (go.to === 'hives') openHives();
  else if (go.to === 'hive' && view.hives[go.id]) focusHive(go.id);
  else if (go.to === 'letters' || go.to === 'village') { openLedger(); setLedgerTab(go.to); }
}
$('notif-list').addEventListener('click', (e) => {
  const li = e.target.closest('[data-ni]');
  if (li) { const n = (view.notifs || [])[Number(li.dataset.ni)]; if (n && n.go) navigate(n.go); }
});

// Nero'dan durum ipuçları: yeni bir ipucu çıkınca (en fazla dakikada bir) söyler
const saidHints = new Set();
let lastHintAt = 0;
function checkHints() {
  const hs = view.hints || [];
  for (const h of hs) {
    if (saidHints.has(h.id)) continue;
    if (Date.now() - lastHintAt < 60 * 1000) return;
    saidHints.add(h.id);
    lastHintAt = Date.now();
    say(h.text);
    return;
  }
}

const clock = new THREE.Clock();
function loop() {
  const t = clock.getElapsedTime();
  animateFireflies(t);
  animateBees(t);
  if (GFX[gfx].anim) for (const o of villageAnims) o(t);
  animateKeeper(t);
  drawComb(t);
  drawSnow(t);
  updateLabels();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

(async function start() {
  placeCamera();
  resize();
  applyView(await window.bee.state());
  applyNight();
  window.bee.onState(applyView);
  window.bee.onEvents((events) => events.forEach((e) => { if (e.msg) { toast(e.msg, e.err); reactEvent(e); } }));
  if (!view.tutorialDone) startTour();
  else {
    const sum = await window.bee.summary();
    if (sum) showAway(sum); else setTimeout(() => say(pick(NERO.hello)), 1200);
  }
  loop();
})();
