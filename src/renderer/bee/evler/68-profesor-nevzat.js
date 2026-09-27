// 68 · Profesör Nevzat (Ev)
// koyu ahşap çerçeveli bilge evi, taş temel, kütüphane cumbası, bahçede antik sütun parçaları, güneş saati
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, grp, at, C, body, smoke } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.66, h: 0.62, wall: 0xEDE4D0, roof: 0x5A4A3A, shutters: 0x5A4A3A, trim: C.stoneD, chimney: C.stoneD }); at(b, -0.14, 0, -0.14); g.add(b);
  for (const x of [-0.46, -0.14, 0.18]) g.add(box(0.03, 0.62, 0.03, C.woodD, x, 0.31, 0.155)); g.add(box(0.66, 0.03, 0.03, C.woodD, -0.14, 0.4, 0.155));
  g.add(cyl(0.05, 0.05, 0.22, C.white, 0.3, 0.11, 0.3, 8), cyl(0.05, 0.05, 0.12, C.white, 0.42, 0.06, 0.2, 8), cyl(0.05, 0.05, 0.16, C.white, 0.38, 0.03, 0.4, 8).rotateZ(Math.PI / 2), box(0.14, 0.04, 0.14, C.white, 0.3, 0.24, 0.3));
  const sd = grp(cyl(0.08, 0.1, 0.12, C.stone, 0, 0.06, 0, 10), cyl(0.09, 0.09, 0.01, C.honey, 0, 0.125, 0, 12), box(0.005, 0.06, 0.06, C.ink, 0, 0.16, 0)); at(sd, -0.2, 0, 0.36); g.add(sd, smoke(0.02, 1.0, -0.26));
  return g; };
