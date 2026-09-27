// 72 · Kerim Dede ve Kedileri (Ev)
// eski ahşap ev, her yerde yedi kedi (çatıda, pencerede, basamakta), süt kaseleri, kedi evi
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, gable, body, cat, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.64, wall: 0xE8D8BC, roof: 0x8A6F5A, shutters: 0x6F7F4F, chimney: C.brick }); at(b, -0.14, 0, -0.14); g.add(b);
  const cats = [[0xE8A55A, -0.3, 0.02, 0.26, 0.4], [0x3A3A3A, 0.1, 0.02, 0.3, -0.6], [C.white, 0.3, 0.02, 0.2, 2.2], [0xB0B0B0, -0.14, 0.86, -0.14, 1.2], [0xE8A55A, 0.34, 0.02, 0.4, 0.9], [0x8A6F5A, -0.44, 0.02, 0.36, 2.8], [0x3A3A3A, -0.3, 0.3, 0.17, 0.2]].map(([c, x, y, z, r]) => { const k = cat(c); at(k, x, y, z, r); g.add(k); return k; });
  g.add(cyl(0.035, 0.028, 0.02, C.white, 0.18, 0.01, 0.36, 8), cyl(0.03, 0.03, 0.005, 0xFFFBF4, 0.18, 0.02, 0.36, 8), cyl(0.035, 0.028, 0.02, C.white, -0.08, 0.01, 0.4, 8));
  g.add(at(grp(box(0.14, 0.1, 0.12, 0xC94A3A, 0, 0.05, 0), at(gable(0.14, 0.12, 0.06, 0x8A6F5A), 0, 0.1, 0), cyl(0.03, 0.03, 0.01, 0x3A2A1A, 0, 0.05, 0.061, 8).rotateX(Math.PI / 2)), 0.38, 0, -0.1), smoke(0.02, 0.95, -0.25));
  g.userData.animate = (t) => cats.forEach((k, i) => { k.children[1].rotation.y = Math.sin(t * 0.8 + i) * 0.4; });
  return g; };
