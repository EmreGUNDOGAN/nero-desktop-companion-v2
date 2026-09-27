// 35 · Aşçı Fatma (Ev)
// geniş çatılı ev, bahçede odun ateşinde büyük kazan (buhar), uzun sofra, bakır tencereler asılı
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, cone, grp, at, C, body, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.66, wall: 0xFFF1DA, roof: 0xD9743A, chimney: C.brick, shutters: 0xB95A42 }); at(b, -0.14, 0, -0.16); g.add(b);
  const fire = cone(0.05, 0.08, VM.lamp, 0, 0.04, 0, 6); const kz = grp(cyl(0.1, 0.08, 0.1, 0x3A3A3A, 0, 0.12, 0, 10), cyl(0.1, 0.1, 0.005, 0xC9763A, 0, 0.17, 0, 10), fire); for (let i = 0; i < 3; i++) { const l = cyl(0.015, 0.015, 0.14, C.trunk, 0, 0.02, 0, 5); l.rotation.set(Math.PI / 2, 0, (i / 3) * Math.PI); kz.add(l); } at(kz, 0.3, 0, 0.26); g.add(kz, smoke(0.3, 0.2, 0.26));
  g.add(at(grp(box(0.4, 0.02, 0.12, C.woodL, 0, 0.14, 0), box(0.018, 0.14, 0.018, C.woodD, -0.17, 0.07, 0), box(0.018, 0.14, 0.018, C.woodD, 0.17, 0.07, 0), cyl(0.03, 0.03, 0.03, C.white, -0.1, 0.165, 0, 8), cyl(0.03, 0.03, 0.03, C.white, 0.05, 0.165, 0, 8)), -0.2, 0, 0.38));
  [0.0, 0.08, 0.16].forEach((x) => g.add(cyl(0.028, 0.025, 0.03, 0xC9763A, -0.36 + x, 0.3, 0.155, 8)));
  g.userData.animate = (t) => { fire.scale.y = 1 + Math.sin(t * 11) * 0.3; };
  return g; };
