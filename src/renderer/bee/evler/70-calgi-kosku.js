// 70 · Çalgı Köşkü (Bina)
// meydanda sekizgen müzik köşkü, kubbe çatı, fener dizisi, içinde davul ve zurna, uçuşan notalar
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, cone, grp, C } from './kit.js';

export default () => { const g = new THREE.Group();
  g.add(cyl(0.44, 0.46, 0.08, C.stone, 0, 0.04, 0, 8), cyl(0.42, 0.42, 0.02, C.woodL, 0, 0.09, 0, 8));
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; g.add(cyl(0.02, 0.02, 0.46, C.white, Math.cos(a) * 0.38, 0.32, Math.sin(a) * 0.38, 6)); if (i % 2 === 0) g.add(sph(0.026, VM.lamp, Math.cos(a) * 0.4, 0.5, Math.sin(a) * 0.4, 6)); }
  g.add(cyl(0.46, 0.46, 0.04, C.white, 0, 0.56, 0, 8), cone(0.5, 0.3, 0x6FA35E, 0, 0.73, 0, 8), sph(0.04, C.honey, 0, 0.9, 0, 6));
  g.add(cyl(0.07, 0.07, 0.09, 0xC94A3A, -0.08, 0.145, 0.04, 10), cyl(0.072, 0.072, 0.01, C.white, -0.08, 0.19, 0.04, 10));
  const zurna = cone(0.03, 0.18, C.woodL, 0.1, 0.2, -0.04, 8); zurna.rotation.z = 1.2; g.add(zurna);
  const notes = [0, 1, 2].map(() => { const n = grp(sph(0.018, C.ink, 0, 0, 0, 6), box(0.005, 0.05, 0.005, C.ink, 0.015, 0.025, 0)); g.add(n); return n; });
  g.userData.animate = (t) => notes.forEach((n, i) => { const k = (t * 0.3 + i / 3) % 1; n.position.set(Math.sin(k * 6 + i) * 0.3, 0.3 + k * 0.8, Math.cos(k * 5 + i) * 0.3); n.visible = k < 0.9; });
  return g; };
