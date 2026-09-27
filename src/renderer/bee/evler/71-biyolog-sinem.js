// 71 · Biyolog Sinem (Ev)
// laboratuvar evi: camlı gözlem kovanı (içinde arılar), mikroskop masası, not panosu, arı otelleri
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { mat, box, cyl, sph, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: C.white, roof: 0x3F9A8A, windows: [-0.16], trim: 0x3F9A8A }); at(b, -0.16, 0, -0.14); g.add(b);
  const obs = grp(box(0.2, 0.26, 0.06, mat(0xCFEBEF, { transparent: true, opacity: 0.5 }), 0, 0.2, 0), box(0.22, 0.02, 0.08, C.woodL, 0, 0.34, 0), box(0.22, 0.06, 0.08, C.woodL, 0, 0.04, 0), box(0.16, 0.2, 0.01, 0xF2D26A, 0, 0.2, 0)); const bs = [0, 1, 2, 3].map((i) => { const bb = sph(0.012, C.ink, 0, 0, 0.03, 4); obs.add(bb); return bb; }); at(obs, 0.3, 0, 0.18); g.add(obs);
  g.add(at(grp(box(0.2, 0.02, 0.12, C.white, 0, 0.14, 0), box(0.015, 0.14, 0.015, C.iron, -0.08, 0.07, 0), box(0.015, 0.14, 0.015, C.iron, 0.08, 0.07, 0), cyl(0.012, 0.018, 0.08, 0x3A3A3A, 0, 0.19, 0, 6), cyl(0.02, 0.02, 0.01, 0x3A3A3A, 0, 0.155, 0, 8)), -0.16, 0, 0.36));
  g.add(at(grp(box(0.12, 0.16, 0.06, C.woodL, 0, 0.2, 0), box(0.01, 0.12, 0.01, C.wood, 0, 0.06, 0), ...[0, 1, 2, 3, 4, 5].map((i) => cyl(0.012, 0.012, 0.05, 0x8A5A34, -0.03 + (i % 3) * 0.03, 0.16 + Math.floor(i / 3) * 0.05, 0.02, 6).rotateX(Math.PI / 2))), -0.44, 0, 0.3));
  g.userData.animate = (t) => bs.forEach((bb, i) => { bb.position.x = Math.sin(t * 1.5 + i * 2) * 0.07; bb.position.y = 0.2 + Math.cos(t * 1.2 + i) * 0.08; });
  return g; };
