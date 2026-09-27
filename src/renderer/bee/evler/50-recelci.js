// 50 · Reçelci (Dükkân)
// kırmızı kareli perdeli dükkân, vitrinde reçel kavanozları, bahçede kaynayan kazan, çilek sepetleri
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, box, cyl, sph, cone, grp, at, C, body, hangSign, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.7, wall: 0xFFF1E6, roof: 0xC94A3A, shutters: 0xE0626A, windows: [0.22] }); at(b, -0.1, 0, -0.14); g.add(b);
  g.add(box(0.26, 0.2, 0.03, VM.glass, -0.28, 0.2, 0.145), hangSign('🍓', 0.28, 0.5, 0.12, -Math.PI / 2 + 0.3, '#FDE8EE'));
  const shelf = grp(box(0.3, 0.02, 0.06, C.woodL, 0, 0.14, 0)); [0xC94A3A, 0x9C4AA0, 0xF2A33D, 0xE0626A, 0x7A2E3A].forEach((c, i) => shelf.add(cyl(0.022, 0.022, 0.05, mat(c, { transparent: true, opacity: 0.9 }), -0.12 + i * 0.06, 0.175, 0, 8), cyl(0.024, 0.024, 0.01, C.white, -0.12 + i * 0.06, 0.205, 0, 8))); at(shelf, -0.28, 0, 0.19); g.add(shelf);
  const kz = grp(cyl(0.08, 0.07, 0.08, 0xC9763A, 0, 0.12, 0, 10), cyl(0.075, 0.075, 0.005, 0xB02A3A, 0, 0.16, 0, 10), cone(0.04, 0.06, VM.lamp, 0, 0.04, 0, 6)); at(kz, 0.3, 0, 0.3); g.add(kz, smoke(0.3, 0.2, 0.3));
  [[-0.1, 0.38], [0.04, 0.4]].forEach(([x, z]) => { const bs = grp(cyl(0.05, 0.04, 0.05, 0xC9A06A, 0, 0.025, 0, 8)); for (let i = 0; i < 4; i++) bs.add(sph(0.018, C.red, -0.02 + (i % 2) * 0.03, 0.055, -0.015 + Math.floor(i / 2) * 0.03, 5)); at(bs, x, 0, z); g.add(bs); });
  return g; };
