// ===========================================================================
// Nero Arıcılık · Köy evleri v2 (78 benzersiz yapı)
// Ortak parça kiti: her ev dosyası (evler/NN-ad.js) buradan parça alır. Yapıların listesi: evler/index.js
// Ortak kalıp: meslek paleti · biçimi değiştiren ek yapı · cephe detayları ·
// mesleğini anlatan obje · gece ışığı (VM.glass / VM.lamp) · küçük animasyon · isim etiketi
// ===========================================================================
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';

const cache = new Map();
export const mat = (c, o = {}) => { const k = `${c}|${JSON.stringify(o)}`; if (!cache.has(k)) cache.set(k, new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, flatShading: true, ...o })); return cache.get(k); };
const M = (c) => (typeof c === 'number' ? mat(c) : c);
export function mesh(geo, m, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(geo, M(m)); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o; }
export const box = (w, h, d, c, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), c, x, y, z);
export const cyl = (rt, rb, h, c, x, y, z, s = 10) => mesh(new THREE.CylinderGeometry(rt, rb, h, s), c, x, y, z);
export const sph = (r, c, x, y, z, s = 8) => mesh(new THREE.SphereGeometry(r, s, Math.max(4, s - 2)), c, x, y, z);
export const cone = (r, h, c, x, y, z, s = 8) => mesh(new THREE.ConeGeometry(r, h, s), c, x, y, z);
export const grp = (...k) => { const g = new THREE.Group(); k.forEach((x) => x && g.add(x)); return g; };
export const at = (o, x = 0, y = 0, z = 0, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; return o; };

export const C = {
  ink: 0x4A3A22, wood: 0x8A5A34, woodD: 0x6E4526, woodL: 0xC9A06A, stone: 0xBDB6AA, stoneD: 0x9A948A, brick: 0xB95A42,
  cream: 0xF3E4C4, white: 0xF6F1E7, leaf: 0x5FA24E, leafL: 0x7FBF62, trunk: 0x7A4E2C, iron: 0x3A3A3A, honey: 0xF2B33D,
  pink: 0xE893A8, red: 0xE0626A, yellow: 0xF5D76E, lilac: 0x9C7BD6, blue: 0x6FA3D9, teal: 0x8FCBB5, orange: 0xE9822E
};

// --- Çatılar ---------------------------------------------------------------
export function gable(w, d, h, c, over = 0.08) {
  const s = new THREE.Shape(); const hw = w / 2 + over;
  s.moveTo(-hw, 0); s.lineTo(hw, 0); s.lineTo(0, h); s.lineTo(-hw, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: d + over * 2, bevelEnabled: false }); g.translate(0, 0, -(d + over * 2) / 2);
  return mesh(g, c);
}
export function shed(w, d, h, c, over = 0.06) { // tek eğimli çatı
  const s = new THREE.Shape(); const hw = w / 2 + over;
  s.moveTo(-hw, 0); s.lineTo(hw, 0); s.lineTo(hw, h * 0.25); s.lineTo(-hw, h); s.lineTo(-hw, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: d + over * 2, bevelEnabled: false }); g.translate(0, 0, -(d + over * 2) / 2);
  return mesh(g, c);
}
export const hip = (w, d, h, c) => { const r = cone(Math.max(w, d) * 0.78, h, c, 0, h / 2, 0, 4); r.rotation.y = Math.PI / 4; r.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d)); return r; };

// --- Gövde: duvar + kapı + pencereler + çatı ---------------------------------
// opts: w d h wall roof roofH roofType(gable|shed|hip|flat|dome) door shutters windows(liste x) side(yan pencere) chimney trim
export function body(o) {
  const { w = 0.72, d = 0.56, h = 0.5, wall = C.cream, roof = 0xD9743A, roofH = 0.34, roofType = 'gable', door = C.wood, shutters = null, chimney = null, trim = null } = o;
  const g = new THREE.Group();
  g.add(box(w, h, d, wall, 0, h / 2, 0));
  if (trim) g.add(box(w + 0.02, 0.04, d + 0.02, trim, 0, 0.02, 0), box(w + 0.02, 0.03, d + 0.02, trim, 0, h - 0.015, 0));
  g.add(box(0.15, 0.27, 0.03, door, o.doorX || 0, 0.135, d / 2 + 0.006));
  g.add(sph(0.012, C.honey, (o.doorX || 0) + 0.05, 0.14, d / 2 + 0.025, 5));
  const wins = o.windows || [-w * 0.3, w * 0.3];
  for (const x of wins) {
    g.add(box(0.13, 0.13, 0.03, VM.glass, x, h * 0.62, d / 2 + 0.006), box(0.15, 0.015, 0.035, C.white, x, h * 0.62 - 0.07, d / 2 + 0.01));
    if (shutters) g.add(box(0.045, 0.14, 0.02, shutters, x - 0.095, h * 0.62, d / 2 + 0.012), box(0.045, 0.14, 0.02, shutters, x + 0.095, h * 0.62, d / 2 + 0.012));
  }
  if (o.side !== false) g.add(box(0.03, 0.12, 0.12, VM.glass, w / 2 + 0.005, h * 0.6, -0.05)); // yan pencere (gece yanar)
  let r;
  if (roofType === 'gable') { r = gable(w, d, roofH, roof); r.position.y = h; }
  else if (roofType === 'shed') { r = shed(w, d, roofH, roof); r.position.y = h; }
  else if (roofType === 'hip') { r = hip(w, d, roofH, roof); r.position.y = h; }
  else if (roofType === 'dome') { r = sph(Math.max(w, d) * 0.55, roof, 0, h, 0, 12); r.scale.y = 0.6; }
  else r = box(w + 0.08, 0.06, d + 0.08, roof, 0, h + 0.03, 0);
  g.add(r);
  r.userData.seasonalRoof = true;
  if (chimney) g.add(box(0.09, 0.24, 0.09, chimney, w * 0.24, h + roofH * 0.55, -d * 0.18));
  g.userData.h = h; g.userData.top = h + (roofType === 'flat' ? 0.06 : roofH); g.userData.w = w; g.userData.d = d;
  return g;
}

// --- Ek yapılar (evin biçimini değiştirir) --------------------------------------
const glassM = () => mat(0xCFEBEF, { transparent: true, opacity: 0.5, roughness: 0.15 });
export function greenhouse(w = 0.3, d = 0.32, plants = true) {
  const g = new THREE.Group();
  g.add(box(w, 0.25, d, glassM(), 0, 0.125, 0)); const r = gable(w, d, 0.13, glassM()); r.position.y = 0.25; g.add(r);
  for (const [x, z] of [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]]) g.add(box(0.014, 0.25, 0.014, C.white, x, 0.125, z));
  if (plants) { g.add(box(w - 0.04, 0.05, 0.1, C.wood, 0, 0.06, d / 4)); for (let i = 0; i < 5; i++) g.add(sph(0.028, i % 2 ? C.leafL : C.leaf, -w / 2 + 0.05 + i * (w - 0.1) / 4, 0.1, d / 4, 5)); }
  g.add(sph(0.025, VM.lamp, 0, 0.21, 0, 8));
  return g;
}
export function veranda(w, d = 0.16, roof = C.woodD, post = C.white) {
  const g = new THREE.Group();
  g.add(box(w, 0.03, d, C.woodL, 0, 0.015, 0));
  for (const x of [-w / 2 + 0.02, w / 2 - 0.02]) g.add(box(0.025, 0.3, 0.025, post, x, 0.16, d / 2 - 0.02));
  const r = box(w + 0.04, 0.025, d + 0.04, roof, 0, 0.32, 0); r.rotation.x = 0.18; g.add(r);
  g.add(box(w - 0.04, 0.012, 0.012, post, 0, 0.1, d / 2 - 0.02));
  return g;
}
export function balcony(w, c = C.white) {
  return grp(box(w, 0.025, 0.12, C.woodL, 0, 0, 0.06), box(w, 0.07, 0.01, c, 0, 0.045, 0.12), box(0.01, 0.07, 0.12, c, -w / 2, 0.045, 0.06), box(0.01, 0.07, 0.12, c, w / 2, 0.045, 0.06));
}
export function tower(r = 0.13, h = 0.75, wall = C.stone, roof = 0x5A6470) {
  return grp(cyl(r, r * 1.08, h, wall, 0, h / 2, 0, 10), cone(r * 1.3, 0.24, roof, 0, h + 0.12, 0, 10), box(0.06, 0.08, 0.02, VM.glass, 0, h * 0.72, r + 0.005));
}
export function lean(w = 0.3, d = 0.3, h = 0.3, wall = C.woodL, roof = C.woodD) { // yan sundurma
  const g = new THREE.Group(); g.add(box(w, h, d, wall, 0, h / 2, 0)); const r = shed(w, d, 0.12, roof); r.position.y = h; r.rotation.y = Math.PI; g.add(r); return g;
}
export function dock(len = 0.45) {
  const g = new THREE.Group(); g.add(box(0.16, 0.03, len, C.woodL, 0, 0.05, 0));
  for (const z of [-len / 2 + 0.03, len / 2 - 0.03]) for (const x of [-0.07, 0.07]) g.add(cyl(0.015, 0.015, 0.12, C.woodD, x, 0.02, z, 5));
  return g;
}

// --- Cephe ve bahçe detayları ---------------------------------------------------
export const pot = (c = C.red, x = 0, z = 0) => grp(cyl(0.035, 0.028, 0.05, 0xB9774A, x, 0.025, z, 6), sph(0.035, c, x, 0.07, z, 6));
export function windowBox(x, y, z, cols = [C.red, C.yellow, C.white, C.lilac]) { const g = grp(box(0.16, 0.035, 0.05, C.woodL, x, y, z)); cols.forEach((c, i) => g.add(sph(0.022, c, x - 0.055 + i * 0.037, y + 0.035, z, 6))); return g; }
export function climber(n, spread, cols = [C.red, C.pink, C.white]) { const g = new THREE.Group(); for (let i = 0; i < n; i++) { const x = Math.sin(i * 12.9) * 0.5 * spread, y = (Math.cos(i * 7.3) * 0.5 + 0.5) * spread; g.add(sph(0.028, C.leaf, x + 0.01, y - 0.01, 0, 5), sph(0.02, cols[i % cols.length], x, y, 0.012, 6)); } return g; }
export function ivy(n, w, h) { const g = new THREE.Group(); for (let i = 0; i < n; i++) g.add(sph(0.03 + (i % 3) * 0.01, i % 2 ? C.leaf : C.leafL, (Math.sin(i * 5.1) * 0.5) * w, (Math.cos(i * 3.7) * 0.5 + 0.5) * h, 0, 5)); return g; }
export function awning(w, a, b) {
  const cv = document.createElement('canvas'); cv.width = 64; cv.height = 8; const x = cv.getContext('2d');
  for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? b : a; x.fillRect(i * 8, 0, 8, 8); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = mesh(new THREE.PlaneGeometry(w, 0.24), new THREE.MeshStandardMaterial({ map: t, roughness: 0.8, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 3.2; return m;
}
export function sign(text, size = 0.18, bg = '#FFF6E0', fg = '#4A3A22') {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 128; const x = cv.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, 128, 128); x.strokeStyle = fg; x.lineWidth = 8; x.strokeRect(4, 4, 120, 120);
  x.font = '76px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 64, 70);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const face = new THREE.MeshStandardMaterial({ map: t, roughness: 0.7 });
  return mesh(new THREE.BoxGeometry(size, size, 0.025), [mat(C.wood), mat(C.wood), mat(C.wood), mat(C.wood), face, mat(C.wood)]);
}
export function hangSign(text, x, y, z, ry = 0, bg) { // kola asılı tabela + fener
  const g = new THREE.Group(); g.add(box(0.14, 0.012, 0.012, C.iron, 0, 0.09, 0)); const s = sign(text, 0.13, bg); s.position.set(0.03, 0, 0); g.add(s);
  g.add(box(0.045, 0.055, 0.045, VM.lamp, -0.07, 0.03, 0), cone(0.035, 0.03, C.iron, -0.07, 0.07, 0, 4)); g.position.set(x, y, z); g.rotation.y = ry; return g;
}
export function lamppost(x, z) { return grp(cyl(0.012, 0.016, 0.34, C.iron, x, 0.17, z, 5), box(0.055, 0.065, 0.055, VM.lamp, x, 0.37, z), cone(0.045, 0.035, C.iron, x, 0.42, z, 4)); }
export function fence(len, c = C.white) { const g = new THREE.Group(); const n = Math.round(len / 0.09); for (let i = 0; i <= n; i++) g.add(box(0.018, 0.11, 0.018, c, -len / 2 + i * (len / n), 0.055, 0)); g.add(box(len, 0.015, 0.01, c, 0, 0.085, 0), box(len, 0.015, 0.01, c, 0, 0.04, 0)); return g; }
export function bench(c = C.wood) { return grp(box(0.26, 0.025, 0.09, c, 0, 0.09, 0), box(0.26, 0.08, 0.018, c, 0, 0.14, -0.04), box(0.018, 0.09, 0.07, C.iron, -0.11, 0.045, 0), box(0.018, 0.09, 0.07, C.iron, 0.11, 0.045, 0)); }
export function crate(fr = [C.red, C.orange, C.leafL], x = 0, z = 0) { const g = grp(box(0.11, 0.06, 0.09, C.woodL, x, 0.03, z)); fr.forEach((f, i) => g.add(sph(0.022, f, x - 0.03 + i * 0.03, 0.07, z, 6))); return g; }
export function tree(s = 0.7, leaf = C.leaf, blossom = null) { const g = grp(cyl(0.04, 0.06, 0.34, C.trunk, 0, 0.17, 0, 6), mesh(new THREE.IcosahedronGeometry(0.28, 0), leaf, 0, 0.52, 0), mesh(new THREE.IcosahedronGeometry(0.18, 0), blossom || C.leafL, 0.13, 0.44, 0.07)); g.scale.setScalar(s); return g; }
export function cat(c = 0xE8A55A) { const m = mat(c); const b = sph(0.04, m, 0, 0.035, 0, 8); b.scale.set(1.3, 0.9, 1); return grp(b, sph(0.03, m, 0.05, 0.068, 0, 8), cone(0.011, 0.022, m, 0.055, 0.095, 0.013, 4), cone(0.011, 0.022, m, 0.055, 0.095, -0.013, 4)); }

// --- Animasyonlar -----------------------------------------------------------------
export function smoke(x, y, z) {
  const g = new THREE.Group(); g.position.set(x, y, z); const ps = [];
  for (let i = 0; i < 4; i++) { const p = sph(0.045, new THREE.MeshStandardMaterial({ color: 0xEDEDED, transparent: true, opacity: 0.7 }), 0, 0, 0, 6); p.castShadow = false; ps.push(p); g.add(p); }
  g.userData.animate = (t) => ps.forEach((p, i) => { const k = (t * 0.35 + i / 4) % 1; p.position.set(Math.sin(k * 5 + i) * 0.035, k * 0.4, 0); p.scale.setScalar(0.6 + k * 1.2); p.material.opacity = 0.7 * (1 - k); });
  return g;
}
export function butterflies(cx, cy, cz, cols = [C.pink, C.teal]) {
  const g = new THREE.Group(); const fs = cols.map((c) => { const f = grp(box(0.03, 0.002, 0.02, c, -0.016, 0, 0), box(0.03, 0.002, 0.02, c, 0.016, 0, 0)); g.add(f); return f; });
  g.userData.animate = (t) => fs.forEach((f, i) => { f.position.set(cx + Math.sin(t * 0.7 + i * 2) * 0.1, cy + Math.sin(t * 2 + i) * 0.05, cz + Math.cos(t * 0.6 + i) * 0.06); f.children[0].rotation.z = Math.sin(t * 18) * 0.8; f.children[1].rotation.z = -Math.sin(t * 18) * 0.8; });
  return g;
}
export function flag(x, y, z, c = C.red) { const p = grp(cyl(0.008, 0.008, 0.5, C.white, x, y + 0.25, z, 5)); const f = box(0.14, 0.09, 0.005, c, x + 0.07, y + 0.45, z); p.add(f); p.userData.animate = (t) => { f.rotation.y = Math.sin(t * 3) * 0.25; }; return p; }
export function birds(cx, cy, cz) { const g = new THREE.Group(); const bs = [0, 1].map(() => { const b = grp(box(0.04, 0.004, 0.012, C.ink, -0.018, 0, 0), box(0.04, 0.004, 0.012, C.ink, 0.018, 0, 0)); g.add(b); return b; }); g.userData.animate = (t) => bs.forEach((b, i) => { const a = t * 0.8 + i * 3; b.position.set(cx + Math.cos(a) * 0.3, cy + i * 0.06, cz + Math.sin(a) * 0.3); b.rotation.y = -a; b.children[0].rotation.z = Math.sin(t * 10) * 0.5; b.children[1].rotation.z = -Math.sin(t * 10) * 0.5; }); return g; }

// --- İsim etiketi (üstte ad, altta tür) -------------------------------------------
const KIND = { koylu: 'Ev', dukkan: 'Dükkân', bina: 'Bina' };
export function nameLabel(title, type) {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 160; const x = cv.getContext('2d');
  x.font = '800 54px Nunito, "Segoe UI", sans-serif'; const tw = Math.min(480, x.measureText(title).width + 60);
  const bx = (512 - tw) / 2; x.fillStyle = 'rgba(255,251,241,0.95)'; x.strokeStyle = 'rgba(107,74,43,0.35)'; x.lineWidth = 4;
  x.beginPath(); x.roundRect(bx, 8, tw, 130, 30); x.fill(); x.stroke();
  x.fillStyle = '#4A3A22'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(title, 256, 58, 450);
  x.font = '700 34px Nunito, "Segoe UI", sans-serif'; x.fillStyle = '#9A8466'; x.fillText(KIND[type] || '', 256, 108);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  sp.scale.set(1.18, 0.37, 1); sp.renderOrder = 10; sp.userData.isLabel = true; return sp;
}
