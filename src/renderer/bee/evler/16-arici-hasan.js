// 16 · Arıcı Hasan (Ev)
// ahşap kulübe, sazdan çatı, bahçede eski renkli kovanlar, arıcı peçesi asılı, uçan arılar
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, box, cyl, sph, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.6, wall: C.woodL, roof: 0xC9A96A, roofH: 0.38, windows: [0.14], shutters: C.woodD }); at(b, -0.18, 0, -0.16); g.add(b);
  [[0x9CC3E0, 0.18, 0.22], [0xE8C86A, 0.36, 0.14], [0xE893A8, 0.3, 0.36]].forEach(([c, x, z]) => g.add(at(grp(box(0.12, 0.13, 0.12, c, 0, 0.065, 0), box(0.14, 0.02, 0.14, C.white, 0, 0.14, 0), box(0.06, 0.01, 0.005, C.ink, 0, 0.03, 0.061)), x, 0, z)));
  g.add(at(grp(cyl(0.05, 0.05, 0.015, 0xE8DCC0, 0, 0, 0, 10), cyl(0.045, 0.06, 0.09, mat(0xEDEDED, { transparent: true, opacity: 0.6 }), 0, -0.05, 0, 10)), -0.44, 0.34, 0.14));
  g.add(cyl(0.008, 0.008, 0.36, C.wood, -0.44, 0.18, 0.14, 4));
  const bs = []; for (let i = 0; i < 4; i++) { const bb = sph(0.016, C.honey, 0, 0, 0, 5); bs.push(bb); g.add(bb); }
  g.userData.animate = (t) => bs.forEach((bb, i) => { const a = t * 1.8 + i * 1.6; bb.position.set(0.28 + Math.cos(a) * 0.14, 0.22 + Math.sin(a * 2) * 0.05, 0.24 + Math.sin(a) * 0.12); });
  return g; };
