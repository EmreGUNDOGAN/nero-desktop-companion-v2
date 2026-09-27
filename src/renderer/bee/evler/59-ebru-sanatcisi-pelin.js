// 59 · Ebru Sanatçısı Pelin (Ev)
// rengârenk desenli kapılı ev, ebru teknesi masası, kurumaya asılmış ebru kâğıtları
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, grp, at, C, body } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.62, wall: 0xF6F1E7, roof: 0x3F7FBF, door: 0xE0626A, shutters: 0xF2C94C }); at(b, -0.16, 0, -0.14); g.add(b);
  [[0x3F7FBF, -0.03, 0.2], [C.yellow, 0.03, 0.26], [C.leafL, 0.02, 0.1], [C.pink, -0.03, 0.14]].forEach(([c, x, y]) => g.add(sph(0.022, c, -0.16 + x, y, 0.16, 6)));
  const tub = grp(box(0.22, 0.03, 0.14, C.woodL, 0, 0.14, 0), box(0.2, 0.01, 0.12, 0xBFE6F2, 0, 0.16, 0), box(0.015, 0.14, 0.015, C.woodD, -0.09, 0.07, 0), box(0.015, 0.14, 0.015, C.woodD, 0.09, 0.07, 0)); [C.red, C.blue, C.yellow].forEach((c, i) => tub.add(cyl(0.02, 0.02, 0.003, c, -0.05 + i * 0.05, 0.167, (i % 2) * 0.03, 8))); at(tub, 0.28, 0, 0.3); g.add(tub);
  g.add(cyl(0.01, 0.01, 0.34, C.wood, -0.42, 0.17, 0.36, 5), cyl(0.01, 0.01, 0.34, C.wood, 0.02, 0.17, 0.36, 5)); const ln = cyl(0.003, 0.003, 0.44, C.ink, -0.2, 0.32, 0.36, 3); ln.rotation.z = Math.PI / 2; g.add(ln);
  const papers = [[0xE893A8, -0.34], [0x6FA3D9, -0.2], [0xF2C94C, -0.06]].map(([c, x]) => { const p = box(0.1, 0.12, 0.004, c, x, 0.25, 0.36); g.add(p); return p; });
  g.userData.animate = (t) => papers.forEach((p, i) => { p.rotation.x = Math.sin(t * 1.8 + i) * 0.15; });
  return g; };
