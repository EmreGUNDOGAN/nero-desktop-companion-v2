// 27 · Bahçıvan Zehra (Ev)
// sarmaşık çatılı ev, geniş sera, sebze tarhı, korkuluk, sulama bidonu
import * as THREE from '../vendor/three.module.min.js';
import { VM } from '../village.js';
import { box, cyl, sph, cone, grp, at, C, body, greenhouse, ivy, butterflies } from './kit.js';

export default () => { const g = new THREE.Group();
  const b = body({ w: 0.56, wall: 0xFFF6E6, roof: 0x7A8A5A, windows: [0.12] }); at(b, -0.22, 0, -0.16); g.add(b);
  g.add(at(ivy(14, 0.5, 0.18), -0.22, 0.58, -0.02));
  g.add(at(greenhouse(0.34, 0.4), 0.3, 0, -0.08));
  const bed = grp(box(0.36, 0.03, 0.18, 0x6B4428, 0, 0.015, 0)); for (let i = 0; i < 8; i++) bed.add(sph(0.028, i % 3 ? C.leafL : C.orange, -0.14 + (i % 4) * 0.09, 0.045, i < 4 ? -0.04 : 0.04, 5)); at(bed, -0.18, 0, 0.36); g.add(bed);
  const sc = grp(box(0.012, 0.3, 0.012, C.wood, 0, 0.15, 0), box(0.18, 0.012, 0.012, C.wood, 0, 0.24, 0), box(0.07, 0.09, 0.04, 0x3F7FBF, 0, 0.21, 0), sph(0.03, 0xE8C86A, 0, 0.29, 0, 6), cone(0.05, 0.03, 0xC9A96A, 0, 0.32, 0, 8)); at(sc, 0.12, 0, 0.36); g.add(sc);
  g.add(at(grp(cyl(0.035, 0.04, 0.06, 0x7FB3A8, 0, 0.03, 0, 10)), 0.3, 0, 0.36), butterflies(0.1, 0.4, 0.3, [C.yellow, C.white]));
  g.userData.animate = (t) => { sc.rotation.z = Math.sin(t * 1.2) * 0.04; };
  return g; };
