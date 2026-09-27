// Kovan v2: sehpa + uçuş tahtası + seviyeyle artan katlar + beşik çatı; renk arı ırkına göre, kraliçe yükseltilince taç işareti
import * as THREE from '../vendor/three.module.min.js';
import { box, cyl, sph, grp, gable, mat, C } from '../evler/kit.js';

// Irk renkleri: [gövde, açık kat, koyu şerit]
const BREED = { anadolu: [0xEBC983, 0xF4DCA6, 0xC99A55], kafkas: [0xB9C6D2, 0xD6DEE6, 0x8E9DAD], italyan: [0xE0A07A, 0xEEC0A0, 0xB9774A] };

export function makeHiveV2(h = {}) {
  const [body, light, dark] = BREED[h.breed] || BREED.anadolu;
  const g = new THREE.Group();
  // Sehpa: dört ayak + çıta
  for (const [x, z] of [[-0.28, -0.28], [0.28, -0.28], [-0.28, 0.28], [0.28, 0.28]]) g.add(box(0.05, 0.12, 0.05, C.woodD, x, 0.06, z));
  g.add(box(0.72, 0.04, 0.72, C.wood, 0, 0.13, 0));
  // Uçuş tahtası (ön tarafta eğimli)
  const land = box(0.44, 0.02, 0.16, C.woodL, 0, 0.15, 0.4); land.rotation.x = 0.25; g.add(land);
  // Katlar: taban kutusu + seviyeye göre ek katlar (en fazla 4 ek)
  const floors = 1 + Math.min(4, h.level || 0);
  let y = 0.15;
  for (let i = 0; i < floors; i++) {
    const hgt = i === 0 ? 0.24 : 0.16;
    g.add(box(0.62, hgt, 0.62, i % 2 ? light : body, 0, y + hgt / 2, 0));
    g.add(box(0.64, 0.02, 0.64, dark, 0, y + hgt - 0.01, 0));                 // kat arası şerit
    g.add(box(0.1, 0.03, 0.02, dark, 0, y + hgt * 0.6, 0.315));              // tutamak
    y += hgt;
  }
  // Giriş aralığı
  g.add(box(0.26, 0.04, 0.02, 0x3A2A1A, 0, 0.19, 0.312));
  // Çatı: kapak + metal kaplı beşik çatı
  g.add(box(0.7, 0.04, 0.7, dark, 0, y + 0.02, 0));
  const roof = gable(0.62, 0.62, 0.14, mat(0xA9B4BE, { roughness: 0.45, metalness: 0.3 }), 0.05); roof.position.y = y + 0.04; g.add(roof);
  // Kraliçe işareti (ön yüzde taç)
  if ((h.queens || 0) > 0) {
    const crown = grp(box(0.1, 0.04, 0.012, C.honey, 0, 0, 0), ...[-0.035, 0, 0.035].map((x) => box(0.02, 0.035, 0.012, C.honey, x, 0.03, 0)), ...[-0.035, 0, 0.035].map((x) => sph(0.009, 0xE0626A, x, 0.05, 0.004, 5)));
    crown.position.set(0, 0.15 + 0.24 * 0.55, 0.316); g.add(crown);
  }
  // Uçuş tahtasında dinlenen iki arı
  for (const x of [-0.08, 0.1]) { const b = sph(0.022, 0xF4C441, x, 0.19, 0.42, 6); b.scale.set(1.4, 0.9, 1); g.add(b); }
  g.userData.top = y + 0.18;
  return g;
}
